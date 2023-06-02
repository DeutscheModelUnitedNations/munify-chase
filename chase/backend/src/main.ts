import fastifyCookie from "@fastify/cookie";
import fastifySession from "@fastify/session";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import RedisStore from "connect-redis";
import dotenv from "dotenv";
import Fastify, { FastifyInstance } from "fastify";
import fastifyNow from "fastify-now";
import { join } from "path";
import { createClient } from "redis";

// ╔═══════════════╗
// ║ Configuration ║
// ╚═══════════════╝

const LOAD_ENV_VARS_FROM_FILE =
  process.argv.find((a) => a === "--load-env-vars-from-file") !== undefined;

if (LOAD_ENV_VARS_FROM_FILE) {
  // load environment variables from .env file during development
  // in production, environment variables are set by the host
  dotenv.config({ path: join(__dirname, "../.env") });
}

// TODO: extract redis configuration into a separate file
// Initialize redis client.
const redisClient = createClient();
redisClient.connect().catch(console.error);

// Initialize store.
const redisStore = new RedisStore({
  client: redisClient,
  prefix: "myapp:",
});

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

if (process.env.SERVE_DOCUMENTATION) {
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

server.register(fastifyCookie, {});
const sessionSecret = process.env.SESSION_SECRET;
if (sessionSecret === undefined) {
  throw new Error(
    "Could not find session secret in environment variable. Make sure that the 'SESSION_SECRET' environment variable is set and a secure string with more than 21 characters.",
  );
}

server.register(fastifySession, {
  secret: sessionSecret,
  cookie: {
    httpOnly: true,
    // secure is only deactivated when running in dev (env var 'SECURE_COOKIE' is set to 'false')
    secure: process.env.SECURE_COOKIE !== "false",
    sameSite: "strict",
  },
  store: redisStore,
  saveUninitialized: false, // recommended: only save session when data exists
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
    if (process.env.SERVE_DOCUMENTATION) {
      server.swagger();
    }
    await server.listen({ port: PORT, host: "0.0.0.0" });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
})();

console.log("Starting server...");
