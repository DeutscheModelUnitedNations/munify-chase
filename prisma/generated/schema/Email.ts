import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const EmailPlain = t.Object(
  {
    email: t.String({ additionalProperties: false }),
    userId: t.String({ additionalProperties: false }),
    validated: t.Boolean({ additionalProperties: false }),
    validationTokenId: __nullable__(t.String({ additionalProperties: false })),
  },
  { additionalProperties: false },
);

export const EmailRelations = t.Object(
  {
    user: t.Object(
      {
        id: t.String({ additionalProperties: false }),
        name: t.String({ additionalProperties: false }),
      },
      { additionalProperties: false, description: `A user in the system` },
    ),
    validationToken: __nullable__(
      t.Object(
        {
          id: t.String({ additionalProperties: false }),
          expiresAt: t.Date({ additionalProperties: false }),
        },
        {
          additionalProperties: false,
          description: `A token which can be used to grant one time access to something in the app
e.g. confirming an email, resetting a password`,
        },
      ),
    ),
  },
  { additionalProperties: false },
);

export const EmailPlainInputCreate = t.Object(
  { validated: t.Optional(t.Boolean({ additionalProperties: false })) },
  { additionalProperties: false },
);

export const EmailPlainInputUpdate = t.Object(
  { validated: t.Optional(t.Boolean({ additionalProperties: false })) },
  { additionalProperties: false },
);

export const EmailRelationsInputCreate = t.Object(
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
    validationToken: t.Optional(
      t.Object(
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
    ),
  },
  { additionalProperties: false },
);

export const EmailRelationsInputUpdate = t.Partial(
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
      validationToken: t.Partial(
        t.Object(
          {
            connect: t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
            disconnect: t.Boolean(),
          },
          { additionalProperties: false },
        ),
        { additionalProperties: false },
      ),
    },
    { additionalProperties: false },
  ),
  { additionalProperties: false },
);

export const EmailWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object({
        AND: t.Union([Self, t.Array(Self)]),
        NOT: t.Union([Self, t.Array(Self)]),
        OR: t.Array(Self),
        email: t.String(),
        userId: t.String(),
        validated: t.Boolean(),
        validationTokenId: t.String(),
      }),
    { $id: "Email" },
  ),
  { additionalProperties: false },
);

export const EmailWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect([
      t.Partial(
        t.Object({
          email: t.String(),
          userId_email: t.Object({ userId: t.String(), email: t.String() }),
        }),
      ),
      t.Union([
        t.Object({ email: t.String() }),
        t.Object({
          userId_email: t.Object({ userId: t.String(), email: t.String() }),
        }),
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
            email: t.String(),
            userId: t.String(),
            validated: t.Boolean(),
            validationTokenId: t.String(),
          },
          { additionalProperties: false },
        ),
        { additionalProperties: false },
      ),
    ]),
  { $id: "Email" },
);

export const EmailSelect = t.Partial(
  t.Object(
    {
      email: t.Boolean(),
      user: t.Boolean(),
      userId: t.Boolean(),
      validated: t.Boolean(),
      validationToken: t.Boolean(),
      validationTokenId: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
  { additionalProperties: false },
);

export const EmailInclude = t.Partial(
  t.Object(
    { user: t.Boolean(), validationToken: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
  { additionalProperties: false },
);

export const EmailOrderBy = t.Partial(
  t.Object(
    {
      email: t.Union([t.Literal("asc"), t.Literal("desc")]),
      userId: t.Union([t.Literal("asc"), t.Literal("desc")]),
      validated: t.Union([t.Literal("asc"), t.Literal("desc")]),
      validationTokenId: t.Union([t.Literal("asc"), t.Literal("desc")]),
    },
    { additionalProperties: false },
  ),
  { additionalProperties: false },
);

export const Email = t.Composite([EmailPlain, EmailRelations], {
  additionalProperties: false,
});

export const EmailInputCreate = t.Composite(
  [EmailPlainInputCreate, EmailRelationsInputCreate],
  { additionalProperties: false },
);

export const EmailInputUpdate = t.Composite(
  [EmailPlainInputUpdate, EmailRelationsInputUpdate],
  { additionalProperties: false },
);
