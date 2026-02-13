// lib/notifications.ts
'use client';

import { messaging } from './firebase';
import { getToken, onMessage, type MessagePayload } from 'firebase/messaging';

export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

export async function getFcmToken(): Promise<string | null> {
  if (!messaging) {
    console.warn('Firebase Messaging not initialized');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js');

    const vapidKey =
      process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY ||
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

    const getTokenOptions: {
      serviceWorkerRegistration: ServiceWorkerRegistration;
      vapidKey?: string;
    } = { serviceWorkerRegistration: registration };
    if (vapidKey) getTokenOptions.vapidKey = vapidKey;

    const currentToken = await getToken(messaging, getTokenOptions);
    return currentToken || null;
  } catch (err) {
    console.error('An error occurred while retrieving token.', err);
    return null;
  }
}

export function onForegroundMessage(
  callback: (payload: MessagePayload) => void,
) {
  if (!messaging) return () => {};
  return onMessage(messaging, callback);
}
