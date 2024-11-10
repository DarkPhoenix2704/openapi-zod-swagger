import { z } from 'zod';

export const userSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime()
});

export const createUserSchema = userSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true
});

export const updateUserSchema = createUserSchema.partial();

export const userQuerySchema = z.object({
    include: z.array(z.enum(['posts', 'comments'])).optional(),
    fields: z.array(z.string()).optional(),
});

export const usersQuerySchema = z.object({
    limit: z.number().min(1).max(100).optional(),
    offset: z.number().min(0).optional(),
    sort: z.enum(['name', 'email', 'createdAt']).optional(),
    order: z.enum(['asc', 'desc']).optional(),
})