import { t } from "elysia";

import { _Nullable } from "./__nullable__";

export const DelegationPlain = t.Object(
  {
    id: t.String({ description: ``, additionalProperties: false }),
    conferenceId: t.String({ description: ``, additionalProperties: false }),
    nationId: t.String({ description: ``, additionalProperties: false }),
  },
  { description: ``, additionalProperties: false },
);

export const DelegationRelations = t.Object(
  {
    conference: t.Object(
      {
        id: t.String({ description: ``, additionalProperties: false }),
        name: t.String({ description: ``, additionalProperties: false }),
        start: _Nullable(
          t.Date({ description: ``, additionalProperties: false }),
        ),
        end: _Nullable(
          t.Date({ description: ``, additionalProperties: false }),
        ),
        pressWebsite: _Nullable(
          t.String({ description: ``, additionalProperties: false }),
        ),
        feedbackWebsite: _Nullable(
          t.String({ description: ``, additionalProperties: false }),
        ),
      },
      {
        description: `A conference in the system`,
        additionalProperties: false,
      },
    ),
    nation: t.Object(
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
    ),
    members: t.Array(
      t.Object(
        {
          id: t.String({ description: ``, additionalProperties: false }),
          committeeId: t.String({
            description: ``,
            additionalProperties: false,
          }),
          userId: _Nullable(
            t.String({ description: ``, additionalProperties: false }),
          ),
          delegationId: _Nullable(
            t.String({ description: ``, additionalProperties: false }),
          ),
          presence: t.Union(
            [t.Literal("PRESENT"), t.Literal("EXCUSED"), t.Literal("ABSENT")],
            {
              description: `The presence status of a CommitteeMember`,
              additionalProperties: false,
            },
          ),
        },
        {
          description: `A user's membership in a committee, providing them with a role in the committee`,
          additionalProperties: false,
        },
      ),
    ),
  },
  { description: ``, additionalProperties: false },
);

export const Delegation = t.Composite([DelegationPlain, DelegationRelations], {
  description: `Composition of DelegationPlain, DelegationRelations`,
  additionalProperties: false,
});

export const DelegationWhere = t.Union([
  t.Composite([
    t.Pick(
      t.Required(
        t.Composite([
          t.Object({
            conferenceId_nationId: t.Object(
              {
                conferenceId: t.String({
                  description: ``,
                  additionalProperties: false,
                }),
                nationId: t.String({
                  description: ``,
                  additionalProperties: false,
                }),
              },
              { description: ``, additionalProperties: false },
            ),
          }),
          t.Pick(DelegationPlain, ["id"]),
        ]),
      ),
      ["id"],
    ),
    t.Omit(
      t.Partial(
        t.Composite([
          t.Object({
            conferenceId_nationId: t.Object(
              {
                conferenceId: t.String({
                  description: ``,
                  additionalProperties: false,
                }),
                nationId: t.String({
                  description: ``,
                  additionalProperties: false,
                }),
              },
              { description: ``, additionalProperties: false },
            ),
          }),
          t.Pick(DelegationPlain, ["id"]),
        ]),
      ),
      ["id"],
    ),
  ]),
  t.Composite([
    t.Pick(
      t.Required(
        t.Composite([
          t.Object({
            conferenceId_nationId: t.Object(
              {
                conferenceId: t.String({
                  description: ``,
                  additionalProperties: false,
                }),
                nationId: t.String({
                  description: ``,
                  additionalProperties: false,
                }),
              },
              { description: ``, additionalProperties: false },
            ),
          }),
          t.Pick(DelegationPlain, ["id"]),
        ]),
      ),
      ["conferenceId_nationId"],
    ),
    t.Omit(
      t.Partial(
        t.Composite([
          t.Object({
            conferenceId_nationId: t.Object(
              {
                conferenceId: t.String({
                  description: ``,
                  additionalProperties: false,
                }),
                nationId: t.String({
                  description: ``,
                  additionalProperties: false,
                }),
              },
              { description: ``, additionalProperties: false },
            ),
          }),
          t.Pick(DelegationPlain, ["id"]),
        ]),
      ),
      ["conferenceId_nationId"],
    ),
  ]),
]);

export const DelegationDataPlain = t.Object(
  {},
  { description: ``, additionalProperties: false },
);

export const DelegationDataRelations = t.Object(
  {
    conferenceId: t.String({ description: ``, additionalProperties: false }),
    nationId: t.String({ description: ``, additionalProperties: false }),
  },
  { description: ``, additionalProperties: false },
);

export const DelegationData = t.Composite(
  [DelegationDataPlain, DelegationDataRelations],
  {
    description: `Composition of DelegationDataPlain, DelegationDataRelations`,
    additionalProperties: false,
  },
);

export const DelegationDataPlainOptional = t.Object(
  {},
  { description: ``, additionalProperties: false },
);

export const DelegationDataRelationsOptional = t.Object(
  {
    conferenceId: t.Optional(
      t.String({ description: ``, additionalProperties: false }),
    ),
    nationId: t.Optional(
      t.String({ description: ``, additionalProperties: false }),
    ),
  },
  { description: ``, additionalProperties: false },
);

export const DelegationDataOptional = t.Composite(
  [DelegationDataPlainOptional, DelegationDataRelationsOptional],
  {
    description: `Composition of DelegationDataPlainOptional, DelegationDataRelationsOptional`,
    additionalProperties: false,
  },
);
