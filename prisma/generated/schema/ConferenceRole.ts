import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ConferenceRole = t.Union(
  [
    t.Literal("ADMIN"),
    t.Literal("SECRETARIAT"),
    t.Literal("CHAIR"),
    t.Literal("COMMITTEE_ADVISOR"),
    t.Literal("NON_STATE_ACTOR"),
    t.Literal("PRESS_CORPS"),
    t.Literal("GUEST"),
    t.Literal("PARTICIPANT_CARE"),
    t.Literal("MISCELLANEOUS_TEAM"),
  ],
  {
    additionalProperties: false,
    description: `The role of a user in a conference`,
  },
);
