import Fastify, { FastifyInstance } from "fastify";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import fastifyNow from "fastify-now";
import { join } from "path";
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'

//TODO get from env vars
const PORT = 3000;

const server: FastifyInstance = Fastify({
  logger: true,
}).withTypeProvider<TypeBoxTypeProvider>();

server.register(swagger);
server.register(swaggerUi, {
  routePrefix: "/documentation",
  uiConfig: {
    docExpansion: "full",
    deepLinking: false,
  },
});

server.register(fastifyNow, {
  routesFolder: join(__dirname, "./routes"),
  pathPrefix: "/api",
});

// wrap in an async function to allow top level async
(async () => {
  try {
    await server.ready();
    server.swagger();
    await server.listen({ port: PORT, host: "0.0.0.0" });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
})();
server.log.info(`server listening on ${server.server.address()}`);
