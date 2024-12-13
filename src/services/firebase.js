// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const messaging = getMessaging(app);

export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      console.log("Notification permission granted");
      const f_token = await getToken(messaging);
      console.log("FCM Token:", f_token);

      // Send token to backend
      const authToken = localStorage.getItem("token");
      await fetch(`${process.env.REACT_APP_API_URL}/api/register-fcm-token`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fcm_token: f_token }),
      });
    }
  } catch (error) {
    console.error("Token registration failed", error);
  }
};

export const onForegroundNotification = (callback) => {
  onMessage(messaging, (payload) => {
    console.log("Foreground message received:", payload);

    // Extract notification details and summary_id
    const { title, body, icon } = payload.notification || {};
    const summaryId = payload.data?.summary_id;

    // Display a browser notification
    if (Notification.permission === "granted") {
      const notification = new Notification(title || "Notification", {
        body: body || "You have a new message.",
        icon: icon || "/default-icon.png", // Replace with your app's default icon
      });

      // Add click handler
      notification.onclick = () => {
        if (summaryId) {
          window.location.href = `/view-summary/${summaryId}`;
        } else {
          console.error("Missing summary_id in notification payload:", payload);
        }
      };
    } else {
      console.warn("Notification permission not granted for foreground messages.");
    }

    // Optional: Trigger the callback for additional custom handling
    if (callback) {
      callback(payload);
    }
  });
};
