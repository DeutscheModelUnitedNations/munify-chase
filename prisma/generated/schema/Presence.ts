import { t } from "elysia";

import { _Nullable } from "./__nullable__";

export const Presence = t.Union(
  [t.Literal("PRESENT"), t.Literal("EXCUSED"), t.Literal("ABSENT")],
  {
    description: `The presence status of a CommitteeMember`,
    additionalProperties: false,
  },
);
