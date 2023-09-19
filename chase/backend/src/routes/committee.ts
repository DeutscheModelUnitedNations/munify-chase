import { t, Elysia } from "elysia";
import { auth } from "../plugins/auth";
import { db } from "../../prisma/db";

export default (app: Elysia) =>
  app
    .use(auth)
    .get("committee/list/:id", async ({ params: { id } }) => {
      if (!id) {
        return new Response("No conferenceId provided!", { status: 400 });
      }
      return db.committee.findMany({
        where: {
          conferenceId: parseInt(id),
        },
      });
    })
    .post(
      "committee/create",
      async ({ auth, body }) => {
        if (!auth?.permissions.isConferenceAdmin(body.conferenceId)) {
          return new Response("You are not an admin in this conference!", {
            status: 401,
          });
        }

        return db.$transaction(async (tx) => {
          const newCommittee = await tx.committee.create({
            data: {
              name: body.name,
              abbreviation: body.abbreviation,
              category: body.category,
              isSubcommittee: body.isSubcommittee,
              parentCommitteeId: body.parentCommitteeId,
              conferenceId: body.conferenceId,
            },
          });

          return newCommittee;
        });
      },
      {
        body: t.Object({
          name: t.String(),
          abbreviation: t.String(),
          category: t.String(),
          isSubcommittee: t.Boolean(),
          parentCommitteeId: t.Union([t.Number(), t.Null()]),
          conferenceId: t.Number(),
        }),
      }
    )
    .post(
      "committee/delete",
      async ({ auth, body }) => {
        if (!auth?.permissions.isConferenceAdmin(body.conferenceId)) {
          return new Response("You are not an admin in this conference!", {
            status: 401,
          });
        }

        if (body.deleteAll) {
          return db.$transaction(async (tx) => {
            const deletedCommittees = await tx.committee.deleteMany({
              where: {
                conferenceId: body.conferenceId,
              },
            });

            return deletedCommittees;
          });
        }

        return db.$transaction(async (tx) => {
          if (!body.id) {
            return new Response("No committeeId provided!", { status: 400 });
          }
          const deletedCommittee = await tx.committee.delete({
            where: {
              id: body.id,
            },
          });

          return deletedCommittee;
        });
      },
      {
        body: t.Object({
          id: t.Optional(t.Number()),
          deleteAll: t.Optional(t.Boolean()),
          conferenceId: t.Number(),
        }),
      }
    );
