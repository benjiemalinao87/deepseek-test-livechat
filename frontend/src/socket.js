import { io } from 'socket.io-client';

const SOCKET_URL = window.REACT_APP_API_URL || process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const socket = io(SOCKET_URL, {
  autoConnect: true,
  transports: ['polling', 'websocket'],
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
  console.log('Socket connected successfully');
});

export default socket;
