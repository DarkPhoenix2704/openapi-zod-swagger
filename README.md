# Type-Safe API Client Template

A copy-paste template for creating strongly-typed API clients with built-in request/response validation.

## Features

- 🔒 Type-safe API calls
- ✅ Request and response validation using Zod schemas
- 📦 Version-aware API routing
- 🔄 Automatic response parsing
- 🛠️ Built on Axios for reliable HTTP requests
- 🎯 Resource-based route organization

## Usage

### 1. Copy the Required Files

Copy the following structure to your project:

```
src/
├── api/
│   ├── index.ts
│   └── v1/
│       └── users/
│           ├── index.ts
│           └── schema.ts
├── core/
│   ├── registry.ts
│   └── types.ts
└── index.ts
```

### 2. Install Dependencies

```bash
npm install axios zod
# or
yarn add axios zod
```

### 3. Initialize Client

```typescript
import { createApiClient } from './path-to/api-client';

// Create an API client instance
const api = createApiClient({
  baseURL: 'https://api.example.com',
  headers: {
    'Authorization': 'Bearer your-token'
  }
});
```

### 4. Use the Client

```typescript
// Example: List users
async function getUsers() {
  try {
    const response = await api.v1.users.listUsers(
      undefined, // params
      { limit: 10, offset: 0 } // query
    );
    console.log(response.data);
  } catch (error) {
    console.error('Failed to fetch users:', error);
  }
}
```

## Adding New Routes

### 1. Create Schema File

```typescript
// src/api/v1/posts/schema.ts
import { z } from 'zod';

export const postSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  authorId: z.string()
});

export const createPostSchema = postSchema.omit({
  id: true
});
```

### 2. Create Route File

```typescript
// src/api/v1/posts/index.ts
import Registry from '../../../core/registry';
import { postSchema, createPostSchema } from './schema';
import { z } from 'zod';

export function registerPostRoutes(registry: Registry) {
  registry.register({
    name: 'createPost',
    method: 'POST',
    version: 'v1',
    path: '/v1/posts',
    description: 'Create a new post',
    request: {
      body: createPostSchema
    },
    responses: {
      201: {
        description: 'The created post',
        schema: postSchema
      }
    },
    tags: ['posts']
  });
}
```

### 3. Register Routes

```typescript
// src/api/index.ts
import { registerUserRoutes } from './v1/users';
import { registerPostRoutes } from './v1/posts';
import Registry from "../core/registry";

export function registerRoutes(registry: Registry) {
    registerUserRoutes(registry);
    registerPostRoutes(registry);
}
```

## Current Limitations

- Native type inference is not yet complete and work in progress
- Response types must be explicitly defined
- No built-in support for file uploads
- Limited error type definitions

## Configuration

The client accepts Axios request config options:

```typescript
const api = createApiClient({
  baseURL: 'https://api.example.com',
  timeout: 5000,
  headers: {
    'Authorization': 'Bearer token'
  }
});
```

## Error Handling

```typescript
try {
  const users = await api.v1.users.listUsers();
} catch (error) {
  if (error instanceof z.ZodError) {
    // Handle validation error
    console.error('Response validation failed:', error.errors);
  } else {
    // Handle other errors (network, etc.)
    console.error('Request failed:', error);
  }
}
```

## Customization

You can modify the core files to add additional functionality:

- Add middleware support in `registry.ts`
- Extend error handling in the request function
- Add custom validation rules to schemas
- Implement caching mechanisms
- Add request/response interceptors

## Contributing

This is a template library - fork it and customize it for your needs! Feel free to share improvements through issues and pull requests.

## License

MIT License