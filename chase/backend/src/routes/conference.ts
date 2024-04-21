import { t, Elysia } from "elysia";
import { db } from "../../prisma/db";
import { openApiTag } from "../util/openApiTags";
import {
  ConferenceData,
  ConferencePlain,
} from "../../prisma/generated/schema/Conference";
import { ConferenceCreateToken } from "../../prisma/generated/schema/ConferenceCreateToken";
import { User } from "../../prisma/generated/schema/User";
import { permissionsPlugin } from "../auth/permissions";
import { sessionPlugin } from "../auth/session";
import { ConferenceRole } from "../../prisma/generated/schema/ConferenceRole";

export const conference = new Elysia({
  normalize: true,
})
  .use(sessionPlugin)
  .use(permissionsPlugin)
  .get(
    "/conference",
    async ({ permissions }) => {
      permissions.checkIf((a) => a.can("list", "Conference"));
      return db.conference.findMany();
    },
    {
      response: t.Array(ConferencePlain),
      detail: {
        description: "Get all conferences",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )
  .post(
    "/conference",
    async ({ body, session, permissions }) => {
      // run this in a transaction, so if setting the permission/deleting the token fails, the conference is not created
      const r = await db.$transaction(async (tx) => {
        permissions.checkIf((a) => a.can("create", "Conference"));

        await tx.conferenceCreateToken.delete({
          where: { token: body.token },
        });

        return await tx.conference.create({
          data: {
            name: body.name,
            start: body.start,
            end: body.end,
            members: {
              create: {
                role: "ADMIN",
                user: {
                  connect: {
                    id: session.data?.user?.id,
                  },
                },
              },
            },
          },
        });
      });

      return r;
    },
    {
      body: t.Composite([ConferenceData, ConferenceCreateToken]),
      response: ConferencePlain,
      detail: {
        description: "Create a new conference, consumes a token",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )
  .get(
    "/conference/:conferenceId",
    async ({ params, permissions }) =>
      db.conference.findUniqueOrThrow({
        where: {
          id: params.conferenceId,
          AND: [permissions.accessibleBy().Conference],
        },
      }),
    {
      response: ConferencePlain,
      detail: {
        description: "Get a single conference by id",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )
  .patch(
    "/conference/:conferenceId",
    async ({ params, permissions, body }) => {
      return db.conference.update({
        where: {
          id: params.conferenceId,
          AND: [permissions.accessibleBy("update").Conference],
        },
        data: {
          name: body.name,
          start: body.start,
          end: body.end,
        },
      });
    },
    {
      body: ConferenceData,
      response: ConferencePlain,
      detail: {
        description: "Update a conference by id",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )
  .patch(
    "/conference/:conferenceId/addAdmin",
    async ({ params, body, permissions }) => {
      return db.conferenceMember.upsert({
        where: {
          userId_conferenceId: {
            conferenceId: params.conferenceId,
            userId: body.user.id,
          },
          AND: [
            permissions.accessibleBy("create").ConferenceMember,
            permissions.accessibleBy("update").ConferenceMember,
          ],
        },
        update: {
          role: "ADMIN",
        },
        create: {
          role: "ADMIN",
          user: {
            connect: {
              id: body.user.id,
            },
          },
          conference: {
            connect: {
              id: params.conferenceId,
            },
          },
        },
      });
    },
    {
      body: t.Object({
        user: t.Pick(User, ["id"]),
      }),
      detail: {
        description: "Add an admin to a conference",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )
  .delete(
    "/conference/:conferenceId",
    ({ params, permissions }) =>
      db.conference.delete({
        where: {
          id: params.conferenceId,
          AND: [permissions.accessibleBy("delete").Conference],
        },
      }),
    {
      detail: {
        description: "Delete a conference by id",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )
  .get(
    "/conference/:conferenceId/getOwnRole",
    async ({ session, permissions }) =>
      (
        await db.conferenceMember.findFirstOrThrow({
          where: {
            userId: session.data?.user?.id,
            AND: [permissions.accessibleBy("read").ConferenceMember],
          },
        })
      ).role,
    {
      response: t.Optional(ConferenceRole),
      detail: {
        description: "Check if you are an admin of a conference.",
        tags: [openApiTag(import.meta.path)],
      },
    },
  );
