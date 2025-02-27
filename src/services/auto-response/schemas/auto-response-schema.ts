import * as z from 'zod';

export const autoResponseSchema = z
  .object({
    message: z.string().min(1, 'Required'),
    start_date: z.any().optional(),
    end_date: z.any().optional(),
    is_custom: z.boolean(),
    reason: z.string().optional()
  })
  .partial();

export type AutoResponseDTO = z.infer<typeof autoResponseSchema>;