import * as z from 'zod';

export const divisionSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  // company_id: z.number().min(1, 'Company is required'),
  is_active: z.boolean().optional(),
});

export type DivisionDTO = z.infer<typeof divisionSchema>;
