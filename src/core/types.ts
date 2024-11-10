import { z } from 'zod';

export type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

export type InferZodType<T extends z.ZodType | undefined> =
    T extends z.ZodType ? z.infer<T> : never;

export interface RouteConfig<
    TParams extends z.ZodType | undefined = undefined,
    TQuery extends z.ZodType | undefined = undefined,
    TBody extends z.ZodType | undefined = undefined,
    TResponse extends z.ZodType | undefined = undefined
> {
    method: HttpMethod;
    path: string;
    description?: string;
    request?: {
        params?: TParams;
        query?: TQuery;
        body?: TBody;
    };
    responses: {
        [statusCode: number]: {
            description: string;
            schema: TResponse;
        };
    };
    tags?: string[];
}