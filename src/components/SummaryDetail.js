import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const SummaryDetail = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const { summary_id } = useParams(); // Extract the summary ID from the URL
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chatMessage, setChatMessage] = useState("");
  const [threadId, setThreadId] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [isResponding, setIsResponding] = useState(false);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const authToken = localStorage.getItem('token'); // Assuming the auth token is stored in localStorage
        const response = await fetch(`${apiUrl}/summaries/${summary_id}`, {
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

        // If no thread_id exists, create one
        if (!data.thread_id) {
          const threadResponse = await fetch(`${apiUrl}/summaries/${summary_id}/init-thread`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${authToken}`,
            }
          });

          if (!threadResponse.ok) {
            throw new Error('Failed to initialize chat thread');
          }
          
          const threadData = await threadResponse.json();
          setThreadId(threadData.thread_id);
          data.thread_id = threadData.thread_id;
        } else {
          setThreadId(data.thread_id);
        }

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
      setIsResponding(true);
      const payload = {
        question: chatMessage,
      };

      setChatHistory(prev => [...prev, {
        role: 'user',
        content: chatMessage,
        timestamp: new Date().toISOString()
      }]);

      setChatMessage('');
  
      console.log('Sending Payload:', payload);
      const authToken = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/api/chat/${summary_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`, // Ensure the token is included
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(errorText);
      }
  
      const data = await response.json();
      console.log('Response:', data.response);
  
      setChatHistory(prev => [...prev, {
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toISOString()
      }]);
    } catch (err) {
      console.error('Detailed error:', err);

      setChatHistory(prev => [...prev, {
        role: 'error',
        content: 'Failed to get response. Please try again.',
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsResponding(false);
    }
  };

  // Message component for better organization
  const ChatMessage = ({ message }) => (
    <div style={{ 
      marginBottom: '10px',
      padding: '10px',
      borderRadius: '8px',
      maxWidth: '80%',
      backgroundColor: message.role === 'user' ? '#E3F2FD' : '#F5F5F5',
      marginLeft: message.role === 'user' ? 'auto' : '0',
      marginRight: message.role === 'user' ? '0' : 'auto',
    }}>
      <div style={{ 
        fontWeight: message.role === 'error' ? 'bold' : 'normal',
        color: message.role === 'error' ? 'red' : 'inherit'
      }}>
        {message.content}
      </div>
      <div style={{ 
        fontSize: '0.8em', 
        color: '#666',
        marginTop: '4px'
      }}>
        {new Date(message.timestamp).toLocaleTimeString()}
      </div>
    </div>
  );

  // Loading animation component
  const LoadingDots = () => (
    <div style={{ 
      display: 'flex', 
      gap: '4px',
      padding: '10px',
      alignItems: 'center'
    }}>
      {[1, 2, 3].map((_, i) => (
        <div
          key={i}
          style={{
            width: '8px',
            height: '8px',
            backgroundColor: '#666',
            borderRadius: '50%',
            animation: 'bounce 1.4s infinite ease-in-out',
            animationDelay: `${i * 0.16}s`
          }}
        />
      ))}
      <style>
        {`
          @keyframes bounce {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1.0); }
          }
        `}
      </style>
    </div>
  );

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
        <h3>Ask questions about this summary</h3>
        <div style={{ 
          marginBottom: '10px',
          maxHeight: '400px',
          overflowY: 'auto',
          border: '1px solid #eee',
          borderRadius: '4px',
          padding: '10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          {chatHistory.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
          {isResponding && <LoadingDots />}
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && chatMessage.trim() && !isResponding && sendChatMessage()}
            placeholder="Ask a question about this summary..."
            style={{ 
              flex: 1, 
              padding: '10px', 
              border: '1px solid #ccc', 
              borderRadius: '4px',
              fontSize: '16px'
            }}
          />
          <button
            onClick={sendChatMessage}
            disabled={!chatMessage.trim() || isResponding}
            style={{ 
              backgroundColor: chatMessage.trim() && !isResponding ? '#4CAF50' : '#cccccc',
              color: 'white', 
              border: 'none', 
              padding: '10px 20px', 
              borderRadius: '4px', 
              cursor: chatMessage.trim() && !isResponding ? 'pointer' : 'not-allowed',
              fontSize: '16px'
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
);
};

export default SummaryDetail;