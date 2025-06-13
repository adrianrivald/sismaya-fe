import * as z from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  is_active: z.boolean().optional(),
});


export const productSuperAdminSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  company_id: z.any(),
  is_active: z.boolean().optional(),
});

export type ProductSuperDTO = z.infer<typeof productSuperAdminSchema>;

export type ProductDTO = z.infer<typeof productSchema>;
