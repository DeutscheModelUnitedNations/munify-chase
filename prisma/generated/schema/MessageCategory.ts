import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const MessageCategory = t.Union(
  [
    t.Literal("TO_CHAIR"),
    t.Literal("GUEST_SPEAKER"),
    t.Literal("FACT_CHECK"),
    t.Literal("INFORMATION"),
    t.Literal("GENERAL_SECRETARY"),
    t.Literal("OTHER"),
  ],
  { additionalProperties: false },
);
