import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { requestNotificationPermission, onForegroundNotification } from './services/firebase';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/firebase-messaging-sw.js')
      .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch((error) => {
          console.error('Service Worker registration failed:', error);
      });
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


const setupNotifications = async () => {
  try {
    // Request permission and register token
    await requestNotificationPermission();
    
    // Setup foreground notification listener
    const unsubscribe = onForegroundNotification((payload) => {
      console.log('Notification received in app:', payload);
      // Add your custom logic to handle foreground notifications
      // For example, you might want to:
      // - Show a toast
      // - Update app state
      // - Trigger a custom event
    });

    // Optional: Return unsubscribe method if you want to remove listener later
    return unsubscribe;
  } catch (error) {
    console.error('Failed to setup notifications:', error);
  }
};

// Call setup when app loads
setupNotifications();


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();