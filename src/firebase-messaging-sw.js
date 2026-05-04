// Import Firebase scripts (compat version for v8)
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

// Firebase config (same as index.html)
firebase.initializeApp({
  apiKey: "AIzaSyAfNAUXkkp57KePt96VRfd3Va0ViqxTByM",
  authDomain: "vive-tv-9535a.firebaseapp.com",
  projectId: "vive-tv-9535a",
  storageBucket: "vive-tv-9535a.firebasestorage.app",
  messagingSenderId: "200062459341",
  appId: "1:200062459341:web:481c47091e8acd10197884",
  measurementId: "G-0GTF86KCVV"
});

// Retrieve messaging instance
const messaging = firebase.messaging();

// Background message handler
messaging.setBackgroundMessageHandler(function(payload) {
  const { title, body, icon } = payload.notification;
  return self.registration.showNotification(title, {
    body,
    icon,
  });
});

