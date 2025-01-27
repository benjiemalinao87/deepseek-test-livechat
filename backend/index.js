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

// Store both socket->phone and phone->socket mappings
const socketPhones = new Map(); // socket.id -> Set of phone numbers
const phoneSocket = new Map();  // phone number -> socket.id

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
    
    // Initialize set for this socket if it doesn't exist
    if (!socketPhones.has(socket.id)) {
      socketPhones.set(socket.id, new Set());
    }
    
    // Add phone number to socket's set
    socketPhones.get(socket.id).add(phoneNumber);
    
    // Update phone -> socket mapping
    phoneSocket.set(phoneNumber, socket.id);
    
    console.log('✅ Phone registered:', { 
      phoneNumber, 
      socketId: socket.id,
      totalPhones: phoneSocket.size,
      registeredPhones: Array.from(phoneSocket.keys())
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
      reason,
      time: new Date().toISOString()
    });

    // Clean up registrations for this socket
    if (socketPhones.has(socket.id)) {
      const phones = socketPhones.get(socket.id);
      phones.forEach(phone => {
        phoneSocket.delete(phone);
        console.log('🗑️ Removed registration:', {
          phone,
          socketId: socket.id
        });
      });
      socketPhones.delete(socket.id);
    }

    console.log('📊 Remaining registrations:', {
      sockets: socketPhones.size,
      phones: phoneSocket.size,
      registeredPhones: Array.from(phoneSocket.keys())
    });
  });
});

// Twilio client setup
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

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

    // Log registered phones
    console.log('📊 Registered phones:', {
      phones: Array.from(phoneSocket.entries()),
      messageFrom: messageData.from,
      messageTo: messageData.to
    });

    // Find sockets for both sender and recipient
    const senderSocket = phoneSocket.get(messageData.from);
    const recipientSocket = phoneSocket.get(messageData.to);

    console.log('🎯 Found sockets:', {
      sender: senderSocket,
      recipient: recipientSocket
    });

    let messageDelivered = false;

    // Send to sender socket if found
    if (senderSocket) {
      io.to(senderSocket).emit('new_message', messageData);
      console.log('✅ Sent to sender:', senderSocket);
      messageDelivered = true;
    }

    // Send to recipient socket if found and different from sender
    if (recipientSocket && recipientSocket !== senderSocket) {
      io.to(recipientSocket).emit('new_message', messageData);
      console.log('✅ Sent to recipient:', recipientSocket);
      messageDelivered = true;
    }

    // If message wasn't delivered to any specific socket, broadcast
    if (!messageDelivered) {
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