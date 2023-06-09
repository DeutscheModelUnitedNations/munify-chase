import fastifyCookie from "@fastify/cookie";
import fastifySession from "@fastify/session";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import RedisStore from "connect-redis";
import { config as dotenv } from "dotenv";
import Fastify, { FastifyInstance } from "fastify";
import fastifyNow from "fastify-now";
import { join } from "path";
import { createClient } from "redis";

import { db } from "../prisma/client";

//TODO establish testing concept & coverage

// ╔═══════════════╗
// ║ Configuration ║
// ╚═══════════════╝

const LOAD_ENV_VARS_FROM_FILE =
  process.argv.find((a) => a === "--load-env-vars-from-file") !== undefined;

if (LOAD_ENV_VARS_FROM_FILE) {
  // load environment variables from .env file during development
  // in production, environment variables are set by the host
  dotenv({ path: join(__dirname, "../.env") });
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

export const server: FastifyInstance = Fastify({
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

// ╔══════════════════════╗
// ║ Import hooks & types ║
// ╚══════════════════════╝

import "./hooks/hooks";

// ╔═════════════════════════════════════════╗
// ║ Cookie parsing & Session initialization ║
// ╚═════════════════════════════════════════╝

server.register(fastifyCookie, {});

const redisUrl = process.env.REDIS_URL;
if (redisUrl === undefined) {
  throw new Error(
    "Could not find REDIS_URL environment variable. Make sure it's set",
  );
}

// Initialize redis client.
const redisClient = createClient({
  url: redisUrl,
});
redisClient.connect().catch(console.error);

// Initialize store.
const redisStore = new RedisStore({
  client: redisClient,
  prefix: "chase-session:",
});

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
    console.log(`Running on port ${PORT}`);
    await server.listen({ port: PORT, host: "0.0.0.0" });
    db.$disconnect();
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
})();

console.log("Starting server...");
