import { t } from "elysia";

import { _Nullable } from "./__nullable__";

export const EmailPlain = t.Object(
  {
    email: t.String({ description: ``, additionalProperties: false }),
    userId: t.String({ description: ``, additionalProperties: false }),
    validated: t.Boolean({ description: ``, additionalProperties: false }),
    validationTokenId: _Nullable(
      t.String({ description: ``, additionalProperties: false }),
    ),
  },
  { description: ``, additionalProperties: false },
);

export const EmailRelations = t.Object(
  {
    user: t.Object(
      {
        id: t.String({ description: ``, additionalProperties: false }),
        name: t.String({ description: ``, additionalProperties: false }),
      },
      { description: `A user in the system`, additionalProperties: false },
    ),
    validationToken: _Nullable(
      t.Object(
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
    ),
  },
  { description: ``, additionalProperties: false },
);

export const Email = t.Composite([EmailPlain, EmailRelations], {
  description: `Composition of EmailPlain, EmailRelations`,
  additionalProperties: false,
});

export const EmailWhere = t.Union([
  t.Composite([
    t.Pick(
      t.Required(
        t.Composite([
          t.Object({
            userId_email: t.Object(
              {
                email: t.String({
                  description: ``,
                  additionalProperties: false,
                }),
                userId: t.String({
                  description: ``,
                  additionalProperties: false,
                }),
              },
              { description: ``, additionalProperties: false },
            ),
          }),
          t.Pick(EmailPlain, ["email"]),
        ]),
      ),
      ["email"],
    ),
    t.Omit(
      t.Partial(
        t.Composite([
          t.Object({
            userId_email: t.Object(
              {
                email: t.String({
                  description: ``,
                  additionalProperties: false,
                }),
                userId: t.String({
                  description: ``,
                  additionalProperties: false,
                }),
              },
              { description: ``, additionalProperties: false },
            ),
          }),
          t.Pick(EmailPlain, ["email"]),
        ]),
      ),
      ["email"],
    ),
  ]),
  t.Composite([
    t.Pick(
      t.Required(
        t.Composite([
          t.Object({
            userId_email: t.Object(
              {
                email: t.String({
                  description: ``,
                  additionalProperties: false,
                }),
                userId: t.String({
                  description: ``,
                  additionalProperties: false,
                }),
              },
              { description: ``, additionalProperties: false },
            ),
          }),
          t.Pick(EmailPlain, ["email"]),
        ]),
      ),
      ["userId_email"],
    ),
    t.Omit(
      t.Partial(
        t.Composite([
          t.Object({
            userId_email: t.Object(
              {
                email: t.String({
                  description: ``,
                  additionalProperties: false,
                }),
                userId: t.String({
                  description: ``,
                  additionalProperties: false,
                }),
              },
              { description: ``, additionalProperties: false },
            ),
          }),
          t.Pick(EmailPlain, ["email"]),
        ]),
      ),
      ["userId_email"],
    ),
  ]),
]);

export const EmailDataPlain = t.Object(
  { validated: t.Boolean({ description: ``, additionalProperties: false }) },
  { description: ``, additionalProperties: false },
);

export const EmailDataRelations = t.Object(
  {
    userId: t.String({ description: ``, additionalProperties: false }),
    validationTokenId: t.Optional(
      _Nullable(t.String({ description: ``, additionalProperties: false })),
    ),
  },
  { description: ``, additionalProperties: false },
);

export const EmailData = t.Composite([EmailDataPlain, EmailDataRelations], {
  description: `Composition of EmailDataPlain, EmailDataRelations`,
  additionalProperties: false,
});

export const EmailDataPlainOptional = t.Object(
  {
    validated: t.Optional(
      t.Boolean({ description: ``, additionalProperties: false }),
    ),
  },
  { description: ``, additionalProperties: false },
);

export const EmailDataRelationsOptional = t.Object(
  {
    userId: t.Optional(
      t.String({ description: ``, additionalProperties: false }),
    ),
    validationTokenId: t.Optional(
      _Nullable(t.String({ description: ``, additionalProperties: false })),
    ),
  },
  { description: ``, additionalProperties: false },
);

export const EmailDataOptional = t.Composite(
  [EmailDataPlainOptional, EmailDataRelationsOptional],
  {
    description: `Composition of EmailDataPlainOptional, EmailDataRelationsOptional`,
    additionalProperties: false,
  },
);
