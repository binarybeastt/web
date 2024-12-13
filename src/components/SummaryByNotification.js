// SummaryByNotification.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const SummaryByNotification = () => {
  const { notification_id } = useParams();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${apiUrl}/notification_summary/${notification_id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,  // Attach the token for authorization
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch summary');
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
  }, [notification_id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Summary for Notification {notification_id}</h2>
      {summary ? (
        <div>
          <h3>{summary.title}</h3>
          <p>{summary.content}</p>
        </div>
      ) : (
        <p>No summary found for this notification</p>
      )}
    </div>
  );
};

export default SummaryByNotification;
