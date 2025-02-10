import { t } from "elysia";

import { _Nullable } from "./__nullable__";

export const SpeakerOnListPlain = t.Object(
  {
    id: t.String({ description: ``, additionalProperties: false }),
    speakersListId: t.String({ description: ``, additionalProperties: false }),
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
);

export const SpeakerOnListRelations = t.Object(
  {
    speakersList: t.Object(
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
    committeeMember: t.Object(
      {
        id: t.String({ description: ``, additionalProperties: false }),
        committeeId: t.String({ description: ``, additionalProperties: false }),
        userId: _Nullable(
          t.String({ description: ``, additionalProperties: false }),
        ),
        delegationId: _Nullable(
          t.String({ description: ``, additionalProperties: false }),
        ),
        presence: t.Union(
          [t.Literal("PRESENT"), t.Literal("EXCUSED"), t.Literal("ABSENT")],
          {
            description: `The presence status of a CommitteeMember`,
            additionalProperties: false,
          },
        ),
      },
      {
        description: `A user's membership in a committee, providing them with a role in the committee`,
        additionalProperties: false,
      },
    ),
  },
  {
    description: `A speaker on a speakers list, storing their position in the list`,
    additionalProperties: false,
  },
);

export const SpeakerOnList = t.Composite(
  [SpeakerOnListPlain, SpeakerOnListRelations],
  {
    description: `Composition of SpeakerOnListPlain, SpeakerOnListRelations`,
    additionalProperties: false,
  },
);

export const SpeakerOnListWhere = t.Union([
  t.Composite([
    t.Pick(
      t.Required(
        t.Composite([
          t.Object({
            speakersListId_position: t.Object(
              {
                speakersListId: t.String({
                  description: ``,
                  additionalProperties: false,
                }),
                position: t.Integer({
                  description: ``,
                  additionalProperties: false,
                }),
              },
              { description: ``, additionalProperties: false },
            ),
            speakersListId_committeeMemberId: t.Object(
              {
                speakersListId: t.String({
                  description: ``,
                  additionalProperties: false,
                }),
                committeeMemberId: t.String({
                  description: ``,
                  additionalProperties: false,
                }),
              },
              { description: ``, additionalProperties: false },
            ),
          }),
          t.Pick(SpeakerOnListPlain, ["id"]),
        ]),
      ),
      ["id"],
    ),
    t.Omit(
      t.Partial(
        t.Composite([
          t.Object({
            speakersListId_position: t.Object(
              {
                speakersListId: t.String({
                  description: ``,
                  additionalProperties: false,
                }),
                position: t.Integer({
                  description: ``,
                  additionalProperties: false,
                }),
              },
              { description: ``, additionalProperties: false },
            ),
            speakersListId_committeeMemberId: t.Object(
              {
                speakersListId: t.String({
                  description: ``,
                  additionalProperties: false,
                }),
                committeeMemberId: t.String({
                  description: ``,
                  additionalProperties: false,
                }),
              },
              { description: ``, additionalProperties: false },
            ),
          }),
          t.Pick(SpeakerOnListPlain, ["id"]),
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
            speakersListId_position: t.Object(
              {
                speakersListId: t.String({
                  description: ``,
                  additionalProperties: false,
                }),
                position: t.Integer({
                  description: ``,
                  additionalProperties: false,
                }),
              },
              { description: ``, additionalProperties: false },
            ),
            speakersListId_committeeMemberId: t.Object(
              {
                speakersListId: t.String({
                  description: ``,
                  additionalProperties: false,
                }),
                committeeMemberId: t.String({
                  description: ``,
                  additionalProperties: false,
                }),
              },
              { description: ``, additionalProperties: false },
            ),
          }),
          t.Pick(SpeakerOnListPlain, ["id"]),
        ]),
      ),
      ["speakersListId_position"],
    ),
    t.Omit(
      t.Partial(
        t.Composite([
          t.Object({
            speakersListId_position: t.Object(
              {
                speakersListId: t.String({
                  description: ``,
                  additionalProperties: false,
                }),
                position: t.Integer({
                  description: ``,
                  additionalProperties: false,
                }),
              },
              { description: ``, additionalProperties: false },
            ),
            speakersListId_committeeMemberId: t.Object(
              {
                speakersListId: t.String({
                  description: ``,
                  additionalProperties: false,
                }),
                committeeMemberId: t.String({
                  description: ``,
                  additionalProperties: false,
                }),
              },
              { description: ``, additionalProperties: false },
            ),
          }),
          t.Pick(SpeakerOnListPlain, ["id"]),
        ]),
      ),
      ["speakersListId_position"],
    ),
  ]),
  t.Composite([
    t.Pick(
      t.Required(
        t.Composite([
          t.Object({
            speakersListId_position: t.Object(
              {
                speakersListId: t.String({
                  description: ``,
                  additionalProperties: false,
                }),
                position: t.Integer({
                  description: ``,
                  additionalProperties: false,
                }),
              },
              { description: ``, additionalProperties: false },
            ),
            speakersListId_committeeMemberId: t.Object(
              {
                speakersListId: t.String({
                  description: ``,
                  additionalProperties: false,
                }),
                committeeMemberId: t.String({
                  description: ``,
                  additionalProperties: false,
                }),
              },
              { description: ``, additionalProperties: false },
            ),
          }),
          t.Pick(SpeakerOnListPlain, ["id"]),
        ]),
      ),
      ["speakersListId_committeeMemberId"],
    ),
    t.Omit(
      t.Partial(
        t.Composite([
          t.Object({
            speakersListId_position: t.Object(
              {
                speakersListId: t.String({
                  description: ``,
                  additionalProperties: false,
                }),
                position: t.Integer({
                  description: ``,
                  additionalProperties: false,
                }),
              },
              { description: ``, additionalProperties: false },
            ),
            speakersListId_committeeMemberId: t.Object(
              {
                speakersListId: t.String({
                  description: ``,
                  additionalProperties: false,
                }),
                committeeMemberId: t.String({
                  description: ``,
                  additionalProperties: false,
                }),
              },
              { description: ``, additionalProperties: false },
            ),
          }),
          t.Pick(SpeakerOnListPlain, ["id"]),
        ]),
      ),
      ["speakersListId_committeeMemberId"],
    ),
  ]),
]);

