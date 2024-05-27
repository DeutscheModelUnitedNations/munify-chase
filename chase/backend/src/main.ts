import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { appConfiguration } from "./util/config";
import { logger } from "./util/logger";
import { GraphQLApi } from "./api";
import { helmet } from "elysia-helmet";

//TODO robots.txt

const app = new Elysia({
  normalize: true,
});

if (appConfiguration.production) {
  app.use(helmet());
}

app
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
  .use(GraphQLApi)
  .listen(process.env.PORT ?? "3001");

console.info("Api running on port", appConfiguration.port);

if (appConfiguration.development) {
  setTimeout(() => {
    console.info(
      `
      API explorer at http://localhost:${appConfiguration.port}/graphql
      `,
    );
  }, 3000);
}
