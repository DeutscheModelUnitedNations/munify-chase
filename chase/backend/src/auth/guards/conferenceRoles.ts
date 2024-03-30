import Elysia, { t } from "elysia";
import { session } from "../session";
import { db } from "../../../prisma/db";
import type { ConferenceRole } from "../../../prisma/generated/client";

export const conferenceRoleGuard = new Elysia({
  name: "conferenceRoleGuard",
})
  .use(session)
  .guard({
    params: t.Object({
      conferenceId: t.String(),
    }),
  })
  .macro(({ onBeforeHandle }) => {
    return {
      /**
       * Checks if a user has the role in the conference. You can set the role to "any" to check if the user has any role in the conference.
       * You can also set the role to an array of roles to check if the user has any of the roles in the conference.
       */
      hasConferenceRole(roles: ConferenceRole[] | "any") {
        onBeforeHandle(async ({ session, set, params: { conferenceId } }) => {
          if (session?.data?.loggedIn !== true) {
            set.status = "Unauthorized";
            return "Unauthorized";
          }
          const res = await db.conferenceMember.findFirst({
            where: {
              userId: session.data.user?.id,
              conferenceId,
              role: roles === "any" ? undefined : { in: roles },
            },
          });
          if (!res) {
            set.status = "Unauthorized";
            return "Unauthorized";
          }
        });
      },
    };
  });
