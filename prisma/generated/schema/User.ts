import { t } from "elysia";

import { _Nullable } from "./__nullable__";

export const UserPlain = t.Object(
  {
    id: t.String({ description: ``, additionalProperties: false }),
    name: t.String({ description: ``, additionalProperties: false }),
  },
  { description: `A user in the system`, additionalProperties: false },
);

export const UserRelations = t.Object(
  {
    conferenceMemberships: t.Array(
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
    committeeMemberships: t.Array(
      t.Object(
        {
          id: t.String({ description: ``, additionalProperties: false }),
          committeeId: t.String({
            description: ``,
            additionalProperties: false,
          }),
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
    ),
    messages: t.Array(
      t.Object(
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
          committeeId: t.String({
            description: ``,
            additionalProperties: false,
          }),
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
      ),
    ),
    emails: t.Array(
      t.Object(
        {
          email: t.String({ description: ``, additionalProperties: false }),
          userId: t.String({ description: ``, additionalProperties: false }),
          validated: t.Boolean({
            description: ``,
            additionalProperties: false,
          }),
          validationTokenId: _Nullable(
            t.String({ description: ``, additionalProperties: false }),
          ),
        },
        { description: ``, additionalProperties: false },
      ),
    ),
    passwords: t.Array(
      t.Object(
        {
          id: t.String({ description: ``, additionalProperties: false }),
          userId: t.String({ description: ``, additionalProperties: false }),
        },
        { description: ``, additionalProperties: false },
      ),
    ),
    pendingCredentialCreationTasks: t.Array(
      t.Object(
        {
          id: t.String({ description: ``, additionalProperties: false }),
          userId: t.String({ description: ``, additionalProperties: false }),
          tokenId: t.String({ description: ``, additionalProperties: false }),
        },
        { description: ``, additionalProperties: false },
      ),
    ),
  },
  { description: `A user in the system`, additionalProperties: false },
);

export const User = t.Composite([UserPlain, UserRelations], {
  description: `Composition of UserPlain, UserRelations`,
  additionalProperties: false,
});

export const UserWhere = t.Union([
  t.Composite([
    t.Pick(t.Required(t.Composite([t.Object({}), t.Pick(UserPlain, ["id"])])), [
      "id",
    ]),
    t.Omit(t.Partial(t.Composite([t.Object({}), t.Pick(UserPlain, ["id"])])), [
      "id",
    ]),
  ]),
]);

export const UserDataPlain = t.Object(
  { name: t.String({ description: ``, additionalProperties: false }) },
  { description: `A user in the system`, additionalProperties: false },
);

export const UserDataRelations = t.Object(
  {},
  { description: `A user in the system`, additionalProperties: false },
);

export const UserData = t.Composite([UserDataPlain, UserDataRelations], {
  description: `Composition of UserDataPlain, UserDataRelations`,
  additionalProperties: false,
});

export const UserDataPlainOptional = t.Object(
  {
    name: t.Optional(
      t.String({ description: ``, additionalProperties: false }),
    ),
  },
  { description: `A user in the system`, additionalProperties: false },
);

export const UserDataRelationsOptional = t.Object(
  {},
  { description: `A user in the system`, additionalProperties: false },
);

export const UserDataOptional = t.Composite(
  [UserDataPlainOptional, UserDataRelationsOptional],
  {
    description: `Composition of UserDataPlainOptional, UserDataRelationsOptional`,
    additionalProperties: false,
  },
);
