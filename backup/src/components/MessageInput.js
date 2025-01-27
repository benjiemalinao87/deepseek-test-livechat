import React from 'react';

const MessageInput = ({ message, setMessage, connected, reconnecting, handleSubmit }) => (
  <form onSubmit={handleSubmit} className="message-input">
    <input
      type="text"
      placeholder={connected ? "Type a message..." : "Connecting to server..."}
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      disabled={!connected || reconnecting}
      style={{ opacity: connected ? 1 : 0.7 }}
    />
    <button 
      type="submit" 
      disabled={!connected || reconnecting || !message.trim()}
      style={{ opacity: connected && message.trim() ? 1 : 0.7 }}
    >
      {!connected ? 'Connecting...' : reconnecting ? 'Reconnecting...' : 'Send'}
    </button>
  </form>
);

export default MessageInput;
