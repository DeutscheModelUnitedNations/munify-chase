import { t } from "elysia";

import { _Nullable } from "./__nullable__";

export const MessageStatus = t.Union(
  [
    t.Literal("UNREAD"),
    t.Literal("PRIORITY"),
    t.Literal("ASSIGNED"),
    t.Literal("ARCHIVED"),
  ],
  { description: ``, additionalProperties: false },
);
