import {
  definePrismaObject,
  defineFieldObject,
  defineRelationObject,
} from "../utils";

export const SpeakerOnListObject = definePrismaObject("SpeakerOnList", {
  description:
    "A speaker on a speakers list, storing their position in the list",
  findUnique: ({ id }) => ({ id }),
  fields: (t) => ({
    id: t.field(SpeakerOnListIdFieldObject),
    speakersList: t.relation(
      "speakersList",
      SpeakerOnListSpeakersListFieldObject,
    ),
    speakersListId: t.field(SpeakerOnListSpeakersListIdFieldObject),
    committeeMember: t.relation(
      "committeeMember",
      SpeakerOnListCommitteeMemberFieldObject,
    ),
    committeeMemberId: t.field(SpeakerOnListCommitteeMemberIdFieldObject),
    position: t.field(SpeakerOnListPositionFieldObject),
  }),
});

export const SpeakerOnListIdFieldObject = defineFieldObject("SpeakerOnList", {
  type: "ID",
  description: undefined,
  nullable: false,
  resolve: (parent) => String(parent.id),
});

export const SpeakerOnListSpeakersListFieldObject = defineRelationObject(
  "SpeakerOnList",
  "speakersList",
  {
    description: undefined,
    nullable: false,
    args: undefined,
    query: undefined,
  },
);

export const SpeakerOnListSpeakersListIdFieldObject = defineFieldObject(
  "SpeakerOnList",
  {
    type: "String",
    description: undefined,
    nullable: false,
    resolve: (parent) => parent.speakersListId,
  },
);

export const SpeakerOnListCommitteeMemberFieldObject = defineRelationObject(
  "SpeakerOnList",
  "committeeMember",
  {
    description: undefined,
    nullable: false,
    args: undefined,
    query: undefined,
  },
);

export const SpeakerOnListCommitteeMemberIdFieldObject = defineFieldObject(
  "SpeakerOnList",
  {
    type: "String",
    description: undefined,
    nullable: false,
    resolve: (parent) => parent.committeeMemberId,
  },
);

export const SpeakerOnListPositionFieldObject = defineFieldObject(
  "SpeakerOnList",
  {
    type: "Int",
    description: undefined,
    nullable: false,
    resolve: (parent) => parent.position,
  },
);
