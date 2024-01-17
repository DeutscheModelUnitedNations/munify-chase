import { t, Elysia } from "elysia";
import { db } from "../../prisma/db";
import { conferenceRoleGuard } from "../auth/guards/conferenceRoles";
import { Conference } from "../../prisma/generated/schema";
import { openApiTag } from "../util/openApiTags";

const ConferenceWithoutRelations = t.Omit(Conference, [
  "conferenceMember",
  "committees",
]);
// const DomainData = t.Pick(Domain, ["name"]);

export const conference = new Elysia({ prefix: "/conference" })
  .use(conferenceRoleGuard) // we inject the conferenceRole macro here
  .get(
    "/list",
    async () => {
      const r = await db.conference.findMany();
      return r.map((c) => ({
        id: c.id,
        name: c.name,
        start: c.start?.toISOString(),
        end: c.end?.toISOString(),
      }));
    },
    {
      response: t.Array(ConferenceWithoutRelations),
      detail: {
        description: "Get all conferences",
        tags: [openApiTag(import.meta.path)],
      },
    },
  )
  .post(
    "/createNewConference",
    async ({ body, session }) => {
      // run this in a transaction, so if setting the permission/deleting the token fails, the conference is not created
      const r = await db.$transaction(async (tx) => {
        await tx.conferenceCreateToken.delete({
          where: { token: body.token },
        });

        return await tx.conference.create({
          data: {
            name: body.name,
            start: body.time?.start,
            end: body.time?.end,
            conferenceMember: {
              create: {
                role: "ADMIN",
                user: {
                  connect: {
                    id: session.userData.id,
                  },
                },
              },
            },
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
      detail: {
        description:
          "Create a new conference with the given name, consumes a token",
        tags: [openApiTag(import.meta.path)],
      },
      body: t.Object({
        name: t.String({ minLength: 3 }),
        token: t.String(),
        time: t.Optional(
          t.Object({
            start: t.Date({ minimumTimestamp: Date.now() }),
            end: t.Date({ exclusiveMinimumTimestamp: Date.now() }),
          }),
        ),
      }),
      response: ConferenceWithoutRelations,
    },
  )
  .get(
    "/:conferenceId",
    async ({ params: { conferenceId } }) => {
      const r = await db.conference.findFirstOrThrow({
        where: { id: conferenceId },
        include: {
          committees: true,
          conferenceMember: true,
        },
      });

      return {
        id: r.id,
        name: r.name,
        start: r.start?.toISOString(),
        end: r.end?.toISOString(),
        committees: r.committees,
        conferenceMember: r.conferenceMember,
      };
    },
    {
      detail: {
        description: "Get a single conference by id with all relations",
        tags: [openApiTag(import.meta.path)],
      },
      response: Conference,
      hasConferenceRole: ["ADMIN", "PARTICIPANT", "TEAM_MEMBER", "VISITOR"],
    },
  )
  .delete(
    "/:conferenceId",
    ({ params: { conferenceId } }) =>
      db.conference.delete({ where: { id: conferenceId } }),
    {
      detail: {
        description: "Delete a conference by id",
        tags: [openApiTag(import.meta.path)],
      },
      hasConferenceRole: ["ADMIN"],
    },
  );
