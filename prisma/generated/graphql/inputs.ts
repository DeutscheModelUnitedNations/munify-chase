// @ts-nocheck
import { Prisma } from '../client';

import { builder } from '../../../src/resolvers/builder';

type Filters = {
  string: Prisma.StringFieldUpdateOperationsInput;
  nullableString: Prisma.NullableStringFieldUpdateOperationsInput;
  dateTime: Prisma.DateTimeFieldUpdateOperationsInput;
  nullableDateTime: Prisma.NullableDateTimeFieldUpdateOperationsInput;
  int: Prisma.IntFieldUpdateOperationsInput;
  nullableInt: Prisma.NullableIntFieldUpdateOperationsInput;
  bool: Prisma.BoolFieldUpdateOperationsInput;
  nullableBool: Prisma.NullableBoolFieldUpdateOperationsInput;
  bigInt: Prisma.BigIntFieldUpdateOperationsInput;
  nullableBigInt: Prisma.NullableBigIntFieldUpdateOperationsInput;
  bytes: Prisma.BytesFieldUpdateOperationsInput;
  nullableBytes: Prisma.NullableBytesFieldUpdateOperationsInput;
  float: Prisma.FloatFieldUpdateOperationsInput;
  nullableFloat: Prisma.NullableFloatFieldUpdateOperationsInput;
  decimal: Prisma.DecimalFieldUpdateOperationsInput;
  nullableDecimal: Prisma.NullableDecimalFieldUpdateOperationsInput;
};

type ApplyFilters<InputField> = {
  [F in keyof Filters]: 0 extends 1 & Filters[F]
    ? never
    : Filters[F] extends InputField
    ? Filters[F]
    : never;
}[keyof Filters];

type PrismaUpdateOperationsInputFilter<T extends object> = {
  [K in keyof T]: [ApplyFilters<T[K]>] extends [never] ? T[K] : ApplyFilters<T[K]>
};

export const DateTime = builder.scalarType('DateTime', {
  parseValue: (value) => {
    try {
      const date = new Date(value)
      if (date.toString() === 'Invalid Date') throw new Error('Invalid Date')
      return date
    } catch (error) {
      throw new Error('Invalid Date');
    }
  },
  serialize: (value) => value ? new Date(value) : null,
});

export const TransactionIsolationLevel = builder.enumType('TransactionIsolationLevel', {
  values: ["ReadUncommitted","ReadCommitted","RepeatableRead","Serializable"] as const,
});

export const UserScalarFieldEnum = builder.enumType('UserScalarFieldEnum', {
  values: ["id"] as const,
});

export const ConferenceCreationTokenScalarFieldEnum = builder.enumType('ConferenceCreationTokenScalarFieldEnum', {
  values: ["token"] as const,
});

export const ConferenceScalarFieldEnum = builder.enumType('ConferenceScalarFieldEnum', {
  values: ["id","name","start","end","pressWebsite","feedbackWebsite"] as const,
});

export const ConferenceMemberScalarFieldEnum = builder.enumType('ConferenceMemberScalarFieldEnum', {
  values: ["id","conferenceId","userId","role"] as const,
});

export const CommitteeScalarFieldEnum = builder.enumType('CommitteeScalarFieldEnum', {
  values: ["id","name","abbreviation","category","conferenceId","parentId","whiteboardContent","status","stateOfDebate","statusHeadline","statusUntil","allowDelegationsToAddThemselvesToSpeakersList"] as const,
});

export const CommitteeMemberScalarFieldEnum = builder.enumType('CommitteeMemberScalarFieldEnum', {
  values: ["id","committeeId","userId","delegationId","presence"] as const,
});

export const AgendaItemScalarFieldEnum = builder.enumType('AgendaItemScalarFieldEnum', {
  values: ["id","committeeId","title","description","isActive"] as const,
});

export const SpeakersListScalarFieldEnum = builder.enumType('SpeakersListScalarFieldEnum', {
  values: ["id","agendaItemId","type","speakingTime","timeLeft","startTimestamp","isClosed"] as const,
});

export const SpeakerOnListScalarFieldEnum = builder.enumType('SpeakerOnListScalarFieldEnum', {
  values: ["id","speakersListId","committeeMemberId","position"] as const,
});

export const DelegationScalarFieldEnum = builder.enumType('DelegationScalarFieldEnum', {
  values: ["id","conferenceId","nationId"] as const,
});

export const NationScalarFieldEnum = builder.enumType('NationScalarFieldEnum', {
  values: ["id","alpha3Code","variant"] as const,
});

export const MessageScalarFieldEnum = builder.enumType('MessageScalarFieldEnum', {
  values: ["id","subject","category","message","committeeId","authorId","timestamp","status","forwarded","metaEmail","metaDelegation","metaCommittee","metaAgendaItem"] as const,
});

export const SortOrder = builder.enumType('SortOrder', {
  values: ["asc","desc"] as const,
});

export const QueryMode = builder.enumType('QueryMode', {
  values: ["default","insensitive"] as const,
});

export const NullsOrder = builder.enumType('NullsOrder', {
  values: ["first","last"] as const,
});

export const ConferenceRole = builder.enumType('ConferenceRole', {
  values: ["ADMIN","SECRETARIAT","CHAIR","COMMITTEE_ADVISOR","NON_STATE_ACTOR","PRESS_CORPS","GUEST","PARTICIPANT_CARE","MISCELLANEOUS_TEAM"] as const,
});

export const CommitteeCategory = builder.enumType('CommitteeCategory', {
  values: ["COMMITTEE","CRISIS","ICJ"] as const,
});

export const CommitteeStatus = builder.enumType('CommitteeStatus', {
  values: ["FORMAL","INFORMAL","PAUSE","SUSPENSION","CLOSED"] as const,
});

export const Presence = builder.enumType('Presence', {
  values: ["PRESENT","EXCUSED","ABSENT"] as const,
});

export const SpeakersListCategory = builder.enumType('SpeakersListCategory', {
  values: ["SPEAKERS_LIST","COMMENT_LIST","MODERATED_CAUCUS"] as const,
});

export const NationVariant = builder.enumType('NationVariant', {
  values: ["NATION","NON_STATE_ACTOR","SPECIAL_PERSON"] as const,
});

export const MessageCategory = builder.enumType('MessageCategory', {
  values: ["TO_CHAIR","GUEST_SPEAKER","FACT_CHECK","INFORMATION","GENERAL_SECRETARY","OTHER"] as const,
});

export const MessageStatus = builder.enumType('MessageStatus', {
  values: ["UNREAD","PRIORITY","ASSIGNED","ARCHIVED"] as const,
});

export const UserWhereInputFields = (t: any) => ({
  AND: t.field({"required":false,"type":[UserWhereInput]}),
  OR: t.field({"required":false,"type":[UserWhereInput]}),
  NOT: t.field({"required":false,"type":[UserWhereInput]}),
  id: t.field({"required":false,"type":StringFilter}),
  conferenceMemberships: t.field({"required":false,"type":ConferenceMemberListRelationFilter}),
  committeeMemberships: t.field({"required":false,"type":CommitteeMemberListRelationFilter}),
  messages: t.field({"required":false,"type":MessageListRelationFilter}),
});
export const UserWhereInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserWhereInput>, false>('UserWhereInput').implement({
  fields: UserWhereInputFields,
});

export const UserOrderByWithRelationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  conferenceMemberships: t.field({"required":false,"type":ConferenceMemberOrderByRelationAggregateInput}),
  committeeMemberships: t.field({"required":false,"type":CommitteeMemberOrderByRelationAggregateInput}),
  messages: t.field({"required":false,"type":MessageOrderByRelationAggregateInput}),
});
export const UserOrderByWithRelationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserOrderByWithRelationInput>, false>('UserOrderByWithRelationInput').implement({
  fields: UserOrderByWithRelationInputFields,
});

export const UserWhereUniqueInputFields = (t: any) => ({
  id: t.string({"required":false}),
  AND: t.field({"required":false,"type":[UserWhereInput]}),
  OR: t.field({"required":false,"type":[UserWhereInput]}),
  NOT: t.field({"required":false,"type":[UserWhereInput]}),
  conferenceMemberships: t.field({"required":false,"type":ConferenceMemberListRelationFilter}),
  committeeMemberships: t.field({"required":false,"type":CommitteeMemberListRelationFilter}),
  messages: t.field({"required":false,"type":MessageListRelationFilter}),
});
export const UserWhereUniqueInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserWhereUniqueInput>, false>('UserWhereUniqueInput').implement({
  fields: UserWhereUniqueInputFields,
});

export const ConferenceCreationTokenWhereInputFields = (t: any) => ({
  AND: t.field({"required":false,"type":[ConferenceCreationTokenWhereInput]}),
  OR: t.field({"required":false,"type":[ConferenceCreationTokenWhereInput]}),
  NOT: t.field({"required":false,"type":[ConferenceCreationTokenWhereInput]}),
  token: t.field({"required":false,"type":StringFilter}),
});
export const ConferenceCreationTokenWhereInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.ConferenceCreationTokenWhereInput>, false>('ConferenceCreationTokenWhereInput').implement({
  fields: ConferenceCreationTokenWhereInputFields,
});

export const ConferenceCreationTokenOrderByWithRelationInputFields = (t: any) => ({
  token: t.field({"required":false,"type":SortOrder}),
});
export const ConferenceCreationTokenOrderByWithRelationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.ConferenceCreationTokenOrderByWithRelationInput>, false>('ConferenceCreationTokenOrderByWithRelationInput').implement({
  fields: ConferenceCreationTokenOrderByWithRelationInputFields,
});

export const ConferenceCreationTokenWhereUniqueInputFields = (t: any) => ({
  token: t.string({"required":false}),
  AND: t.field({"required":false,"type":[ConferenceCreationTokenWhereInput]}),
  OR: t.field({"required":false,"type":[ConferenceCreationTokenWhereInput]}),
  NOT: t.field({"required":false,"type":[ConferenceCreationTokenWhereInput]}),
});
export const ConferenceCreationTokenWhereUniqueInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.ConferenceCreationTokenWhereUniqueInput>, false>('ConferenceCreationTokenWhereUniqueInput').implement({
  fields: ConferenceCreationTokenWhereUniqueInputFields,
});

export const ConferenceWhereInputFields = (t: any) => ({
  AND: t.field({"required":false,"type":[ConferenceWhereInput]}),
  OR: t.field({"required":false,"type":[ConferenceWhereInput]}),
  NOT: t.field({"required":false,"type":[ConferenceWhereInput]}),
  id: t.field({"required":false,"type":StringFilter}),
  name: t.field({"required":false,"type":StringFilter}),
  start: t.field({"required":false,"type":DateTimeNullableFilter}),
  end: t.field({"required":false,"type":DateTimeNullableFilter}),
  pressWebsite: t.field({"required":false,"type":StringNullableFilter}),
  feedbackWebsite: t.field({"required":false,"type":StringNullableFilter}),
  delegations: t.field({"required":false,"type":DelegationListRelationFilter}),
  members: t.field({"required":false,"type":ConferenceMemberListRelationFilter}),
  committees: t.field({"required":false,"type":CommitteeListRelationFilter}),
});
export const ConferenceWhereInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.ConferenceWhereInput>, false>('ConferenceWhereInput').implement({
  fields: ConferenceWhereInputFields,
});

export const ConferenceOrderByWithRelationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  name: t.field({"required":false,"type":SortOrder}),
  start: t.field({"required":false,"type":SortOrder}),
  end: t.field({"required":false,"type":SortOrder}),
  pressWebsite: t.field({"required":false,"type":SortOrder}),
  feedbackWebsite: t.field({"required":false,"type":SortOrder}),
  delegations: t.field({"required":false,"type":DelegationOrderByRelationAggregateInput}),
  members: t.field({"required":false,"type":ConferenceMemberOrderByRelationAggregateInput}),
  committees: t.field({"required":false,"type":CommitteeOrderByRelationAggregateInput}),
});
export const ConferenceOrderByWithRelationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.ConferenceOrderByWithRelationInput>, false>('ConferenceOrderByWithRelationInput').implement({
  fields: ConferenceOrderByWithRelationInputFields,
});

export const ConferenceWhereUniqueInputFields = (t: any) => ({
  id: t.string({"required":false}),
  name: t.string({"required":false}),
  AND: t.field({"required":false,"type":[ConferenceWhereInput]}),
  OR: t.field({"required":false,"type":[ConferenceWhereInput]}),
  NOT: t.field({"required":false,"type":[ConferenceWhereInput]}),
  start: t.field({"required":false,"type":DateTimeNullableFilter}),
  end: t.field({"required":false,"type":DateTimeNullableFilter}),
  pressWebsite: t.field({"required":false,"type":StringNullableFilter}),
  feedbackWebsite: t.field({"required":false,"type":StringNullableFilter}),
  delegations: t.field({"required":false,"type":DelegationListRelationFilter}),
  members: t.field({"required":false,"type":ConferenceMemberListRelationFilter}),
  committees: t.field({"required":false,"type":CommitteeListRelationFilter}),
});
export const ConferenceWhereUniqueInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.ConferenceWhereUniqueInput>, false>('ConferenceWhereUniqueInput').implement({
  fields: ConferenceWhereUniqueInputFields,
});

export const ConferenceMemberWhereInputFields = (t: any) => ({
  AND: t.field({"required":false,"type":[ConferenceMemberWhereInput]}),
  OR: t.field({"required":false,"type":[ConferenceMemberWhereInput]}),
  NOT: t.field({"required":false,"type":[ConferenceMemberWhereInput]}),
  id: t.field({"required":false,"type":StringFilter}),
  conferenceId: t.field({"required":false,"type":StringFilter}),
  userId: t.field({"required":false,"type":StringNullableFilter}),
  role: t.field({"required":false,"type":EnumConferenceRoleFilter}),
  conference: t.field({"required":false,"type":ConferenceWhereInput}),
  user: t.field({"required":false,"type":UserWhereInput}),
});
export const ConferenceMemberWhereInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.ConferenceMemberWhereInput>, false>('ConferenceMemberWhereInput').implement({
  fields: ConferenceMemberWhereInputFields,
});

export const ConferenceMemberOrderByWithRelationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  conferenceId: t.field({"required":false,"type":SortOrder}),
  userId: t.field({"required":false,"type":SortOrder}),
  role: t.field({"required":false,"type":SortOrder}),
  conference: t.field({"required":false,"type":ConferenceOrderByWithRelationInput}),
  user: t.field({"required":false,"type":UserOrderByWithRelationInput}),
});
export const ConferenceMemberOrderByWithRelationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.ConferenceMemberOrderByWithRelationInput>, false>('ConferenceMemberOrderByWithRelationInput').implement({
  fields: ConferenceMemberOrderByWithRelationInputFields,
});

export const ConferenceMemberWhereUniqueInputFields = (t: any) => ({
  id: t.string({"required":false}),
  userId_conferenceId: t.field({"required":false,"type":ConferenceMemberUserIdConferenceIdCompoundUniqueInput}),
  AND: t.field({"required":false,"type":[ConferenceMemberWhereInput]}),
  OR: t.field({"required":false,"type":[ConferenceMemberWhereInput]}),
  NOT: t.field({"required":false,"type":[ConferenceMemberWhereInput]}),
  conferenceId: t.field({"required":false,"type":StringFilter}),
  userId: t.field({"required":false,"type":StringNullableFilter}),
  role: t.field({"required":false,"type":EnumConferenceRoleFilter}),
  conference: t.field({"required":false,"type":ConferenceWhereInput}),
  user: t.field({"required":false,"type":UserWhereInput}),
});
export const ConferenceMemberWhereUniqueInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.ConferenceMemberWhereUniqueInput>, false>('ConferenceMemberWhereUniqueInput').implement({
  fields: ConferenceMemberWhereUniqueInputFields,
});

export const CommitteeWhereInputFields = (t: any) => ({
  AND: t.field({"required":false,"type":[CommitteeWhereInput]}),
  OR: t.field({"required":false,"type":[CommitteeWhereInput]}),
  NOT: t.field({"required":false,"type":[CommitteeWhereInput]}),
  id: t.field({"required":false,"type":StringFilter}),
  name: t.field({"required":false,"type":StringFilter}),
  abbreviation: t.field({"required":false,"type":StringFilter}),
  category: t.field({"required":false,"type":EnumCommitteeCategoryFilter}),
  conferenceId: t.field({"required":false,"type":StringFilter}),
  parentId: t.field({"required":false,"type":StringNullableFilter}),
  whiteboardContent: t.field({"required":false,"type":StringFilter}),
  status: t.field({"required":false,"type":EnumCommitteeStatusFilter}),
  stateOfDebate: t.field({"required":false,"type":StringNullableFilter}),
  statusHeadline: t.field({"required":false,"type":StringNullableFilter}),
  statusUntil: t.field({"required":false,"type":DateTimeNullableFilter}),
  allowDelegationsToAddThemselvesToSpeakersList: t.field({"required":false,"type":BoolFilter}),
  conference: t.field({"required":false,"type":ConferenceWhereInput}),
  members: t.field({"required":false,"type":CommitteeMemberListRelationFilter}),
  parent: t.field({"required":false,"type":CommitteeWhereInput}),
  subCommittees: t.field({"required":false,"type":CommitteeListRelationFilter}),
  messages: t.field({"required":false,"type":MessageListRelationFilter}),
  agendaItems: t.field({"required":false,"type":AgendaItemListRelationFilter}),
});
export const CommitteeWhereInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.CommitteeWhereInput>, false>('CommitteeWhereInput').implement({
  fields: CommitteeWhereInputFields,
});

export const CommitteeOrderByWithRelationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  name: t.field({"required":false,"type":SortOrder}),
  abbreviation: t.field({"required":false,"type":SortOrder}),
  category: t.field({"required":false,"type":SortOrder}),
  conferenceId: t.field({"required":false,"type":SortOrder}),
  parentId: t.field({"required":false,"type":SortOrder}),
  whiteboardContent: t.field({"required":false,"type":SortOrder}),
  status: t.field({"required":false,"type":SortOrder}),
  stateOfDebate: t.field({"required":false,"type":SortOrder}),
  statusHeadline: t.field({"required":false,"type":SortOrder}),
  statusUntil: t.field({"required":false,"type":SortOrder}),
  allowDelegationsToAddThemselvesToSpeakersList: t.field({"required":false,"type":SortOrder}),
  conference: t.field({"required":false,"type":ConferenceOrderByWithRelationInput}),
  members: t.field({"required":false,"type":CommitteeMemberOrderByRelationAggregateInput}),
  parent: t.field({"required":false,"type":CommitteeOrderByWithRelationInput}),
  subCommittees: t.field({"required":false,"type":CommitteeOrderByRelationAggregateInput}),
  messages: t.field({"required":false,"type":MessageOrderByRelationAggregateInput}),
  agendaItems: t.field({"required":false,"type":AgendaItemOrderByRelationAggregateInput}),
});
export const CommitteeOrderByWithRelationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.CommitteeOrderByWithRelationInput>, false>('CommitteeOrderByWithRelationInput').implement({
  fields: CommitteeOrderByWithRelationInputFields,
});

