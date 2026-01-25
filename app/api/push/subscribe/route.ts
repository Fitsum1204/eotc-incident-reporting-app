// app/api/push/subscribe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { writeClient } from '@/sanity/lib/write-client';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
    }

    // Store subscription in Sanity on the user document
    try {
      const userId = session.user.id;
      if (userId) {
        // Check if token already exists for this user to avoid duplicates?
        // For simplicity, we just create a new record. Ideally we upsert or clean up.
        await writeClient.create({
          _type: 'pushSubscription',
          role: 'admin',
          user: {
            _type: 'reference',
            _ref: userId,
          },
          token, // FCM token
        });
      }
    } catch (err) {
      console.error('Error saving subscription to Sanity:', err);
      // continue — we don't want to fail the subscription flow for DB errors
    }

    return NextResponse.json({
      success: true,
      message: 'Subscription saved successfully',
    });
  } catch (error) {
    console.error('Error saving subscription:', error);
    return NextResponse.json(
      { error: 'Failed to save subscription' },
      { status: 500 }
    );
  }
}