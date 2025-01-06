import * as z from 'zod';

export const requestSchema = z
  .object({
    description: z.string().min(1, 'Required'),
    category_id: z.number().min(1, 'Required'),
    product_id: z.number().min(1, 'Required'),
    is_cito: z.boolean(),
    files: z.any(),
  })
  .partial();

export type RequestDTO = z.infer<typeof requestSchema>;