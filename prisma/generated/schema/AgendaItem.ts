import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const AgendaItemPlain = t.Object(
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
);

export const AgendaItemRelations = t.Object(
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
    speakerLists: t.Array(
      t.Object(
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
    ),
  },
  {
    additionalProperties: false,
    description: `An agenda item in a committee. This is a topic of discussion in a committee.`,
  },
);

export const AgendaItemPlainInputCreate = t.Object(
  {
    title: t.String({ additionalProperties: false }),
    description: t.Optional(
      __nullable__(t.String({ additionalProperties: false })),
    ),
    isActive: t.Optional(t.Boolean({ additionalProperties: false })),
  },
  {
    additionalProperties: false,
    description: `An agenda item in a committee. This is a topic of discussion in a committee.`,
  },
);

export const AgendaItemPlainInputUpdate = t.Object(
  {
    title: t.Optional(t.String({ additionalProperties: false })),
    description: t.Optional(
      __nullable__(t.String({ additionalProperties: false })),
    ),
    isActive: t.Optional(t.Boolean({ additionalProperties: false })),
  },
  {
    additionalProperties: false,
    description: `An agenda item in a committee. This is a topic of discussion in a committee.`,
  },
);

export const AgendaItemRelationsInputCreate = t.Object(
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
  },
  {
    additionalProperties: false,
    description: `An agenda item in a committee. This is a topic of discussion in a committee.`,
  },
);

export const AgendaItemRelationsInputUpdate = t.Partial(
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
    },
    {
      additionalProperties: false,
      description: `An agenda item in a committee. This is a topic of discussion in a committee.`,
    },
  ),
  { additionalProperties: false },
);

export const AgendaItemWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self)]),
          NOT: t.Union([Self, t.Array(Self)]),
          OR: t.Array(Self),
          id: t.String(),
          committeeId: t.String(),
          title: t.String(),
          description: t.String(),
          isActive: t.Boolean(),
        },
        {
          description: `An agenda item in a committee. This is a topic of discussion in a committee.`,
        },
      ),
    { $id: "AgendaItem" },
  ),
  { additionalProperties: false },
);

export const AgendaItemWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect([
      t.Partial(
        t.Object(
          { id: t.String() },
          {
            description: `An agenda item in a committee. This is a topic of discussion in a committee.`,
          },
        ),
      ),
      t.Union([t.Object({ id: t.String() })]),
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
            title: t.String(),
            description: t.String(),
            isActive: t.Boolean(),
          },
          { additionalProperties: false },
        ),
        { additionalProperties: false },
      ),
    ]),
  { $id: "AgendaItem" },
);

export const AgendaItemSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      committee: t.Boolean(),
      committeeId: t.Boolean(),
      title: t.Boolean(),
      description: t.Boolean(),
      speakerLists: t.Boolean(),
      isActive: t.Boolean(),
      _count: t.Boolean(),
    },
    {
      additionalProperties: false,
      description: `An agenda item in a committee. This is a topic of discussion in a committee.`,
    },
  ),
  { additionalProperties: false },
);

export const AgendaItemInclude = t.Partial(
  t.Object(
    { committee: t.Boolean(), speakerLists: t.Boolean(), _count: t.Boolean() },
    {
      additionalProperties: false,
      description: `An agenda item in a committee. This is a topic of discussion in a committee.`,
    },
  ),
  { additionalProperties: false },
);

export const AgendaItemOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")]),
      committeeId: t.Union([t.Literal("asc"), t.Literal("desc")]),
      title: t.Union([t.Literal("asc"), t.Literal("desc")]),
      description: t.Union([t.Literal("asc"), t.Literal("desc")]),
      isActive: t.Union([t.Literal("asc"), t.Literal("desc")]),
    },
    {
      additionalProperties: false,
      description: `An agenda item in a committee. This is a topic of discussion in a committee.`,
    },
  ),
  { additionalProperties: false },
);

export const AgendaItem = t.Composite([AgendaItemPlain, AgendaItemRelations], {
  additionalProperties: false,
});

export const AgendaItemInputCreate = t.Composite(
  [AgendaItemPlainInputCreate, AgendaItemRelationsInputCreate],
  { additionalProperties: false },
);

export const AgendaItemInputUpdate = t.Composite(
  [AgendaItemPlainInputUpdate, AgendaItemRelationsInputUpdate],
  { additionalProperties: false },
);
