import * as z from 'zod';

export const userSchema = z
  .object({
    email: z.string().min(1, 'Required'),
    phone: z.string().min(1, 'Required'),
    password: z.string().min(1, 'Required'),
    name: z.string().min(1, 'Required'),
    company_id: z.number().nullable(),
    department_id: z.number().nullable(),
    role_id: z.number().min(1, 'Required'),
    cover: z.any()
  })
  .partial();

export type UserDTO = z.infer<typeof userSchema>;


export const userUpdateSchema = z
  .object({
    email: z.string().min(1, 'Required'),
    phone: z.string().min(1, 'Required'),
    password: z.string().min(1, 'Required'),
    name: z.string().min(1, 'Required'),
    company_id: z.number().nullable(),
    department_id: z.number().nullable(),
    role_id: z.number().min(1, 'Required'),
    cover: z.any().optional(),
    profile_picture: z.string().optional()
  })
  .partial();

export type UserUpdateDTO = z.infer<typeof userUpdateSchema>;
