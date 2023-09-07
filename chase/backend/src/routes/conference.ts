import { t, Elysia } from "elysia";
import { auth } from "../plugins/auth";
import { db } from "../../prisma/db";
import committee from "./committee";

export default (app: Elysia) =>
  app.use(auth).group("conference", (app) =>
    app
      .use(committee)
      .get("list", async () => {
        return db.conference.findMany();
      })
      .post(
        "create",
        async ({ body, auth }) => {
          // run this in a transaction, so if setting the permission/deleting the token fails, the conference is not created
          return db.$transaction(async (tx) => {
            await tx.conferenceCreateToken.delete({
              where: { token: body.token },
            });

            const newConference = await tx.conference.create({
              data: {
                name: body.name,
              },
            });

            // do this last so the db is set beforehand. If that fails we can't easily roll back the perms as the db transaction
            await auth?.permissions.setConferenceAdmin(newConference.id);

            return newConference;
          });
        },
        {
          body: t.Object({
            name: t.String({ minLength: 3 }),
            token: t.String(),
          }),
        }
      )
  );
