import { edenTreaty } from "@elysiajs/eden";
import { App } from "../../backend/src/main";

export const backend = edenTreaty<App>(
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3001",
  {
    $fetch: {
      credentials: "include",
    },
  },
);
