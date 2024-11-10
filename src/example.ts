import {createApiClient} from "./index.ts";


const client = createApiClient({
    baseURL: 'https://api.example.com',
})


console.log(await client.v1.users.listUsers({}))
