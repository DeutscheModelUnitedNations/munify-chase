import { Elysia, t } from "elysia";
import { openApiTag } from "../util/openApiTags";
import { loggedInGuard } from "../auth/guards/loggedIn";

export const time = new Elysia().use(loggedInGuard).get(
  "/timestamp",
  async () => {
    return Date.now();
  },
  {
    mustBeLoggedIn: true,
    response: t.Number(),
    detail: {
      description:
        "Get the timestamp of the current time in the backend. Can be used for sync with frontend system timers",
      tags: [openApiTag(import.meta.path)],
    },
  },
);
