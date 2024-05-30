import * as Inputs from "../inputs";
import { builder } from "../../../../src/resolvers/builder";
import {
  definePrismaObject,
  defineFieldObject,
  defineRelationFunction,
  defineRelationObject,
} from "../utils";

export const UserObject = definePrismaObject("User", {
  description: "A user in the system",
  findUnique: ({ id }) => ({ id }),
  fields: (t) => ({
    id: t.field(UserIdFieldObject),
    conferenceMemberships: t.relation(
      "conferenceMemberships",
      UserConferenceMembershipsFieldObject(t),
    ),
    committeeMemberships: t.relation(
      "committeeMemberships",
      UserCommitteeMembershipsFieldObject(t),
    ),
    messages: t.relation("messages", UserMessagesFieldObject(t)),
  }),
});

export const UserIdFieldObject = defineFieldObject("User", {
  type: "ID",
  description: undefined,
  nullable: false,
  resolve: (parent) => String(parent.id),
});

export const UserConferenceMembershipsFieldArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.ConferenceMemberWhereInput, required: false }),
  orderBy: t.field({
    type: [Inputs.ConferenceMemberOrderByWithRelationInput],
    required: false,
  }),
  cursor: t.field({
    type: Inputs.ConferenceMemberWhereUniqueInput,
    required: false,
  }),
  take: t.field({ type: "Int", required: false }),
  skip: t.field({ type: "Int", required: false }),
  distinct: t.field({
    type: [Inputs.ConferenceMemberScalarFieldEnum],
    required: false,
  }),
}));

export const UserConferenceMembershipsFieldObject = defineRelationFunction(
  "User",
  (t) =>
    defineRelationObject("User", "conferenceMemberships", {
      description: undefined,
      nullable: false,
      args: UserConferenceMembershipsFieldArgs,
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

export const UserCommitteeMembershipsFieldArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.CommitteeMemberWhereInput, required: false }),
  orderBy: t.field({
    type: [Inputs.CommitteeMemberOrderByWithRelationInput],
    required: false,
  }),
  cursor: t.field({
    type: Inputs.CommitteeMemberWhereUniqueInput,
    required: false,
  }),
  take: t.field({ type: "Int", required: false }),
  skip: t.field({ type: "Int", required: false }),
  distinct: t.field({
    type: [Inputs.CommitteeMemberScalarFieldEnum],
    required: false,
  }),
}));

export const UserCommitteeMembershipsFieldObject = defineRelationFunction(
  "User",
  (t) =>
    defineRelationObject("User", "committeeMemberships", {
      description: undefined,
      nullable: false,
      args: UserCommitteeMembershipsFieldArgs,
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

export const UserMessagesFieldArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.MessageWhereInput, required: false }),
  orderBy: t.field({
    type: [Inputs.MessageOrderByWithRelationInput],
    required: false,
  }),
  cursor: t.field({ type: Inputs.MessageWhereUniqueInput, required: false }),
  take: t.field({ type: "Int", required: false }),
  skip: t.field({ type: "Int", required: false }),
  distinct: t.field({ type: [Inputs.MessageScalarFieldEnum], required: false }),
}));

export const UserMessagesFieldObject = defineRelationFunction("User", (t) =>
  defineRelationObject("User", "messages", {
    description: undefined,
    nullable: false,
    args: UserMessagesFieldArgs,
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
