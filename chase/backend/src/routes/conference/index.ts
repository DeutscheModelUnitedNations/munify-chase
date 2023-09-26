import { t, Elysia } from "elysia";
import { auth } from "../../plugins/auth";
import { db } from "../../../prisma/db";

export default new Elysia()
  .use(auth)
  .get("/conference/list", () => db.conference.findMany())
  .post(
    "/conference",
    ({ body, auth }) => {
      // run this in a transaction, so if setting the permission/deleting the token fails, the conference is not created
      return db.$transaction(async (tx) => {
        await tx.conferenceCreateToken.delete({
          where: { token: body.token },
        });

        const newConference = await tx.conference.create({
          data: {
            name: body.name,
            start: new Date(body.time?.start),
            end: new Date(body.time?.end),
          },
        });

        // do this last so the db is set beforehand. If that fails we can't easily roll back the perms as the db transaction
        // so try to make permission calls last in transaction
        await auth?.permissions.setConferenceAdmin(newConference.id);

        return newConference;
      });
    },
    {
      detail: {
        description: "Creates a conference and consumes the creation token",
      },
      body: t.Object({
        name: t.String({ minLength: 3 }),
        token: t.String(),
        time: t.Optional(
          t.Object({
            start: t.Number(),
            end: t.Number(),
          }),
        ),
      }),
    },
  )
  .get("/conference/:conferenceId", ({ params: { conferenceId } }) =>
    db.conference.findFirstOrThrow({ where: { id: conferenceId } }),
  )
  .delete("/conference/:conferenceId", ({ auth, params: { conferenceId } }) => {
    if (!auth.permissions.isConferenceAdmin(conferenceId)) {
      return new Response(null, { status: 401 });
    }
    return db.conference.delete({ where: { id: conferenceId } });
  });
