// app/api/push/subscribe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import webpush from 'web-push';
import { auth } from '@/auth';

// Configure VAPID
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY || '';

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(
    'mailto:your-email@example.com', // Change this to your contact email
    vapidPublicKey,
    vapidPrivateKey
  );
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const subscription = await request.json();

    if (!subscription || !subscription.endpoint) {
      return NextResponse.json({ error: 'Invalid subscription' }, { status: 400 });
    }

    // Store subscription in your database (Sanity, MongoDB, etc.)
    // For now, we'll just validate it
    // TODO: Save subscription to database with user ID
    
    return NextResponse.json({ 
      success: true,
      message: 'Subscription saved successfully' 
    });
  } catch (error) {
    console.error('Error saving subscription:', error);
    return NextResponse.json(
      { error: 'Failed to save subscription' },
      { status: 500 }
    );
  }
}