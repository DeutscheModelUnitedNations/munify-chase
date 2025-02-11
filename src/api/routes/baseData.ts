import {
  // t,
  Elysia,
} from "elysia";
import { db } from "../../../prisma/db";
import { openApiTag } from "../util/openApiTags";
// import { NationPlain } from "../../prisma/generated/schema/Nation";
import { permissionsPlugin } from "../auth/permissions";

export const baseData = new Elysia({ prefix: "/baseData" })
  .use(permissionsPlugin)
  .get(
    "/countries",
    ({ permissions }) => {
      permissions.mustBeLoggedIn();
      return db.nation.findMany();
    },
    {
      detail: {
        description: "Get all nations in the system",
        tags: [openApiTag(import.meta.filename)],
      },
    }
  );
