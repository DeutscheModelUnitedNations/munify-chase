import { AbilityBuilder } from "@casl/ability";
import { AppAbility } from "../abilities";
import { Session } from "../../session";

export const defineAbilitiesForConference = (
  session: Session,
  { can }: AbilityBuilder<AppAbility>
) => {
  if (session.data?.loggedIn && session.data.user) {
    const user = session.data.user;
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
