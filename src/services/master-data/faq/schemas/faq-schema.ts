import * as z from 'zod';

export const faqSchema = z.object({
  productId: z.array(z.number()).min(1, 'At least one product must be selected'),
  // productName: z.string().min(1, 'Required'),
  question: z.string().min(1, 'Required'),
  answer: z.string().min(1, 'Required'),
  is_active: z.boolean().optional(),
});

export const faqSchemaSuperAdmin = faqSchema.extend({
  company_id: z.string().min(1, 'Required'),
});

export type FaqDTO = z.infer<typeof faqSchema>;

export type FaqDTOSuperAdmin = z.infer<typeof faqSchemaSuperAdmin>;
