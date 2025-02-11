import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ConferenceCreateTokenPlain = t.Object(
  { token: t.String({ additionalProperties: false }) },
  {
    additionalProperties: false,
    description: `Consumeable token which grants the creation of a conference`,
  },
);

export const ConferenceCreateTokenRelations = t.Object(
  {},
  {
    additionalProperties: false,
    description: `Consumeable token which grants the creation of a conference`,
  },
);

export const ConferenceCreateTokenPlainInputCreate = t.Object(
  {},
  {
    additionalProperties: false,
    description: `Consumeable token which grants the creation of a conference`,
  },
);

export const ConferenceCreateTokenPlainInputUpdate = t.Object(
  {},
  {
    additionalProperties: false,
    description: `Consumeable token which grants the creation of a conference`,
  },
);

export const ConferenceCreateTokenRelationsInputCreate = t.Object(
  {},
  {
    additionalProperties: false,
    description: `Consumeable token which grants the creation of a conference`,
  },
);

export const ConferenceCreateTokenRelationsInputUpdate = t.Partial(
  t.Object(
    {},
    {
      additionalProperties: false,
      description: `Consumeable token which grants the creation of a conference`,
    },
  ),
  { additionalProperties: false },
);

export const ConferenceCreateTokenWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self)]),
          NOT: t.Union([Self, t.Array(Self)]),
          OR: t.Array(Self),
          token: t.String(),
        },
        {
          description: `Consumeable token which grants the creation of a conference`,
        },
      ),
    { $id: "ConferenceCreateToken" },
  ),
  { additionalProperties: false },
);

export const ConferenceCreateTokenWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect([
      t.Partial(
        t.Object(
          { token: t.String() },
          {
            description: `Consumeable token which grants the creation of a conference`,
          },
        ),
      ),
      t.Union([t.Object({ token: t.String() })]),
      t.Partial(
        t.Object({
          AND: t.Union([Self, t.Array(Self)]),
          NOT: t.Union([Self, t.Array(Self)]),
          OR: t.Array(Self),
        }),
      ),
      t.Partial(
        t.Object({ token: t.String() }, { additionalProperties: false }),
        { additionalProperties: false },
      ),
    ]),
  { $id: "ConferenceCreateToken" },
);

export const ConferenceCreateTokenSelect = t.Partial(
  t.Object(
    { token: t.Boolean(), _count: t.Boolean() },
    {
      additionalProperties: false,
      description: `Consumeable token which grants the creation of a conference`,
    },
  ),
  { additionalProperties: false },
);

export const ConferenceCreateTokenInclude = t.Partial(
  t.Object(
    { _count: t.Boolean() },
    {
      additionalProperties: false,
      description: `Consumeable token which grants the creation of a conference`,
    },
  ),
  { additionalProperties: false },
);

export const ConferenceCreateTokenOrderBy = t.Partial(
  t.Object(
    { token: t.Union([t.Literal("asc"), t.Literal("desc")]) },
    {
      additionalProperties: false,
      description: `Consumeable token which grants the creation of a conference`,
    },
  ),
  { additionalProperties: false },
);

export const ConferenceCreateToken = t.Composite(
  [ConferenceCreateTokenPlain, ConferenceCreateTokenRelations],
  { additionalProperties: false },
);

export const ConferenceCreateTokenInputCreate = t.Composite(
  [
    ConferenceCreateTokenPlainInputCreate,
    ConferenceCreateTokenRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const ConferenceCreateTokenInputUpdate = t.Composite(
  [
    ConferenceCreateTokenPlainInputUpdate,
    ConferenceCreateTokenRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
