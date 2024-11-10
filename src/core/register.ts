import { z } from 'zod';
import { RouteConfig } from './types';
import { registry } from './registry';

export function registerRoute<
    TParams extends z.ZodType | undefined,
    TQuery extends z.ZodType | undefined,
    TBody extends z.ZodType | undefined,
    TResponse extends z.ZodType | undefined
>(config: RouteConfig<TParams, TQuery, TBody, TResponse>): void {
    registry.register<TParams, TQuery, TBody, TResponse>(config);
}