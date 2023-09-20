import { t, Elysia } from "elysia";
import { auth } from "../../plugins/auth";
import { db } from "../../../prisma/db";
import committee from "./committee";
import { isConferenceAdmin } from "../../plugins/isConferenceAdmin";

export default new Elysia({ prefix: "/conference" })
  .use(auth)
  .group(":conferenceId", (app) =>
    app
      .get("", ({ params: { conferenceId } }) =>
        db.conference.findFirstOrThrow({ where: { id: conferenceId } }),
      )
      .use(isConferenceAdmin)
      .delete("", ({ conferenceId }) => {
        return db.conference.delete({ where: { id: conferenceId } });
      })
      .use(committee),
  )
  .get("/list", () => db.conference.findMany())
  .post(
    "",
    ({ body, auth }) => {
      // run this in a transaction, so if setting the permission/deleting the token fails, the conference is not created
      return db.$transaction(async (tx) => {
        await tx.conferenceCreateToken.delete({
          where: { token: body.token },
        });

        const newConference = await tx.conference.create({
          data: {
            name: body.name,
            start: body.time?.start,
            end: body.time?.end,
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
            start: t.Date({ minimumTimestamp: Date.now() }),
            end: t.Date({ exclusiveMinimumTimestamp: Date.now() }),
          }),
        ),
      }),
    },
  );
