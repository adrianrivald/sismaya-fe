import * as z from 'zod';

export const statusSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  // company_id: z.number().min(1, 'Company is required'),
  is_active: z.boolean().optional(),
  sort: z.number().nullable(),
  step: z.string()
});

export const statusSuperAdminSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  company_id: z.number().min(1, 'Company is required'),
  is_active: z.boolean().optional(),
  sort: z.number().nullable(),
  step: z.string()
});

export type StatusSuperDTO = z.infer<typeof statusSuperAdminSchema>;


export type StatusDTO = z.infer<typeof statusSchema>;
