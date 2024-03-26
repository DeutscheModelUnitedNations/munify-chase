import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { appConfiguration } from "./util/config";
import { errorLogging } from "./util/errorLogger";
import { conference } from "./routes/conference";
import { conferenceMember } from "./routes/conferenceMember";
import { committee } from "./routes/committee";
import { baseData } from "./routes/baseData";
import { auth } from "./routes/auth/auth";
import { agendaItem } from "./routes/agendaItem";
import { delegation } from "./routes/delegation";
import { user } from "./routes/user";
import { speakersListGeneral } from "./routes/speakersList/general";
import { speakersListModification } from "./routes/speakersList/modification";
import { speakersListSpeakers } from "./routes/speakersList/speakers";
import { messages } from "./routes/messages";
import { time } from "./routes/time";
import packagejson from "../package.json";
import swagger from "@elysiajs/swagger";
import { logger } from "@grotto/logysia";
import { serverTiming } from "@elysiajs/server-timing";
import { helmet } from "elysia-helmet";
import { heapStats } from "bun:jsc";
// import { generateHeapSnapshot } from "bun";

setInterval(() => {
  console.log(`Heap size: ${heapStats().heapSize / 10000}`);
}, 1000);

const m = new Elysia()
  .use(serverTiming())
  .use(
    logger({
      logIP: false,

      writer: {
        write(msg: string) {
          console.info(msg);
        },
      },
    })
  )
  .use(helmet())
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
  .use(speakersListGeneral)
  .use(speakersListModification)
  .use(speakersListSpeakers)
  .use(messages)
  .use(user)
  .use(auth)
  .use(time)
  .use(baseData);

// we make the api docs public
// biome-ignore lint/suspicious/noExplicitAny: we explicitly dont want type checking here
(new Elysia() as any) // just disable the type check for this object, since the middleware is causing issues
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
  // .use(m)
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

export type App = typeof m;
