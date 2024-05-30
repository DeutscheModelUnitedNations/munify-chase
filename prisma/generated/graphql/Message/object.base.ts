import * as Inputs from '../inputs';
import { builder } from '../../../../src/resolvers/builder';
import {
  definePrismaObject,
  defineFieldObject,
  defineRelationFunction,
  defineRelationObject,
} from '../utils';

export const MessageObject = definePrismaObject('Message', {
  description: undefined,
  findUnique: ({ id }) => ({ id }),
  fields: (t) => ({
    id: t.field(MessageIdFieldObject),
    subject: t.field(MessageSubjectFieldObject),
    category: t.field(MessageCategoryFieldObject),
    message: t.field(MessageMessageFieldObject),
    committee: t.relation('committee', MessageCommitteeFieldObject),
    committeeId: t.field(MessageCommitteeIdFieldObject),
    author: t.relation('author', MessageAuthorFieldObject),
    authorId: t.field(MessageAuthorIdFieldObject),
    timestamp: t.field(MessageTimestampFieldObject),
    status: t.field(MessageStatusFieldObject),
    forwarded: t.field(MessageForwardedFieldObject),
    metaEmail: t.field(MessageMetaEmailFieldObject),
    metaDelegation: t.field(MessageMetaDelegationFieldObject),
    metaCommittee: t.field(MessageMetaCommitteeFieldObject),
    metaAgendaItem: t.field(MessageMetaAgendaItemFieldObject),
  }),
});

export const MessageIdFieldObject = defineFieldObject('Message', {
  type: "ID",
  description: undefined,
  nullable: false,
  resolve: (parent) => String(parent.id),
});

export const MessageSubjectFieldObject = defineFieldObject('Message', {
  type: "String",
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.subject,
});

export const MessageCategoryFieldObject = defineFieldObject('Message', {
  type: Inputs.MessageCategory,
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.category,
});

export const MessageMessageFieldObject = defineFieldObject('Message', {
  type: "String",
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.message,
});

export const MessageCommitteeFieldObject = defineRelationObject('Message', 'committee', {
  description: undefined,
  nullable: false,
  args: undefined,
  query: undefined,
});

export const MessageCommitteeIdFieldObject = defineFieldObject('Message', {
  type: "String",
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.committeeId,
});

export const MessageAuthorFieldObject = defineRelationObject('Message', 'author', {
  description: undefined,
  nullable: false,
  args: undefined,
  query: undefined,
});

export const MessageAuthorIdFieldObject = defineFieldObject('Message', {
  type: "String",
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.authorId,
});

export const MessageTimestampFieldObject = defineFieldObject('Message', {
  type: Inputs.DateTime,
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.timestamp,
});

export const MessageStatusFieldObject = defineFieldObject('Message', {
  type: [Inputs.MessageStatus],
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.status,
});

export const MessageForwardedFieldObject = defineFieldObject('Message', {
  type: "Boolean",
  description: 'If the message was forwarded to the Research Service',
  nullable: false,
  resolve: (parent) => parent.forwarded,
});

export const MessageMetaEmailFieldObject = defineFieldObject('Message', {
  type: "String",
  description: 'Saved Metadata without relation',
  nullable: true,
  resolve: (parent) => parent.metaEmail,
});

export const MessageMetaDelegationFieldObject = defineFieldObject('Message', {
  type: "String",
  description: undefined,
  nullable: true,
  resolve: (parent) => parent.metaDelegation,
});

export const MessageMetaCommitteeFieldObject = defineFieldObject('Message', {
  type: "String",
  description: undefined,
  nullable: true,
  resolve: (parent) => parent.metaCommittee,
});

export const MessageMetaAgendaItemFieldObject = defineFieldObject('Message', {
  type: "String",
  description: undefined,
  nullable: true,
  resolve: (parent) => parent.metaAgendaItem,
});
