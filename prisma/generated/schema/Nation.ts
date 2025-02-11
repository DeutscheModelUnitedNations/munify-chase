import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const NationPlain = t.Object(
  {
    id: t.String({ additionalProperties: false }),
    alpha3Code: t.String({ additionalProperties: false }),
    variant: t.Union(
      [
        t.Literal("NATION"),
        t.Literal("NON_STATE_ACTOR"),
        t.Literal("SPECIAL_PERSON"),
      ],
      { additionalProperties: false },
    ),
  },
  {
    additionalProperties: false,
    description: `A nation in the system. E.g. Germany`,
  },
);

export const NationRelations = t.Object(
  {
    delegations: t.Array(
      t.Object(
        {
          id: t.String({ additionalProperties: false }),
          conferenceId: t.String({ additionalProperties: false }),
          nationId: t.String({ additionalProperties: false }),
        },
        { additionalProperties: false },
      ),
    ),
  },
  {
    additionalProperties: false,
    description: `A nation in the system. E.g. Germany`,
  },
);

export const NationPlainInputCreate = t.Object(
  {
    alpha3Code: t.String({ additionalProperties: false }),
    variant: t.Optional(
      t.Union(
        [
          t.Literal("NATION"),
          t.Literal("NON_STATE_ACTOR"),
          t.Literal("SPECIAL_PERSON"),
        ],
        { additionalProperties: false },
      ),
    ),
  },
  {
    additionalProperties: false,
    description: `A nation in the system. E.g. Germany`,
  },
);

export const NationPlainInputUpdate = t.Object(
  {
    alpha3Code: t.String({ additionalProperties: false }),
    variant: t.Optional(
      t.Union(
        [
          t.Literal("NATION"),
          t.Literal("NON_STATE_ACTOR"),
          t.Literal("SPECIAL_PERSON"),
        ],
        { additionalProperties: false },
      ),
    ),
  },
  {
    additionalProperties: false,
    description: `A nation in the system. E.g. Germany`,
  },
);

export const NationRelationsInputCreate = t.Object(
  {
    delegations: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
          ),
        },
        { additionalProperties: false },
      ),
    ),
  },
  {
    additionalProperties: false,
    description: `A nation in the system. E.g. Germany`,
  },
);

export const NationRelationsInputUpdate = t.Partial(
  t.Object(
    {
      delegations: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
            ),
          },
          { additionalProperties: false },
        ),
        { additionalProperties: false },
      ),
    },
    {
      additionalProperties: false,
      description: `A nation in the system. E.g. Germany`,
    },
  ),
  { additionalProperties: false },
);

export const NationWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self)]),
          NOT: t.Union([Self, t.Array(Self)]),
          OR: t.Array(Self),
          id: t.String(),
          alpha3Code: t.String(),
          variant: t.Union(
            [
              t.Literal("NATION"),
              t.Literal("NON_STATE_ACTOR"),
              t.Literal("SPECIAL_PERSON"),
            ],
            { additionalProperties: false },
          ),
        },
        { description: `A nation in the system. E.g. Germany` },
      ),
    { $id: "Nation" },
  ),
  { additionalProperties: false },
);

export const NationWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect([
      t.Partial(
        t.Object(
          { id: t.String(), alpha3Code: t.String() },
          { description: `A nation in the system. E.g. Germany` },
        ),
      ),
      t.Union([
        t.Object({ id: t.String() }),
        t.Object({ alpha3Code: t.String() }),
      ]),
      t.Partial(
        t.Object({
          AND: t.Union([Self, t.Array(Self)]),
          NOT: t.Union([Self, t.Array(Self)]),
          OR: t.Array(Self),
        }),
      ),
      t.Partial(
        t.Object(
          {
            id: t.String(),
            alpha3Code: t.String(),
            variant: t.Union(
              [
                t.Literal("NATION"),
                t.Literal("NON_STATE_ACTOR"),
                t.Literal("SPECIAL_PERSON"),
              ],
              { additionalProperties: false },
            ),
          },
          { additionalProperties: false },
        ),
        { additionalProperties: false },
      ),
    ]),
  { $id: "Nation" },
);

export const NationSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      alpha3Code: t.Boolean(),
      variant: t.Boolean(),
      delegations: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `A nation in the system. E.g. Germany`,
    },
  ),
  { additionalProperties: false },
);

export const NationInclude = t.Partial(
  t.Object(
    { variant: t.Boolean(), delegations: t.Boolean(), _count: t.Boolean() },
    {
      additionalProperties: false,
      description: `A nation in the system. E.g. Germany`,
    },
  ),
  { additionalProperties: false },
);

export const NationOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")]),
      alpha3Code: t.Union([t.Literal("asc"), t.Literal("desc")]),
    },
    {
      additionalProperties: false,
      description: `A nation in the system. E.g. Germany`,
    },
  ),
  { additionalProperties: false },
);

export const Nation = t.Composite([NationPlain, NationRelations], {
  additionalProperties: false,
});

export const NationInputCreate = t.Composite(
  [NationPlainInputCreate, NationRelationsInputCreate],
  { additionalProperties: false },
);

export const NationInputUpdate = t.Composite(
  [NationPlainInputUpdate, NationRelationsInputUpdate],
  { additionalProperties: false },
);
