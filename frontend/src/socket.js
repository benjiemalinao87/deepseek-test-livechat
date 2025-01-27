import { io } from 'socket.io-client';

const SOCKET_URL = 'wss://cc1.automate8.com';

export const socket = io(SOCKET_URL, {
  autoConnect: true,
  transports: ['websocket'],
  withCredentials: false,
  path: '/socket.io',
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 20000
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

export default socket;
