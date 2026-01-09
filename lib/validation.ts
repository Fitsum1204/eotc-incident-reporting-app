import {z} from 'zod';

export const incidentReportSchema = z.object({
    title: z.string().min(5, 'Title must be at least 5 characters long'),

    description: z.string().min(20, 'Description must be at least 20 characters long'),

    type: z.string().nonempty('Please select an incident type'),
    location: z.string().min(5, 'Location must be at least 5 characters long'),
    date: z.string().nonempty('Please provide the date of the incident'),
    verification: z.enum(['pending', 'verified', 'rejected']).default('pending'),
   lat: z.string().optional(),
lng: z.string().optional(), 
});

export type IncidentReportFormData = z.infer<typeof incidentReportSchema>;