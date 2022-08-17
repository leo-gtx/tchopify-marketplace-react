// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyDjy2-3TvX3bOQ6IAXJpy4X2yROrahqRuM",
  authDomain: "tchopify.firebaseapp.com",
  databaseURL: "https://tchopify.firebaseio.com",
  projectId: "tchopify",
  storageBucket: "tchopify.appspot.com",
  messagingSenderId: "714569411494",
  appId: "1:714569411494:web:8f0be588c606a7903a7d67",
  measurementId: "G-Q3XWKZ6CKF"
};

firebase.initializeApp(firebaseConfig);

  if(firebase.messaging.isSupported()){
    // Retrieve firebase messaging
  const messaging = firebase.messaging();
  // eslint-disable-next-line
  messaging.onBackgroundMessage(function(payload) {

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
      image: payload.notification.image,
      icon: '/favicon/android-chrome-192x192.png'
    };

    self.registration.showNotification(notificationTitle,
      notificationOptions);
  });
}
