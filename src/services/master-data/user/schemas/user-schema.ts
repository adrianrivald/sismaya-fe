import * as z from 'zod';

export const userInternalSchema = z
  .object({
    email: z.string().min(1, 'Required'),
    phone: z.string().min(1, 'Required'),
    password: z.string().min(1, 'Required'),
    name: z.string().min(1, 'Required'),
    company_id: z.number().nullable(),
    department_id: z.number().nullable(),
    role_id: z.number().min(1, 'Required'),
    cover: z.any(),
    internal_id: z.number().array()
  })
  .partial();

export type UserInternalDTO = z.infer<typeof userInternalSchema>;

export const userClientSchema = z
  .object({
    email: z.string().min(1, 'Required'),
    phone: z.string().min(1, 'Required'),
    password: z.string().min(1, 'Required'),
    name: z.string().min(1, 'Required'),
    company_id: z.number().nullable(),
    department_id: z.number().nullable(),
    role_id: z.number().min(1, 'Required'),
    cover: z.any(),
    internal_id: z.number().array().optional(),
    product_id: z.number().array().optional(),
    title_id: z.number().nullable()
  })
  .partial();

export type UserClientDTO = z.infer<typeof userClientSchema>;


export const userInternalUpdateSchema = z
  .object({
    email: z.string().min(1, 'Required'),
    phone: z.string().min(1, 'Required'),
    password: z.string().min(1, 'Required'),
    name: z.string().min(1, 'Required'),
    role_id: z.number().min(1, 'Required'),
    cover: z.any().optional(),
    profile_picture: z.string().optional(),
    internal_id: z.number().array().optional(),
    product_id: z.number().array().optional()
  })
  .partial();

export type UserInternalUpdateDTO = z.infer<typeof userInternalUpdateSchema>;



export const userClientUpdateSchema = z
  .object({
    email: z.string().min(1, 'Required'),
    phone: z.string().min(1, 'Required'),
    password: z.string().min(1, 'Required'),
    name: z.string().min(1, 'Required'),
    role_id: z.number().min(1, 'Required'),
    cover: z.any().optional(),
    profile_picture: z.string().optional(),
    company_id: z.number().nullable(),
    department_id: z.number().nullable(),
    internal_id: z.number().array().optional(),
    title_id: z.number().nullable(),
  })
  .partial();

export type UserClientUpdateDTO = z.infer<typeof userClientUpdateSchema>;


export const userAccessControlUpdateSchema = z
  .object({
    email: z.string().min(1, 'Required'),
    name: z.string().min(1, 'Required'),
    role_id: z.number().min(1, 'Required'),
    cover: z.any().optional(),
    profile_picture: z.string().optional(),
    internal_id: z.number().array().optional()
  })
  .partial();

export type UserAccessControlUpdateDTO = z.infer<typeof userAccessControlUpdateSchema>;