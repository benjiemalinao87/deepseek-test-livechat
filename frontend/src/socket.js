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
  forceNew: true,
  query: {
    client: 'web'
  }
});

// Add socket event listeners for debugging
socket.on('connect', () => {
  console.log('✅ Socket connected with ID:', socket.id);
});

socket.on('connect_error', (error) => {
  console.error('❌ Socket connection error:', error);
});

socket.on('disconnect', (reason) => {
  console.log('❌ Socket disconnected:', reason);
});

socket.on('reconnect', (attemptNumber) => {
  console.log('🔄 Socket reconnected after', attemptNumber, 'attempts');
});

socket.on('reconnect_error', (error) => {
  console.error('❌ Socket reconnection error:', error);
});

socket.on('error', (error) => {
  console.error('❌ Socket error:', error);
});

// Debug all incoming events
// socket.onAny((eventName, ...args) => {
//   console.log('🎯 Socket Event:', {
//     event: eventName,
//     args: args
//   });
// });

export { socket };
