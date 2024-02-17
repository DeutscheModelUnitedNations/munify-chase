import { t, Elysia } from "elysia";
import { db } from "../../prisma/db";
import { committeeRoleGuard } from "../auth/guards/committeeRoles";
import { conferenceRoleGuard } from "../auth/guards/conferenceRoles";
import { openApiTag } from "../util/openApiTags";
import { AgendaItem, Committee } from "../../prisma/generated/schema";

const CommitteeWithOnlyParentCommitteeRelation = t.Omit(Committee, [
  "conference",
  "members",
  "subCommittees",
]);
const CommitteeWithoutRelations = t.Omit(
  CommitteeWithOnlyParentCommitteeRelation,
  ["parentId"]
);

const CommitteeData = t.Omit(CommitteeWithOnlyParentCommitteeRelation, [
  "id",
  "conferenceId",
  "parent",
]);

export const committee = new Elysia({
  prefix: "/conference/:conferenceId",
})
  .use(conferenceRoleGuard)
  .use(committeeRoleGuard)
  .get(
    "/committee",
    async ({ params: { conferenceId } }) => {
      return (await db.committee.findMany({
        where: {
          conferenceId,
        },
        include: { agendaItems: true }
      })).map(c => ({
        ...c,
        parentId: c.parentId ?? undefined,
        statusHeadline: c.statusHeadline ?? undefined,
        statusUntil: c.statusUntil ?? undefined,
        parent: c.parentId ? { id: c.parentId } : undefined,
      }));
    },
    {
      hasConferenceRole: "any",
      // response: t.Array(t.Composite([CommitteeWithoutRelations, t.Pick(AgendaItem, ["id", "title", "isActive"])])),
      // response: t.Array(t.Omit(Committee, ["conference", "members", "conference", "subCommittees"])),
      detail: {
        description: "Get all committees in this conference",
        tags: [openApiTag(import.meta.path)],
      },
    }
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
      body: CommitteeData,
      // response: CommitteeWithOnlyParentCommitteeRelation,
    }
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
    }
  )
  .get(
    "/committee/:committeeId",
    ({ params: { conferenceId, committeeId } }) => {
      return db.committee.findUniqueOrThrow({
        where: { conferenceId, id: committeeId },
      });
    },
    {
      hasConferenceRole: "any",
      detail: {
        description: "Get a single committee by id",
        tags: [openApiTag(import.meta.path)],
      },
    }
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
    }
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
    }
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
      hasConferenceRole: ["ADMIN"],
      body: t.Pick(Committee, ["status", "statusHeadline", "statusUntil"]),
      detail: {
        description: "Update the status of a committee by id",
        tags: [openApiTag(import.meta.path)],
      },
    }
  )

  .get(
    "/committee/:committeeId/delegations",
    ({ params: { conferenceId, committeeId } }) => {
      return db.delegation.findMany({
        where: {
          members: {
            some: {
              committeeId,
            },
          }
        },
        include: {
          nation: true,
          members: {
            where: {
              committeeId,
            },
            select: {
              presence: true,
            },
          }
        }
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
    }
  )
