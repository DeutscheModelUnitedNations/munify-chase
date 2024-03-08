import { Elysia } from "elysia";
import { db } from "../../prisma/db";
import { committeeMemberGuard } from "../auth/guards/committeeMember";
import { conferenceRoleGuard } from "../auth/guards/conferenceRoles";
import { openApiTag } from "../util/openApiTags";

export const user = new Elysia({
  prefix: "/conference/:conferenceId",
})
  .use(conferenceRoleGuard)
  .use(committeeMemberGuard)
  .get(
    "/user/:userId/delegation",
    async ({ params: { conferenceId, userId } }) => {
      const committeeMember = await db.committeeMember.findFirst({
        where: {
          userId,
        },
      });
      return await db.delegation.findFirst({
        where: {
          conferenceId,
          id: committeeMember?.delegationId ?? "0",
        },
        include: {
          nation: true,
        },
      });
    },
    {
      hasConferenceRole: "any",
      detail: {
        description: "Get the delegation of a user in this conference",
        tags: [openApiTag(import.meta.path)],
      },
    },
  );