export const CommitteeWhereUniqueInputFields = (t: any) => ({
  id: t.string({"required":false}),
  name_conferenceId: t.field({"required":false,"type":CommitteeNameConferenceIdCompoundUniqueInput}),
  abbreviation_conferenceId: t.field({"required":false,"type":CommitteeAbbreviationConferenceIdCompoundUniqueInput}),
  AND: t.field({"required":false,"type":[CommitteeWhereInput]}),
  OR: t.field({"required":false,"type":[CommitteeWhereInput]}),
  NOT: t.field({"required":false,"type":[CommitteeWhereInput]}),
  name: t.field({"required":false,"type":StringFilter}),
  abbreviation: t.field({"required":false,"type":StringFilter}),
  category: t.field({"required":false,"type":EnumCommitteeCategoryFilter}),
  conferenceId: t.field({"required":false,"type":StringFilter}),
  parentId: t.field({"required":false,"type":StringNullableFilter}),
  whiteboardContent: t.field({"required":false,"type":StringFilter}),
  status: t.field({"required":false,"type":EnumCommitteeStatusFilter}),
  stateOfDebate: t.field({"required":false,"type":StringNullableFilter}),
  statusHeadline: t.field({"required":false,"type":StringNullableFilter}),
  statusUntil: t.field({"required":false,"type":DateTimeNullableFilter}),
  allowDelegationsToAddThemselvesToSpeakersList: t.field({"required":false,"type":BoolFilter}),
  conference: t.field({"required":false,"type":ConferenceWhereInput}),
  members: t.field({"required":false,"type":CommitteeMemberListRelationFilter}),
  parent: t.field({"required":false,"type":CommitteeWhereInput}),
  subCommittees: t.field({"required":false,"type":CommitteeListRelationFilter}),
  messages: t.field({"required":false,"type":MessageListRelationFilter}),
  agendaItems: t.field({"required":false,"type":AgendaItemListRelationFilter}),
});
export const CommitteeWhereUniqueInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.CommitteeWhereUniqueInput>, false>('CommitteeWhereUniqueInput').implement({
  fields: CommitteeWhereUniqueInputFields,
});

export const CommitteeMemberWhereInputFields = (t: any) => ({
  AND: t.field({"required":false,"type":[CommitteeMemberWhereInput]}),
  OR: t.field({"required":false,"type":[CommitteeMemberWhereInput]}),
  NOT: t.field({"required":false,"type":[CommitteeMemberWhereInput]}),
  id: t.field({"required":false,"type":StringFilter}),
  committeeId: t.field({"required":false,"type":StringFilter}),
  userId: t.field({"required":false,"type":StringNullableFilter}),
  delegationId: t.field({"required":false,"type":StringNullableFilter}),
  presence: t.field({"required":false,"type":EnumPresenceFilter}),
  committee: t.field({"required":false,"type":CommitteeWhereInput}),
  user: t.field({"required":false,"type":UserWhereInput}),
  speakerLists: t.field({"required":false,"type":SpeakerOnListListRelationFilter}),
  delegation: t.field({"required":false,"type":DelegationWhereInput}),
});
export const CommitteeMemberWhereInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.CommitteeMemberWhereInput>, false>('CommitteeMemberWhereInput').implement({
  fields: CommitteeMemberWhereInputFields,
});

export const CommitteeMemberOrderByWithRelationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  committeeId: t.field({"required":false,"type":SortOrder}),
  userId: t.field({"required":false,"type":SortOrder}),
  delegationId: t.field({"required":false,"type":SortOrder}),
  presence: t.field({"required":false,"type":SortOrder}),
  committee: t.field({"required":false,"type":CommitteeOrderByWithRelationInput}),
  user: t.field({"required":false,"type":UserOrderByWithRelationInput}),
  speakerLists: t.field({"required":false,"type":SpeakerOnListOrderByRelationAggregateInput}),
  delegation: t.field({"required":false,"type":DelegationOrderByWithRelationInput}),
});
export const CommitteeMemberOrderByWithRelationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.CommitteeMemberOrderByWithRelationInput>, false>('CommitteeMemberOrderByWithRelationInput').implement({
  fields: CommitteeMemberOrderByWithRelationInputFields,
});

export const CommitteeMemberWhereUniqueInputFields = (t: any) => ({
  id: t.string({"required":false}),
  committeeId_delegationId: t.field({"required":false,"type":CommitteeMemberCommitteeIdDelegationIdCompoundUniqueInput}),
  committeeId_userId: t.field({"required":false,"type":CommitteeMemberCommitteeIdUserIdCompoundUniqueInput}),
  AND: t.field({"required":false,"type":[CommitteeMemberWhereInput]}),
  OR: t.field({"required":false,"type":[CommitteeMemberWhereInput]}),
  NOT: t.field({"required":false,"type":[CommitteeMemberWhereInput]}),
  committeeId: t.field({"required":false,"type":StringFilter}),
  userId: t.field({"required":false,"type":StringNullableFilter}),
  delegationId: t.field({"required":false,"type":StringNullableFilter}),
  presence: t.field({"required":false,"type":EnumPresenceFilter}),
  committee: t.field({"required":false,"type":CommitteeWhereInput}),
  user: t.field({"required":false,"type":UserWhereInput}),
  speakerLists: t.field({"required":false,"type":SpeakerOnListListRelationFilter}),
  delegation: t.field({"required":false,"type":DelegationWhereInput}),
});
export const CommitteeMemberWhereUniqueInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.CommitteeMemberWhereUniqueInput>, false>('CommitteeMemberWhereUniqueInput').implement({
  fields: CommitteeMemberWhereUniqueInputFields,
});

export const AgendaItemWhereInputFields = (t: any) => ({
  AND: t.field({"required":false,"type":[AgendaItemWhereInput]}),
  OR: t.field({"required":false,"type":[AgendaItemWhereInput]}),
  NOT: t.field({"required":false,"type":[AgendaItemWhereInput]}),
  id: t.field({"required":false,"type":StringFilter}),
  committeeId: t.field({"required":false,"type":StringFilter}),
  title: t.field({"required":false,"type":StringFilter}),
  description: t.field({"required":false,"type":StringNullableFilter}),
  isActive: t.field({"required":false,"type":BoolFilter}),
  committee: t.field({"required":false,"type":CommitteeWhereInput}),
  speakerLists: t.field({"required":false,"type":SpeakersListListRelationFilter}),
});
export const AgendaItemWhereInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.AgendaItemWhereInput>, false>('AgendaItemWhereInput').implement({
  fields: AgendaItemWhereInputFields,
});

export const AgendaItemOrderByWithRelationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  committeeId: t.field({"required":false,"type":SortOrder}),
  title: t.field({"required":false,"type":SortOrder}),
  description: t.field({"required":false,"type":SortOrder}),
  isActive: t.field({"required":false,"type":SortOrder}),
  committee: t.field({"required":false,"type":CommitteeOrderByWithRelationInput}),
  speakerLists: t.field({"required":false,"type":SpeakersListOrderByRelationAggregateInput}),
});
export const AgendaItemOrderByWithRelationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.AgendaItemOrderByWithRelationInput>, false>('AgendaItemOrderByWithRelationInput').implement({
  fields: AgendaItemOrderByWithRelationInputFields,
});

export const AgendaItemWhereUniqueInputFields = (t: any) => ({
  id: t.string({"required":false}),
  AND: t.field({"required":false,"type":[AgendaItemWhereInput]}),
  OR: t.field({"required":false,"type":[AgendaItemWhereInput]}),
  NOT: t.field({"required":false,"type":[AgendaItemWhereInput]}),
  committeeId: t.field({"required":false,"type":StringFilter}),
  title: t.field({"required":false,"type":StringFilter}),
  description: t.field({"required":false,"type":StringNullableFilter}),
  isActive: t.field({"required":false,"type":BoolFilter}),
  committee: t.field({"required":false,"type":CommitteeWhereInput}),
  speakerLists: t.field({"required":false,"type":SpeakersListListRelationFilter}),
});
export const AgendaItemWhereUniqueInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.AgendaItemWhereUniqueInput>, false>('AgendaItemWhereUniqueInput').implement({
  fields: AgendaItemWhereUniqueInputFields,
});

export const SpeakersListWhereInputFields = (t: any) => ({
  AND: t.field({"required":false,"type":[SpeakersListWhereInput]}),
  OR: t.field({"required":false,"type":[SpeakersListWhereInput]}),
  NOT: t.field({"required":false,"type":[SpeakersListWhereInput]}),
  id: t.field({"required":false,"type":StringFilter}),
  agendaItemId: t.field({"required":false,"type":StringFilter}),
  type: t.field({"required":false,"type":EnumSpeakersListCategoryFilter}),
  speakingTime: t.field({"required":false,"type":IntFilter}),
  timeLeft: t.field({"required":false,"type":IntNullableFilter}),
  startTimestamp: t.field({"required":false,"type":DateTimeNullableFilter}),
  isClosed: t.field({"required":false,"type":BoolFilter}),
  agendaItem: t.field({"required":false,"type":AgendaItemWhereInput}),
  speakers: t.field({"required":false,"type":SpeakerOnListListRelationFilter}),
});
export const SpeakersListWhereInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SpeakersListWhereInput>, false>('SpeakersListWhereInput').implement({
  fields: SpeakersListWhereInputFields,
});

export const SpeakersListOrderByWithRelationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  agendaItemId: t.field({"required":false,"type":SortOrder}),
  type: t.field({"required":false,"type":SortOrder}),
  speakingTime: t.field({"required":false,"type":SortOrder}),
  timeLeft: t.field({"required":false,"type":SortOrder}),
  startTimestamp: t.field({"required":false,"type":SortOrder}),
  isClosed: t.field({"required":false,"type":SortOrder}),
  agendaItem: t.field({"required":false,"type":AgendaItemOrderByWithRelationInput}),
  speakers: t.field({"required":false,"type":SpeakerOnListOrderByRelationAggregateInput}),
});
export const SpeakersListOrderByWithRelationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SpeakersListOrderByWithRelationInput>, false>('SpeakersListOrderByWithRelationInput').implement({
  fields: SpeakersListOrderByWithRelationInputFields,
});

export const SpeakersListWhereUniqueInputFields = (t: any) => ({
  id: t.string({"required":false}),
  agendaItemId_type: t.field({"required":false,"type":SpeakersListAgendaItemIdTypeCompoundUniqueInput}),
  AND: t.field({"required":false,"type":[SpeakersListWhereInput]}),
  OR: t.field({"required":false,"type":[SpeakersListWhereInput]}),
  NOT: t.field({"required":false,"type":[SpeakersListWhereInput]}),
  agendaItemId: t.field({"required":false,"type":StringFilter}),
  type: t.field({"required":false,"type":EnumSpeakersListCategoryFilter}),
  speakingTime: t.field({"required":false,"type":IntFilter}),
  timeLeft: t.field({"required":false,"type":IntNullableFilter}),
  startTimestamp: t.field({"required":false,"type":DateTimeNullableFilter}),
  isClosed: t.field({"required":false,"type":BoolFilter}),
  agendaItem: t.field({"required":false,"type":AgendaItemWhereInput}),
  speakers: t.field({"required":false,"type":SpeakerOnListListRelationFilter}),
});
export const SpeakersListWhereUniqueInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SpeakersListWhereUniqueInput>, false>('SpeakersListWhereUniqueInput').implement({
  fields: SpeakersListWhereUniqueInputFields,
});

export const SpeakerOnListWhereInputFields = (t: any) => ({
  AND: t.field({"required":false,"type":[SpeakerOnListWhereInput]}),
  OR: t.field({"required":false,"type":[SpeakerOnListWhereInput]}),
  NOT: t.field({"required":false,"type":[SpeakerOnListWhereInput]}),
  id: t.field({"required":false,"type":StringFilter}),
  speakersListId: t.field({"required":false,"type":StringFilter}),
  committeeMemberId: t.field({"required":false,"type":StringFilter}),
  position: t.field({"required":false,"type":IntFilter}),
  speakersList: t.field({"required":false,"type":SpeakersListWhereInput}),
  committeeMember: t.field({"required":false,"type":CommitteeMemberWhereInput}),
});
export const SpeakerOnListWhereInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SpeakerOnListWhereInput>, false>('SpeakerOnListWhereInput').implement({
  fields: SpeakerOnListWhereInputFields,
});

export const SpeakerOnListOrderByWithRelationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  speakersListId: t.field({"required":false,"type":SortOrder}),
  committeeMemberId: t.field({"required":false,"type":SortOrder}),
  position: t.field({"required":false,"type":SortOrder}),
  speakersList: t.field({"required":false,"type":SpeakersListOrderByWithRelationInput}),
  committeeMember: t.field({"required":false,"type":CommitteeMemberOrderByWithRelationInput}),
});
export const SpeakerOnListOrderByWithRelationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SpeakerOnListOrderByWithRelationInput>, false>('SpeakerOnListOrderByWithRelationInput').implement({
  fields: SpeakerOnListOrderByWithRelationInputFields,
});

export const SpeakerOnListWhereUniqueInputFields = (t: any) => ({
  id: t.string({"required":false}),
  speakersListId_position: t.field({"required":false,"type":SpeakerOnListSpeakersListIdPositionCompoundUniqueInput}),
  speakersListId_committeeMemberId: t.field({"required":false,"type":SpeakerOnListSpeakersListIdCommitteeMemberIdCompoundUniqueInput}),
  AND: t.field({"required":false,"type":[SpeakerOnListWhereInput]}),
  OR: t.field({"required":false,"type":[SpeakerOnListWhereInput]}),
  NOT: t.field({"required":false,"type":[SpeakerOnListWhereInput]}),
  speakersListId: t.field({"required":false,"type":StringFilter}),
  committeeMemberId: t.field({"required":false,"type":StringFilter}),
  position: t.field({"required":false,"type":IntFilter}),
  speakersList: t.field({"required":false,"type":SpeakersListWhereInput}),
  committeeMember: t.field({"required":false,"type":CommitteeMemberWhereInput}),
});
export const SpeakerOnListWhereUniqueInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SpeakerOnListWhereUniqueInput>, false>('SpeakerOnListWhereUniqueInput').implement({
  fields: SpeakerOnListWhereUniqueInputFields,
});

export const DelegationWhereInputFields = (t: any) => ({
  AND: t.field({"required":false,"type":[DelegationWhereInput]}),
  OR: t.field({"required":false,"type":[DelegationWhereInput]}),
  NOT: t.field({"required":false,"type":[DelegationWhereInput]}),
  id: t.field({"required":false,"type":StringFilter}),
  conferenceId: t.field({"required":false,"type":StringFilter}),
  nationId: t.field({"required":false,"type":StringFilter}),
  conference: t.field({"required":false,"type":ConferenceWhereInput}),
  nation: t.field({"required":false,"type":NationWhereInput}),
  members: t.field({"required":false,"type":CommitteeMemberListRelationFilter}),
});
export const DelegationWhereInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.DelegationWhereInput>, false>('DelegationWhereInput').implement({
  fields: DelegationWhereInputFields,
});

export const DelegationOrderByWithRelationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  conferenceId: t.field({"required":false,"type":SortOrder}),
  nationId: t.field({"required":false,"type":SortOrder}),
  conference: t.field({"required":false,"type":ConferenceOrderByWithRelationInput}),
  nation: t.field({"required":false,"type":NationOrderByWithRelationInput}),
  members: t.field({"required":false,"type":CommitteeMemberOrderByRelationAggregateInput}),
});
export const DelegationOrderByWithRelationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.DelegationOrderByWithRelationInput>, false>('DelegationOrderByWithRelationInput').implement({
  fields: DelegationOrderByWithRelationInputFields,
});

export const DelegationWhereUniqueInputFields = (t: any) => ({
  id: t.string({"required":false}),
  conferenceId_nationId: t.field({"required":false,"type":DelegationConferenceIdNationIdCompoundUniqueInput}),
  AND: t.field({"required":false,"type":[DelegationWhereInput]}),
  OR: t.field({"required":false,"type":[DelegationWhereInput]}),
  NOT: t.field({"required":false,"type":[DelegationWhereInput]}),
  conferenceId: t.field({"required":false,"type":StringFilter}),
  nationId: t.field({"required":false,"type":StringFilter}),
  conference: t.field({"required":false,"type":ConferenceWhereInput}),
  nation: t.field({"required":false,"type":NationWhereInput}),
  members: t.field({"required":false,"type":CommitteeMemberListRelationFilter}),
});
export const DelegationWhereUniqueInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.DelegationWhereUniqueInput>, false>('DelegationWhereUniqueInput').implement({
  fields: DelegationWhereUniqueInputFields,
});

export const NationWhereInputFields = (t: any) => ({
  AND: t.field({"required":false,"type":[NationWhereInput]}),
  OR: t.field({"required":false,"type":[NationWhereInput]}),
  NOT: t.field({"required":false,"type":[NationWhereInput]}),
  id: t.field({"required":false,"type":StringFilter}),
  alpha3Code: t.field({"required":false,"type":StringFilter}),
  variant: t.field({"required":false,"type":EnumNationVariantFilter}),
  delegations: t.field({"required":false,"type":DelegationListRelationFilter}),
});
export const NationWhereInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NationWhereInput>, false>('NationWhereInput').implement({
  fields: NationWhereInputFields,
});

export const NationOrderByWithRelationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  alpha3Code: t.field({"required":false,"type":SortOrder}),
  variant: t.field({"required":false,"type":SortOrder}),
  delegations: t.field({"required":false,"type":DelegationOrderByRelationAggregateInput}),
});
export const NationOrderByWithRelationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NationOrderByWithRelationInput>, false>('NationOrderByWithRelationInput').implement({
  fields: NationOrderByWithRelationInputFields,
});

export const NationWhereUniqueInputFields = (t: any) => ({
  id: t.string({"required":false}),
  alpha3Code: t.string({"required":false}),
  AND: t.field({"required":false,"type":[NationWhereInput]}),
  OR: t.field({"required":false,"type":[NationWhereInput]}),
  NOT: t.field({"required":false,"type":[NationWhereInput]}),
  variant: t.field({"required":false,"type":EnumNationVariantFilter}),
  delegations: t.field({"required":false,"type":DelegationListRelationFilter}),
});
export const NationWhereUniqueInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NationWhereUniqueInput>, false>('NationWhereUniqueInput').implement({
  fields: NationWhereUniqueInputFields,
});

