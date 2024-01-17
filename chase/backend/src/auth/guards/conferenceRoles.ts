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

export const conferenceRoleGuard = new Elysia()
  .use(session)
  .macro(({ onBeforeHandle }) => {
    return {
      hasConferenceRole(roles: ConferenceRole[]) {
        onBeforeHandle(async ({ session, set, params }) => {
          if (!parametersSchema.Check(params)) {
            set.status = "Bad Request";
            return [...parametersSchema.Errors(params)];
          }
          const { conferenceId } = parametersSchema.Decode(params);

          if (!session.userData) {
            // biome-ignore lint/suspicious/noAssignInExpressions: This is a valid use case
            return (set.status = "Unauthorized");
          }

          const res = await db.conferenceMember.findFirst({
            where: {
              userId: session.userData.id,
              conferenceId,
              role: { in: roles },
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
