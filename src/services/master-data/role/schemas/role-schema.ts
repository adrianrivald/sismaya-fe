import * as z from 'zod';

export const roleSchema = z
  .object({
    name: z.string().min(1, 'Required'),
    permissions: z.number().array()
  })
  .partial();

export type RoleDTO = z.infer<typeof roleSchema>;
