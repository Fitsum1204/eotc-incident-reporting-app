// app/api/push/send/route.ts
import { NextRequest, NextResponse } from 'next/server';
import webpush from 'web-push';
import { auth } from '@/auth';

const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY || '';

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(
    'mailto:your-email@example.com',
    vapidPublicKey,
    vapidPrivateKey
  );
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    // Only admins can send notifications
    // Adjust this check based on your auth setup
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { subscription, payload } = await request.json();

    if (!subscription || !payload) {
      return NextResponse.json(
        { error: 'Subscription and payload required' },
        { status: 400 }
      );
    }

    const notificationPayload = JSON.stringify({
      title: payload.title || 'New Notification',
      body: payload.body || '',
      icon: payload.icon || '/icon-192.png',
      badge: '/icon-192.png',
      tag: payload.tag || 'default',
      data: {
        url: payload.url || '/',
        ...payload.data,
      },
    });

    await webpush.sendNotification(subscription, notificationPayload);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error sending notification:', error);
    
    // Handle expired/invalid subscriptions
    if (error.statusCode === 410 || error.statusCode === 404) {
      // TODO: Remove subscription from database
      return NextResponse.json(
        { error: 'Subscription expired' },
        { status: 410 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    );
  }
}