import { t, Elysia } from "elysia";
import { db } from "../../prisma/db";
import { openApiTag } from "../util/openApiTags";
import { $Enums } from "../../prisma/generated/client";
import {
  AgendaItemData,
  AgendaItemDataPlain,
  AgendaItemPlain,
} from "../../prisma/generated/schema/AgendaItem";
import { permissionsPlugin } from "../auth/permissions";

export const agendaItem = new Elysia({
  prefix: "/conference/:conferenceId/committee/:committeeId",
})
  .use(permissionsPlugin)
  .get(
    "/agendaItem",
    async ({ params, permissions }) =>
      db.agendaItem.findMany({
        where: {
          committee: {
            id: params.committeeId,
            conferenceId: params.conferenceId,
          },
          AND: [permissions.allowDatabaseAccessTo("list").AgendaItem],
        },
      }),
    {
      detail: {
        description: "Get all agenda items in this committee",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )
  .post(
    "/agendaItem",
    async ({ body, params: { conferenceId, committeeId }, permissions }) => {
      //TODO is this used? @TadeSF
      // const committeeHasActiveAgendaItem = !!(await db.agendaItem.findFirst({
      //   where: {
      //     committeeId,
      //     isActive: true,
      //   },
      // }));
      permissions.checkIf((user) => user.can("create", "AgendaItem"));

      const agendaItem = await db.agendaItem.create({
        data: {
          committee: {
            connect: {
              id: committeeId,
              conferenceId,
            },
          },
          title: body.title,
          description: body.description,
        },
      });
      await db.speakersList.createMany({
        data: [
          {
            type: $Enums.SpeakersListCategory.SPEAKERS_LIST,
            agendaItemId: agendaItem.id,
            speakingTime: 180,
          },
          {
            type: $Enums.SpeakersListCategory.COMMENT_LIST,
            agendaItemId: agendaItem.id,
            speakingTime: 30,
          },
        ],
      });
      return agendaItem;
    },
    {
      body: t.Pick(AgendaItemData, ["title", "description"]),
      detail: {
        description: "Create a new agenda item in this committee",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )
  .get(
    "/agendaItem/active",
    async ({ params: { committeeId }, permissions }) => {
      const r = await db.agendaItem.findFirstOrThrow({
        where: {
          committeeId,
          isActive: true,
          AND: [permissions.allowDatabaseAccessTo("list").AgendaItem],
        },
        include: {
          speakerLists: true,
        },
      });

      return r;
    },
    {
      detail: {
        description: "Get all active agenda items in this committee",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )
  .get(
    "/agendaItem/active/:type",
    async ({ params: { conferenceId, committeeId, type }, permissions }) => {
      const r = await db.agendaItem.findFirstOrThrow({
        where: {
          committee: {
            id: committeeId,
            conferenceId,
          },
          isActive: true,
          AND: [permissions.allowDatabaseAccessTo("list").AgendaItem],
        },
        include: {
          speakerLists: {
            where: {
              type: type as $Enums.SpeakersListCategory,
            },
          },
        },
      });

      return r;
    },
    {
      detail: {
        description: "Get all active agenda items in this committee",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )
  .get(
    "/agendaItem/:agendaItemId",
    ({ params: { conferenceId, committeeId, agendaItemId }, permissions }) =>
      db.agendaItem
        .findUniqueOrThrow({
          where: {
            id: agendaItemId,
            committee: { id: committeeId, conferenceId },
            AND: [permissions.allowDatabaseAccessTo().AgendaItem],
          },
        })
        .then((a) => ({ ...a, description: a.description || undefined })),
    {
      detail: {
        description: "Get a single agenda item by id",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )
  .post(
    "/agendaItem/:agendaItemId/activate",
    ({ params: { conferenceId, committeeId, agendaItemId }, permissions }) =>
      db.$transaction([
        db.agendaItem.update({
          where: {
            id: agendaItemId,
            committee: { id: committeeId, conferenceId },
            AND: [permissions.allowDatabaseAccessTo("update").AgendaItem],
          },
          data: {
            isActive: true,
          },
        }),
        db.agendaItem.updateMany({
          where: {
            committeeId,
            id: { not: agendaItemId },
          },
          data: {
            isActive: false,
          },
        }),
      ]),
    {
      detail: {
        description: "Activate an agenda item by id",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )
  .delete(
    "/agendaItem/:agendaItemId",
    ({ params: { conferenceId, committeeId, agendaItemId }, permissions }) =>
      db.agendaItem.delete({
        where: {
          id: agendaItemId,
          committee: { id: committeeId, conferenceId },
          AND: [permissions.allowDatabaseAccessTo("delete").AgendaItem],
        },
      }),
    {
      detail: {
        description: "Delete an agenda item by id",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )
  .patch(
    "/agendaItem/:agendaItemId",
    async ({
      params: { conferenceId, committeeId, agendaItemId },
      body,
      permissions,
    }) => {
      return db.agendaItem.update({
        where: {
          id: agendaItemId,
          committee: { id: committeeId, conferenceId },
          AND: [permissions.allowDatabaseAccessTo("update").AgendaItem],
        },
        data: {
          isActive: body.isActive,
          title: body.title,
          description: body.description,
        },
      });
    },
    {
      body: AgendaItemDataPlain,
      detail: {
        description: "Update an agenda item by id",
        tags: [openApiTag(import.meta.path)],
      },
    },
  );
