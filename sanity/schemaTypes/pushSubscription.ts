// schemaTypes/pushSubscription.ts
//push subscription for admin
/* import { defineField, defineType } from 'sanity';

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
}); */

// schemaTypes/pushSubscription.ts
import { defineField, defineType } from 'sanity';

export const pushSubscription = defineType({
  name: 'pushSubscription',
  title: 'Push Subscription',
  type: 'document',

  fields: [
    defineField({
      name: 'user',
      title: 'User',
      type: 'reference',
      to: [{ type: 'user' }],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      options: {
        list: [
          { title: 'Admin', value: 'admin' },
          { title: 'User', value: 'user' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'token',
      title: 'FCM Token',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'device',
      title: 'Device Info',
      type: 'string',
      description: 'Optional: browser/device name',
    }),

    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
    }),

    defineField({
      name: 'updatedAt',
      title: 'Updated At',
      type: 'datetime',
    }),
  ],
});