export const MessageWhereInputFields = (t: any) => ({
  AND: t.field({"required":false,"type":[MessageWhereInput]}),
  OR: t.field({"required":false,"type":[MessageWhereInput]}),
  NOT: t.field({"required":false,"type":[MessageWhereInput]}),
  id: t.field({"required":false,"type":StringFilter}),
  subject: t.field({"required":false,"type":StringFilter}),
  category: t.field({"required":false,"type":EnumMessageCategoryFilter}),
  message: t.field({"required":false,"type":StringFilter}),
  committeeId: t.field({"required":false,"type":StringFilter}),
  authorId: t.field({"required":false,"type":StringFilter}),
  timestamp: t.field({"required":false,"type":DateTimeFilter}),
  status: t.field({"required":false,"type":EnumMessageStatusNullableListFilter}),
  forwarded: t.field({"required":false,"type":BoolFilter}),
  metaEmail: t.field({"required":false,"type":StringNullableFilter}),
  metaDelegation: t.field({"required":false,"type":StringNullableFilter}),
  metaCommittee: t.field({"required":false,"type":StringNullableFilter}),
  metaAgendaItem: t.field({"required":false,"type":StringNullableFilter}),
  committee: t.field({"required":false,"type":CommitteeWhereInput}),
  author: t.field({"required":false,"type":UserWhereInput}),
});
export const MessageWhereInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.MessageWhereInput>, false>('MessageWhereInput').implement({
  fields: MessageWhereInputFields,
});

export const MessageOrderByWithRelationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":SortOrder}),
  subject: t.field({"required":false,"type":SortOrder}),
  category: t.field({"required":false,"type":SortOrder}),
  message: t.field({"required":false,"type":SortOrder}),
  committeeId: t.field({"required":false,"type":SortOrder}),
  authorId: t.field({"required":false,"type":SortOrder}),
  timestamp: t.field({"required":false,"type":SortOrder}),
  status: t.field({"required":false,"type":SortOrder}),
  forwarded: t.field({"required":false,"type":SortOrder}),
  metaEmail: t.field({"required":false,"type":SortOrder}),
  metaDelegation: t.field({"required":false,"type":SortOrder}),
  metaCommittee: t.field({"required":false,"type":SortOrder}),
  metaAgendaItem: t.field({"required":false,"type":SortOrder}),
  committee: t.field({"required":false,"type":CommitteeOrderByWithRelationInput}),
  author: t.field({"required":false,"type":UserOrderByWithRelationInput}),
});
export const MessageOrderByWithRelationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.MessageOrderByWithRelationInput>, false>('MessageOrderByWithRelationInput').implement({
  fields: MessageOrderByWithRelationInputFields,
});

export const MessageWhereUniqueInputFields = (t: any) => ({
  id: t.string({"required":false}),
  AND: t.field({"required":false,"type":[MessageWhereInput]}),
  OR: t.field({"required":false,"type":[MessageWhereInput]}),
  NOT: t.field({"required":false,"type":[MessageWhereInput]}),
  subject: t.field({"required":false,"type":StringFilter}),
  category: t.field({"required":false,"type":EnumMessageCategoryFilter}),
  message: t.field({"required":false,"type":StringFilter}),
  committeeId: t.field({"required":false,"type":StringFilter}),
  authorId: t.field({"required":false,"type":StringFilter}),
  timestamp: t.field({"required":false,"type":DateTimeFilter}),
  status: t.field({"required":false,"type":EnumMessageStatusNullableListFilter}),
  forwarded: t.field({"required":false,"type":BoolFilter}),
  metaEmail: t.field({"required":false,"type":StringNullableFilter}),
  metaDelegation: t.field({"required":false,"type":StringNullableFilter}),
  metaCommittee: t.field({"required":false,"type":StringNullableFilter}),
  metaAgendaItem: t.field({"required":false,"type":StringNullableFilter}),
  committee: t.field({"required":false,"type":CommitteeWhereInput}),
  author: t.field({"required":false,"type":UserWhereInput}),
});
export const MessageWhereUniqueInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.MessageWhereUniqueInput>, false>('MessageWhereUniqueInput').implement({
  fields: MessageWhereUniqueInputFields,
});

export const UserCreateInputFields = (t: any) => ({
  id: t.string({"required":false}),
  conferenceMemberships: t.field({"required":false,"type":ConferenceMemberCreateNestedManyWithoutUserInput}),
  committeeMemberships: t.field({"required":false,"type":CommitteeMemberCreateNestedManyWithoutUserInput}),
  messages: t.field({"required":false,"type":MessageCreateNestedManyWithoutAuthorInput}),
});
export const UserCreateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserUncheckedCreateInput>, false>('UserCreateInput').implement({
  fields: UserCreateInputFields,
});

export const UserUpdateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  conferenceMemberships: t.field({"required":false,"type":ConferenceMemberUpdateManyWithoutUserNestedInput}),
  committeeMemberships: t.field({"required":false,"type":CommitteeMemberUpdateManyWithoutUserNestedInput}),
  messages: t.field({"required":false,"type":MessageUpdateManyWithoutAuthorNestedInput}),
});
export const UserUpdateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserUncheckedUpdateInput>, false>('UserUpdateInput').implement({
  fields: UserUpdateInputFields,
});

export const UserUpdateManyMutationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
});
export const UserUpdateManyMutationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserUpdateManyMutationInput>, false>('UserUpdateManyMutationInput').implement({
  fields: UserUpdateManyMutationInputFields,
});

export const ConferenceCreationTokenCreateInputFields = (t: any) => ({
  token: t.string({"required":true}),
});
export const ConferenceCreationTokenCreateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.ConferenceCreationTokenUncheckedCreateInput>, false>('ConferenceCreationTokenCreateInput').implement({
  fields: ConferenceCreationTokenCreateInputFields,
});

export const ConferenceCreationTokenUpdateInputFields = (t: any) => ({
  token: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
});
export const ConferenceCreationTokenUpdateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.ConferenceCreationTokenUncheckedUpdateInput>, false>('ConferenceCreationTokenUpdateInput').implement({
  fields: ConferenceCreationTokenUpdateInputFields,
});

export const ConferenceCreationTokenUpdateManyMutationInputFields = (t: any) => ({
  token: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
});
export const ConferenceCreationTokenUpdateManyMutationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.ConferenceCreationTokenUpdateManyMutationInput>, false>('ConferenceCreationTokenUpdateManyMutationInput').implement({
  fields: ConferenceCreationTokenUpdateManyMutationInputFields,
});

export const ConferenceCreateInputFields = (t: any) => ({
  id: t.string({"required":false}),
  name: t.string({"required":true}),
  start: t.field({"required":false,"type":DateTime}),
  end: t.field({"required":false,"type":DateTime}),
  pressWebsite: t.string({"required":false}),
  feedbackWebsite: t.string({"required":false}),
  delegations: t.field({"required":false,"type":DelegationCreateNestedManyWithoutConferenceInput}),
  members: t.field({"required":false,"type":ConferenceMemberCreateNestedManyWithoutConferenceInput}),
  committees: t.field({"required":false,"type":CommitteeCreateNestedManyWithoutConferenceInput}),
});
export const ConferenceCreateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.ConferenceUncheckedCreateInput>, false>('ConferenceCreateInput').implement({
  fields: ConferenceCreateInputFields,
});

export const ConferenceUpdateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  name: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  start: t.field({"required":false,"type":NullableDateTimeFieldUpdateOperationsInput}),
  end: t.field({"required":false,"type":NullableDateTimeFieldUpdateOperationsInput}),
  pressWebsite: t.field({"required":false,"type":NullableStringFieldUpdateOperationsInput}),
  feedbackWebsite: t.field({"required":false,"type":NullableStringFieldUpdateOperationsInput}),
  delegations: t.field({"required":false,"type":DelegationUpdateManyWithoutConferenceNestedInput}),
  members: t.field({"required":false,"type":ConferenceMemberUpdateManyWithoutConferenceNestedInput}),
  committees: t.field({"required":false,"type":CommitteeUpdateManyWithoutConferenceNestedInput}),
});
export const ConferenceUpdateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.ConferenceUncheckedUpdateInput>, false>('ConferenceUpdateInput').implement({
  fields: ConferenceUpdateInputFields,
});

export const ConferenceUpdateManyMutationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  name: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  start: t.field({"required":false,"type":NullableDateTimeFieldUpdateOperationsInput}),
  end: t.field({"required":false,"type":NullableDateTimeFieldUpdateOperationsInput}),
  pressWebsite: t.field({"required":false,"type":NullableStringFieldUpdateOperationsInput}),
  feedbackWebsite: t.field({"required":false,"type":NullableStringFieldUpdateOperationsInput}),
});
export const ConferenceUpdateManyMutationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.ConferenceUpdateManyMutationInput>, false>('ConferenceUpdateManyMutationInput').implement({
  fields: ConferenceUpdateManyMutationInputFields,
});

export const ConferenceMemberCreateInputFields = (t: any) => ({
  id: t.string({"required":false}),
  conferenceId: t.string({"required":true}),
  userId: t.string({"required":false}),
  role: t.field({"required":true,"type":ConferenceRole}),
});
export const ConferenceMemberCreateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.ConferenceMemberUncheckedCreateInput>, false>('ConferenceMemberCreateInput').implement({
  fields: ConferenceMemberCreateInputFields,
});

export const ConferenceMemberUpdateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  conferenceId: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  userId: t.field({"required":false,"type":NullableStringFieldUpdateOperationsInput}),
  role: t.field({"required":false,"type":EnumConferenceRoleFieldUpdateOperationsInput}),
});
export const ConferenceMemberUpdateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.ConferenceMemberUncheckedUpdateInput>, false>('ConferenceMemberUpdateInput').implement({
  fields: ConferenceMemberUpdateInputFields,
});

export const ConferenceMemberUpdateManyMutationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  role: t.field({"required":false,"type":EnumConferenceRoleFieldUpdateOperationsInput}),
});
export const ConferenceMemberUpdateManyMutationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.ConferenceMemberUpdateManyMutationInput>, false>('ConferenceMemberUpdateManyMutationInput').implement({
  fields: ConferenceMemberUpdateManyMutationInputFields,
});

export const CommitteeCreateInputFields = (t: any) => ({
  id: t.string({"required":false}),
  name: t.string({"required":true}),
  abbreviation: t.string({"required":true}),
  category: t.field({"required":true,"type":CommitteeCategory}),
  conferenceId: t.string({"required":true}),
  parentId: t.string({"required":false}),
  whiteboardContent: t.string({"required":false}),
  status: t.field({"required":false,"type":CommitteeStatus}),
  stateOfDebate: t.string({"required":false}),
  statusHeadline: t.string({"required":false}),
  statusUntil: t.field({"required":false,"type":DateTime}),
  allowDelegationsToAddThemselvesToSpeakersList: t.boolean({"required":false}),
  members: t.field({"required":false,"type":CommitteeMemberCreateNestedManyWithoutCommitteeInput}),
  subCommittees: t.field({"required":false,"type":CommitteeCreateNestedManyWithoutParentInput}),
  messages: t.field({"required":false,"type":MessageCreateNestedManyWithoutCommitteeInput}),
  agendaItems: t.field({"required":false,"type":AgendaItemCreateNestedManyWithoutCommitteeInput}),
});
export const CommitteeCreateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.CommitteeUncheckedCreateInput>, false>('CommitteeCreateInput').implement({
  fields: CommitteeCreateInputFields,
});

export const CommitteeUpdateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  name: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  abbreviation: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  category: t.field({"required":false,"type":EnumCommitteeCategoryFieldUpdateOperationsInput}),
  conferenceId: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  parentId: t.field({"required":false,"type":NullableStringFieldUpdateOperationsInput}),
  whiteboardContent: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  status: t.field({"required":false,"type":EnumCommitteeStatusFieldUpdateOperationsInput}),
  stateOfDebate: t.field({"required":false,"type":NullableStringFieldUpdateOperationsInput}),
  statusHeadline: t.field({"required":false,"type":NullableStringFieldUpdateOperationsInput}),
  statusUntil: t.field({"required":false,"type":NullableDateTimeFieldUpdateOperationsInput}),
  allowDelegationsToAddThemselvesToSpeakersList: t.field({"required":false,"type":BoolFieldUpdateOperationsInput}),
  members: t.field({"required":false,"type":CommitteeMemberUpdateManyWithoutCommitteeNestedInput}),
  subCommittees: t.field({"required":false,"type":CommitteeUpdateManyWithoutParentNestedInput}),
  messages: t.field({"required":false,"type":MessageUpdateManyWithoutCommitteeNestedInput}),
  agendaItems: t.field({"required":false,"type":AgendaItemUpdateManyWithoutCommitteeNestedInput}),
});
export const CommitteeUpdateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.CommitteeUncheckedUpdateInput>, false>('CommitteeUpdateInput').implement({
  fields: CommitteeUpdateInputFields,
});

export const CommitteeUpdateManyMutationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  name: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  abbreviation: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  category: t.field({"required":false,"type":EnumCommitteeCategoryFieldUpdateOperationsInput}),
  whiteboardContent: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  status: t.field({"required":false,"type":EnumCommitteeStatusFieldUpdateOperationsInput}),
  stateOfDebate: t.field({"required":false,"type":NullableStringFieldUpdateOperationsInput}),
  statusHeadline: t.field({"required":false,"type":NullableStringFieldUpdateOperationsInput}),
  statusUntil: t.field({"required":false,"type":NullableDateTimeFieldUpdateOperationsInput}),
  allowDelegationsToAddThemselvesToSpeakersList: t.field({"required":false,"type":BoolFieldUpdateOperationsInput}),
});
export const CommitteeUpdateManyMutationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.CommitteeUpdateManyMutationInput>, false>('CommitteeUpdateManyMutationInput').implement({
  fields: CommitteeUpdateManyMutationInputFields,
});

export const CommitteeMemberCreateInputFields = (t: any) => ({
  id: t.string({"required":false}),
  committeeId: t.string({"required":true}),
  userId: t.string({"required":false}),
  delegationId: t.string({"required":false}),
  presence: t.field({"required":false,"type":Presence}),
  speakerLists: t.field({"required":false,"type":SpeakerOnListCreateNestedManyWithoutCommitteeMemberInput}),
});
export const CommitteeMemberCreateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.CommitteeMemberUncheckedCreateInput>, false>('CommitteeMemberCreateInput').implement({
  fields: CommitteeMemberCreateInputFields,
});

export const CommitteeMemberUpdateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  committeeId: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  userId: t.field({"required":false,"type":NullableStringFieldUpdateOperationsInput}),
  delegationId: t.field({"required":false,"type":NullableStringFieldUpdateOperationsInput}),
  presence: t.field({"required":false,"type":EnumPresenceFieldUpdateOperationsInput}),
  speakerLists: t.field({"required":false,"type":SpeakerOnListUpdateManyWithoutCommitteeMemberNestedInput}),
});
export const CommitteeMemberUpdateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.CommitteeMemberUncheckedUpdateInput>, false>('CommitteeMemberUpdateInput').implement({
  fields: CommitteeMemberUpdateInputFields,
});

export const CommitteeMemberUpdateManyMutationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  presence: t.field({"required":false,"type":EnumPresenceFieldUpdateOperationsInput}),
});
export const CommitteeMemberUpdateManyMutationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.CommitteeMemberUpdateManyMutationInput>, false>('CommitteeMemberUpdateManyMutationInput').implement({
  fields: CommitteeMemberUpdateManyMutationInputFields,
});

export const AgendaItemCreateInputFields = (t: any) => ({
  id: t.string({"required":false}),
  committeeId: t.string({"required":true}),
  title: t.string({"required":true}),
  description: t.string({"required":false}),
  isActive: t.boolean({"required":false}),
  speakerLists: t.field({"required":false,"type":SpeakersListCreateNestedManyWithoutAgendaItemInput}),
});
export const AgendaItemCreateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.AgendaItemUncheckedCreateInput>, false>('AgendaItemCreateInput').implement({
  fields: AgendaItemCreateInputFields,
});

export const AgendaItemUpdateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  committeeId: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  title: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  description: t.field({"required":false,"type":NullableStringFieldUpdateOperationsInput}),
  isActive: t.field({"required":false,"type":BoolFieldUpdateOperationsInput}),
  speakerLists: t.field({"required":false,"type":SpeakersListUpdateManyWithoutAgendaItemNestedInput}),
});
export const AgendaItemUpdateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.AgendaItemUncheckedUpdateInput>, false>('AgendaItemUpdateInput').implement({
  fields: AgendaItemUpdateInputFields,
});

export const AgendaItemUpdateManyMutationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  title: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  description: t.field({"required":false,"type":NullableStringFieldUpdateOperationsInput}),
  isActive: t.field({"required":false,"type":BoolFieldUpdateOperationsInput}),
});
export const AgendaItemUpdateManyMutationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.AgendaItemUpdateManyMutationInput>, false>('AgendaItemUpdateManyMutationInput').implement({
  fields: AgendaItemUpdateManyMutationInputFields,
});

export const SpeakersListCreateInputFields = (t: any) => ({
  id: t.string({"required":false}),
  agendaItemId: t.string({"required":true}),
  type: t.field({"required":true,"type":SpeakersListCategory}),
  speakingTime: t.int({"required":true}),
  timeLeft: t.int({"required":false}),
  startTimestamp: t.field({"required":false,"type":DateTime}),
  isClosed: t.boolean({"required":false}),
  speakers: t.field({"required":false,"type":SpeakerOnListCreateNestedManyWithoutSpeakersListInput}),
});
export const SpeakersListCreateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SpeakersListUncheckedCreateInput>, false>('SpeakersListCreateInput').implement({
  fields: SpeakersListCreateInputFields,
});

export const SpeakersListUpdateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  agendaItemId: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  type: t.field({"required":false,"type":EnumSpeakersListCategoryFieldUpdateOperationsInput}),
  speakingTime: t.field({"required":false,"type":IntFieldUpdateOperationsInput}),
  timeLeft: t.field({"required":false,"type":NullableIntFieldUpdateOperationsInput}),
  startTimestamp: t.field({"required":false,"type":NullableDateTimeFieldUpdateOperationsInput}),
  isClosed: t.field({"required":false,"type":BoolFieldUpdateOperationsInput}),
  speakers: t.field({"required":false,"type":SpeakerOnListUpdateManyWithoutSpeakersListNestedInput}),
});
export const SpeakersListUpdateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SpeakersListUncheckedUpdateInput>, false>('SpeakersListUpdateInput').implement({
  fields: SpeakersListUpdateInputFields,
});

export const SpeakersListUpdateManyMutationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  type: t.field({"required":false,"type":EnumSpeakersListCategoryFieldUpdateOperationsInput}),
  speakingTime: t.field({"required":false,"type":IntFieldUpdateOperationsInput}),
  timeLeft: t.field({"required":false,"type":NullableIntFieldUpdateOperationsInput}),
  startTimestamp: t.field({"required":false,"type":NullableDateTimeFieldUpdateOperationsInput}),
  isClosed: t.field({"required":false,"type":BoolFieldUpdateOperationsInput}),
});
export const SpeakersListUpdateManyMutationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SpeakersListUpdateManyMutationInput>, false>('SpeakersListUpdateManyMutationInput').implement({
  fields: SpeakersListUpdateManyMutationInputFields,
});

export const SpeakerOnListCreateInputFields = (t: any) => ({
  id: t.string({"required":false}),
  speakersListId: t.string({"required":true}),
  committeeMemberId: t.string({"required":true}),
  position: t.int({"required":true}),
});
export const SpeakerOnListCreateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SpeakerOnListUncheckedCreateInput>, false>('SpeakerOnListCreateInput').implement({
  fields: SpeakerOnListCreateInputFields,
});

