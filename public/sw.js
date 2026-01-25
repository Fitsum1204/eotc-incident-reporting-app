


importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');


firebase.initializeApp({
  apiKey: "AIzaSyAYQtB9AKCzIRie8MIt2JM99ogSoOsKWTA",
  authDomain: "incident-tracker-cefe9.firebaseapp.com",
  projectId: "incident-tracker-cefe9",
  storageBucket: "incident-tracker-cefe9.appspot.com",
  messagingSenderId: "444851966244",
  appId: "1:444851966244:web:c71dc6ce73d42f231463b1",
});

const messaging = firebase.messaging();

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(clients.claim()));

messaging.onBackgroundMessage(async (payload) => {
  const data = payload.data || {};

  const title = data.title || '🚨 New Incident';
  const options = {
    body: data.body || 'New incident reported',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: 'incident',
    renotify: true,
    requireInteraction: true,
    data: {
      url: data.url || '/admin/incidents'
    }
  };

  await self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientsArr) => {
        for (const client of clientsArr) {
          if (client.url.includes('/admin') && 'focus' in client) {
            return client.focus();
          }
        }
        return clients.openWindow(event.notification.data.url);
      })
  );
});
