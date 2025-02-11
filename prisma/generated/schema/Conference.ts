import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ConferencePlain = t.Object(
  {
    id: t.String({ additionalProperties: false }),
    name: t.String({ additionalProperties: false }),
    start: __nullable__(t.Date({ additionalProperties: false })),
    end: __nullable__(t.Date({ additionalProperties: false })),
    pressWebsite: __nullable__(t.String({ additionalProperties: false })),
    feedbackWebsite: __nullable__(t.String({ additionalProperties: false })),
  },
  { additionalProperties: false, description: `A conference in the system` },
);

export const ConferenceRelations = t.Object(
  {
    committees: t.Array(
      t.Object(
        {
          id: t.String({ additionalProperties: false }),
          name: t.String({ additionalProperties: false }),
          abbreviation: t.String({ additionalProperties: false }),
          category: t.Union(
            [t.Literal("COMMITTEE"), t.Literal("CRISIS"), t.Literal("ICJ")],
            {
              additionalProperties: false,
              description: `The type of a committee in a conference`,
            },
          ),
          conferenceId: t.String({ additionalProperties: false }),
          parentId: __nullable__(t.String({ additionalProperties: false })),
          whiteboardContent: t.String({ additionalProperties: false }),
          status: t.Union(
            [
              t.Literal("FORMAL"),
              t.Literal("INFORMAL"),
              t.Literal("PAUSE"),
              t.Literal("SUSPENSION"),
              t.Literal("CLOSED"),
            ],
            { additionalProperties: false },
          ),
          stateOfDebate: __nullable__(
            t.String({ additionalProperties: false }),
          ),
          statusHeadline: __nullable__(
            t.String({ additionalProperties: false }),
          ),
          statusUntil: __nullable__(t.Date({ additionalProperties: false })),
          allowDelegationsToAddThemselvesToSpeakersList: t.Boolean({
            additionalProperties: false,
          }),
        },
        {
          additionalProperties: false,
          description: `A committee in a conference`,
        },
      ),
    ),
    delegations: t.Array(
      t.Object(
        {
          id: t.String({ additionalProperties: false }),
          conferenceId: t.String({ additionalProperties: false }),
          nationId: t.String({ additionalProperties: false }),
        },
        { additionalProperties: false },
      ),
    ),
    members: t.Array(
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
  },
  { additionalProperties: false, description: `A conference in the system` },
);

export const ConferencePlainInputCreate = t.Object(
  {
    name: t.String({ additionalProperties: false }),
    start: __nullable__(t.Date({ additionalProperties: false })),
    end: __nullable__(t.Date({ additionalProperties: false })),
    pressWebsite: __nullable__(t.String({ additionalProperties: false })),
    feedbackWebsite: __nullable__(t.String({ additionalProperties: false })),
  },
  { additionalProperties: false, description: `A conference in the system` },
);

export const ConferencePlainInputUpdate = t.Object(
  {
    name: t.Optional(t.String({ additionalProperties: false })),
    start: t.Optional(__nullable__(t.Date({ additionalProperties: false }))),
    end: t.Optional(__nullable__(t.Date({ additionalProperties: false }))),
    pressWebsite: t.Optional(
      __nullable__(t.String({ additionalProperties: false })),
    ),
    feedbackWebsite: t.Optional(
      __nullable__(t.String({ additionalProperties: false })),
    ),
  },
  { additionalProperties: false, description: `A conference in the system` },
);

export const ConferenceRelationsInputCreate = t.Object(
  {
    committees: t.Optional(
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
    delegations: t.Optional(
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
    members: t.Optional(
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
  { additionalProperties: false, description: `A conference in the system` },
);

export const ConferenceRelationsInputUpdate = t.Partial(
  t.Object(
    {
      committees: t.Partial(
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
      delegations: t.Partial(
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
      members: t.Partial(
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
    { additionalProperties: false, description: `A conference in the system` },
  ),
  { additionalProperties: false },
);

export const ConferenceWhere = t.Partial(
  t.Recursive(
    (Self) =>
      t.Object(
        {
          AND: t.Union([Self, t.Array(Self)]),
          NOT: t.Union([Self, t.Array(Self)]),
          OR: t.Array(Self),
          id: t.String(),
          name: t.String(),
          start: t.Date(),
          end: t.Date(),
          pressWebsite: t.String(),
          feedbackWebsite: t.String(),
        },
        { description: `A conference in the system` },
      ),
    { $id: "Conference" },
  ),
  { additionalProperties: false },
);

export const ConferenceWhereUnique = t.Recursive(
  (Self) =>
    t.Intersect([
      t.Partial(
        t.Object(
          { id: t.String(), name: t.String() },
          { description: `A conference in the system` },
        ),
      ),
      t.Union([t.Object({ id: t.String() }), t.Object({ name: t.String() })]),
      t.Partial(
        t.Object({
          AND: t.Union([Self, t.Array(Self)]),
          NOT: t.Union([Self, t.Array(Self)]),
          OR: t.Array(Self),
        }),
      ),
      t.Partial(
        t.Object(
          {
            id: t.String(),
            name: t.String(),
            start: t.Date(),
            end: t.Date(),
            pressWebsite: t.String(),
            feedbackWebsite: t.String(),
          },
          { additionalProperties: false },
        ),
        { additionalProperties: false },
      ),
    ]),
  { $id: "Conference" },
);

export const ConferenceSelect = t.Partial(
  t.Object(
    {
      id: t.Boolean(),
      name: t.Boolean(),
      committees: t.Boolean(),
      start: t.Boolean(),
      end: t.Boolean(),
      pressWebsite: t.Boolean(),
      feedbackWebsite: t.Boolean(),
      delegations: t.Boolean(),
      members: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false, description: `A conference in the system` },
  ),
  { additionalProperties: false },
);

export const ConferenceInclude = t.Partial(
  t.Object(
    {
      committees: t.Boolean(),
      delegations: t.Boolean(),
      members: t.Boolean(),
      _count: t.Boolean(),
    },
    { additionalProperties: false, description: `A conference in the system` },
  ),
  { additionalProperties: false },
);

export const ConferenceOrderBy = t.Partial(
  t.Object(
    {
      id: t.Union([t.Literal("asc"), t.Literal("desc")]),
      name: t.Union([t.Literal("asc"), t.Literal("desc")]),
      start: t.Union([t.Literal("asc"), t.Literal("desc")]),
      end: t.Union([t.Literal("asc"), t.Literal("desc")]),
      pressWebsite: t.Union([t.Literal("asc"), t.Literal("desc")]),
      feedbackWebsite: t.Union([t.Literal("asc"), t.Literal("desc")]),
    },
    { additionalProperties: false, description: `A conference in the system` },
  ),
  { additionalProperties: false },
);

export const Conference = t.Composite([ConferencePlain, ConferenceRelations], {
  additionalProperties: false,
});

export const ConferenceInputCreate = t.Composite(
  [ConferencePlainInputCreate, ConferenceRelationsInputCreate],
  { additionalProperties: false },
);

export const ConferenceInputUpdate = t.Composite(
  [ConferencePlainInputUpdate, ConferenceRelationsInputUpdate],
  { additionalProperties: false },
);
