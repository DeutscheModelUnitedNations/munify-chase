import { t, Elysia } from "elysia";
import { db } from "../../prisma/db";
import { conferenceRoleGuard } from "../auth/guards/conferenceRoles";
import { ConferenceMember } from "../../prisma/generated/schema";
import { openApiTag } from "../util/openApiTags";
import { loggedInGuard } from "../auth/guards/loggedIn";
import { committeeMemberGuard } from "../auth/guards/committeeMember";

const ConferenceMembersWithoutRelations = t.Omit(ConferenceMember, [
  "user",
  "conference",
]);

const ConferenceMemberCreationBody = t.Object({
  data: t.Pick(ConferenceMember, ["role"]),
  count: t.Number({ default: 1, minimum: 1 }),
});

export const conferenceMember = new Elysia({
  prefix: "/conference/:conferenceId",
})
  .use(loggedInGuard)
  .use(conferenceRoleGuard)
  .use(committeeMemberGuard)
  .get(
    "/member",
    ({ params: { conferenceId } }) => {
      return db.conferenceMember.findMany({
        where: {
          conferenceId,
        },
      });
    },
    {
      hasConferenceRole: ["ADMIN"],
      response: [ConferenceMembersWithoutRelations],
      detail: {
        description: "Get all conference-members in this conference",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )
  .post(
    "/member",
    ({ params: { conferenceId }, body }) => {
      return db.conferenceMember.createMany({
        data: new Array(body.count).fill({
          role: body.data.role,
          conferenceId,
        }),
      });
    },
    {
      hasConferenceRole: ["ADMIN"],
      response: [ConferenceMembersWithoutRelations],
      body: ConferenceMemberCreationBody,
      detail: {
        description:
          "Create a new conference-member in this conference. Must provide a role and count (how many members of this role to create) in the body.",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )
  .delete(
    "/member",
    ({ params: { conferenceId } }) => {
      return db.conferenceMember.deleteMany({
        where: {
          conferenceId,
        },
      });
    },
    {
      hasConferenceRole: ["ADMIN"],
      detail: {
        description: "Delete all conference-members in this conference",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )
  .delete(
    "/member/:memberId",
    ({ params: { memberId } }) => {
      return db.conferenceMember.delete({
        where: {
          id: memberId,
        },
      });
    },
    {
      hasConferenceRole: ["ADMIN"],
      detail: {
        description: "Delete a specific conference-member in this conference",
        tags: [openApiTag(import.meta.path)],
      },
    },
  );
