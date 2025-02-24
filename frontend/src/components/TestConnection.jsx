import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TestConnection = () => {
  const [status, setStatus] = useState('Testing connection...');
  const [error, setError] = useState(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('Testing backend connection...');
        const response = await axios.get('http://localhost:3001/api/test');
        console.log('Response:', response.data);
        setStatus(`Connected! Server response: ${JSON.stringify(response.data)}`);
      } catch (error) {
        console.error('Connection error:', error);
        setError(error.message);
        setStatus('Connection failed');
      }
    };

    testConnection();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Backend Connection Test</h2>
      <p>Status: {status}</p>
      {error && (
        <div style={{ color: 'red' }}>
          <p>Error: {error}</p>
        </div>
      )}
    </div>
  );
};

export default TestConnection; 