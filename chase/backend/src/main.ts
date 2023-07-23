import Fastify, {FastifyInstance} from "fastify";
import fastifyNow from "fastify-now";
import {join} from "path";
import {PrismaClient} from "@prisma/client";
import cors from "@fastify/cors";
import {setDb, db} from "../prisma/client";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
//TODO establish testing concept & coverage

export const isProd = process.argv.includes("--prod");

/**
 * The server instance
 */
export let server: FastifyInstance;

(async () => {
  // ╔═══════════════╗
  // ║ Configuration ║
  // ╚═══════════════╝

  if (!isProd) {
    const {config: dotenv} = await import("dotenv");
    // load environment variables from .env file during development
    // in production, environment variables are set by the host
    dotenv({path: join(__dirname, "../.env")});
    console.warn("WARNING: Loaded env vars from .env file. This is intended for development only!");
  }

  let PORT = 0;
  if (process.env.PORT === undefined) {
    throw new Error(
      "Please make sure the PORT environment variable is set to a valid port number",
    );
  }
  PORT = Number.parseInt(process.env.PORT);

  // ╔══════════════════════════════╗
  // ║ Prisma (database) connection ║
  // ╚══════════════════════════════╝

  // we populate the client inside the async main wrapper to ensure env vars are set when this is called since prisma depends on them
  if (process.env.CI !== "true") {
    setDb(new PrismaClient());
  }

  // ╔════════════════════════╗
  // ║ Creating server object ║
  // ╚════════════════════════╝

  server = Fastify({
    exposeHeadRoutes: false,
    logger: {
      level: "warn",
      transport: {
        target: "pino-pretty",
        options: {
          translateTime: "HH:MM:ss Z",
          ignore: "pid,hostname",
        },
      },
    },
  }).withTypeProvider<ZodTypeProvider>() as unknown as FastifyInstance;

  // ╔═══════════════════╗
  // ║ Schema validation ║
  // ╚═══════════════════╝

  // schema validation is the process of checking the incoming request for correct structure
  // this enables validation globally
  server.setValidatorCompiler(validatorCompiler);
  server.setSerializerCompiler(serializerCompiler);

  // ╔═══════════════════════════════════════════════════╗
  // ║ API documentation generation & serving (dev only) ║
  // ╚═══════════════════════════════════════════════════╝

  if (!isProd) {
    const swagger = await import("@fastify/swagger");
    const swaggerUi = await import("@fastify/swagger-ui");

    server.register(swagger.default, {
      transform: jsonSchemaTransform,
    });
    server.register(swaggerUi.default, {
      routePrefix: "/documentation",
      uiConfig: {
        docExpansion: "full",
        deepLinking: false,
      },
    });

    // rome-ignore lint: console output is intended
    console.log(`
╔══════════════════════════════════════════════════════════════════╗
║ Serving API documentation on http://localhost:${PORT}/documentation ║
╚══════════════════════════════════════════════════════════════════╝
`);
  }

  // ╔═════════════════╗
  // ║ set CORS config ║
  // ╚═════════════════╝

  await server.register(cors, {
    origin: ["http://localhost:3000"], //TODO set prod values
  });

  // ╔══════════════════════════════════════╗
  // ║ File system based route registration ║
  // ╚══════════════════════════════════════╝

  // we use file system based routing for the API
  // this configures the routes directory to provide the API structure
  server.register(fastifyNow, {
    routesFolder: join(__dirname, "./routes"),
    pathPrefix: "/api",
  });

  // ╔════════════════╗
  // ║ Run the server ║
  // ╚════════════════╝

  try {
    await server.ready();
    if (!isProd) {
      server.swagger();
    }
    console.info(`Running on port ${PORT}`);
    await server.listen({port: PORT, host: "0.0.0.0"});
    db?.$disconnect();
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
})();

console.info("Starting server...");
