import { t } from "elysia";

import { _Nullable } from "./__nullable__";

export const ConferenceMemberPlain = t.Object(
  {
    id: t.String({ description: ``, additionalProperties: false }),
    conferenceId: t.String({ description: ``, additionalProperties: false }),
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
);

export const ConferenceMemberRelations = t.Object(
  {
    conference: t.Object(
      {
        id: t.String({ description: ``, additionalProperties: false }),
        name: t.String({ description: ``, additionalProperties: false }),
        start: _Nullable(
          t.Date({ description: ``, additionalProperties: false }),
        ),
        end: _Nullable(
          t.Date({ description: ``, additionalProperties: false }),
        ),
        pressWebsite: _Nullable(
          t.String({ description: ``, additionalProperties: false }),
        ),
        feedbackWebsite: _Nullable(
          t.String({ description: ``, additionalProperties: false }),
        ),
      },
      {
        description: `A conference in the system`,
        additionalProperties: false,
      },
    ),
    user: _Nullable(
      t.Object(
        {
          id: t.String({ description: ``, additionalProperties: false }),
          name: t.String({ description: ``, additionalProperties: false }),
        },
        { description: `A user in the system`, additionalProperties: false },
      ),
    ),
  },
  {
    description: `A user's membership in a conference, providing them with a role in the conference`,
    additionalProperties: false,
  },
);

export const ConferenceMember = t.Composite(
  [ConferenceMemberPlain, ConferenceMemberRelations],
  {
    description: `Composition of ConferenceMemberPlain, ConferenceMemberRelations`,
    additionalProperties: false,
  },
);

export const ConferenceMemberWhere = t.Union([
  t.Composite([
    t.Pick(
      t.Required(
        t.Composite([
          t.Object({
            userId_conferenceId: t.Object(
              {
                conferenceId: t.String({
                  description: ``,
                  additionalProperties: false,
                }),
                userId: t.Optional(
                  _Nullable(
                    t.String({ description: ``, additionalProperties: false }),
                  ),
                ),
              },
              { description: ``, additionalProperties: false },
            ),
          }),
          t.Pick(ConferenceMemberPlain, ["id"]),
        ]),
      ),
      ["id"],
    ),
    t.Omit(
      t.Partial(
        t.Composite([
          t.Object({
            userId_conferenceId: t.Object(
              {
                conferenceId: t.String({
                  description: ``,
                  additionalProperties: false,
                }),
                userId: t.Optional(
                  _Nullable(
                    t.String({ description: ``, additionalProperties: false }),
                  ),
                ),
              },
              { description: ``, additionalProperties: false },
            ),
          }),
          t.Pick(ConferenceMemberPlain, ["id"]),
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
            userId_conferenceId: t.Object(
              {
                conferenceId: t.String({
                  description: ``,
                  additionalProperties: false,
                }),
                userId: t.Optional(
                  _Nullable(
                    t.String({ description: ``, additionalProperties: false }),
                  ),
                ),
              },
              { description: ``, additionalProperties: false },
            ),
          }),
          t.Pick(ConferenceMemberPlain, ["id"]),
        ]),
      ),
      ["userId_conferenceId"],
    ),
    t.Omit(
      t.Partial(
        t.Composite([
          t.Object({
            userId_conferenceId: t.Object(
              {
                conferenceId: t.String({
                  description: ``,
                  additionalProperties: false,
                }),
                userId: t.Optional(
                  _Nullable(
                    t.String({ description: ``, additionalProperties: false }),
                  ),
                ),
              },
              { description: ``, additionalProperties: false },
            ),
          }),
          t.Pick(ConferenceMemberPlain, ["id"]),
        ]),
      ),
      ["userId_conferenceId"],
    ),
  ]),
]);

export const ConferenceMemberDataPlain = t.Object(
  {
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
);

export const ConferenceMemberDataRelations = t.Object(
  {
    conferenceId: t.String({ description: ``, additionalProperties: false }),
    userId: t.Optional(
      _Nullable(t.String({ description: ``, additionalProperties: false })),
    ),
  },
  {
    description: `A user's membership in a conference, providing them with a role in the conference`,
    additionalProperties: false,
  },
);

export const ConferenceMemberData = t.Composite(
  [ConferenceMemberDataPlain, ConferenceMemberDataRelations],
  {
    description: `Composition of ConferenceMemberDataPlain, ConferenceMemberDataRelations`,
    additionalProperties: false,
  },
);

export const ConferenceMemberDataPlainOptional = t.Object(
  {
    role: t.Optional(
      t.Union(
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
    ),
  },
  {
    description: `A user's membership in a conference, providing them with a role in the conference`,
    additionalProperties: false,
  },
);

export const ConferenceMemberDataRelationsOptional = t.Object(
  {
    conferenceId: t.Optional(
      t.String({ description: ``, additionalProperties: false }),
    ),
    userId: t.Optional(
      _Nullable(t.String({ description: ``, additionalProperties: false })),
    ),
  },
  {
    description: `A user's membership in a conference, providing them with a role in the conference`,
    additionalProperties: false,
  },
);

export const ConferenceMemberDataOptional = t.Composite(
  [ConferenceMemberDataPlainOptional, ConferenceMemberDataRelationsOptional],
  {
    description: `Composition of ConferenceMemberDataPlainOptional, ConferenceMemberDataRelationsOptional`,
    additionalProperties: false,
  },
);
