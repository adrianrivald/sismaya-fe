import * as z from 'zod';

export const companySchema = z
  .object({
    name: z.string().min(1, 'Required'),
    abbreviation: z.string().min(1, 'Required'),
  })
  .partial();

export type CompanyDTO = z.infer<typeof companySchema>;
