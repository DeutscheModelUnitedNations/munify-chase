import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const CommitteeCategory = t.Union(
  [t.Literal("COMMITTEE"), t.Literal("CRISIS"), t.Literal("ICJ")],
  {
    additionalProperties: false,
    description: `The type of a committee in a conference`,
  },
);
