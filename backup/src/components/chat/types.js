export const MessageDirection = {
  INBOUND: 'inbound',
  OUTBOUND: 'outbound'
};

export const MessageStatus = {
  SENT: 'sent',
  DELIVERED: 'delivered',
  READ: 'read',
  FAILED: 'failed'
};

export const AgentStatus = {
  AVAILABLE: 'available',
  BUSY: 'busy',
  OFFLINE: 'offline'
};

export class Message {
  constructor(id, from, to, message, timestamp, direction, messageSid, status) {
    this.id = id;
    this.from = from;
    this.to = to;
    this.message = message;
    this.timestamp = timestamp;
    this.direction = direction;
    this.messageSid = messageSid;
    this.status = status;
  }
}

export class ChatUser {
  constructor(id, name, avatar, lastMessage, time, isNew, newCount, phoneNumber) {
    this.id = id;
    this.name = name;
    this.avatar = avatar;
    this.lastMessage = lastMessage;
    this.time = time;
    this.isNew = isNew;
    this.newCount = newCount;
    this.phoneNumber = phoneNumber;
  }
}

export class Agent {
  constructor(id, name, avatar, status, activeChats) {
    this.id = id;
    this.name = name;
    this.avatar = avatar;
    this.status = status;
    this.activeChats = activeChats;
  }
}
