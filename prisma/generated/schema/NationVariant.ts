import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const NationVariant = t.Union(
  [
    t.Literal("NATION"),
    t.Literal("NON_STATE_ACTOR"),
    t.Literal("SPECIAL_PERSON"),
  ],
  { additionalProperties: false },
);
