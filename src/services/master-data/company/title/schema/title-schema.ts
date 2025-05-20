import * as z from 'zod';

export const titleSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  is_active: z.boolean().optional(),
});

export const titleSuperAdminSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  company_id: z.number().min(1, 'Company is required'),
  is_active: z.boolean().optional(),
});

export type TitleSuperDTO = z.infer<typeof titleSuperAdminSchema>;


export type TitleDTO = z.infer<typeof titleSchema>;
