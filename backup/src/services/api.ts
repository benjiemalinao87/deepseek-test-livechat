import axios from 'axios';
import { Message } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const api = {
  sendMessage: async (to: string, message: string): Promise<Message> => {
    try {
      const response = await axios.post(`${API_URL}/send-sms`, {
        to,
        message,
      });
      
      if (response.data.success) {
        return {
          from: process.env.REACT_APP_TWILIO_PHONE || '',
          to,
          message,
          timestamp: new Date(),
          direction: 'outbound',
          messageSid: response.data.messageSid,
          status: 'sent'
        };
      } else {
        throw new Error(response.data.error || 'Failed to send message');
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      throw new Error(error.response?.data?.error || error.message);
    }
  }
};
