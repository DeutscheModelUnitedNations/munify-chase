import { t } from "elysia";

import { _Nullable } from "./__nullable__";

export const SpeakersListCategory = t.Union(
  [
    t.Literal("SPEAKERS_LIST"),
    t.Literal("COMMENT_LIST"),
    t.Literal("MODERATED_CAUCUS"),
  ],
  { description: `The type of a speakers list`, additionalProperties: false },
);
