import { t, Elysia } from "elysia";
import { db } from "../../prisma/db";
import { committeeMemberGuard } from "../auth/guards/committeeMember";
import { conferenceRoleGuard } from "../auth/guards/conferenceRoles";
import { openApiTag } from "../util/openApiTags";
import { Committee } from "../../prisma/generated/schema/Committee";
import { Nation } from "../../prisma/generated/schema/Nation";

const CommitteeWithOnlyParentCommitteeRelation = t.Omit(Committee, [
  "conference",
  "members",
  "subCommittees",
]);

const CommitteeData = t.Omit(CommitteeWithOnlyParentCommitteeRelation, [
  "id",
  "conferenceId",
  "parent",
]);

export const committee = new Elysia({
  prefix: "/conference/:conferenceId",
})
  .use(conferenceRoleGuard)
  .use(committeeMemberGuard)
  .get(
    "/committee",
    async ({ params: { conferenceId } }) => {
      return (
        await db.committee.findMany({
          where: {
            conferenceId,
          },
          include: { agendaItems: true },
          orderBy: {
            abbreviation: "asc",
          },
        })
      ).map((c) => ({
        ...c,
        parentId: c.parentId ?? undefined,
        statusHeadline: c.statusHeadline ?? undefined,
        statusUntil: c.statusUntil ?? undefined,
        parent: c.parentId ? { id: c.parentId } : undefined,
      }));
    },
    {
      hasConferenceRole: "any",
      detail: {
        description: "Get all committees in this conference",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )
  .get(
    "/committee/:committeeId/allCountryCodes",
    async ({ params: { conferenceId, committeeId } }) => {
      const delegation = await db.delegation.findMany({
        where: {
          conferenceId,
          members: {
            some: {
              committeeId,
            },
          },
        },
        select: {
          nation: true,
        },
      });

      return delegation.map((d) => d.nation);
    },
    {
      hasConferenceRole: "any",
      response: t.Array(t.Pick(Nation, ["alpha3Code", "id"])),
      detail: {
        description: "Get all country codes of a committee",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )
  .post(
    "/committee",
    async ({ body, params: { conferenceId } }) => {
      const res = await db.committee.create({
        data: {
          abbreviation: body.abbreviation,
          category: body.category,
          conferenceId,
          name: body.name,
          parentId: body.parentId,
        },
      });

      return {
        ...res,
        parentId: res.parentId ?? undefined,
      };
    },
    {
      hasConferenceRole: ["ADMIN"],
      detail: {
        description: "Create a new committee in this conference",
        tags: [openApiTag(import.meta.path)],
      },
      body: t.Pick(Committee, ["name", "abbreviation", "category", "parentId"]),
    },
  )
  .delete(
    "/committee",
    ({ params: { conferenceId } }) =>
      db.committee.deleteMany({ where: { conferenceId } }),
    {
      hasConferenceRole: ["ADMIN"],
      detail: {
        description: "Delete all committees in this conference",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )
  .get(
    "/committee/:committeeId",
    ({ params: { conferenceId, committeeId } }) => {
      return db.committee.findUniqueOrThrow({
        where: { conferenceId, id: committeeId },
        include: {
          agendaItems: true,
        },
      });
    },
    {
      hasConferenceRole: "any",
      detail: {
        description: "Get a single committee by id",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )
  .delete(
    "/committee/:committeeId",
    ({ params: { conferenceId, committeeId } }) =>
      db.committee.delete({ where: { id: committeeId, conferenceId } }),
    {
      hasConferenceRole: ["ADMIN"],
      detail: {
        description: "Delete a committee by id",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )
  .patch(
    "/committee/:committeeId",
    ({ params: { conferenceId, committeeId }, body }) => {
      return db.committee.update({
        where: { id: committeeId, conferenceId },
        data: {
          name: body.name,
          abbreviation: body.abbreviation,
          category: body.category,
        },
      });
    },
    {
      hasConferenceRole: ["ADMIN"],
      body: CommitteeData,
      detail: {
        description: "Update a committee by id",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )

  // Committee Status
  .post(
    "/committee/:committeeId/status",
    ({ params: { conferenceId, committeeId }, body }) => {
      return db.committee.update({
        where: { id: committeeId, conferenceId },
        data: {
          status: body.status,
          statusHeadline: body.statusHeadline,
          statusUntil: body.statusUntil,
        },
      });
    },
    {
      hasConferenceRole: ["ADMIN", "CHAIR", "COMMITTEE_ADVISOR"],
      body: t.Pick(Committee, ["status", "statusHeadline", "statusUntil"]),
      detail: {
        description: "Update the status of a committee by id",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )

  .post(
    "/committee/:committeeId/stateOfDebate",
    ({ params: { conferenceId, committeeId }, body }) => {
      return db.committee.update({
        where: { id: committeeId, conferenceId },
        data: {
          stateOfDebate: body.stateOfDebate,
        },
      });
    },
    {
      hasConferenceRole: ["ADMIN"],
      body: t.Pick(Committee, ["stateOfDebate"]),
      detail: {
        description: "Update the state of debate of a committee by id",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )

  .get(
    "/committee/:committeeId/delegations",
    ({ params: { conferenceId, committeeId } }) => {
      return db.delegation.findMany({
        where: {
          conferenceId,
          members: {
            some: {
              committeeId,
            },
          },
        },
        include: {
          nation: true,
          members: {
            where: {
              committeeId,
            },
            select: {
              presence: true,
              id: true,
            },
          },
        },
        orderBy: {
          nation: {
            alpha3Code: "asc",
          },
        },
      });
    },
    {
      hasConferenceRole: "any",
      detail: {
        description: "Get all delegations of a committee",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )

  .post(
    "/committee/:committeeId/delegations/toggleAllowAddingThemselvesToSpeakersList",
    async ({ params: { conferenceId, committeeId } }) => {
      const committee = await db.committee.findUnique({
        where: { id: committeeId, conferenceId },
      });

      if (!committee) {
        throw new Error("Committee not found");
      }

      return db.committee.update({
        where: { id: committeeId, conferenceId },
        data: {
          allowDelegationsToAddThemselvesToSpeakersList:
            !committee.allowDelegationsToAddThemselvesToSpeakersList,
        },
      });
    },
    {
      hasConferenceRole: ["ADMIN"],
      detail: {
        description:
          "Toggle the ability for delegations to add themselves to the speakers list",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )

  // Whiteboard
  .post(
    "/committee/:committeeId/whiteboard",
    ({ params: { conferenceId, committeeId }, body }) => {
      return db.committee.update({
        where: { id: committeeId, conferenceId },
        data: {
          whiteboardContent: body.whiteboardContent,
        },
      });
    },
    {
      hasConferenceRole: ["ADMIN"],
      body: t.Pick(Committee, ["whiteboardContent"]),
      detail: {
        description: "Update the whiteboard content of a committee by id",
        tags: [openApiTag(import.meta.path)],
      },
    },
  );
