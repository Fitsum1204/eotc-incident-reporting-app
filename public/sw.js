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
  const data = payload.data || {};

  const type = data.type || "GENERAL";
  let title = data.title || "Notification";
  let body = data.body || "";
  let url = data.url || "/";

  // 🎯 Type-based behavior
  switch (type) {
    case "NEW_INCIDENT":
      title = "🚨 " + title;
      break;

    case "INCIDENT_APPROVED":
      title = "✅ " + title;
      break;

    case "INCIDENT_REJECTED":
      title = "❌ " + title;
      break;

    case "SYSTEM_ALERT":
      title = "📢 " + title;
      break;

    default:
      break;
  }

  await self.registration.showNotification(title, {
    body,
    icon: "/icon-192.png",
    badge: "/icon-192.png",

    // unique tag = allow multiple notifications
    tag: `${type}-${Date.now()}-${Math.random()}`,

    renotify: true,
    requireInteraction: true,

    data: {
      url,
      type,
    },
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(targetUrl) && "focus" in client) {
            return client.focus();
          }
        }
        return clients.openWindow(targetUrl);
      })
  );
});

//push notification for admin only 
/* messaging.onBackgroundMessage(async (payload) => {
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
    renotify: true,//ensures the phone vibrates or makes a sound even if a previous notification is already visible
    requireInteraction: true,//the alert stays on the screen until the user dismisses it or clicks it
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
  event.notification.close();//removes the notification popup

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
 */