import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const MessagePlain = t.Object(
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
    metaDelegation: __nullable__(t.String({ additionalProperties: false })),
    metaCommittee: __nullable__(t.String({ additionalProperties: false })),
    metaAgendaItem: __nullable__(t.String({ additionalProperties: false })),
  },
  { additionalProperties: false },
);

export const MessageRelations = t.Object(
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
    author: t.Object(
      {
        id: t.String({ additionalProperties: false }),
        name: t.String({ additionalProperties: false }),
      },
      { additionalProperties: false, description: `A user in the system` },
    ),
  },
  { additionalProperties: false },
);

export const MessagePlainInputCreate = t.Object(
  {
    subject: t.String({ additionalProperties: false }),
    category: t.Optional(
      t.Union(
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
    ),
    message: t.String({ additionalProperties: false }),
    timestamp: t.Date({ additionalProperties: false }),
    status: t.Optional(
      t.Array(
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
    ),
    forwarded: t.Optional(
      t.Boolean({
        additionalProperties: false,
        description: `If the message was forwarded to the Research Service`,
      }),
    ),
    metaEmail: t.Optional(
      __nullable__(
        t.String({
          additionalProperties: false,
          description: `Saved Metadata without relation`,
        }),
      ),
    ),
    metaDelegation: t.Optional(
      __nullable__(t.String({ additionalProperties: false })),
    ),
    metaCommittee: t.Optional(
      __nullable__(t.String({ additionalProperties: false })),
    ),
    metaAgendaItem: t.Optional(
      __nullable__(t.String({ additionalProperties: false })),
    ),
  },
  { additionalProperties: false },
);

export const MessagePlainInputUpdate = t.Object(
  {
    subject: t.String({ additionalProperties: false }),
    category: t.Optional(
      t.Union(
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
    ),
    message: t.String({ additionalProperties: false }),
    timestamp: t.Date({ additionalProperties: false }),
    status: t.Optional(
      t.Array(
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
    ),
    forwarded: t.Optional(
      t.Boolean({
        additionalProperties: false,
        description: `If the message was forwarded to the Research Service`,
      }),
    ),
    metaEmail: __nullable__(
      t.String({
        additionalProperties: false,
        description: `Saved Metadata without relation`,
      }),
    ),
    metaDelegation: __nullable__(t.String({ additionalProperties: false })),
    metaCommittee: __nullable__(t.String({ additionalProperties: false })),
    metaAgendaItem: __nullable__(t.String({ additionalProperties: false })),
  },
  { additionalProperties: false },
);

export const MessageRelationsInputCreate = t.Object(
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
    author: t.Object(
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
  { additionalProperties: false },
);

export const MessageRelationsInputUpdate = t.Partial(
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
      author: t.Object(
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
    { additionalProperties: false },
  ),
  { additionalProperties: false },
);

export const MessageWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object({
        AND: t.Union([Self, t.Array(Self)]),
        NOT: t.Union([Self, t.Array(Self)]),
        OR: t.Array(Self),
        id: t.String(),
        subject: t.String(),
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
        message: t.String(),
        committeeId: t.String(),
        authorId: t.String(),
        timestamp: t.Date(),
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
          description: `If the message was forwarded to the Research Service`,
        }),
        metaEmail: t.String({ description: `Saved Metadata without relation` }),
        metaDelegation: t.String(),
        metaCommittee: t.String(),
        metaAgendaItem: t.String(),
      }),
    { $id: "Message" },
  ),
  { additionalProperties: false },
);

export const MessageWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect([
      t.Partial(t.Object({ id: t.String() })),
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
            subject: t.String(),
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
            message: t.String(),
            committeeId: t.String(),
            authorId: t.String(),
            timestamp: t.Date(),
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
              description: `If the message was forwarded to the Research Service`,
            }),
            metaEmail: t.String({
              description: `Saved Metadata without relation`,
            }),
            metaDelegation: t.String(),
            metaCommittee: t.String(),
            metaAgendaItem: t.String(),
          },
          { additionalProperties: false },
        ),
        { additionalProperties: false },
      ),
    ]),
  { $id: "Message" },
);

export const MessageSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      subject: t.Boolean(),
      category: t.Boolean(),
      message: t.Boolean(),
      committee: t.Boolean(),
      committeeId: t.Boolean(),
      author: t.Boolean(),
      authorId: t.Boolean(),
      timestamp: t.Boolean(),
      status: t.Boolean(),
      forwarded: t.Boolean(),
      metaEmail: t.Boolean(),
      metaDelegation: t.Boolean(),
      metaCommittee: t.Boolean(),
      metaAgendaItem: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
  { additionalProperties: false },
);

export const MessageInclude = t.Partial(
  t.Object(
    {
      category: t.Boolean(),
      committee: t.Boolean(),
      author: t.Boolean(),
      status: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false },
  ),
  { additionalProperties: false },
);

export const MessageOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")]),
      subject: t.Union([t.Literal("asc"), t.Literal("desc")]),
      message: t.Union([t.Literal("asc"), t.Literal("desc")]),
      committeeId: t.Union([t.Literal("asc"), t.Literal("desc")]),
      authorId: t.Union([t.Literal("asc"), t.Literal("desc")]),
      timestamp: t.Union([t.Literal("asc"), t.Literal("desc")]),
      forwarded: t.Union([t.Literal("asc"), t.Literal("desc")]),
      metaEmail: t.Union([t.Literal("asc"), t.Literal("desc")]),
      metaDelegation: t.Union([t.Literal("asc"), t.Literal("desc")]),
      metaCommittee: t.Union([t.Literal("asc"), t.Literal("desc")]),
      metaAgendaItem: t.Union([t.Literal("asc"), t.Literal("desc")]),
    },
    { additionalProperties: false },
  ),
  { additionalProperties: false },
);

export const Message = t.Composite([MessagePlain, MessageRelations], {
  additionalProperties: false,
});

export const MessageInputCreate = t.Composite(
  [MessagePlainInputCreate, MessageRelationsInputCreate],
  { additionalProperties: false },
);

export const MessageInputUpdate = t.Composite(
  [MessagePlainInputUpdate, MessageRelationsInputUpdate],
  { additionalProperties: false },
);
