import Elysia, { t } from "elysia";
import { session } from "../session";
import { db } from "../../../prisma/db";

export const committeeMemberGuard = new Elysia({
  name: "committeeMemberGuard",
})
  .use(session)
  .guard({
    params: t.Object({
      conferenceId: t.String(),
      committeeId: t.String(),
    }),
  })
  .macro(({ onBeforeHandle }) => {
    return {
      /**
       * Checks if a user has the role in the committee. You can set the role to "any" to check if the user has any role in the committee.
       * You can also set the role to an array of roles to check if the user has any of the roles in the committee.
       */
      isCommitteeMember() {
        onBeforeHandle(
          async ({ session, error, params: { committeeId, conferenceId } }) => {
            if (session?.data?.loggedIn !== true) {
              return error("Unauthorized");
            }
            const res = await db.committeeMember.findFirst({
              where: {
                userId: session.data.user?.id,
                committee: {
                  id: committeeId,
                  conference: {
                    id: conferenceId,
                  },
                },
              },
            });
            if (!res) {
              return error("Unauthorized");
            }
          }
        );
      },
    };
  });
