# chase-backend
The chase backend offers an API for providing the chase-frontend with data and allows for managing the required data.

## fastify
[fastify](https://fastify.dev/) is a web framework ecosystem for node.js. It provides the web server for the backend.
The server creation and configuration is done in [./src/main.ts](./src/main.ts).

### fastify-now
We use [fastify-now](https://github.com/yonathan06/fastify-now) for file system based routes. This allows to automacially make routes available based on the directory they are in. E.g. a `/auth/login.ts` file could export a `POST` const and therefore would be automatically available at `POST example.com/api/auth/login`.

## prisma
We use [prisma](https://www.prisma.io/) as a database orm. Since it is quite a complex topic and important that you understand the tool and its features, please make yourself familiar with it if you plan on changing database related things.

## zod
We use [zod](https://zod.dev/) for validating incoming requests against a schema. This ensures that incoming requests match what we expect at the endpoint.

### prisma generator for zod schemas
Prisma has support for custom generators. These can generate code based on the database schema from prisma. We use [this](https://github.com/chrishoermann/zod-prisma-types) to automatically generate schemas based on our database types. This reduces boilerplate code you otherwise would have to write manually.

## open api
While developing, the backend offers a swagger ui and open api documentation. This is automatically created based on the schemata and endpoints and does not have to be written manually. The frontend uses this to automatically create a strongly typed client to consume out API.
