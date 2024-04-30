import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { appConfiguration } from "./util/config";
import { logger } from "./util/logger";
import { helmet } from "elysia-helmet";
import { GraphQLApi } from "./api";

setInterval(
  async () => {
    //TODO save these to a real volume mount (docker)
    const snapshot = Bun.generateHeapSnapshot();
    await Bun.write(
      `heapSnapshots/${Date.now()}.json`,
      JSON.stringify(snapshot, null, 2),
    );
    console.info("Heap snapshot taken");
  },
  1000 * 60 * 10,
); // every 10 minutes

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
      
      Dummy emails sent to inbox at http://${appConfiguration.email.EMAIL_HOST}:3777
      API explorer at http://localhost:${appConfiguration.port}/graphql
      
      `,
    );
  }, 3000);
}
