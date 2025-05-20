import * as z from 'zod';

export const divisionSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  is_active: z.boolean().optional(),
});


export const divisionSuperAdminSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  company_id: z.number().min(1, 'Company is required'),
  is_active: z.boolean().optional(),
});

export type DivisionSuperDTO = z.infer<typeof divisionSuperAdminSchema>;

export type DivisionDTO = z.infer<typeof divisionSchema>;
