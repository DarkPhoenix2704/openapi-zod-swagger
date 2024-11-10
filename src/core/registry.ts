import { RouteConfig } from './types';
import {z} from "zod";

export class RouteRegistry {
    private static instance: RouteRegistry;
    private routes: Map<string, RouteConfig<any, any, any, any>> = new Map();
    private routesByVersion: Map<string, Map<string, RouteConfig<any, any, any, any>>> = new Map();

    private constructor() {}

    static getInstance(): RouteRegistry {
        if (!RouteRegistry.instance) {
            RouteRegistry.instance = new RouteRegistry();
        }
        return RouteRegistry.instance;
    }

    register<
        TParams extends z.ZodType | undefined,
        TQuery extends z.ZodType | undefined,
        TBody extends z.ZodType | undefined,
        TResponse extends z.ZodType | undefined
    >(config: RouteConfig<TParams, TQuery, TBody, TResponse>): void {
        const key = this.createRouteKey(config.method, config.path);
        this.routes.set(key, config);

        const version = this.extractVersion(config.path);
        if (!this.routesByVersion.has(version)) {
            this.routesByVersion.set(version, new Map());
        }
        this.routesByVersion.get(version)!.set(key, config);
    }

    getRoute(method: string, path: string): RouteConfig<any, any, any, any> | undefined {
        const key = this.createRouteKey(method, path);
        return this.routes.get(key);
    }

    private createRouteKey(method: string, path: string): string {
        return `${method.toUpperCase()}:${path}`;
    }

    private extractVersion(path: string): string {
        const matches = path.match(/^\/v(\d+)/);
        return matches ? `v${matches[1]}` : 'default';
    }
}

export const registry = RouteRegistry.getInstance();