export const SpeakerOnListUpdateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  speakersListId: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  committeeMemberId: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  position: t.field({"required":false,"type":IntFieldUpdateOperationsInput}),
});
export const SpeakerOnListUpdateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SpeakerOnListUncheckedUpdateInput>, false>('SpeakerOnListUpdateInput').implement({
  fields: SpeakerOnListUpdateInputFields,
});

export const SpeakerOnListUpdateManyMutationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  position: t.field({"required":false,"type":IntFieldUpdateOperationsInput}),
});
export const SpeakerOnListUpdateManyMutationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SpeakerOnListUpdateManyMutationInput>, false>('SpeakerOnListUpdateManyMutationInput').implement({
  fields: SpeakerOnListUpdateManyMutationInputFields,
});

export const DelegationCreateInputFields = (t: any) => ({
  id: t.string({"required":false}),
  conferenceId: t.string({"required":true}),
  nationId: t.string({"required":true}),
  members: t.field({"required":false,"type":CommitteeMemberCreateNestedManyWithoutDelegationInput}),
});
export const DelegationCreateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.DelegationUncheckedCreateInput>, false>('DelegationCreateInput').implement({
  fields: DelegationCreateInputFields,
});

export const DelegationUpdateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  conferenceId: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  nationId: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  members: t.field({"required":false,"type":CommitteeMemberUpdateManyWithoutDelegationNestedInput}),
});
export const DelegationUpdateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.DelegationUncheckedUpdateInput>, false>('DelegationUpdateInput').implement({
  fields: DelegationUpdateInputFields,
});

export const DelegationUpdateManyMutationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
});
export const DelegationUpdateManyMutationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.DelegationUpdateManyMutationInput>, false>('DelegationUpdateManyMutationInput').implement({
  fields: DelegationUpdateManyMutationInputFields,
});

export const NationCreateInputFields = (t: any) => ({
  id: t.string({"required":false}),
  alpha3Code: t.string({"required":true}),
  variant: t.field({"required":false,"type":NationVariant}),
  delegations: t.field({"required":false,"type":DelegationCreateNestedManyWithoutNationInput}),
});
export const NationCreateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NationUncheckedCreateInput>, false>('NationCreateInput').implement({
  fields: NationCreateInputFields,
});

export const NationUpdateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  alpha3Code: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  variant: t.field({"required":false,"type":EnumNationVariantFieldUpdateOperationsInput}),
  delegations: t.field({"required":false,"type":DelegationUpdateManyWithoutNationNestedInput}),
});
export const NationUpdateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NationUncheckedUpdateInput>, false>('NationUpdateInput').implement({
  fields: NationUpdateInputFields,
});

export const NationUpdateManyMutationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  alpha3Code: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  variant: t.field({"required":false,"type":EnumNationVariantFieldUpdateOperationsInput}),
});
export const NationUpdateManyMutationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NationUpdateManyMutationInput>, false>('NationUpdateManyMutationInput').implement({
  fields: NationUpdateManyMutationInputFields,
});

export const MessageCreateInputFields = (t: any) => ({
  id: t.string({"required":false}),
  subject: t.string({"required":true}),
  category: t.field({"required":false,"type":MessageCategory}),
  message: t.string({"required":true}),
  committeeId: t.string({"required":true}),
  authorId: t.string({"required":true}),
  timestamp: t.field({"required":true,"type":DateTime}),
  status: t.field({"required":false,"type":[MessageStatus]}),
  forwarded: t.boolean({"required":false}),
  metaEmail: t.string({"required":false}),
  metaDelegation: t.string({"required":false}),
  metaCommittee: t.string({"required":false}),
  metaAgendaItem: t.string({"required":false}),
});
export const MessageCreateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.MessageUncheckedCreateInput>, false>('MessageCreateInput').implement({
  fields: MessageCreateInputFields,
});

export const MessageUpdateInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  subject: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  category: t.field({"required":false,"type":EnumMessageCategoryFieldUpdateOperationsInput}),
  message: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  committeeId: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  authorId: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  timestamp: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  status: t.field({"required":false,"type":[MessageStatus]}),
  forwarded: t.field({"required":false,"type":BoolFieldUpdateOperationsInput}),
  metaEmail: t.field({"required":false,"type":NullableStringFieldUpdateOperationsInput}),
  metaDelegation: t.field({"required":false,"type":NullableStringFieldUpdateOperationsInput}),
  metaCommittee: t.field({"required":false,"type":NullableStringFieldUpdateOperationsInput}),
  metaAgendaItem: t.field({"required":false,"type":NullableStringFieldUpdateOperationsInput}),
});
export const MessageUpdateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.MessageUncheckedUpdateInput>, false>('MessageUpdateInput').implement({
  fields: MessageUpdateInputFields,
});

export const MessageUpdateManyMutationInputFields = (t: any) => ({
  id: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  subject: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  category: t.field({"required":false,"type":EnumMessageCategoryFieldUpdateOperationsInput}),
  message: t.field({"required":false,"type":StringFieldUpdateOperationsInput}),
  timestamp: t.field({"required":false,"type":DateTimeFieldUpdateOperationsInput}),
  status: t.field({"required":false,"type":[MessageStatus]}),
  forwarded: t.field({"required":false,"type":BoolFieldUpdateOperationsInput}),
  metaEmail: t.field({"required":false,"type":NullableStringFieldUpdateOperationsInput}),
  metaDelegation: t.field({"required":false,"type":NullableStringFieldUpdateOperationsInput}),
  metaCommittee: t.field({"required":false,"type":NullableStringFieldUpdateOperationsInput}),
  metaAgendaItem: t.field({"required":false,"type":NullableStringFieldUpdateOperationsInput}),
});
export const MessageUpdateManyMutationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.MessageUpdateManyMutationInput>, false>('MessageUpdateManyMutationInput').implement({
  fields: MessageUpdateManyMutationInputFields,
});

export const StringFilterFields = (t: any) => ({
  equals: t.string({"required":false}),
  in: t.stringList({"required":false}),
  notIn: t.stringList({"required":false}),
  lt: t.string({"required":false}),
  lte: t.string({"required":false}),
  gt: t.string({"required":false}),
  gte: t.string({"required":false}),
  contains: t.string({"required":false}),
  startsWith: t.string({"required":false}),
  endsWith: t.string({"required":false}),
  mode: t.field({"required":false,"type":QueryMode}),
  not: t.field({"required":false,"type":NestedStringFilter}),
});
export const StringFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.StringFilter>, false>('StringFilter').implement({
  fields: StringFilterFields,
});

export const ConferenceMemberListRelationFilterFields = (t: any) => ({
  every: t.field({"required":false,"type":ConferenceMemberWhereInput}),
  some: t.field({"required":false,"type":ConferenceMemberWhereInput}),
  none: t.field({"required":false,"type":ConferenceMemberWhereInput}),
});
export const ConferenceMemberListRelationFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.ConferenceMemberListRelationFilter>, false>('ConferenceMemberListRelationFilter').implement({
  fields: ConferenceMemberListRelationFilterFields,
});

export const CommitteeMemberListRelationFilterFields = (t: any) => ({
  every: t.field({"required":false,"type":CommitteeMemberWhereInput}),
  some: t.field({"required":false,"type":CommitteeMemberWhereInput}),
  none: t.field({"required":false,"type":CommitteeMemberWhereInput}),
});
export const CommitteeMemberListRelationFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.CommitteeMemberListRelationFilter>, false>('CommitteeMemberListRelationFilter').implement({
  fields: CommitteeMemberListRelationFilterFields,
});

export const MessageListRelationFilterFields = (t: any) => ({
  every: t.field({"required":false,"type":MessageWhereInput}),
  some: t.field({"required":false,"type":MessageWhereInput}),
  none: t.field({"required":false,"type":MessageWhereInput}),
});
export const MessageListRelationFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.MessageListRelationFilter>, false>('MessageListRelationFilter').implement({
  fields: MessageListRelationFilterFields,
});

export const ConferenceMemberOrderByRelationAggregateInputFields = (t: any) => ({
  _count: t.field({"required":false,"type":SortOrder}),
});
export const ConferenceMemberOrderByRelationAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.ConferenceMemberOrderByRelationAggregateInput>, false>('ConferenceMemberOrderByRelationAggregateInput').implement({
  fields: ConferenceMemberOrderByRelationAggregateInputFields,
});

export const CommitteeMemberOrderByRelationAggregateInputFields = (t: any) => ({
  _count: t.field({"required":false,"type":SortOrder}),
});
export const CommitteeMemberOrderByRelationAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.CommitteeMemberOrderByRelationAggregateInput>, false>('CommitteeMemberOrderByRelationAggregateInput').implement({
  fields: CommitteeMemberOrderByRelationAggregateInputFields,
});

export const MessageOrderByRelationAggregateInputFields = (t: any) => ({
  _count: t.field({"required":false,"type":SortOrder}),
});
export const MessageOrderByRelationAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.MessageOrderByRelationAggregateInput>, false>('MessageOrderByRelationAggregateInput').implement({
  fields: MessageOrderByRelationAggregateInputFields,
});

export const StringWithAggregatesFilterFields = (t: any) => ({
  equals: t.string({"required":false}),
  in: t.stringList({"required":false}),
  notIn: t.stringList({"required":false}),
  lt: t.string({"required":false}),
  lte: t.string({"required":false}),
  gt: t.string({"required":false}),
  gte: t.string({"required":false}),
  contains: t.string({"required":false}),
  startsWith: t.string({"required":false}),
  endsWith: t.string({"required":false}),
  mode: t.field({"required":false,"type":QueryMode}),
  not: t.field({"required":false,"type":NestedStringWithAggregatesFilter}),
  _count: t.field({"required":false,"type":NestedIntFilter}),
  _min: t.field({"required":false,"type":NestedStringFilter}),
  _max: t.field({"required":false,"type":NestedStringFilter}),
});
export const StringWithAggregatesFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.StringWithAggregatesFilter>, false>('StringWithAggregatesFilter').implement({
  fields: StringWithAggregatesFilterFields,
});

export const DateTimeNullableFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":DateTime}),
  in: t.field({"required":false,"type":[DateTime]}),
  notIn: t.field({"required":false,"type":[DateTime]}),
  lt: t.field({"required":false,"type":DateTime}),
  lte: t.field({"required":false,"type":DateTime}),
  gt: t.field({"required":false,"type":DateTime}),
  gte: t.field({"required":false,"type":DateTime}),
  not: t.field({"required":false,"type":NestedDateTimeNullableFilter}),
});
export const DateTimeNullableFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.DateTimeNullableFilter>, false>('DateTimeNullableFilter').implement({
  fields: DateTimeNullableFilterFields,
});

export const StringNullableFilterFields = (t: any) => ({
  equals: t.string({"required":false}),
  in: t.stringList({"required":false}),
  notIn: t.stringList({"required":false}),
  lt: t.string({"required":false}),
  lte: t.string({"required":false}),
  gt: t.string({"required":false}),
  gte: t.string({"required":false}),
  contains: t.string({"required":false}),
  startsWith: t.string({"required":false}),
  endsWith: t.string({"required":false}),
  mode: t.field({"required":false,"type":QueryMode}),
  not: t.field({"required":false,"type":NestedStringNullableFilter}),
});
export const StringNullableFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.StringNullableFilter>, false>('StringNullableFilter').implement({
  fields: StringNullableFilterFields,
});

export const DelegationListRelationFilterFields = (t: any) => ({
  every: t.field({"required":false,"type":DelegationWhereInput}),
  some: t.field({"required":false,"type":DelegationWhereInput}),
  none: t.field({"required":false,"type":DelegationWhereInput}),
});
export const DelegationListRelationFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.DelegationListRelationFilter>, false>('DelegationListRelationFilter').implement({
  fields: DelegationListRelationFilterFields,
});

export const CommitteeListRelationFilterFields = (t: any) => ({
  every: t.field({"required":false,"type":CommitteeWhereInput}),
  some: t.field({"required":false,"type":CommitteeWhereInput}),
  none: t.field({"required":false,"type":CommitteeWhereInput}),
});
export const CommitteeListRelationFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.CommitteeListRelationFilter>, false>('CommitteeListRelationFilter').implement({
  fields: CommitteeListRelationFilterFields,
});

export const DelegationOrderByRelationAggregateInputFields = (t: any) => ({
  _count: t.field({"required":false,"type":SortOrder}),
});
export const DelegationOrderByRelationAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.DelegationOrderByRelationAggregateInput>, false>('DelegationOrderByRelationAggregateInput').implement({
  fields: DelegationOrderByRelationAggregateInputFields,
});

export const CommitteeOrderByRelationAggregateInputFields = (t: any) => ({
  _count: t.field({"required":false,"type":SortOrder}),
});
export const CommitteeOrderByRelationAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.CommitteeOrderByRelationAggregateInput>, false>('CommitteeOrderByRelationAggregateInput').implement({
  fields: CommitteeOrderByRelationAggregateInputFields,
});

export const DateTimeNullableWithAggregatesFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":DateTime}),
  in: t.field({"required":false,"type":[DateTime]}),
  notIn: t.field({"required":false,"type":[DateTime]}),
  lt: t.field({"required":false,"type":DateTime}),
  lte: t.field({"required":false,"type":DateTime}),
  gt: t.field({"required":false,"type":DateTime}),
  gte: t.field({"required":false,"type":DateTime}),
  not: t.field({"required":false,"type":NestedDateTimeNullableWithAggregatesFilter}),
  _count: t.field({"required":false,"type":NestedIntNullableFilter}),
  _min: t.field({"required":false,"type":NestedDateTimeNullableFilter}),
  _max: t.field({"required":false,"type":NestedDateTimeNullableFilter}),
});
export const DateTimeNullableWithAggregatesFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.DateTimeNullableWithAggregatesFilter>, false>('DateTimeNullableWithAggregatesFilter').implement({
  fields: DateTimeNullableWithAggregatesFilterFields,
});

export const StringNullableWithAggregatesFilterFields = (t: any) => ({
  equals: t.string({"required":false}),
  in: t.stringList({"required":false}),
  notIn: t.stringList({"required":false}),
  lt: t.string({"required":false}),
  lte: t.string({"required":false}),
  gt: t.string({"required":false}),
  gte: t.string({"required":false}),
  contains: t.string({"required":false}),
  startsWith: t.string({"required":false}),
  endsWith: t.string({"required":false}),
  mode: t.field({"required":false,"type":QueryMode}),
  not: t.field({"required":false,"type":NestedStringNullableWithAggregatesFilter}),
  _count: t.field({"required":false,"type":NestedIntNullableFilter}),
  _min: t.field({"required":false,"type":NestedStringNullableFilter}),
  _max: t.field({"required":false,"type":NestedStringNullableFilter}),
});
export const StringNullableWithAggregatesFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.StringNullableWithAggregatesFilter>, false>('StringNullableWithAggregatesFilter').implement({
  fields: StringNullableWithAggregatesFilterFields,
});

export const EnumConferenceRoleFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":ConferenceRole}),
  in: t.field({"required":false,"type":[ConferenceRole]}),
  notIn: t.field({"required":false,"type":[ConferenceRole]}),
  not: t.field({"required":false,"type":ConferenceRole}),
});
export const EnumConferenceRoleFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.EnumConferenceRoleFilter>, false>('EnumConferenceRoleFilter').implement({
  fields: EnumConferenceRoleFilterFields,
});

export const ConferenceRelationFilterFields = (t: any) => ({
  is: t.field({"required":false,"type":ConferenceWhereInput}),
  isNot: t.field({"required":false,"type":ConferenceWhereInput}),
});
export const ConferenceRelationFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.ConferenceRelationFilter>, false>('ConferenceRelationFilter').implement({
  fields: ConferenceRelationFilterFields,
});

export const UserNullableRelationFilterFields = (t: any) => ({
  is: t.field({"required":false,"type":UserWhereInput}),
  isNot: t.field({"required":false,"type":UserWhereInput}),
});
export const UserNullableRelationFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserNullableRelationFilter>, false>('UserNullableRelationFilter').implement({
  fields: UserNullableRelationFilterFields,
});

export const ConferenceMemberUserIdConferenceIdCompoundUniqueInputFields = (t: any) => ({
  userId: t.string({"required":true}),
  conferenceId: t.string({"required":true}),
});
export const ConferenceMemberUserIdConferenceIdCompoundUniqueInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.ConferenceMemberUserIdConferenceIdCompoundUniqueInput>, false>('ConferenceMemberUserIdConferenceIdCompoundUniqueInput').implement({
  fields: ConferenceMemberUserIdConferenceIdCompoundUniqueInputFields,
});

export const EnumConferenceRoleWithAggregatesFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":ConferenceRole}),
  in: t.field({"required":false,"type":[ConferenceRole]}),
  notIn: t.field({"required":false,"type":[ConferenceRole]}),
  not: t.field({"required":false,"type":ConferenceRole}),
  _count: t.field({"required":false,"type":NestedIntFilter}),
  _min: t.field({"required":false,"type":NestedEnumConferenceRoleFilter}),
  _max: t.field({"required":false,"type":NestedEnumConferenceRoleFilter}),
});
export const EnumConferenceRoleWithAggregatesFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.EnumConferenceRoleWithAggregatesFilter>, false>('EnumConferenceRoleWithAggregatesFilter').implement({
  fields: EnumConferenceRoleWithAggregatesFilterFields,
});

export const EnumCommitteeCategoryFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":CommitteeCategory}),
  in: t.field({"required":false,"type":[CommitteeCategory]}),
  notIn: t.field({"required":false,"type":[CommitteeCategory]}),
  not: t.field({"required":false,"type":CommitteeCategory}),
});
export const EnumCommitteeCategoryFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.EnumCommitteeCategoryFilter>, false>('EnumCommitteeCategoryFilter').implement({
  fields: EnumCommitteeCategoryFilterFields,
});

export const EnumCommitteeStatusFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":CommitteeStatus}),
  in: t.field({"required":false,"type":[CommitteeStatus]}),
  notIn: t.field({"required":false,"type":[CommitteeStatus]}),
  not: t.field({"required":false,"type":CommitteeStatus}),
});
export const EnumCommitteeStatusFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.EnumCommitteeStatusFilter>, false>('EnumCommitteeStatusFilter').implement({
  fields: EnumCommitteeStatusFilterFields,
});

export const BoolFilterFields = (t: any) => ({
  equals: t.boolean({"required":false}),
  not: t.field({"required":false,"type":NestedBoolFilter}),
});
export const BoolFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.BoolFilter>, false>('BoolFilter').implement({
  fields: BoolFilterFields,
});

export const CommitteeNullableRelationFilterFields = (t: any) => ({
  is: t.field({"required":false,"type":CommitteeWhereInput}),
  isNot: t.field({"required":false,"type":CommitteeWhereInput}),
});
export const CommitteeNullableRelationFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.CommitteeNullableRelationFilter>, false>('CommitteeNullableRelationFilter').implement({
  fields: CommitteeNullableRelationFilterFields,
});

