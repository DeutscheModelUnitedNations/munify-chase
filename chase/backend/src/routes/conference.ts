import { t, Elysia } from "elysia";
import { db } from "../../prisma/db";
import { openApiTag } from "../util/openApiTags";
import {
  ConferenceDataPlain,
  ConferenceDataPlainOptional,
  ConferencePlain,
} from "../../prisma/generated/schema/Conference";
import { ConferenceCreateToken } from "../../prisma/generated/schema/ConferenceCreateToken";
import { User } from "../../prisma/generated/schema/User";
import { permissionsPlugin } from "../auth/permissions";
import { sessionPlugin } from "../auth/session";
import { ConferenceRole } from "../../prisma/generated/schema/ConferenceRole";

export const conference = new Elysia()
  .use(sessionPlugin)
  .use(permissionsPlugin)
  .get(
    "/conference",
    ({ permissions }) =>
      db.conference.findMany({
        where: permissions.allowDatabaseAccessTo("list").Conference,
      }),
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
    ({ body, session, permissions }) =>
      db.$transaction(async (tx) => {
        permissions.checkIf((a) => a.can("create", "Conference"));

        await tx.conferenceCreateToken.delete({
          where: { token: body.token },
        });

        return tx.conference.create({
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
      }),
    {
      body: t.Composite([
        ConferenceDataPlain,
        t.Pick(ConferenceCreateToken, ["token"]),
      ]),
      response: ConferencePlain,
      detail: {
        description: "Create a new conference, consumes a token",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )
  .get(
    "/conference/:conferenceId",
    ({ params, permissions }) =>
      db.conference.findUniqueOrThrow({
        where: {
          id: params.conferenceId,
          AND: [permissions.allowDatabaseAccessTo().Conference],
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
    ({ params, permissions, body }) =>
      db.conference.update({
        where: {
          id: params.conferenceId,
          AND: [permissions.allowDatabaseAccessTo("update").Conference],
        },
        data: body,
      }),
    {
      body: ConferenceDataPlainOptional,
      response: ConferencePlain,
      detail: {
        description: "Update a conference by id",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )
  .patch(
    "/conference/:conferenceId/addAdmin",
    ({ params, body, permissions }) =>
      db.conferenceMember.upsert({
        where: {
          userId_conferenceId: {
            conferenceId: params.conferenceId,
            userId: body.user.id,
          },
          AND: [
            permissions.allowDatabaseAccessTo("create").ConferenceMember,
            permissions.allowDatabaseAccessTo("update").ConferenceMember,
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
      }),
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
          AND: [permissions.allowDatabaseAccessTo("delete").Conference],
        },
      }),
    {
      response: ConferencePlain,
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
            AND: [permissions.allowDatabaseAccessTo("read").ConferenceMember],
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
