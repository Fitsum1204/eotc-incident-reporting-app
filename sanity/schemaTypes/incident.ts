import { defineType, defineField } from 'sanity'
import LeafletGeopointInput from 'sanity-plugin-leaflet-input'

export const incident = defineType({
  name: 'incident',
  title: 'Incident',
  type: 'document',
  fields: [
    // title
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required()
    }),

    // short/long description
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text'
    }),
   

    // explicit main image (editor selects)
    defineField({
      name: 'mainImage',
      title: 'Main Image (optional)',
      type: 'image',
      options: { hotspot: true },
      description: 'Choose a main image to use as the incident hero. If empty the first image from attachments will be used as fallback.'
    }),

    // attachments (array of files or images)
    defineField({
      name: 'attachments',
      title: 'Attachments',
      type: 'array',
      of: [
        { type: 'image' },
        { type: 'file' }
      ]
    }), defineField({
      name: "locationPoint",
      title: "Coordinates",
      type: "geopoint", 
    }),

    // category (string tag)
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Fire', value: 'Fire' },
          { title: 'Abduction', value: 'Abduction' },
          { title: 'Mass Killing', value: 'Mass Killing' }
          // add more options
        ]
      }
    }),

    // location
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string'
    }),
    // date
    defineField({
      name: 'date',
      title: 'date',
      type: 'date'
    }),

   

    // author reference
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'user' }]
    }),
   defineField({
  name: 'verification',
  title: 'verification',
  type: 'string',
  description: 'The verification status of the incident. Set automatically by the system.',
  options: {
    list: [
      { title: 'Pending', value: 'pending' },
      { title: 'Verified', value: 'verified' },
      { title: 'Rejected', value: 'rejected' },
    ],
    layout: 'radio', // optional, shows as radio buttons in Sanity Studio
  },
  initialValue: 'pending', // default value when a new incident is created
  readOnly: true, // ensures reporters cannot change it from Studio
})
  ],

  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
      mainImage: 'mainImage',
      firstAttachmentImage: 'attachments[0]', // may be image or file
       verification: 'verification'
    },
    prepare(selection) {
      const { title, subtitle, mainImage, firstAttachmentImage ,verification} = selection

      // If mainImage exists use it, otherwise use the first attachment (if it's an image)
      const media = mainImage || (firstAttachmentImage && firstAttachmentImage._type === 'image' ? firstAttachmentImage : undefined)

      return {
        title,
        subtitle: `${subtitle || ''} • ${verification}`, // show status next to category
        media
      }
    }
  }
})