export const AgendaItemListRelationFilterFields = (t: any) => ({
  every: t.field({"required":false,"type":AgendaItemWhereInput}),
  some: t.field({"required":false,"type":AgendaItemWhereInput}),
  none: t.field({"required":false,"type":AgendaItemWhereInput}),
});
export const AgendaItemListRelationFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.AgendaItemListRelationFilter>, false>('AgendaItemListRelationFilter').implement({
  fields: AgendaItemListRelationFilterFields,
});

export const AgendaItemOrderByRelationAggregateInputFields = (t: any) => ({
  _count: t.field({"required":false,"type":SortOrder}),
});
export const AgendaItemOrderByRelationAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.AgendaItemOrderByRelationAggregateInput>, false>('AgendaItemOrderByRelationAggregateInput').implement({
  fields: AgendaItemOrderByRelationAggregateInputFields,
});

export const CommitteeNameConferenceIdCompoundUniqueInputFields = (t: any) => ({
  name: t.string({"required":true}),
  conferenceId: t.string({"required":true}),
});
export const CommitteeNameConferenceIdCompoundUniqueInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.CommitteeNameConferenceIdCompoundUniqueInput>, false>('CommitteeNameConferenceIdCompoundUniqueInput').implement({
  fields: CommitteeNameConferenceIdCompoundUniqueInputFields,
});

export const CommitteeAbbreviationConferenceIdCompoundUniqueInputFields = (t: any) => ({
  abbreviation: t.string({"required":true}),
  conferenceId: t.string({"required":true}),
});
export const CommitteeAbbreviationConferenceIdCompoundUniqueInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.CommitteeAbbreviationConferenceIdCompoundUniqueInput>, false>('CommitteeAbbreviationConferenceIdCompoundUniqueInput').implement({
  fields: CommitteeAbbreviationConferenceIdCompoundUniqueInputFields,
});

export const EnumCommitteeCategoryWithAggregatesFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":CommitteeCategory}),
  in: t.field({"required":false,"type":[CommitteeCategory]}),
  notIn: t.field({"required":false,"type":[CommitteeCategory]}),
  not: t.field({"required":false,"type":CommitteeCategory}),
  _count: t.field({"required":false,"type":NestedIntFilter}),
  _min: t.field({"required":false,"type":NestedEnumCommitteeCategoryFilter}),
  _max: t.field({"required":false,"type":NestedEnumCommitteeCategoryFilter}),
});
export const EnumCommitteeCategoryWithAggregatesFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.EnumCommitteeCategoryWithAggregatesFilter>, false>('EnumCommitteeCategoryWithAggregatesFilter').implement({
  fields: EnumCommitteeCategoryWithAggregatesFilterFields,
});

export const EnumCommitteeStatusWithAggregatesFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":CommitteeStatus}),
  in: t.field({"required":false,"type":[CommitteeStatus]}),
  notIn: t.field({"required":false,"type":[CommitteeStatus]}),
  not: t.field({"required":false,"type":CommitteeStatus}),
  _count: t.field({"required":false,"type":NestedIntFilter}),
  _min: t.field({"required":false,"type":NestedEnumCommitteeStatusFilter}),
  _max: t.field({"required":false,"type":NestedEnumCommitteeStatusFilter}),
});
export const EnumCommitteeStatusWithAggregatesFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.EnumCommitteeStatusWithAggregatesFilter>, false>('EnumCommitteeStatusWithAggregatesFilter').implement({
  fields: EnumCommitteeStatusWithAggregatesFilterFields,
});

export const BoolWithAggregatesFilterFields = (t: any) => ({
  equals: t.boolean({"required":false}),
  not: t.field({"required":false,"type":NestedBoolWithAggregatesFilter}),
  _count: t.field({"required":false,"type":NestedIntFilter}),
  _min: t.field({"required":false,"type":NestedBoolFilter}),
  _max: t.field({"required":false,"type":NestedBoolFilter}),
});
export const BoolWithAggregatesFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.BoolWithAggregatesFilter>, false>('BoolWithAggregatesFilter').implement({
  fields: BoolWithAggregatesFilterFields,
});

export const EnumPresenceFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":Presence}),
  in: t.field({"required":false,"type":[Presence]}),
  notIn: t.field({"required":false,"type":[Presence]}),
  not: t.field({"required":false,"type":Presence}),
});
export const EnumPresenceFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.EnumPresenceFilter>, false>('EnumPresenceFilter').implement({
  fields: EnumPresenceFilterFields,
});

export const CommitteeRelationFilterFields = (t: any) => ({
  is: t.field({"required":false,"type":CommitteeWhereInput}),
  isNot: t.field({"required":false,"type":CommitteeWhereInput}),
});
export const CommitteeRelationFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.CommitteeRelationFilter>, false>('CommitteeRelationFilter').implement({
  fields: CommitteeRelationFilterFields,
});

export const SpeakerOnListListRelationFilterFields = (t: any) => ({
  every: t.field({"required":false,"type":SpeakerOnListWhereInput}),
  some: t.field({"required":false,"type":SpeakerOnListWhereInput}),
  none: t.field({"required":false,"type":SpeakerOnListWhereInput}),
});
export const SpeakerOnListListRelationFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SpeakerOnListListRelationFilter>, false>('SpeakerOnListListRelationFilter').implement({
  fields: SpeakerOnListListRelationFilterFields,
});

export const DelegationNullableRelationFilterFields = (t: any) => ({
  is: t.field({"required":false,"type":DelegationWhereInput}),
  isNot: t.field({"required":false,"type":DelegationWhereInput}),
});
export const DelegationNullableRelationFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.DelegationNullableRelationFilter>, false>('DelegationNullableRelationFilter').implement({
  fields: DelegationNullableRelationFilterFields,
});

export const SpeakerOnListOrderByRelationAggregateInputFields = (t: any) => ({
  _count: t.field({"required":false,"type":SortOrder}),
});
export const SpeakerOnListOrderByRelationAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SpeakerOnListOrderByRelationAggregateInput>, false>('SpeakerOnListOrderByRelationAggregateInput').implement({
  fields: SpeakerOnListOrderByRelationAggregateInputFields,
});

export const CommitteeMemberCommitteeIdDelegationIdCompoundUniqueInputFields = (t: any) => ({
  committeeId: t.string({"required":true}),
  delegationId: t.string({"required":true}),
});
export const CommitteeMemberCommitteeIdDelegationIdCompoundUniqueInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.CommitteeMemberCommitteeIdDelegationIdCompoundUniqueInput>, false>('CommitteeMemberCommitteeIdDelegationIdCompoundUniqueInput').implement({
  fields: CommitteeMemberCommitteeIdDelegationIdCompoundUniqueInputFields,
});

export const CommitteeMemberCommitteeIdUserIdCompoundUniqueInputFields = (t: any) => ({
  committeeId: t.string({"required":true}),
  userId: t.string({"required":true}),
});
export const CommitteeMemberCommitteeIdUserIdCompoundUniqueInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.CommitteeMemberCommitteeIdUserIdCompoundUniqueInput>, false>('CommitteeMemberCommitteeIdUserIdCompoundUniqueInput').implement({
  fields: CommitteeMemberCommitteeIdUserIdCompoundUniqueInputFields,
});

export const EnumPresenceWithAggregatesFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":Presence}),
  in: t.field({"required":false,"type":[Presence]}),
  notIn: t.field({"required":false,"type":[Presence]}),
  not: t.field({"required":false,"type":Presence}),
  _count: t.field({"required":false,"type":NestedIntFilter}),
  _min: t.field({"required":false,"type":NestedEnumPresenceFilter}),
  _max: t.field({"required":false,"type":NestedEnumPresenceFilter}),
});
export const EnumPresenceWithAggregatesFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.EnumPresenceWithAggregatesFilter>, false>('EnumPresenceWithAggregatesFilter').implement({
  fields: EnumPresenceWithAggregatesFilterFields,
});

export const SpeakersListListRelationFilterFields = (t: any) => ({
  every: t.field({"required":false,"type":SpeakersListWhereInput}),
  some: t.field({"required":false,"type":SpeakersListWhereInput}),
  none: t.field({"required":false,"type":SpeakersListWhereInput}),
});
export const SpeakersListListRelationFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SpeakersListListRelationFilter>, false>('SpeakersListListRelationFilter').implement({
  fields: SpeakersListListRelationFilterFields,
});

export const SpeakersListOrderByRelationAggregateInputFields = (t: any) => ({
  _count: t.field({"required":false,"type":SortOrder}),
});
export const SpeakersListOrderByRelationAggregateInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SpeakersListOrderByRelationAggregateInput>, false>('SpeakersListOrderByRelationAggregateInput').implement({
  fields: SpeakersListOrderByRelationAggregateInputFields,
});

export const EnumSpeakersListCategoryFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":SpeakersListCategory}),
  in: t.field({"required":false,"type":[SpeakersListCategory]}),
  notIn: t.field({"required":false,"type":[SpeakersListCategory]}),
  not: t.field({"required":false,"type":SpeakersListCategory}),
});
export const EnumSpeakersListCategoryFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.EnumSpeakersListCategoryFilter>, false>('EnumSpeakersListCategoryFilter').implement({
  fields: EnumSpeakersListCategoryFilterFields,
});

export const IntFilterFields = (t: any) => ({
  equals: t.int({"required":false}),
  in: t.intList({"required":false}),
  notIn: t.intList({"required":false}),
  lt: t.int({"required":false}),
  lte: t.int({"required":false}),
  gt: t.int({"required":false}),
  gte: t.int({"required":false}),
  not: t.field({"required":false,"type":NestedIntFilter}),
});
export const IntFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.IntFilter>, false>('IntFilter').implement({
  fields: IntFilterFields,
});

export const IntNullableFilterFields = (t: any) => ({
  equals: t.int({"required":false}),
  in: t.intList({"required":false}),
  notIn: t.intList({"required":false}),
  lt: t.int({"required":false}),
  lte: t.int({"required":false}),
  gt: t.int({"required":false}),
  gte: t.int({"required":false}),
  not: t.field({"required":false,"type":NestedIntNullableFilter}),
});
export const IntNullableFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.IntNullableFilter>, false>('IntNullableFilter').implement({
  fields: IntNullableFilterFields,
});

export const AgendaItemRelationFilterFields = (t: any) => ({
  is: t.field({"required":false,"type":AgendaItemWhereInput}),
  isNot: t.field({"required":false,"type":AgendaItemWhereInput}),
});
export const AgendaItemRelationFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.AgendaItemRelationFilter>, false>('AgendaItemRelationFilter').implement({
  fields: AgendaItemRelationFilterFields,
});

export const SpeakersListAgendaItemIdTypeCompoundUniqueInputFields = (t: any) => ({
  agendaItemId: t.string({"required":true}),
  type: t.field({"required":true,"type":SpeakersListCategory}),
});
export const SpeakersListAgendaItemIdTypeCompoundUniqueInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SpeakersListAgendaItemIdTypeCompoundUniqueInput>, false>('SpeakersListAgendaItemIdTypeCompoundUniqueInput').implement({
  fields: SpeakersListAgendaItemIdTypeCompoundUniqueInputFields,
});

export const EnumSpeakersListCategoryWithAggregatesFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":SpeakersListCategory}),
  in: t.field({"required":false,"type":[SpeakersListCategory]}),
  notIn: t.field({"required":false,"type":[SpeakersListCategory]}),
  not: t.field({"required":false,"type":SpeakersListCategory}),
  _count: t.field({"required":false,"type":NestedIntFilter}),
  _min: t.field({"required":false,"type":NestedEnumSpeakersListCategoryFilter}),
  _max: t.field({"required":false,"type":NestedEnumSpeakersListCategoryFilter}),
});
export const EnumSpeakersListCategoryWithAggregatesFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.EnumSpeakersListCategoryWithAggregatesFilter>, false>('EnumSpeakersListCategoryWithAggregatesFilter').implement({
  fields: EnumSpeakersListCategoryWithAggregatesFilterFields,
});

export const IntWithAggregatesFilterFields = (t: any) => ({
  equals: t.int({"required":false}),
  in: t.intList({"required":false}),
  notIn: t.intList({"required":false}),
  lt: t.int({"required":false}),
  lte: t.int({"required":false}),
  gt: t.int({"required":false}),
  gte: t.int({"required":false}),
  not: t.field({"required":false,"type":NestedIntWithAggregatesFilter}),
  _count: t.field({"required":false,"type":NestedIntFilter}),
  _avg: t.field({"required":false,"type":NestedFloatFilter}),
  _sum: t.field({"required":false,"type":NestedIntFilter}),
  _min: t.field({"required":false,"type":NestedIntFilter}),
  _max: t.field({"required":false,"type":NestedIntFilter}),
});
export const IntWithAggregatesFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.IntWithAggregatesFilter>, false>('IntWithAggregatesFilter').implement({
  fields: IntWithAggregatesFilterFields,
});

export const IntNullableWithAggregatesFilterFields = (t: any) => ({
  equals: t.int({"required":false}),
  in: t.intList({"required":false}),
  notIn: t.intList({"required":false}),
  lt: t.int({"required":false}),
  lte: t.int({"required":false}),
  gt: t.int({"required":false}),
  gte: t.int({"required":false}),
  not: t.field({"required":false,"type":NestedIntNullableWithAggregatesFilter}),
  _count: t.field({"required":false,"type":NestedIntNullableFilter}),
  _avg: t.field({"required":false,"type":NestedFloatNullableFilter}),
  _sum: t.field({"required":false,"type":NestedIntNullableFilter}),
  _min: t.field({"required":false,"type":NestedIntNullableFilter}),
  _max: t.field({"required":false,"type":NestedIntNullableFilter}),
});
export const IntNullableWithAggregatesFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.IntNullableWithAggregatesFilter>, false>('IntNullableWithAggregatesFilter').implement({
  fields: IntNullableWithAggregatesFilterFields,
});

export const SpeakersListRelationFilterFields = (t: any) => ({
  is: t.field({"required":false,"type":SpeakersListWhereInput}),
  isNot: t.field({"required":false,"type":SpeakersListWhereInput}),
});
export const SpeakersListRelationFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SpeakersListRelationFilter>, false>('SpeakersListRelationFilter').implement({
  fields: SpeakersListRelationFilterFields,
});

export const CommitteeMemberRelationFilterFields = (t: any) => ({
  is: t.field({"required":false,"type":CommitteeMemberWhereInput}),
  isNot: t.field({"required":false,"type":CommitteeMemberWhereInput}),
});
export const CommitteeMemberRelationFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.CommitteeMemberRelationFilter>, false>('CommitteeMemberRelationFilter').implement({
  fields: CommitteeMemberRelationFilterFields,
});

export const SpeakerOnListSpeakersListIdPositionCompoundUniqueInputFields = (t: any) => ({
  speakersListId: t.string({"required":true}),
  position: t.int({"required":true}),
});
export const SpeakerOnListSpeakersListIdPositionCompoundUniqueInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SpeakerOnListSpeakersListIdPositionCompoundUniqueInput>, false>('SpeakerOnListSpeakersListIdPositionCompoundUniqueInput').implement({
  fields: SpeakerOnListSpeakersListIdPositionCompoundUniqueInputFields,
});

export const SpeakerOnListSpeakersListIdCommitteeMemberIdCompoundUniqueInputFields = (t: any) => ({
  speakersListId: t.string({"required":true}),
  committeeMemberId: t.string({"required":true}),
});
export const SpeakerOnListSpeakersListIdCommitteeMemberIdCompoundUniqueInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SpeakerOnListSpeakersListIdCommitteeMemberIdCompoundUniqueInput>, false>('SpeakerOnListSpeakersListIdCommitteeMemberIdCompoundUniqueInput').implement({
  fields: SpeakerOnListSpeakersListIdCommitteeMemberIdCompoundUniqueInputFields,
});

export const NationRelationFilterFields = (t: any) => ({
  is: t.field({"required":false,"type":NationWhereInput}),
  isNot: t.field({"required":false,"type":NationWhereInput}),
});
export const NationRelationFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NationRelationFilter>, false>('NationRelationFilter').implement({
  fields: NationRelationFilterFields,
});

export const DelegationConferenceIdNationIdCompoundUniqueInputFields = (t: any) => ({
  conferenceId: t.string({"required":true}),
  nationId: t.string({"required":true}),
});
export const DelegationConferenceIdNationIdCompoundUniqueInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.DelegationConferenceIdNationIdCompoundUniqueInput>, false>('DelegationConferenceIdNationIdCompoundUniqueInput').implement({
  fields: DelegationConferenceIdNationIdCompoundUniqueInputFields,
});

export const EnumNationVariantFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":NationVariant}),
  in: t.field({"required":false,"type":[NationVariant]}),
  notIn: t.field({"required":false,"type":[NationVariant]}),
  not: t.field({"required":false,"type":NationVariant}),
});
export const EnumNationVariantFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.EnumNationVariantFilter>, false>('EnumNationVariantFilter').implement({
  fields: EnumNationVariantFilterFields,
});

export const EnumNationVariantWithAggregatesFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":NationVariant}),
  in: t.field({"required":false,"type":[NationVariant]}),
  notIn: t.field({"required":false,"type":[NationVariant]}),
  not: t.field({"required":false,"type":NationVariant}),
  _count: t.field({"required":false,"type":NestedIntFilter}),
  _min: t.field({"required":false,"type":NestedEnumNationVariantFilter}),
  _max: t.field({"required":false,"type":NestedEnumNationVariantFilter}),
});
export const EnumNationVariantWithAggregatesFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.EnumNationVariantWithAggregatesFilter>, false>('EnumNationVariantWithAggregatesFilter').implement({
  fields: EnumNationVariantWithAggregatesFilterFields,
});

export const EnumMessageCategoryFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":MessageCategory}),
  in: t.field({"required":false,"type":[MessageCategory]}),
  notIn: t.field({"required":false,"type":[MessageCategory]}),
  not: t.field({"required":false,"type":MessageCategory}),
});
export const EnumMessageCategoryFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.EnumMessageCategoryFilter>, false>('EnumMessageCategoryFilter').implement({
  fields: EnumMessageCategoryFilterFields,
});

export const DateTimeFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":DateTime}),
  in: t.field({"required":false,"type":[DateTime]}),
  notIn: t.field({"required":false,"type":[DateTime]}),
  lt: t.field({"required":false,"type":DateTime}),
  lte: t.field({"required":false,"type":DateTime}),
  gt: t.field({"required":false,"type":DateTime}),
  gte: t.field({"required":false,"type":DateTime}),
  not: t.field({"required":false,"type":NestedDateTimeFilter}),
});
export const DateTimeFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.DateTimeFilter>, false>('DateTimeFilter').implement({
  fields: DateTimeFilterFields,
});

export const EnumMessageStatusNullableListFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":[MessageStatus]}),
  has: t.field({"required":false,"type":MessageStatus}),
  hasEvery: t.field({"required":false,"type":[MessageStatus]}),
  hasSome: t.field({"required":false,"type":[MessageStatus]}),
  isEmpty: t.boolean({"required":false}),
});
export const EnumMessageStatusNullableListFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.EnumMessageStatusNullableListFilter>, false>('EnumMessageStatusNullableListFilter').implement({
  fields: EnumMessageStatusNullableListFilterFields,
});

export const UserRelationFilterFields = (t: any) => ({
  is: t.field({"required":false,"type":UserWhereInput}),
  isNot: t.field({"required":false,"type":UserWhereInput}),
});
export const UserRelationFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.UserRelationFilter>, false>('UserRelationFilter').implement({
  fields: UserRelationFilterFields,
});

export const EnumMessageCategoryWithAggregatesFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":MessageCategory}),
  in: t.field({"required":false,"type":[MessageCategory]}),
  notIn: t.field({"required":false,"type":[MessageCategory]}),
  not: t.field({"required":false,"type":MessageCategory}),
  _count: t.field({"required":false,"type":NestedIntFilter}),
  _min: t.field({"required":false,"type":NestedEnumMessageCategoryFilter}),
  _max: t.field({"required":false,"type":NestedEnumMessageCategoryFilter}),
});
export const EnumMessageCategoryWithAggregatesFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.EnumMessageCategoryWithAggregatesFilter>, false>('EnumMessageCategoryWithAggregatesFilter').implement({
  fields: EnumMessageCategoryWithAggregatesFilterFields,
});

export const DateTimeWithAggregatesFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":DateTime}),
  in: t.field({"required":false,"type":[DateTime]}),
  notIn: t.field({"required":false,"type":[DateTime]}),
  lt: t.field({"required":false,"type":DateTime}),
  lte: t.field({"required":false,"type":DateTime}),
  gt: t.field({"required":false,"type":DateTime}),
  gte: t.field({"required":false,"type":DateTime}),
  not: t.field({"required":false,"type":NestedDateTimeWithAggregatesFilter}),
  _count: t.field({"required":false,"type":NestedIntFilter}),
  _min: t.field({"required":false,"type":NestedDateTimeFilter}),
  _max: t.field({"required":false,"type":NestedDateTimeFilter}),
});
export const DateTimeWithAggregatesFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.DateTimeWithAggregatesFilter>, false>('DateTimeWithAggregatesFilter').implement({
  fields: DateTimeWithAggregatesFilterFields,
});

export const ConferenceMemberCreateNestedManyWithoutUserInputFields = (t: any) => ({
  connect: t.field({"required":false,"type":[ConferenceMemberWhereUniqueInput]}),
  // 'create' was omitted due to `simple mode: true` found in global config
  // 'connectOrCreate' was omitted due to `simple mode: true` found in global config
  // 'createMany' was omitted due to `simple mode: true` found in global config
});
export const ConferenceMemberCreateNestedManyWithoutUserInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.ConferenceMemberCreateNestedManyWithoutUserInput>, false>('ConferenceMemberCreateNestedManyWithoutUserInput').implement({
  fields: ConferenceMemberCreateNestedManyWithoutUserInputFields,
});

export const CommitteeMemberCreateNestedManyWithoutUserInputFields = (t: any) => ({
  connect: t.field({"required":false,"type":[CommitteeMemberWhereUniqueInput]}),
  // 'create' was omitted due to `simple mode: true` found in global config
  // 'connectOrCreate' was omitted due to `simple mode: true` found in global config
  // 'createMany' was omitted due to `simple mode: true` found in global config
});
export const CommitteeMemberCreateNestedManyWithoutUserInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.CommitteeMemberCreateNestedManyWithoutUserInput>, false>('CommitteeMemberCreateNestedManyWithoutUserInput').implement({
  fields: CommitteeMemberCreateNestedManyWithoutUserInputFields,
});

export const MessageCreateNestedManyWithoutAuthorInputFields = (t: any) => ({
  connect: t.field({"required":false,"type":[MessageWhereUniqueInput]}),
  // 'create' was omitted due to `simple mode: true` found in global config
  // 'connectOrCreate' was omitted due to `simple mode: true` found in global config
  // 'createMany' was omitted due to `simple mode: true` found in global config
});
export const MessageCreateNestedManyWithoutAuthorInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.MessageCreateNestedManyWithoutAuthorInput>, false>('MessageCreateNestedManyWithoutAuthorInput').implement({
  fields: MessageCreateNestedManyWithoutAuthorInputFields,
});

export const StringFieldUpdateOperationsInputFields = (t: any) => ({
  set: t.string({"required":false}),
});
export const StringFieldUpdateOperationsInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.StringFieldUpdateOperationsInput>, false>('StringFieldUpdateOperationsInput').implement({
  fields: StringFieldUpdateOperationsInputFields,
});

export const ConferenceMemberUpdateManyWithoutUserNestedInputFields = (t: any) => ({
  set: t.field({"required":false,"type":[ConferenceMemberWhereUniqueInput]}),
  disconnect: t.field({"required":false,"type":[ConferenceMemberWhereUniqueInput]}),
  connect: t.field({"required":false,"type":[ConferenceMemberWhereUniqueInput]}),
  // 'create' was omitted due to `simple mode: true` found in global config
  // 'connectOrCreate' was omitted due to `simple mode: true` found in global config
  // 'upsert' was omitted due to `simple mode: true` found in global config
  // 'createMany' was omitted due to `simple mode: true` found in global config
  // 'delete' was omitted due to `simple mode: true` found in global config
  // 'update' was omitted due to `simple mode: true` found in global config
  // 'updateMany' was omitted due to `simple mode: true` found in global config
  // 'deleteMany' was omitted due to `simple mode: true` found in global config
});
export const ConferenceMemberUpdateManyWithoutUserNestedInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.ConferenceMemberUpdateManyWithoutUserNestedInput>, false>('ConferenceMemberUpdateManyWithoutUserNestedInput').implement({
  fields: ConferenceMemberUpdateManyWithoutUserNestedInputFields,
});

export const CommitteeMemberUpdateManyWithoutUserNestedInputFields = (t: any) => ({
  set: t.field({"required":false,"type":[CommitteeMemberWhereUniqueInput]}),
  disconnect: t.field({"required":false,"type":[CommitteeMemberWhereUniqueInput]}),
  connect: t.field({"required":false,"type":[CommitteeMemberWhereUniqueInput]}),
  // 'create' was omitted due to `simple mode: true` found in global config
  // 'connectOrCreate' was omitted due to `simple mode: true` found in global config
  // 'upsert' was omitted due to `simple mode: true` found in global config
  // 'createMany' was omitted due to `simple mode: true` found in global config
  // 'delete' was omitted due to `simple mode: true` found in global config
  // 'update' was omitted due to `simple mode: true` found in global config
  // 'updateMany' was omitted due to `simple mode: true` found in global config
  // 'deleteMany' was omitted due to `simple mode: true` found in global config
});
export const CommitteeMemberUpdateManyWithoutUserNestedInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.CommitteeMemberUpdateManyWithoutUserNestedInput>, false>('CommitteeMemberUpdateManyWithoutUserNestedInput').implement({
  fields: CommitteeMemberUpdateManyWithoutUserNestedInputFields,
});

export const MessageUpdateManyWithoutAuthorNestedInputFields = (t: any) => ({
  set: t.field({"required":false,"type":[MessageWhereUniqueInput]}),
  disconnect: t.field({"required":false,"type":[MessageWhereUniqueInput]}),
  connect: t.field({"required":false,"type":[MessageWhereUniqueInput]}),
  // 'create' was omitted due to `simple mode: true` found in global config
  // 'connectOrCreate' was omitted due to `simple mode: true` found in global config
  // 'upsert' was omitted due to `simple mode: true` found in global config
  // 'createMany' was omitted due to `simple mode: true` found in global config
  // 'delete' was omitted due to `simple mode: true` found in global config
  // 'update' was omitted due to `simple mode: true` found in global config
  // 'updateMany' was omitted due to `simple mode: true` found in global config
  // 'deleteMany' was omitted due to `simple mode: true` found in global config
});
export const MessageUpdateManyWithoutAuthorNestedInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.MessageUpdateManyWithoutAuthorNestedInput>, false>('MessageUpdateManyWithoutAuthorNestedInput').implement({
  fields: MessageUpdateManyWithoutAuthorNestedInputFields,
});

export const DelegationCreateNestedManyWithoutConferenceInputFields = (t: any) => ({
  connect: t.field({"required":false,"type":[DelegationWhereUniqueInput]}),
  // 'create' was omitted due to `simple mode: true` found in global config
  // 'connectOrCreate' was omitted due to `simple mode: true` found in global config
  // 'createMany' was omitted due to `simple mode: true` found in global config
});
export const DelegationCreateNestedManyWithoutConferenceInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.DelegationCreateNestedManyWithoutConferenceInput>, false>('DelegationCreateNestedManyWithoutConferenceInput').implement({
  fields: DelegationCreateNestedManyWithoutConferenceInputFields,
});

export const ConferenceMemberCreateNestedManyWithoutConferenceInputFields = (t: any) => ({
  connect: t.field({"required":false,"type":[ConferenceMemberWhereUniqueInput]}),
  // 'create' was omitted due to `simple mode: true` found in global config
  // 'connectOrCreate' was omitted due to `simple mode: true` found in global config
  // 'createMany' was omitted due to `simple mode: true` found in global config
});
export const ConferenceMemberCreateNestedManyWithoutConferenceInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.ConferenceMemberCreateNestedManyWithoutConferenceInput>, false>('ConferenceMemberCreateNestedManyWithoutConferenceInput').implement({
  fields: ConferenceMemberCreateNestedManyWithoutConferenceInputFields,
});

export const CommitteeCreateNestedManyWithoutConferenceInputFields = (t: any) => ({
  connect: t.field({"required":false,"type":[CommitteeWhereUniqueInput]}),
  // 'create' was omitted due to `simple mode: true` found in global config
  // 'connectOrCreate' was omitted due to `simple mode: true` found in global config
  // 'createMany' was omitted due to `simple mode: true` found in global config
});
export const CommitteeCreateNestedManyWithoutConferenceInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.CommitteeCreateNestedManyWithoutConferenceInput>, false>('CommitteeCreateNestedManyWithoutConferenceInput').implement({
  fields: CommitteeCreateNestedManyWithoutConferenceInputFields,
});

export const NullableDateTimeFieldUpdateOperationsInputFields = (t: any) => ({
  set: t.field({"required":false,"type":DateTime}),
});
export const NullableDateTimeFieldUpdateOperationsInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NullableDateTimeFieldUpdateOperationsInput>, false>('NullableDateTimeFieldUpdateOperationsInput').implement({
  fields: NullableDateTimeFieldUpdateOperationsInputFields,
});

export const NullableStringFieldUpdateOperationsInputFields = (t: any) => ({
  set: t.string({"required":false}),
});
export const NullableStringFieldUpdateOperationsInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NullableStringFieldUpdateOperationsInput>, false>('NullableStringFieldUpdateOperationsInput').implement({
  fields: NullableStringFieldUpdateOperationsInputFields,
});

export const DelegationUpdateManyWithoutConferenceNestedInputFields = (t: any) => ({
  set: t.field({"required":false,"type":[DelegationWhereUniqueInput]}),
  disconnect: t.field({"required":false,"type":[DelegationWhereUniqueInput]}),
  connect: t.field({"required":false,"type":[DelegationWhereUniqueInput]}),
  // 'create' was omitted due to `simple mode: true` found in global config
  // 'connectOrCreate' was omitted due to `simple mode: true` found in global config
  // 'upsert' was omitted due to `simple mode: true` found in global config
  // 'createMany' was omitted due to `simple mode: true` found in global config
  // 'delete' was omitted due to `simple mode: true` found in global config
  // 'update' was omitted due to `simple mode: true` found in global config
  // 'updateMany' was omitted due to `simple mode: true` found in global config
  // 'deleteMany' was omitted due to `simple mode: true` found in global config
});
export const DelegationUpdateManyWithoutConferenceNestedInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.DelegationUpdateManyWithoutConferenceNestedInput>, false>('DelegationUpdateManyWithoutConferenceNestedInput').implement({
  fields: DelegationUpdateManyWithoutConferenceNestedInputFields,
});

export const ConferenceMemberUpdateManyWithoutConferenceNestedInputFields = (t: any) => ({
  set: t.field({"required":false,"type":[ConferenceMemberWhereUniqueInput]}),
  disconnect: t.field({"required":false,"type":[ConferenceMemberWhereUniqueInput]}),
  connect: t.field({"required":false,"type":[ConferenceMemberWhereUniqueInput]}),
  // 'create' was omitted due to `simple mode: true` found in global config
  // 'connectOrCreate' was omitted due to `simple mode: true` found in global config
  // 'upsert' was omitted due to `simple mode: true` found in global config
  // 'createMany' was omitted due to `simple mode: true` found in global config
  // 'delete' was omitted due to `simple mode: true` found in global config
  // 'update' was omitted due to `simple mode: true` found in global config
  // 'updateMany' was omitted due to `simple mode: true` found in global config
  // 'deleteMany' was omitted due to `simple mode: true` found in global config
});
export const ConferenceMemberUpdateManyWithoutConferenceNestedInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.ConferenceMemberUpdateManyWithoutConferenceNestedInput>, false>('ConferenceMemberUpdateManyWithoutConferenceNestedInput').implement({
  fields: ConferenceMemberUpdateManyWithoutConferenceNestedInputFields,
});

export const CommitteeUpdateManyWithoutConferenceNestedInputFields = (t: any) => ({
  set: t.field({"required":false,"type":[CommitteeWhereUniqueInput]}),
  disconnect: t.field({"required":false,"type":[CommitteeWhereUniqueInput]}),
  connect: t.field({"required":false,"type":[CommitteeWhereUniqueInput]}),
  // 'create' was omitted due to `simple mode: true` found in global config
  // 'connectOrCreate' was omitted due to `simple mode: true` found in global config
  // 'upsert' was omitted due to `simple mode: true` found in global config
  // 'createMany' was omitted due to `simple mode: true` found in global config
  // 'delete' was omitted due to `simple mode: true` found in global config
  // 'update' was omitted due to `simple mode: true` found in global config
  // 'updateMany' was omitted due to `simple mode: true` found in global config
  // 'deleteMany' was omitted due to `simple mode: true` found in global config
});
export const CommitteeUpdateManyWithoutConferenceNestedInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.CommitteeUpdateManyWithoutConferenceNestedInput>, false>('CommitteeUpdateManyWithoutConferenceNestedInput').implement({
  fields: CommitteeUpdateManyWithoutConferenceNestedInputFields,
});

export const EnumConferenceRoleFieldUpdateOperationsInputFields = (t: any) => ({
  set: t.field({"required":false,"type":ConferenceRole}),
});
export const EnumConferenceRoleFieldUpdateOperationsInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.EnumConferenceRoleFieldUpdateOperationsInput>, false>('EnumConferenceRoleFieldUpdateOperationsInput').implement({
  fields: EnumConferenceRoleFieldUpdateOperationsInputFields,
});

export const CommitteeMemberCreateNestedManyWithoutCommitteeInputFields = (t: any) => ({
  connect: t.field({"required":false,"type":[CommitteeMemberWhereUniqueInput]}),
  // 'create' was omitted due to `simple mode: true` found in global config
  // 'connectOrCreate' was omitted due to `simple mode: true` found in global config
  // 'createMany' was omitted due to `simple mode: true` found in global config
});
export const CommitteeMemberCreateNestedManyWithoutCommitteeInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.CommitteeMemberCreateNestedManyWithoutCommitteeInput>, false>('CommitteeMemberCreateNestedManyWithoutCommitteeInput').implement({
  fields: CommitteeMemberCreateNestedManyWithoutCommitteeInputFields,
});

export const CommitteeCreateNestedManyWithoutParentInputFields = (t: any) => ({
  connect: t.field({"required":false,"type":[CommitteeWhereUniqueInput]}),
  // 'create' was omitted due to `simple mode: true` found in global config
  // 'connectOrCreate' was omitted due to `simple mode: true` found in global config
  // 'createMany' was omitted due to `simple mode: true` found in global config
});
export const CommitteeCreateNestedManyWithoutParentInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.CommitteeCreateNestedManyWithoutParentInput>, false>('CommitteeCreateNestedManyWithoutParentInput').implement({
  fields: CommitteeCreateNestedManyWithoutParentInputFields,
});

export const MessageCreateNestedManyWithoutCommitteeInputFields = (t: any) => ({
  connect: t.field({"required":false,"type":[MessageWhereUniqueInput]}),
  // 'create' was omitted due to `simple mode: true` found in global config
  // 'connectOrCreate' was omitted due to `simple mode: true` found in global config
  // 'createMany' was omitted due to `simple mode: true` found in global config
});
export const MessageCreateNestedManyWithoutCommitteeInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.MessageCreateNestedManyWithoutCommitteeInput>, false>('MessageCreateNestedManyWithoutCommitteeInput').implement({
  fields: MessageCreateNestedManyWithoutCommitteeInputFields,
});

export const AgendaItemCreateNestedManyWithoutCommitteeInputFields = (t: any) => ({
  connect: t.field({"required":false,"type":[AgendaItemWhereUniqueInput]}),
  // 'create' was omitted due to `simple mode: true` found in global config
  // 'connectOrCreate' was omitted due to `simple mode: true` found in global config
  // 'createMany' was omitted due to `simple mode: true` found in global config
});
export const AgendaItemCreateNestedManyWithoutCommitteeInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.AgendaItemCreateNestedManyWithoutCommitteeInput>, false>('AgendaItemCreateNestedManyWithoutCommitteeInput').implement({
  fields: AgendaItemCreateNestedManyWithoutCommitteeInputFields,
});

export const EnumCommitteeCategoryFieldUpdateOperationsInputFields = (t: any) => ({
  set: t.field({"required":false,"type":CommitteeCategory}),
});
export const EnumCommitteeCategoryFieldUpdateOperationsInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.EnumCommitteeCategoryFieldUpdateOperationsInput>, false>('EnumCommitteeCategoryFieldUpdateOperationsInput').implement({
  fields: EnumCommitteeCategoryFieldUpdateOperationsInputFields,
});

export const EnumCommitteeStatusFieldUpdateOperationsInputFields = (t: any) => ({
  set: t.field({"required":false,"type":CommitteeStatus}),
});
export const EnumCommitteeStatusFieldUpdateOperationsInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.EnumCommitteeStatusFieldUpdateOperationsInput>, false>('EnumCommitteeStatusFieldUpdateOperationsInput').implement({
  fields: EnumCommitteeStatusFieldUpdateOperationsInputFields,
});

export const BoolFieldUpdateOperationsInputFields = (t: any) => ({
  set: t.boolean({"required":false}),
});
export const BoolFieldUpdateOperationsInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.BoolFieldUpdateOperationsInput>, false>('BoolFieldUpdateOperationsInput').implement({
  fields: BoolFieldUpdateOperationsInputFields,
});

