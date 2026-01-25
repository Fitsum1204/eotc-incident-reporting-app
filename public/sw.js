importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

/* ================= FIREBASE ================= */

firebase.initializeApp({
  apiKey: "AIzaSyAYQtB9AKCzIRie8MIt2JM99ogSoOsKWTA",
  authDomain: "incident-tracker-cefe9.firebaseapp.com",
  projectId: "incident-tracker-cefe9",
  storageBucket: "incident-tracker-cefe9.appspot.com",
  messagingSenderId: "444851966244",
  appId: "1:444851966244:web:c71dc6ce73d42f231463b1",
});

const messaging = firebase.messaging();

/* ================= INDEXED DB ================= */

const DB_NAME = 'incident-notifications';
const STORE = 'counter';

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function getCount() {
  const db = await openDB();
  return new Promise((resolve) => {
    const tx = db.transaction(STORE, 'readonly');
    const store = tx.objectStore(STORE);
    const req = store.get('count');
    req.onsuccess = () => resolve(req.result || 0);
  });
}

async function setCount(value) {
  const db = await openDB();
  const tx = db.transaction(STORE, 'readwrite');
  tx.objectStore(STORE).put(value, 'count');
}

/* ================= SERVICE WORKER LIFECYCLE ================= */

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(clients.claim()));

/* ================= BACKGROUND MESSAGE ================= */

messaging.onBackgroundMessage(async (payload) => {
  const data = payload.data || {};

  const safeTitle = data.title || '🚨 New Incident';
  const safeBody =
    data.body ||
    `${data.title || 'Incident'} at ${data.location || 'Unknown location'}`;

  let count = (await getCount()) + 1;
  await setCount(count);

  const title =
    count === 1 ? safeTitle : `🚨 ${count} New Incidents`;

  const options = {
    body: count === 1 ? safeBody : `Latest: ${safeTitle}`,
    icon: '/maskable-icon.png',
    badge: '/maskable-icon.png',
    tag: 'incident-group',
    renotify: true,
    requireInteraction: true,
    data: {
      url: count > 1 ? '/admin/incidents' : data.url || '/',
      count,
    },
  };

  await self.registration.showNotification(title, options);
});

/* ================= CLICK HANDLER ================= */

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientsArr) => {
        for (const client of clientsArr) {
          if ('focus' in client) return client.focus();
        }
        return clients.openWindow(event.notification.data?.url || '/');
      })
  );
});
