import { t, Elysia } from "elysia";
import { db } from "../../prisma/db";
import { conferenceRoleGuard } from "../auth/guards/conferenceRoles";
import { openApiTag } from "../util/openApiTags";
import { loggedInGuard } from "../auth/guards/loggedIn";
import { ConferencePlain } from "../../prisma/generated/schema/Conference";
import { ConferenceCreateToken } from "../../prisma/generated/schema/ConferenceCreateToken";
import { User } from "../../prisma/generated/schema/User";

const ConferenceData = t.Omit(ConferencePlain, ["id"]);

export const conference = new Elysia()
  .use(loggedInGuard)
  .use(conferenceRoleGuard) // we inject the conferenceRole macro here
  .get(
    "/conference",
    async () => {
      return await db.conference.findMany();
    },
    {
      mustBeLoggedIn: true,
      detail: {
        description: "Get all conferences",
        tags: [openApiTag(import.meta.path)],
      },
    }
  )
  .post(
    "/conference",
    // TODO related to the one below
    // @ts-ignore
    // biome-ignore lint/correctness/noUnusedVariables: <explanation>
    async ({ body, session }) => {
      // run this in a transaction, so if setting the permission/deleting the token fails, the conference is not created
      const r = await db.$transaction(async (tx) => {
        await tx.conferenceCreateToken.delete({
          where: { token: body.token },
        });

        return await tx.conference.create({
          data: {
            name: body.name,
            start: body.start,
            end: body.end,
            // TODO: add the user that created the conference as an admin
            // members: {
            //   create: {
            //     role: "ADMIN",
            //     user: {
            //       connect: {
            //         id: session.userData.id,
            //       },
            //     },
            //   },
            // },
          },
        });
      });

      return {
        id: r.id,
        name: r.name,
        end: r.end?.toISOString(),
        start: r.start?.toISOString(),
      };
    },
    {
      isLoggedIn: true,
      detail: {
        description: "Create a new conference, consumes a token",
        tags: [openApiTag(import.meta.path)],
      },
      body: t.Composite([ConferenceData, ConferenceCreateToken]),
      response: ConferencePlain,
    }
  )
  .get(
    "/conference/:conferenceId",
    async ({ params: { conferenceId } }) =>
      db.conference.findUniqueOrThrow({
        where: { id: conferenceId },
      }),
    {
      isLoggedIn: true,
      detail: {
        description: "Get a single conference by id",
        tags: [openApiTag(import.meta.path)],
      },
      response: ConferencePlain,
    }
  )
  .patch(
    "/conference/:conferenceId",
    async ({ params: { conferenceId }, body }) => {
      return db.conference.update({
        where: { id: conferenceId },
        data: {
          name: body.name,
          start: body.start,
          end: body.end,
        },
      });
    },
    {
      hasConferenceRole: ["ADMIN"],
      body: ConferenceData,
      detail: {
        description: "Update a conference by id",
        tags: [openApiTag(import.meta.path)],
      },
    }
  )
  .patch(
    "/conference/:conferenceId/addAdmin",
    async ({ params: { conferenceId }, body }) => {
      return db.conferenceMember.upsert({
        where: {
          userId_conferenceId: {
            conferenceId,
            userId: body.user.id,
          },
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
              id: conferenceId,
            },
          },
        },
      });
    },
    {
      hasConferenceRole: ["ADMIN"],
      body: t.Object({
        user: t.Pick(User, ["id"]),
      }),
      detail: {
        description: "Add an admin to a conference",
        tags: [openApiTag(import.meta.path)],
      },
    }
  )
  .delete(
    "/conference/:conferenceId",
    ({ params: { conferenceId } }) =>
      db.conference.delete({ where: { id: conferenceId } }),
    {
      hasConferenceRole: ["ADMIN"],
      detail: {
        description: "Delete a conference by id",
        tags: [openApiTag(import.meta.path)],
      },
    }
  )
  .get("/conference/:conferenceId/checkAdminAccess", () => true, {
    hasConferenceRole: ["ADMIN"],
    response: t.Boolean(),
    detail: {
      description:
        "Check if you are an admin of a conference. Returns true or errors in case you are not an admin.",
      tags: [openApiTag(import.meta.path)],
    },
  });
