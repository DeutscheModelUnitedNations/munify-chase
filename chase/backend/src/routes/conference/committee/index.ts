import { t, Elysia } from "elysia";
import { db } from "prisma/db";
import { auth } from "src/plugins/auth";

//TODO how are auth issuer roles/metadata removed from related users when the entity is deleted?

export default new Elysia()
  .use(auth)
  .get(
    "/conference/:conferenceId/committee/list",
    async ({ params: { conferenceId } }) => {
      return db.committee.findFirstOrThrow({ where: { conferenceId } });
    }
  )
  .post(
    "/conference/:conferenceId/committee",
    async ({ auth, body, params: { conferenceId } }) => {
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
    }
  )
  .delete(
    "/conference/:conferenceId/committee/:committeeId",
    ({ auth, params: { committeeId, conferenceId } }) => {
      if (!auth.permissions.isConferenceAdmin(conferenceId)) {
        return new Response(null, { status: 401 });
      }

      return db.committee.delete({ where: { conferenceId, id: committeeId } });
    }
  );
