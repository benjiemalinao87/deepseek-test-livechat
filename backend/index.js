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
    query: socket.handshake.query,
    time: new Date().toISOString()
  });

  // Debug event for testing socket connection
  socket.emit('connection_test', { status: 'connected', socketId: socket.id });

  socket.on('disconnect', (reason) => {
    console.log('🔌 Socket disconnected:', {
      id: socket.id,
      reason,
      time: new Date().toISOString()
    });
  });

  socket.on('register', (phoneNumber) => {
    users.set(phoneNumber, socket.id);
    console.log(`User ${phoneNumber} registered with socket ${socket.id}`);
    socket.emit('registered', { status: 'success', phoneNumber });
  });
});

// Twilio client setup
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Track connected users
const users = new Map();

// Send SMS endpoint
app.post('/send-sms', async (req, res) => {
  const { to, message } = req.body;
  
  try {
    const result = await client.messages.create({
      body: message,
      to: to,
      from: process.env.TWILIO_PHONE
    });

    console.log('SMS sent successfully:', {
      sid: result.sid,
      status: result.status,
      to: result.to
    });

    // Broadcast the message to all clients
    io.emit('new_message', {
      message,
      from: process.env.TWILIO_PHONE,
      to: to,
      timestamp: new Date(),
      direction: 'outbound',
      status: result.status,
      messageSid: result.sid
    });

    res.json({ success: true, messageSid: result.sid });
  } catch (error) {
    console.error('Error sending SMS:', {
      error: error.message,
      code: error.code,
      moreInfo: error.moreInfo
    });
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

// Twilio webhook for incoming messages
app.post('/twilio', express.urlencoded({ extended: true }), (req, res) => {
  try {
    console.log('📥 Received webhook from Twilio:', {
      body: req.body,
      headers: req.headers,
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

    // Log connected sockets before broadcast
    const connectedSockets = Array.from(io.sockets.sockets.keys());
    console.log('🔌 Active socket connections:', {
      count: connectedSockets.length,
      sockets: connectedSockets
    });

    // Broadcast with acknowledgment
    io.emit('new_message', messageData, (error) => {
      if (error) {
        console.error('❌ Broadcast error:', error);
      } else {
        console.log('✅ Message broadcast successful');
      }
    });

    // Send TwiML response
    const twimlResponse = '<?xml version="1.0" encoding="UTF-8"?><Response></Response>';
    res.set('Content-Type', 'text/xml');
    res.send(twimlResponse);

  } catch (error) {
    console.error('❌ Webhook Error:', error);
    res.status(500).send('<?xml version="1.0" encoding="UTF-8"?><Response></Response>');
  }
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