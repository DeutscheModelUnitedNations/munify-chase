import { t } from "elysia";

import { _Nullable } from "./__nullable__";

export const PendingCredentialCreateTaskPlain = t.Object(
  {
    id: t.String({ description: ``, additionalProperties: false }),
    userId: t.String({ description: ``, additionalProperties: false }),
    tokenId: t.String({ description: ``, additionalProperties: false }),
  },
  { description: ``, additionalProperties: false },
);

export const PendingCredentialCreateTaskRelations = t.Object(
  {
    user: t.Object(
      {
        id: t.String({ description: ``, additionalProperties: false }),
        name: t.String({ description: ``, additionalProperties: false }),
      },
      { description: `A user in the system`, additionalProperties: false },
    ),
    token: t.Object(
      {
        id: t.String({ description: ``, additionalProperties: false }),
        expiresAt: t.Date({ description: ``, additionalProperties: false }),
      },
      {
        description: `A token which can be used to grant one time access to something in the app
e.g. confirming an email, resetting a password`,
        additionalProperties: false,
      },
    ),
  },
  { description: ``, additionalProperties: false },
);

export const PendingCredentialCreateTask = t.Composite(
  [PendingCredentialCreateTaskPlain, PendingCredentialCreateTaskRelations],
  {
    description: `Composition of PendingCredentialCreateTaskPlain, PendingCredentialCreateTaskRelations`,
    additionalProperties: false,
  },
);

export const PendingCredentialCreateTaskWhere = t.Union([
  t.Composite([
    t.Pick(
      t.Required(
        t.Composite([
          t.Object({}),
          t.Pick(PendingCredentialCreateTaskPlain, ["id"]),
        ]),
      ),
      ["id"],
    ),
    t.Omit(
      t.Partial(
        t.Composite([
          t.Object({}),
          t.Pick(PendingCredentialCreateTaskPlain, ["id"]),
        ]),
      ),
      ["id"],
    ),
  ]),
]);

export const PendingCredentialCreateTaskDataPlain = t.Object(
  {},
  { description: ``, additionalProperties: false },
);

export const PendingCredentialCreateTaskDataRelations = t.Object(
  {
    userId: t.String({ description: ``, additionalProperties: false }),
    tokenId: t.String({ description: ``, additionalProperties: false }),
  },
  { description: ``, additionalProperties: false },
);

export const PendingCredentialCreateTaskData = t.Composite(
  [
    PendingCredentialCreateTaskDataPlain,
    PendingCredentialCreateTaskDataRelations,
  ],
  {
    description: `Composition of PendingCredentialCreateTaskDataPlain, PendingCredentialCreateTaskDataRelations`,
    additionalProperties: false,
  },
);

export const PendingCredentialCreateTaskDataPlainOptional = t.Object(
  {},
  { description: ``, additionalProperties: false },
);

export const PendingCredentialCreateTaskDataRelationsOptional = t.Object(
  {
    userId: t.Optional(
      t.String({ description: ``, additionalProperties: false }),
    ),
    tokenId: t.Optional(
      t.String({ description: ``, additionalProperties: false }),
    ),
  },
  { description: ``, additionalProperties: false },
);

export const PendingCredentialCreateTaskDataOptional = t.Composite(
  [
    PendingCredentialCreateTaskDataPlainOptional,
    PendingCredentialCreateTaskDataRelationsOptional,
  ],
  {
    description: `Composition of PendingCredentialCreateTaskDataPlainOptional, PendingCredentialCreateTaskDataRelationsOptional`,
    additionalProperties: false,
  },
);
