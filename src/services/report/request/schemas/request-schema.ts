import * as z from 'zod';

export const reportRequestDTO = z
  .object({
    from: z.any().optional(),
    to: z.any().optional(),
    period: z.string().optional(),
  })
  .partial();

export type ReportRequestDTO = z.infer<typeof reportRequestDTO>;