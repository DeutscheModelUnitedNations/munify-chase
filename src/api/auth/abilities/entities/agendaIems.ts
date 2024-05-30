import type { AbilityBuilder } from "@casl/ability";
import type { AppAbility } from "../abilities";
import type { IntrospectionResult } from "../../oidc";

export const defineAbilitiesForAgendaItem = (
  intro: IntrospectionResult,
  { can }: AbilityBuilder<AppAbility>,
) => {
  if (intro.user) {
    const user = intro.user;
    can(["create", "delete", "update"], "AgendaItem", {
      committee: {
        conference: {
          members: { some: { user: { id: user.id }, role: "ADMIN" } },
        },
      },
    });

    can(["list", "read"], "AgendaItem", {
      committee: {
        conference: {
          members: { some: { user: { id: user.id } } },
        },
        members: {
          some: { user: { id: user.id } },
        },
      },
    });

    can("update", "AgendaItem", ["isActive"], {
      committee: {
        conference: {
          members: {
            some: {
              user: { id: user.id },
              role: {
                in: ["ADMIN", "CHAIR", "COMMITTEE_ADVISOR"],
              },
            },
          },
        },
      },
    });
  }
};
