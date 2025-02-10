import { t } from "elysia";

import { _Nullable } from "./__nullable__";

export const CommitteeCategory = t.Union(
  [t.Literal("COMMITTEE"), t.Literal("CRISIS"), t.Literal("ICJ")],
  {
    description: `The type of a committee in a conference`,
    additionalProperties: false,
  },
);
