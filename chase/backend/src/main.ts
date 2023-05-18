import Fastify, { FastifyInstance } from "fastify";

import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";

import login from "./routes/login";

//TODO get from env vars
const PORT = 3000;

const server: FastifyInstance = Fastify({
  logger: true,
});

server.register(swagger);
server.register(swaggerUi, {
  routePrefix: "/documentation",
  uiConfig: {
    docExpansion: "full",
    deepLinking: false,
  },
  uiHooks: {
    onRequest: function (request, reply, next) {
      next();
    },
    preHandler: function (request, reply, next) {
      next();
    },
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
  transformSpecification: (swaggerObject, request, reply) => {
    return swaggerObject;
  },
  transformSpecificationClone: true,
});
server.register(login);

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
