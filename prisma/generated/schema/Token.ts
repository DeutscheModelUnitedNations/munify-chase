import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const TokenPlain = t.Object(
  {
    id: t.String({ additionalProperties: false }),
    expiresAt: t.Date({ additionalProperties: false }),
  },
  {
    additionalProperties: false,
    description: `A token which can be used to grant one time access to something in the app
e.g. confirming an email, resetting a password`,
  },
);

export const TokenRelations = t.Object(
  {
    pendingEmailConfirmations: t.Array(
      t.Object(
        {
          email: t.String({ additionalProperties: false }),
          userId: t.String({ additionalProperties: false }),
          validated: t.Boolean({ additionalProperties: false }),
          validationTokenId: __nullable__(
            t.String({ additionalProperties: false }),
          ),
        },
        { additionalProperties: false },
      ),
    ),
    pendingCredentialCreations: t.Array(
      t.Object(
        {
          id: t.String({ additionalProperties: false }),
          userId: t.String({ additionalProperties: false }),
          tokenId: t.String({ additionalProperties: false }),
        },
        { additionalProperties: false },
      ),
    ),
  },
  {
    additionalProperties: false,
    description: `A token which can be used to grant one time access to something in the app
e.g. confirming an email, resetting a password`,
  },
);

export const TokenPlainInputCreate = t.Object(
  { expiresAt: t.Date({ additionalProperties: false }) },
  {
    additionalProperties: false,
    description: `A token which can be used to grant one time access to something in the app
e.g. confirming an email, resetting a password`,
  },
);

export const TokenPlainInputUpdate = t.Object(
  { expiresAt: t.Optional(t.Date({ additionalProperties: false })) },
  {
    additionalProperties: false,
    description: `A token which can be used to grant one time access to something in the app
e.g. confirming an email, resetting a password`,
  },
);

export const TokenRelationsInputCreate = t.Object(
  {
    pendingEmailConfirmations: t.Optional(
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
    pendingCredentialCreations: t.Optional(
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
    description: `A token which can be used to grant one time access to something in the app
e.g. confirming an email, resetting a password`,
  },
);

export const TokenRelationsInputUpdate = t.Partial(
  t.Object(
    {
      pendingEmailConfirmations: t.Partial(
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
      pendingCredentialCreations: t.Partial(
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
      description: `A token which can be used to grant one time access to something in the app
e.g. confirming an email, resetting a password`,
    },
  ),
  { additionalProperties: false },
);

export const TokenWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self)]),
          NOT: t.Union([Self, t.Array(Self)]),
          OR: t.Array(Self),
          id: t.String(),
          expiresAt: t.Date(),
        },
        {
          description: `A token which can be used to grant one time access to something in the app
e.g. confirming an email, resetting a password`,
        },
      ),
    { $id: "Token" },
  ),
  { additionalProperties: false },
);

export const TokenWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect([
      t.Partial(
        t.Object(
          { id: t.String() },
          {
            description: `A token which can be used to grant one time access to something in the app
e.g. confirming an email, resetting a password`,
          },
        ),
      ),
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
          { id: t.String(), expiresAt: t.Date() },
          { additionalProperties: false },
        ),
        { additionalProperties: false },
      ),
    ]),
  { $id: "Token" },
);

export const TokenSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      expiresAt: t.Boolean(),
      pendingEmailConfirmations: t.Boolean(),
      pendingCredentialCreations: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `A token which can be used to grant one time access to something in the app
e.g. confirming an email, resetting a password`,
    },
  ),
  { additionalProperties: false },
);

export const TokenInclude = t.Partial(
  t.Object(
    {
      pendingEmailConfirmations: t.Boolean(),
      pendingCredentialCreations: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `A token which can be used to grant one time access to something in the app
e.g. confirming an email, resetting a password`,
    },
  ),
  { additionalProperties: false },
);

export const TokenOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")]),
      expiresAt: t.Union([t.Literal("asc"), t.Literal("desc")]),
    },
    {
      additionalProperties: false,
      description: `A token which can be used to grant one time access to something in the app
e.g. confirming an email, resetting a password`,
    },
  ),
  { additionalProperties: false },
);

export const Token = t.Composite([TokenPlain, TokenRelations], {
  additionalProperties: false,
});

export const TokenInputCreate = t.Composite(
  [TokenPlainInputCreate, TokenRelationsInputCreate],
  { additionalProperties: false },
);

export const TokenInputUpdate = t.Composite(
  [TokenPlainInputUpdate, TokenRelationsInputUpdate],
  { additionalProperties: false },
);
