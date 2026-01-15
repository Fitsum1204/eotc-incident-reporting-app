// schemaTypes/pushSubscription.ts
import { defineField, defineType } from 'sanity';

export const pushSubscription = defineType({
  name: 'pushSubscription',
  title: 'Push Subscription',
  type: 'document',
  fields: [
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      initialValue: 'admin',
    }),
    defineField({
      name: 'user',
      title: 'User',
      type: 'reference',
      to: [{ type: 'user' }], // Ensure you have a 'user' schema
    }),
    defineField({
      name: 'subscription',
      title: 'Subscription Data',
      type: 'object',
      fields: [
        { name: 'endpoint', type: 'string' },
        { name: 'expirationTime', type: 'number' },
        {
          name: 'keys',
          type: 'object',
          fields: [
            { name: 'p256dh', type: 'string' },
            { name: 'auth', type: 'string' },
          ],
        },
      ],
    }),
  ],
});