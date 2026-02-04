import { NextRequest, NextResponse } from 'next/server';
import { getMessaging } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const { token, payload } = await req.json(); // "subscription" is now "token"

    if (!token) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
    }

    const messaging = getMessaging(); // Initialize lazily

    // Send data-only payload to avoid duplicate automatic UI handling
    // by the browser + our service worker. The service worker will display
    // the notification from `payload` data.
    const result = await messaging.send({
      token: token,
      data: {
        title: payload.title,
        body: payload.body,
        url: payload.url || '/',
        tag: payload.tag || 'notification',
        ...payload,
      },
      webpush: {
        headers: {
          Urgency: 'high',
        },
      },
    });

    console.log('✅ FCM PUSH SENT, messageId:', result);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('❌ Push failed:', err);

    // Remove expired subscriptions
    if (err.code === 'messaging/registration-token-not-registered') {
      return NextResponse.json({ expired: true });
    }

    return NextResponse.json({ error: 'Push failed' }, { status: 500 });
  }
}
