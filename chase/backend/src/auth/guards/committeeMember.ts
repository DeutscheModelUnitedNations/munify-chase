import Elysia, { t } from "elysia";
import { session } from "../session";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import { db } from "../../../prisma/db";

const parametersSchema = TypeCompiler.Compile(
  t.Object({
    conferenceId: t.String(),
    committeeId: t.String(),
  }),
);

export const committeeMemberGuard = new Elysia({
  name: "conferenceMemberGuard",
})
  .use(session)
  .macro(({ onBeforeHandle }) => {
    return {
      /**
       * Checks if a user has the role in the committee. You can set the role to "any" to check if the user has any role in the committee.
       * You can also set the role to an array of roles to check if the user has any of the roles in the committee.
       */
      isCommitteeMember() {
        onBeforeHandle(async ({ session, set, params }) => {
          if (session.loggedIn !== true) {
            // biome-ignore lint/suspicious/noAssignInExpressions: This is a valid use case
            return (set.status = "Unauthorized");
          }

          if (!parametersSchema.Check(params)) {
            set.status = "Bad Request";
            return [...parametersSchema.Errors(params)];
          }
          const { conferenceId, committeeId } = parametersSchema.Decode(params);

          if (!session.userData) {
            // biome-ignore lint/suspicious/noAssignInExpressions: This is a valid use case
            return (set.status = "Unauthorized");
          }

          const res = await db.committeeMember.findFirst({
            where: {
              userId: session.userData.id,
              committee: {
                id: committeeId,
                conference: {
                  id: conferenceId,
                },
              },
            },
          });

          if (!res) {
            // biome-ignore lint/suspicious/noAssignInExpressions: This is a valid use case
            return (set.status = "Unauthorized");
          }
        });
      },
    };
  })
  // just for correct typing
  .derive(({ session }) => {
    return {
      // biome-ignore lint/style/noNonNullAssertion: we can safely assume that session.userData is defined here
      session: { ...session, userData: session.userData! },
    };
  });
