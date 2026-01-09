import {defineType, defineField} from 'sanity'

export const user = defineType({
  name: 'user',
  title: 'User',
  type: 'document',
  fields: [
    defineField({ name: 'googleId', type: 'string', title: 'ID' }),
    defineField({ name: 'name', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'email', type: 'string' }),
    defineField({ name: 'image', type: 'url' }),
    defineField({
      name: "password",
      type: "string",
     
    }),
    defineField({
      name: "provider",
      type: "string", 
    }),
     
     defineField({
      name: "isActive",
      type: "boolean",
      initialValue: true,
      title: "Active",
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
        layout: 'radio',
      },
      initialValue: 'user',
    }),
   
  ],
});

