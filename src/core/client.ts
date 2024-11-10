import { z } from 'zod';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { registry } from './registry';

export class ApiError extends Error {
    constructor(
        public status: number,
        public code: string,
        public data?: unknown
    ) {
        super(`API Error ${status}: ${code}`);
        this.name = 'ApiError';
    }
}

export class ValidationError extends Error {
    constructor(public errors: z.ZodError) {
        super('Validation failed');
        this.name = 'ValidationError';
    }
}

interface ClientConfig extends AxiosRequestConfig {
    baseURL: string;
    defaultHeaders?: Record<string, string>;
}

export class ApiClient {
    private axios: AxiosInstance;

    constructor(config: ClientConfig) {
        this.axios = axios.create({
            baseURL: config.baseURL,
            headers: config.defaultHeaders
        });
    }

    async request<T = any>(
        method: string,
        path: string,
        options: {
            params?: Record<string, any>;
            query?: Record<string, any>;
            body?: any;
            headers?: Record<string, any>;
        } = {}
    ): Promise<T> {
        const route = registry.getRoute(method, path);
        if (!route) {
            throw new Error(`Route not found: ${method} ${path}`);
        }

        try {
            // Validate inputs
            if (route.request?.params && options.params) {
                route.request.params.parse(options.params);
            }
            if (route.request?.query && options.query) {
                route.request.query.parse(options.query);
            }
            if (route.request?.body && options.body) {
                route.request.body.parse(options.body);
            }

            const interpolatedPath = this.interpolatePath(path, options.params || {});

            const response = await this.axios.request({
                method: route.method,
                url: interpolatedPath,
                params: options.query,
                data: options.body,
                headers: options.headers,
            });

            const responseConfig = route.responses[response.status];
            if (!responseConfig || !responseConfig.schema) {
                throw new ApiError(response.status, 'UNEXPECTED_STATUS');
            }

            return responseConfig.schema.parse(response.data);

        } catch (error) {
            if (error instanceof z.ZodError) {
                throw new ValidationError(error);
            }
            throw error;
        }
    }

    private interpolatePath(path: string, params: Record<string, any>): string {
        return path.replace(/:([a-zA-Z][a-zA-Z0-9_]*)/g, (_, key) => {
            if (!(key in params)) {
                throw new Error(`Missing path parameter: ${key}`);
            }
            return encodeURIComponent(params[key]);
        });
    }
}

export function createClient(config: ClientConfig) {
    const client = new ApiClient(config);

    return new Proxy({}, {
        get(_, version: string) {
            return new Proxy({}, {
                get(_, resource: string) {
                    return new Proxy({}, {
                        get(_, operation: string) {
                            return (params?: any, query?: any, body?: any) => {
                                const path = `/${version}/${resource}${operation === 'index' ? '' : `/${operation}`}`;
                                const method = getMethodFromOperation(operation);
                                return client.request(method, path, { params, query, body });
                            };
                        },
                    });
                },
            });
        },
    });
}

function getMethodFromOperation(operation: string): string {
    const methodMap: Record<string, string> = {
        index: 'get',
        show: 'get',
        create: 'post',
        update: 'put',
        patch: 'patch',
        destroy: 'delete'
    };
    return methodMap[operation] || 'get';
}
