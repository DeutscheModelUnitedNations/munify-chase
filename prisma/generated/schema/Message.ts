import { t } from "elysia";

import { _Nullable } from "./__nullable__";

export const MessagePlain = t.Object(
  {
    id: t.String({ description: ``, additionalProperties: false }),
    subject: t.String({ description: ``, additionalProperties: false }),
    category: t.Union(
      [
        t.Literal("TO_CHAIR"),
        t.Literal("GUEST_SPEAKER"),
        t.Literal("FACT_CHECK"),
        t.Literal("INFORMATION"),
        t.Literal("GENERAL_SECRETARY"),
        t.Literal("OTHER"),
      ],
      { description: ``, additionalProperties: false },
    ),
    message: t.String({ description: ``, additionalProperties: false }),
    committeeId: t.String({ description: ``, additionalProperties: false }),
    authorId: t.String({ description: ``, additionalProperties: false }),
    timestamp: t.Date({ description: ``, additionalProperties: false }),
    status: t.Union(
      [
        t.Literal("UNREAD"),
        t.Literal("PRIORITY"),
        t.Literal("ASSIGNED"),
        t.Literal("ARCHIVED"),
      ],
      { description: ``, additionalProperties: false },
    ),
    forwarded: t.Boolean({
      description: `If the message was forwarded to the Research Service`,
      additionalProperties: false,
    }),
    metaEmail: _Nullable(
      t.String({
        description: `Saved Metadata without relation`,
        additionalProperties: false,
      }),
    ),
    metaDelegation: _Nullable(
      t.String({ description: ``, additionalProperties: false }),
    ),
    metaCommittee: _Nullable(
      t.String({ description: ``, additionalProperties: false }),
    ),
    metaAgendaItem: _Nullable(
      t.String({ description: ``, additionalProperties: false }),
    ),
  },
  { description: ``, additionalProperties: false },
);

export const MessageRelations = t.Object(
  {
    committee: t.Object(
      {
        id: t.String({ description: ``, additionalProperties: false }),
        name: t.String({ description: ``, additionalProperties: false }),
        abbreviation: t.String({
          description: ``,
          additionalProperties: false,
        }),
        category: t.Union(
          [t.Literal("COMMITTEE"), t.Literal("CRISIS"), t.Literal("ICJ")],
          {
            description: `The type of a committee in a conference`,
            additionalProperties: false,
          },
        ),
        conferenceId: t.String({
          description: ``,
          additionalProperties: false,
        }),
        parentId: _Nullable(
          t.String({ description: ``, additionalProperties: false }),
        ),
        whiteboardContent: t.String({
          description: ``,
          additionalProperties: false,
        }),
        status: t.Union(
          [
            t.Literal("FORMAL"),
            t.Literal("INFORMAL"),
            t.Literal("PAUSE"),
            t.Literal("SUSPENSION"),
            t.Literal("CLOSED"),
          ],
          { description: ``, additionalProperties: false },
        ),
        stateOfDebate: _Nullable(
          t.String({ description: ``, additionalProperties: false }),
        ),
        statusHeadline: _Nullable(
          t.String({ description: ``, additionalProperties: false }),
        ),
        statusUntil: _Nullable(
          t.Date({ description: ``, additionalProperties: false }),
        ),
        allowDelegationsToAddThemselvesToSpeakersList: t.Boolean({
          description: ``,
          additionalProperties: false,
        }),
      },
      {
        description: `A committee in a conference`,
        additionalProperties: false,
      },
    ),
    author: t.Object(
      {
        id: t.String({ description: ``, additionalProperties: false }),
        name: t.String({ description: ``, additionalProperties: false }),
      },
      { description: `A user in the system`, additionalProperties: false },
    ),
  },
  { description: ``, additionalProperties: false },
);

export const Message = t.Composite([MessagePlain, MessageRelations], {
  description: `Composition of MessagePlain, MessageRelations`,
  additionalProperties: false,
});

export const MessageWhere = t.Union([
  t.Composite([
    t.Pick(
      t.Required(t.Composite([t.Object({}), t.Pick(MessagePlain, ["id"])])),
      ["id"],
    ),
    t.Omit(
      t.Partial(t.Composite([t.Object({}), t.Pick(MessagePlain, ["id"])])),
      ["id"],
    ),
  ]),
]);

