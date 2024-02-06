import { t, Elysia } from "elysia";
import { db } from "../../prisma/db";
import { committeeRoleGuard } from "../auth/guards/committeeRoles";
import { conferenceRoleGuard } from "../auth/guards/conferenceRoles";
import { openApiTag } from "../util/openApiTags";
import { Delegation, Nation } from "../../prisma/generated/schema";

const DelegationBody = t.Pick(Nation, ["alpha3Code"]);

export const delegation = new Elysia({
  prefix: "/conference/:conferenceId",
})
  .use(conferenceRoleGuard)
  .use(committeeRoleGuard)
  .get(
    "/delegation",
    ({ params: { conferenceId } }) => {
      return db.delegation.findMany({
        where: {
          conferenceId,
        },
        include: {
          nation: true,
          members: true,
        },
      });
    },
    {
      hasConferenceRole: "any",
      detail: {
        description: "Get all delegations in this conference",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )
  .post(
    "/delegation",
    ({ body, params: { conferenceId } }) => {
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
      try {
        const res = await db.committeeMember.create({
          data: {
            committeeId,
            delegationId,
          },
        });
        return res;
      } catch (e) {
        if (e.code === "P2002") {
          return new Response(
            "Committee is already connected to this delegation",
            {
              status: 304,
            },
          );
        }
        throw e;
      }
    },
    {
      hasConferenceRole: ["ADMIN"],
      detail: {
        description:
          "Connect a committee to a delegation in this conference. If the committee is already connected to the delegation, return a 304 Not Modified Error Code.",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )
  .delete(
    "/delegation/:delegationId/committee/:committeeId",
    ({ params: { delegationId, committeeId } }) => {
      return db.committeeMember.deleteMany({
        where: {
          committeeId,
          delegationId,
        },
      });
    },
    {
      hasConferenceRole: ["ADMIN"],
      detail: {
        description:
          "Disconnect a committee from a delegation in this conference",
        tags: [openApiTag(import.meta.path)],
      },
    },
  );
