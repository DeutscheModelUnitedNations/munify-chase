import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const Presence = t.Union(
  [t.Literal("PRESENT"), t.Literal("EXCUSED"), t.Literal("ABSENT")],
  {
    additionalProperties: false,
    description: `The presence status of a CommitteeMember`,
  },
);
