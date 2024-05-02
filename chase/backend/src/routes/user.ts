import { Elysia, t } from "elysia";
import { db } from "../../prisma/db";
import { openApiTag } from "../util/openApiTags";
import {
  Delegation,
  DelegationPlain,
} from "../../prisma/generated/schema/Delegation";
import { _Nullable } from "../../prisma/generated/schema/__nullable__";
import { permissionsPlugin } from "../auth/permissions";

export const user = new Elysia().use(permissionsPlugin).get(
  "/conference/:conferenceId/user/:userId/delegation",
  async ({ params: { conferenceId, userId }, permissions }) => {
    permissions.mustBeLoggedIn(); // TODO
    return await db.delegation.findFirst({
      where: {
        conferenceId,
        members: {
          some: {
            userId,
          },
        },
      },
      include: {
        nation: true,
      },
    });
  },
  {
    response: _Nullable(
      t.Composite([DelegationPlain, t.Pick(Delegation, ["nation"])]),
    ),
    detail: {
      description: "Get the delegation of a user in this conference",
      tags: [openApiTag(import.meta.path)],
    },
  },
);