export const CommitteeMemberUpdateManyWithoutCommitteeNestedInputFields = (t: any) => ({
  set: t.field({"required":false,"type":[CommitteeMemberWhereUniqueInput]}),
  disconnect: t.field({"required":false,"type":[CommitteeMemberWhereUniqueInput]}),
  connect: t.field({"required":false,"type":[CommitteeMemberWhereUniqueInput]}),
  // 'create' was omitted due to `simple mode: true` found in global config
  // 'connectOrCreate' was omitted due to `simple mode: true` found in global config
  // 'upsert' was omitted due to `simple mode: true` found in global config
  // 'createMany' was omitted due to `simple mode: true` found in global config
  // 'delete' was omitted due to `simple mode: true` found in global config
  // 'update' was omitted due to `simple mode: true` found in global config
  // 'updateMany' was omitted due to `simple mode: true` found in global config
  // 'deleteMany' was omitted due to `simple mode: true` found in global config
});
export const CommitteeMemberUpdateManyWithoutCommitteeNestedInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.CommitteeMemberUpdateManyWithoutCommitteeNestedInput>, false>('CommitteeMemberUpdateManyWithoutCommitteeNestedInput').implement({
  fields: CommitteeMemberUpdateManyWithoutCommitteeNestedInputFields,
});

export const CommitteeUpdateManyWithoutParentNestedInputFields = (t: any) => ({
  set: t.field({"required":false,"type":[CommitteeWhereUniqueInput]}),
  disconnect: t.field({"required":false,"type":[CommitteeWhereUniqueInput]}),
  connect: t.field({"required":false,"type":[CommitteeWhereUniqueInput]}),
  // 'create' was omitted due to `simple mode: true` found in global config
  // 'connectOrCreate' was omitted due to `simple mode: true` found in global config
  // 'upsert' was omitted due to `simple mode: true` found in global config
  // 'createMany' was omitted due to `simple mode: true` found in global config
  // 'delete' was omitted due to `simple mode: true` found in global config
  // 'update' was omitted due to `simple mode: true` found in global config
  // 'updateMany' was omitted due to `simple mode: true` found in global config
  // 'deleteMany' was omitted due to `simple mode: true` found in global config
});
export const CommitteeUpdateManyWithoutParentNestedInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.CommitteeUpdateManyWithoutParentNestedInput>, false>('CommitteeUpdateManyWithoutParentNestedInput').implement({
  fields: CommitteeUpdateManyWithoutParentNestedInputFields,
});

export const MessageUpdateManyWithoutCommitteeNestedInputFields = (t: any) => ({
  set: t.field({"required":false,"type":[MessageWhereUniqueInput]}),
  disconnect: t.field({"required":false,"type":[MessageWhereUniqueInput]}),
  connect: t.field({"required":false,"type":[MessageWhereUniqueInput]}),
  // 'create' was omitted due to `simple mode: true` found in global config
  // 'connectOrCreate' was omitted due to `simple mode: true` found in global config
  // 'upsert' was omitted due to `simple mode: true` found in global config
  // 'createMany' was omitted due to `simple mode: true` found in global config
  // 'delete' was omitted due to `simple mode: true` found in global config
  // 'update' was omitted due to `simple mode: true` found in global config
  // 'updateMany' was omitted due to `simple mode: true` found in global config
  // 'deleteMany' was omitted due to `simple mode: true` found in global config
});
export const MessageUpdateManyWithoutCommitteeNestedInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.MessageUpdateManyWithoutCommitteeNestedInput>, false>('MessageUpdateManyWithoutCommitteeNestedInput').implement({
  fields: MessageUpdateManyWithoutCommitteeNestedInputFields,
});

export const AgendaItemUpdateManyWithoutCommitteeNestedInputFields = (t: any) => ({
  set: t.field({"required":false,"type":[AgendaItemWhereUniqueInput]}),
  disconnect: t.field({"required":false,"type":[AgendaItemWhereUniqueInput]}),
  connect: t.field({"required":false,"type":[AgendaItemWhereUniqueInput]}),
  // 'create' was omitted due to `simple mode: true` found in global config
  // 'connectOrCreate' was omitted due to `simple mode: true` found in global config
  // 'upsert' was omitted due to `simple mode: true` found in global config
  // 'createMany' was omitted due to `simple mode: true` found in global config
  // 'delete' was omitted due to `simple mode: true` found in global config
  // 'update' was omitted due to `simple mode: true` found in global config
  // 'updateMany' was omitted due to `simple mode: true` found in global config
  // 'deleteMany' was omitted due to `simple mode: true` found in global config
});
export const AgendaItemUpdateManyWithoutCommitteeNestedInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.AgendaItemUpdateManyWithoutCommitteeNestedInput>, false>('AgendaItemUpdateManyWithoutCommitteeNestedInput').implement({
  fields: AgendaItemUpdateManyWithoutCommitteeNestedInputFields,
});

export const SpeakerOnListCreateNestedManyWithoutCommitteeMemberInputFields = (t: any) => ({
  connect: t.field({"required":false,"type":[SpeakerOnListWhereUniqueInput]}),
  // 'create' was omitted due to `simple mode: true` found in global config
  // 'connectOrCreate' was omitted due to `simple mode: true` found in global config
  // 'createMany' was omitted due to `simple mode: true` found in global config
});
export const SpeakerOnListCreateNestedManyWithoutCommitteeMemberInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SpeakerOnListCreateNestedManyWithoutCommitteeMemberInput>, false>('SpeakerOnListCreateNestedManyWithoutCommitteeMemberInput').implement({
  fields: SpeakerOnListCreateNestedManyWithoutCommitteeMemberInputFields,
});

export const EnumPresenceFieldUpdateOperationsInputFields = (t: any) => ({
  set: t.field({"required":false,"type":Presence}),
});
export const EnumPresenceFieldUpdateOperationsInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.EnumPresenceFieldUpdateOperationsInput>, false>('EnumPresenceFieldUpdateOperationsInput').implement({
  fields: EnumPresenceFieldUpdateOperationsInputFields,
});

export const SpeakerOnListUpdateManyWithoutCommitteeMemberNestedInputFields = (t: any) => ({
  set: t.field({"required":false,"type":[SpeakerOnListWhereUniqueInput]}),
  disconnect: t.field({"required":false,"type":[SpeakerOnListWhereUniqueInput]}),
  connect: t.field({"required":false,"type":[SpeakerOnListWhereUniqueInput]}),
  // 'create' was omitted due to `simple mode: true` found in global config
  // 'connectOrCreate' was omitted due to `simple mode: true` found in global config
  // 'upsert' was omitted due to `simple mode: true` found in global config
  // 'createMany' was omitted due to `simple mode: true` found in global config
  // 'delete' was omitted due to `simple mode: true` found in global config
  // 'update' was omitted due to `simple mode: true` found in global config
  // 'updateMany' was omitted due to `simple mode: true` found in global config
  // 'deleteMany' was omitted due to `simple mode: true` found in global config
});
export const SpeakerOnListUpdateManyWithoutCommitteeMemberNestedInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SpeakerOnListUpdateManyWithoutCommitteeMemberNestedInput>, false>('SpeakerOnListUpdateManyWithoutCommitteeMemberNestedInput').implement({
  fields: SpeakerOnListUpdateManyWithoutCommitteeMemberNestedInputFields,
});

export const SpeakersListCreateNestedManyWithoutAgendaItemInputFields = (t: any) => ({
  connect: t.field({"required":false,"type":[SpeakersListWhereUniqueInput]}),
  // 'create' was omitted due to `simple mode: true` found in global config
  // 'connectOrCreate' was omitted due to `simple mode: true` found in global config
  // 'createMany' was omitted due to `simple mode: true` found in global config
});
export const SpeakersListCreateNestedManyWithoutAgendaItemInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SpeakersListCreateNestedManyWithoutAgendaItemInput>, false>('SpeakersListCreateNestedManyWithoutAgendaItemInput').implement({
  fields: SpeakersListCreateNestedManyWithoutAgendaItemInputFields,
});

export const SpeakersListUpdateManyWithoutAgendaItemNestedInputFields = (t: any) => ({
  set: t.field({"required":false,"type":[SpeakersListWhereUniqueInput]}),
  disconnect: t.field({"required":false,"type":[SpeakersListWhereUniqueInput]}),
  connect: t.field({"required":false,"type":[SpeakersListWhereUniqueInput]}),
  // 'create' was omitted due to `simple mode: true` found in global config
  // 'connectOrCreate' was omitted due to `simple mode: true` found in global config
  // 'upsert' was omitted due to `simple mode: true` found in global config
  // 'createMany' was omitted due to `simple mode: true` found in global config
  // 'delete' was omitted due to `simple mode: true` found in global config
  // 'update' was omitted due to `simple mode: true` found in global config
  // 'updateMany' was omitted due to `simple mode: true` found in global config
  // 'deleteMany' was omitted due to `simple mode: true` found in global config
});
export const SpeakersListUpdateManyWithoutAgendaItemNestedInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SpeakersListUpdateManyWithoutAgendaItemNestedInput>, false>('SpeakersListUpdateManyWithoutAgendaItemNestedInput').implement({
  fields: SpeakersListUpdateManyWithoutAgendaItemNestedInputFields,
});

export const SpeakerOnListCreateNestedManyWithoutSpeakersListInputFields = (t: any) => ({
  connect: t.field({"required":false,"type":[SpeakerOnListWhereUniqueInput]}),
  // 'create' was omitted due to `simple mode: true` found in global config
  // 'connectOrCreate' was omitted due to `simple mode: true` found in global config
  // 'createMany' was omitted due to `simple mode: true` found in global config
});
export const SpeakerOnListCreateNestedManyWithoutSpeakersListInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SpeakerOnListCreateNestedManyWithoutSpeakersListInput>, false>('SpeakerOnListCreateNestedManyWithoutSpeakersListInput').implement({
  fields: SpeakerOnListCreateNestedManyWithoutSpeakersListInputFields,
});

export const EnumSpeakersListCategoryFieldUpdateOperationsInputFields = (t: any) => ({
  set: t.field({"required":false,"type":SpeakersListCategory}),
});
export const EnumSpeakersListCategoryFieldUpdateOperationsInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.EnumSpeakersListCategoryFieldUpdateOperationsInput>, false>('EnumSpeakersListCategoryFieldUpdateOperationsInput').implement({
  fields: EnumSpeakersListCategoryFieldUpdateOperationsInputFields,
});

export const IntFieldUpdateOperationsInputFields = (t: any) => ({
  set: t.int({"required":false}),
  increment: t.int({"required":false}),
  decrement: t.int({"required":false}),
  multiply: t.int({"required":false}),
  divide: t.int({"required":false}),
});
export const IntFieldUpdateOperationsInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.IntFieldUpdateOperationsInput>, false>('IntFieldUpdateOperationsInput').implement({
  fields: IntFieldUpdateOperationsInputFields,
});

export const NullableIntFieldUpdateOperationsInputFields = (t: any) => ({
  set: t.int({"required":false}),
  increment: t.int({"required":false}),
  decrement: t.int({"required":false}),
  multiply: t.int({"required":false}),
  divide: t.int({"required":false}),
});
export const NullableIntFieldUpdateOperationsInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NullableIntFieldUpdateOperationsInput>, false>('NullableIntFieldUpdateOperationsInput').implement({
  fields: NullableIntFieldUpdateOperationsInputFields,
});

export const SpeakerOnListUpdateManyWithoutSpeakersListNestedInputFields = (t: any) => ({
  set: t.field({"required":false,"type":[SpeakerOnListWhereUniqueInput]}),
  disconnect: t.field({"required":false,"type":[SpeakerOnListWhereUniqueInput]}),
  connect: t.field({"required":false,"type":[SpeakerOnListWhereUniqueInput]}),
  // 'create' was omitted due to `simple mode: true` found in global config
  // 'connectOrCreate' was omitted due to `simple mode: true` found in global config
  // 'upsert' was omitted due to `simple mode: true` found in global config
  // 'createMany' was omitted due to `simple mode: true` found in global config
  // 'delete' was omitted due to `simple mode: true` found in global config
  // 'update' was omitted due to `simple mode: true` found in global config
  // 'updateMany' was omitted due to `simple mode: true` found in global config
  // 'deleteMany' was omitted due to `simple mode: true` found in global config
});
export const SpeakerOnListUpdateManyWithoutSpeakersListNestedInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.SpeakerOnListUpdateManyWithoutSpeakersListNestedInput>, false>('SpeakerOnListUpdateManyWithoutSpeakersListNestedInput').implement({
  fields: SpeakerOnListUpdateManyWithoutSpeakersListNestedInputFields,
});

export const CommitteeMemberCreateNestedManyWithoutDelegationInputFields = (t: any) => ({
  connect: t.field({"required":false,"type":[CommitteeMemberWhereUniqueInput]}),
  // 'create' was omitted due to `simple mode: true` found in global config
  // 'connectOrCreate' was omitted due to `simple mode: true` found in global config
  // 'createMany' was omitted due to `simple mode: true` found in global config
});
export const CommitteeMemberCreateNestedManyWithoutDelegationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.CommitteeMemberCreateNestedManyWithoutDelegationInput>, false>('CommitteeMemberCreateNestedManyWithoutDelegationInput').implement({
  fields: CommitteeMemberCreateNestedManyWithoutDelegationInputFields,
});

export const CommitteeMemberUpdateManyWithoutDelegationNestedInputFields = (t: any) => ({
  set: t.field({"required":false,"type":[CommitteeMemberWhereUniqueInput]}),
  disconnect: t.field({"required":false,"type":[CommitteeMemberWhereUniqueInput]}),
  connect: t.field({"required":false,"type":[CommitteeMemberWhereUniqueInput]}),
  // 'create' was omitted due to `simple mode: true` found in global config
  // 'connectOrCreate' was omitted due to `simple mode: true` found in global config
  // 'upsert' was omitted due to `simple mode: true` found in global config
  // 'createMany' was omitted due to `simple mode: true` found in global config
  // 'delete' was omitted due to `simple mode: true` found in global config
  // 'update' was omitted due to `simple mode: true` found in global config
  // 'updateMany' was omitted due to `simple mode: true` found in global config
  // 'deleteMany' was omitted due to `simple mode: true` found in global config
});
export const CommitteeMemberUpdateManyWithoutDelegationNestedInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.CommitteeMemberUpdateManyWithoutDelegationNestedInput>, false>('CommitteeMemberUpdateManyWithoutDelegationNestedInput').implement({
  fields: CommitteeMemberUpdateManyWithoutDelegationNestedInputFields,
});

export const DelegationCreateNestedManyWithoutNationInputFields = (t: any) => ({
  connect: t.field({"required":false,"type":[DelegationWhereUniqueInput]}),
  // 'create' was omitted due to `simple mode: true` found in global config
  // 'connectOrCreate' was omitted due to `simple mode: true` found in global config
  // 'createMany' was omitted due to `simple mode: true` found in global config
});
export const DelegationCreateNestedManyWithoutNationInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.DelegationCreateNestedManyWithoutNationInput>, false>('DelegationCreateNestedManyWithoutNationInput').implement({
  fields: DelegationCreateNestedManyWithoutNationInputFields,
});

export const EnumNationVariantFieldUpdateOperationsInputFields = (t: any) => ({
  set: t.field({"required":false,"type":NationVariant}),
});
export const EnumNationVariantFieldUpdateOperationsInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.EnumNationVariantFieldUpdateOperationsInput>, false>('EnumNationVariantFieldUpdateOperationsInput').implement({
  fields: EnumNationVariantFieldUpdateOperationsInputFields,
});

export const DelegationUpdateManyWithoutNationNestedInputFields = (t: any) => ({
  set: t.field({"required":false,"type":[DelegationWhereUniqueInput]}),
  disconnect: t.field({"required":false,"type":[DelegationWhereUniqueInput]}),
  connect: t.field({"required":false,"type":[DelegationWhereUniqueInput]}),
  // 'create' was omitted due to `simple mode: true` found in global config
  // 'connectOrCreate' was omitted due to `simple mode: true` found in global config
  // 'upsert' was omitted due to `simple mode: true` found in global config
  // 'createMany' was omitted due to `simple mode: true` found in global config
  // 'delete' was omitted due to `simple mode: true` found in global config
  // 'update' was omitted due to `simple mode: true` found in global config
  // 'updateMany' was omitted due to `simple mode: true` found in global config
  // 'deleteMany' was omitted due to `simple mode: true` found in global config
});
export const DelegationUpdateManyWithoutNationNestedInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.DelegationUpdateManyWithoutNationNestedInput>, false>('DelegationUpdateManyWithoutNationNestedInput').implement({
  fields: DelegationUpdateManyWithoutNationNestedInputFields,
});

export const EnumMessageCategoryFieldUpdateOperationsInputFields = (t: any) => ({
  set: t.field({"required":false,"type":MessageCategory}),
});
export const EnumMessageCategoryFieldUpdateOperationsInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.EnumMessageCategoryFieldUpdateOperationsInput>, false>('EnumMessageCategoryFieldUpdateOperationsInput').implement({
  fields: EnumMessageCategoryFieldUpdateOperationsInputFields,
});

export const DateTimeFieldUpdateOperationsInputFields = (t: any) => ({
  set: t.field({"required":false,"type":DateTime}),
});
export const DateTimeFieldUpdateOperationsInput = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.DateTimeFieldUpdateOperationsInput>, false>('DateTimeFieldUpdateOperationsInput').implement({
  fields: DateTimeFieldUpdateOperationsInputFields,
});

export const NestedStringFilterFields = (t: any) => ({
  equals: t.string({"required":false}),
  in: t.stringList({"required":false}),
  notIn: t.stringList({"required":false}),
  lt: t.string({"required":false}),
  lte: t.string({"required":false}),
  gt: t.string({"required":false}),
  gte: t.string({"required":false}),
  contains: t.string({"required":false}),
  startsWith: t.string({"required":false}),
  endsWith: t.string({"required":false}),
  not: t.field({"required":false,"type":NestedStringFilter}),
});
export const NestedStringFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedStringFilter>, false>('NestedStringFilter').implement({
  fields: NestedStringFilterFields,
});

export const NestedStringWithAggregatesFilterFields = (t: any) => ({
  equals: t.string({"required":false}),
  in: t.stringList({"required":false}),
  notIn: t.stringList({"required":false}),
  lt: t.string({"required":false}),
  lte: t.string({"required":false}),
  gt: t.string({"required":false}),
  gte: t.string({"required":false}),
  contains: t.string({"required":false}),
  startsWith: t.string({"required":false}),
  endsWith: t.string({"required":false}),
  not: t.field({"required":false,"type":NestedStringWithAggregatesFilter}),
  _count: t.field({"required":false,"type":NestedIntFilter}),
  _min: t.field({"required":false,"type":NestedStringFilter}),
  _max: t.field({"required":false,"type":NestedStringFilter}),
});
export const NestedStringWithAggregatesFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedStringWithAggregatesFilter>, false>('NestedStringWithAggregatesFilter').implement({
  fields: NestedStringWithAggregatesFilterFields,
});

