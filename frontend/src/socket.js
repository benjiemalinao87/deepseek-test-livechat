import { io } from 'socket.io-client';

const SOCKET_URL = 'https://cc.automate8.com';
console.log('Initializing socket connection to:', SOCKET_URL);

export const socket = io(SOCKET_URL, {
  autoConnect: true,
  transports: ['polling', 'websocket'],
  withCredentials: false,
  path: '/socket.io',
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 20000,
  forceNew: true,
  query: {
    client: 'web',
    version: '1.0.0'
  }
});

// Debug socket lifecycle
socket.on('connect', () => {
  console.log('✅ Socket connected:', {
    id: socket.id,
    url: SOCKET_URL,
    connected: socket.connected,
    transport: socket.io.engine.transport.name
  });
});

socket.on('disconnect', (reason) => {
  console.log('❌ Socket disconnected:', {
    reason,
    wasConnected: socket.connected,
    attempts: socket.io.engine.reconnectionAttempts
  });
});

socket.on('connect_error', (error) => {
  console.error('🚫 Socket connection error:', {
    message: error.message,
    type: error.type,
    description: error.description
  });
});

// Debug all incoming events
socket.onAny((eventName, ...args) => {
  console.log('📨 Socket event received:', {
    event: eventName,
    data: args,
    time: new Date().toISOString()
  });
});

// Debug all outgoing events
const emit = socket.emit;
socket.emit = function(...args) {
  console.log('📤 Socket event sent:', {
    event: args[0],
    data: args.slice(1),
    time: new Date().toISOString()
  });
  emit.apply(this, args);
};

export default socket;
