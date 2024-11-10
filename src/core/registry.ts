import {AxiosInstance, AxiosRequestConfig} from 'axios';
import { RouteConfig, RouteFunction, VersionedApi, HttpMethod } from './types';

export  default class Registry {
    routes: VersionedApi = {};
    private apiClient: AxiosInstance;

    constructor(apiClient: AxiosInstance) {
        this.apiClient = apiClient;
    }

    register<TParams, TQuery, TBody, TResponse>(
        config: RouteConfig<TParams, TQuery, TBody, TResponse>
    ): RouteFunction<TParams, TQuery, TBody, TResponse> {
        const routeFunction: RouteFunction<TParams, TQuery, TBody, TResponse> = async (
            params,
            query,
            body,
            axiosConfig?: AxiosRequestConfig
        ): Promise<TResponse> => {
            let url = config.path;
            if (params) {
                Object.entries(params).forEach(([key, value]) => {
                    url = url.replace(`:${key}`, encodeURIComponent(String(value)));
                });
            }

            const response = await this.apiClient.request({
                method: config.method,
                url,
                params: query,
                data: body,
                ...axiosConfig,
            });

            const responseConfig = config.responses[response.status];
            if (!responseConfig) {
                throw new Error(`Unexpected response status: ${response.status}`);
            }

            return responseConfig.schema.parse(response.data);
        };

        const version = config.path.split('/')[1]; // Assuming the version is always the first part of the path
        const resource = config.tags[0] || 'default';

        if (!this.routes[version]) {
            this.routes[version] = {};
        }
        if (!this.routes[version][resource]) {
            this.routes[version][resource] = {};
        }
        this.routes[version][resource][config.name] = routeFunction;

        return routeFunction;
    }
}
