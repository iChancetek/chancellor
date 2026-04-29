importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBX8fn0E8ZvWSTG735i1_4YNGfkQq7Ltpk",
  authDomain: "ichancellor.firebaseapp.com",
  projectId: "ichancellor",
  storageBucket: "ichancellor.firebasestorage.app",
  messagingSenderId: "87526499893",
  appId: "1:87526499893:web:9acc18d524fe47ce7ab37c",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon.svg'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
