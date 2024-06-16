import type { AbilityBuilder } from "@casl/ability";
import type { AppAbility } from "../abilities";
import type { IntrospectionResult } from "../../oidc";

export const defineAbilitiesForConferenceMembers = (
  intro: IntrospectionResult,
  { can }: AbilityBuilder<AppAbility>,
) => {
  if (intro.user) {
    const user = intro.user;
    // biome-ignore lint/suspicious/noExplicitAny:
    can("manage" as any, "ConferenceMember", {
      conference: {
        members: { some: { user: { id: user.id }, role: "ADMIN" } },
      },
    });

    can("read", "ConferenceMember", {
      user: { id: { equals: user.id } },
    });
  }
};
