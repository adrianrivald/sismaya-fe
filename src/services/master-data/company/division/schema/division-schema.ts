import * as z from 'zod';

export const divisionSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  is_active: z.boolean().optional(),
  is_show_all: z.string().optional()
});


export const divisionSuperAdminSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  company_id: z.any(),
  is_active: z.boolean().optional(),
  is_show_all: z.string().optional()
});

export type DivisionSuperDTO = z.infer<typeof divisionSuperAdminSchema>;

export type DivisionDTO = z.infer<typeof divisionSchema>;
