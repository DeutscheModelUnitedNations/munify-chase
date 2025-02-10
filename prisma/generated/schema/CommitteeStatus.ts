import { t } from "elysia";

import { _Nullable } from "./__nullable__";

export const CommitteeStatus = t.Union(
  [
    t.Literal("FORMAL"),
    t.Literal("INFORMAL"),
    t.Literal("PAUSE"),
    t.Literal("SUSPENSION"),
    t.Literal("CLOSED"),
  ],
  { description: ``, additionalProperties: false },
);
