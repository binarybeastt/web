importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

var firebaseConfig = {
  apiKey: 'AIzaSyBuT1zKSzTLBfzCFV3eqRNPxCeZ2Vg7faA',
  authDomain: "smart-notifications-9caa0.firebaseapp.com",
  projectId: 'smart-notifications-9caa0',
  messagingSenderId: '891675913093',
  storageBucket: "smart-notifications-9caa0.firebasestorage.app",
  appId: "1:891675913093:web:ea97094af9c5a3ab0732ec",
  measurementId: "G-8W9XVNV0EJ"
};

firebase.initializeApp(firebaseConfig);
var messaging = firebase.messaging();

self.addEventListener('install', function(event) {
  self.skipWaiting(); // Force activation of new service worker
});

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);
  var notificationTitle = payload.notification.title;
  var notificationOptions = {
    body: payload.notification.body,
    data: payload.data // Add this to pass additional data
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});



self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll().then(function(clientList) {
      // If a window is already open, focus it
      for (var i = 0; i < clientList.length; i++) {
        var client = clientList[i];
        if (client.url === 'https://your-app-url.com/summaries' && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise, open a new window
      return self.clients.openWindow('https://your-app-url.com/summaries');
    })
  );
});

