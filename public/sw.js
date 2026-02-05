importScripts(
  'https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js',
);
importScripts(
  'https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js',
);

firebase.initializeApp({
  apiKey: 'AIzaSyAYQtB9AKCzIRie8MIt2JM99ogSoOsKWTA',
  authDomain: 'incident-tracker-cefe9.firebaseapp.com',
  projectId: 'incident-tracker-cefe9',
  storageBucket: 'incident-tracker-cefe9.appspot.com',
  messagingSenderId: '444851966244',
  appId: '1:444851966244:web:c71dc6ce73d42f231463b1',
});

const messaging = firebase.messaging();

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(clients.claim()));

messaging.onBackgroundMessage(async (payload) => {
  console.log('📬 FCM background message received:', payload);

  // FCM sends notification in payload.notification (when using notification field)
  // and custom data in payload.data
  const notification = payload.notification || {};
  const data = payload.data || {};

  const title = notification.title || data.title || '🚨 New Incident';
  const body = notification.body || data.body || 'New incident reported';
  const url = data.url || '/admin/incidents';

  const options = {
    body: body,
    icon: notification.icon || '/icon-192.png',
    badge: '/icon-192.png',
    // Always generate a unique tag so new notifications don't replace older ones.
    // Use timestamp + random suffix to avoid collisions even across rapid events.
    tag: `${data.type || 'incident'}-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 9)}`,
    renotify: true,
    requireInteraction: true,
    data: {
      url: url,
      type: data.type,
      incidentId: data.incidentId,
    },
  };

  console.log('🔔 Showing notification:', title, options);
  await self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientsArr) => {
        for (const client of clientsArr) {
          if (client.url.includes('/admin') && 'focus' in client) {
            return client.focus();
          }
        }
        return clients.openWindow(event.notification.data.url);
      }),
  );
});
