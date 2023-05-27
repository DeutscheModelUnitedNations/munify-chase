import Fastify, { FastifyInstance } from "fastify";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import fastifyNow from "fastify-now";
import fastifySession from "@fastify/session";
import fastifyCookie from "@fastify/cookie";
import { join } from "path";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import dotenv from "dotenv";

// ╔═══════════════╗
// ║ Configuration ║
// ╚═══════════════╝

const LOAD_ENV_VARS_FROM_FILE =
  process.argv.find((a) => a === "--load-env-vars-from-file") !== undefined;

if (LOAD_ENV_VARS_FROM_FILE) {
  dotenv.config();
}

let PORT = 0;
if (process.env.PORT === undefined) {
  throw new Error(
    "Please make sure the PORT environment variable is set to a valid port number",
  );
}
PORT = Number.parseInt(process.env.PORT);

// ╔════════════════════════╗
// ║ Creating server object ║
// ╚════════════════════════╝
//TODO make the logger non ugly: https://www.fastify.io/docs/latest/Reference/Logging/
const server: FastifyInstance = Fastify({
  logger: { level: "warn" },
}).withTypeProvider<TypeBoxTypeProvider>();

// ╔═══════════════════════════════════════════════════╗
// ║ API documentation generation & serving (dev only) ║
// ╚═══════════════════════════════════════════════════╝

const SERVE_DOCUMENTATION =
  process.argv.find((a) => a === "--serve-documentation") !== undefined;

if (SERVE_DOCUMENTATION) {
  server.register(swagger);
  server.register(swaggerUi, {
    routePrefix: "/documentation",
    uiConfig: {
      docExpansion: "full",
      deepLinking: false,
    },
  });

  console.log(`
╔══════════════════════════════════════════════════════════════════╗
║ Serving API documentation on http://localhost:${PORT}/documentation ║
╚══════════════════════════════════════════════════════════════════╝
`);
}

// ╔═════════════════════════════════════════╗
// ║ Cookie parsing & Session initialization ║
// ╚═════════════════════════════════════════╝

server.register(fastifyCookie);
const sessionSecret = process.env.SESSION_SECRET;
if (sessionSecret === undefined) {
  throw new Error(
    "Could not find session secret in environment variable. Make sure that the 'SESSION_SECRET' environment variable is set and a secure string with more than 21 characters.",
  );
}
server.register(fastifySession, {
  secret: sessionSecret,
});

// ╔══════════════════════════════════════╗
// ║ File system based route registration ║
// ╚══════════════════════════════════════╝

server.register(fastifyNow, {
  routesFolder: join(__dirname, "./routes"),
  pathPrefix: "/api",
});

// ╔════════════════╗
// ║ Run the server ║
// ╚════════════════╝

// wrap in an async function to allow top level async
(async () => {
  try {
    await server.ready();
    if (SERVE_DOCUMENTATION) {
      server.swagger();
    }
    await server.listen({ port: PORT, host: "0.0.0.0" });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
})();

console.log(`Starting server...`);