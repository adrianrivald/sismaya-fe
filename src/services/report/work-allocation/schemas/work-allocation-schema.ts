import * as z from 'zod';

export const reportWorkAllocationSchema = z
  .object({
    from: z.any().optional(),
    to: z.any().optional(),
    period: z.string().optional(),
  })
  .partial();

export type ReportWorkAllocationDTO = z.infer<typeof reportWorkAllocationSchema>;