import * as z from 'zod';

export const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  is_active: z.boolean().optional(),
});


export const categorySuperAdminSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  company_id: z.number().min(1, 'Company is required'),
  is_active: z.boolean().optional(),
});

export type CategorySuperDTO = z.infer<typeof categorySuperAdminSchema>;

export type CategoryDTO = z.infer<typeof categorySchema>;
