import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { appConfiguration } from "./util/config";
import { logger } from "./util/logger";
import { GraphQLApi } from "./api";
import { helmet } from "elysia-helmet";

//TODO robots.txt

export const server = new Elysia({
  normalize: true,
});

if (appConfiguration.production) {
  server.use(helmet());
}

server
  .use(logger)
  .use(
    cors({
      origin: appConfiguration.CORSOrigins,
      allowedHeaders: ["content-type"],
      methods: [
        "GET",
        "PUT",
        "POST",
        "DELETE",
        "PATCH",
        "HEAD",
        "OPTIONS",
        "TRACE",
        "CONNECT",
      ],
    }),
  )
  .use(GraphQLApi);