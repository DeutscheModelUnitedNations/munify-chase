import { t } from "elysia";

import { _Nullable } from "./__nullable__";

export const TokenPlain = t.Object(
  {
    id: t.String({ description: ``, additionalProperties: false }),
    expiresAt: t.Date({ description: ``, additionalProperties: false }),
  },
  {
    description: `A token which can be used to grant one time access to something in the app
e.g. confirming an email, resetting a password`,
    additionalProperties: false,
  },
);

export const TokenRelations = t.Object(
  {
    pendingEmailConfirmations: t.Array(
      t.Object(
        {
          email: t.String({ description: ``, additionalProperties: false }),
          userId: t.String({ description: ``, additionalProperties: false }),
          validated: t.Boolean({
            description: ``,
            additionalProperties: false,
          }),
          validationTokenId: _Nullable(
            t.String({ description: ``, additionalProperties: false }),
          ),
        },
        { description: ``, additionalProperties: false },
      ),
    ),
    pendingCredentialCreations: t.Array(
      t.Object(
        {
          id: t.String({ description: ``, additionalProperties: false }),
          userId: t.String({ description: ``, additionalProperties: false }),
          tokenId: t.String({ description: ``, additionalProperties: false }),
        },
        { description: ``, additionalProperties: false },
      ),
    ),
  },
  {
    description: `A token which can be used to grant one time access to something in the app
e.g. confirming an email, resetting a password`,
    additionalProperties: false,
  },
);

export const Token = t.Composite([TokenPlain, TokenRelations], {
  description: `Composition of TokenPlain, TokenRelations`,
  additionalProperties: false,
});

export const TokenWhere = t.Union([
  t.Composite([
    t.Pick(
      t.Required(t.Composite([t.Object({}), t.Pick(TokenPlain, ["id"])])),
      ["id"],
    ),
    t.Omit(t.Partial(t.Composite([t.Object({}), t.Pick(TokenPlain, ["id"])])), [
      "id",
    ]),
  ]),
]);

export const TokenDataPlain = t.Object(
  { expiresAt: t.Date({ description: ``, additionalProperties: false }) },
  {
    description: `A token which can be used to grant one time access to something in the app
e.g. confirming an email, resetting a password`,
    additionalProperties: false,
  },
);

export const TokenDataRelations = t.Object(
  {},
  {
    description: `A token which can be used to grant one time access to something in the app
e.g. confirming an email, resetting a password`,
    additionalProperties: false,
  },
);

export const TokenData = t.Composite([TokenDataPlain, TokenDataRelations], {
  description: `Composition of TokenDataPlain, TokenDataRelations`,
  additionalProperties: false,
});

export const TokenDataPlainOptional = t.Object(
  {
    expiresAt: t.Optional(
      t.Date({ description: ``, additionalProperties: false }),
    ),
  },
  {
    description: `A token which can be used to grant one time access to something in the app
e.g. confirming an email, resetting a password`,
    additionalProperties: false,
  },
);

export const TokenDataRelationsOptional = t.Object(
  {},
  {
    description: `A token which can be used to grant one time access to something in the app
e.g. confirming an email, resetting a password`,
    additionalProperties: false,
  },
);

export const TokenDataOptional = t.Composite(
  [TokenDataPlainOptional, TokenDataRelationsOptional],
  {
    description: `Composition of TokenDataPlainOptional, TokenDataRelationsOptional`,
    additionalProperties: false,
  },
);
