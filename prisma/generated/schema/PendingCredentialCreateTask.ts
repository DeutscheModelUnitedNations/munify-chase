import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PendingCredentialCreateTaskPlain = t.Object(
  {
    id: t.String({ additionalProperties: false }),
    userId: t.String({ additionalProperties: false }),
    tokenId: t.String({ additionalProperties: false }),
  },
  { additionalProperties: false },
);

export const PendingCredentialCreateTaskRelations = t.Object(
  {
    user: t.Object(
      {
        id: t.String({ additionalProperties: false }),
        name: t.String({ additionalProperties: false }),
      },
      { additionalProperties: false, description: `A user in the system` },
    ),
    token: t.Object(
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
  },
  { additionalProperties: false },
);

export const PendingCredentialCreateTaskPlainInputCreate = t.Object(
  {},
  { additionalProperties: false },
);

export const PendingCredentialCreateTaskPlainInputUpdate = t.Object(
  {},
  { additionalProperties: false },
);

export const PendingCredentialCreateTaskRelationsInputCreate = t.Object(
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
    token: t.Object(
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

export const PendingCredentialCreateTaskRelationsInputUpdate = t.Partial(
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
      token: t.Object(
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

export const PendingCredentialCreateTaskWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object({
        AND: t.Union([Self, t.Array(Self)]),
        NOT: t.Union([Self, t.Array(Self)]),
        OR: t.Array(Self),
        id: t.String(),
        userId: t.String(),
        tokenId: t.String(),
      }),
    { $id: "PendingCredentialCreateTask" },
  ),
  { additionalProperties: false },
);

export const PendingCredentialCreateTaskWhereUnique = t.Recursive(
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
          { id: t.String(), userId: t.String(), tokenId: t.String() },
          { additionalProperties: false },
        ),
        { additionalProperties: false },
      ),
    ]),
  { $id: "PendingCredentialCreateTask" },
);

export const PendingCredentialCreateTaskSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      user: t.Boolean(),
      userId: t.Boolean(),
      token: t.Boolean(),
      tokenId: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
  { additionalProperties: false },
);

export const PendingCredentialCreateTaskInclude = t.Partial(
  t.Object(
    { user: t.Boolean(), token: t.Boolean(), _count: t.Boolean() },
    { additionalProperties: false },
  ),
  { additionalProperties: false },
);

export const PendingCredentialCreateTaskOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")]),
      userId: t.Union([t.Literal("asc"), t.Literal("desc")]),
      tokenId: t.Union([t.Literal("asc"), t.Literal("desc")]),
    },
    { additionalProperties: false },
  ),
  { additionalProperties: false },
);

export const PendingCredentialCreateTask = t.Composite(
  [PendingCredentialCreateTaskPlain, PendingCredentialCreateTaskRelations],
  { additionalProperties: false },
);

export const PendingCredentialCreateTaskInputCreate = t.Composite(
  [
    PendingCredentialCreateTaskPlainInputCreate,
    PendingCredentialCreateTaskRelationsInputCreate,
  ],
  { additionalProperties: false },
);

export const PendingCredentialCreateTaskInputUpdate = t.Composite(
  [
    PendingCredentialCreateTaskPlainInputUpdate,
    PendingCredentialCreateTaskRelationsInputUpdate,
  ],
  { additionalProperties: false },
);
