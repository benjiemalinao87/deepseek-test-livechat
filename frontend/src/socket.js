import { io } from 'socket.io-client';

// Use the same URL as the webhook
const SOCKET_URL = 'https://cc.automate8.com';
console.log('🔌 Connecting to socket server:', SOCKET_URL);

const socket = io(SOCKET_URL, {
  autoConnect: true,
  transports: ['websocket', 'polling'],
  withCredentials: true,
  path: '/socket.io',
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 20000,
  forceNew: true
});

// Add socket event listeners for debugging
socket.on('connect', () => {
  console.log('✅ Socket connected with ID:', socket.id);
});

socket.on('connect_error', (error) => {
  console.error('❌ Socket connection error:', {
    message: error.message,
    description: error.description,
    type: error.type
  });
});

socket.on('disconnect', (reason) => {
  console.log('🔌 Socket disconnected:', reason);
});

// Debug all incoming events
socket.onAny((eventName, ...args) => {
  console.log('🎯 Socket Event:', {
    event: eventName,
    args: args
  });
});

export { socket };
