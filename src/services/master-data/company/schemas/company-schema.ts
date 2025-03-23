import * as z from 'zod';

export const companySchema = z
  .object({
    name: z.string().min(1, 'Required'),
    abbreviation: z.string().min(1, 'Required'),
    cover: z.any().optional(),
    internal_id: z.any().optional(),
  })
  .partial();

export type CompanyDTO = z.infer<typeof companySchema>;
