import { Elysia, t } from "elysia";
import { db } from "../../prisma/db";
import { conferenceRoleGuard } from "../auth/guards/conferenceRoles";
import { openApiTag } from "../util/openApiTags";
import {
  Delegation,
  DelegationPlain,
} from "../../prisma/generated/schema/Delegation";
import { Nullable } from "../../prisma/generated/schema/__nullable__";

export const user = new Elysia({
  prefix: "/conference/:conferenceId",
})
  .use(conferenceRoleGuard)
  .get(
    "/user/:userId/delegation",
    async ({ params: { conferenceId, userId } }) => {
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
      hasConferenceRole: "any",
      response: Nullable(
        t.Composite([DelegationPlain, t.Pick(Delegation, ["nation"])]),
      ),
      detail: {
        description: "Get the delegation of a user in this conference",
        tags: [openApiTag(import.meta.path)],
      },
    },
  );
