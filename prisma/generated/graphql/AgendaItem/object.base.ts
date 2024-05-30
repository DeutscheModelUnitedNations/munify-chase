import * as Inputs from '../inputs';
import { builder } from '../../../../src/resolvers/builder';
import {
  definePrismaObject,
  defineFieldObject,
  defineRelationFunction,
  defineRelationObject,
} from '../utils';

export const AgendaItemObject = definePrismaObject('AgendaItem', {
  description: 'An agenda item in a committee. This is a topic of discussion in a committee.',
  findUnique: ({ id }) => ({ id }),
  fields: (t) => ({
    id: t.field(AgendaItemIdFieldObject),
    committee: t.relation('committee', AgendaItemCommitteeFieldObject),
    committeeId: t.field(AgendaItemCommitteeIdFieldObject),
    title: t.field(AgendaItemTitleFieldObject),
    description: t.field(AgendaItemDescriptionFieldObject),
    speakerLists: t.relation('speakerLists', AgendaItemSpeakerListsFieldObject(t)),
    isActive: t.field(AgendaItemIsActiveFieldObject),
  }),
});

export const AgendaItemIdFieldObject = defineFieldObject('AgendaItem', {
  type: "ID",
  description: undefined,
  nullable: false,
  resolve: (parent) => String(parent.id),
});

export const AgendaItemCommitteeFieldObject = defineRelationObject('AgendaItem', 'committee', {
  description: undefined,
  nullable: false,
  args: undefined,
  query: undefined,
});

export const AgendaItemCommitteeIdFieldObject = defineFieldObject('AgendaItem', {
  type: "String",
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.committeeId,
});

export const AgendaItemTitleFieldObject = defineFieldObject('AgendaItem', {
  type: "String",
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.title,
});

export const AgendaItemDescriptionFieldObject = defineFieldObject('AgendaItem', {
  type: "String",
  description: undefined,
  nullable: true,
  resolve: (parent) => parent.description,
});

export const AgendaItemSpeakerListsFieldArgs = builder.args((t) => ({
  where: t.field({ type: Inputs.SpeakersListWhereInput, required: false }),
  orderBy: t.field({ type: [Inputs.SpeakersListOrderByWithRelationInput], required: false }),
  cursor: t.field({ type: Inputs.SpeakersListWhereUniqueInput, required: false }),
  take: t.field({ type: 'Int', required: false }),
  skip: t.field({ type: 'Int', required: false }),
  distinct: t.field({ type: [Inputs.SpeakersListScalarFieldEnum], required: false }),
}))

export const AgendaItemSpeakerListsFieldObject = defineRelationFunction('AgendaItem', (t) =>
  defineRelationObject('AgendaItem', 'speakerLists', {
    description: undefined,
    nullable: false,
    args: AgendaItemSpeakerListsFieldArgs,
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

export const AgendaItemIsActiveFieldObject = defineFieldObject('AgendaItem', {
  type: "Boolean",
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.isActive,
});
