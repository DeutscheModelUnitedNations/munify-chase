import Elysia from "elysia";
import { session } from "../session";

export const loggedIn = new Elysia()
  .use(session)
  .macro(({ onBeforeHandle }) => {
    return {
      mustBeLoggedIn(enabled = false) {
        if (!enabled) return;
        onBeforeHandle(async ({ session, set }) => {
          if (!session.loggedIn) {
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
