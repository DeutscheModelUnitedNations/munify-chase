import { t } from "elysia";

import { _Nullable } from "./__nullable__";

export const PasswordPlain = t.Object(
  {
    id: t.String({ description: ``, additionalProperties: false }),
    userId: t.String({ description: ``, additionalProperties: false }),
  },
  { description: ``, additionalProperties: false },
);

export const PasswordRelations = t.Object(
  {
    user: t.Object(
      {
        id: t.String({ description: ``, additionalProperties: false }),
        name: t.String({ description: ``, additionalProperties: false }),
      },
      { description: `A user in the system`, additionalProperties: false },
    ),
  },
  { description: ``, additionalProperties: false },
);

export const Password = t.Composite([PasswordPlain, PasswordRelations], {
  description: `Composition of PasswordPlain, PasswordRelations`,
  additionalProperties: false,
});

export const PasswordWhere = t.Union([
  t.Composite([
    t.Pick(
      t.Required(t.Composite([t.Object({}), t.Pick(PasswordPlain, ["id"])])),
      ["id"],
    ),
    t.Omit(
      t.Partial(t.Composite([t.Object({}), t.Pick(PasswordPlain, ["id"])])),
      ["id"],
    ),
  ]),
]);

export const PasswordDataPlain = t.Object(
  {},
  { description: ``, additionalProperties: false },
);

export const PasswordDataRelations = t.Object(
  { userId: t.String({ description: ``, additionalProperties: false }) },
  { description: ``, additionalProperties: false },
);

export const PasswordData = t.Composite(
  [PasswordDataPlain, PasswordDataRelations],
  {
    description: `Composition of PasswordDataPlain, PasswordDataRelations`,
    additionalProperties: false,
  },
);

export const PasswordDataPlainOptional = t.Object(
  {},
  { description: ``, additionalProperties: false },
);

export const PasswordDataRelationsOptional = t.Object(
  {
    userId: t.Optional(
      t.String({ description: ``, additionalProperties: false }),
    ),
  },
  { description: ``, additionalProperties: false },
);

export const PasswordDataOptional = t.Composite(
  [PasswordDataPlainOptional, PasswordDataRelationsOptional],
  {
    description: `Composition of PasswordDataPlainOptional, PasswordDataRelationsOptional`,
    additionalProperties: false,
  },
);
