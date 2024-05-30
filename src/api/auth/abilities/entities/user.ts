import type { AbilityBuilder } from "@casl/ability";
import type { AppAbility } from "../abilities";
import type { IntrospectionResult } from "../../oidc";

export const defineAbilitiesForUser = (
  _intro: IntrospectionResult,
  { can: _can }: AbilityBuilder<AppAbility>,
) => {
  // if (intro.user) {
  //   const user = intro.user;
  // }
};
