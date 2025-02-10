import { t } from "elysia";

import { _Nullable } from "./__nullable__";

export const ConferenceCreateTokenPlain = t.Object(
  { token: t.String({ description: ``, additionalProperties: false }) },
  {
    description: `Consumeable token which grants the creation of a conference`,
    additionalProperties: false,
  },
);

export const ConferenceCreateTokenRelations = t.Object(
  {},
  {
    description: `Consumeable token which grants the creation of a conference`,
    additionalProperties: false,
  },
);

export const ConferenceCreateToken = t.Composite(
  [ConferenceCreateTokenPlain, ConferenceCreateTokenRelations],
  {
    description: `Composition of ConferenceCreateTokenPlain, ConferenceCreateTokenRelations`,
    additionalProperties: false,
  },
);

export const ConferenceCreateTokenWhere = t.Union([
  t.Composite([
    t.Pick(
      t.Required(
        t.Composite([
          t.Object({}),
          t.Pick(ConferenceCreateTokenPlain, ["token"]),
        ]),
      ),
      ["token"],
    ),
    t.Omit(
      t.Partial(
        t.Composite([
          t.Object({}),
          t.Pick(ConferenceCreateTokenPlain, ["token"]),
        ]),
      ),
      ["token"],
    ),
  ]),
]);

export const ConferenceCreateTokenDataPlain = t.Object(
  {},
  {
    description: `Consumeable token which grants the creation of a conference`,
    additionalProperties: false,
  },
);

export const ConferenceCreateTokenDataRelations = t.Object(
  {},
  {
    description: `Consumeable token which grants the creation of a conference`,
    additionalProperties: false,
  },
);

export const ConferenceCreateTokenData = t.Composite(
  [ConferenceCreateTokenDataPlain, ConferenceCreateTokenDataRelations],
  {
    description: `Composition of ConferenceCreateTokenDataPlain, ConferenceCreateTokenDataRelations`,
    additionalProperties: false,
  },
);

export const ConferenceCreateTokenDataPlainOptional = t.Object(
  {},
  {
    description: `Consumeable token which grants the creation of a conference`,
    additionalProperties: false,
  },
);

export const ConferenceCreateTokenDataRelationsOptional = t.Object(
  {},
  {
    description: `Consumeable token which grants the creation of a conference`,
    additionalProperties: false,
  },
);

export const ConferenceCreateTokenDataOptional = t.Composite(
  [
    ConferenceCreateTokenDataPlainOptional,
    ConferenceCreateTokenDataRelationsOptional,
  ],
  {
    description: `Composition of ConferenceCreateTokenDataPlainOptional, ConferenceCreateTokenDataRelationsOptional`,
    additionalProperties: false,
  },
);
