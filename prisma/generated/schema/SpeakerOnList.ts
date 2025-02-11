import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const SpeakerOnListPlain = t.Object(
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
);

export const SpeakerOnListRelations = t.Object(
  {
    speakersList: t.Object(
      {
        id: t.String({ additionalProperties: false }),
        agendaItemId: t.String({ additionalProperties: false }),
        type: t.Union(
          [
            t.Literal("SPEAKERS_LIST"),
            t.Literal("COMMENT_LIST"),
            t.Literal("MODERATED_CAUCUS"),
          ],
          {
            additionalProperties: false,
            description: `The type of a speakers list`,
          },
        ),
        speakingTime: t.Integer({
          additionalProperties: false,
          description: `The time in seconds that a speaker has to speak`,
        }),
        timeLeft: __nullable__(t.Integer({ additionalProperties: false })),
        startTimestamp: __nullable__(t.Date({ additionalProperties: false })),
        isClosed: t.Boolean({ additionalProperties: false }),
      },
      {
        additionalProperties: false,
        description: `A speakers list in a committee`,
      },
    ),
    committeeMember: t.Object(
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
  },
  {
    additionalProperties: false,
    description: `A speaker on a speakers list, storing their position in the list`,
  },
);

export const SpeakerOnListPlainInputCreate = t.Object(
  { position: t.Integer({ additionalProperties: false }) },
  {
    additionalProperties: false,
    description: `A speaker on a speakers list, storing their position in the list`,
  },
);

export const SpeakerOnListPlainInputUpdate = t.Object(
  { position: t.Integer({ additionalProperties: false }) },
  {
    additionalProperties: false,
    description: `A speaker on a speakers list, storing their position in the list`,
  },
);

export const SpeakerOnListRelationsInputCreate = t.Object(
  {
    speakersList: t.Object(
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
    committeeMember: t.Object(
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
  {
    additionalProperties: false,
    description: `A speaker on a speakers list, storing their position in the list`,
  },
);

export const SpeakerOnListRelationsInputUpdate = t.Partial(
  t.Object(
    {
      speakersList: t.Object(
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
      committeeMember: t.Object(
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
    {
      additionalProperties: false,
      description: `A speaker on a speakers list, storing their position in the list`,
    },
  ),
  { additionalProperties: false },
);

export const SpeakerOnListWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self)]),
          NOT: t.Union([Self, t.Array(Self)]),
          OR: t.Array(Self),
          id: t.String(),
          speakersListId: t.String(),
          committeeMemberId: t.String(),
          position: t.Integer(),
        },
        {
          description: `A speaker on a speakers list, storing their position in the list`,
        },
      ),
    { $id: "SpeakerOnList" },
  ),
  { additionalProperties: false },
);

export const SpeakerOnListWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect([
      t.Partial(
        t.Object(
          {
            id: t.String(),
            speakersListId_position: t.Object({
              speakersListId: t.String(),
              position: t.Integer(),
            }),
            speakersListId_committeeMemberId: t.Object({
              speakersListId: t.String(),
              committeeMemberId: t.String(),
            }),
          },
          {
            description: `A speaker on a speakers list, storing their position in the list`,
          },
        ),
      ),
      t.Union([
        t.Object({ id: t.String() }),
        t.Object({
          speakersListId_position: t.Object({
            speakersListId: t.String(),
            position: t.Integer(),
          }),
        }),
        t.Object({
          speakersListId_committeeMemberId: t.Object({
            speakersListId: t.String(),
            committeeMemberId: t.String(),
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
            speakersListId: t.String(),
            committeeMemberId: t.String(),
            position: t.Integer(),
          },
          { additionalProperties: false },
        ),
        { additionalProperties: false },
      ),
    ]),
  { $id: "SpeakerOnList" },
);

export const SpeakerOnListSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      speakersList: t.Boolean(),
      speakersListId: t.Boolean(),
      committeeMember: t.Boolean(),
      committeeMemberId: t.Boolean(),
      position: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `A speaker on a speakers list, storing their position in the list`,
    },
  ),
  { additionalProperties: false },
);

export const SpeakerOnListInclude = t.Partial(
  t.Object(
    {
      speakersList: t.Boolean(),
      committeeMember: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `A speaker on a speakers list, storing their position in the list`,
    },
  ),
  { additionalProperties: false },
);

export const SpeakerOnListOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")]),
      speakersListId: t.Union([t.Literal("asc"), t.Literal("desc")]),
      committeeMemberId: t.Union([t.Literal("asc"), t.Literal("desc")]),
      position: t.Union([t.Literal("asc"), t.Literal("desc")]),
    },
    {
      additionalProperties: false,
      description: `A speaker on a speakers list, storing their position in the list`,
    },
  ),
  { additionalProperties: false },
);

export const SpeakerOnList = t.Composite(
  [SpeakerOnListPlain, SpeakerOnListRelations],
  { additionalProperties: false },
);

export const SpeakerOnListInputCreate = t.Composite(
  [SpeakerOnListPlainInputCreate, SpeakerOnListRelationsInputCreate],
  { additionalProperties: false },
);

export const SpeakerOnListInputUpdate = t.Composite(
  [SpeakerOnListPlainInputUpdate, SpeakerOnListRelationsInputUpdate],
  { additionalProperties: false },
);
