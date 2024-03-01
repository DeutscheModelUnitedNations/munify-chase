import { t, Elysia } from "elysia";
import { db } from "../../prisma/db";
import { committeeRoleGuard } from "../auth/guards/committeeRoles";
import { conferenceRoleGuard } from "../auth/guards/conferenceRoles";
import { openApiTag } from "../util/openApiTags";
import { AgendaItem } from "../../prisma/generated/schema";
import { recursiveNullFieldsToUndefined } from "../util/nullToUndefined";

const AgendaItemWithoutRelations = t.Omit(AgendaItem, [
  "committee",
  "speakerLists",
]);

const AgendaItemData = t.Omit(AgendaItemWithoutRelations, [
  "id",
  "committeeId",
]);

export const agendaItem = new Elysia({
  prefix: "/conference/:conferenceId/committee/:committeeId",
})
  .use(conferenceRoleGuard)
  .use(committeeRoleGuard)
  .get(
    "/agendaItem",
    async ({ params: { conferenceId, committeeId } }) => {
      const r = await db.agendaItem.findMany({
        where: {
          committee: {
            id: committeeId,
            conferenceId,
          },
        },
      });

      // the return schema expects description to be set or undefined https://github.com/adeyahya/prisma-typebox-generator/issues/19
      return recursiveNullFieldsToUndefined(r);
    },
    {
      hasConferenceRole: "any",
      detail: {
        description: "Get all agenda items in this committee",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )
  .post(
    "/agendaItem",
    async ({ body, params: { conferenceId, committeeId } }) => {
      const agendaItem = await db.agendaItem
        .create({
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
        })
        .then((a) => ({ ...a, description: a.description || undefined }));
      const _speakersLists = await db.speakersList.createMany({
        data: [
          {
            type: "SPEAKERS_LIST",
            agendaItemId: agendaItem.id,
            speakingTime: 180,
          },
          {
            type: "COMMENT_LIST",
            agendaItemId: agendaItem.id,
            speakingTime: 30,
          },
        ],
      });
      return agendaItem;
    },
    {
      hasConferenceRole: ["ADMIN"],
      detail: {
        description: "Create a new agenda item in this committee",
        tags: [openApiTag(import.meta.path)],
      },
      body: AgendaItemData,
      response: AgendaItemWithoutRelations,
    },
  )
  .get(
    "/agendaItem/active",
    async ({ params: { committeeId }, set }) => {
      const r = await db.agendaItem.findFirst({
        where: {
          committeeId,
          isActive: true,
        },
        include: {
          speakerLists: true,
        },
      });

      if (!r) {
        set.status = "Not Found";
        throw new Error("No Active Committee");
      }

      return { ...r, description: r.description || undefined };
    },
    {
      hasConferenceRole: "any",
      detail: {
        description: "Get all active agenda items in this committee",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )
  .get(
    "/agendaItem/active/:type",
    async ({ params: { conferenceId, committeeId, type }, set }) => {
      const r = await db.agendaItem.findFirst({
        where: {
          committeeId,
          isActive: true,
        },
        include: {
          speakerLists: true,
        },
      });

      if (!r) {
        set.status = "Not Found";
        throw new Error("No Active Committee");
      }

      return r?.speakerLists.find((sl) => sl.type === type) ?? null;
    },
    {
      hasConferenceRole: "any",
      detail: {
        description: "Get all active agenda items in this committee",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )
  .get(
    "/agendaItem/:agendaItemId",
    ({ params: { conferenceId, committeeId, agendaItemId } }) =>
      db.agendaItem
        .findUniqueOrThrow({
          where: {
            id: agendaItemId,
            committee: { id: committeeId, conferenceId },
          },
        })
        .then((a) => ({ ...a, description: a.description || undefined })),
    {
      hasConferenceRole: "any",
      detail: {
        description: "Get a single agenda item by id",
        tags: [openApiTag(import.meta.path)],
      },
      response: AgendaItemWithoutRelations,
    },
  )
  .post(
    "/agendaItem/:agendaItemId/activate",
    ({ params: { conferenceId, committeeId, agendaItemId } }) =>
      db.$transaction([
        db.agendaItem.update({
          where: {
            id: agendaItemId,
            committee: { id: committeeId, conferenceId },
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
      hasConferenceRole: ["ADMIN"],
      detail: {
        description: "Activate an agenda item by id",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )
  .delete(
    "/agendaItem/:agendaItemId",
    ({ params: { conferenceId, committeeId, agendaItemId } }) =>
      db.agendaItem.delete({
        where: {
          id: agendaItemId,
          committee: { id: committeeId, conferenceId },
        },
      }),
    {
      hasConferenceRole: ["ADMIN"],
      detail: {
        description: "Delete an agenda item by id",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )
  .patch(
    "/agendaItem/:agendaItemId",
    async ({ params: { conferenceId, committeeId, agendaItemId }, body }) => {
      return db.agendaItem.update({
        where: {
          id: agendaItemId,
          committee: { id: committeeId, conferenceId },
        },
        data: {
          isActive: body.isActive,
          title: body.title,
          description: body.description,
        },
      });
    },
    {
      hasConferenceRole: ["ADMIN"],
      body: AgendaItemData,
      detail: {
        description: "Update an agenda item by id",
        tags: [openApiTag(import.meta.path)],
      },
    },
  );
