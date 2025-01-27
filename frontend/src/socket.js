import { io } from 'socket.io-client';

const SOCKET_URL = 'https://cc1.automate8.com';

export const socket = io(SOCKET_URL, {
  autoConnect: true,
  transports: ['websocket', 'polling'],
  withCredentials: true,
  path: '/socket.io'
});

// Debug socket connection
socket.on('connect_error', (error) => {
  console.error('Socket connection error:', {
    message: error.message,
    type: error.type,
    description: error.description,
    url: SOCKET_URL
  });
});

socket.on('connect', () => {
  console.log('Socket connected successfully to:', SOCKET_URL);
});

// Listen for incoming messages
socket.on('inbound_message', (message) => {
  console.log('Received inbound message:', message);
});

export default socket;
