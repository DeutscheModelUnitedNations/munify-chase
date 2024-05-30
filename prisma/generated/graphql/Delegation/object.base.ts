import * as Inputs from '../inputs';
import { builder } from '../../../../src/resolvers/builder';
import {
  definePrismaObject,
  defineFieldObject,
  defineRelationFunction,
  defineRelationObject,
} from '../utils';

export const DelegationObject = definePrismaObject('Delegation', {
  description: undefined,
  findUnique: ({ id }) => ({ id }),
  fields: (t) => ({
    id: t.field(DelegationIdFieldObject),
    conference: t.relation('conference', DelegationConferenceFieldObject),
    conferenceId: t.field(DelegationConferenceIdFieldObject),
    nation: t.relation('nation', DelegationNationFieldObject),
    nationId: t.field(DelegationNationIdFieldObject),
    members: t.relation('members', DelegationMembersFieldObject(t)),
  }),
});

export const DelegationIdFieldObject = defineFieldObject('Delegation', {
  type: "ID",
  description: undefined,
  nullable: false,
  resolve: (parent) => String(parent.id),
});

export const DelegationConferenceFieldObject = defineRelationObject('Delegation', 'conference', {
  description: undefined,
  nullable: false,
  args: undefined,
  query: undefined,
});

export const DelegationConferenceIdFieldObject = defineFieldObject('Delegation', {
  type: "String",
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.conferenceId,
});

export const DelegationNationFieldObject = defineRelationObject('Delegation', 'nation', {
  description: undefined,
  nullable: false,
  args: undefined,
  query: undefined,
});

export const DelegationNationIdFieldObject = defineFieldObject('Delegation', {
  type: "String",
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.nationId,
});

export const DelegationMembersFieldArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.CommitteeMemberWhereInput, required: false }),
  orderBy: t.field({ type: [Inputs.CommitteeMemberOrderByWithRelationInput], required: false }),
  cursor: t.field({ type: Inputs.CommitteeMemberWhereUniqueInput, required: false }),
  take: t.field({ type: 'Int', required: false }),
  skip: t.field({ type: 'Int', required: false }),
  distinct: t.field({ type: [Inputs.CommitteeMemberScalarFieldEnum], required: false }),
}))

export const DelegationMembersFieldObject = defineRelationFunction('Delegation', (t) =>
  defineRelationObject('Delegation', 'members', {
    description: undefined,
    nullable: false,
    args: DelegationMembersFieldArgs,
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
