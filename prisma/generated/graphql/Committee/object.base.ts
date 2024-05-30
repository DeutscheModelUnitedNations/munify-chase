import * as Inputs from '../inputs';
import { builder } from '../../../../src/resolvers/builder';
import {
  definePrismaObject,
  defineFieldObject,
  defineRelationFunction,
  defineRelationObject,
} from '../utils';

export const CommitteeObject = definePrismaObject('Committee', {
  description: 'A committee in a conference',
  findUnique: ({ id }) => ({ id }),
  fields: (t) => ({
    id: t.field(CommitteeIdFieldObject),
    name: t.field(CommitteeNameFieldObject),
    abbreviation: t.field(CommitteeAbbreviationFieldObject),
    category: t.field(CommitteeCategoryFieldObject),
    conference: t.relation('conference', CommitteeConferenceFieldObject),
    conferenceId: t.field(CommitteeConferenceIdFieldObject),
    members: t.relation('members', CommitteeMembersFieldObject(t)),
    parent: t.relation('parent', CommitteeParentFieldObject),
    parentId: t.field(CommitteeParentIdFieldObject),
    subCommittees: t.relation('subCommittees', CommitteeSubCommitteesFieldObject(t)),
    messages: t.relation('messages', CommitteeMessagesFieldObject(t)),
    agendaItems: t.relation('agendaItems', CommitteeAgendaItemsFieldObject(t)),
    whiteboardContent: t.field(CommitteeWhiteboardContentFieldObject),
    status: t.field(CommitteeStatusFieldObject),
    stateOfDebate: t.field(CommitteeStateOfDebateFieldObject),
    statusHeadline: t.field(CommitteeStatusHeadlineFieldObject),
    statusUntil: t.field(CommitteeStatusUntilFieldObject),
    allowDelegationsToAddThemselvesToSpeakersList: t.field(CommitteeAllowDelegationsToAddThemselvesToSpeakersListFieldObject),
  }),
});

export const CommitteeIdFieldObject = defineFieldObject('Committee', {
  type: "ID",
  description: undefined,
  nullable: false,
  resolve: (parent) => String(parent.id),
});

export const CommitteeNameFieldObject = defineFieldObject('Committee', {
  type: "String",
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.name,
});

export const CommitteeAbbreviationFieldObject = defineFieldObject('Committee', {
  type: "String",
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.abbreviation,
});

export const CommitteeCategoryFieldObject = defineFieldObject('Committee', {
  type: Inputs.CommitteeCategory,
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.category,
});

export const CommitteeConferenceFieldObject = defineRelationObject('Committee', 'conference', {
  description: undefined,
  nullable: false,
  args: undefined,
  query: undefined,
});

export const CommitteeConferenceIdFieldObject = defineFieldObject('Committee', {
  type: "String",
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.conferenceId,
});

export const CommitteeMembersFieldArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.CommitteeMemberWhereInput, required: false }),
  orderBy: t.field({ type: [Inputs.CommitteeMemberOrderByWithRelationInput], required: false }),
  cursor: t.field({ type: Inputs.CommitteeMemberWhereUniqueInput, required: false }),
  take: t.field({ type: 'Int', required: false }),
  skip: t.field({ type: 'Int', required: false }),
  distinct: t.field({ type: [Inputs.CommitteeMemberScalarFieldEnum], required: false }),
}))

export const CommitteeMembersFieldObject = defineRelationFunction('Committee', (t) =>
  defineRelationObject('Committee', 'members', {
    description: undefined,
    nullable: false,
    args: CommitteeMembersFieldArgs,
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

export const CommitteeParentFieldObject = defineRelationObject('Committee', 'parent', {
  description: undefined,
  nullable: true,
  args: undefined,
  query: undefined,
});

export const CommitteeParentIdFieldObject = defineFieldObject('Committee', {
  type: "String",
  description: undefined,
  nullable: true,
  resolve: (parent) => parent.parentId,
});

export const CommitteeSubCommitteesFieldArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.CommitteeWhereInput, required: false }),
  orderBy: t.field({ type: [Inputs.CommitteeOrderByWithRelationInput], required: false }),
  cursor: t.field({ type: Inputs.CommitteeWhereUniqueInput, required: false }),
  take: t.field({ type: 'Int', required: false }),
  skip: t.field({ type: 'Int', required: false }),
  distinct: t.field({ type: [Inputs.CommitteeScalarFieldEnum], required: false }),
}))

export const CommitteeSubCommitteesFieldObject = defineRelationFunction('Committee', (t) =>
  defineRelationObject('Committee', 'subCommittees', {
    description: undefined,
    nullable: false,
    args: CommitteeSubCommitteesFieldArgs,
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

export const CommitteeMessagesFieldArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.MessageWhereInput, required: false }),
  orderBy: t.field({ type: [Inputs.MessageOrderByWithRelationInput], required: false }),
  cursor: t.field({ type: Inputs.MessageWhereUniqueInput, required: false }),
  take: t.field({ type: 'Int', required: false }),
  skip: t.field({ type: 'Int', required: false }),
  distinct: t.field({ type: [Inputs.MessageScalarFieldEnum], required: false }),
}))

export const CommitteeMessagesFieldObject = defineRelationFunction('Committee', (t) =>
  defineRelationObject('Committee', 'messages', {
    description: undefined,
    nullable: false,
    args: CommitteeMessagesFieldArgs,
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

export const CommitteeAgendaItemsFieldArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.AgendaItemWhereInput, required: false }),
  orderBy: t.field({ type: [Inputs.AgendaItemOrderByWithRelationInput], required: false }),
  cursor: t.field({ type: Inputs.AgendaItemWhereUniqueInput, required: false }),
  take: t.field({ type: 'Int', required: false }),
  skip: t.field({ type: 'Int', required: false }),
  distinct: t.field({ type: [Inputs.AgendaItemScalarFieldEnum], required: false }),
}))

export const CommitteeAgendaItemsFieldObject = defineRelationFunction('Committee', (t) =>
  defineRelationObject('Committee', 'agendaItems', {
    description: undefined,
    nullable: false,
    args: CommitteeAgendaItemsFieldArgs,
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

export const CommitteeWhiteboardContentFieldObject = defineFieldObject('Committee', {
  type: "String",
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.whiteboardContent,
});

export const CommitteeStatusFieldObject = defineFieldObject('Committee', {
  type: Inputs.CommitteeStatus,
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.status,
});

export const CommitteeStateOfDebateFieldObject = defineFieldObject('Committee', {
  type: "String",
  description: undefined,
  nullable: true,
  resolve: (parent) => parent.stateOfDebate,
});

export const CommitteeStatusHeadlineFieldObject = defineFieldObject('Committee', {
  type: "String",
  description: undefined,
  nullable: true,
  resolve: (parent) => parent.statusHeadline,
});

export const CommitteeStatusUntilFieldObject = defineFieldObject('Committee', {
  type: Inputs.DateTime,
  description: undefined,
  nullable: true,
  resolve: (parent) => parent.statusUntil,
});

export const CommitteeAllowDelegationsToAddThemselvesToSpeakersListFieldObject = defineFieldObject('Committee', {
  type: "Boolean",
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.allowDelegationsToAddThemselvesToSpeakersList,
});
