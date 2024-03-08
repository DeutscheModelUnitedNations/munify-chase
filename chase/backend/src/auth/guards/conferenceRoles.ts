import Elysia, { t } from "elysia";
import { session } from "../session";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import { db } from "../../../prisma/db";
import { ConferenceRole } from "../../../prisma/generated/client";

const parametersSchema = TypeCompiler.Compile(
  t.Object({
    conferenceId: t.String(),
  }),
);

export const conferenceRoleGuard = new Elysia({
  name: "conferenceRoleGuard",
})
  .use(session)
  .macro(({ onBeforeHandle }) => {
    return {
      /**
       * Checks if a user has the role in the conference. You can set the role to "any" to check if the user has any role in the conference.
       * You can also set the role to an array of roles to check if the user has any of the roles in the conference.
       */
      hasConferenceRole(roles: ConferenceRole[] | "any") {
        onBeforeHandle(async ({ session, set, params }) => {
          if (session.loggedIn !== true || !session.userData) {
            // biome-ignore lint/suspicious/noAssignInExpressions: This is a valid use case
            return (set.status = "Unauthorized");
          }

          if (!parametersSchema.Check(params)) {
            set.status = "Bad Request";
            return [...parametersSchema.Errors(params)];
          }
          const { conferenceId } = parametersSchema.Decode(params);

          const res = await db.conferenceMember.findFirst({
            where: {
              userId: session.userData.id,
              conferenceId,
              role: roles === "any" ? undefined : { in: roles },
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
