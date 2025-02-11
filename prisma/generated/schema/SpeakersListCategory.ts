import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const SpeakersListCategory = t.Union(
  [
    t.Literal("SPEAKERS_LIST"),
    t.Literal("COMMENT_LIST"),
    t.Literal("MODERATED_CAUCUS"),
  ],
  { additionalProperties: false, description: `The type of a speakers list` },
);
