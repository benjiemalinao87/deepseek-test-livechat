const express = require('express');
const twilio = require('twilio');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Configure CORS for both Express and Socket.IO
const corsOptions = {
  origin: [
    "https://cc1.automate8.com",  // Frontend
    "http://localhost:3000"       // Local development
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204
};

// Enable CORS for Express
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure Socket.IO with proper CORS
const io = new Server(server, {
  path: '/socket.io',
  cors: {
    origin: [
      "https://cc1.automate8.com",  // Frontend
      "http://localhost:3000"       // Local development
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  },
  transports: ['polling', 'websocket'],
  allowEIO3: true
});

// Twilio client setup
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Track connected users
const users = new Map();

// Socket.io connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('register', (phoneNumber) => {
    users.set(phoneNumber, socket.id);
    console.log(`User ${phoneNumber} registered with socket ${socket.id}`);
    socket.emit('registered', { status: 'success', phoneNumber });
  });

  socket.on('disconnect', () => {
    for (const [phone, sid] of users.entries()) {
      if (sid === socket.id) {
        users.delete(phone);
        console.log(`User ${phone} disconnected`);
        break;
      }
    }
  });
});

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
app.post('/twilio', (req, res) => {
  try {
    // Log the entire request for debugging
    console.log('🔍 Webhook Debug:', {
      headers: req.headers,
      body: req.body,
      method: req.method,
      url: req.url
    });
    
    // Log the specific message data
    console.log('📥 Received webhook from Twilio:', {
      from: req.body.From,
      to: req.body.To,
      body: req.body.Body,
      messageSid: req.body.MessageSid,
      rawBody: req.body
    });
    
    const { From: from, To: to, Body: message, MessageSid: messageSid } = req.body;
    
    // Validate required fields
    if (!from || !message) {
      console.error('❌ Missing required fields:', { from, message });
      res.status(400).send('<Response></Response>');
      return;
    }
    
    const messageData = {
      from,
      to,
      message,
      timestamp: new Date(),
      direction: 'inbound',
      messageSid
    };
    
    // Log connected socket clients
    const connectedSockets = Array.from(io.sockets.sockets.keys());
    console.log('🔌 Socket Clients:', {
      count: connectedSockets.length,
      socketIds: connectedSockets
    });
    
    // Broadcast to all connected clients
    console.log('📡 Broadcasting message:', messageData);
    io.emit('new_message', messageData);
    
    // Log successful broadcast
    console.log('✅ Message broadcast complete');

    // Send TwiML response
    const twimlResponse = '<Response></Response>';
    console.log('📤 Sending TwiML response:', twimlResponse);
    res.type('text/xml');
    res.send(twimlResponse);
  } catch (error) {
    console.error('❌ Webhook Error:', {
      error: error.message,
      stack: error.stack,
      body: req.body
    });
    res.status(500).send('<Response></Response>');
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