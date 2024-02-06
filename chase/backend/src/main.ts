import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { cors } from "@elysiajs/cors";
import packagejson from "../package.json";
import { appConfiguration } from "./util/config";
import { errorLogging } from "./util/errorLogger";
import { conference } from "./routes/conference";
import { conferenceMember } from "./routes/conferenceMember";
import { committee } from "./routes/committee";
import { baseData } from "./routes/baseData";
import { auth } from "./routes/auth/auth";
import { agendaItem } from "./routes/agendaItem";
import { delegation } from "./routes/delegation";

const m = new Elysia({
  cookie: {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: appConfiguration.development ? "none" : "strict",
    secure: !appConfiguration.development,
    sign: true,
    secrets: appConfiguration.cookie.secrets,
  },
})
  .use(errorLogging)
  .use(
    // @ts-ignore
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
    })
  )
  .use(conference)
  .use(conferenceMember)
  .use(committee)
  .use(delegation)
  .use(agendaItem)
  .use(auth)
  .use(baseData);

// we make the api docs public
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
    })
  )
  .use(m)
  .listen(process.env.PORT ?? "3001");

setTimeout(() => {
  console.info(
    `
      
      Swagger documentation available at http://localhost:${
        process.env.PORT ?? "3001"
      }/${appConfiguration.documentationPath}
      
      `
  );
}, 3000);

if (appConfiguration.development) {
  setTimeout(() => {
    console.info(
      `
      
      Dummy emails sent to inbox at http://${appConfiguration.email.EMAIL_HOST}:3777
      
      `
    );
  }, 3000);
}

export type App = typeof app;
