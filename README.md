# eotc-incident-reporting-app

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## MVP Description

A web app for public users to report incidents (e.g., community issues) , view lists, and for admins to verify/manage. Built with Next.js, Tailwind, Sanity CMS. Supports English.

Key Features:

- Public: Submit reports, browse lists, view details.
- Admin: Dashboard to verify, analytics.
- Tech: TypeScript, NextAuth for auth, Zod for validation.

## Wireframes

Sketches for layouts (focus on components):

- [Link to image or describe: Hero with report button.]

Incident Schema:

- Must-Have:
  - id: string (unique)
  - title: string
  - description: string
  - type: string (past/current/expected)
  - category: string
  - date: datetime
  - location_text: string
  - attachments: array[{url: string, type: string}]
  - status: string (unverified/verified/resolved)
  - created_at: datetime
