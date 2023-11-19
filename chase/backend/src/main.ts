import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { isDevelopment } from "munify-util";
import packagejson from "../package.json";
import baseData from "./routes/baseData";
import conference from "./routes/conference";
import committee from "./routes/conference/committee";
import delegations from "./routes/conference/delegations";
import team from "./routes/conference/team";

const app = new Elysia()
  .use(cors({ origin: "*" }))
  .use(conference)
  .use(committee)
  .use(team)
  .use(delegations)
  .use(baseData);

export type App = typeof app;

if (isDevelopment()) {
  app.use(
    swagger({
      path: "/documentation",
      documentation: {
        info: {
          title: "CHASE backend Docs",
          description: "CHASE backend documentation",
          version: packagejson.version,
        },
      },
    })
  );
}

app.listen(process.env.PORT ?? "3001");
