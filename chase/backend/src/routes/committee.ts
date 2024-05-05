import { t, Elysia } from "elysia";
import { db } from "../../prisma/db";
import { openApiTag } from "../util/openApiTags";
import {
  CommitteeData,
  CommitteeDataPlainOptional,
} from "../../prisma/generated/schema/Committee";
import { sessionPlugin } from "../auth/session";
import { permissionsPlugin } from "../auth/permissions";

export const committee = new Elysia({
  prefix: "/conference/:conferenceId",
})
  .use(sessionPlugin)
  .use(permissionsPlugin)
  .get(
    "/committee",
    async ({ params, permissions }) => {
      return await db.committee.findMany({
        where: {
          conferenceId: params.conferenceId,
          AND: [permissions.allowDatabaseAccessTo("list").Committee],
        },
        include: { agendaItems: true },
        orderBy: {
          abbreviation: "asc",
        },
      });
    },
    {
      detail: {
        description:
          "Get all committees in this conference, including their agenda items",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )
  .get(
    "/committee/:committeeId",
    ({ params, permissions }) => {
      return db.committee.findUniqueOrThrow({
        where: {
          conferenceId: params.conferenceId,
          id: params.committeeId,
          AND: [permissions.allowDatabaseAccessTo().Committee],
        },
        include: {
          agendaItems: true,
        },
      });
    },
    {
      detail: {
        description: "Get a single committee by id including the agenda items",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )
  .get(
    "/committee/:committeeId/nations",
    async ({ params, permissions }) =>
      db.nation.findMany({
        where: {
          delegations: {
            some: {
              conferenceId: params.conferenceId,
              members: {
                some: {
                  committee: {
                    id: params.committeeId,
                    AND: [permissions.allowDatabaseAccessTo().Committee],
                  },
                },
              },
            },
          },
          AND: [permissions.allowDatabaseAccessTo("list").Nation],
        },
      }),
    {
      detail: {
        description:
          "Get all nations of a committee (all delegations represented in this committee)",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )
  .post(
    "/committee",
    async ({ body, params, permissions }) => {
      permissions.checkIf((user) => user.can("create", "Committee"));

      return db.committee.create({
        data: { conferenceId: params.conferenceId, ...body },
      });
    },
    {
      body: t.Pick(CommitteeData, [
        "name",
        "abbreviation",
        "category",
        "parentId",
      ]),
      detail: {
        description: "Create a new committee in this conference",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )
  .delete(
    "/committee",
    async ({ params, permissions }) =>
      db.committee.deleteMany({
        where: {
          conferenceId: params.conferenceId,
          AND: [permissions.allowDatabaseAccessTo("delete").Committee],
        },
      }),
    {
      detail: {
        description: "Delete all committees in this conference",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )

  .delete(
    "/committee/:committeeId",
    ({ params, permissions }) =>
      db.committee.delete({
        where: {
          id: params.committeeId,
          conferenceId: params.conferenceId,
          AND: [permissions.allowDatabaseAccessTo("delete").Committee],
        },
      }),
    {
      detail: {
        description: "Delete a committee by id",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )
  .patch(
    "/committee/:committeeId",
    ({ params, body, permissions }) => {
      return db.committee.update({
        where: {
          id: params.committeeId,
          conferenceId: params.conferenceId,
          AND: [permissions.allowDatabaseAccessTo("update").Committee],
        },
        data: body,
      });
    },
    {
      body: CommitteeDataPlainOptional,
      detail: {
        description: "Update a committee by id",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )
  .patch(
    "/committee/:committeeId/status",
    ({ params, body, permissions }) => {
      return db.committee.update({
        where: {
          id: params.committeeId,
          conferenceId: params.conferenceId,
          AND: [permissions.allowDatabaseAccessTo("update").Committee],
        },
        data: body,
      });
    },
    {
      body: t.Pick(CommitteeDataPlainOptional, [
        "status",
        "statusHeadline",
        "statusUntil",
        "stateOfDebate",
        "whiteboardContent",
      ]),
      detail: {
        description: "Update a committee status by id",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )
  .get(
    "/committee/:committeeId/delegations",
    ({ params, permissions }) => {
      return db.delegation.findMany({
        where: {
          conferenceId: params.conferenceId,
          members: {
            some: {
              committeeId: params.committeeId,
            },
          },
          AND: [permissions.allowDatabaseAccessTo("list").Delegation],
        },
        include: {
          nation: true,
          members: {
            where: {
              committeeId: params.committeeId,
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
      detail: {
        description: "Get all delegations of a committee",
        tags: [openApiTag(import.meta.path)],
      },
    },
  );
