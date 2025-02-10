import { t } from "elysia";

import { _Nullable } from "./__nullable__";

export const SpeakersListPlain = t.Object(
  {
    id: t.String({ description: ``, additionalProperties: false }),
    agendaItemId: t.String({ description: ``, additionalProperties: false }),
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
);

export const SpeakersListRelations = t.Object(
  {
    agendaItem: t.Object(
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
    ),
    speakers: t.Array(
      t.Object(
        {
          id: t.String({ description: ``, additionalProperties: false }),
          speakersListId: t.String({
            description: ``,
            additionalProperties: false,
          }),
          committeeMemberId: t.String({
            description: ``,
            additionalProperties: false,
          }),
          position: t.Integer({ description: ``, additionalProperties: false }),
        },
        {
          description: `A speaker on a speakers list, storing their position in the list`,
          additionalProperties: false,
        },
      ),
    ),
  },
  {
    description: `A speakers list in a committee`,
    additionalProperties: false,
  },
);

export const SpeakersList = t.Composite(
  [SpeakersListPlain, SpeakersListRelations],
  {
    description: `Composition of SpeakersListPlain, SpeakersListRelations`,
    additionalProperties: false,
  },
);

export const SpeakersListWhere = t.Union([
  t.Composite([
    t.Pick(
      t.Required(
        t.Composite([
          t.Object({
            agendaItemId_type: t.Object(
              {
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
              },
              { description: ``, additionalProperties: false },
            ),
          }),
          t.Pick(SpeakersListPlain, ["id"]),
        ]),
      ),
      ["id"],
    ),
    t.Omit(
      t.Partial(
        t.Composite([
          t.Object({
            agendaItemId_type: t.Object(
              {
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
              },
              { description: ``, additionalProperties: false },
            ),
          }),
          t.Pick(SpeakersListPlain, ["id"]),
        ]),
      ),
      ["id"],
    ),
  ]),
  t.Composite([
    t.Pick(
      t.Required(
        t.Composite([
          t.Object({
            agendaItemId_type: t.Object(
              {
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
              },
              { description: ``, additionalProperties: false },
            ),
          }),
          t.Pick(SpeakersListPlain, ["id"]),
        ]),
      ),
      ["agendaItemId_type"],
    ),
    t.Omit(
      t.Partial(
        t.Composite([
          t.Object({
            agendaItemId_type: t.Object(
              {
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
              },
              { description: ``, additionalProperties: false },
            ),
          }),
          t.Pick(SpeakersListPlain, ["id"]),
        ]),
      ),
      ["agendaItemId_type"],
    ),
  ]),
]);

export const SpeakersListDataPlain = t.Object(
  {
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
    timeLeft: t.Optional(
      _Nullable(t.Integer({ description: ``, additionalProperties: false })),
    ),
    startTimestamp: t.Optional(
      _Nullable(t.Date({ description: ``, additionalProperties: false })),
    ),
    isClosed: t.Boolean({ description: ``, additionalProperties: false }),
  },
  {
    description: `A speakers list in a committee`,
    additionalProperties: false,
  },
);

export const SpeakersListDataRelations = t.Object(
  { agendaItemId: t.String({ description: ``, additionalProperties: false }) },
  {
    description: `A speakers list in a committee`,
    additionalProperties: false,
  },
);

export const SpeakersListData = t.Composite(
  [SpeakersListDataPlain, SpeakersListDataRelations],
  {
    description: `Composition of SpeakersListDataPlain, SpeakersListDataRelations`,
    additionalProperties: false,
  },
);

export const SpeakersListDataPlainOptional = t.Object(
  {
    type: t.Optional(
      t.Union(
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
    ),
    speakingTime: t.Optional(
      t.Integer({
        description: `The time in seconds that a speaker has to speak`,
        additionalProperties: false,
      }),
    ),
    timeLeft: t.Optional(
      _Nullable(t.Integer({ description: ``, additionalProperties: false })),
    ),
    startTimestamp: t.Optional(
      _Nullable(t.Date({ description: ``, additionalProperties: false })),
    ),
    isClosed: t.Optional(
      t.Boolean({ description: ``, additionalProperties: false }),
    ),
  },
  {
    description: `A speakers list in a committee`,
    additionalProperties: false,
  },
);

export const SpeakersListDataRelationsOptional = t.Object(
  {
    agendaItemId: t.Optional(
      t.String({ description: ``, additionalProperties: false }),
    ),
  },
  {
    description: `A speakers list in a committee`,
    additionalProperties: false,
  },
);

export const SpeakersListDataOptional = t.Composite(
  [SpeakersListDataPlainOptional, SpeakersListDataRelationsOptional],
  {
    description: `Composition of SpeakersListDataPlainOptional, SpeakersListDataRelationsOptional`,
    additionalProperties: false,
  },
);
