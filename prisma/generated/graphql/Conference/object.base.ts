import * as Inputs from '../inputs';
import { builder } from '../../../../src/resolvers/builder';
import {
  definePrismaObject,
  defineFieldObject,
  defineRelationFunction,
  defineRelationObject,
} from '../utils';

export const ConferenceObject = definePrismaObject('Conference', {
  description: 'A conference in the system',
  findUnique: ({ id }) => ({ id }),
  fields: (t) => ({
    id: t.field(ConferenceIdFieldObject),
    name: t.field(ConferenceNameFieldObject),
    start: t.field(ConferenceStartFieldObject),
    end: t.field(ConferenceEndFieldObject),
    pressWebsite: t.field(ConferencePressWebsiteFieldObject),
    feedbackWebsite: t.field(ConferenceFeedbackWebsiteFieldObject),
    delegations: t.relation('delegations', ConferenceDelegationsFieldObject(t)),
    members: t.relation('members', ConferenceMembersFieldObject(t)),
    committees: t.relation('committees', ConferenceCommitteesFieldObject(t)),
  }),
});

export const ConferenceIdFieldObject = defineFieldObject('Conference', {
  type: "ID",
  description: undefined,
  nullable: false,
  resolve: (parent) => String(parent.id),
});

export const ConferenceNameFieldObject = defineFieldObject('Conference', {
  type: "String",
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.name,
});

export const ConferenceStartFieldObject = defineFieldObject('Conference', {
  type: Inputs.DateTime,
  description: undefined,
  nullable: true,
  resolve: (parent) => parent.start,
});

export const ConferenceEndFieldObject = defineFieldObject('Conference', {
  type: Inputs.DateTime,
  description: undefined,
  nullable: true,
  resolve: (parent) => parent.end,
});

export const ConferencePressWebsiteFieldObject = defineFieldObject('Conference', {
  type: "String",
  description: undefined,
  nullable: true,
  resolve: (parent) => parent.pressWebsite,
});

export const ConferenceFeedbackWebsiteFieldObject = defineFieldObject('Conference', {
  type: "String",
  description: undefined,
  nullable: true,
  resolve: (parent) => parent.feedbackWebsite,
});

export const ConferenceDelegationsFieldArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.DelegationWhereInput, required: false }),
  orderBy: t.field({ type: [Inputs.DelegationOrderByWithRelationInput], required: false }),
  cursor: t.field({ type: Inputs.DelegationWhereUniqueInput, required: false }),
  take: t.field({ type: 'Int', required: false }),
  skip: t.field({ type: 'Int', required: false }),
  distinct: t.field({ type: [Inputs.DelegationScalarFieldEnum], required: false }),
}))

export const ConferenceDelegationsFieldObject = defineRelationFunction('Conference', (t) =>
  defineRelationObject('Conference', 'delegations', {
    description: undefined,
    nullable: false,
    args: ConferenceDelegationsFieldArgs,
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

export const ConferenceMembersFieldArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.ConferenceMemberWhereInput, required: false }),
  orderBy: t.field({ type: [Inputs.ConferenceMemberOrderByWithRelationInput], required: false }),
  cursor: t.field({ type: Inputs.ConferenceMemberWhereUniqueInput, required: false }),
  take: t.field({ type: 'Int', required: false }),
  skip: t.field({ type: 'Int', required: false }),
  distinct: t.field({ type: [Inputs.ConferenceMemberScalarFieldEnum], required: false }),
}))

export const ConferenceMembersFieldObject = defineRelationFunction('Conference', (t) =>
  defineRelationObject('Conference', 'members', {
    description: undefined,
    nullable: false,
    args: ConferenceMembersFieldArgs,
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

export const ConferenceCommitteesFieldArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.CommitteeWhereInput, required: false }),
  orderBy: t.field({ type: [Inputs.CommitteeOrderByWithRelationInput], required: false }),
  cursor: t.field({ type: Inputs.CommitteeWhereUniqueInput, required: false }),
  take: t.field({ type: 'Int', required: false }),
  skip: t.field({ type: 'Int', required: false }),
  distinct: t.field({ type: [Inputs.CommitteeScalarFieldEnum], required: false }),
}))

export const ConferenceCommitteesFieldObject = defineRelationFunction('Conference', (t) =>
  defineRelationObject('Conference', 'committees', {
    description: undefined,
    nullable: false,
    args: ConferenceCommitteesFieldArgs,
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
