import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const DelegationPlain = t.Object(
  {
    id: t.String({ additionalProperties: false }),
    conferenceId: t.String({ additionalProperties: false }),
    nationId: t.String({ additionalProperties: false }),
  },
  { additionalProperties: false },
);

export const DelegationRelations = t.Object(
  {
    conference: t.Object(
      {
        id: t.String({ additionalProperties: false }),
        name: t.String({ additionalProperties: false }),
        start: __nullable__(t.Date({ additionalProperties: false })),
        end: __nullable__(t.Date({ additionalProperties: false })),
        pressWebsite: __nullable__(t.String({ additionalProperties: false })),
        feedbackWebsite: __nullable__(
          t.String({ additionalProperties: false }),
        ),
      },
      {
        additionalProperties: false,
        description: `A conference in the system`,
      },
    ),
    nation: t.Object(
      {
        id: t.String({ additionalProperties: false }),
        alpha3Code: t.String({ additionalProperties: false }),
        variant: t.Union(
          [
            t.Literal("NATION"),
            t.Literal("NON_STATE_ACTOR"),
            t.Literal("SPECIAL_PERSON"),
          ],
          { additionalProperties: false },
        ),
      },
      {
        additionalProperties: false,
        description: `A nation in the system. E.g. Germany`,
      },
    ),
    members: t.Array(
      t.Object(
        {
          id: t.String({ additionalProperties: false }),
          committeeId: t.String({ additionalProperties: false }),
          userId: __nullable__(t.String({ additionalProperties: false })),
          delegationId: __nullable__(t.String({ additionalProperties: false })),
          presence: t.Union(
            [t.Literal("PRESENT"), t.Literal("EXCUSED"), t.Literal("ABSENT")],
            {
              additionalProperties: false,
              description: `The presence status of a CommitteeMember`,
            },
          ),
        },
        {
          additionalProperties: false,
          description: `A user's membership in a committee, providing them with a role in the committee`,
        },
      ),
    ),
  },
  { additionalProperties: false },
);

export const DelegationPlainInputCreate = t.Object(
  {},
  { additionalProperties: false },
);

export const DelegationPlainInputUpdate = t.Object(
  {},
  { additionalProperties: false },
);

export const DelegationRelationsInputCreate = t.Object(
  {
    conference: t.Object(
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
    nation: t.Object(
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
    members: t.Optional(
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
  { additionalProperties: false },
);

export const DelegationRelationsInputUpdate = t.Partial(
  t.Object(
    {
      conference: t.Object(
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
      nation: t.Object(
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
      members: t.Partial(
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
    { additionalProperties: false },
  ),
  { additionalProperties: false },
);

export const DelegationWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object({
        AND: t.Union([Self, t.Array(Self)]),
        NOT: t.Union([Self, t.Array(Self)]),
        OR: t.Array(Self),
        id: t.String(),
        conferenceId: t.String(),
        nationId: t.String(),
      }),
    { $id: "Delegation" },
  ),
  { additionalProperties: false },
);

export const DelegationWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect([
      t.Partial(
        t.Object({
          id: t.String(),
          conferenceId_nationId: t.Object({
            conferenceId: t.String(),
            nationId: t.String(),
          }),
        }),
      ),
      t.Union([
        t.Object({ id: t.String() }),
        t.Object({
          conferenceId_nationId: t.Object({
            conferenceId: t.String(),
            nationId: t.String(),
          }),
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
          { id: t.String(), conferenceId: t.String(), nationId: t.String() },
          { additionalProperties: false },
        ),
        { additionalProperties: false },
      ),
    ]),
  { $id: "Delegation" },
);

export const DelegationSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      conference: t.Boolean(),
      conferenceId: t.Boolean(),
      nation: t.Boolean(),
      nationId: t.Boolean(),
      members: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
  { additionalProperties: false },
);

export const DelegationInclude = t.Partial(
  t.Object(
    {
      conference: t.Boolean(),
      nation: t.Boolean(),
      members: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
  { additionalProperties: false },
);

export const DelegationOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")]),
      conferenceId: t.Union([t.Literal("asc"), t.Literal("desc")]),
      nationId: t.Union([t.Literal("asc"), t.Literal("desc")]),
    },
    { additionalProperties: false },
  ),
  { additionalProperties: false },
);

export const Delegation = t.Composite([DelegationPlain, DelegationRelations], {
  additionalProperties: false,
});

export const DelegationInputCreate = t.Composite(
  [DelegationPlainInputCreate, DelegationRelationsInputCreate],
  { additionalProperties: false },
);

export const DelegationInputUpdate = t.Composite(
  [DelegationPlainInputUpdate, DelegationRelationsInputUpdate],
  { additionalProperties: false },
);
