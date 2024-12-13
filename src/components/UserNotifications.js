// UserNotifications.js
import React, { useEffect, useState } from 'react';

const UserNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8000/user_notifications/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Attach the token for authorization
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch notifications');
        }

        const data = await response.json();
        setNotifications(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Your Notifications</h2>
      {notifications.length === 0 ? (
        <p>No notifications found</p>
      ) : (
        <ul>
          {notifications.map((notification) => {
            const summaryId = notification.summary_id; // Retrieve summary_id
            return (
              <li key={notification._id}>
                <a
                  href={`http://localhost:3000/view-summary/${summaryId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Summary
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default UserNotifications;