export const MessageDataPlain = t.Object(
  {
    subject: t.String({ description: ``, additionalProperties: false }),
    category: t.Union(
      [
        t.Literal("TO_CHAIR"),
        t.Literal("GUEST_SPEAKER"),
        t.Literal("FACT_CHECK"),
        t.Literal("INFORMATION"),
        t.Literal("GENERAL_SECRETARY"),
        t.Literal("OTHER"),
      ],
      { description: ``, additionalProperties: false },
    ),
    message: t.String({ description: ``, additionalProperties: false }),
    timestamp: t.Date({ description: ``, additionalProperties: false }),
    status: t.Array(
      t.Union(
        [
          t.Literal("UNREAD"),
          t.Literal("PRIORITY"),
          t.Literal("ASSIGNED"),
          t.Literal("ARCHIVED"),
        ],
        { description: ``, additionalProperties: false },
      ),
    ),
    forwarded: t.Boolean({
      description: `If the message was forwarded to the Research Service`,
      additionalProperties: false,
    }),
    metaEmail: t.Optional(
      _Nullable(
        t.String({
          description: `Saved Metadata without relation`,
          additionalProperties: false,
        }),
      ),
    ),
    metaDelegation: t.Optional(
      _Nullable(t.String({ description: ``, additionalProperties: false })),
    ),
    metaCommittee: t.Optional(
      _Nullable(t.String({ description: ``, additionalProperties: false })),
    ),
    metaAgendaItem: t.Optional(
      _Nullable(t.String({ description: ``, additionalProperties: false })),
    ),
  },
  { description: ``, additionalProperties: false },
);

export const MessageDataRelations = t.Object(
  {
    committeeId: t.String({ description: ``, additionalProperties: false }),
    authorId: t.String({ description: ``, additionalProperties: false }),
  },
  { description: ``, additionalProperties: false },
);

export const MessageData = t.Composite(
  [MessageDataPlain, MessageDataRelations],
  {
    description: `Composition of MessageDataPlain, MessageDataRelations`,
    additionalProperties: false,
  },
);

export const MessageDataPlainOptional = t.Object(
  {
    subject: t.Optional(
      t.String({ description: ``, additionalProperties: false }),
    ),
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
        { description: ``, additionalProperties: false },
      ),
    ),
    message: t.Optional(
      t.String({ description: ``, additionalProperties: false }),
    ),
    timestamp: t.Optional(
      t.Date({ description: ``, additionalProperties: false }),
    ),
    status: t.Optional(
      t.Array(
        t.Union(
          [
            t.Literal("UNREAD"),
            t.Literal("PRIORITY"),
            t.Literal("ASSIGNED"),
            t.Literal("ARCHIVED"),
          ],
          { description: ``, additionalProperties: false },
        ),
      ),
    ),
    forwarded: t.Optional(
      t.Boolean({
        description: `If the message was forwarded to the Research Service`,
        additionalProperties: false,
      }),
    ),
    metaEmail: t.Optional(
      _Nullable(
        t.String({
          description: `Saved Metadata without relation`,
          additionalProperties: false,
        }),
      ),
    ),
    metaDelegation: t.Optional(
      _Nullable(t.String({ description: ``, additionalProperties: false })),
    ),
    metaCommittee: t.Optional(
      _Nullable(t.String({ description: ``, additionalProperties: false })),
    ),
    metaAgendaItem: t.Optional(
      _Nullable(t.String({ description: ``, additionalProperties: false })),
    ),
  },
  { description: ``, additionalProperties: false },
);

export const MessageDataRelationsOptional = t.Object(
  {
    committeeId: t.Optional(
      t.String({ description: ``, additionalProperties: false }),
    ),
    authorId: t.Optional(
      t.String({ description: ``, additionalProperties: false }),
    ),
  },
  { description: ``, additionalProperties: false },
);

export const MessageDataOptional = t.Composite(
  [MessageDataPlainOptional, MessageDataRelationsOptional],
  {
    description: `Composition of MessageDataPlainOptional, MessageDataRelationsOptional`,
    additionalProperties: false,
  },
);
