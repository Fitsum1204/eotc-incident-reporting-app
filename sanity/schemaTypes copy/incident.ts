import { defineType, defineField } from 'sanity'
export const incident = defineType({
  name: 'incident',
  title: 'Incident',
  type: 'document',

  fields: [
    /* =========================
       CORE INCIDENT INFO
    ========================== */

    defineField({
      name: 'title',
      title: 'Incident Title',
      type: 'string',
      validation: (Rule) => Rule.required()
    }),

    defineField({
      name: 'description',
      title: 'Detailed Description',
      type: 'text',
      description: 'Describe what happened factually and clearly.'
    }),

    defineField({
      name: 'date',
      title: 'Date of Incident',
      type: 'date',
      validation: (Rule) => Rule.required()
    }),

    defineField({
      name: 'time',
      title: 'Approximate Time',
      type: 'string',
      description: 'Optional (e.g. early morning, during liturgy)'
    }),

    /* =========================
       LOCATION (STRUCTURED)
    ========================== */

    defineField({
      name: 'location',
      title: 'Location (General)',
      type: 'string',
      validation: (Rule) => Rule.required()
    }),

    defineField({
      name: 'region',
      title: 'Region',
      type: 'string'
    }),

    defineField({
      name: 'zone',
      title: 'Zone / City',
      type: 'string'
    }),

    defineField({
      name: 'specificPlace',
      title: 'Specific Place',
      type: 'string',
      description: 'Church name, monastery, village, etc.'
    }),

    /* =========================
       INCIDENT CLASSIFICATION
    ========================== */

    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Mass Killing', value: 'Mass Killing' },
          { title: 'Church Burning', value: 'Church Burning' },
          { title: 'Abduction', value: 'Abduction' },
          { title: 'Forced Displacement', value: 'Forced Displacement' },
          { title: 'Sexual Violence', value: 'Sexual Violence' },
          { title: 'Threat / Intimidation', value: 'Threat' }
        ]
      }
    }),

    defineField({
      name: 'targetTypes',
      title: 'Targeted Groups',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Clergy', value: 'Clergy' },
          { title: 'Worshippers', value: 'Worshippers' },
          { title: 'Church Property', value: 'Church Property' },
          { title: 'Monastery', value: 'Monastery' },
          { title: 'Religious Artifacts', value: 'Artifacts' }
        ]
      }
    }),

    /* =========================
       VICTIM DATA (OPTIONAL)
    ========================== */

    defineField({
      name: 'victimCounts',
      title: 'Victim Numbers',
      type: 'object',
      fields: [
        { name: 'killed', type: 'number', title: 'Killed' },
        { name: 'injured', type: 'number', title: 'Injured' },
        { name: 'missing', type: 'number', title: 'Missing' },
        { name: 'displaced', type: 'number', title: 'Displaced' }
      ]
    }),

    defineField({
      name: 'victimDetails',
      title: 'Victim Details (Optional)',
      type: 'text',
      description: 'Names or descriptions only if safe and consented.'
    }),

    /* =========================
       PERPETRATOR (ALLEGED)
    ========================== */

    defineField({
      name: 'allegedPerpetrators',
      title: 'Alleged Perpetrators',
      type: 'string',
      description: 'Only if known or reported by witnesses.'
    }),

    /* =========================
       IMAGES & EVIDENCE
    ========================== */

    defineField({
      name: 'mainImage',
      title: 'Main Image (Hero)',
      type: 'image',
      options: { hotspot: true },
      description:
        'Optional. If empty, the first image from attachments will be used.'
    }),

    defineField({
      name: 'attachments',
      title: 'Evidence Attachments',
      type: 'array',
      of: [
        { type: 'image' },
        { type: 'file' }
      ],
      description: 'Photos, videos, documents, medical or church records.'
    }),

    /* =========================
       REPORTER INFO (SAFE)
    ========================== */

    defineField({
      name: 'reporterRole',
      title: 'Reporter Role',
      type: 'string',
      options: {
        list: [
          { title: 'Witness', value: 'Witness' },
          { title: 'Victim', value: 'Victim' },
          { title: 'Clergy', value: 'Clergy' },
          { title: 'Church Official', value: 'Church Official' },
          { title: 'Relative', value: 'Relative' },
          { title: 'Anonymous', value: 'Anonymous' }
        ]
      }
    }),

    defineField({
      name: 'isAnonymous',
      title: 'Anonymous Report',
      type: 'boolean',
      initialValue: true
    }),

    /* =========================
       VERIFICATION (ADMIN ONLY)
    ========================== */

    defineField({
      name: 'sourceType',
      title: 'Source Type',
      type: 'string',
      options: {
        list: [
          { title: 'First-hand Witness', value: 'First-hand' },
          { title: 'Second-hand', value: 'Second-hand' },
          { title: 'Media Report', value: 'Media' },
          { title: 'Church Report', value: 'Church' }
        ]
      }
    }),

    defineField({
      name: 'verificationStatus',
      title: 'Verification Status',
      type: 'string',
      initialValue: 'Pending',
      options: {
        list: [
          { title: 'Pending', value: 'Pending' },
          { title: 'Partially Verified', value: 'Partial' },
          { title: 'Verified', value: 'Verified' },
          { title: 'Disputed', value: 'Disputed' }
        ]
      }
    }),

    /* =========================
       AUTHOR (SYSTEM)
    ========================== */

    defineField({
      name: 'author',
      title: 'Submitted By',
      type: 'reference',
      to: [{ type: 'user' }]
    })
  ],

  /* =========================
     PREVIEW CONFIG
  ========================== */

  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
      mainImage: 'mainImage',
      firstAttachmentImage: 'attachments[0]'
    },
    prepare({ title, subtitle, mainImage, firstAttachmentImage }) {
      const media =
        mainImage ||
        (firstAttachmentImage?._type === 'image'
          ? firstAttachmentImage
          : undefined)

      return {
        title,
        subtitle,
        media
      }
    }
  }
})