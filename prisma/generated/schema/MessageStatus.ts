import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const MessageStatus = t.Union(
  [
    t.Literal("UNREAD"),
    t.Literal("PRIORITY"),
    t.Literal("ASSIGNED"),
    t.Literal("ARCHIVED"),
  ],
  { additionalProperties: false },
);
