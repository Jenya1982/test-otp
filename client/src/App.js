import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

  const handleEmailSubmit = async () => {
    await axios.post('http://localhost:3001/api/send-otp', { email: email }); 
  };

  const handleOtpSubmit = async () => {
    const response = await axios.post('http://localhost:3001/api/verify-otp', { email: email, otp: otp });
    alert(response.data.message);
  };

  return (
    <div>
      <input value={email} onChange={e => setEmail(e.target.value)} />
      <button onClick={handleEmailSubmit}>Receive OTP</button>

      <input value={otp} onChange={e => setOtp(e.target.value)} />
      <button onClick={handleOtpSubmit}>Submit</button>
    </div>
  );
}

export default App;
