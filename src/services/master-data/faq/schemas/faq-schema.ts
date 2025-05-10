import * as z from 'zod';

export const faqSchema = z.object({
  productId: z.string().min(1, 'Required'),
  productName: z.string().min(1, 'Required'),
  question: z.string().min(1, 'Required'),
  answer: z.string().min(1, 'Required'),
  is_active: z.boolean().optional(),
});

export type FaqDTO = z.infer<typeof faqSchema>;
