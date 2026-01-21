
// self.addEventListener('push', ... in your service-worker.js

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
      let title = '🚨 New Incident Reported';
      let body = pushData.title || 'A new incident was reported.';
      let count = 1;

      // 1. Check if a notification is already visible
      if (notifications.length > 0) {
        const existingNotification = notifications[0];
        // 2. Retrieve the previous count from the data object
        const previousCount = existingNotification.data?.count || 1;
        count = previousCount + 1;

       /*  title = `🚨 ${count} New Incidents`;
        body = `Latest: ${pushData.title}`; */
      }

      const options = {
        body: body,
        icon: '/maskable-icon.png',
        badge: '/maskable-icon.png',
        tag: GROUP_TAG, // Must be the same to replace the old one
        renotify: true, // This makes the phone vibrate/beep even if the tag is the same
        requireInteraction: true,
        data: {
          url: count > 1 ? '/admin/incidents' : (pushData.data?.url || '/'),
          count: count, // Store the new count for the next push
        },
      };

      return self.registration.showNotification(title, options);
    });

  event.waitUntil(promiseChain);
});

self.addEventListener('notificationclick', (event) => {
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
});

self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed:', event.notification.tag);
});
