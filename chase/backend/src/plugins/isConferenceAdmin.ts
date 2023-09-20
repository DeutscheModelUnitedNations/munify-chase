import Elysia, { t } from "elysia";
import { auth } from "./auth";

export const isConferenceAdmin = new Elysia({ name: "isConferenceAdmin" })
  .use(auth)
  .guard({ params: t.Object({ conferenceId: t.String() }) })
  .derive(({ params: { conferenceId } }) => {
    return { conferenceId };
  })
  .guard({
    beforeHandle: [
      async ({ auth, conferenceId }) => {
        if (auth.permissions.isConferenceAdmin(conferenceId)) {
          return new Response(null, { status: 401 });
        }
      },
    ],
  });
