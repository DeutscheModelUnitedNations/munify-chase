import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { cors } from "@elysiajs/cors";
import { committee } from "./routes/committee";
import packagejson from "../package.json";
import { appConfiguration } from "./config/config";
// import { conference } from "./routes/conference";

const app = new Elysia({
  cookie: {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 5, // 5 days
    sameSite: "strict",
    secure: true,
    sign: true,
    secrets: appConfiguration.cookieSecrets,
  },
})
  .use(cors({ origin: appConfiguration.CORSOrigins }))
  // .use(conference)
  .use(committee);

if (appConfiguration.development) {
  app.use(
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
  );

  console.info(
    `Swagger documentation available at http://localhost:${
      process.env.PORT ?? "3001"
    }/${appConfiguration.documentationPath}`,
  );
}

app.listen(process.env.PORT ?? "3001");

export type App = typeof app;
