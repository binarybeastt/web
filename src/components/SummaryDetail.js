import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const SummaryDetail = () => {
  const { summary_id } = useParams(); // Extract the summary ID from the URL
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]); // Manage chat history

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const authToken = localStorage.getItem('token'); // Assuming the auth token is stored in localStorage
        const response = await fetch(`http://localhost:8000/summaries/${summary_id}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Summary not found');
          } else if (response.status === 403) {
            throw new Error('Unauthorized to access this summary');
          } else {
            throw new Error('An error occurred while fetching the summary');
          }
        }

        const data = await response.json();
        setSummary(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchSummary();
  }, [summary_id]);

  const sendChatMessage = async () => {
    try {
      const payload = {
        query: chatMessage,
        chat_history: chatHistory.map(chat => ({
          role: chat.user === 'You' ? 'user' : 'assistant',
          content: chat.message
        }))
      };
  
      console.log('Sending Payload:', payload);
      const authToken = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/chat/${summary_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload)
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(errorText);
      }
  
      const data = await response.json();
      // Rest of your existing code
    } catch (err) {
      console.error('Detailed error:', err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#4CAF50' }}>Detailed Summary</h1>

      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', marginBottom: '20px' }}>
        <h2>{summary.title || 'Summary'}</h2>
        <p>{summary.detailed_summary}</p>
      </div>

      <h2 style={{ color: '#333' }}>Source Articles:</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {summary.source_articles.map((article) => (
          <div key={article.article_id} style={{ backgroundColor: 'white', padding: '10px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', textAlign: 'center' }}>
            <a href={article.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#4CAF50' }}>
              {article.title}
            </a>
          </div>
        ))}
      </div>

      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', marginTop: '20px' }}>
        <h3>Chat about this summary</h3>
        <div style={{ marginBottom: '10px' }}>
          {chatHistory.map((chat, index) => (
            <p key={index}><strong>{chat.user}:</strong> {chat.message}</p>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            placeholder="Type your message..."
            style={{ flex: 1, padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
          <button
            onClick={sendChatMessage}
            style={{ backgroundColor: '#4CAF50', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default SummaryDetail;
