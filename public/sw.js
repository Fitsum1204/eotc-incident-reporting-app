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

/**
 * Handle background messages.
 * We use 'data' payload to manually construct notifications, allowing for
 * grouping/stacking behavior which isn't possible with auto-display 'notification' payload.
 */
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const data = payload.data || {};
  const GROUP_TAG = 'incident-group';

  // 1. Get existing notifications with this tag
  const promiseChain = self.registration.getNotifications({ tag: GROUP_TAG })
    .then((notifications) => {
      
      let title = '🚨 New Incident Reported';
      let body = `${data.title || 'Incident'} at ${data.location || 'Unknown location'}`;
      let count = 1;

      // 2. Check if we have existing notifications to group
      if (notifications.length > 0) {
        const existingNotification = notifications[0];
        // Retrieve internal counter from existing notification's data
        const previousCount = existingNotification.data?.count || 1;
        count = previousCount + 1;

        title = `🚨 ${count} New Incidents`;
        body = `Latest: ${data.title}`;
      }

      // 3. Show the new/updated notification
      const notificationOptions = {
        body: body,
        icon: '/maskable-icon.png',
        badge: '/maskable-icon.png',
        tag: GROUP_TAG, // Replaces old notification with same tag
        renotify: true, // Vibrates/Alerts again
        requireInteraction: true,
        data: {
          url: count > 1 ? '/admin/incidents' : (data.url || '/'),
          count: count,
          click_action: data.click_action // standard webpush field
        }
      };

      return self.registration.showNotification(title, notificationOptions);
    });

  // Keep worker alive until notification is shown
  // Note: onBackgroundMessage doesn't pass 'event' directly in typical API, 
  // but internally it handles waitUntil. We just return the promise if supported, 
  // or rely on self.registration.showNotification returning a promise.
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  // Get URL from data
  // Logic: If multiple incidents, go to list. If single, go to details.
  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true,
    }).then((clientList) => {
      // Focus existing tab if open
      for (const client of clientList) {
        if (client.url && 'focus' in client) {
          return client.focus().then(formattedClient => {
             // Optional: navigate if URL is different
             // return formattedClient.navigate(urlToOpen);
             return formattedClient;
          });
        }
      }
      // Otherwise open new window
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
