import type { AbilityBuilder } from "@casl/ability";
import type { AppAbility } from "../abilities";
import type { IntrospectionResult } from "../../oidc";

export const defineAbilitiesForDelegation = (
  intro: IntrospectionResult,
  { can }: AbilityBuilder<AppAbility>,
) => {
  if (intro.user) {
    const user = intro.user;
    can(["create", "update", "delete"], "Delegation", {
      conference: {
        members: { some: { user: { id: user.id }, role: "ADMIN" } },
      },
    });

    can(["read", "list"], "Delegation", {
      conference: {
        members: {
          some: {
            user: { id: user.id },
            role: { in: ["ADMIN", "PARTICIPANT_CARE"] },
          },
        },
      },
    });
  }
};
