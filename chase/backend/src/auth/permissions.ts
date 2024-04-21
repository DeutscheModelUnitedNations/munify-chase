import Elysia from "elysia";
import { sessionPlugin } from "./session";
import { type Action, defineAbilitiesForSession } from "./abilities/abilities";
import { accessibleBy } from "./abilities/casl-prisma";

export const permissionsPlugin = new Elysia({
  name: "permissions",
})
  .use(sessionPlugin)
  .derive({ as: "scoped" }, ({ session, error }) => {
    if (!session) throw new Error("Invalid state: session not found.");
    const abilities = defineAbilitiesForSession(session);
    return {
      permissions: {
        abilities,
        accessibleBy: (action: Action = "read") =>
          accessibleBy(abilities, action),
        checkIf: (perms: boolean | ((a: typeof abilities) => boolean)) => {
          if (typeof perms === "boolean") {
            if (!perms) {
              throw error("Unauthorized", "Permission check failed.");
            }
          } else {
            if (!perms(abilities)) {
              throw error("Unauthorized", "Permission check failed.");
            }
          }
        },
      },
    };
  });
