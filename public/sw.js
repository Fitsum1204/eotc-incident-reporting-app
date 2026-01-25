// public/sw.js
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');



const firebaseConfig = {
  apiKey: "AIzaSyAYQtB9AKCzIRie8MIt2JM99ogSoOsKWTA",
  authDomain: "incident-tracker-cefe9.firebaseapp.com",
  projectId: "incident-tracker-cefe9",
  storageBucket: "incident-tracker-cefe9.firebasestorage.app",
  messagingSenderId: "444851966244",
  appId: "1:444851966244:web:c71dc6ce73d42f231463b1",
  measurementId: "G-JF8S7H0P3E"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);

  // Extract from the 'data' field we sent from the server
  const { title, body, url } = payload.data;
  const GROUP_TAG = 'incident-notification-group';

  const promiseChain = self.registration.getNotifications({ tag: GROUP_TAG })
    .then((notifications) => {
      let currentTitle = title;
      let currentBody = body;
      let count = 1;

      if (notifications.length > 0) {
        const existingNotif = notifications[0];
        count = (existingNotif.data?.count || 1) + 1;
        currentTitle = `🚨 ${count} New Incidents`;
        currentBody = `Latest: ${title}`;
      }

      return self.registration.showNotification(currentTitle, {
        body: currentBody,
        tag: GROUP_TAG,
        renotify: true, // IMPORTANT: Makes phone vibrate/alert even if old notif is there
        icon: '/maskable-icon.png',
        badge: '/maskable-icon.png',
        requireInteraction: true,
        data: {
          url: count > 1 ? '/admin/incidents' : url,
          count: count
        }
      });
    });

  return promiseChain;
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        // Focus existing tab if available
        for (let client of windowClients) {
          if (client.url.includes('/admin') && 'focus' in client) {
            return client.focus();
          }
        }
        // Otherwise open new
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});