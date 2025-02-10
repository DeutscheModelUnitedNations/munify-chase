import { t } from "elysia";

import { _Nullable } from "./__nullable__";

export const NationVariant = t.Union(
  [
    t.Literal("NATION"),
    t.Literal("NON_STATE_ACTOR"),
    t.Literal("SPECIAL_PERSON"),
  ],
  { description: ``, additionalProperties: false },
);
