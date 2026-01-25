// app/api/push/send/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { messaging } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const { token, payload } = await req.json(); // "subscription" is now "token"

    if (!token) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
    }

    await messaging.send({
        token: token,
        notification: {
            title: payload.title,
            body: payload.body,
        },
        data: {
            url: payload.url || '/',
            click_action: payload.url || '/', // For some platforms
            ...payload
        },
        // Webpush config for actions etc.
        webpush: {
            notification: {
                icon: '/maskable-icon.png',
                data: {
                    url: payload.url
                }
            }
        }
    });

    console.log('✅ FCM PUSH SENT');
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