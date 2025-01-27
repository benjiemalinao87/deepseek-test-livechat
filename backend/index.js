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
app.post('/twilio', express.urlencoded({ extended: true }), (req, res) => {
  try {
    // Log the entire request for debugging
    console.log('🔍 Webhook Debug:', {
      headers: req.headers,
      rawBody: req.rawBody,
      body: req.body,
      method: req.method,
      url: req.url,
      contentType: req.headers['content-type']
    });
    
    // Ensure we have the body data
    if (!req.body || Object.keys(req.body).length === 0) {
      console.error('❌ Empty request body');
      res.status(400).send('<?xml version="1.0" encoding="UTF-8"?><Response></Response>');
      return;
    }
    
    // Log the specific message data
    console.log('📥 Received webhook from Twilio:', {
      from: req.body.From,
      to: req.body.To,
      body: req.body.Body,
      messageSid: req.body.MessageSid,
      smsStatus: req.body.SmsStatus,
      numMedia: req.body.NumMedia
    });
    
    const messageData = {
      from: req.body.From,
      to: req.body.To,
      message: req.body.Body || '',  // Ensure message is not undefined
      timestamp: new Date().toISOString(),
      direction: 'inbound',
      messageSid: req.body.MessageSid,
      status: req.body.SmsStatus || 'received'
    };
    
    // Validate required fields
    if (!messageData.from || !messageData.message) {
      console.error('❌ Missing required fields:', messageData);
      res.status(400).send('<?xml version="1.0" encoding="UTF-8"?><Response></Response>');
      return;
    }
    
    // Log connected socket clients
    const connectedSockets = Array.from(io.sockets.sockets.keys());
    console.log('🔌 Socket Clients:', {
      count: connectedSockets.length,
      socketIds: connectedSockets,
      namespaces: Object.keys(io.nsps)
    });
    
    // Check if we have any connected clients
    if (connectedSockets.length === 0) {
      console.warn('⚠️ No connected socket clients to broadcast to');
    }
    
    // Broadcast to all connected clients
    console.log('📡 Broadcasting message:', messageData);
    io.emit('new_message', messageData);
    
    // Log successful broadcast
    console.log('✅ Message broadcast complete');

    // Send TwiML response
    const twimlResponse = '<?xml version="1.0" encoding="UTF-8"?><Response></Response>';
    res.set('Content-Type', 'text/xml');
    res.send(twimlResponse);
    
    console.log('📤 Sent TwiML response');
  } catch (error) {
    console.error('❌ Webhook Error:', {
      error: error.message,
      stack: error.stack,
      body: req.body
    });
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