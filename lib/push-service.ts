// lib/push-service.ts

import { writeClient } from '@/sanity/lib/write-client';
import { getMessaging } from '@/lib/firebase-admin';

type SendPushOptions = {
  roles?: string[];
  userIds?: string[];
  title: string;
  body: string;
  url: string;
  type: string;
};

export async function sendPush({
  roles,
  userIds,
  title,
  body,
  url,
  type,
}: SendPushOptions) {
  try {
    const filters: string[] = [];
    const params: any = {};

    if (roles?.length) {
      filters.push('role in $roles');
      params.roles = roles;
    }

    if (userIds?.length) {
      filters.push('user._ref in $userIds');
      params.userIds = userIds;
    }

    if (!filters.length) {
      console.warn('⚠️ No roles or userIds specified for push');
      return;
    }

    const query = `*[_type == "pushSubscription" && (${filters.join(
      ' || '
    )})]{_id, token}`;

    const subscriptions = await writeClient.fetch(query, params);

    if (!subscriptions.length) {
      console.warn('⚠️ No matching push subscriptions found');
      return;
    }

    const messaging = getMessaging();

    const tokens = subscriptions.map((s: any) => s.token);

    await messaging.sendEachForMulticast({
      tokens,
      data: {
        title,
        body,
        url,
        type,
      },
      webpush: {
        headers: { Urgency: 'high' },
      },
    });

    console.log(`✅ Push sent to ${tokens.length} device(s)`);
  } catch (error) {
    console.error('❌ sendPush error:', error);
  }
}
