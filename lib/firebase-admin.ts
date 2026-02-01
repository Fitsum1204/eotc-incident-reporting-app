// lib/firebase-admin.ts
import admin from 'firebase-admin';
import { Messaging } from 'firebase-admin/messaging';

function formatPrivateKey(key: string) {
  return key.replace(/\\n/g, '\n');
}

export function getMessaging(): Messaging {
  if (!admin.apps.length) {
    // Prefer the private server env var, fall back to the public one if present
    const projectId =
      process.env.FIREBASE_PROJECT_ID ||
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error(
        'Missing Firebase Admin credentials. Check FIREBASE_PROJECT_ID (or NEXT_PUBLIC_FIREBASE_PROJECT_ID), FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.',
      );
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey: formatPrivateKey(privateKey),
      }),
    });
  }

  return admin.messaging();
}
