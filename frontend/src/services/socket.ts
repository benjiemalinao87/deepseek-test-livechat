import { io, Socket } from 'socket.io-client';
import { Message } from '../types';

const SOCKET_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

class SocketService {
  private socket: Socket | null = null;
  private phoneNumber: string | null = null;

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        transports: ['polling', 'websocket'],
        withCredentials: true,
        path: '/socket.io',
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
        autoConnect: true
      });

      this.setupListeners();
    }
    return this.socket;
  }

  private setupListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Socket connected');
      if (this.phoneNumber) {
        this.register(this.phoneNumber);
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });
  }

  register(phoneNumber: string) {
    if (!this.socket) return;
    this.phoneNumber = phoneNumber;
    this.socket.emit('register', phoneNumber);
  }

  onNewMessage(callback: (message: Message) => void) {
    if (!this.socket) return;
    this.socket.on('new_message', callback);
  }

  onMessageStatus(callback: (update: { messageSid: string; status: string }) => void) {
    if (!this.socket) return;
    this.socket.on('message_status', callback);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = new SocketService();
