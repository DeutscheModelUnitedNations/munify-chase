import Elysia from "elysia";
import { session } from "../session";

export const loggedInGuard = new Elysia({
  name: "loggedInGuard",
})
  .use(session)
  .macro(({ onBeforeHandle }) => {
    return {
      mustBeLoggedIn(enabled = false) {
        if (!enabled) return;
        onBeforeHandle(async ({ session, set }) => {
          if (session?.data?.loggedIn !== true) {
            set.status = "Unauthorized";
            return "Unauthorized";
          }
        });
      },
    };
  });
