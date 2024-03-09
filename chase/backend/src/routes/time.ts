import { Elysia, t } from "elysia";
import { openApiTag } from "../util/openApiTags";

export const time = new Elysia().get(
  "/timestamp",
  async () => {
    return Date.now();
  },
  {
    response: t.Number(),
    detail: {
      description:
        "Get the timestamp of the current time in the backend. Can be used for sync with frontend system timers",
      tags: [openApiTag(import.meta.path)],
    },
  },
);
