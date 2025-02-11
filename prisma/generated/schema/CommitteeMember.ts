import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const CommitteeMemberPlain = t.Object(
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
);

export const CommitteeMemberRelations = t.Object(
  {
    committee: t.Object(
      {
        id: t.String({ additionalProperties: false }),
        name: t.String({ additionalProperties: false }),
        abbreviation: t.String({ additionalProperties: false }),
        category: t.Union(
          [t.Literal("COMMITTEE"), t.Literal("CRISIS"), t.Literal("ICJ")],
          {
            additionalProperties: false,
            description: `The type of a committee in a conference`,
          },
        ),
        conferenceId: t.String({ additionalProperties: false }),
        parentId: __nullable__(t.String({ additionalProperties: false })),
        whiteboardContent: t.String({ additionalProperties: false }),
        status: t.Union(
          [
            t.Literal("FORMAL"),
            t.Literal("INFORMAL"),
            t.Literal("PAUSE"),
            t.Literal("SUSPENSION"),
            t.Literal("CLOSED"),
          ],
          { additionalProperties: false },
        ),
        stateOfDebate: __nullable__(t.String({ additionalProperties: false })),
        statusHeadline: __nullable__(t.String({ additionalProperties: false })),
        statusUntil: __nullable__(t.Date({ additionalProperties: false })),
        allowDelegationsToAddThemselvesToSpeakersList: t.Boolean({
          additionalProperties: false,
        }),
      },
      {
        additionalProperties: false,
        description: `A committee in a conference`,
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
    speakerLists: t.Array(
      t.Object(
        {
          id: t.String({ additionalProperties: false }),
          speakersListId: t.String({ additionalProperties: false }),
          committeeMemberId: t.String({ additionalProperties: false }),
          position: t.Integer({ additionalProperties: false }),
        },
        {
          additionalProperties: false,
          description: `A speaker on a speakers list, storing their position in the list`,
        },
      ),
    ),
    delegation: __nullable__(
      t.Object(
        {
          id: t.String({ additionalProperties: false }),
          conferenceId: t.String({ additionalProperties: false }),
          nationId: t.String({ additionalProperties: false }),
        },
        { additionalProperties: false },
      ),
    ),
  },
  {
    additionalProperties: false,
    description: `A user's membership in a committee, providing them with a role in the committee`,
  },
);

export const CommitteeMemberPlainInputCreate = t.Object(
  {
    presence: t.Optional(
      t.Union(
        [t.Literal("PRESENT"), t.Literal("EXCUSED"), t.Literal("ABSENT")],
        {
          additionalProperties: false,
          description: `The presence status of a CommitteeMember`,
        },
      ),
    ),
  },
  {
    additionalProperties: false,
    description: `A user's membership in a committee, providing them with a role in the committee`,
  },
);

export const CommitteeMemberPlainInputUpdate = t.Object(
  {
    presence: t.Optional(
      t.Union(
        [t.Literal("PRESENT"), t.Literal("EXCUSED"), t.Literal("ABSENT")],
        {
          additionalProperties: false,
          description: `The presence status of a CommitteeMember`,
        },
      ),
    ),
  },
  {
    additionalProperties: false,
    description: `A user's membership in a committee, providing them with a role in the committee`,
  },
);

export const CommitteeMemberRelationsInputCreate = t.Object(
  {
    committee: t.Object(
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
    speakerLists: t.Optional(
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
    delegation: t.Optional(
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
    description: `A user's membership in a committee, providing them with a role in the committee`,
  },
);

export const CommitteeMemberRelationsInputUpdate = t.Partial(
  t.Object(
    {
      committee: t.Object(
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
      speakerLists: t.Partial(
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
      delegation: t.Partial(
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
      description: `A user's membership in a committee, providing them with a role in the committee`,
    },
  ),
  { additionalProperties: false },
);

export const CommitteeMemberWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self)]),
          NOT: t.Union([Self, t.Array(Self)]),
          OR: t.Array(Self),
          id: t.String(),
          committeeId: t.String(),
          userId: t.String(),
          delegationId: t.String(),
          presence: t.Union(
            [t.Literal("PRESENT"), t.Literal("EXCUSED"), t.Literal("ABSENT")],
            {
              additionalProperties: false,
              description: `The presence status of a CommitteeMember`,
            },
          ),
        },
        {
          description: `A user's membership in a committee, providing them with a role in the committee`,
        },
      ),
    { $id: "CommitteeMember" },
  ),
  { additionalProperties: false },
);

export const CommitteeMemberWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect([
      t.Partial(
        t.Object(
          {
            id: t.String(),
            committeeId_delegationId: t.Object({
              committeeId: t.String(),
              delegationId: t.String(),
            }),
            committeeId_userId: t.Object({
              committeeId: t.String(),
              userId: t.String(),
            }),
          },
          {
            description: `A user's membership in a committee, providing them with a role in the committee`,
          },
        ),
      ),
      t.Union([
        t.Object({ id: t.String() }),
        t.Object({
          committeeId_delegationId: t.Object({
            committeeId: t.String(),
            delegationId: t.String(),
          }),
        }),
        t.Object({
          committeeId_userId: t.Object({
            committeeId: t.String(),
            userId: t.String(),
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
            committeeId: t.String(),
            userId: t.String(),
            delegationId: t.String(),
            presence: t.Union(
              [t.Literal("PRESENT"), t.Literal("EXCUSED"), t.Literal("ABSENT")],
              {
                additionalProperties: false,
                description: `The presence status of a CommitteeMember`,
              },
            ),
          },
          { additionalProperties: false },
        ),
        { additionalProperties: false },
      ),
    ]),
  { $id: "CommitteeMember" },
);

export const CommitteeMemberSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      committee: t.Boolean(),
      committeeId: t.Boolean(),
      user: t.Boolean(),
      userId: t.Boolean(),
      speakerLists: t.Boolean(),
      delegation: t.Boolean(),
      delegationId: t.Boolean(),
      presence: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `A user's membership in a committee, providing them with a role in the committee`,
    },
  ),
  { additionalProperties: false },
);

export const CommitteeMemberInclude = t.Partial(
  t.Object(
    {
      committee: t.Boolean(),
      user: t.Boolean(),
      speakerLists: t.Boolean(),
      delegation: t.Boolean(),
      presence: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `A user's membership in a committee, providing them with a role in the committee`,
    },
  ),
  { additionalProperties: false },
);

export const CommitteeMemberOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")]),
      committeeId: t.Union([t.Literal("asc"), t.Literal("desc")]),
      userId: t.Union([t.Literal("asc"), t.Literal("desc")]),
      delegationId: t.Union([t.Literal("asc"), t.Literal("desc")]),
    },
    {
      additionalProperties: false,
      description: `A user's membership in a committee, providing them with a role in the committee`,
    },
  ),
  { additionalProperties: false },
);

export const CommitteeMember = t.Composite(
  [CommitteeMemberPlain, CommitteeMemberRelations],
  { additionalProperties: false },
);

export const CommitteeMemberInputCreate = t.Composite(
  [CommitteeMemberPlainInputCreate, CommitteeMemberRelationsInputCreate],
  { additionalProperties: false },
);

export const CommitteeMemberInputUpdate = t.Composite(
  [CommitteeMemberPlainInputUpdate, CommitteeMemberRelationsInputUpdate],
  { additionalProperties: false },
);
