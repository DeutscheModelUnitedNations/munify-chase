import { t, Elysia } from "elysia";
import { db } from "../../db/db";
import { loggedIn, session } from "../auth/session";
import { eq } from "drizzle-orm";
import { committees } from "../../db/schema";

export const committee = new Elysia()
  .use(session)
  .get(
    "/conference/:conferenceId/committee/list",
    async ({ params: { conferenceId } }) => {
      return db.query.committees.findMany({
        where: eq(committees.conferenceId, conferenceId),
      });
    },
  )
  .guard({}, (app) => {
    return app
      .use(loggedIn)
      .post(
        "/conference/:conferenceId/committee",
        async ({ session, body, params: { conferenceId } }) => {
          if (!auth.permissions.isConferenceAdmin(conferenceId)) {
            return new Response(null, { status: 401 });
          }

          return db.committee.create({
            data: {
              name: body.name,
              abbreviation: body.abbreviation,
              conferenceId,
            },
          });
        },
        {
          detail: {
            description: "Creates a committee on this conference",
          },
          body: t.Object({
            name: t.String(),
            abbreviation: t.String(),
          }),
        },
      )
      .delete(
        "/conference/:conferenceId/committee/:committeeId",
        ({ auth, params: { committeeId, conferenceId } }) => {
          if (!auth.permissions.isConferenceAdmin(conferenceId)) {
            return new Response(null, { status: 401 });
          }

          return db.committee.delete({
            where: { conferenceId, id: committeeId },
          });
        },
      );
  });
