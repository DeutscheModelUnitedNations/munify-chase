import { t } from "elysia";

import { _Nullable } from "./__nullable__";

export const ConferencePlain = t.Object(
  {
    id: t.String({ description: ``, additionalProperties: false }),
    name: t.String({ description: ``, additionalProperties: false }),
    start: _Nullable(t.Date({ description: ``, additionalProperties: false })),
    end: _Nullable(t.Date({ description: ``, additionalProperties: false })),
    pressWebsite: _Nullable(
      t.String({ description: ``, additionalProperties: false }),
    ),
    feedbackWebsite: _Nullable(
      t.String({ description: ``, additionalProperties: false }),
    ),
  },
  { description: `A conference in the system`, additionalProperties: false },
);

export const ConferenceRelations = t.Object(
  {
    committees: t.Array(
      t.Object(
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
    ),
    delegations: t.Array(
      t.Object(
        {
          id: t.String({ description: ``, additionalProperties: false }),
          conferenceId: t.String({
            description: ``,
            additionalProperties: false,
          }),
          nationId: t.String({ description: ``, additionalProperties: false }),
        },
        { description: ``, additionalProperties: false },
      ),
    ),
    members: t.Array(
      t.Object(
        {
          id: t.String({ description: ``, additionalProperties: false }),
          conferenceId: t.String({
            description: ``,
            additionalProperties: false,
          }),
          userId: _Nullable(
            t.String({ description: ``, additionalProperties: false }),
          ),
          role: t.Union(
            [
              t.Literal("ADMIN"),
              t.Literal("SECRETARIAT"),
              t.Literal("CHAIR"),
              t.Literal("COMMITTEE_ADVISOR"),
              t.Literal("NON_STATE_ACTOR"),
              t.Literal("PRESS_CORPS"),
              t.Literal("GUEST"),
              t.Literal("PARTICIPANT_CARE"),
              t.Literal("MISCELLANEOUS_TEAM"),
            ],
            {
              description: `The role of a user in a conference`,
              additionalProperties: false,
            },
          ),
        },
        {
          description: `A user's membership in a conference, providing them with a role in the conference`,
          additionalProperties: false,
        },
      ),
    ),
  },
  { description: `A conference in the system`, additionalProperties: false },
);

export const Conference = t.Composite([ConferencePlain, ConferenceRelations], {
  description: `Composition of ConferencePlain, ConferenceRelations`,
  additionalProperties: false,
});

export const ConferenceWhere = t.Union([
  t.Composite([
    t.Pick(
      t.Required(
        t.Composite([t.Object({}), t.Pick(ConferencePlain, ["id", "name"])]),
      ),
      ["id"],
    ),
    t.Omit(
      t.Partial(
        t.Composite([t.Object({}), t.Pick(ConferencePlain, ["id", "name"])]),
      ),
      ["id"],
    ),
  ]),
  t.Composite([
    t.Pick(
      t.Required(
        t.Composite([t.Object({}), t.Pick(ConferencePlain, ["id", "name"])]),
      ),
      ["name"],
    ),
    t.Omit(
      t.Partial(
        t.Composite([t.Object({}), t.Pick(ConferencePlain, ["id", "name"])]),
      ),
      ["name"],
    ),
  ]),
]);

export const ConferenceDataPlain = t.Object(
  {
    name: t.String({ description: ``, additionalProperties: false }),
    start: t.Optional(
      _Nullable(t.Date({ description: ``, additionalProperties: false })),
    ),
    end: t.Optional(
      _Nullable(t.Date({ description: ``, additionalProperties: false })),
    ),
    pressWebsite: t.Optional(
      _Nullable(t.String({ description: ``, additionalProperties: false })),
    ),
    feedbackWebsite: t.Optional(
      _Nullable(t.String({ description: ``, additionalProperties: false })),
    ),
  },
  { description: `A conference in the system`, additionalProperties: false },
);

export const ConferenceDataRelations = t.Object(
  {},
  { description: `A conference in the system`, additionalProperties: false },
);

export const ConferenceData = t.Composite(
  [ConferenceDataPlain, ConferenceDataRelations],
  {
    description: `Composition of ConferenceDataPlain, ConferenceDataRelations`,
    additionalProperties: false,
  },
);

export const ConferenceDataPlainOptional = t.Object(
  {
    name: t.Optional(
      t.String({ description: ``, additionalProperties: false }),
    ),
    start: t.Optional(
      _Nullable(t.Date({ description: ``, additionalProperties: false })),
    ),
    end: t.Optional(
      _Nullable(t.Date({ description: ``, additionalProperties: false })),
    ),
    pressWebsite: t.Optional(
      _Nullable(t.String({ description: ``, additionalProperties: false })),
    ),
    feedbackWebsite: t.Optional(
      _Nullable(t.String({ description: ``, additionalProperties: false })),
    ),
  },
  { description: `A conference in the system`, additionalProperties: false },
);

export const ConferenceDataRelationsOptional = t.Object(
  {},
  { description: `A conference in the system`, additionalProperties: false },
);

export const ConferenceDataOptional = t.Composite(
  [ConferenceDataPlainOptional, ConferenceDataRelationsOptional],
  {
    description: `Composition of ConferenceDataPlainOptional, ConferenceDataRelationsOptional`,
    additionalProperties: false,
  },
);
