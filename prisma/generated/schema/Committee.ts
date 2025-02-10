import { t } from "elysia";

import { _Nullable } from "./__nullable__";

export const CommitteePlain = t.Object(
  {
    id: t.String({ description: ``, additionalProperties: false }),
    name: t.String({ description: ``, additionalProperties: false }),
    abbreviation: t.String({ description: ``, additionalProperties: false }),
    category: t.Union(
      [t.Literal("COMMITTEE"), t.Literal("CRISIS"), t.Literal("ICJ")],
      {
        description: `The type of a committee in a conference`,
        additionalProperties: false,
      },
    ),
    conferenceId: t.String({ description: ``, additionalProperties: false }),
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
  { description: `A committee in a conference`, additionalProperties: false },
);

export const CommitteeRelations = t.Object(
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
    members: t.Array(
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
    parent: _Nullable(
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
    subCommittees: t.Array(
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
    agendaItems: t.Array(
      t.Object(
        {
          id: t.String({ description: ``, additionalProperties: false }),
          committeeId: t.String({
            description: ``,
            additionalProperties: false,
          }),
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
    ),
  },
  { description: `A committee in a conference`, additionalProperties: false },
);

export const Committee = t.Composite([CommitteePlain, CommitteeRelations], {
  description: `Composition of CommitteePlain, CommitteeRelations`,
  additionalProperties: false,
});

export const CommitteeWhere = t.Union([
  t.Composite([
    t.Pick(
      t.Required(
        t.Composite([
          t.Object({
            name_conferenceId: t.Object(
              {
                name: t.String({
                  description: ``,
                  additionalProperties: false,
                }),
                conferenceId: t.String({
                  description: ``,
                  additionalProperties: false,
                }),
              },
              { description: ``, additionalProperties: false },
            ),
            abbreviation_conferenceId: t.Object(
              {
                abbreviation: t.String({
                  description: ``,
                  additionalProperties: false,
                }),
                conferenceId: t.String({
                  description: ``,
                  additionalProperties: false,
                }),
              },
              { description: ``, additionalProperties: false },
            ),
          }),
          t.Pick(CommitteePlain, ["id"]),
        ]),
      ),
      ["id"],
    ),
    t.Omit(
      t.Partial(
        t.Composite([
          t.Object({
            name_conferenceId: t.Object(
              {
                name: t.String({
                  description: ``,
                  additionalProperties: false,
                }),
                conferenceId: t.String({
                  description: ``,
                  additionalProperties: false,
                }),
              },
              { description: ``, additionalProperties: false },
            ),
            abbreviation_conferenceId: t.Object(
              {
                abbreviation: t.String({
                  description: ``,
                  additionalProperties: false,
                }),
                conferenceId: t.String({
                  description: ``,
                  additionalProperties: false,
                }),
              },
              { description: ``, additionalProperties: false },
            ),
          }),
          t.Pick(CommitteePlain, ["id"]),
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
            name_conferenceId: t.Object(
              {
                name: t.String({
                  description: ``,
                  additionalProperties: false,
                }),
                conferenceId: t.String({
                  description: ``,
                  additionalProperties: false,
                }),
              },
              { description: ``, additionalProperties: false },
            ),
            abbreviation_conferenceId: t.Object(
              {
                abbreviation: t.String({
                  description: ``,
                  additionalProperties: false,
                }),
                conferenceId: t.String({
                  description: ``,
                  additionalProperties: false,
                }),
              },
              { description: ``, additionalProperties: false },
            ),
          }),
          t.Pick(CommitteePlain, ["id"]),
        ]),
      ),
      ["name_conferenceId"],
    ),
    t.Omit(
      t.Partial(
        t.Composite([
          t.Object({
            name_conferenceId: t.Object(
              {
                name: t.String({
                  description: ``,
                  additionalProperties: false,
                }),
                conferenceId: t.String({
                  description: ``,
                  additionalProperties: false,
                }),
              },
              { description: ``, additionalProperties: false },
            ),
            abbreviation_conferenceId: t.Object(
              {
                abbreviation: t.String({
                  description: ``,
                  additionalProperties: false,
                }),
                conferenceId: t.String({
                  description: ``,
                  additionalProperties: false,
                }),
              },
              { description: ``, additionalProperties: false },
            ),
          }),
          t.Pick(CommitteePlain, ["id"]),
        ]),
      ),
      ["name_conferenceId"],
    ),
  ]),
  t.Composite([
    t.Pick(
      t.Required(
        t.Composite([
          t.Object({
            name_conferenceId: t.Object(
              {
                name: t.String({
                  description: ``,
                  additionalProperties: false,
                }),
                conferenceId: t.String({
                  description: ``,
                  additionalProperties: false,
                }),
              },
              { description: ``, additionalProperties: false },
            ),
            abbreviation_conferenceId: t.Object(
              {
                abbreviation: t.String({
                  description: ``,
                  additionalProperties: false,
                }),
                conferenceId: t.String({
                  description: ``,
                  additionalProperties: false,
                }),
              },
              { description: ``, additionalProperties: false },
            ),
          }),
          t.Pick(CommitteePlain, ["id"]),
        ]),
      ),
      ["abbreviation_conferenceId"],
    ),
    t.Omit(
      t.Partial(
        t.Composite([
          t.Object({
            name_conferenceId: t.Object(
              {
                name: t.String({
                  description: ``,
                  additionalProperties: false,
                }),
                conferenceId: t.String({
                  description: ``,
                  additionalProperties: false,
                }),
              },
              { description: ``, additionalProperties: false },
            ),
            abbreviation_conferenceId: t.Object(
              {
                abbreviation: t.String({
                  description: ``,
                  additionalProperties: false,
                }),
                conferenceId: t.String({
                  description: ``,
                  additionalProperties: false,
                }),
              },
              { description: ``, additionalProperties: false },
            ),
          }),
          t.Pick(CommitteePlain, ["id"]),
        ]),
      ),
      ["abbreviation_conferenceId"],
    ),
  ]),
]);

export const CommitteeDataPlain = t.Object(
  {
    name: t.String({ description: ``, additionalProperties: false }),
    abbreviation: t.String({ description: ``, additionalProperties: false }),
    category: t.Union(
      [t.Literal("COMMITTEE"), t.Literal("CRISIS"), t.Literal("ICJ")],
      {
        description: `The type of a committee in a conference`,
        additionalProperties: false,
      },
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
    stateOfDebate: t.Optional(
      _Nullable(t.String({ description: ``, additionalProperties: false })),
    ),
    statusHeadline: t.Optional(
      _Nullable(t.String({ description: ``, additionalProperties: false })),
    ),
    statusUntil: t.Optional(
      _Nullable(t.Date({ description: ``, additionalProperties: false })),
    ),
    allowDelegationsToAddThemselvesToSpeakersList: t.Boolean({
      description: ``,
      additionalProperties: false,
    }),
  },
  { description: `A committee in a conference`, additionalProperties: false },
);

export const CommitteeDataRelations = t.Object(
  {
    conferenceId: t.String({ description: ``, additionalProperties: false }),
    parentId: t.Optional(
      _Nullable(t.String({ description: ``, additionalProperties: false })),
    ),
  },
  { description: `A committee in a conference`, additionalProperties: false },
);

export const CommitteeData = t.Composite(
  [CommitteeDataPlain, CommitteeDataRelations],
  {
    description: `Composition of CommitteeDataPlain, CommitteeDataRelations`,
    additionalProperties: false,
  },
);

export const CommitteeDataPlainOptional = t.Object(
  {
    name: t.Optional(
      t.String({ description: ``, additionalProperties: false }),
    ),
    abbreviation: t.Optional(
      t.String({ description: ``, additionalProperties: false }),
    ),
    category: t.Optional(
      t.Union([t.Literal("COMMITTEE"), t.Literal("CRISIS"), t.Literal("ICJ")], {
        description: `The type of a committee in a conference`,
        additionalProperties: false,
      }),
    ),
    whiteboardContent: t.Optional(
      t.String({ description: ``, additionalProperties: false }),
    ),
    status: t.Optional(
      t.Union(
        [
          t.Literal("FORMAL"),
          t.Literal("INFORMAL"),
          t.Literal("PAUSE"),
          t.Literal("SUSPENSION"),
          t.Literal("CLOSED"),
        ],
        { description: ``, additionalProperties: false },
      ),
    ),
    stateOfDebate: t.Optional(
      _Nullable(t.String({ description: ``, additionalProperties: false })),
    ),
    statusHeadline: t.Optional(
      _Nullable(t.String({ description: ``, additionalProperties: false })),
    ),
    statusUntil: t.Optional(
      _Nullable(t.Date({ description: ``, additionalProperties: false })),
    ),
    allowDelegationsToAddThemselvesToSpeakersList: t.Optional(
      t.Boolean({ description: ``, additionalProperties: false }),
    ),
  },
  { description: `A committee in a conference`, additionalProperties: false },
);

export const CommitteeDataRelationsOptional = t.Object(
  {
    conferenceId: t.Optional(
      t.String({ description: ``, additionalProperties: false }),
    ),
    parentId: t.Optional(
      _Nullable(t.String({ description: ``, additionalProperties: false })),
    ),
  },
  { description: `A committee in a conference`, additionalProperties: false },
);

export const CommitteeDataOptional = t.Composite(
  [CommitteeDataPlainOptional, CommitteeDataRelationsOptional],
  {
    description: `Composition of CommitteeDataPlainOptional, CommitteeDataRelationsOptional`,
    additionalProperties: false,
  },
);
