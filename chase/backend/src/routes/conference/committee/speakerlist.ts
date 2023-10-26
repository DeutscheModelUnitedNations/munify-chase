import { t, Elysia } from "elysia";
import { db } from "prisma/db";
import { auth } from "src/plugins/auth";

//TODO how are auth issuer roles/metadata removed from related users when the entity is deleted?

export default new Elysia()
  .use(auth)
  .get(
    "/conference/:conferenceId/committee/:committeeId/speakerlist",
    async ({ params: { conferenceId } }) => {
      return db.committee.findFirstOrThrow({ where: { conferenceId } });
    }
  )
