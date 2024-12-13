import React from 'react';

const TriggerNotification = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
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

  return (
    <button
      onClick={handleTriggerNotification}
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
    >
      Trigger Notification
    </button>
  );
};

export default TriggerNotification;
