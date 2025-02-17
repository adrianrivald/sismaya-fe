import * as z from 'zod';

export const messagingSchema = z
  .object({
    content: z.string().min(1, 'Required'),
    request_id: z.number().min(1, 'Required'),
    files: z.any(),
  })
  .partial();

export type MessagingDTO = z.infer<typeof messagingSchema>;