import * as z from 'zod';

export const reportWorkPerformanceSchema = z
  .object({
    from: z.any().optional(),
    to: z.any().optional(),
    period: z.string().optional(),
    type: z.string(),
    user_id: z.string().array().optional(),
    department_id: z.string().array().optional()
  })
  .partial();

export type ReportWorkPerformanceDTO = z.infer<typeof reportWorkPerformanceSchema>;