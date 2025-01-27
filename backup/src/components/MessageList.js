import React from 'react';
import './MessageList.css';

const MessageList = ({ messages }) => {
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric',
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="messages">
      {messages.map((msg, index) => (
        <div 
          key={index} 
          className={`message-container ${msg.from === process.env.REACT_APP_TWILIO_PHONE ? 'received' : 'sent'}`}
        >
          <div className="message">
            <div className="message-content">{msg.message}</div>
            <div className="message-meta">
              <span className="timestamp">{formatTime(msg.timestamp)}</span>
              {msg.status && (
                <span className="status">
                  {msg.status === 'delivered' ? '✓✓' : '✓'}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
