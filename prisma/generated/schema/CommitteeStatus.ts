import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const CommitteeStatus = t.Union(
  [
    t.Literal("FORMAL"),
    t.Literal("INFORMAL"),
    t.Literal("PAUSE"),
    t.Literal("SUSPENSION"),
    t.Literal("CLOSED"),
  ],
  { additionalProperties: false },
);
