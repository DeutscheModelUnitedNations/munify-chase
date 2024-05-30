import * as Inputs from "../inputs";
import { builder } from "../../../../src/resolvers/builder";
import {
  definePrismaObject,
  defineFieldObject,
  defineRelationFunction,
  defineRelationObject,
} from "../utils";

export const SpeakersListObject = definePrismaObject("SpeakersList", {
  description: "A speakers list in a committee",
  findUnique: ({ id }) => ({ id }),
  fields: (t) => ({
    id: t.field(SpeakersListIdFieldObject),
    agendaItem: t.relation("agendaItem", SpeakersListAgendaItemFieldObject),
    agendaItemId: t.field(SpeakersListAgendaItemIdFieldObject),
    type: t.field(SpeakersListTypeFieldObject),
    speakers: t.relation("speakers", SpeakersListSpeakersFieldObject(t)),
    speakingTime: t.field(SpeakersListSpeakingTimeFieldObject),
    timeLeft: t.field(SpeakersListTimeLeftFieldObject),
    startTimestamp: t.field(SpeakersListStartTimestampFieldObject),
    isClosed: t.field(SpeakersListIsClosedFieldObject),
  }),
});

export const SpeakersListIdFieldObject = defineFieldObject("SpeakersList", {
  type: "ID",
  description: undefined,
  nullable: false,
  resolve: (parent) => String(parent.id),
});

export const SpeakersListAgendaItemFieldObject = defineRelationObject(
  "SpeakersList",
  "agendaItem",
  {
    description: undefined,
    nullable: false,
    args: undefined,
    query: undefined,
  },
);

export const SpeakersListAgendaItemIdFieldObject = defineFieldObject(
  "SpeakersList",
  {
    type: "String",
    description: undefined,
    nullable: false,
    resolve: (parent) => parent.agendaItemId,
  },
);

export const SpeakersListTypeFieldObject = defineFieldObject("SpeakersList", {
  type: Inputs.SpeakersListCategory,
  description: undefined,
  nullable: false,
  resolve: (parent) => parent.type,
});

export const SpeakersListSpeakersFieldArgs = builder.args((t) => ({
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

export const SpeakersListSpeakersFieldObject = defineRelationFunction(
  "SpeakersList",
  (t) =>
    defineRelationObject("SpeakersList", "speakers", {
      description: undefined,
      nullable: false,
      args: SpeakersListSpeakersFieldArgs,
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

export const SpeakersListSpeakingTimeFieldObject = defineFieldObject(
  "SpeakersList",
  {
    type: "Int",
    description: "The time in seconds that a speaker has to speak",
    nullable: false,
    resolve: (parent) => parent.speakingTime,
  },
);

export const SpeakersListTimeLeftFieldObject = defineFieldObject(
  "SpeakersList",
  {
    type: "Int",
    description: undefined,
    nullable: true,
    resolve: (parent) => parent.timeLeft,
  },
);

export const SpeakersListStartTimestampFieldObject = defineFieldObject(
  "SpeakersList",
  {
    type: Inputs.DateTime,
    description: undefined,
    nullable: true,
    resolve: (parent) => parent.startTimestamp,
  },
);

export const SpeakersListIsClosedFieldObject = defineFieldObject(
  "SpeakersList",
  {
    type: "Boolean",
    description: undefined,
    nullable: false,
    resolve: (parent) => parent.isClosed,
  },
);
