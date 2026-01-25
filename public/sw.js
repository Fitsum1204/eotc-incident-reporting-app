// public/sw.js
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize Firebase in the service worker
// Note: These values must match your client config in lib/firebase.ts
// Usually we can't access process.env here directly if not built by Webpack in a specific way.
// For a simple public/sw.js in Next.js, hardcoding or using a build step is common.
// However, since we can't easily inject env vars into a static public file without a build step,
// we will assume the user might need to hardcode them OR we rely on the `firebase-messaging-sw.js` convention.
// A better approach for Next.js is indeed `next-pwa` which can handle this, 
// BUT for now, let's setup the listener logic which integrates with our existing custom logic.

// Since we can't use process.env here, and we don't want to expose keys in source if possible 
// (though PUBLIC keys are fine), we'll try to keep it generic or ask user to fill it.
// Actually, for the service worker to receive background messages via FCM, it initializes itself 
// if we use the default 'firebase-messaging-sw.js'.
// Since we have a custom 'sw.js' registered, we need to init firebase here.

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

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/maskable-icon.png', // valid path relative to scope
    data: payload.data
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});



// public/sw.js

self.addEventListener('push', (event) => {
  let pushData = {};
  try {
    pushData = event.data ? event.data.json() : {};
  } catch (e) {
    console.error('Invalid push payload', e);
  }

  const GROUP_TAG = 'incident-group';

  const promiseChain = self.registration.getNotifications({ tag: GROUP_TAG })
    .then((notifications) => {
      // Create the text for the FIRST notification
      let title = '🚨 New Incident Reported ';
      let body = `${pushData.incidentTitle} at ${pushData.location}`;
      let count = 1;

      // Logic for GROUPING if a notification is already visible
      if (notifications.length > 0) {
        const existingNotification = notifications[0];
        const previousCount = existingNotification.data?.count || 1;
        count = previousCount + 1;

        title = `🚨 ${count} New Incidents`;
        body = `Latest: ${pushData.incidentTitle}`; 
      }

      const options = {
        body: body,
        icon: '/maskable-icon.png',
        badge: '/maskable-icon.png',
        tag: GROUP_TAG,
        renotify: true,
        requireInteraction: true,
        data: {
          // If 1 incident, go to specific page. If many, go to list.
          url: count > 1 ? '/admin/incidents' : (pushData.url || '/'),
          count: count,
        },
      };

      return self.registration.showNotification(title, options);
    });

  event.waitUntil(promiseChain);
});

/* self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const urlToOpen =
    event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true,
    }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(urlToOpen) && 'focus' in client) {
          return client.focus();
        }
      }

      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
}); */


// public/sw.js

self.addEventListener('notificationclick', (event) => {
  // 1. Close the notification immediately
  event.notification.close();

  // 2. Get the URL we stored during the 'push' event
  const urlToOpen = event.notification.data?.url || '/';

  // 3. Handle window management
  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true,
    }).then((clientList) => {
      // Check if the admin already has a tab open with this site
      for (const client of clientList) {
        // If the tab is already on our site, focus it and navigate
        if ('focus' in client) {
          client.focus();
          // Optional: If you want to force the existing tab to the new URL:
          //return client.navigate(urlToOpen);
          return;
        }
      }

      // If no tabs are open, open a new one
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed:', event.notification.tag);
});
