// lib/notifications.ts
'use client';

import { messaging } from './firebase';
import { getToken } from 'firebase/messaging';

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
    const registration = await navigator.serviceWorker.ready;
    
    // We get the token, passing usage config tied to our VAPID key equivalent (if set via env)
    // Actually, in default FCM setup, we just need the VAPID key if we want to be explicit,
    // but often it's configured in the firebase config. 
    // Usually `getToken` takes { vapidKey: '...' } if we want to override or if not set in console.
    // For now, we'll assume the user might need to pass the VAPID key if they didn't generate one in console.
    // But let's check basic usage first.
    
    // NOTE: You need to add your VAPID key here if you generated one in Firebase Console -> Cloud Messaging -> Web Push Certificates
    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

    const currentToken = await getToken(messaging, { 
      serviceWorkerRegistration: registration,
      vapidKey: vapidKey 
    });

    if (currentToken) {
      return currentToken;
    } else {
      console.log('No registration token available. Request permission to generate one.');
      return null;
    }
  } catch (err) {
    console.log('An error occurred while retrieving token. ', err);
    return null;
  }
}

