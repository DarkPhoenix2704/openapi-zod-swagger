import type { AxiosRequestConfig} from 'axios';
import axios from "axios";
import { registerRoutes } from './api';
import { VersionedApi } from './core/types';
import Registry from "./core/registry.ts";

export function createApiClient(config: AxiosRequestConfig = {}): VersionedApi {
    const apiClient = axios.create(config);
    const registry = new Registry(apiClient);
    registerRoutes(registry);

    return registry.routes;
}

export type { VersionedApi as Api };