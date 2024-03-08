import { t, Elysia } from "elysia";
import { db } from "../../prisma/db";
import { loggedInGuard } from "../auth/guards/loggedIn";
import { Nation } from "../../prisma/generated/schema";
import { openApiTag } from "../util/openApiTags";

export const baseData = new Elysia({ prefix: "/baseData" })
  .use(loggedInGuard)
  .get(
    "/countries",
    () => db.nation.findMany({ select: { id: true, alpha3Code: true } }),
    {
      mustBeLoggedIn: true,
      response: t.Array(t.Omit(Nation, ["delegations"])),
      detail: {
        description: "Get all nations in the system",
        tags: [openApiTag(import.meta.path)],
      },
    },
  );
