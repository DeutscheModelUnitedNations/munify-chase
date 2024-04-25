import { t, Elysia } from "elysia";
import { db } from "../../prisma/db";
import { openApiTag } from "../util/openApiTags";
import { Nation } from "../../prisma/generated/schema/Nation";
import { CommitteeMember } from "../../prisma/generated/schema/CommitteeMember";
import { permissionsPlugin } from "../auth/permissions";

const DelegationBody = t.Pick(Nation, ["alpha3Code"]);

export const delegation = new Elysia({
  prefix: "/conference/:conferenceId",
})
  .use(permissionsPlugin)
  .get(
    "/delegation",
    ({ params: { conferenceId }, permissions }) => {
      return db.delegation.findMany({
        where: {
          conferenceId,
          AND: [permissions.allowDatabaseAccessTo("list").Delegation],
        },
        include: {
          nation: true,
          members: true,
        },
      });
    },
    {
      detail: {
        description: "Get all delegations in this conference",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )
  .post(
    "/delegation",
    ({ body, params: { conferenceId }, permissions }) => {
      permissions.checkIf((user) => user.can("create", "Delegation"));
      return db.delegation.create({
        data: {
          conference: { connect: { id: conferenceId } },
          nation: { connect: { alpha3Code: body.alpha3Code } },
        },
      });
    },
    {
      hasConferenceRole: ["ADMIN"],
      body: DelegationBody,
      detail: {
        description: "Create a new delegation in this conference",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )
  .get(
    "/delegation/:delegationId",
    ({ params: { delegationId } }) => {
      return db.delegation.findUnique({
        where: {
          id: delegationId,
        },
        include: {
          members: true,
        },
      });
    },
    {
      hasConferenceRole: "any",
      detail: {
        description: "Get a specific delegation in this conference",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )
  .delete(
    "/delegation/:delegationId",
    ({ params: { delegationId } }) => {
      return db.$transaction([
        db.committeeMember.deleteMany({
          where: {
            id: delegationId,
          },
        }),
        db.delegation.delete({
          where: {
            id: delegationId,
          },
        }),
      ]);
    },
    {
      hasConferenceRole: ["ADMIN"],
      detail: {
        description:
          "Delete a delegation and all its committee members in this conference",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )
  .post(
    "/delegation/:delegationId/committee/:committeeId",
    async ({ params: { delegationId, committeeId } }) => {
      const committeeMember = await db.committeeMember.findFirst({
        where: {
          committeeId,
          delegationId,
        },
      });

      if (committeeMember) {
        return db.committeeMember.delete({
          where: {
            id: committeeMember.id,
          },
        });
      }

      return await db.committeeMember.create({
        data: {
          committeeId,
          delegationId,
        },
      });
    },
    {
      hasConferenceRole: ["ADMIN"],
      detail: {
        description:
          "Connect a committee to a delegation in this conference. If the committee is already connected to the delegation, it will be disconnected.",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )

  // Presence
  .post(
    "/delegation/:delegationId/presence/:memberId",
    ({ body, params: { delegationId, memberId } }) => {
      return db.delegation.update({
        where: {
          id: delegationId,
        },
        data: {
          members: {
            update: {
              where: {
                id: memberId,
              },
              data: {
                presence: body.presence,
              },
            },
          },
        },
      });
    },
    {
      hasConferenceRole: ["ADMIN"],
      body: t.Pick(CommitteeMember, ["presence"]),
      detail: {
        description: "Update a member's presence in a delegation",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )

  .post(
    "/committee/:committeeId/presence/allAbsent",
    async ({ params: { committeeId } }) => {
      return await db.committeeMember.updateMany({
        where: {
          committeeId,
        },
        data: {
          presence: "ABSENT",
        },
      });
    },
    {
      hasConferenceRole: ["ADMIN", "CHAIR"],
      detail: {
        description:
          "Get all delegations in a committee with all members absent",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )
  .post(
    "/committee/:committeeId/presence/allPresent",
    async ({ params: { committeeId } }) => {
      return await db.committeeMember.updateMany({
        where: {
          committeeId,
        },
        data: {
          presence: "PRESENT",
        },
      });
    },
    {
      hasConferenceRole: ["ADMIN", "CHAIR"],
      detail: {
        description:
          "Get all delegations in a committee with all members absent",
        tags: [openApiTag(import.meta.path)],
      },
    },
  );
