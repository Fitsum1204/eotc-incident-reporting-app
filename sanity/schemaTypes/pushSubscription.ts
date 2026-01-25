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
      name: 'token',
      title: 'FCM Token',
      type: 'string', // Changed from 'subscription' object to 'token' string
    }),
  ],
});