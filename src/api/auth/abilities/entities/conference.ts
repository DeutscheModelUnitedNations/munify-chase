import type { AbilityBuilder } from "@casl/ability";
import type { AppAbility } from "../abilities";
import type { IntrospectionResult } from "../../oidc";

export const defineAbilitiesForConference = (
  intro: IntrospectionResult,
  { can }: AbilityBuilder<AppAbility>,
) => {
  if (intro.user) {
    const user = intro.user;
    can("create", "Conference"); // also requires creation token
    can(["list", "read"], "Conference", {
      OR: [
        { members: { some: { user: { id: user.id } } } },
        {
          committees: {
            some: { members: { some: { user: { id: user.id } } } },
          },
        },
      ],
    });
    can(["update", "delete"], "Conference", {
      members: { some: { user: { id: user.id }, role: "ADMIN" } },
    });
  }
};
