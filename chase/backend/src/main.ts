import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { appConfiguration } from "./util/config";
import { logger } from "./util/logger";
import packagejson from "../package.json";
import swagger from "@elysiajs/swagger";
import { helmet } from "elysia-helmet";
import { api } from "./api";

//TODO switch to new prismabox schema types
//TODO remove use of set where applicable

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
  .use(
    swagger({
      path: `/${appConfiguration.documentationPath}`,
      documentation: {
        info: {
          title: `${appConfiguration.appName} documentation`,
          description: `${appConfiguration.appName} documentation`,
          version: packagejson.version,
        },
      },
    }),
  )
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
  .use(api)
  .listen(process.env.PORT ?? "3001");

console.info("Api running on port", appConfiguration.port);

setTimeout(() => {
  console.info(
    `
      
      Swagger documentation available at http://localhost:${
        process.env.PORT ?? "3001"
      }/${appConfiguration.documentationPath}
      
      `,
  );
}, 3000);

if (appConfiguration.development) {
  setTimeout(() => {
    console.info(
      `
      
      Dummy emails sent to inbox at http://${appConfiguration.email.EMAIL_HOST}:3777
      
      `,
    );
  }, 3000);
}
