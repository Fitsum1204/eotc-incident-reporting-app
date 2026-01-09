// public/sw.js
self.addEventListener('push', function(event) {
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'New Notification';
    const options = {
      body: data.body || 'You have a new notification',
      icon: data.icon || '/icon-192.png',
      badge: '/icon-192.png',
      tag: data.tag || 'default',
      data: data.data || {},
      requireInteraction: data.requireInteraction || false,
      actions: data.actions || [],
    };
  
    event.waitUntil(
      self.registration.showNotification(title, options)
    );
  });
  
  self.addEventListener('notificationclick', function(event) {
    event.notification.close();
  
    const urlToOpen = event.notification.data?.url || '/';
  
    event.waitUntil(
      clients.matchAll({
        type: 'window',
        includeUncontrolled: true,
      }).then(function(clientList) {
        // Check if there's already a window/tab open with the target URL
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        // If not, open a new window/tab
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
    );
  });
  
  self.addEventListener('notificationclose', function(event) {
    // Handle notification close if needed
    console.log('Notification closed:', event.notification.tag);
  });