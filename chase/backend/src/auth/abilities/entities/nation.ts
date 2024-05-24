import type { AbilityBuilder } from "@casl/ability";
import type { AppAbility } from "../abilities";
import type { Session } from "../../session";

export const defineAbilitiesForNation = (
  session: Session,
  { can }: AbilityBuilder<AppAbility>,
) => {
  if (session.data?.loggedIn && session.data.user) {
    const user = session.data.user;
  }
};
