import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ConferenceMemberPlain = t.Object(
  {
    id: t.String({ additionalProperties: false }),
    conferenceId: t.String({ additionalProperties: false }),
    userId: __nullable__(t.String({ additionalProperties: false })),
    role: t.Union(
      [
        t.Literal("ADMIN"),
        t.Literal("SECRETARIAT"),
        t.Literal("CHAIR"),
        t.Literal("COMMITTEE_ADVISOR"),
        t.Literal("NON_STATE_ACTOR"),
        t.Literal("PRESS_CORPS"),
        t.Literal("GUEST"),
        t.Literal("PARTICIPANT_CARE"),
        t.Literal("MISCELLANEOUS_TEAM"),
      ],
      {
        additionalProperties: false,
        description: `The role of a user in a conference`,
      },
    ),
  },
  {
    additionalProperties: false,
    description: `A user's membership in a conference, providing them with a role in the conference`,
  },
);

export const ConferenceMemberRelations = t.Object(
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
    user: __nullable__(
      t.Object(
        {
          id: t.String({ additionalProperties: false }),
          name: t.String({ additionalProperties: false }),
        },
        { additionalProperties: false, description: `A user in the system` },
      ),
    ),
  },
  {
    additionalProperties: false,
    description: `A user's membership in a conference, providing them with a role in the conference`,
  },
);

export const ConferenceMemberPlainInputCreate = t.Object(
  {
    role: t.Union(
      [
        t.Literal("ADMIN"),
        t.Literal("SECRETARIAT"),
        t.Literal("CHAIR"),
        t.Literal("COMMITTEE_ADVISOR"),
        t.Literal("NON_STATE_ACTOR"),
        t.Literal("PRESS_CORPS"),
        t.Literal("GUEST"),
        t.Literal("PARTICIPANT_CARE"),
        t.Literal("MISCELLANEOUS_TEAM"),
      ],
      {
        additionalProperties: false,
        description: `The role of a user in a conference`,
      },
    ),
  },
  {
    additionalProperties: false,
    description: `A user's membership in a conference, providing them with a role in the conference`,
  },
);

export const ConferenceMemberPlainInputUpdate = t.Object(
  {
    role: t.Optional(
      t.Union(
        [
          t.Literal("ADMIN"),
          t.Literal("SECRETARIAT"),
          t.Literal("CHAIR"),
          t.Literal("COMMITTEE_ADVISOR"),
          t.Literal("NON_STATE_ACTOR"),
          t.Literal("PRESS_CORPS"),
          t.Literal("GUEST"),
          t.Literal("PARTICIPANT_CARE"),
          t.Literal("MISCELLANEOUS_TEAM"),
        ],
        {
          additionalProperties: false,
          description: `The role of a user in a conference`,
        },
      ),
    ),
  },
  {
    additionalProperties: false,
    description: `A user's membership in a conference, providing them with a role in the conference`,
  },
);

export const ConferenceMemberRelationsInputCreate = t.Object(
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
    user: t.Optional(
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
  {
    additionalProperties: false,
    description: `A user's membership in a conference, providing them with a role in the conference`,
  },
);

export const ConferenceMemberRelationsInputUpdate = t.Partial(
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
      user: t.Partial(
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
    {
      additionalProperties: false,
      description: `A user's membership in a conference, providing them with a role in the conference`,
    },
  ),
  { additionalProperties: false },
);

export const ConferenceMemberWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self)]),
          NOT: t.Union([Self, t.Array(Self)]),
          OR: t.Array(Self),
          id: t.String(),
          conferenceId: t.String(),
          userId: t.String(),
          role: t.Union(
            [
              t.Literal("ADMIN"),
              t.Literal("SECRETARIAT"),
              t.Literal("CHAIR"),
              t.Literal("COMMITTEE_ADVISOR"),
              t.Literal("NON_STATE_ACTOR"),
              t.Literal("PRESS_CORPS"),
              t.Literal("GUEST"),
              t.Literal("PARTICIPANT_CARE"),
              t.Literal("MISCELLANEOUS_TEAM"),
            ],
            {
              additionalProperties: false,
              description: `The role of a user in a conference`,
            },
          ),
        },
        {
          description: `A user's membership in a conference, providing them with a role in the conference`,
        },
      ),
    { $id: "ConferenceMember" },
  ),
  { additionalProperties: false },
);

export const ConferenceMemberWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect([
      t.Partial(
        t.Object(
          {
            id: t.String(),
            userId_conferenceId: t.Object({
              userId: t.String(),
              conferenceId: t.String(),
            }),
          },
          {
            description: `A user's membership in a conference, providing them with a role in the conference`,
          },
        ),
      ),
      t.Union([
        t.Object({ id: t.String() }),
        t.Object({
          userId_conferenceId: t.Object({
            userId: t.String(),
            conferenceId: t.String(),
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
          {
            id: t.String(),
            conferenceId: t.String(),
            userId: t.String(),
            role: t.Union(
              [
                t.Literal("ADMIN"),
                t.Literal("SECRETARIAT"),
                t.Literal("CHAIR"),
                t.Literal("COMMITTEE_ADVISOR"),
                t.Literal("NON_STATE_ACTOR"),
                t.Literal("PRESS_CORPS"),
                t.Literal("GUEST"),
                t.Literal("PARTICIPANT_CARE"),
                t.Literal("MISCELLANEOUS_TEAM"),
              ],
              {
                additionalProperties: false,
                description: `The role of a user in a conference`,
              },
            ),
          },
          { additionalProperties: false },
        ),
        { additionalProperties: false },
      ),
    ]),
  { $id: "ConferenceMember" },
);

export const ConferenceMemberSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      conference: t.Boolean(),
      conferenceId: t.Boolean(),
      user: t.Boolean(),
      userId: t.Boolean(),
      role: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `A user's membership in a conference, providing them with a role in the conference`,
    },
  ),
  { additionalProperties: false },
);

export const ConferenceMemberInclude = t.Partial(
  t.Object(
    {
      conference: t.Boolean(),
      user: t.Boolean(),
      role: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `A user's membership in a conference, providing them with a role in the conference`,
    },
  ),
  { additionalProperties: false },
);

export const ConferenceMemberOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")]),
      conferenceId: t.Union([t.Literal("asc"), t.Literal("desc")]),
      userId: t.Union([t.Literal("asc"), t.Literal("desc")]),
    },
    {
      additionalProperties: false,
      description: `A user's membership in a conference, providing them with a role in the conference`,
    },
  ),
  { additionalProperties: false },
);

export const ConferenceMember = t.Composite(
  [ConferenceMemberPlain, ConferenceMemberRelations],
  { additionalProperties: false },
);

export const ConferenceMemberInputCreate = t.Composite(
  [ConferenceMemberPlainInputCreate, ConferenceMemberRelationsInputCreate],
  { additionalProperties: false },
);

export const ConferenceMemberInputUpdate = t.Composite(
  [ConferenceMemberPlainInputUpdate, ConferenceMemberRelationsInputUpdate],
  { additionalProperties: false },
);
