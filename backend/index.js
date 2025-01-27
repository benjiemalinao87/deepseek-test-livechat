const express = require('express');
const twilio = require('twilio');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Configure CORS
app.use(cors({
  origin: ["https://cc1.automate8.com", "http://localhost:3000"],
  methods: ["GET", "POST", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Socket.IO setup with detailed logging
const io = new Server(server, {
  cors: {
    origin: ["https://cc1.automate8.com", "http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
  },
  path: '/socket.io',
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000
});

// Socket connection handling with debug logs
io.on('connection', (socket) => {
  console.log('🔌 New socket connection:', {
    id: socket.id,
    transport: socket.conn.transport.name,
    time: new Date().toISOString()
  });

  socket.on('register', (phoneNumber) => {
    if (!phoneNumber) {
      console.warn('⚠️ Invalid phone number registration attempt');
      return;
    }

    console.log('📱 Registering phone:', { phoneNumber, socketId: socket.id });
    
    // Store both socket->phone and phone->socket mappings
    socket.phoneNumber = phoneNumber;
    users.set(phoneNumber, socket.id);
    
    console.log('✅ Phone registered:', { 
      phoneNumber, 
      socketId: socket.id,
      totalUsers: users.size,
      registeredPhones: Array.from(users.keys())
    });
    
    socket.emit('registered', { 
      status: 'success', 
      phoneNumber,
      socketId: socket.id 
    });
  });

  socket.on('disconnect', (reason) => {
    console.log('🔌 Socket disconnected:', {
      id: socket.id,
      phone: socket.phoneNumber,
      reason,
      time: new Date().toISOString()
    });

    // Clean up user registration
    if (socket.phoneNumber) {
      users.delete(socket.phoneNumber);
      console.log('🗑️ Removed registration:', {
        phone: socket.phoneNumber,
        remainingUsers: Array.from(users.keys())
      });
    }
  });
});

// Twilio client setup
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Track connected users
const users = new Map();

// Twilio webhook for incoming messages
app.post('/twilio', express.urlencoded({ extended: true }), (req, res) => {
  try {
    console.log('📥 Received webhook from Twilio:', {
      body: req.body,
      timestamp: new Date().toISOString()
    });

    const messageData = {
      from: req.body.From,
      to: req.body.To,
      message: req.body.Body,
      timestamp: new Date().toISOString(),
      direction: 'inbound',
      messageSid: req.body.MessageSid,
      status: req.body.SmsStatus || 'received'
    };

    // Log registered users
    console.log('📊 Registered users:', {
      users: Array.from(users.entries()),
      messageFrom: messageData.from,
      messageTo: messageData.to
    });

    // Find sockets for both sender and recipient
    const senderSocket = users.get(messageData.from);
    const recipientSocket = users.get(messageData.to);

    console.log('🎯 Found sockets:', {
      sender: senderSocket,
      recipient: recipientSocket
    });

    // Send to both sender and recipient sockets if found
    if (senderSocket) {
      io.to(senderSocket).emit('new_message', messageData);
      console.log('✅ Sent to sender:', senderSocket);
    }

    if (recipientSocket) {
      io.to(recipientSocket).emit('new_message', messageData);
      console.log('✅ Sent to recipient:', recipientSocket);
    }

    // If neither socket found, broadcast to all
    if (!senderSocket && !recipientSocket) {
      console.log('⚠️ No specific sockets found, broadcasting');
      io.emit('new_message', messageData);
    }

    res.set('Content-Type', 'text/xml');
    res.send('<?xml version="1.0" encoding="UTF-8"?><Response></Response>');

  } catch (error) {
    console.error('❌ Webhook Error:', error);
    res.status(500).send('<?xml version="1.0" encoding="UTF-8"?><Response></Response>');
  }
});

// Send SMS endpoint
app.post('/send-sms', async (req, res) => {
  try {
    const { to, message } = req.body;
    
    if (!to || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Phone number and message are required' 
      });
    }

    console.log('📤 Sending SMS:', { to, message });

    const result = await client.messages.create({
      body: message,
      to: to,
      from: process.env.TWILIO_PHONE
    });

    console.log('✅ SMS sent:', {
      sid: result.sid,
      status: result.status,
      to: to
    });

    // Prepare outbound message data
    const messageData = {
      from: process.env.TWILIO_PHONE,
      to: to,
      message: message,
      timestamp: new Date().toISOString(),
      direction: 'outbound',
      messageSid: result.sid,
      status: result.status
    };

    // Find the socket ID for the sender
    const senderSocketId = Array.from(io.sockets.sockets.keys())[0];
    if (senderSocketId) {
      io.to(senderSocketId).emit('new_message', messageData);
    }

    res.json({ 
      success: true, 
      messageSid: result.sid,
      status: result.status 
    });

  } catch (error) {
    console.error('❌ SMS Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Message status webhook
app.post('/message-status', (req, res) => {
  const messageSid = req.body.MessageSid;
  const messageStatus = req.body.MessageStatus;

  console.log('Message status update:', {
    messageSid,
    status: messageStatus
  });

  res.sendStatus(200);
});

// Test endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Test endpoint for Twilio webhook
app.post('/test-webhook', (req, res) => {
  console.log('Test webhook received:', req.body);
  
  // Simulate Twilio webhook request to /twilio endpoint
  const testRequest = {
    body: {
      From: '+1234567890',
      Body: 'Test message from webhook'
    }
  };
  
  // Call the Twilio webhook handler
  app.post('/twilio', testRequest, (twilioRes) => {
    console.log('Twilio webhook test response:', twilioRes);
  });
  
  res.json({ status: 'Test webhook processed' });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Twilio webhook URL:', `${process.env.BACKEND_URL || `http://localhost:${PORT}`}/twilio`);
});