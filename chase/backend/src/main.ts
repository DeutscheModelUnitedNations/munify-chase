import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { cors } from "@elysiajs/cors";
import conference from "./routes/conference";
import committee from "./routes/conference/committee";
import team from "./routes/conference/team";
import delegations from "./routes/conference/delegations";
import packagejson from "../package.json";
import { isDevelopment } from "munify-util";

const app = new Elysia()
  .use(cors({ origin: "*" }))
  .use(conference)
  .use(committee)
  .use(team)
  .use(delegations);

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
