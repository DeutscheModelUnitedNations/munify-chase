import fastifyCookie from "@fastify/cookie";
import fastifySession from "@fastify/session";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import RedisStore from "connect-redis";
import Fastify, { FastifyInstance } from "fastify";
import fastifyNow from "fastify-now";
import { join } from "path";
import { createClient } from "redis";
import { PrismaClient } from "@prisma/client";
import { setDb, db } from "../prisma/client";

import "./types/types";

//TODO establish testing concept & coverage

/**
 * The server instance
 */
export let server: FastifyInstance;

(async () => {
  // ╔═══════════════╗
  // ║ Configuration ║
  // ╚═══════════════╝

  if (!process.env.PRODUCTION) {
    const { config: dotenv } = await import("dotenv");
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

  // ╔══════════════════════════════╗
  // ║ Prisma (database) connection ║
  // ╚══════════════════════════════╝

  // we populate the client inside the async main wrapper to ensure env vars are set when this is called since prisma depends on them

  //TODO document how to use prisma/migrations
  if (process.env.CI !== "true") {
    setDb(new PrismaClient());
  }

  // ╔════════════════════════╗
  // ║ Creating server object ║
  // ╚════════════════════════╝

  // TODO: make logger more readable in dev
  server = Fastify({
    logger: { level: "warn" },
  }).withTypeProvider<TypeBoxTypeProvider>();

  // ╔═══════════════════════════════════════════════════╗
  // ║ API documentation generation & serving (dev only) ║
  // ╚═══════════════════════════════════════════════════╝

  if (!process.env.PRODUCTION) {
    const swagger = await import("@fastify/swagger");
    const swaggerUi = await import("@fastify/swagger-ui");

    server.register(swagger.default);
    server.register(swaggerUi.default, {
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

  const redisUrl = process.env.REDIS_URL;
  if (redisUrl === undefined) {
    throw new Error(
      "Could not find REDIS_URL environment variable. Make sure it's set",
    );
  }

  // Initialize redis client
  const redisClient = createClient({
    url: redisUrl,
  });

  if (process.env.CI !== "true") {
    try {
      await redisClient.connect();
    } catch (error) {
      console.error("Could not connect to redis");
      throw error;
    }
  }

  // Initialize store
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
      // secure is only deactivated when running in dev
      secure: process.env.PRODUCTION === "true",
      sameSite: "strict",
      maxAge: 86400000, // 7 days
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

  try {
    await server.ready();
    if (!process.env.PRODUCTION) {
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
