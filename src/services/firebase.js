// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBuT1zKSzTLBfzCFV3eqRNPxCeZ2Vg7faA",
  authDomain: "smart-notifications-9caa0.firebaseapp.com",
  projectId: "smart-notifications-9caa0",
  storageBucket: "smart-notifications-9caa0.firebasestorage.app",
  messagingSenderId: "891675913093",
  appId: "1:891675913093:web:ea97094af9c5a3ab0732ec",
  measurementId: "G-8W9XVNV0EJ",
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
      await fetch("http://localhost:8000/api/register-fcm-token", {
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
