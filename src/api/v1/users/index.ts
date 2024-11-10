import { registry } from '../../../core/registry';
import {
    userSchema,
    createUserSchema,
    updateUserSchema,
    userQuerySchema,
    usersQuerySchema
} from './schema';
import {z} from "zod";

export function registerUserRoutes() {
    registry.register({
        method: 'get',
        path: '/v1/users',
        description: 'List all users',
        request: {
            query: usersQuerySchema
        },
        responses: {
            200: {
                description: 'A list of users',
                schema: z.object({
                    data: z.array(userSchema),
                    meta: z.object({
                        total: z.number(),
                        offset: z.number(),
                        limit: z.number()
                    })
                })
            }
        },
        tags: ['users']
    })


    registry.register({
        method: 'get',
        path: '/v1/users/:id',
        description: 'Get a user by ID',
        request: {
            params: z.object({
                id: z.string()
            }),
            query: userQuerySchema
        },
        responses: {
            200: {
                description: 'The user',
                schema: userSchema
            }
        },
        tags: ['users']
    })


    registry.register({
        method: 'post',
        path: '/v1/users',
        description: 'Create a new user',
        request: {
            body: createUserSchema
        },
        responses: {
            201: {
                description: 'The created user',
                schema: userSchema
            }
        },
        tags: ['users']
    })


    registry.register({
        method: 'put',
        path: '/v1/users/:id',
        description: 'Update a user',
        request: {
            params: z.object({
                id: z.string()
            }),
            body: updateUserSchema
        },
        responses: {
            200: {
                description: 'The updated user',
                schema: userSchema
            }
        },
        tags: ['users']
    })


    registry.register({
        method: 'delete',
        path: '/v1/users/:id',
        description: 'Delete a user',
        request: {
            params: z.object({
                id: z.string()
            })
        },
        responses: {
            204: {
                description: 'User deleted successfully',
                schema: z.void()
            }
        },
        tags: ['users']
    })

    registry.register({
        method: 'get',
        path: '/v1/users/:userId/posts',
        description: 'Get posts for a user',
        request: {
            params: z.object({
                userId: z.string()
            }),
            query: z.object({
                limit: z.number().optional(),
                offset: z.number().optional()
            })
        },
        responses: {
            200: {
                description: 'List of user posts',
                schema: z.array(z.object({
                    id: z.string(),
                    title: z.string(),
                    content: z.string(),
                    userId: z.string()
                }))
            }
        },
        tags: ['users', 'posts']
    })
}
