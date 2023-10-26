import conference from "./routes/conference";
import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { cors } from "@elysiajs/cors";
import committee from "./routes/conference/committee";
import packagejson from "../package.json";
import { isDevelopment } from "munify-util";

const app = new Elysia()
  .use(cors({ origin: process.env.ORIGIN ?? "http://localhost:3001" }))
  .use(conference)
  .use(committee);

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
