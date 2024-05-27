import type { AbilityBuilder } from "@casl/ability";
import type { AppAbility } from "../abilities";
import type { IntrospectionResult } from "../../oidc";

export const defineAbilitiesForMessages = (
  intro: IntrospectionResult,
  { can }: AbilityBuilder<AppAbility>,
) => {
  if (intro.user) {
    const user = intro.user;
    can("create", "Message", {
      committee: {
        OR: [
          {
            conference: {
              members: {
                some: {
                  user: { id: user.id },
                  role: {
                    in: [
                      "ADMIN",
                      "CHAIR",
                      "COMMITTEE_ADVISOR",
                      "SECRETARIAT",
                      "NON_STATE_ACTOR",
                    ],
                  },
                },
              },
            },
          },
          {
            members: {
              some: {
                user: { id: user.id },
              },
            },
          },
        ],
      },
    });

    can(["update", "list", "read"], "Message", {
      committee: {
        conference: {
          members: {
            some: {
              user: { id: user.id },
              role: {
                in: ["ADMIN", "CHAIR", "COMMITTEE_ADVISOR", "SECRETARIAT"],
              },
            },
          },
        },
      },
    });
  }
};
