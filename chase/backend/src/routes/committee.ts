import { t, Elysia } from "elysia";
import { auth } from "../plugins/auth";
import { db } from "../../prisma/db";

export default (app: Elysia) =>
  app.use(auth)
      .get("committee/list", async () => {
        return db.committee.findMany();
      })
      .post(
        "committee/create",
        async ({ auth, body }) => {
          if (!auth?.permissions.isConferenceAdmin(body.conferenceId)) {
            return new Response("You are not an admin in this conference!", {
              status: 401,
            });
          }

          return db.committee.create({
            data: {
              name: body.name,
              abbreviation: body.abbreviation,
              conferenceId: body.conferenceId,
            },
          });
        },
        {
          body: t.Object({
            name: t.String(),
            abbreviation: t.String(),
            conferenceId: t.Number(),
          }),
        }
      )
