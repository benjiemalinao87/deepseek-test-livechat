import React from 'react';

const StatusBar = ({ connected, reconnecting, error }) => (
  <div className="status">
    Status: {connected ? 'Connected' : 'Disconnected'}
    {reconnecting && ' (Reconnecting...)'}
    {error && <div className="error">{error}</div>}
  </div>
);

export default StatusBar;
