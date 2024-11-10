import { z } from 'zod';
import { AxiosRequestConfig } from 'axios';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface RouteConfig<TParams, TQuery, TBody, TResponse> {
    name: string;
    method: HttpMethod;
    version: string;
    path: string;
    description: string;
    request?: {
        params?: z.ZodType<TParams>;
        query?: z.ZodType<TQuery>;
        body?: z.ZodType<TBody>;
    };
    responses: {
        [statusCode: number]: {
            description: string;
            schema: z.ZodType<TResponse>;
        };
    };
    tags: string[];
}

export type RouteFunction<TParams, TQuery, TBody, TResponse> = (
    params?: TParams,
    query?: TQuery,
    body?: TBody,
    config?: AxiosRequestConfig
) => Promise<TResponse>;

export interface VersionedApi {
    [version: string]: {
        [resource: string]: {
            [name: string]: RouteFunction<any, any, any, any>;
        };
    };
}