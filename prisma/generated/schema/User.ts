import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const UserPlain = t.Object(
  {
    id: t.String({ additionalProperties: false }),
    name: t.String({ additionalProperties: false }),
  },
  { additionalProperties: false, description: `A user in the system` },
);

export const UserRelations = t.Object(
  {
    conferenceMemberships: t.Array(
      t.Object(
        {
          id: t.String({ additionalProperties: false }),
          conferenceId: t.String({ additionalProperties: false }),
          userId: __nullable__(t.String({ additionalProperties: false })),
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
              additionalProperties: false,
              description: `The role of a user in a conference`,
            },
          ),
        },
        {
          additionalProperties: false,
          description: `A user's membership in a conference, providing them with a role in the conference`,
        },
      ),
    ),
    committeeMemberships: t.Array(
      t.Object(
        {
          id: t.String({ additionalProperties: false }),
          committeeId: t.String({ additionalProperties: false }),
          userId: __nullable__(t.String({ additionalProperties: false })),
          delegationId: __nullable__(t.String({ additionalProperties: false })),
          presence: t.Union(
            [t.Literal("PRESENT"), t.Literal("EXCUSED"), t.Literal("ABSENT")],
            {
              additionalProperties: false,
              description: `The presence status of a CommitteeMember`,
            },
          ),
        },
        {
          additionalProperties: false,
          description: `A user's membership in a committee, providing them with a role in the committee`,
        },
      ),
    ),
    messages: t.Array(
      t.Object(
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
          metaDelegation: __nullable__(
            t.String({ additionalProperties: false }),
          ),
          metaCommittee: __nullable__(
            t.String({ additionalProperties: false }),
          ),
          metaAgendaItem: __nullable__(
            t.String({ additionalProperties: false }),
          ),
        },
        { additionalProperties: false },
      ),
    ),
    emails: t.Array(
      t.Object(
        {
          email: t.String({ additionalProperties: false }),
          userId: t.String({ additionalProperties: false }),
          validated: t.Boolean({ additionalProperties: false }),
          validationTokenId: __nullable__(
            t.String({ additionalProperties: false }),
          ),
        },
        { additionalProperties: false },
      ),
    ),
    passwords: t.Array(
      t.Object(
        {
          id: t.String({ additionalProperties: false }),
          userId: t.String({ additionalProperties: false }),
        },
        { additionalProperties: false },
      ),
    ),
    pendingCredentialCreationTasks: t.Array(
      t.Object(
        {
          id: t.String({ additionalProperties: false }),
          userId: t.String({ additionalProperties: false }),
          tokenId: t.String({ additionalProperties: false }),
        },
        { additionalProperties: false },
      ),
    ),
  },
  { additionalProperties: false, description: `A user in the system` },
);

export const UserPlainInputCreate = t.Object(
  { name: t.String({ additionalProperties: false }) },
  { additionalProperties: false, description: `A user in the system` },
);

export const UserPlainInputUpdate = t.Object(
  { name: t.Optional(t.String({ additionalProperties: false })) },
  { additionalProperties: false, description: `A user in the system` },
);

export const UserRelationsInputCreate = t.Object(
  {
    conferenceMemberships: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
          ),
        },
        { additionalProperties: false },
      ),
    ),
    committeeMemberships: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
          ),
        },
        { additionalProperties: false },
      ),
    ),
    messages: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
          ),
        },
        { additionalProperties: false },
      ),
    ),
    emails: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
          ),
        },
        { additionalProperties: false },
      ),
    ),
    passwords: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
          ),
        },
        { additionalProperties: false },
      ),
    ),
    pendingCredentialCreationTasks: t.Optional(
      t.Object(
        {
          connect: t.Array(
            t.Object(
              {
                id: t.String({ additionalProperties: false }),
              },
              { additionalProperties: false },
            ),
          ),
        },
        { additionalProperties: false },
      ),
    ),
  },
  { additionalProperties: false, description: `A user in the system` },
);

export const UserRelationsInputUpdate = t.Partial(
  t.Object(
    {
      conferenceMemberships: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
            ),
          },
          { additionalProperties: false },
        ),
        { additionalProperties: false },
      ),
      committeeMemberships: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
            ),
          },
          { additionalProperties: false },
        ),
        { additionalProperties: false },
      ),
      messages: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
            ),
          },
          { additionalProperties: false },
        ),
        { additionalProperties: false },
      ),
      emails: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
            ),
          },
          { additionalProperties: false },
        ),
        { additionalProperties: false },
      ),
      passwords: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
            ),
          },
          { additionalProperties: false },
        ),
        { additionalProperties: false },
      ),
      pendingCredentialCreationTasks: t.Partial(
        t.Object(
          {
            connect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
            ),
            disconnect: t.Array(
              t.Object(
                {
                  id: t.String({ additionalProperties: false }),
                },
                { additionalProperties: false },
              ),
            ),
          },
          { additionalProperties: false },
        ),
        { additionalProperties: false },
      ),
    },
    { additionalProperties: false, description: `A user in the system` },
  ),
  { additionalProperties: false },
);

export const UserWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self)]),
          NOT: t.Union([Self, t.Array(Self)]),
          OR: t.Array(Self),
          id: t.String(),
          name: t.String(),
        },
        { description: `A user in the system` },
      ),
    { $id: "User" },
  ),
  { additionalProperties: false },
);

export const UserWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect([
      t.Partial(
        t.Object({ id: t.String() }, { description: `A user in the system` }),
      ),
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
          { id: t.String(), name: t.String() },
          { additionalProperties: false },
        ),
        { additionalProperties: false },
      ),
    ]),
  { $id: "User" },
);

export const UserSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      name: t.Boolean(),
      conferenceMemberships: t.Boolean(),
      committeeMemberships: t.Boolean(),
      messages: t.Boolean(),
      emails: t.Boolean(),
      passwords: t.Boolean(),
      pendingCredentialCreationTasks: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false, description: `A user in the system` },
  ),
  { additionalProperties: false },
);

export const UserInclude = t.Partial(
  t.Object(
    {
      conferenceMemberships: t.Boolean(),
      committeeMemberships: t.Boolean(),
      messages: t.Boolean(),
      emails: t.Boolean(),
      passwords: t.Boolean(),
      pendingCredentialCreationTasks: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false, description: `A user in the system` },
  ),
  { additionalProperties: false },
);

export const UserOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")]),
      name: t.Union([t.Literal("asc"), t.Literal("desc")]),
    },
    { additionalProperties: false, description: `A user in the system` },
  ),
  { additionalProperties: false },
);

export const User = t.Composite([UserPlain, UserRelations], {
  additionalProperties: false,
});

export const UserInputCreate = t.Composite(
  [UserPlainInputCreate, UserRelationsInputCreate],
  { additionalProperties: false },
);

export const UserInputUpdate = t.Composite(
  [UserPlainInputUpdate, UserRelationsInputUpdate],
  { additionalProperties: false },
);
