import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const response = await fetch(`${apiUrl}/signup/`, {  // Add full URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',  // Include credentials
        body: JSON.stringify({ email, username, password }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      console.error('Signup error:', error);
      setMessage('Signup failed: ' + error.message);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(`${apiUrl}/login/`, {  // Add full URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',  // Include credentials
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      localStorage.setItem('token', data.access_token.access_token);
      setMessage('Login successful');
      navigate('/actions');
    } catch (error) {
      console.error('Login error:', error);
      setMessage('Login failed: ' + error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Authentication</h2>
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

export default AuthPage;