import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const CommitteePlain = t.Object(
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
  { additionalProperties: false, description: `A committee in a conference` },
);

export const CommitteeRelations = t.Object(
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
    parent: __nullable__(
      t.Object(
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
          stateOfDebate: __nullable__(
            t.String({ additionalProperties: false }),
          ),
          statusHeadline: __nullable__(
            t.String({ additionalProperties: false }),
          ),
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
    ),
    subCommittees: t.Array(
      t.Object(
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
          stateOfDebate: __nullable__(
            t.String({ additionalProperties: false }),
          ),
          statusHeadline: __nullable__(
            t.String({ additionalProperties: false }),
          ),
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
    ),
    messages: t.Array(
      t.Object(
        {
          id: t.String({ additionalProperties: false }),
          subject: t.String({ additionalProperties: false }),
          category: t.Union(
            [
              t.Literal("TO_CHAIR"),
              t.Literal("GUEST_SPEAKER"),
              t.Literal("FACT_CHECK"),
              t.Literal("INFORMATION"),
              t.Literal("GENERAL_SECRETARY"),
              t.Literal("OTHER"),
            ],
            { additionalProperties: false },
          ),
          message: t.String({ additionalProperties: false }),
          committeeId: t.String({ additionalProperties: false }),
          authorId: t.String({ additionalProperties: false }),
          timestamp: t.Date({ additionalProperties: false }),
          status: t.Array(
            t.Union(
              [
                t.Literal("UNREAD"),
                t.Literal("PRIORITY"),
                t.Literal("ASSIGNED"),
                t.Literal("ARCHIVED"),
              ],
              { additionalProperties: false },
            ),
          ),
          forwarded: t.Boolean({
            additionalProperties: false,
            description: `If the message was forwarded to the Research Service`,
          }),
          metaEmail: __nullable__(
            t.String({
              additionalProperties: false,
              description: `Saved Metadata without relation`,
            }),
          ),
          metaDelegation: __nullable__(
            t.String({ additionalProperties: false }),
          ),
          metaCommittee: __nullable__(
            t.String({ additionalProperties: false }),
          ),
          metaAgendaItem: __nullable__(
            t.String({ additionalProperties: false }),
          ),
        },
        { additionalProperties: false },
      ),
    ),
    agendaItems: t.Array(
      t.Object(
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
    ),
  },
  { additionalProperties: false, description: `A committee in a conference` },
);

export const CommitteePlainInputCreate = t.Object(
  {
    name: t.String({ additionalProperties: false }),
    abbreviation: t.String({ additionalProperties: false }),
    category: t.Union(
      [t.Literal("COMMITTEE"), t.Literal("CRISIS"), t.Literal("ICJ")],
      {
        additionalProperties: false,
        description: `The type of a committee in a conference`,
      },
    ),
    whiteboardContent: t.Optional(t.String({ additionalProperties: false })),
    status: t.Optional(
      t.Union(
        [
          t.Literal("FORMAL"),
          t.Literal("INFORMAL"),
          t.Literal("PAUSE"),
          t.Literal("SUSPENSION"),
          t.Literal("CLOSED"),
        ],
        { additionalProperties: false },
      ),
    ),
    stateOfDebate: t.Optional(
      __nullable__(t.String({ additionalProperties: false })),
    ),
    statusHeadline: t.Optional(
      __nullable__(t.String({ additionalProperties: false })),
    ),
    statusUntil: t.Optional(
      __nullable__(t.Date({ additionalProperties: false })),
    ),
    allowDelegationsToAddThemselvesToSpeakersList: t.Optional(
      t.Boolean({ additionalProperties: false }),
    ),
  },
  { additionalProperties: false, description: `A committee in a conference` },
);

export const CommitteePlainInputUpdate = t.Object(
  {
    name: t.String({ additionalProperties: false }),
    abbreviation: t.String({ additionalProperties: false }),
    category: t.Union(
      [t.Literal("COMMITTEE"), t.Literal("CRISIS"), t.Literal("ICJ")],
      {
        additionalProperties: false,
        description: `The type of a committee in a conference`,
      },
    ),
    whiteboardContent: t.Optional(t.String({ additionalProperties: false })),
    status: t.Optional(
      t.Union(
        [
          t.Literal("FORMAL"),
          t.Literal("INFORMAL"),
          t.Literal("PAUSE"),
          t.Literal("SUSPENSION"),
          t.Literal("CLOSED"),
        ],
        { additionalProperties: false },
      ),
    ),
    stateOfDebate: __nullable__(t.String({ additionalProperties: false })),
    statusHeadline: __nullable__(t.String({ additionalProperties: false })),
    statusUntil: __nullable__(t.Date({ additionalProperties: false })),
    allowDelegationsToAddThemselvesToSpeakersList: t.Optional(
      t.Boolean({ additionalProperties: false }),
    ),
  },
  { additionalProperties: false, description: `A committee in a conference` },
);

export const CommitteeRelationsInputCreate = t.Object(
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
    parent: t.Optional(
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
    subCommittees: t.Optional(
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
    messages: t.Optional(
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
    agendaItems: t.Optional(
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
  { additionalProperties: false, description: `A committee in a conference` },
);

export const CommitteeRelationsInputUpdate = t.Partial(
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
      parent: t.Partial(
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
      subCommittees: t.Partial(
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
      messages: t.Partial(
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
      agendaItems: t.Partial(
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
    { additionalProperties: false, description: `A committee in a conference` },
  ),
  { additionalProperties: false },
);

export const CommitteeWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self)]),
          NOT: t.Union([Self, t.Array(Self)]),
          OR: t.Array(Self),
          id: t.String(),
          name: t.String(),
          abbreviation: t.String(),
          category: t.Union(
            [t.Literal("COMMITTEE"), t.Literal("CRISIS"), t.Literal("ICJ")],
            {
              additionalProperties: false,
              description: `The type of a committee in a conference`,
            },
          ),
          conferenceId: t.String(),
          parentId: t.String(),
          whiteboardContent: t.String(),
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
          stateOfDebate: t.String(),
          statusHeadline: t.String(),
          statusUntil: t.Date(),
          allowDelegationsToAddThemselvesToSpeakersList: t.Boolean(),
        },
        { description: `A committee in a conference` },
      ),
    { $id: "Committee" },
  ),
  { additionalProperties: false },
);

export const CommitteeWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect([
      t.Partial(
        t.Object(
          {
            id: t.String(),
            name_conferenceId: t.Object({
              name: t.String(),
              conferenceId: t.String(),
            }),
            abbreviation_conferenceId: t.Object({
              abbreviation: t.String(),
              conferenceId: t.String(),
            }),
          },
          { description: `A committee in a conference` },
        ),
      ),
      t.Union([
        t.Object({ id: t.String() }),
        t.Object({
          name_conferenceId: t.Object({
            name: t.String(),
            conferenceId: t.String(),
          }),
        }),
        t.Object({
          abbreviation_conferenceId: t.Object({
            abbreviation: t.String(),
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
            name: t.String(),
            abbreviation: t.String(),
            category: t.Union(
              [t.Literal("COMMITTEE"), t.Literal("CRISIS"), t.Literal("ICJ")],
              {
                additionalProperties: false,
                description: `The type of a committee in a conference`,
              },
            ),
            conferenceId: t.String(),
            parentId: t.String(),
            whiteboardContent: t.String(),
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
            stateOfDebate: t.String(),
            statusHeadline: t.String(),
            statusUntil: t.Date(),
            allowDelegationsToAddThemselvesToSpeakersList: t.Boolean(),
          },
          { additionalProperties: false },
        ),
        { additionalProperties: false },
      ),
    ]),
  { $id: "Committee" },
);

export const CommitteeSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      name: t.Boolean(),
      abbreviation: t.Boolean(),
      category: t.Boolean(),
      conference: t.Boolean(),
      conferenceId: t.Boolean(),
      members: t.Boolean(),
      parent: t.Boolean(),
      parentId: t.Boolean(),
      subCommittees: t.Boolean(),
      messages: t.Boolean(),
      agendaItems: t.Boolean(),
      whiteboardContent: t.Boolean(),
      status: t.Boolean(),
      stateOfDebate: t.Boolean(),
      statusHeadline: t.Boolean(),
      statusUntil: t.Boolean(),
      allowDelegationsToAddThemselvesToSpeakersList: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false, description: `A committee in a conference` },
  ),
  { additionalProperties: false },
);

export const CommitteeInclude = t.Partial(
  t.Object(
    {
      category: t.Boolean(),
      conference: t.Boolean(),
      members: t.Boolean(),
      parent: t.Boolean(),
      subCommittees: t.Boolean(),
      messages: t.Boolean(),
      agendaItems: t.Boolean(),
      status: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false, description: `A committee in a conference` },
  ),
  { additionalProperties: false },
);

export const CommitteeOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")]),
      name: t.Union([t.Literal("asc"), t.Literal("desc")]),
      abbreviation: t.Union([t.Literal("asc"), t.Literal("desc")]),
      conferenceId: t.Union([t.Literal("asc"), t.Literal("desc")]),
      parentId: t.Union([t.Literal("asc"), t.Literal("desc")]),
      whiteboardContent: t.Union([t.Literal("asc"), t.Literal("desc")]),
      stateOfDebate: t.Union([t.Literal("asc"), t.Literal("desc")]),
      statusHeadline: t.Union([t.Literal("asc"), t.Literal("desc")]),
      statusUntil: t.Union([t.Literal("asc"), t.Literal("desc")]),
      allowDelegationsToAddThemselvesToSpeakersList: t.Union([
        t.Literal("asc"),
        t.Literal("desc"),
      ]),
    },
    { additionalProperties: false, description: `A committee in a conference` },
  ),
  { additionalProperties: false },
);

export const Committee = t.Composite([CommitteePlain, CommitteeRelations], {
  additionalProperties: false,
});

export const CommitteeInputCreate = t.Composite(
  [CommitteePlainInputCreate, CommitteeRelationsInputCreate],
  { additionalProperties: false },
);

export const CommitteeInputUpdate = t.Composite(
  [CommitteePlainInputUpdate, CommitteeRelationsInputUpdate],
  { additionalProperties: false },
);
