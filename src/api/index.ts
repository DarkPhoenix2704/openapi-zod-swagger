import { registerUserRoutes } from './v1/users';
import Registry from "../core/registry.ts";

export function registerRoutes(registry: Registry) {
    registerUserRoutes(registry);
}