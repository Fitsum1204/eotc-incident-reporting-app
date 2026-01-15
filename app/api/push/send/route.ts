import { NextRequest, NextResponse } from 'next/server';
import webpush from 'web-push';

webpush.setVapidDetails(
  'mailto:forfreef@gmail.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { subscription, payload } = await req.json();

    if (!subscription?.endpoint) {
      return NextResponse.json({ error: 'Invalid subscription' }, { status: 400 });
    }

    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: payload.title,
        body: payload.body,
        data: { url: payload.url },
        tag: payload.tag,
      })
    );
 console.log('✅ PUSH SENT');
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('❌ Push failed:', err?.statusCode, err?.body);

    // Remove expired subscriptions (410 Gone)
    if (err?.statusCode === 410 || err?.statusCode === 404) {
      return NextResponse.json({ expired: true });
    }

    return NextResponse.json({ error: 'Push failed' }, { status: 500 });
  }
}

/* import { NextRequest, NextResponse } from 'next/server';
import webpush from 'web-push';

webpush.setVapidDetails(
  'mailto:forfreef@gmail.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function POST(req: NextRequest) {
  console.log('📩 /api/push/send called')
  const { subscription, payload } = await req.json();
console.log(
  '🚀 Sending push to:',
  subscription?.endpoint
)
  await webpush.sendNotification(
    subscription,
    JSON.stringify({
      title: payload.title,
      body: payload.body,
      data: { url: payload.url },
    })
  );
console.log('✅ Push sent successfully')
  return NextResponse.json({ success: true });
}
 */