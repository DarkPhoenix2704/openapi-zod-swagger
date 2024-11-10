import {createClient} from "./core/client.ts";
import { registerRoutes } from "./api";

// Register all routes first
registerRoutes();

// Export the client creator
export { createClient };