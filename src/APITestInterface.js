import React, { useState } from 'react';

const APITestInterface = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');

  const handleSignup = async () => {
    try {
      const response = await fetch('/signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username, password }),
      });
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage('Signup failed');
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch('/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      setToken(data.access_token);
      setMessage('Login successful');
    } catch (error) {
      setMessage('Login failed');
    }
  };

  const handleUpdatePreferences = async () => {
    try {
      const response = await fetch('/preferences/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          topics: ['Technology', 'Science'],
          sources: ['technology', 'science'],
          notification_times: ['morning', 'evening']
        }),
      });
      await response.json();
      setMessage('Preferences updated');
    } catch (error) {
      setMessage('Failed to update preferences');
    }
  };

  const handleIngestData = async (endpoint) => {
    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage(`Failed to ingest from ${endpoint}`);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">API Test Interface</h2>
        </div>
        <div className="space-y-4">
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input 
            type="text" 
            placeholder="Username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <div className="flex space-x-2">
            <button 
              onClick={handleSignup}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Signup
            </button>
            <button 
              onClick={handleLogin}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
            >
              Login
            </button>
          </div>

          {token && (
            <div className="space-y-4">
              <button 
                onClick={handleUpdatePreferences}
                className="w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors"
              >
                Update Preferences
              </button>
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleIngestData('/ingest/news/')}
                  className="flex-1 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors"
                >
                  Ingest News
                </button>
                <button 
                  onClick={() => handleIngestData('/ingest/reddit/')}
                  className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                >
                  Ingest Reddit
                </button>
                <button 
                  onClick={() => handleIngestData('/ingest/twitter/')}
                  className="flex-1 bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  Ingest Twitter
                </button>
              </div>
            </div>
          )}

          {message && (
            <div className="mt-4 p-4 bg-gray-100 rounded-lg border border-gray-200">
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default APITestInterface;