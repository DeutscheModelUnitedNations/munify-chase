import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const SpeakersListPlain = t.Object(
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
);

export const SpeakersListRelations = t.Object(
  {
    agendaItem: t.Object(
      {
        id: t.String({ additionalProperties: false }),
        committeeId: t.String({ additionalProperties: false }),
        title: t.String({ additionalProperties: false }),
        description: __nullable__(t.String({ additionalProperties: false })),
        isActive: t.Boolean({ additionalProperties: false }),
      },
      {
        additionalProperties: false,
        description: `An agenda item in a committee. This is a topic of discussion in a committee.`,
      },
    ),
    speakers: t.Array(
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
  },
  {
    additionalProperties: false,
    description: `A speakers list in a committee`,
  },
);

export const SpeakersListPlainInputCreate = t.Object(
  {
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
    timeLeft: t.Optional(
      __nullable__(t.Integer({ additionalProperties: false })),
    ),
    startTimestamp: t.Optional(
      __nullable__(t.Date({ additionalProperties: false })),
    ),
    isClosed: t.Optional(t.Boolean({ additionalProperties: false })),
  },
  {
    additionalProperties: false,
    description: `A speakers list in a committee`,
  },
);

export const SpeakersListPlainInputUpdate = t.Object(
  {
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
    isClosed: t.Optional(t.Boolean({ additionalProperties: false })),
  },
  {
    additionalProperties: false,
    description: `A speakers list in a committee`,
  },
);

export const SpeakersListRelationsInputCreate = t.Object(
  {
    agendaItem: t.Object(
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
    speakers: t.Optional(
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
  {
    additionalProperties: false,
    description: `A speakers list in a committee`,
  },
);

export const SpeakersListRelationsInputUpdate = t.Partial(
  t.Object(
    {
      agendaItem: t.Object(
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
      speakers: t.Partial(
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
    {
      additionalProperties: false,
      description: `A speakers list in a committee`,
    },
  ),
  { additionalProperties: false },
);

export const SpeakersListWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self)]),
          NOT: t.Union([Self, t.Array(Self)]),
          OR: t.Array(Self),
          id: t.String(),
          agendaItemId: t.String(),
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
            description: `The time in seconds that a speaker has to speak`,
          }),
          timeLeft: t.Integer(),
          startTimestamp: t.Date(),
          isClosed: t.Boolean(),
        },
        { description: `A speakers list in a committee` },
      ),
    { $id: "SpeakersList" },
  ),
  { additionalProperties: false },
);

export const SpeakersListWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect([
      t.Partial(
        t.Object(
          {
            id: t.String(),
            agendaItemId_type: t.Object({
              agendaItemId: t.String(),
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
            }),
          },
          { description: `A speakers list in a committee` },
        ),
      ),
      t.Union([
        t.Object({ id: t.String() }),
        t.Object({
          agendaItemId_type: t.Object({
            agendaItemId: t.String(),
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
            agendaItemId: t.String(),
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
              description: `The time in seconds that a speaker has to speak`,
            }),
            timeLeft: t.Integer(),
            startTimestamp: t.Date(),
            isClosed: t.Boolean(),
          },
          { additionalProperties: false },
        ),
        { additionalProperties: false },
      ),
    ]),
  { $id: "SpeakersList" },
);

export const SpeakersListSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      agendaItem: t.Boolean(),
      agendaItemId: t.Boolean(),
      type: t.Boolean(),
      speakers: t.Boolean(),
      speakingTime: t.Boolean(),
      timeLeft: t.Boolean(),
      startTimestamp: t.Boolean(),
      isClosed: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `A speakers list in a committee`,
    },
  ),
  { additionalProperties: false },
);

export const SpeakersListInclude = t.Partial(
  t.Object(
    {
      agendaItem: t.Boolean(),
      type: t.Boolean(),
      speakers: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `A speakers list in a committee`,
    },
  ),
  { additionalProperties: false },
);

export const SpeakersListOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")]),
      agendaItemId: t.Union([t.Literal("asc"), t.Literal("desc")]),
      speakingTime: t.Union([t.Literal("asc"), t.Literal("desc")]),
      timeLeft: t.Union([t.Literal("asc"), t.Literal("desc")]),
      startTimestamp: t.Union([t.Literal("asc"), t.Literal("desc")]),
      isClosed: t.Union([t.Literal("asc"), t.Literal("desc")]),
    },
    {
      additionalProperties: false,
      description: `A speakers list in a committee`,
    },
  ),
  { additionalProperties: false },
);

export const SpeakersList = t.Composite(
  [SpeakersListPlain, SpeakersListRelations],
  { additionalProperties: false },
);

export const SpeakersListInputCreate = t.Composite(
  [SpeakersListPlainInputCreate, SpeakersListRelationsInputCreate],
  { additionalProperties: false },
);

export const SpeakersListInputUpdate = t.Composite(
  [SpeakersListPlainInputUpdate, SpeakersListRelationsInputUpdate],
  { additionalProperties: false },
);
