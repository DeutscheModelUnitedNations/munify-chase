import { t, Elysia } from "elysia";
import { db } from "../../../prisma/db";
import { isConferenceAdmin } from "../../plugins/isConferenceAdmin";

//TODO how are roles/metadata removed from related users when the entity is deleted?

export default new Elysia({ prefix: "/committee" })
  .get("/list", async ({ params: { conferenceId } }) => {
    return db.committee.findFirstOrThrow({ where: { conferenceId } });
  })
  .use(isConferenceAdmin)
  .post(
    "/create",
    async ({ body, conferenceId }) => {
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
  .delete("/:committeeId", ({ conferenceId, params: { committeeId } }) => {
    return db.committee.delete({ where: { conferenceId, id: committeeId } });
  });
