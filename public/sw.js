
// self.addEventListener('push', ... in your service-worker.js



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
      let title = '🚨 New Incident Reported';
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
