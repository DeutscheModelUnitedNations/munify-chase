import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { cors } from "@elysiajs/cors";
import { committee } from "./routes/committee";
import packagejson from "../package.json";
import { appConfiguration } from "./config/config";
import { errorLogging } from "./services/errorLogger";
import { conference } from "./routes/conference";
// import { conference } from "./routes/conference";

const m = new Elysia({
  cookie: {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: "strict",
    secure: true,
    sign: true,
    secrets: appConfiguration.cookieSecrets,
  },
})
  .use(errorLogging)
  .use(cors({ origin: appConfiguration.CORSOrigins }))
  .use(conference)
  .use(committee);

const app = new Elysia()
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
  .use(m)
  .listen(process.env.PORT ?? "3001");

console.info(
  `Swagger documentation available at http://localhost:${
    process.env.PORT ?? "3001"
  }/${appConfiguration.documentationPath}`,
);

export type App = typeof app;
