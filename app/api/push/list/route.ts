import { NextResponse } from 'next/server';
import { writeClient } from '@/sanity/lib/write-client';

// Dev-only helper to list stored push subscriptions for debugging.
export async function GET() {
  try {
    // All explicit pushSubscription documents
    const subs = await writeClient.fetch(
      `*[_type == "pushSubscription"]{_id, role, token, user}`,
    );

    // Admin users that may have `webPushSubscription` stored on the user doc
    const adminUserSubs = await writeClient.fetch(
      `*[_type == "user" && role == "admin" && defined(webPushSubscription)]{_id, "subscription": webPushSubscription}`,
    );

    return NextResponse.json({ count: subs.length, subs, adminUserSubs });
  } catch (err) {
    console.error('Error listing push subscriptions:', err);
    return NextResponse.json(
      { error: 'Failed to list subscriptions' },
      { status: 500 },
    );
  }
}
