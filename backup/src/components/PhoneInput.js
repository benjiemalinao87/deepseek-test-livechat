import React from 'react';

const PhoneInput = ({ phoneNumber, setPhoneNumber }) => (
  <div className="phone-input">
    <input
      type="tel"
      placeholder="Enter your phone number (+1234567890)"
      value={phoneNumber}
      onChange={(e) => setPhoneNumber(e.target.value)}
    />
  </div>
);

export default PhoneInput;
