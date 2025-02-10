import { t } from "elysia";

import { _Nullable } from "./__nullable__";

export const NationPlain = t.Object(
  {
    id: t.String({ description: ``, additionalProperties: false }),
    alpha3Code: t.String({ description: ``, additionalProperties: false }),
    variant: t.Union(
      [
        t.Literal("NATION"),
        t.Literal("NON_STATE_ACTOR"),
        t.Literal("SPECIAL_PERSON"),
      ],
      { description: ``, additionalProperties: false },
    ),
  },
  {
    description: `A nation in the system. E.g. Germany`,
    additionalProperties: false,
  },
);

export const NationRelations = t.Object(
  {
    delegations: t.Array(
      t.Object(
        {
          id: t.String({ description: ``, additionalProperties: false }),
          conferenceId: t.String({
            description: ``,
            additionalProperties: false,
          }),
          nationId: t.String({ description: ``, additionalProperties: false }),
        },
        { description: ``, additionalProperties: false },
      ),
    ),
  },
  {
    description: `A nation in the system. E.g. Germany`,
    additionalProperties: false,
  },
);

export const Nation = t.Composite([NationPlain, NationRelations], {
  description: `Composition of NationPlain, NationRelations`,
  additionalProperties: false,
});

export const NationWhere = t.Union([
  t.Composite([
    t.Pick(
      t.Required(
        t.Composite([t.Object({}), t.Pick(NationPlain, ["id", "alpha3Code"])]),
      ),
      ["id"],
    ),
    t.Omit(
      t.Partial(
        t.Composite([t.Object({}), t.Pick(NationPlain, ["id", "alpha3Code"])]),
      ),
      ["id"],
    ),
  ]),
  t.Composite([
    t.Pick(
      t.Required(
        t.Composite([t.Object({}), t.Pick(NationPlain, ["id", "alpha3Code"])]),
      ),
      ["alpha3Code"],
    ),
    t.Omit(
      t.Partial(
        t.Composite([t.Object({}), t.Pick(NationPlain, ["id", "alpha3Code"])]),
      ),
      ["alpha3Code"],
    ),
  ]),
]);

export const NationDataPlain = t.Object(
  {
    alpha3Code: t.String({ description: ``, additionalProperties: false }),
    variant: t.Union(
      [
        t.Literal("NATION"),
        t.Literal("NON_STATE_ACTOR"),
        t.Literal("SPECIAL_PERSON"),
      ],
      { description: ``, additionalProperties: false },
    ),
  },
  {
    description: `A nation in the system. E.g. Germany`,
    additionalProperties: false,
  },
);

export const NationDataRelations = t.Object(
  {},
  {
    description: `A nation in the system. E.g. Germany`,
    additionalProperties: false,
  },
);

export const NationData = t.Composite([NationDataPlain, NationDataRelations], {
  description: `Composition of NationDataPlain, NationDataRelations`,
  additionalProperties: false,
});

export const NationDataPlainOptional = t.Object(
  {
    alpha3Code: t.Optional(
      t.String({ description: ``, additionalProperties: false }),
    ),
    variant: t.Optional(
      t.Union(
        [
          t.Literal("NATION"),
          t.Literal("NON_STATE_ACTOR"),
          t.Literal("SPECIAL_PERSON"),
        ],
        { description: ``, additionalProperties: false },
      ),
    ),
  },
  {
    description: `A nation in the system. E.g. Germany`,
    additionalProperties: false,
  },
);

export const NationDataRelationsOptional = t.Object(
  {},
  {
    description: `A nation in the system. E.g. Germany`,
    additionalProperties: false,
  },
);

export const NationDataOptional = t.Composite(
  [NationDataPlainOptional, NationDataRelationsOptional],
  {
    description: `Composition of NationDataPlainOptional, NationDataRelationsOptional`,
    additionalProperties: false,
  },
);
