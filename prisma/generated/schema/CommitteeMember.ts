import { t } from "elysia";

import { _Nullable } from "./__nullable__";

export const CommitteeMemberPlain = t.Object(
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
);

export const CommitteeMemberRelations = t.Object(
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
    user: _Nullable(
      t.Object(
        {
          id: t.String({ description: ``, additionalProperties: false }),
          name: t.String({ description: ``, additionalProperties: false }),
        },
        { description: `A user in the system`, additionalProperties: false },
      ),
    ),
    speakerLists: t.Array(
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
    delegation: _Nullable(
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
  },
  {
    description: `A user's membership in a committee, providing them with a role in the committee`,
    additionalProperties: false,
  },
);

export const CommitteeMember = t.Composite(
  [CommitteeMemberPlain, CommitteeMemberRelations],
  {
    description: `Composition of CommitteeMemberPlain, CommitteeMemberRelations`,
    additionalProperties: false,
  },
);

export const CommitteeMemberWhere = t.Union([
  t.Composite([
    t.Pick(
      t.Required(
        t.Composite([
          t.Object({
            committeeId_delegationId: t.Object(
              {
                committeeId: t.String({
                  description: ``,
                  additionalProperties: false,
                }),
                delegationId: t.Optional(
                  _Nullable(
                    t.String({ description: ``, additionalProperties: false }),
                  ),
                ),
              },
              { description: ``, additionalProperties: false },
            ),
            committeeId_userId: t.Object(
              {
                committeeId: t.String({
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
          t.Pick(CommitteeMemberPlain, ["id"]),
        ]),
      ),
      ["id"],
    ),
    t.Omit(
      t.Partial(
        t.Composite([
          t.Object({
            committeeId_delegationId: t.Object(
              {
                committeeId: t.String({
                  description: ``,
                  additionalProperties: false,
                }),
                delegationId: t.Optional(
                  _Nullable(
                    t.String({ description: ``, additionalProperties: false }),
                  ),
                ),
              },
              { description: ``, additionalProperties: false },
            ),
            committeeId_userId: t.Object(
              {
                committeeId: t.String({
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
          t.Pick(CommitteeMemberPlain, ["id"]),
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
            committeeId_delegationId: t.Object(
              {
                committeeId: t.String({
                  description: ``,
                  additionalProperties: false,
                }),
                delegationId: t.Optional(
                  _Nullable(
                    t.String({ description: ``, additionalProperties: false }),
                  ),
                ),
              },
              { description: ``, additionalProperties: false },
            ),
            committeeId_userId: t.Object(
              {
                committeeId: t.String({
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
          t.Pick(CommitteeMemberPlain, ["id"]),
        ]),
      ),
      ["committeeId_delegationId"],
    ),
    t.Omit(
      t.Partial(
        t.Composite([
          t.Object({
            committeeId_delegationId: t.Object(
              {
                committeeId: t.String({
                  description: ``,
                  additionalProperties: false,
                }),
                delegationId: t.Optional(
                  _Nullable(
                    t.String({ description: ``, additionalProperties: false }),
                  ),
                ),
              },
              { description: ``, additionalProperties: false },
            ),
            committeeId_userId: t.Object(
              {
                committeeId: t.String({
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
          t.Pick(CommitteeMemberPlain, ["id"]),
        ]),
      ),
      ["committeeId_delegationId"],
    ),
  ]),
  t.Composite([
    t.Pick(
      t.Required(
        t.Composite([
          t.Object({
            committeeId_delegationId: t.Object(
              {
                committeeId: t.String({
                  description: ``,
                  additionalProperties: false,
                }),
                delegationId: t.Optional(
                  _Nullable(
                    t.String({ description: ``, additionalProperties: false }),
                  ),
                ),
              },
              { description: ``, additionalProperties: false },
            ),
            committeeId_userId: t.Object(
              {
                committeeId: t.String({
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
          t.Pick(CommitteeMemberPlain, ["id"]),
        ]),
      ),
      ["committeeId_userId"],
    ),
    t.Omit(
      t.Partial(
        t.Composite([
          t.Object({
            committeeId_delegationId: t.Object(
              {
                committeeId: t.String({
                  description: ``,
                  additionalProperties: false,
                }),
                delegationId: t.Optional(
                  _Nullable(
                    t.String({ description: ``, additionalProperties: false }),
                  ),
                ),
              },
              { description: ``, additionalProperties: false },
            ),
            committeeId_userId: t.Object(
              {
                committeeId: t.String({
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
          t.Pick(CommitteeMemberPlain, ["id"]),
        ]),
      ),
      ["committeeId_userId"],
    ),
  ]),
]);

export const CommitteeMemberDataPlain = t.Object(
  {
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
);

export const CommitteeMemberDataRelations = t.Object(
  {
    committeeId: t.String({ description: ``, additionalProperties: false }),
    userId: t.Optional(
      _Nullable(t.String({ description: ``, additionalProperties: false })),
    ),
    delegationId: t.Optional(
      _Nullable(t.String({ description: ``, additionalProperties: false })),
    ),
  },
  {
    description: `A user's membership in a committee, providing them with a role in the committee`,
    additionalProperties: false,
  },
);

export const CommitteeMemberData = t.Composite(
  [CommitteeMemberDataPlain, CommitteeMemberDataRelations],
  {
    description: `Composition of CommitteeMemberDataPlain, CommitteeMemberDataRelations`,
    additionalProperties: false,
  },
);

export const CommitteeMemberDataPlainOptional = t.Object(
  {
    presence: t.Optional(
      t.Union(
        [t.Literal("PRESENT"), t.Literal("EXCUSED"), t.Literal("ABSENT")],
        {
          description: `The presence status of a CommitteeMember`,
          additionalProperties: false,
        },
      ),
    ),
  },
  {
    description: `A user's membership in a committee, providing them with a role in the committee`,
    additionalProperties: false,
  },
);

export const CommitteeMemberDataRelationsOptional = t.Object(
  {
    committeeId: t.Optional(
      t.String({ description: ``, additionalProperties: false }),
    ),
    userId: t.Optional(
      _Nullable(t.String({ description: ``, additionalProperties: false })),
    ),
    delegationId: t.Optional(
      _Nullable(t.String({ description: ``, additionalProperties: false })),
    ),
  },
  {
    description: `A user's membership in a committee, providing them with a role in the committee`,
    additionalProperties: false,
  },
);

export const CommitteeMemberDataOptional = t.Composite(
  [CommitteeMemberDataPlainOptional, CommitteeMemberDataRelationsOptional],
  {
    description: `Composition of CommitteeMemberDataPlainOptional, CommitteeMemberDataRelationsOptional`,
    additionalProperties: false,
  },
);
