export interface Message {
  id?: string;
  from: string;
  to: string;
  message: string;
  timestamp: Date;
  direction: 'inbound' | 'outbound';
  messageSid?: string;
  status?: 'sent' | 'delivered' | 'read' | 'failed';
}

export interface ChatUser {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  isNew?: boolean;
  newCount?: number;
  phoneNumber?: string;  // Added for Twilio integration
}

export interface Agent {
  id: string;
  name: string;
  avatar: string;
  status: "available" | "busy" | "offline";
  activeChats: number;
}

export interface TwilioConfig {
  phoneNumber: string;
  apiUrl: string;
}
