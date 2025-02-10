import { t } from "elysia";

import { _Nullable } from "./__nullable__";

export const AgendaItemPlain = t.Object(
  {
    id: t.String({ description: ``, additionalProperties: false }),
    committeeId: t.String({ description: ``, additionalProperties: false }),
    title: t.String({ description: ``, additionalProperties: false }),
    description: _Nullable(
      t.String({ description: ``, additionalProperties: false }),
    ),
    isActive: t.Boolean({ description: ``, additionalProperties: false }),
  },
  {
    description: `An agenda item in a committee. This is a topic of discussion in a committee.`,
    additionalProperties: false,
  },
);

export const AgendaItemRelations = t.Object(
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
    speakerLists: t.Array(
      t.Object(
        {
          id: t.String({ description: ``, additionalProperties: false }),
          agendaItemId: t.String({
            description: ``,
            additionalProperties: false,
          }),
          type: t.Union(
            [
              t.Literal("SPEAKERS_LIST"),
              t.Literal("COMMENT_LIST"),
              t.Literal("MODERATED_CAUCUS"),
            ],
            {
              description: `The type of a speakers list`,
              additionalProperties: false,
            },
          ),
          speakingTime: t.Integer({
            description: `The time in seconds that a speaker has to speak`,
            additionalProperties: false,
          }),
          timeLeft: _Nullable(
            t.Integer({ description: ``, additionalProperties: false }),
          ),
          startTimestamp: _Nullable(
            t.Date({ description: ``, additionalProperties: false }),
          ),
          isClosed: t.Boolean({ description: ``, additionalProperties: false }),
        },
        {
          description: `A speakers list in a committee`,
          additionalProperties: false,
        },
      ),
    ),
  },
  {
    description: `An agenda item in a committee. This is a topic of discussion in a committee.`,
    additionalProperties: false,
  },
);

export const AgendaItem = t.Composite([AgendaItemPlain, AgendaItemRelations], {
  description: `Composition of AgendaItemPlain, AgendaItemRelations`,
  additionalProperties: false,
});

export const AgendaItemWhere = t.Union([
  t.Composite([
    t.Pick(
      t.Required(t.Composite([t.Object({}), t.Pick(AgendaItemPlain, ["id"])])),
      ["id"],
    ),
    t.Omit(
      t.Partial(t.Composite([t.Object({}), t.Pick(AgendaItemPlain, ["id"])])),
      ["id"],
    ),
  ]),
]);

export const AgendaItemDataPlain = t.Object(
  {
    title: t.String({ description: ``, additionalProperties: false }),
    description: t.Optional(
      _Nullable(t.String({ description: ``, additionalProperties: false })),
    ),
    isActive: t.Boolean({ description: ``, additionalProperties: false }),
  },
  {
    description: `An agenda item in a committee. This is a topic of discussion in a committee.`,
    additionalProperties: false,
  },
);

export const AgendaItemDataRelations = t.Object(
  { committeeId: t.String({ description: ``, additionalProperties: false }) },
  {
    description: `An agenda item in a committee. This is a topic of discussion in a committee.`,
    additionalProperties: false,
  },
);

export const AgendaItemData = t.Composite(
  [AgendaItemDataPlain, AgendaItemDataRelations],
  {
    description: `Composition of AgendaItemDataPlain, AgendaItemDataRelations`,
    additionalProperties: false,
  },
);

export const AgendaItemDataPlainOptional = t.Object(
  {
    title: t.Optional(
      t.String({ description: ``, additionalProperties: false }),
    ),
    description: t.Optional(
      _Nullable(t.String({ description: ``, additionalProperties: false })),
    ),
    isActive: t.Optional(
      t.Boolean({ description: ``, additionalProperties: false }),
    ),
  },
  {
    description: `An agenda item in a committee. This is a topic of discussion in a committee.`,
    additionalProperties: false,
  },
);

export const AgendaItemDataRelationsOptional = t.Object(
  {
    committeeId: t.Optional(
      t.String({ description: ``, additionalProperties: false }),
    ),
  },
  {
    description: `An agenda item in a committee. This is a topic of discussion in a committee.`,
    additionalProperties: false,
  },
);

export const AgendaItemDataOptional = t.Composite(
  [AgendaItemDataPlainOptional, AgendaItemDataRelationsOptional],
  {
    description: `Composition of AgendaItemDataPlainOptional, AgendaItemDataRelationsOptional`,
    additionalProperties: false,
  },
);
