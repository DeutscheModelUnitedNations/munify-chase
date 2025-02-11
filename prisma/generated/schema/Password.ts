import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PasswordPlain = t.Object(
  {
    id: t.String({ additionalProperties: false }),
    userId: t.String({ additionalProperties: false }),
  },
  { additionalProperties: false },
);

export const PasswordRelations = t.Object(
  {
    user: t.Object(
      {
        id: t.String({ additionalProperties: false }),
        name: t.String({ additionalProperties: false }),
      },
      { additionalProperties: false, description: `A user in the system` },
    ),
  },
  { additionalProperties: false },
);

export const PasswordPlainInputCreate = t.Object(
  {},
  { additionalProperties: false },
);

export const PasswordPlainInputUpdate = t.Object(
  {},
  { additionalProperties: false },
);

export const PasswordRelationsInputCreate = t.Object(
  {
    user: t.Object(
      {
        connect: t.Object(
          {
            id: t.String({ additionalProperties: false }),
          },
          { additionalProperties: false },
        ),
      },
      { additionalProperties: false },
    ),
  },
  { additionalProperties: false },
);

export const PasswordRelationsInputUpdate = t.Partial(
  t.Object(
    {
      user: t.Object(
        {
          connect: t.Object(
            {
              id: t.String({ additionalProperties: false }),
            },
            { additionalProperties: false },
          ),
        },
        { additionalProperties: false },
      ),
    },
    { additionalProperties: false },
  ),
  { additionalProperties: false },
);

export const PasswordWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object({
        AND: t.Union([Self, t.Array(Self)]),
        NOT: t.Union([Self, t.Array(Self)]),
        OR: t.Array(Self),
        id: t.String(),
        userId: t.String(),
      }),
    { $id: "Password" },
  ),
  { additionalProperties: false },
);

export const PasswordWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect([
      t.Partial(t.Object({ id: t.String() })),
      t.Union([t.Object({ id: t.String() })]),
      t.Partial(
        t.Object({
          AND: t.Union([Self, t.Array(Self)]),
          NOT: t.Union([Self, t.Array(Self)]),
          OR: t.Array(Self),
        }),
      ),
      t.Partial(
        t.Object(
          { id: t.String(), userId: t.String() },
          { additionalProperties: false },
        ),
        { additionalProperties: false },
      ),
    ]),
  { $id: "Password" },
);

export const PasswordSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      user: t.Boolean(),
      userId: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
  { additionalProperties: false },
);

export const PasswordInclude = t.Partial(
  t.Object(
    { user: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
  { additionalProperties: false },
);

export const PasswordOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")]),
      userId: t.Union([t.Literal("asc"), t.Literal("desc")]),
    },
    { additionalProperties: false },
  ),
  { additionalProperties: false },
);

export const Password = t.Composite([PasswordPlain, PasswordRelations], {
  additionalProperties: false,
});

export const PasswordInputCreate = t.Composite(
  [PasswordPlainInputCreate, PasswordRelationsInputCreate],
  { additionalProperties: false },
);

export const PasswordInputUpdate = t.Composite(
  [PasswordPlainInputUpdate, PasswordRelationsInputUpdate],
  { additionalProperties: false },
);
