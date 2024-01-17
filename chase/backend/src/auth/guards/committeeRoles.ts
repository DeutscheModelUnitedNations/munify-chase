import Elysia, { t } from "elysia";
import { session } from "../session";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import { db } from "../../../prisma/db";
import { CommitteeRole } from "../../../prisma/generated/client";

const parametersSchema = TypeCompiler.Compile(
  t.Object({
    conferenceId: t.String(),
    committeeId: t.String(),
  }),
);

export const committeeRoleGuard = new Elysia()
  .use(session)
  .macro(({ onBeforeHandle }) => {
    return {
      hasCommitteeRole(roles: CommitteeRole[]) {
        onBeforeHandle(async ({ session, set, params }) => {
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
