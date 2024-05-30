import * as Inputs from "../inputs";
import { builder } from "../../../../src/resolvers/builder";
import {
  definePrismaObject,
  defineFieldObject,
  defineRelationFunction,
  defineRelationObject,
} from "../utils";

export const CommitteeMemberObject = definePrismaObject("CommitteeMember", {
  description:
    "A users membership in a committee, providing them with a role in the committee",
  findUnique: ({ id }) => ({ id }),
  fields: (t) => ({
    id: t.field(CommitteeMemberIdFieldObject),
    committee: t.relation("committee", CommitteeMemberCommitteeFieldObject),
    committeeId: t.field(CommitteeMemberCommitteeIdFieldObject),
    user: t.relation("user", CommitteeMemberUserFieldObject),
    userId: t.field(CommitteeMemberUserIdFieldObject),
    speakerLists: t.relation(
      "speakerLists",
      CommitteeMemberSpeakerListsFieldObject(t),
    ),
    delegation: t.relation("delegation", CommitteeMemberDelegationFieldObject),
    delegationId: t.field(CommitteeMemberDelegationIdFieldObject),
    presence: t.field(CommitteeMemberPresenceFieldObject),
  }),
});

export const CommitteeMemberIdFieldObject = defineFieldObject(
  "CommitteeMember",
  {
    type: "ID",
    description: undefined,
    nullable: false,
    resolve: (parent) => String(parent.id),
  },
);

export const CommitteeMemberCommitteeFieldObject = defineRelationObject(
  "CommitteeMember",
  "committee",
  {
    description: undefined,
    nullable: false,
    args: undefined,
    query: undefined,
  },
);

export const CommitteeMemberCommitteeIdFieldObject = defineFieldObject(
  "CommitteeMember",
  {
    type: "String",
    description: undefined,
    nullable: false,
    resolve: (parent) => parent.committeeId,
  },
);

export const CommitteeMemberUserFieldObject = defineRelationObject(
  "CommitteeMember",
  "user",
  {
    description: undefined,
    nullable: true,
    args: undefined,
    query: undefined,
  },
);

export const CommitteeMemberUserIdFieldObject = defineFieldObject(
  "CommitteeMember",
  {
    type: "String",
    description: undefined,
    nullable: true,
    resolve: (parent) => parent.userId,
  },
);

export const CommitteeMemberSpeakerListsFieldArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.SpeakerOnListWhereInput, required: false }),
  orderBy: t.field({
    type: [Inputs.SpeakerOnListOrderByWithRelationInput],
    required: false,
  }),
  cursor: t.field({
    type: Inputs.SpeakerOnListWhereUniqueInput,
    required: false,
  }),
  take: t.field({ type: "Int", required: false }),
  skip: t.field({ type: "Int", required: false }),
  distinct: t.field({
    type: [Inputs.SpeakerOnListScalarFieldEnum],
    required: false,
  }),
}));

export const CommitteeMemberSpeakerListsFieldObject = defineRelationFunction(
  "CommitteeMember",
  (t) =>
    defineRelationObject("CommitteeMember", "speakerLists", {
      description: undefined,
      nullable: false,
      args: CommitteeMemberSpeakerListsFieldArgs,
      query: (args) => ({
        where: args.where || undefined,
        cursor: args.cursor || undefined,
        take: args.take || undefined,
        distinct: args.distinct || undefined,
        skip: args.skip || undefined,
        orderBy: args.orderBy || undefined,
      }),
    }),
);

export const CommitteeMemberDelegationFieldObject = defineRelationObject(
  "CommitteeMember",
  "delegation",
  {
    description: undefined,
    nullable: true,
    args: undefined,
    query: undefined,
  },
);

export const CommitteeMemberDelegationIdFieldObject = defineFieldObject(
  "CommitteeMember",
  {
    type: "String",
    description: undefined,
    nullable: true,
    resolve: (parent) => parent.delegationId,
  },
);

export const CommitteeMemberPresenceFieldObject = defineFieldObject(
  "CommitteeMember",
  {
    type: Inputs.Presence,
    description: undefined,
    nullable: false,
    resolve: (parent) => parent.presence,
  },
);