export const SpeakerOnListDataPlain = t.Object(
  { position: t.Integer({ description: ``, additionalProperties: false }) },
  {
    description: `A speaker on a speakers list, storing their position in the list`,
    additionalProperties: false,
  },
);

export const SpeakerOnListDataRelations = t.Object(
  {
    speakersListId: t.String({ description: ``, additionalProperties: false }),
    committeeMemberId: t.String({
      description: ``,
      additionalProperties: false,
    }),
  },
  {
    description: `A speaker on a speakers list, storing their position in the list`,
    additionalProperties: false,
  },
);

export const SpeakerOnListData = t.Composite(
  [SpeakerOnListDataPlain, SpeakerOnListDataRelations],
  {
    description: `Composition of SpeakerOnListDataPlain, SpeakerOnListDataRelations`,
    additionalProperties: false,
  },
);

export const SpeakerOnListDataPlainOptional = t.Object(
  {
    position: t.Optional(
      t.Integer({ description: ``, additionalProperties: false }),
    ),
  },
  {
    description: `A speaker on a speakers list, storing their position in the list`,
    additionalProperties: false,
  },
);

export const SpeakerOnListDataRelationsOptional = t.Object(
  {
    speakersListId: t.Optional(
      t.String({ description: ``, additionalProperties: false }),
    ),
    committeeMemberId: t.Optional(
      t.String({ description: ``, additionalProperties: false }),
    ),
  },
  {
    description: `A speaker on a speakers list, storing their position in the list`,
    additionalProperties: false,
  },
);

export const SpeakerOnListDataOptional = t.Composite(
  [SpeakerOnListDataPlainOptional, SpeakerOnListDataRelationsOptional],
  {
    description: `Composition of SpeakerOnListDataPlainOptional, SpeakerOnListDataRelationsOptional`,
    additionalProperties: false,
  },
);
