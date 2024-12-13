import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  requestNotificationPermission,
  onForegroundNotification,
} from '../services/firebase';

const ActionsPage = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState({
    topics: [],
    sources: [],
    notification_times: [],
  });
  const [newTime, setNewTime] = useState('08:00');
  const [newTopic, setNewTopic] = useState('');
  const [newSource, setNewSource] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [summaries, setSummaries] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    } else {
      fetchCurrentPreferences();
    }
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      requestNotificationPermission();
      onForegroundNotification((payload) => {
        alert(`Notification: ${payload.notification.title} - ${payload.notification.body}`);
      });
    }
  }, []);

  const fetchCurrentPreferences = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/get_preferences/`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      const data = await response.json();
      setPreferences(data);
    } catch (error) {
      setMessage(`Error fetching preferences: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePreferences = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/get_preferences/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(preferences),
      });
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      setMessage('Preferences updated successfully');
      fetchCurrentPreferences();
    } catch (error) {
      setMessage(`Error updating preferences: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSummarizeRecentArticles = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/summarize/recent_articles/`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      const data = await response.json();
      setSummaries(data.summaries || []);
      setMessage(data.message || 'Summaries fetched');
    } catch (error) {
      setMessage(`Error summarizing articles: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTriggerNotification = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/test_notifications/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (response.ok) {
        alert('Notification triggered successfully!');
      } else {
        alert(`Failed to trigger notification: ${result.error || result.detail}`);
      }
    } catch (error) {
      alert('Error triggering notification');
      console.error(error);
    }
  };

  const handleAddItem = (type, value) => {
    if (value && !preferences[type].includes(value)) {
      setPreferences({
        ...preferences,
        [type]: [...preferences[type], value],
      });
    }
  };

  const handleRemoveItem = (type, value) => {
    setPreferences({
      ...preferences,
      [type]: preferences[type].filter((item) => item !== value),
    });
  };

  const handleIngestData = async (endpoint) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message || 'Ingestion completed successfully.');
      } else {
        setMessage(`Failed to ingest data: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Actions Dashboard</h2>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              navigate('/');
            }}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Preferences */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Preferences</h3>
          {['topics', 'sources', 'notification_times'].map((type) => (
            <div key={type} className="mb-4">
              <label className="block text-sm font-medium mb-2 capitalize">
                {type.replace('_', ' ')}
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type={type === 'notification_times' ? 'time' : 'text'}
                  value={
                    type === 'notification_times' ? newTime : type === 'topics' ? newTopic : newSource
                  }
                  onChange={(e) =>
                    type === 'notification_times'
                      ? setNewTime(e.target.value)
                      : type === 'topics'
                      ? setNewTopic(e.target.value)
                      : setNewSource(e.target.value)
                  }
                  placeholder={`Add new ${type}`}
                  className="flex-1 p-2 border rounded"
                />
                <button
                  onClick={() => {
                    handleAddItem(type, type === 'notification_times' ? newTime : type === 'topics' ? newTopic : newSource);
                    type === 'topics' ? setNewTopic('') : type === 'sources' ? setNewSource('') : setNewTime('08:00');
                  }}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {preferences[type].map((item, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2"
                  >
                    <span>{item}</span>
                    <button
                      onClick={() => handleRemoveItem(type, item)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleUpdatePreferences}
          className="w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
        >
          Update Preferences
        </button>

        <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Data Ingestion</h3>
        <div className="flex flex-col gap-4">
          <button
            onClick={() => handleIngestData('/ingest/news/')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Ingest News
          </button>
          <button
            onClick={() => handleIngestData('/ingest/reddit/')}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
          >
            Ingest Reddit Posts
          </button>
          <button
            onClick={() => handleIngestData('/ingest/twitter/')}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            Ingest Tweets
          </button>
        </div>
      </div>


        {/* Summarize Articles */}
        <div className="mt-6">
          <button
            onClick={handleSummarizeRecentArticles}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Summarize Recent Articles
          </button>
        </div>

        {summaries.length > 0 && (
          <div className="mt-6">
            <h4 className="text-lg font-semibold">Article Summaries</h4>
            <ul className="list-disc list-inside mt-2">
              {summaries.map((summary, index) => (
                <li key={index}>{summary}</li>
              ))}
            </ul>
          </div>
        )}

        {message && <div className="mt-4 p-4 bg-gray-100">{message}</div>}
      </div>
      <button
      onClick={handleTriggerNotification}
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
    >
      Trigger Notification
    </button>
    </div>
    
  );
};

export default ActionsPage;