export const NestedIntFilterFields = (t: any) => ({
  equals: t.int({"required":false}),
  in: t.intList({"required":false}),
  notIn: t.intList({"required":false}),
  lt: t.int({"required":false}),
  lte: t.int({"required":false}),
  gt: t.int({"required":false}),
  gte: t.int({"required":false}),
  not: t.field({"required":false,"type":NestedIntFilter}),
});
export const NestedIntFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedIntFilter>, false>('NestedIntFilter').implement({
  fields: NestedIntFilterFields,
});

export const NestedDateTimeNullableFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":DateTime}),
  in: t.field({"required":false,"type":[DateTime]}),
  notIn: t.field({"required":false,"type":[DateTime]}),
  lt: t.field({"required":false,"type":DateTime}),
  lte: t.field({"required":false,"type":DateTime}),
  gt: t.field({"required":false,"type":DateTime}),
  gte: t.field({"required":false,"type":DateTime}),
  not: t.field({"required":false,"type":NestedDateTimeNullableFilter}),
});
export const NestedDateTimeNullableFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedDateTimeNullableFilter>, false>('NestedDateTimeNullableFilter').implement({
  fields: NestedDateTimeNullableFilterFields,
});

export const NestedStringNullableFilterFields = (t: any) => ({
  equals: t.string({"required":false}),
  in: t.stringList({"required":false}),
  notIn: t.stringList({"required":false}),
  lt: t.string({"required":false}),
  lte: t.string({"required":false}),
  gt: t.string({"required":false}),
  gte: t.string({"required":false}),
  contains: t.string({"required":false}),
  startsWith: t.string({"required":false}),
  endsWith: t.string({"required":false}),
  not: t.field({"required":false,"type":NestedStringNullableFilter}),
});
export const NestedStringNullableFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedStringNullableFilter>, false>('NestedStringNullableFilter').implement({
  fields: NestedStringNullableFilterFields,
});

export const NestedDateTimeNullableWithAggregatesFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":DateTime}),
  in: t.field({"required":false,"type":[DateTime]}),
  notIn: t.field({"required":false,"type":[DateTime]}),
  lt: t.field({"required":false,"type":DateTime}),
  lte: t.field({"required":false,"type":DateTime}),
  gt: t.field({"required":false,"type":DateTime}),
  gte: t.field({"required":false,"type":DateTime}),
  not: t.field({"required":false,"type":NestedDateTimeNullableWithAggregatesFilter}),
  _count: t.field({"required":false,"type":NestedIntNullableFilter}),
  _min: t.field({"required":false,"type":NestedDateTimeNullableFilter}),
  _max: t.field({"required":false,"type":NestedDateTimeNullableFilter}),
});
export const NestedDateTimeNullableWithAggregatesFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedDateTimeNullableWithAggregatesFilter>, false>('NestedDateTimeNullableWithAggregatesFilter').implement({
  fields: NestedDateTimeNullableWithAggregatesFilterFields,
});

export const NestedIntNullableFilterFields = (t: any) => ({
  equals: t.int({"required":false}),
  in: t.intList({"required":false}),
  notIn: t.intList({"required":false}),
  lt: t.int({"required":false}),
  lte: t.int({"required":false}),
  gt: t.int({"required":false}),
  gte: t.int({"required":false}),
  not: t.field({"required":false,"type":NestedIntNullableFilter}),
});
export const NestedIntNullableFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedIntNullableFilter>, false>('NestedIntNullableFilter').implement({
  fields: NestedIntNullableFilterFields,
});

export const NestedStringNullableWithAggregatesFilterFields = (t: any) => ({
  equals: t.string({"required":false}),
  in: t.stringList({"required":false}),
  notIn: t.stringList({"required":false}),
  lt: t.string({"required":false}),
  lte: t.string({"required":false}),
  gt: t.string({"required":false}),
  gte: t.string({"required":false}),
  contains: t.string({"required":false}),
  startsWith: t.string({"required":false}),
  endsWith: t.string({"required":false}),
  not: t.field({"required":false,"type":NestedStringNullableWithAggregatesFilter}),
  _count: t.field({"required":false,"type":NestedIntNullableFilter}),
  _min: t.field({"required":false,"type":NestedStringNullableFilter}),
  _max: t.field({"required":false,"type":NestedStringNullableFilter}),
});
export const NestedStringNullableWithAggregatesFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedStringNullableWithAggregatesFilter>, false>('NestedStringNullableWithAggregatesFilter').implement({
  fields: NestedStringNullableWithAggregatesFilterFields,
});

export const NestedEnumConferenceRoleFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":ConferenceRole}),
  in: t.field({"required":false,"type":[ConferenceRole]}),
  notIn: t.field({"required":false,"type":[ConferenceRole]}),
  not: t.field({"required":false,"type":ConferenceRole}),
});
export const NestedEnumConferenceRoleFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedEnumConferenceRoleFilter>, false>('NestedEnumConferenceRoleFilter').implement({
  fields: NestedEnumConferenceRoleFilterFields,
});

export const NestedEnumConferenceRoleWithAggregatesFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":ConferenceRole}),
  in: t.field({"required":false,"type":[ConferenceRole]}),
  notIn: t.field({"required":false,"type":[ConferenceRole]}),
  not: t.field({"required":false,"type":ConferenceRole}),
  _count: t.field({"required":false,"type":NestedIntFilter}),
  _min: t.field({"required":false,"type":NestedEnumConferenceRoleFilter}),
  _max: t.field({"required":false,"type":NestedEnumConferenceRoleFilter}),
});
export const NestedEnumConferenceRoleWithAggregatesFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedEnumConferenceRoleWithAggregatesFilter>, false>('NestedEnumConferenceRoleWithAggregatesFilter').implement({
  fields: NestedEnumConferenceRoleWithAggregatesFilterFields,
});

export const NestedEnumCommitteeCategoryFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":CommitteeCategory}),
  in: t.field({"required":false,"type":[CommitteeCategory]}),
  notIn: t.field({"required":false,"type":[CommitteeCategory]}),
  not: t.field({"required":false,"type":CommitteeCategory}),
});
export const NestedEnumCommitteeCategoryFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedEnumCommitteeCategoryFilter>, false>('NestedEnumCommitteeCategoryFilter').implement({
  fields: NestedEnumCommitteeCategoryFilterFields,
});

export const NestedEnumCommitteeStatusFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":CommitteeStatus}),
  in: t.field({"required":false,"type":[CommitteeStatus]}),
  notIn: t.field({"required":false,"type":[CommitteeStatus]}),
  not: t.field({"required":false,"type":CommitteeStatus}),
});
export const NestedEnumCommitteeStatusFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedEnumCommitteeStatusFilter>, false>('NestedEnumCommitteeStatusFilter').implement({
  fields: NestedEnumCommitteeStatusFilterFields,
});

export const NestedBoolFilterFields = (t: any) => ({
  equals: t.boolean({"required":false}),
  not: t.field({"required":false,"type":NestedBoolFilter}),
});
export const NestedBoolFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedBoolFilter>, false>('NestedBoolFilter').implement({
  fields: NestedBoolFilterFields,
});

export const NestedEnumCommitteeCategoryWithAggregatesFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":CommitteeCategory}),
  in: t.field({"required":false,"type":[CommitteeCategory]}),
  notIn: t.field({"required":false,"type":[CommitteeCategory]}),
  not: t.field({"required":false,"type":CommitteeCategory}),
  _count: t.field({"required":false,"type":NestedIntFilter}),
  _min: t.field({"required":false,"type":NestedEnumCommitteeCategoryFilter}),
  _max: t.field({"required":false,"type":NestedEnumCommitteeCategoryFilter}),
});
export const NestedEnumCommitteeCategoryWithAggregatesFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedEnumCommitteeCategoryWithAggregatesFilter>, false>('NestedEnumCommitteeCategoryWithAggregatesFilter').implement({
  fields: NestedEnumCommitteeCategoryWithAggregatesFilterFields,
});

export const NestedEnumCommitteeStatusWithAggregatesFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":CommitteeStatus}),
  in: t.field({"required":false,"type":[CommitteeStatus]}),
  notIn: t.field({"required":false,"type":[CommitteeStatus]}),
  not: t.field({"required":false,"type":CommitteeStatus}),
  _count: t.field({"required":false,"type":NestedIntFilter}),
  _min: t.field({"required":false,"type":NestedEnumCommitteeStatusFilter}),
  _max: t.field({"required":false,"type":NestedEnumCommitteeStatusFilter}),
});
export const NestedEnumCommitteeStatusWithAggregatesFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedEnumCommitteeStatusWithAggregatesFilter>, false>('NestedEnumCommitteeStatusWithAggregatesFilter').implement({
  fields: NestedEnumCommitteeStatusWithAggregatesFilterFields,
});

export const NestedBoolWithAggregatesFilterFields = (t: any) => ({
  equals: t.boolean({"required":false}),
  not: t.field({"required":false,"type":NestedBoolWithAggregatesFilter}),
  _count: t.field({"required":false,"type":NestedIntFilter}),
  _min: t.field({"required":false,"type":NestedBoolFilter}),
  _max: t.field({"required":false,"type":NestedBoolFilter}),
});
export const NestedBoolWithAggregatesFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedBoolWithAggregatesFilter>, false>('NestedBoolWithAggregatesFilter').implement({
  fields: NestedBoolWithAggregatesFilterFields,
});

export const NestedEnumPresenceFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":Presence}),
  in: t.field({"required":false,"type":[Presence]}),
  notIn: t.field({"required":false,"type":[Presence]}),
  not: t.field({"required":false,"type":Presence}),
});
export const NestedEnumPresenceFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedEnumPresenceFilter>, false>('NestedEnumPresenceFilter').implement({
  fields: NestedEnumPresenceFilterFields,
});

export const NestedEnumPresenceWithAggregatesFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":Presence}),
  in: t.field({"required":false,"type":[Presence]}),
  notIn: t.field({"required":false,"type":[Presence]}),
  not: t.field({"required":false,"type":Presence}),
  _count: t.field({"required":false,"type":NestedIntFilter}),
  _min: t.field({"required":false,"type":NestedEnumPresenceFilter}),
  _max: t.field({"required":false,"type":NestedEnumPresenceFilter}),
});
export const NestedEnumPresenceWithAggregatesFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedEnumPresenceWithAggregatesFilter>, false>('NestedEnumPresenceWithAggregatesFilter').implement({
  fields: NestedEnumPresenceWithAggregatesFilterFields,
});

export const NestedEnumSpeakersListCategoryFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":SpeakersListCategory}),
  in: t.field({"required":false,"type":[SpeakersListCategory]}),
  notIn: t.field({"required":false,"type":[SpeakersListCategory]}),
  not: t.field({"required":false,"type":SpeakersListCategory}),
});
export const NestedEnumSpeakersListCategoryFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedEnumSpeakersListCategoryFilter>, false>('NestedEnumSpeakersListCategoryFilter').implement({
  fields: NestedEnumSpeakersListCategoryFilterFields,
});

export const NestedEnumSpeakersListCategoryWithAggregatesFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":SpeakersListCategory}),
  in: t.field({"required":false,"type":[SpeakersListCategory]}),
  notIn: t.field({"required":false,"type":[SpeakersListCategory]}),
  not: t.field({"required":false,"type":SpeakersListCategory}),
  _count: t.field({"required":false,"type":NestedIntFilter}),
  _min: t.field({"required":false,"type":NestedEnumSpeakersListCategoryFilter}),
  _max: t.field({"required":false,"type":NestedEnumSpeakersListCategoryFilter}),
});
export const NestedEnumSpeakersListCategoryWithAggregatesFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedEnumSpeakersListCategoryWithAggregatesFilter>, false>('NestedEnumSpeakersListCategoryWithAggregatesFilter').implement({
  fields: NestedEnumSpeakersListCategoryWithAggregatesFilterFields,
});

export const NestedIntWithAggregatesFilterFields = (t: any) => ({
  equals: t.int({"required":false}),
  in: t.intList({"required":false}),
  notIn: t.intList({"required":false}),
  lt: t.int({"required":false}),
  lte: t.int({"required":false}),
  gt: t.int({"required":false}),
  gte: t.int({"required":false}),
  not: t.field({"required":false,"type":NestedIntWithAggregatesFilter}),
  _count: t.field({"required":false,"type":NestedIntFilter}),
  _avg: t.field({"required":false,"type":NestedFloatFilter}),
  _sum: t.field({"required":false,"type":NestedIntFilter}),
  _min: t.field({"required":false,"type":NestedIntFilter}),
  _max: t.field({"required":false,"type":NestedIntFilter}),
});
export const NestedIntWithAggregatesFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedIntWithAggregatesFilter>, false>('NestedIntWithAggregatesFilter').implement({
  fields: NestedIntWithAggregatesFilterFields,
});

export const NestedFloatFilterFields = (t: any) => ({
  equals: t.float({"required":false}),
  in: t.floatList({"required":false}),
  notIn: t.floatList({"required":false}),
  lt: t.float({"required":false}),
  lte: t.float({"required":false}),
  gt: t.float({"required":false}),
  gte: t.float({"required":false}),
  not: t.field({"required":false,"type":NestedFloatFilter}),
});
export const NestedFloatFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedFloatFilter>, false>('NestedFloatFilter').implement({
  fields: NestedFloatFilterFields,
});

export const NestedIntNullableWithAggregatesFilterFields = (t: any) => ({
  equals: t.int({"required":false}),
  in: t.intList({"required":false}),
  notIn: t.intList({"required":false}),
  lt: t.int({"required":false}),
  lte: t.int({"required":false}),
  gt: t.int({"required":false}),
  gte: t.int({"required":false}),
  not: t.field({"required":false,"type":NestedIntNullableWithAggregatesFilter}),
  _count: t.field({"required":false,"type":NestedIntNullableFilter}),
  _avg: t.field({"required":false,"type":NestedFloatNullableFilter}),
  _sum: t.field({"required":false,"type":NestedIntNullableFilter}),
  _min: t.field({"required":false,"type":NestedIntNullableFilter}),
  _max: t.field({"required":false,"type":NestedIntNullableFilter}),
});
export const NestedIntNullableWithAggregatesFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedIntNullableWithAggregatesFilter>, false>('NestedIntNullableWithAggregatesFilter').implement({
  fields: NestedIntNullableWithAggregatesFilterFields,
});

export const NestedFloatNullableFilterFields = (t: any) => ({
  equals: t.float({"required":false}),
  in: t.floatList({"required":false}),
  notIn: t.floatList({"required":false}),
  lt: t.float({"required":false}),
  lte: t.float({"required":false}),
  gt: t.float({"required":false}),
  gte: t.float({"required":false}),
  not: t.field({"required":false,"type":NestedFloatNullableFilter}),
});
export const NestedFloatNullableFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedFloatNullableFilter>, false>('NestedFloatNullableFilter').implement({
  fields: NestedFloatNullableFilterFields,
});

export const NestedEnumNationVariantFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":NationVariant}),
  in: t.field({"required":false,"type":[NationVariant]}),
  notIn: t.field({"required":false,"type":[NationVariant]}),
  not: t.field({"required":false,"type":NationVariant}),
});
export const NestedEnumNationVariantFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedEnumNationVariantFilter>, false>('NestedEnumNationVariantFilter').implement({
  fields: NestedEnumNationVariantFilterFields,
});

export const NestedEnumNationVariantWithAggregatesFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":NationVariant}),
  in: t.field({"required":false,"type":[NationVariant]}),
  notIn: t.field({"required":false,"type":[NationVariant]}),
  not: t.field({"required":false,"type":NationVariant}),
  _count: t.field({"required":false,"type":NestedIntFilter}),
  _min: t.field({"required":false,"type":NestedEnumNationVariantFilter}),
  _max: t.field({"required":false,"type":NestedEnumNationVariantFilter}),
});
export const NestedEnumNationVariantWithAggregatesFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedEnumNationVariantWithAggregatesFilter>, false>('NestedEnumNationVariantWithAggregatesFilter').implement({
  fields: NestedEnumNationVariantWithAggregatesFilterFields,
});

export const NestedEnumMessageCategoryFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":MessageCategory}),
  in: t.field({"required":false,"type":[MessageCategory]}),
  notIn: t.field({"required":false,"type":[MessageCategory]}),
  not: t.field({"required":false,"type":MessageCategory}),
});
export const NestedEnumMessageCategoryFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedEnumMessageCategoryFilter>, false>('NestedEnumMessageCategoryFilter').implement({
  fields: NestedEnumMessageCategoryFilterFields,
});

export const NestedDateTimeFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":DateTime}),
  in: t.field({"required":false,"type":[DateTime]}),
  notIn: t.field({"required":false,"type":[DateTime]}),
  lt: t.field({"required":false,"type":DateTime}),
  lte: t.field({"required":false,"type":DateTime}),
  gt: t.field({"required":false,"type":DateTime}),
  gte: t.field({"required":false,"type":DateTime}),
  not: t.field({"required":false,"type":NestedDateTimeFilter}),
});
export const NestedDateTimeFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedDateTimeFilter>, false>('NestedDateTimeFilter').implement({
  fields: NestedDateTimeFilterFields,
});

export const NestedEnumMessageCategoryWithAggregatesFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":MessageCategory}),
  in: t.field({"required":false,"type":[MessageCategory]}),
  notIn: t.field({"required":false,"type":[MessageCategory]}),
  not: t.field({"required":false,"type":MessageCategory}),
  _count: t.field({"required":false,"type":NestedIntFilter}),
  _min: t.field({"required":false,"type":NestedEnumMessageCategoryFilter}),
  _max: t.field({"required":false,"type":NestedEnumMessageCategoryFilter}),
});
export const NestedEnumMessageCategoryWithAggregatesFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedEnumMessageCategoryWithAggregatesFilter>, false>('NestedEnumMessageCategoryWithAggregatesFilter').implement({
  fields: NestedEnumMessageCategoryWithAggregatesFilterFields,
});

export const NestedDateTimeWithAggregatesFilterFields = (t: any) => ({
  equals: t.field({"required":false,"type":DateTime}),
  in: t.field({"required":false,"type":[DateTime]}),
  notIn: t.field({"required":false,"type":[DateTime]}),
  lt: t.field({"required":false,"type":DateTime}),
  lte: t.field({"required":false,"type":DateTime}),
  gt: t.field({"required":false,"type":DateTime}),
  gte: t.field({"required":false,"type":DateTime}),
  not: t.field({"required":false,"type":NestedDateTimeWithAggregatesFilter}),
  _count: t.field({"required":false,"type":NestedIntFilter}),
  _min: t.field({"required":false,"type":NestedDateTimeFilter}),
  _max: t.field({"required":false,"type":NestedDateTimeFilter}),
});
export const NestedDateTimeWithAggregatesFilter = builder.inputRef<PrismaUpdateOperationsInputFilter<Prisma.NestedDateTimeWithAggregatesFilter>, false>('NestedDateTimeWithAggregatesFilter').implement({
  fields: NestedDateTimeWithAggregatesFilterFields,
});