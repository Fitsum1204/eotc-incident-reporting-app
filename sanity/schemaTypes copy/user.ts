import {defineType, defineField} from 'sanity'

export const user = defineType({
  name: 'user',
  title: 'User',
  type: 'document',
  fields: [
    defineField({ name: 'googleId', type: 'string', title: 'Google ID' }),
    defineField({ name: 'name', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'email', type: 'string' }),
    defineField({ name: 'image', type: 'url' }),
    
  ],
});