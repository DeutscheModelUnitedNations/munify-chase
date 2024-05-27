import type { AbilityBuilder } from "@casl/ability";
import type { AppAbility } from "../abilities";
import type { IntrospectionResult } from "../../oidc";

export const defineAbilitiesForSpeakerOnList = (
  intro: IntrospectionResult,
  { can }: AbilityBuilder<AppAbility>,
) => {
  if (intro.user) {
    const user = intro.user;
    can(["create", "list", "read"], "SpeakerOnList", {
      speakersList: {
        agendaItem: {
          committee: {
            OR: [
              {
                conference: {
                  members: {
                    some: {
                      user: { id: user.id },
                      role: { in: ["ADMIN", "CHAIR", "COMMITTEE_ADVISOR"] },
                    },
                  },
                },
              },
              {
                members: { some: { user: { id: user.id } } },
              },
            ],
          },
        },
      },
    });

    can("delete", "SpeakerOnList", {
      OR: [
        {
          speakersList: {
            agendaItem: {
              committee: {
                conference: {
                  members: {
                    some: {
                      user: { id: user.id },
                      role: { in: ["ADMIN", "CHAIR", "COMMITTEE_ADVISOR"] },
                    },
                  },
                },
              },
            },
          },
        },
        {
          committeeMember: {
            user: { id: user.id },
          },
        },
      ],
    });

    can("update", "SpeakerOnList", {
      speakersList: {
        agendaItem: {
          committee: {
            conference: {
              members: {
                some: {
                  user: { id: user.id },
                  role: { in: ["ADMIN", "CHAIR", "COMMITTEE_ADVISOR"] },
                },
              },
            },
          },
        },
      },
    });
  }
};
