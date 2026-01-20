
self.addEventListener('push', (event) => {
  let data = {};

  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    console.error('Invalid push payload', e);
  }

  const title = data.title || 'New Notification';

  const options = {
    body: data.body || 'You have a new notification',
    icon:  '/maskable-icon.png',
    badge: '/maskable-icon.png',
    tag: data.tag || 'default',
    data: {
      url: data.data?.url || '/',
      ...data.data,
    },
    //requireInteraction: Boolean(data.requireInteraction),
    requireInteraction: true,
    actions: data.actions || [],
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
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
