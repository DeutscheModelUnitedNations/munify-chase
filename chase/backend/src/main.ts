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
import { helmet } from "elysia-helmet";

//TODO switch to new prismabox schema types
//TODO remove use of set where applicable

setInterval(
  async () => {
    const snapshot = Bun.generateHeapSnapshot();
    await Bun.write(
      `heapSnapshots/${Date.now()}.json`,
      JSON.stringify(snapshot, null, 2)
    );
    console.info("Heap snapshot taken");
  },
  1000 * 60 * 10
); // every 10 minutes

const m = new Elysia({
  normalize: true,
})
  .use(helmet())
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
  .use(errorLogging)
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
  .use(baseData)
  .get("/", () => ({
    production: appConfiguration.production,
    name: appConfiguration.appName,
    version: packagejson.version,
  }))
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
