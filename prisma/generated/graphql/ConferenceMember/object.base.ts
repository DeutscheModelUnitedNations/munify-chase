import * as Inputs from "../inputs";
import {
  definePrismaObject,
  defineFieldObject,
  defineRelationObject,
} from "../utils";

export const ConferenceMemberObject = definePrismaObject("ConferenceMember", {
  description:
    "A users membership in a conference, providing them with a role in the conference",
  findUnique: ({ id }) => ({ id }),
  fields: (t) => ({
    id: t.field(ConferenceMemberIdFieldObject),
    conference: t.relation("conference", ConferenceMemberConferenceFieldObject),
    conferenceId: t.field(ConferenceMemberConferenceIdFieldObject),
    user: t.relation("user", ConferenceMemberUserFieldObject),
    userId: t.field(ConferenceMemberUserIdFieldObject),
    role: t.field(ConferenceMemberRoleFieldObject),
  }),
});

export const ConferenceMemberIdFieldObject = defineFieldObject(
  "ConferenceMember",
  {
    type: "ID",
    description: undefined,
    nullable: false,
    resolve: (parent) => String(parent.id),
  },
);

export const ConferenceMemberConferenceFieldObject = defineRelationObject(
  "ConferenceMember",
  "conference",
  {
    description: undefined,
    nullable: false,
    args: undefined,
    query: undefined,
  },
);

export const ConferenceMemberConferenceIdFieldObject = defineFieldObject(
  "ConferenceMember",
  {
    type: "String",
    description: undefined,
    nullable: false,
    resolve: (parent) => parent.conferenceId,
  },
);

export const ConferenceMemberUserFieldObject = defineRelationObject(
  "ConferenceMember",
  "user",
  {
    description: undefined,
    nullable: true,
    args: undefined,
    query: undefined,
  },
);

export const ConferenceMemberUserIdFieldObject = defineFieldObject(
  "ConferenceMember",
  {
    type: "String",
    description: undefined,
    nullable: true,
    resolve: (parent) => parent.userId,
  },
);

export const ConferenceMemberRoleFieldObject = defineFieldObject(
  "ConferenceMember",
  {
    type: Inputs.ConferenceRole,
    description: undefined,
    nullable: false,
    resolve: (parent) => parent.role,
  },
);
