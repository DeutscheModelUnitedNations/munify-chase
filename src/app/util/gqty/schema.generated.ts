/**
 * GQty AUTO-GENERATED CODE: PLEASE DO NOT MODIFY MANUALLY
 */

import { type ScalarsEnumsHash } from "gqty";

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  DateTime: { input: string; output: string };
}

export interface AgendaItemCreateInput {
  committeeId: Scalars["String"]["input"];
  description?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["String"]["input"]>;
  isActive?: InputMaybe<Scalars["Boolean"]["input"]>;
  speakerLists?: InputMaybe<SpeakersListCreateNestedManyWithoutAgendaItemInput>;
  title: Scalars["String"]["input"];
}

export interface AgendaItemCreateNestedManyWithoutCommitteeInput {
  connect?: InputMaybe<Array<AgendaItemWhereUniqueInput>>;
}

export interface AgendaItemListRelationFilter {
  every?: InputMaybe<AgendaItemWhereInput>;
  none?: InputMaybe<AgendaItemWhereInput>;
  some?: InputMaybe<AgendaItemWhereInput>;
}

export interface AgendaItemOrderByRelationAggregateInput {
  _count?: InputMaybe<SortOrder>;
}

export interface AgendaItemOrderByWithRelationInput {
  committee?: InputMaybe<CommitteeOrderByWithRelationInput>;
  committeeId?: InputMaybe<SortOrder>;
  description?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  isActive?: InputMaybe<SortOrder>;
  speakerLists?: InputMaybe<SpeakersListOrderByRelationAggregateInput>;
  title?: InputMaybe<SortOrder>;
}

export interface AgendaItemRelationFilter {
  is?: InputMaybe<AgendaItemWhereInput>;
  isNot?: InputMaybe<AgendaItemWhereInput>;
}

export enum AgendaItemScalarFieldEnum {
  committeeId = "committeeId",
  description = "description",
  id = "id",
  isActive = "isActive",
  title = "title",
}

export interface AgendaItemUpdateInput {
  committeeId?: InputMaybe<StringFieldUpdateOperationsInput>;
  description?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  isActive?: InputMaybe<BoolFieldUpdateOperationsInput>;
  speakerLists?: InputMaybe<SpeakersListUpdateManyWithoutAgendaItemNestedInput>;
  title?: InputMaybe<StringFieldUpdateOperationsInput>;
}

export interface AgendaItemUpdateManyMutationInput {
  description?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  isActive?: InputMaybe<BoolFieldUpdateOperationsInput>;
  title?: InputMaybe<StringFieldUpdateOperationsInput>;
}

export interface AgendaItemUpdateManyWithoutCommitteeNestedInput {
  connect?: InputMaybe<Array<AgendaItemWhereUniqueInput>>;
  disconnect?: InputMaybe<Array<AgendaItemWhereUniqueInput>>;
  set?: InputMaybe<Array<AgendaItemWhereUniqueInput>>;
}

export interface AgendaItemWhereInput {
  AND?: InputMaybe<Array<AgendaItemWhereInput>>;
  NOT?: InputMaybe<Array<AgendaItemWhereInput>>;
  OR?: InputMaybe<Array<AgendaItemWhereInput>>;
  committee?: InputMaybe<CommitteeWhereInput>;
  committeeId?: InputMaybe<StringFilter>;
  description?: InputMaybe<StringNullableFilter>;
  id?: InputMaybe<StringFilter>;
  isActive?: InputMaybe<BoolFilter>;
  speakerLists?: InputMaybe<SpeakersListListRelationFilter>;
  title?: InputMaybe<StringFilter>;
}

export interface AgendaItemWhereUniqueInput {
  AND?: InputMaybe<Array<AgendaItemWhereInput>>;
  NOT?: InputMaybe<Array<AgendaItemWhereInput>>;
  OR?: InputMaybe<Array<AgendaItemWhereInput>>;
  committee?: InputMaybe<CommitteeWhereInput>;
  committeeId?: InputMaybe<StringFilter>;
  description?: InputMaybe<StringNullableFilter>;
  id?: InputMaybe<Scalars["String"]["input"]>;
  isActive?: InputMaybe<BoolFilter>;
  speakerLists?: InputMaybe<SpeakersListListRelationFilter>;
  title?: InputMaybe<StringFilter>;
}

export interface BoolFieldUpdateOperationsInput {
  set?: InputMaybe<Scalars["Boolean"]["input"]>;
}

export interface BoolFilter {
  equals?: InputMaybe<Scalars["Boolean"]["input"]>;
  not?: InputMaybe<NestedBoolFilter>;
}

export interface BoolWithAggregatesFilter {
  _count?: InputMaybe<NestedIntFilter>;
  _max?: InputMaybe<NestedBoolFilter>;
  _min?: InputMaybe<NestedBoolFilter>;
  equals?: InputMaybe<Scalars["Boolean"]["input"]>;
  not?: InputMaybe<NestedBoolWithAggregatesFilter>;
}

export interface CommitteeAbbreviationConferenceIdCompoundUniqueInput {
  abbreviation: Scalars["String"]["input"];
  conferenceId: Scalars["String"]["input"];
}

export enum CommitteeCategory {
  COMMITTEE = "COMMITTEE",
  CRISIS = "CRISIS",
  ICJ = "ICJ",
}

export interface CommitteeCreateInput {
  abbreviation: Scalars["String"]["input"];
  agendaItems?: InputMaybe<AgendaItemCreateNestedManyWithoutCommitteeInput>;
  allowDelegationsToAddThemselvesToSpeakersList?: InputMaybe<
    Scalars["Boolean"]["input"]
  >;
  category: CommitteeCategory;
  conferenceId: Scalars["String"]["input"];
  id?: InputMaybe<Scalars["String"]["input"]>;
  members?: InputMaybe<CommitteeMemberCreateNestedManyWithoutCommitteeInput>;
  messages?: InputMaybe<MessageCreateNestedManyWithoutCommitteeInput>;
  name: Scalars["String"]["input"];
  parentId?: InputMaybe<Scalars["String"]["input"]>;
  stateOfDebate?: InputMaybe<Scalars["String"]["input"]>;
  status?: InputMaybe<CommitteeStatus>;
  statusHeadline?: InputMaybe<Scalars["String"]["input"]>;
  statusUntil?: InputMaybe<Scalars["DateTime"]["input"]>;
  subCommittees?: InputMaybe<CommitteeCreateNestedManyWithoutParentInput>;
  whiteboardContent?: InputMaybe<Scalars["String"]["input"]>;
}

export interface CommitteeCreateNestedManyWithoutConferenceInput {
  connect?: InputMaybe<Array<CommitteeWhereUniqueInput>>;
}

export interface CommitteeCreateNestedManyWithoutParentInput {
  connect?: InputMaybe<Array<CommitteeWhereUniqueInput>>;
}

export interface CommitteeListRelationFilter {
  every?: InputMaybe<CommitteeWhereInput>;
  none?: InputMaybe<CommitteeWhereInput>;
  some?: InputMaybe<CommitteeWhereInput>;
}

export interface CommitteeMemberCommitteeIdDelegationIdCompoundUniqueInput {
  committeeId: Scalars["String"]["input"];
  delegationId: Scalars["String"]["input"];
}

export interface CommitteeMemberCommitteeIdUserIdCompoundUniqueInput {
  committeeId: Scalars["String"]["input"];
  userId: Scalars["String"]["input"];
}

export interface CommitteeMemberCreateInput {
  committeeId: Scalars["String"]["input"];
  delegationId?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["String"]["input"]>;
  presence?: InputMaybe<Presence>;
  speakerLists?: InputMaybe<SpeakerOnListCreateNestedManyWithoutCommitteeMemberInput>;
  userId?: InputMaybe<Scalars["String"]["input"]>;
}

export interface CommitteeMemberCreateNestedManyWithoutCommitteeInput {
  connect?: InputMaybe<Array<CommitteeMemberWhereUniqueInput>>;
}

export interface CommitteeMemberCreateNestedManyWithoutDelegationInput {
  connect?: InputMaybe<Array<CommitteeMemberWhereUniqueInput>>;
}

export interface CommitteeMemberCreateNestedManyWithoutUserInput {
  connect?: InputMaybe<Array<CommitteeMemberWhereUniqueInput>>;
}

export interface CommitteeMemberListRelationFilter {
  every?: InputMaybe<CommitteeMemberWhereInput>;
  none?: InputMaybe<CommitteeMemberWhereInput>;
  some?: InputMaybe<CommitteeMemberWhereInput>;
}

export interface CommitteeMemberOrderByRelationAggregateInput {
  _count?: InputMaybe<SortOrder>;
}

export interface CommitteeMemberOrderByWithRelationInput {
  committee?: InputMaybe<CommitteeOrderByWithRelationInput>;
  committeeId?: InputMaybe<SortOrder>;
  delegation?: InputMaybe<DelegationOrderByWithRelationInput>;
  delegationId?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  presence?: InputMaybe<SortOrder>;
  speakerLists?: InputMaybe<SpeakerOnListOrderByRelationAggregateInput>;
  user?: InputMaybe<UserOrderByWithRelationInput>;
  userId?: InputMaybe<SortOrder>;
}

export interface CommitteeMemberRelationFilter {
  is?: InputMaybe<CommitteeMemberWhereInput>;
  isNot?: InputMaybe<CommitteeMemberWhereInput>;
}

export enum CommitteeMemberScalarFieldEnum {
  committeeId = "committeeId",
  delegationId = "delegationId",
  id = "id",
  presence = "presence",
  userId = "userId",
}

export interface CommitteeMemberUpdateInput {
  committeeId?: InputMaybe<StringFieldUpdateOperationsInput>;
  delegationId?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  presence?: InputMaybe<EnumPresenceFieldUpdateOperationsInput>;
  speakerLists?: InputMaybe<SpeakerOnListUpdateManyWithoutCommitteeMemberNestedInput>;
  userId?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
}

export interface CommitteeMemberUpdateManyMutationInput {
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  presence?: InputMaybe<EnumPresenceFieldUpdateOperationsInput>;
}

export interface CommitteeMemberUpdateManyWithoutCommitteeNestedInput {
  connect?: InputMaybe<Array<CommitteeMemberWhereUniqueInput>>;
  disconnect?: InputMaybe<Array<CommitteeMemberWhereUniqueInput>>;
  set?: InputMaybe<Array<CommitteeMemberWhereUniqueInput>>;
}

export interface CommitteeMemberUpdateManyWithoutDelegationNestedInput {
  connect?: InputMaybe<Array<CommitteeMemberWhereUniqueInput>>;
  disconnect?: InputMaybe<Array<CommitteeMemberWhereUniqueInput>>;
  set?: InputMaybe<Array<CommitteeMemberWhereUniqueInput>>;
}

export interface CommitteeMemberUpdateManyWithoutUserNestedInput {
  connect?: InputMaybe<Array<CommitteeMemberWhereUniqueInput>>;
  disconnect?: InputMaybe<Array<CommitteeMemberWhereUniqueInput>>;
  set?: InputMaybe<Array<CommitteeMemberWhereUniqueInput>>;
}

export interface CommitteeMemberWhereInput {
  AND?: InputMaybe<Array<CommitteeMemberWhereInput>>;
  NOT?: InputMaybe<Array<CommitteeMemberWhereInput>>;
  OR?: InputMaybe<Array<CommitteeMemberWhereInput>>;
  committee?: InputMaybe<CommitteeWhereInput>;
  committeeId?: InputMaybe<StringFilter>;
  delegation?: InputMaybe<DelegationWhereInput>;
  delegationId?: InputMaybe<StringNullableFilter>;
  id?: InputMaybe<StringFilter>;
  presence?: InputMaybe<EnumPresenceFilter>;
  speakerLists?: InputMaybe<SpeakerOnListListRelationFilter>;
  user?: InputMaybe<UserWhereInput>;
  userId?: InputMaybe<StringNullableFilter>;
}

export interface CommitteeMemberWhereUniqueInput {
  AND?: InputMaybe<Array<CommitteeMemberWhereInput>>;
  NOT?: InputMaybe<Array<CommitteeMemberWhereInput>>;
  OR?: InputMaybe<Array<CommitteeMemberWhereInput>>;
  committee?: InputMaybe<CommitteeWhereInput>;
  committeeId?: InputMaybe<StringFilter>;
  committeeId_delegationId?: InputMaybe<CommitteeMemberCommitteeIdDelegationIdCompoundUniqueInput>;
  committeeId_userId?: InputMaybe<CommitteeMemberCommitteeIdUserIdCompoundUniqueInput>;
  delegation?: InputMaybe<DelegationWhereInput>;
  delegationId?: InputMaybe<StringNullableFilter>;
  id?: InputMaybe<Scalars["String"]["input"]>;
  presence?: InputMaybe<EnumPresenceFilter>;
  speakerLists?: InputMaybe<SpeakerOnListListRelationFilter>;
  user?: InputMaybe<UserWhereInput>;
  userId?: InputMaybe<StringNullableFilter>;
}

export interface CommitteeNameConferenceIdCompoundUniqueInput {
  conferenceId: Scalars["String"]["input"];
  name: Scalars["String"]["input"];
}

export interface CommitteeNullableRelationFilter {
  is?: InputMaybe<CommitteeWhereInput>;
  isNot?: InputMaybe<CommitteeWhereInput>;
}

export interface CommitteeOrderByRelationAggregateInput {
  _count?: InputMaybe<SortOrder>;
}

export interface CommitteeOrderByWithRelationInput {
  abbreviation?: InputMaybe<SortOrder>;
  agendaItems?: InputMaybe<AgendaItemOrderByRelationAggregateInput>;
  allowDelegationsToAddThemselvesToSpeakersList?: InputMaybe<SortOrder>;
  category?: InputMaybe<SortOrder>;
  conference?: InputMaybe<ConferenceOrderByWithRelationInput>;
  conferenceId?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  members?: InputMaybe<CommitteeMemberOrderByRelationAggregateInput>;
  messages?: InputMaybe<MessageOrderByRelationAggregateInput>;
  name?: InputMaybe<SortOrder>;
  parent?: InputMaybe<CommitteeOrderByWithRelationInput>;
  parentId?: InputMaybe<SortOrder>;
  stateOfDebate?: InputMaybe<SortOrder>;
  status?: InputMaybe<SortOrder>;
  statusHeadline?: InputMaybe<SortOrder>;
  statusUntil?: InputMaybe<SortOrder>;
  subCommittees?: InputMaybe<CommitteeOrderByRelationAggregateInput>;
  whiteboardContent?: InputMaybe<SortOrder>;
}

export interface CommitteeRelationFilter {
  is?: InputMaybe<CommitteeWhereInput>;
  isNot?: InputMaybe<CommitteeWhereInput>;
}

export enum CommitteeScalarFieldEnum {
  abbreviation = "abbreviation",
  allowDelegationsToAddThemselvesToSpeakersList = "allowDelegationsToAddThemselvesToSpeakersList",
  category = "category",
  conferenceId = "conferenceId",
  id = "id",
  name = "name",
  parentId = "parentId",
  stateOfDebate = "stateOfDebate",
  status = "status",
  statusHeadline = "statusHeadline",
  statusUntil = "statusUntil",
  whiteboardContent = "whiteboardContent",
}

export enum CommitteeStatus {
  CLOSED = "CLOSED",
  FORMAL = "FORMAL",
  INFORMAL = "INFORMAL",
  PAUSE = "PAUSE",
  SUSPENSION = "SUSPENSION",
}

export interface CommitteeUpdateInput {
  abbreviation?: InputMaybe<StringFieldUpdateOperationsInput>;
  agendaItems?: InputMaybe<AgendaItemUpdateManyWithoutCommitteeNestedInput>;
  allowDelegationsToAddThemselvesToSpeakersList?: InputMaybe<BoolFieldUpdateOperationsInput>;
  category?: InputMaybe<EnumCommitteeCategoryFieldUpdateOperationsInput>;
  conferenceId?: InputMaybe<StringFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  members?: InputMaybe<CommitteeMemberUpdateManyWithoutCommitteeNestedInput>;
  messages?: InputMaybe<MessageUpdateManyWithoutCommitteeNestedInput>;
  name?: InputMaybe<StringFieldUpdateOperationsInput>;
  parentId?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  stateOfDebate?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  status?: InputMaybe<EnumCommitteeStatusFieldUpdateOperationsInput>;
  statusHeadline?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  statusUntil?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  subCommittees?: InputMaybe<CommitteeUpdateManyWithoutParentNestedInput>;
  whiteboardContent?: InputMaybe<StringFieldUpdateOperationsInput>;
}

export interface CommitteeUpdateManyMutationInput {
  abbreviation?: InputMaybe<StringFieldUpdateOperationsInput>;
  allowDelegationsToAddThemselvesToSpeakersList?: InputMaybe<BoolFieldUpdateOperationsInput>;
  category?: InputMaybe<EnumCommitteeCategoryFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  name?: InputMaybe<StringFieldUpdateOperationsInput>;
  stateOfDebate?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  status?: InputMaybe<EnumCommitteeStatusFieldUpdateOperationsInput>;
  statusHeadline?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  statusUntil?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  whiteboardContent?: InputMaybe<StringFieldUpdateOperationsInput>;
}

export interface CommitteeUpdateManyWithoutConferenceNestedInput {
  connect?: InputMaybe<Array<CommitteeWhereUniqueInput>>;
  disconnect?: InputMaybe<Array<CommitteeWhereUniqueInput>>;
  set?: InputMaybe<Array<CommitteeWhereUniqueInput>>;
}

export interface CommitteeUpdateManyWithoutParentNestedInput {
  connect?: InputMaybe<Array<CommitteeWhereUniqueInput>>;
  disconnect?: InputMaybe<Array<CommitteeWhereUniqueInput>>;
  set?: InputMaybe<Array<CommitteeWhereUniqueInput>>;
}

export interface CommitteeWhereInput {
  AND?: InputMaybe<Array<CommitteeWhereInput>>;
  NOT?: InputMaybe<Array<CommitteeWhereInput>>;
  OR?: InputMaybe<Array<CommitteeWhereInput>>;
  abbreviation?: InputMaybe<StringFilter>;
  agendaItems?: InputMaybe<AgendaItemListRelationFilter>;
  allowDelegationsToAddThemselvesToSpeakersList?: InputMaybe<BoolFilter>;
  category?: InputMaybe<EnumCommitteeCategoryFilter>;
  conference?: InputMaybe<ConferenceWhereInput>;
  conferenceId?: InputMaybe<StringFilter>;
  id?: InputMaybe<StringFilter>;
  members?: InputMaybe<CommitteeMemberListRelationFilter>;
  messages?: InputMaybe<MessageListRelationFilter>;
  name?: InputMaybe<StringFilter>;
  parent?: InputMaybe<CommitteeWhereInput>;
  parentId?: InputMaybe<StringNullableFilter>;
  stateOfDebate?: InputMaybe<StringNullableFilter>;
  status?: InputMaybe<EnumCommitteeStatusFilter>;
  statusHeadline?: InputMaybe<StringNullableFilter>;
  statusUntil?: InputMaybe<DateTimeNullableFilter>;
  subCommittees?: InputMaybe<CommitteeListRelationFilter>;
  whiteboardContent?: InputMaybe<StringFilter>;
}

export interface CommitteeWhereUniqueInput {
  AND?: InputMaybe<Array<CommitteeWhereInput>>;
  NOT?: InputMaybe<Array<CommitteeWhereInput>>;
  OR?: InputMaybe<Array<CommitteeWhereInput>>;
  abbreviation?: InputMaybe<StringFilter>;
  abbreviation_conferenceId?: InputMaybe<CommitteeAbbreviationConferenceIdCompoundUniqueInput>;
  agendaItems?: InputMaybe<AgendaItemListRelationFilter>;
  allowDelegationsToAddThemselvesToSpeakersList?: InputMaybe<BoolFilter>;
  category?: InputMaybe<EnumCommitteeCategoryFilter>;
  conference?: InputMaybe<ConferenceWhereInput>;
  conferenceId?: InputMaybe<StringFilter>;
  id?: InputMaybe<Scalars["String"]["input"]>;
  members?: InputMaybe<CommitteeMemberListRelationFilter>;
  messages?: InputMaybe<MessageListRelationFilter>;
  name?: InputMaybe<StringFilter>;
  name_conferenceId?: InputMaybe<CommitteeNameConferenceIdCompoundUniqueInput>;
  parent?: InputMaybe<CommitteeWhereInput>;
  parentId?: InputMaybe<StringNullableFilter>;
  stateOfDebate?: InputMaybe<StringNullableFilter>;
  status?: InputMaybe<EnumCommitteeStatusFilter>;
  statusHeadline?: InputMaybe<StringNullableFilter>;
  statusUntil?: InputMaybe<DateTimeNullableFilter>;
  subCommittees?: InputMaybe<CommitteeListRelationFilter>;
  whiteboardContent?: InputMaybe<StringFilter>;
}

export interface ConferenceCreateInput {
  committees?: InputMaybe<CommitteeCreateNestedManyWithoutConferenceInput>;
  delegations?: InputMaybe<DelegationCreateNestedManyWithoutConferenceInput>;
  end?: InputMaybe<Scalars["DateTime"]["input"]>;
  feedbackWebsite?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["String"]["input"]>;
  members?: InputMaybe<ConferenceMemberCreateNestedManyWithoutConferenceInput>;
  name: Scalars["String"]["input"];
  pressWebsite?: InputMaybe<Scalars["String"]["input"]>;
  start?: InputMaybe<Scalars["DateTime"]["input"]>;
}

export interface ConferenceCreationTokenCreateInput {
  token: Scalars["String"]["input"];
}

export interface ConferenceCreationTokenOrderByWithRelationInput {
  token?: InputMaybe<SortOrder>;
}

export enum ConferenceCreationTokenScalarFieldEnum {
  token = "token",
}

export interface ConferenceCreationTokenUpdateInput {
  token?: InputMaybe<StringFieldUpdateOperationsInput>;
}

export interface ConferenceCreationTokenUpdateManyMutationInput {
  token?: InputMaybe<StringFieldUpdateOperationsInput>;
}

export interface ConferenceCreationTokenWhereInput {
  AND?: InputMaybe<Array<ConferenceCreationTokenWhereInput>>;
  NOT?: InputMaybe<Array<ConferenceCreationTokenWhereInput>>;
  OR?: InputMaybe<Array<ConferenceCreationTokenWhereInput>>;
  token?: InputMaybe<StringFilter>;
}

export interface ConferenceCreationTokenWhereUniqueInput {
  AND?: InputMaybe<Array<ConferenceCreationTokenWhereInput>>;
  NOT?: InputMaybe<Array<ConferenceCreationTokenWhereInput>>;
  OR?: InputMaybe<Array<ConferenceCreationTokenWhereInput>>;
  token?: InputMaybe<Scalars["String"]["input"]>;
}

export interface ConferenceMemberCreateInput {
  conferenceId: Scalars["String"]["input"];
  id?: InputMaybe<Scalars["String"]["input"]>;
  role: ConferenceRole;
  userId?: InputMaybe<Scalars["String"]["input"]>;
}

export interface ConferenceMemberCreateNestedManyWithoutConferenceInput {
  connect?: InputMaybe<Array<ConferenceMemberWhereUniqueInput>>;
}

export interface ConferenceMemberCreateNestedManyWithoutUserInput {
  connect?: InputMaybe<Array<ConferenceMemberWhereUniqueInput>>;
}

export interface ConferenceMemberListRelationFilter {
  every?: InputMaybe<ConferenceMemberWhereInput>;
  none?: InputMaybe<ConferenceMemberWhereInput>;
  some?: InputMaybe<ConferenceMemberWhereInput>;
}

export interface ConferenceMemberOrderByRelationAggregateInput {
  _count?: InputMaybe<SortOrder>;
}

export interface ConferenceMemberOrderByWithRelationInput {
  conference?: InputMaybe<ConferenceOrderByWithRelationInput>;
  conferenceId?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  role?: InputMaybe<SortOrder>;
  user?: InputMaybe<UserOrderByWithRelationInput>;
  userId?: InputMaybe<SortOrder>;
}

export enum ConferenceMemberScalarFieldEnum {
  conferenceId = "conferenceId",
  id = "id",
  role = "role",
  userId = "userId",
}

export interface ConferenceMemberUpdateInput {
  conferenceId?: InputMaybe<StringFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  role?: InputMaybe<EnumConferenceRoleFieldUpdateOperationsInput>;
  userId?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
}

export interface ConferenceMemberUpdateManyMutationInput {
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  role?: InputMaybe<EnumConferenceRoleFieldUpdateOperationsInput>;
}

export interface ConferenceMemberUpdateManyWithoutConferenceNestedInput {
  connect?: InputMaybe<Array<ConferenceMemberWhereUniqueInput>>;
  disconnect?: InputMaybe<Array<ConferenceMemberWhereUniqueInput>>;
  set?: InputMaybe<Array<ConferenceMemberWhereUniqueInput>>;
}

export interface ConferenceMemberUpdateManyWithoutUserNestedInput {
  connect?: InputMaybe<Array<ConferenceMemberWhereUniqueInput>>;
  disconnect?: InputMaybe<Array<ConferenceMemberWhereUniqueInput>>;
  set?: InputMaybe<Array<ConferenceMemberWhereUniqueInput>>;
}

export interface ConferenceMemberUserIdConferenceIdCompoundUniqueInput {
  conferenceId: Scalars["String"]["input"];
  userId: Scalars["String"]["input"];
}

export interface ConferenceMemberWhereInput {
  AND?: InputMaybe<Array<ConferenceMemberWhereInput>>;
  NOT?: InputMaybe<Array<ConferenceMemberWhereInput>>;
  OR?: InputMaybe<Array<ConferenceMemberWhereInput>>;
  conference?: InputMaybe<ConferenceWhereInput>;
  conferenceId?: InputMaybe<StringFilter>;
  id?: InputMaybe<StringFilter>;
  role?: InputMaybe<EnumConferenceRoleFilter>;
  user?: InputMaybe<UserWhereInput>;
  userId?: InputMaybe<StringNullableFilter>;
}

export interface ConferenceMemberWhereUniqueInput {
  AND?: InputMaybe<Array<ConferenceMemberWhereInput>>;
  NOT?: InputMaybe<Array<ConferenceMemberWhereInput>>;
  OR?: InputMaybe<Array<ConferenceMemberWhereInput>>;
  conference?: InputMaybe<ConferenceWhereInput>;
  conferenceId?: InputMaybe<StringFilter>;
  id?: InputMaybe<Scalars["String"]["input"]>;
  role?: InputMaybe<EnumConferenceRoleFilter>;
  user?: InputMaybe<UserWhereInput>;
  userId?: InputMaybe<StringNullableFilter>;
  userId_conferenceId?: InputMaybe<ConferenceMemberUserIdConferenceIdCompoundUniqueInput>;
}

export interface ConferenceOrderByWithRelationInput {
  committees?: InputMaybe<CommitteeOrderByRelationAggregateInput>;
  delegations?: InputMaybe<DelegationOrderByRelationAggregateInput>;
  end?: InputMaybe<SortOrder>;
  feedbackWebsite?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  members?: InputMaybe<ConferenceMemberOrderByRelationAggregateInput>;
  name?: InputMaybe<SortOrder>;
  pressWebsite?: InputMaybe<SortOrder>;
  start?: InputMaybe<SortOrder>;
}

export interface ConferenceRelationFilter {
  is?: InputMaybe<ConferenceWhereInput>;
  isNot?: InputMaybe<ConferenceWhereInput>;
}

export enum ConferenceRole {
  ADMIN = "ADMIN",
  CHAIR = "CHAIR",
  COMMITTEE_ADVISOR = "COMMITTEE_ADVISOR",
  GUEST = "GUEST",
  MISCELLANEOUS_TEAM = "MISCELLANEOUS_TEAM",
  NON_STATE_ACTOR = "NON_STATE_ACTOR",
  PARTICIPANT_CARE = "PARTICIPANT_CARE",
  PRESS_CORPS = "PRESS_CORPS",
  SECRETARIAT = "SECRETARIAT",
}

export enum ConferenceScalarFieldEnum {
  end = "end",
  feedbackWebsite = "feedbackWebsite",
  id = "id",
  name = "name",
  pressWebsite = "pressWebsite",
  start = "start",
}

export interface ConferenceUpdateInput {
  committees?: InputMaybe<CommitteeUpdateManyWithoutConferenceNestedInput>;
  delegations?: InputMaybe<DelegationUpdateManyWithoutConferenceNestedInput>;
  end?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  feedbackWebsite?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  members?: InputMaybe<ConferenceMemberUpdateManyWithoutConferenceNestedInput>;
  name?: InputMaybe<StringFieldUpdateOperationsInput>;
  pressWebsite?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  start?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
}

export interface ConferenceUpdateManyMutationInput {
  end?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  feedbackWebsite?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  name?: InputMaybe<StringFieldUpdateOperationsInput>;
  pressWebsite?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  start?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
}

export interface ConferenceWhereInput {
  AND?: InputMaybe<Array<ConferenceWhereInput>>;
  NOT?: InputMaybe<Array<ConferenceWhereInput>>;
  OR?: InputMaybe<Array<ConferenceWhereInput>>;
  committees?: InputMaybe<CommitteeListRelationFilter>;
  delegations?: InputMaybe<DelegationListRelationFilter>;
  end?: InputMaybe<DateTimeNullableFilter>;
  feedbackWebsite?: InputMaybe<StringNullableFilter>;
  id?: InputMaybe<StringFilter>;
  members?: InputMaybe<ConferenceMemberListRelationFilter>;
  name?: InputMaybe<StringFilter>;
  pressWebsite?: InputMaybe<StringNullableFilter>;
  start?: InputMaybe<DateTimeNullableFilter>;
}

export interface ConferenceWhereUniqueInput {
  AND?: InputMaybe<Array<ConferenceWhereInput>>;
  NOT?: InputMaybe<Array<ConferenceWhereInput>>;
  OR?: InputMaybe<Array<ConferenceWhereInput>>;
  committees?: InputMaybe<CommitteeListRelationFilter>;
  delegations?: InputMaybe<DelegationListRelationFilter>;
  end?: InputMaybe<DateTimeNullableFilter>;
  feedbackWebsite?: InputMaybe<StringNullableFilter>;
  id?: InputMaybe<Scalars["String"]["input"]>;
  members?: InputMaybe<ConferenceMemberListRelationFilter>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  pressWebsite?: InputMaybe<StringNullableFilter>;
  start?: InputMaybe<DateTimeNullableFilter>;
}

export interface DateTimeFieldUpdateOperationsInput {
  set?: InputMaybe<Scalars["DateTime"]["input"]>;
}

export interface DateTimeFilter {
  equals?: InputMaybe<Scalars["DateTime"]["input"]>;
  gt?: InputMaybe<Scalars["DateTime"]["input"]>;
  gte?: InputMaybe<Scalars["DateTime"]["input"]>;
  in?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
  lt?: InputMaybe<Scalars["DateTime"]["input"]>;
  lte?: InputMaybe<Scalars["DateTime"]["input"]>;
  not?: InputMaybe<NestedDateTimeFilter>;
  notIn?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
}

export interface DateTimeNullableFilter {
  equals?: InputMaybe<Scalars["DateTime"]["input"]>;
  gt?: InputMaybe<Scalars["DateTime"]["input"]>;
  gte?: InputMaybe<Scalars["DateTime"]["input"]>;
  in?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
  lt?: InputMaybe<Scalars["DateTime"]["input"]>;
  lte?: InputMaybe<Scalars["DateTime"]["input"]>;
  not?: InputMaybe<NestedDateTimeNullableFilter>;
  notIn?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
}

export interface DateTimeNullableWithAggregatesFilter {
  _count?: InputMaybe<NestedIntNullableFilter>;
  _max?: InputMaybe<NestedDateTimeNullableFilter>;
  _min?: InputMaybe<NestedDateTimeNullableFilter>;
  equals?: InputMaybe<Scalars["DateTime"]["input"]>;
  gt?: InputMaybe<Scalars["DateTime"]["input"]>;
  gte?: InputMaybe<Scalars["DateTime"]["input"]>;
  in?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
  lt?: InputMaybe<Scalars["DateTime"]["input"]>;
  lte?: InputMaybe<Scalars["DateTime"]["input"]>;
  not?: InputMaybe<NestedDateTimeNullableWithAggregatesFilter>;
  notIn?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
}

export interface DateTimeWithAggregatesFilter {
  _count?: InputMaybe<NestedIntFilter>;
  _max?: InputMaybe<NestedDateTimeFilter>;
  _min?: InputMaybe<NestedDateTimeFilter>;
  equals?: InputMaybe<Scalars["DateTime"]["input"]>;
  gt?: InputMaybe<Scalars["DateTime"]["input"]>;
  gte?: InputMaybe<Scalars["DateTime"]["input"]>;
  in?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
  lt?: InputMaybe<Scalars["DateTime"]["input"]>;
  lte?: InputMaybe<Scalars["DateTime"]["input"]>;
  not?: InputMaybe<NestedDateTimeWithAggregatesFilter>;
  notIn?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
}

export interface DelegationConferenceIdNationIdCompoundUniqueInput {
  conferenceId: Scalars["String"]["input"];
  nationId: Scalars["String"]["input"];
}

export interface DelegationCreateInput {
  conferenceId: Scalars["String"]["input"];
  id?: InputMaybe<Scalars["String"]["input"]>;
  members?: InputMaybe<CommitteeMemberCreateNestedManyWithoutDelegationInput>;
  nationId: Scalars["String"]["input"];
}

export interface DelegationCreateNestedManyWithoutConferenceInput {
  connect?: InputMaybe<Array<DelegationWhereUniqueInput>>;
}

export interface DelegationCreateNestedManyWithoutNationInput {
  connect?: InputMaybe<Array<DelegationWhereUniqueInput>>;
}

export interface DelegationListRelationFilter {
  every?: InputMaybe<DelegationWhereInput>;
  none?: InputMaybe<DelegationWhereInput>;
  some?: InputMaybe<DelegationWhereInput>;
}

export interface DelegationNullableRelationFilter {
  is?: InputMaybe<DelegationWhereInput>;
  isNot?: InputMaybe<DelegationWhereInput>;
}

export interface DelegationOrderByRelationAggregateInput {
  _count?: InputMaybe<SortOrder>;
}

export interface DelegationOrderByWithRelationInput {
  conference?: InputMaybe<ConferenceOrderByWithRelationInput>;
  conferenceId?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  members?: InputMaybe<CommitteeMemberOrderByRelationAggregateInput>;
  nation?: InputMaybe<NationOrderByWithRelationInput>;
  nationId?: InputMaybe<SortOrder>;
}

export enum DelegationScalarFieldEnum {
  conferenceId = "conferenceId",
  id = "id",
  nationId = "nationId",
}

export interface DelegationUpdateInput {
  conferenceId?: InputMaybe<StringFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  members?: InputMaybe<CommitteeMemberUpdateManyWithoutDelegationNestedInput>;
  nationId?: InputMaybe<StringFieldUpdateOperationsInput>;
}

export interface DelegationUpdateManyMutationInput {
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
}

export interface DelegationUpdateManyWithoutConferenceNestedInput {
  connect?: InputMaybe<Array<DelegationWhereUniqueInput>>;
  disconnect?: InputMaybe<Array<DelegationWhereUniqueInput>>;
  set?: InputMaybe<Array<DelegationWhereUniqueInput>>;
}

export interface DelegationUpdateManyWithoutNationNestedInput {
  connect?: InputMaybe<Array<DelegationWhereUniqueInput>>;
  disconnect?: InputMaybe<Array<DelegationWhereUniqueInput>>;
  set?: InputMaybe<Array<DelegationWhereUniqueInput>>;
}

export interface DelegationWhereInput {
  AND?: InputMaybe<Array<DelegationWhereInput>>;
  NOT?: InputMaybe<Array<DelegationWhereInput>>;
  OR?: InputMaybe<Array<DelegationWhereInput>>;
  conference?: InputMaybe<ConferenceWhereInput>;
  conferenceId?: InputMaybe<StringFilter>;
  id?: InputMaybe<StringFilter>;
  members?: InputMaybe<CommitteeMemberListRelationFilter>;
  nation?: InputMaybe<NationWhereInput>;
  nationId?: InputMaybe<StringFilter>;
}

export interface DelegationWhereUniqueInput {
  AND?: InputMaybe<Array<DelegationWhereInput>>;
  NOT?: InputMaybe<Array<DelegationWhereInput>>;
  OR?: InputMaybe<Array<DelegationWhereInput>>;
  conference?: InputMaybe<ConferenceWhereInput>;
  conferenceId?: InputMaybe<StringFilter>;
  conferenceId_nationId?: InputMaybe<DelegationConferenceIdNationIdCompoundUniqueInput>;
  id?: InputMaybe<Scalars["String"]["input"]>;
  members?: InputMaybe<CommitteeMemberListRelationFilter>;
  nation?: InputMaybe<NationWhereInput>;
  nationId?: InputMaybe<StringFilter>;
}

export interface EnumCommitteeCategoryFieldUpdateOperationsInput {
  set?: InputMaybe<CommitteeCategory>;
}

export interface EnumCommitteeCategoryFilter {
  equals?: InputMaybe<CommitteeCategory>;
  in?: InputMaybe<Array<CommitteeCategory>>;
  not?: InputMaybe<CommitteeCategory>;
  notIn?: InputMaybe<Array<CommitteeCategory>>;
}

export interface EnumCommitteeCategoryWithAggregatesFilter {
  _count?: InputMaybe<NestedIntFilter>;
  _max?: InputMaybe<NestedEnumCommitteeCategoryFilter>;
  _min?: InputMaybe<NestedEnumCommitteeCategoryFilter>;
  equals?: InputMaybe<CommitteeCategory>;
  in?: InputMaybe<Array<CommitteeCategory>>;
  not?: InputMaybe<CommitteeCategory>;
  notIn?: InputMaybe<Array<CommitteeCategory>>;
}

export interface EnumCommitteeStatusFieldUpdateOperationsInput {
  set?: InputMaybe<CommitteeStatus>;
}

export interface EnumCommitteeStatusFilter {
  equals?: InputMaybe<CommitteeStatus>;
  in?: InputMaybe<Array<CommitteeStatus>>;
  not?: InputMaybe<CommitteeStatus>;
  notIn?: InputMaybe<Array<CommitteeStatus>>;
}

export interface EnumCommitteeStatusWithAggregatesFilter {
  _count?: InputMaybe<NestedIntFilter>;
  _max?: InputMaybe<NestedEnumCommitteeStatusFilter>;
  _min?: InputMaybe<NestedEnumCommitteeStatusFilter>;
  equals?: InputMaybe<CommitteeStatus>;
  in?: InputMaybe<Array<CommitteeStatus>>;
  not?: InputMaybe<CommitteeStatus>;
  notIn?: InputMaybe<Array<CommitteeStatus>>;
}

export interface EnumConferenceRoleFieldUpdateOperationsInput {
  set?: InputMaybe<ConferenceRole>;
}

export interface EnumConferenceRoleFilter {
  equals?: InputMaybe<ConferenceRole>;
  in?: InputMaybe<Array<ConferenceRole>>;
  not?: InputMaybe<ConferenceRole>;
  notIn?: InputMaybe<Array<ConferenceRole>>;
}

export interface EnumConferenceRoleWithAggregatesFilter {
  _count?: InputMaybe<NestedIntFilter>;
  _max?: InputMaybe<NestedEnumConferenceRoleFilter>;
  _min?: InputMaybe<NestedEnumConferenceRoleFilter>;
  equals?: InputMaybe<ConferenceRole>;
  in?: InputMaybe<Array<ConferenceRole>>;
  not?: InputMaybe<ConferenceRole>;
  notIn?: InputMaybe<Array<ConferenceRole>>;
}

export interface EnumMessageCategoryFieldUpdateOperationsInput {
  set?: InputMaybe<MessageCategory>;
}

export interface EnumMessageCategoryFilter {
  equals?: InputMaybe<MessageCategory>;
  in?: InputMaybe<Array<MessageCategory>>;
  not?: InputMaybe<MessageCategory>;
  notIn?: InputMaybe<Array<MessageCategory>>;
}

export interface EnumMessageCategoryWithAggregatesFilter {
  _count?: InputMaybe<NestedIntFilter>;
  _max?: InputMaybe<NestedEnumMessageCategoryFilter>;
  _min?: InputMaybe<NestedEnumMessageCategoryFilter>;
  equals?: InputMaybe<MessageCategory>;
  in?: InputMaybe<Array<MessageCategory>>;
  not?: InputMaybe<MessageCategory>;
  notIn?: InputMaybe<Array<MessageCategory>>;
}

export interface EnumMessageStatusNullableListFilter {
  equals?: InputMaybe<Array<MessageStatus>>;
  has?: InputMaybe<MessageStatus>;
  hasEvery?: InputMaybe<Array<MessageStatus>>;
  hasSome?: InputMaybe<Array<MessageStatus>>;
  isEmpty?: InputMaybe<Scalars["Boolean"]["input"]>;
}

export interface EnumNationVariantFieldUpdateOperationsInput {
  set?: InputMaybe<NationVariant>;
}

export interface EnumNationVariantFilter {
  equals?: InputMaybe<NationVariant>;
  in?: InputMaybe<Array<NationVariant>>;
  not?: InputMaybe<NationVariant>;
  notIn?: InputMaybe<Array<NationVariant>>;
}

export interface EnumNationVariantWithAggregatesFilter {
  _count?: InputMaybe<NestedIntFilter>;
  _max?: InputMaybe<NestedEnumNationVariantFilter>;
  _min?: InputMaybe<NestedEnumNationVariantFilter>;
  equals?: InputMaybe<NationVariant>;
  in?: InputMaybe<Array<NationVariant>>;
  not?: InputMaybe<NationVariant>;
  notIn?: InputMaybe<Array<NationVariant>>;
}

export interface EnumPresenceFieldUpdateOperationsInput {
  set?: InputMaybe<Presence>;
}

export interface EnumPresenceFilter {
  equals?: InputMaybe<Presence>;
  in?: InputMaybe<Array<Presence>>;
  not?: InputMaybe<Presence>;
  notIn?: InputMaybe<Array<Presence>>;
}

export interface EnumPresenceWithAggregatesFilter {
  _count?: InputMaybe<NestedIntFilter>;
  _max?: InputMaybe<NestedEnumPresenceFilter>;
  _min?: InputMaybe<NestedEnumPresenceFilter>;
  equals?: InputMaybe<Presence>;
  in?: InputMaybe<Array<Presence>>;
  not?: InputMaybe<Presence>;
  notIn?: InputMaybe<Array<Presence>>;
}

export interface EnumSpeakersListCategoryFieldUpdateOperationsInput {
  set?: InputMaybe<SpeakersListCategory>;
}

export interface EnumSpeakersListCategoryFilter {
  equals?: InputMaybe<SpeakersListCategory>;
  in?: InputMaybe<Array<SpeakersListCategory>>;
  not?: InputMaybe<SpeakersListCategory>;
  notIn?: InputMaybe<Array<SpeakersListCategory>>;
}

export interface EnumSpeakersListCategoryWithAggregatesFilter {
  _count?: InputMaybe<NestedIntFilter>;
  _max?: InputMaybe<NestedEnumSpeakersListCategoryFilter>;
  _min?: InputMaybe<NestedEnumSpeakersListCategoryFilter>;
  equals?: InputMaybe<SpeakersListCategory>;
  in?: InputMaybe<Array<SpeakersListCategory>>;
  not?: InputMaybe<SpeakersListCategory>;
  notIn?: InputMaybe<Array<SpeakersListCategory>>;
}

export interface IntFieldUpdateOperationsInput {
  decrement?: InputMaybe<Scalars["Int"]["input"]>;
  divide?: InputMaybe<Scalars["Int"]["input"]>;
  increment?: InputMaybe<Scalars["Int"]["input"]>;
  multiply?: InputMaybe<Scalars["Int"]["input"]>;
  set?: InputMaybe<Scalars["Int"]["input"]>;
}

export interface IntFilter {
  equals?: InputMaybe<Scalars["Int"]["input"]>;
  gt?: InputMaybe<Scalars["Int"]["input"]>;
  gte?: InputMaybe<Scalars["Int"]["input"]>;
  in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  lt?: InputMaybe<Scalars["Int"]["input"]>;
  lte?: InputMaybe<Scalars["Int"]["input"]>;
  not?: InputMaybe<NestedIntFilter>;
  notIn?: InputMaybe<Array<Scalars["Int"]["input"]>>;
}

export interface IntNullableFilter {
  equals?: InputMaybe<Scalars["Int"]["input"]>;
  gt?: InputMaybe<Scalars["Int"]["input"]>;
  gte?: InputMaybe<Scalars["Int"]["input"]>;
  in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  lt?: InputMaybe<Scalars["Int"]["input"]>;
  lte?: InputMaybe<Scalars["Int"]["input"]>;
  not?: InputMaybe<NestedIntNullableFilter>;
  notIn?: InputMaybe<Array<Scalars["Int"]["input"]>>;
}

export interface IntNullableWithAggregatesFilter {
  _avg?: InputMaybe<NestedFloatNullableFilter>;
  _count?: InputMaybe<NestedIntNullableFilter>;
  _max?: InputMaybe<NestedIntNullableFilter>;
  _min?: InputMaybe<NestedIntNullableFilter>;
  _sum?: InputMaybe<NestedIntNullableFilter>;
  equals?: InputMaybe<Scalars["Int"]["input"]>;
  gt?: InputMaybe<Scalars["Int"]["input"]>;
  gte?: InputMaybe<Scalars["Int"]["input"]>;
  in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  lt?: InputMaybe<Scalars["Int"]["input"]>;
  lte?: InputMaybe<Scalars["Int"]["input"]>;
  not?: InputMaybe<NestedIntNullableWithAggregatesFilter>;
  notIn?: InputMaybe<Array<Scalars["Int"]["input"]>>;
}

export interface IntWithAggregatesFilter {
  _avg?: InputMaybe<NestedFloatFilter>;
  _count?: InputMaybe<NestedIntFilter>;
  _max?: InputMaybe<NestedIntFilter>;
  _min?: InputMaybe<NestedIntFilter>;
  _sum?: InputMaybe<NestedIntFilter>;
  equals?: InputMaybe<Scalars["Int"]["input"]>;
  gt?: InputMaybe<Scalars["Int"]["input"]>;
  gte?: InputMaybe<Scalars["Int"]["input"]>;
  in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  lt?: InputMaybe<Scalars["Int"]["input"]>;
  lte?: InputMaybe<Scalars["Int"]["input"]>;
  not?: InputMaybe<NestedIntWithAggregatesFilter>;
  notIn?: InputMaybe<Array<Scalars["Int"]["input"]>>;
}

export enum MessageCategory {
  FACT_CHECK = "FACT_CHECK",
  GENERAL_SECRETARY = "GENERAL_SECRETARY",
  GUEST_SPEAKER = "GUEST_SPEAKER",
  INFORMATION = "INFORMATION",
  OTHER = "OTHER",
  TO_CHAIR = "TO_CHAIR",
}

export interface MessageCreateInput {
  authorId: Scalars["String"]["input"];
  category?: InputMaybe<MessageCategory>;
  committeeId: Scalars["String"]["input"];
  forwarded?: InputMaybe<Scalars["Boolean"]["input"]>;
  id?: InputMaybe<Scalars["String"]["input"]>;
  message: Scalars["String"]["input"];
  metaAgendaItem?: InputMaybe<Scalars["String"]["input"]>;
  metaCommittee?: InputMaybe<Scalars["String"]["input"]>;
  metaDelegation?: InputMaybe<Scalars["String"]["input"]>;
  metaEmail?: InputMaybe<Scalars["String"]["input"]>;
  status?: InputMaybe<Array<MessageStatus>>;
  subject: Scalars["String"]["input"];
  timestamp: Scalars["DateTime"]["input"];
}

export interface MessageCreateNestedManyWithoutAuthorInput {
  connect?: InputMaybe<Array<MessageWhereUniqueInput>>;
}

export interface MessageCreateNestedManyWithoutCommitteeInput {
  connect?: InputMaybe<Array<MessageWhereUniqueInput>>;
}

export interface MessageListRelationFilter {
  every?: InputMaybe<MessageWhereInput>;
  none?: InputMaybe<MessageWhereInput>;
  some?: InputMaybe<MessageWhereInput>;
}

export interface MessageOrderByRelationAggregateInput {
  _count?: InputMaybe<SortOrder>;
}

export interface MessageOrderByWithRelationInput {
  author?: InputMaybe<UserOrderByWithRelationInput>;
  authorId?: InputMaybe<SortOrder>;
  category?: InputMaybe<SortOrder>;
  committee?: InputMaybe<CommitteeOrderByWithRelationInput>;
  committeeId?: InputMaybe<SortOrder>;
  forwarded?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  message?: InputMaybe<SortOrder>;
  metaAgendaItem?: InputMaybe<SortOrder>;
  metaCommittee?: InputMaybe<SortOrder>;
  metaDelegation?: InputMaybe<SortOrder>;
  metaEmail?: InputMaybe<SortOrder>;
  status?: InputMaybe<SortOrder>;
  subject?: InputMaybe<SortOrder>;
  timestamp?: InputMaybe<SortOrder>;
}

export enum MessageScalarFieldEnum {
  authorId = "authorId",
  category = "category",
  committeeId = "committeeId",
  forwarded = "forwarded",
  id = "id",
  message = "message",
  metaAgendaItem = "metaAgendaItem",
  metaCommittee = "metaCommittee",
  metaDelegation = "metaDelegation",
  metaEmail = "metaEmail",
  status = "status",
  subject = "subject",
  timestamp = "timestamp",
}

export enum MessageStatus {
  ARCHIVED = "ARCHIVED",
  ASSIGNED = "ASSIGNED",
  PRIORITY = "PRIORITY",
  UNREAD = "UNREAD",
}

export interface MessageUpdateInput {
  authorId?: InputMaybe<StringFieldUpdateOperationsInput>;
  category?: InputMaybe<EnumMessageCategoryFieldUpdateOperationsInput>;
  committeeId?: InputMaybe<StringFieldUpdateOperationsInput>;
  forwarded?: InputMaybe<BoolFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  message?: InputMaybe<StringFieldUpdateOperationsInput>;
  metaAgendaItem?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  metaCommittee?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  metaDelegation?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  metaEmail?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  status?: InputMaybe<Array<MessageStatus>>;
  subject?: InputMaybe<StringFieldUpdateOperationsInput>;
  timestamp?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
}

export interface MessageUpdateManyMutationInput {
  category?: InputMaybe<EnumMessageCategoryFieldUpdateOperationsInput>;
  forwarded?: InputMaybe<BoolFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  message?: InputMaybe<StringFieldUpdateOperationsInput>;
  metaAgendaItem?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  metaCommittee?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  metaDelegation?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  metaEmail?: InputMaybe<NullableStringFieldUpdateOperationsInput>;
  status?: InputMaybe<Array<MessageStatus>>;
  subject?: InputMaybe<StringFieldUpdateOperationsInput>;
  timestamp?: InputMaybe<DateTimeFieldUpdateOperationsInput>;
}

export interface MessageUpdateManyWithoutAuthorNestedInput {
  connect?: InputMaybe<Array<MessageWhereUniqueInput>>;
  disconnect?: InputMaybe<Array<MessageWhereUniqueInput>>;
  set?: InputMaybe<Array<MessageWhereUniqueInput>>;
}

export interface MessageUpdateManyWithoutCommitteeNestedInput {
  connect?: InputMaybe<Array<MessageWhereUniqueInput>>;
  disconnect?: InputMaybe<Array<MessageWhereUniqueInput>>;
  set?: InputMaybe<Array<MessageWhereUniqueInput>>;
}

export interface MessageWhereInput {
  AND?: InputMaybe<Array<MessageWhereInput>>;
  NOT?: InputMaybe<Array<MessageWhereInput>>;
  OR?: InputMaybe<Array<MessageWhereInput>>;
  author?: InputMaybe<UserWhereInput>;
  authorId?: InputMaybe<StringFilter>;
  category?: InputMaybe<EnumMessageCategoryFilter>;
  committee?: InputMaybe<CommitteeWhereInput>;
  committeeId?: InputMaybe<StringFilter>;
  forwarded?: InputMaybe<BoolFilter>;
  id?: InputMaybe<StringFilter>;
  message?: InputMaybe<StringFilter>;
  metaAgendaItem?: InputMaybe<StringNullableFilter>;
  metaCommittee?: InputMaybe<StringNullableFilter>;
  metaDelegation?: InputMaybe<StringNullableFilter>;
  metaEmail?: InputMaybe<StringNullableFilter>;
  status?: InputMaybe<EnumMessageStatusNullableListFilter>;
  subject?: InputMaybe<StringFilter>;
  timestamp?: InputMaybe<DateTimeFilter>;
}

export interface MessageWhereUniqueInput {
  AND?: InputMaybe<Array<MessageWhereInput>>;
  NOT?: InputMaybe<Array<MessageWhereInput>>;
  OR?: InputMaybe<Array<MessageWhereInput>>;
  author?: InputMaybe<UserWhereInput>;
  authorId?: InputMaybe<StringFilter>;
  category?: InputMaybe<EnumMessageCategoryFilter>;
  committee?: InputMaybe<CommitteeWhereInput>;
  committeeId?: InputMaybe<StringFilter>;
  forwarded?: InputMaybe<BoolFilter>;
  id?: InputMaybe<Scalars["String"]["input"]>;
  message?: InputMaybe<StringFilter>;
  metaAgendaItem?: InputMaybe<StringNullableFilter>;
  metaCommittee?: InputMaybe<StringNullableFilter>;
  metaDelegation?: InputMaybe<StringNullableFilter>;
  metaEmail?: InputMaybe<StringNullableFilter>;
  status?: InputMaybe<EnumMessageStatusNullableListFilter>;
  subject?: InputMaybe<StringFilter>;
  timestamp?: InputMaybe<DateTimeFilter>;
}

export interface NationCreateInput {
  alpha3Code: Scalars["String"]["input"];
  delegations?: InputMaybe<DelegationCreateNestedManyWithoutNationInput>;
  id?: InputMaybe<Scalars["String"]["input"]>;
  variant?: InputMaybe<NationVariant>;
}

export interface NationOrderByWithRelationInput {
  alpha3Code?: InputMaybe<SortOrder>;
  delegations?: InputMaybe<DelegationOrderByRelationAggregateInput>;
  id?: InputMaybe<SortOrder>;
  variant?: InputMaybe<SortOrder>;
}

export interface NationRelationFilter {
  is?: InputMaybe<NationWhereInput>;
  isNot?: InputMaybe<NationWhereInput>;
}

export enum NationScalarFieldEnum {
  alpha3Code = "alpha3Code",
  id = "id",
  variant = "variant",
}

export interface NationUpdateInput {
  alpha3Code?: InputMaybe<StringFieldUpdateOperationsInput>;
  delegations?: InputMaybe<DelegationUpdateManyWithoutNationNestedInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  variant?: InputMaybe<EnumNationVariantFieldUpdateOperationsInput>;
}

export interface NationUpdateManyMutationInput {
  alpha3Code?: InputMaybe<StringFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  variant?: InputMaybe<EnumNationVariantFieldUpdateOperationsInput>;
}

export enum NationVariant {
  NATION = "NATION",
  NON_STATE_ACTOR = "NON_STATE_ACTOR",
  SPECIAL_PERSON = "SPECIAL_PERSON",
}

export interface NationWhereInput {
  AND?: InputMaybe<Array<NationWhereInput>>;
  NOT?: InputMaybe<Array<NationWhereInput>>;
  OR?: InputMaybe<Array<NationWhereInput>>;
  alpha3Code?: InputMaybe<StringFilter>;
  delegations?: InputMaybe<DelegationListRelationFilter>;
  id?: InputMaybe<StringFilter>;
  variant?: InputMaybe<EnumNationVariantFilter>;
}

export interface NationWhereUniqueInput {
  AND?: InputMaybe<Array<NationWhereInput>>;
  NOT?: InputMaybe<Array<NationWhereInput>>;
  OR?: InputMaybe<Array<NationWhereInput>>;
  alpha3Code?: InputMaybe<Scalars["String"]["input"]>;
  delegations?: InputMaybe<DelegationListRelationFilter>;
  id?: InputMaybe<Scalars["String"]["input"]>;
  variant?: InputMaybe<EnumNationVariantFilter>;
}

export interface NestedBoolFilter {
  equals?: InputMaybe<Scalars["Boolean"]["input"]>;
  not?: InputMaybe<NestedBoolFilter>;
}

export interface NestedBoolWithAggregatesFilter {
  _count?: InputMaybe<NestedIntFilter>;
  _max?: InputMaybe<NestedBoolFilter>;
  _min?: InputMaybe<NestedBoolFilter>;
  equals?: InputMaybe<Scalars["Boolean"]["input"]>;
  not?: InputMaybe<NestedBoolWithAggregatesFilter>;
}

export interface NestedDateTimeFilter {
  equals?: InputMaybe<Scalars["DateTime"]["input"]>;
  gt?: InputMaybe<Scalars["DateTime"]["input"]>;
  gte?: InputMaybe<Scalars["DateTime"]["input"]>;
  in?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
  lt?: InputMaybe<Scalars["DateTime"]["input"]>;
  lte?: InputMaybe<Scalars["DateTime"]["input"]>;
  not?: InputMaybe<NestedDateTimeFilter>;
  notIn?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
}

export interface NestedDateTimeNullableFilter {
  equals?: InputMaybe<Scalars["DateTime"]["input"]>;
  gt?: InputMaybe<Scalars["DateTime"]["input"]>;
  gte?: InputMaybe<Scalars["DateTime"]["input"]>;
  in?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
  lt?: InputMaybe<Scalars["DateTime"]["input"]>;
  lte?: InputMaybe<Scalars["DateTime"]["input"]>;
  not?: InputMaybe<NestedDateTimeNullableFilter>;
  notIn?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
}

export interface NestedDateTimeNullableWithAggregatesFilter {
  _count?: InputMaybe<NestedIntNullableFilter>;
  _max?: InputMaybe<NestedDateTimeNullableFilter>;
  _min?: InputMaybe<NestedDateTimeNullableFilter>;
  equals?: InputMaybe<Scalars["DateTime"]["input"]>;
  gt?: InputMaybe<Scalars["DateTime"]["input"]>;
  gte?: InputMaybe<Scalars["DateTime"]["input"]>;
  in?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
  lt?: InputMaybe<Scalars["DateTime"]["input"]>;
  lte?: InputMaybe<Scalars["DateTime"]["input"]>;
  not?: InputMaybe<NestedDateTimeNullableWithAggregatesFilter>;
  notIn?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
}

export interface NestedDateTimeWithAggregatesFilter {
  _count?: InputMaybe<NestedIntFilter>;
  _max?: InputMaybe<NestedDateTimeFilter>;
  _min?: InputMaybe<NestedDateTimeFilter>;
  equals?: InputMaybe<Scalars["DateTime"]["input"]>;
  gt?: InputMaybe<Scalars["DateTime"]["input"]>;
  gte?: InputMaybe<Scalars["DateTime"]["input"]>;
  in?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
  lt?: InputMaybe<Scalars["DateTime"]["input"]>;
  lte?: InputMaybe<Scalars["DateTime"]["input"]>;
  not?: InputMaybe<NestedDateTimeWithAggregatesFilter>;
  notIn?: InputMaybe<Array<Scalars["DateTime"]["input"]>>;
}

export interface NestedEnumCommitteeCategoryFilter {
  equals?: InputMaybe<CommitteeCategory>;
  in?: InputMaybe<Array<CommitteeCategory>>;
  not?: InputMaybe<CommitteeCategory>;
  notIn?: InputMaybe<Array<CommitteeCategory>>;
}

export interface NestedEnumCommitteeCategoryWithAggregatesFilter {
  _count?: InputMaybe<NestedIntFilter>;
  _max?: InputMaybe<NestedEnumCommitteeCategoryFilter>;
  _min?: InputMaybe<NestedEnumCommitteeCategoryFilter>;
  equals?: InputMaybe<CommitteeCategory>;
  in?: InputMaybe<Array<CommitteeCategory>>;
  not?: InputMaybe<CommitteeCategory>;
  notIn?: InputMaybe<Array<CommitteeCategory>>;
}

export interface NestedEnumCommitteeStatusFilter {
  equals?: InputMaybe<CommitteeStatus>;
  in?: InputMaybe<Array<CommitteeStatus>>;
  not?: InputMaybe<CommitteeStatus>;
  notIn?: InputMaybe<Array<CommitteeStatus>>;
}

export interface NestedEnumCommitteeStatusWithAggregatesFilter {
  _count?: InputMaybe<NestedIntFilter>;
  _max?: InputMaybe<NestedEnumCommitteeStatusFilter>;
  _min?: InputMaybe<NestedEnumCommitteeStatusFilter>;
  equals?: InputMaybe<CommitteeStatus>;
  in?: InputMaybe<Array<CommitteeStatus>>;
  not?: InputMaybe<CommitteeStatus>;
  notIn?: InputMaybe<Array<CommitteeStatus>>;
}

export interface NestedEnumConferenceRoleFilter {
  equals?: InputMaybe<ConferenceRole>;
  in?: InputMaybe<Array<ConferenceRole>>;
  not?: InputMaybe<ConferenceRole>;
  notIn?: InputMaybe<Array<ConferenceRole>>;
}

export interface NestedEnumConferenceRoleWithAggregatesFilter {
  _count?: InputMaybe<NestedIntFilter>;
  _max?: InputMaybe<NestedEnumConferenceRoleFilter>;
  _min?: InputMaybe<NestedEnumConferenceRoleFilter>;
  equals?: InputMaybe<ConferenceRole>;
  in?: InputMaybe<Array<ConferenceRole>>;
  not?: InputMaybe<ConferenceRole>;
  notIn?: InputMaybe<Array<ConferenceRole>>;
}

export interface NestedEnumMessageCategoryFilter {
  equals?: InputMaybe<MessageCategory>;
  in?: InputMaybe<Array<MessageCategory>>;
  not?: InputMaybe<MessageCategory>;
  notIn?: InputMaybe<Array<MessageCategory>>;
}

export interface NestedEnumMessageCategoryWithAggregatesFilter {
  _count?: InputMaybe<NestedIntFilter>;
  _max?: InputMaybe<NestedEnumMessageCategoryFilter>;
  _min?: InputMaybe<NestedEnumMessageCategoryFilter>;
  equals?: InputMaybe<MessageCategory>;
  in?: InputMaybe<Array<MessageCategory>>;
  not?: InputMaybe<MessageCategory>;
  notIn?: InputMaybe<Array<MessageCategory>>;
}

export interface NestedEnumNationVariantFilter {
  equals?: InputMaybe<NationVariant>;
  in?: InputMaybe<Array<NationVariant>>;
  not?: InputMaybe<NationVariant>;
  notIn?: InputMaybe<Array<NationVariant>>;
}

export interface NestedEnumNationVariantWithAggregatesFilter {
  _count?: InputMaybe<NestedIntFilter>;
  _max?: InputMaybe<NestedEnumNationVariantFilter>;
  _min?: InputMaybe<NestedEnumNationVariantFilter>;
  equals?: InputMaybe<NationVariant>;
  in?: InputMaybe<Array<NationVariant>>;
  not?: InputMaybe<NationVariant>;
  notIn?: InputMaybe<Array<NationVariant>>;
}

export interface NestedEnumPresenceFilter {
  equals?: InputMaybe<Presence>;
  in?: InputMaybe<Array<Presence>>;
  not?: InputMaybe<Presence>;
  notIn?: InputMaybe<Array<Presence>>;
}

export interface NestedEnumPresenceWithAggregatesFilter {
  _count?: InputMaybe<NestedIntFilter>;
  _max?: InputMaybe<NestedEnumPresenceFilter>;
  _min?: InputMaybe<NestedEnumPresenceFilter>;
  equals?: InputMaybe<Presence>;
  in?: InputMaybe<Array<Presence>>;
  not?: InputMaybe<Presence>;
  notIn?: InputMaybe<Array<Presence>>;
}

export interface NestedEnumSpeakersListCategoryFilter {
  equals?: InputMaybe<SpeakersListCategory>;
  in?: InputMaybe<Array<SpeakersListCategory>>;
  not?: InputMaybe<SpeakersListCategory>;
  notIn?: InputMaybe<Array<SpeakersListCategory>>;
}

export interface NestedEnumSpeakersListCategoryWithAggregatesFilter {
  _count?: InputMaybe<NestedIntFilter>;
  _max?: InputMaybe<NestedEnumSpeakersListCategoryFilter>;
  _min?: InputMaybe<NestedEnumSpeakersListCategoryFilter>;
  equals?: InputMaybe<SpeakersListCategory>;
  in?: InputMaybe<Array<SpeakersListCategory>>;
  not?: InputMaybe<SpeakersListCategory>;
  notIn?: InputMaybe<Array<SpeakersListCategory>>;
}

export interface NestedFloatFilter {
  equals?: InputMaybe<Scalars["Float"]["input"]>;
  gt?: InputMaybe<Scalars["Float"]["input"]>;
  gte?: InputMaybe<Scalars["Float"]["input"]>;
  in?: InputMaybe<Array<Scalars["Float"]["input"]>>;
  lt?: InputMaybe<Scalars["Float"]["input"]>;
  lte?: InputMaybe<Scalars["Float"]["input"]>;
  not?: InputMaybe<NestedFloatFilter>;
  notIn?: InputMaybe<Array<Scalars["Float"]["input"]>>;
}

export interface NestedFloatNullableFilter {
  equals?: InputMaybe<Scalars["Float"]["input"]>;
  gt?: InputMaybe<Scalars["Float"]["input"]>;
  gte?: InputMaybe<Scalars["Float"]["input"]>;
  in?: InputMaybe<Array<Scalars["Float"]["input"]>>;
  lt?: InputMaybe<Scalars["Float"]["input"]>;
  lte?: InputMaybe<Scalars["Float"]["input"]>;
  not?: InputMaybe<NestedFloatNullableFilter>;
  notIn?: InputMaybe<Array<Scalars["Float"]["input"]>>;
}

export interface NestedIntFilter {
  equals?: InputMaybe<Scalars["Int"]["input"]>;
  gt?: InputMaybe<Scalars["Int"]["input"]>;
  gte?: InputMaybe<Scalars["Int"]["input"]>;
  in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  lt?: InputMaybe<Scalars["Int"]["input"]>;
  lte?: InputMaybe<Scalars["Int"]["input"]>;
  not?: InputMaybe<NestedIntFilter>;
  notIn?: InputMaybe<Array<Scalars["Int"]["input"]>>;
}

export interface NestedIntNullableFilter {
  equals?: InputMaybe<Scalars["Int"]["input"]>;
  gt?: InputMaybe<Scalars["Int"]["input"]>;
  gte?: InputMaybe<Scalars["Int"]["input"]>;
  in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  lt?: InputMaybe<Scalars["Int"]["input"]>;
  lte?: InputMaybe<Scalars["Int"]["input"]>;
  not?: InputMaybe<NestedIntNullableFilter>;
  notIn?: InputMaybe<Array<Scalars["Int"]["input"]>>;
}

export interface NestedIntNullableWithAggregatesFilter {
  _avg?: InputMaybe<NestedFloatNullableFilter>;
  _count?: InputMaybe<NestedIntNullableFilter>;
  _max?: InputMaybe<NestedIntNullableFilter>;
  _min?: InputMaybe<NestedIntNullableFilter>;
  _sum?: InputMaybe<NestedIntNullableFilter>;
  equals?: InputMaybe<Scalars["Int"]["input"]>;
  gt?: InputMaybe<Scalars["Int"]["input"]>;
  gte?: InputMaybe<Scalars["Int"]["input"]>;
  in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  lt?: InputMaybe<Scalars["Int"]["input"]>;
  lte?: InputMaybe<Scalars["Int"]["input"]>;
  not?: InputMaybe<NestedIntNullableWithAggregatesFilter>;
  notIn?: InputMaybe<Array<Scalars["Int"]["input"]>>;
}

export interface NestedIntWithAggregatesFilter {
  _avg?: InputMaybe<NestedFloatFilter>;
  _count?: InputMaybe<NestedIntFilter>;
  _max?: InputMaybe<NestedIntFilter>;
  _min?: InputMaybe<NestedIntFilter>;
  _sum?: InputMaybe<NestedIntFilter>;
  equals?: InputMaybe<Scalars["Int"]["input"]>;
  gt?: InputMaybe<Scalars["Int"]["input"]>;
  gte?: InputMaybe<Scalars["Int"]["input"]>;
  in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  lt?: InputMaybe<Scalars["Int"]["input"]>;
  lte?: InputMaybe<Scalars["Int"]["input"]>;
  not?: InputMaybe<NestedIntWithAggregatesFilter>;
  notIn?: InputMaybe<Array<Scalars["Int"]["input"]>>;
}

export interface NestedStringFilter {
  contains?: InputMaybe<Scalars["String"]["input"]>;
  endsWith?: InputMaybe<Scalars["String"]["input"]>;
  equals?: InputMaybe<Scalars["String"]["input"]>;
  gt?: InputMaybe<Scalars["String"]["input"]>;
  gte?: InputMaybe<Scalars["String"]["input"]>;
  in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  lt?: InputMaybe<Scalars["String"]["input"]>;
  lte?: InputMaybe<Scalars["String"]["input"]>;
  not?: InputMaybe<NestedStringFilter>;
  notIn?: InputMaybe<Array<Scalars["String"]["input"]>>;
  startsWith?: InputMaybe<Scalars["String"]["input"]>;
}

export interface NestedStringNullableFilter {
  contains?: InputMaybe<Scalars["String"]["input"]>;
  endsWith?: InputMaybe<Scalars["String"]["input"]>;
  equals?: InputMaybe<Scalars["String"]["input"]>;
  gt?: InputMaybe<Scalars["String"]["input"]>;
  gte?: InputMaybe<Scalars["String"]["input"]>;
  in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  lt?: InputMaybe<Scalars["String"]["input"]>;
  lte?: InputMaybe<Scalars["String"]["input"]>;
  not?: InputMaybe<NestedStringNullableFilter>;
  notIn?: InputMaybe<Array<Scalars["String"]["input"]>>;
  startsWith?: InputMaybe<Scalars["String"]["input"]>;
}

export interface NestedStringNullableWithAggregatesFilter {
  _count?: InputMaybe<NestedIntNullableFilter>;
  _max?: InputMaybe<NestedStringNullableFilter>;
  _min?: InputMaybe<NestedStringNullableFilter>;
  contains?: InputMaybe<Scalars["String"]["input"]>;
  endsWith?: InputMaybe<Scalars["String"]["input"]>;
  equals?: InputMaybe<Scalars["String"]["input"]>;
  gt?: InputMaybe<Scalars["String"]["input"]>;
  gte?: InputMaybe<Scalars["String"]["input"]>;
  in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  lt?: InputMaybe<Scalars["String"]["input"]>;
  lte?: InputMaybe<Scalars["String"]["input"]>;
  not?: InputMaybe<NestedStringNullableWithAggregatesFilter>;
  notIn?: InputMaybe<Array<Scalars["String"]["input"]>>;
  startsWith?: InputMaybe<Scalars["String"]["input"]>;
}

export interface NestedStringWithAggregatesFilter {
  _count?: InputMaybe<NestedIntFilter>;
  _max?: InputMaybe<NestedStringFilter>;
  _min?: InputMaybe<NestedStringFilter>;
  contains?: InputMaybe<Scalars["String"]["input"]>;
  endsWith?: InputMaybe<Scalars["String"]["input"]>;
  equals?: InputMaybe<Scalars["String"]["input"]>;
  gt?: InputMaybe<Scalars["String"]["input"]>;
  gte?: InputMaybe<Scalars["String"]["input"]>;
  in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  lt?: InputMaybe<Scalars["String"]["input"]>;
  lte?: InputMaybe<Scalars["String"]["input"]>;
  not?: InputMaybe<NestedStringWithAggregatesFilter>;
  notIn?: InputMaybe<Array<Scalars["String"]["input"]>>;
  startsWith?: InputMaybe<Scalars["String"]["input"]>;
}

export interface NullableDateTimeFieldUpdateOperationsInput {
  set?: InputMaybe<Scalars["DateTime"]["input"]>;
}

export interface NullableIntFieldUpdateOperationsInput {
  decrement?: InputMaybe<Scalars["Int"]["input"]>;
  divide?: InputMaybe<Scalars["Int"]["input"]>;
  increment?: InputMaybe<Scalars["Int"]["input"]>;
  multiply?: InputMaybe<Scalars["Int"]["input"]>;
  set?: InputMaybe<Scalars["Int"]["input"]>;
}

export interface NullableStringFieldUpdateOperationsInput {
  set?: InputMaybe<Scalars["String"]["input"]>;
}

export enum NullsOrder {
  first = "first",
  last = "last",
}

export enum Presence {
  ABSENT = "ABSENT",
  EXCUSED = "EXCUSED",
  PRESENT = "PRESENT",
}

export enum QueryMode {
  default = "default",
  insensitive = "insensitive",
}

export enum SortOrder {
  asc = "asc",
  desc = "desc",
}

export interface SpeakerOnListCreateInput {
  committeeMemberId: Scalars["String"]["input"];
  id?: InputMaybe<Scalars["String"]["input"]>;
  position: Scalars["Int"]["input"];
  speakersListId: Scalars["String"]["input"];
}

export interface SpeakerOnListCreateNestedManyWithoutCommitteeMemberInput {
  connect?: InputMaybe<Array<SpeakerOnListWhereUniqueInput>>;
}

export interface SpeakerOnListCreateNestedManyWithoutSpeakersListInput {
  connect?: InputMaybe<Array<SpeakerOnListWhereUniqueInput>>;
}

export interface SpeakerOnListListRelationFilter {
  every?: InputMaybe<SpeakerOnListWhereInput>;
  none?: InputMaybe<SpeakerOnListWhereInput>;
  some?: InputMaybe<SpeakerOnListWhereInput>;
}

export interface SpeakerOnListOrderByRelationAggregateInput {
  _count?: InputMaybe<SortOrder>;
}

export interface SpeakerOnListOrderByWithRelationInput {
  committeeMember?: InputMaybe<CommitteeMemberOrderByWithRelationInput>;
  committeeMemberId?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  position?: InputMaybe<SortOrder>;
  speakersList?: InputMaybe<SpeakersListOrderByWithRelationInput>;
  speakersListId?: InputMaybe<SortOrder>;
}

export enum SpeakerOnListScalarFieldEnum {
  committeeMemberId = "committeeMemberId",
  id = "id",
  position = "position",
  speakersListId = "speakersListId",
}

export interface SpeakerOnListSpeakersListIdCommitteeMemberIdCompoundUniqueInput {
  committeeMemberId: Scalars["String"]["input"];
  speakersListId: Scalars["String"]["input"];
}

export interface SpeakerOnListSpeakersListIdPositionCompoundUniqueInput {
  position: Scalars["Int"]["input"];
  speakersListId: Scalars["String"]["input"];
}

export interface SpeakerOnListUpdateInput {
  committeeMemberId?: InputMaybe<StringFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  position?: InputMaybe<IntFieldUpdateOperationsInput>;
  speakersListId?: InputMaybe<StringFieldUpdateOperationsInput>;
}

export interface SpeakerOnListUpdateManyMutationInput {
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  position?: InputMaybe<IntFieldUpdateOperationsInput>;
}

export interface SpeakerOnListUpdateManyWithoutCommitteeMemberNestedInput {
  connect?: InputMaybe<Array<SpeakerOnListWhereUniqueInput>>;
  disconnect?: InputMaybe<Array<SpeakerOnListWhereUniqueInput>>;
  set?: InputMaybe<Array<SpeakerOnListWhereUniqueInput>>;
}

export interface SpeakerOnListUpdateManyWithoutSpeakersListNestedInput {
  connect?: InputMaybe<Array<SpeakerOnListWhereUniqueInput>>;
  disconnect?: InputMaybe<Array<SpeakerOnListWhereUniqueInput>>;
  set?: InputMaybe<Array<SpeakerOnListWhereUniqueInput>>;
}

export interface SpeakerOnListWhereInput {
  AND?: InputMaybe<Array<SpeakerOnListWhereInput>>;
  NOT?: InputMaybe<Array<SpeakerOnListWhereInput>>;
  OR?: InputMaybe<Array<SpeakerOnListWhereInput>>;
  committeeMember?: InputMaybe<CommitteeMemberWhereInput>;
  committeeMemberId?: InputMaybe<StringFilter>;
  id?: InputMaybe<StringFilter>;
  position?: InputMaybe<IntFilter>;
  speakersList?: InputMaybe<SpeakersListWhereInput>;
  speakersListId?: InputMaybe<StringFilter>;
}

export interface SpeakerOnListWhereUniqueInput {
  AND?: InputMaybe<Array<SpeakerOnListWhereInput>>;
  NOT?: InputMaybe<Array<SpeakerOnListWhereInput>>;
  OR?: InputMaybe<Array<SpeakerOnListWhereInput>>;
  committeeMember?: InputMaybe<CommitteeMemberWhereInput>;
  committeeMemberId?: InputMaybe<StringFilter>;
  id?: InputMaybe<Scalars["String"]["input"]>;
  position?: InputMaybe<IntFilter>;
  speakersList?: InputMaybe<SpeakersListWhereInput>;
  speakersListId?: InputMaybe<StringFilter>;
  speakersListId_committeeMemberId?: InputMaybe<SpeakerOnListSpeakersListIdCommitteeMemberIdCompoundUniqueInput>;
  speakersListId_position?: InputMaybe<SpeakerOnListSpeakersListIdPositionCompoundUniqueInput>;
}

export interface SpeakersListAgendaItemIdTypeCompoundUniqueInput {
  agendaItemId: Scalars["String"]["input"];
  type: SpeakersListCategory;
}

export enum SpeakersListCategory {
  COMMENT_LIST = "COMMENT_LIST",
  MODERATED_CAUCUS = "MODERATED_CAUCUS",
  SPEAKERS_LIST = "SPEAKERS_LIST",
}

export interface SpeakersListCreateInput {
  agendaItemId: Scalars["String"]["input"];
  id?: InputMaybe<Scalars["String"]["input"]>;
  isClosed?: InputMaybe<Scalars["Boolean"]["input"]>;
  speakers?: InputMaybe<SpeakerOnListCreateNestedManyWithoutSpeakersListInput>;
  speakingTime: Scalars["Int"]["input"];
  startTimestamp?: InputMaybe<Scalars["DateTime"]["input"]>;
  timeLeft?: InputMaybe<Scalars["Int"]["input"]>;
  type: SpeakersListCategory;
}

export interface SpeakersListCreateNestedManyWithoutAgendaItemInput {
  connect?: InputMaybe<Array<SpeakersListWhereUniqueInput>>;
}

export interface SpeakersListListRelationFilter {
  every?: InputMaybe<SpeakersListWhereInput>;
  none?: InputMaybe<SpeakersListWhereInput>;
  some?: InputMaybe<SpeakersListWhereInput>;
}

export interface SpeakersListOrderByRelationAggregateInput {
  _count?: InputMaybe<SortOrder>;
}

export interface SpeakersListOrderByWithRelationInput {
  agendaItem?: InputMaybe<AgendaItemOrderByWithRelationInput>;
  agendaItemId?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  isClosed?: InputMaybe<SortOrder>;
  speakers?: InputMaybe<SpeakerOnListOrderByRelationAggregateInput>;
  speakingTime?: InputMaybe<SortOrder>;
  startTimestamp?: InputMaybe<SortOrder>;
  timeLeft?: InputMaybe<SortOrder>;
  type?: InputMaybe<SortOrder>;
}

export interface SpeakersListRelationFilter {
  is?: InputMaybe<SpeakersListWhereInput>;
  isNot?: InputMaybe<SpeakersListWhereInput>;
}

export enum SpeakersListScalarFieldEnum {
  agendaItemId = "agendaItemId",
  id = "id",
  isClosed = "isClosed",
  speakingTime = "speakingTime",
  startTimestamp = "startTimestamp",
  timeLeft = "timeLeft",
  type = "type",
}

export interface SpeakersListUpdateInput {
  agendaItemId?: InputMaybe<StringFieldUpdateOperationsInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  isClosed?: InputMaybe<BoolFieldUpdateOperationsInput>;
  speakers?: InputMaybe<SpeakerOnListUpdateManyWithoutSpeakersListNestedInput>;
  speakingTime?: InputMaybe<IntFieldUpdateOperationsInput>;
  startTimestamp?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  timeLeft?: InputMaybe<NullableIntFieldUpdateOperationsInput>;
  type?: InputMaybe<EnumSpeakersListCategoryFieldUpdateOperationsInput>;
}

export interface SpeakersListUpdateManyMutationInput {
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  isClosed?: InputMaybe<BoolFieldUpdateOperationsInput>;
  speakingTime?: InputMaybe<IntFieldUpdateOperationsInput>;
  startTimestamp?: InputMaybe<NullableDateTimeFieldUpdateOperationsInput>;
  timeLeft?: InputMaybe<NullableIntFieldUpdateOperationsInput>;
  type?: InputMaybe<EnumSpeakersListCategoryFieldUpdateOperationsInput>;
}

export interface SpeakersListUpdateManyWithoutAgendaItemNestedInput {
  connect?: InputMaybe<Array<SpeakersListWhereUniqueInput>>;
  disconnect?: InputMaybe<Array<SpeakersListWhereUniqueInput>>;
  set?: InputMaybe<Array<SpeakersListWhereUniqueInput>>;
}

export interface SpeakersListWhereInput {
  AND?: InputMaybe<Array<SpeakersListWhereInput>>;
  NOT?: InputMaybe<Array<SpeakersListWhereInput>>;
  OR?: InputMaybe<Array<SpeakersListWhereInput>>;
  agendaItem?: InputMaybe<AgendaItemWhereInput>;
  agendaItemId?: InputMaybe<StringFilter>;
  id?: InputMaybe<StringFilter>;
  isClosed?: InputMaybe<BoolFilter>;
  speakers?: InputMaybe<SpeakerOnListListRelationFilter>;
  speakingTime?: InputMaybe<IntFilter>;
  startTimestamp?: InputMaybe<DateTimeNullableFilter>;
  timeLeft?: InputMaybe<IntNullableFilter>;
  type?: InputMaybe<EnumSpeakersListCategoryFilter>;
}

export interface SpeakersListWhereUniqueInput {
  AND?: InputMaybe<Array<SpeakersListWhereInput>>;
  NOT?: InputMaybe<Array<SpeakersListWhereInput>>;
  OR?: InputMaybe<Array<SpeakersListWhereInput>>;
  agendaItem?: InputMaybe<AgendaItemWhereInput>;
  agendaItemId?: InputMaybe<StringFilter>;
  agendaItemId_type?: InputMaybe<SpeakersListAgendaItemIdTypeCompoundUniqueInput>;
  id?: InputMaybe<Scalars["String"]["input"]>;
  isClosed?: InputMaybe<BoolFilter>;
  speakers?: InputMaybe<SpeakerOnListListRelationFilter>;
  speakingTime?: InputMaybe<IntFilter>;
  startTimestamp?: InputMaybe<DateTimeNullableFilter>;
  timeLeft?: InputMaybe<IntNullableFilter>;
  type?: InputMaybe<EnumSpeakersListCategoryFilter>;
}

export interface StringFieldUpdateOperationsInput {
  set?: InputMaybe<Scalars["String"]["input"]>;
}

export interface StringFilter {
  contains?: InputMaybe<Scalars["String"]["input"]>;
  endsWith?: InputMaybe<Scalars["String"]["input"]>;
  equals?: InputMaybe<Scalars["String"]["input"]>;
  gt?: InputMaybe<Scalars["String"]["input"]>;
  gte?: InputMaybe<Scalars["String"]["input"]>;
  in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  lt?: InputMaybe<Scalars["String"]["input"]>;
  lte?: InputMaybe<Scalars["String"]["input"]>;
  mode?: InputMaybe<QueryMode>;
  not?: InputMaybe<NestedStringFilter>;
  notIn?: InputMaybe<Array<Scalars["String"]["input"]>>;
  startsWith?: InputMaybe<Scalars["String"]["input"]>;
}

export interface StringNullableFilter {
  contains?: InputMaybe<Scalars["String"]["input"]>;
  endsWith?: InputMaybe<Scalars["String"]["input"]>;
  equals?: InputMaybe<Scalars["String"]["input"]>;
  gt?: InputMaybe<Scalars["String"]["input"]>;
  gte?: InputMaybe<Scalars["String"]["input"]>;
  in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  lt?: InputMaybe<Scalars["String"]["input"]>;
  lte?: InputMaybe<Scalars["String"]["input"]>;
  mode?: InputMaybe<QueryMode>;
  not?: InputMaybe<NestedStringNullableFilter>;
  notIn?: InputMaybe<Array<Scalars["String"]["input"]>>;
  startsWith?: InputMaybe<Scalars["String"]["input"]>;
}

export interface StringNullableWithAggregatesFilter {
  _count?: InputMaybe<NestedIntNullableFilter>;
  _max?: InputMaybe<NestedStringNullableFilter>;
  _min?: InputMaybe<NestedStringNullableFilter>;
  contains?: InputMaybe<Scalars["String"]["input"]>;
  endsWith?: InputMaybe<Scalars["String"]["input"]>;
  equals?: InputMaybe<Scalars["String"]["input"]>;
  gt?: InputMaybe<Scalars["String"]["input"]>;
  gte?: InputMaybe<Scalars["String"]["input"]>;
  in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  lt?: InputMaybe<Scalars["String"]["input"]>;
  lte?: InputMaybe<Scalars["String"]["input"]>;
  mode?: InputMaybe<QueryMode>;
  not?: InputMaybe<NestedStringNullableWithAggregatesFilter>;
  notIn?: InputMaybe<Array<Scalars["String"]["input"]>>;
  startsWith?: InputMaybe<Scalars["String"]["input"]>;
}

export interface StringWithAggregatesFilter {
  _count?: InputMaybe<NestedIntFilter>;
  _max?: InputMaybe<NestedStringFilter>;
  _min?: InputMaybe<NestedStringFilter>;
  contains?: InputMaybe<Scalars["String"]["input"]>;
  endsWith?: InputMaybe<Scalars["String"]["input"]>;
  equals?: InputMaybe<Scalars["String"]["input"]>;
  gt?: InputMaybe<Scalars["String"]["input"]>;
  gte?: InputMaybe<Scalars["String"]["input"]>;
  in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  lt?: InputMaybe<Scalars["String"]["input"]>;
  lte?: InputMaybe<Scalars["String"]["input"]>;
  mode?: InputMaybe<QueryMode>;
  not?: InputMaybe<NestedStringWithAggregatesFilter>;
  notIn?: InputMaybe<Array<Scalars["String"]["input"]>>;
  startsWith?: InputMaybe<Scalars["String"]["input"]>;
}

export enum TransactionIsolationLevel {
  ReadCommitted = "ReadCommitted",
  ReadUncommitted = "ReadUncommitted",
  RepeatableRead = "RepeatableRead",
  Serializable = "Serializable",
}

export interface UserCreateInput {
  committeeMemberships?: InputMaybe<CommitteeMemberCreateNestedManyWithoutUserInput>;
  conferenceMemberships?: InputMaybe<ConferenceMemberCreateNestedManyWithoutUserInput>;
  id?: InputMaybe<Scalars["String"]["input"]>;
  messages?: InputMaybe<MessageCreateNestedManyWithoutAuthorInput>;
}

export interface UserNullableRelationFilter {
  is?: InputMaybe<UserWhereInput>;
  isNot?: InputMaybe<UserWhereInput>;
}

export interface UserOrderByWithRelationInput {
  committeeMemberships?: InputMaybe<CommitteeMemberOrderByRelationAggregateInput>;
  conferenceMemberships?: InputMaybe<ConferenceMemberOrderByRelationAggregateInput>;
  id?: InputMaybe<SortOrder>;
  messages?: InputMaybe<MessageOrderByRelationAggregateInput>;
}

export interface UserRelationFilter {
  is?: InputMaybe<UserWhereInput>;
  isNot?: InputMaybe<UserWhereInput>;
}

export enum UserScalarFieldEnum {
  id = "id",
}

export interface UserUpdateInput {
  committeeMemberships?: InputMaybe<CommitteeMemberUpdateManyWithoutUserNestedInput>;
  conferenceMemberships?: InputMaybe<ConferenceMemberUpdateManyWithoutUserNestedInput>;
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
  messages?: InputMaybe<MessageUpdateManyWithoutAuthorNestedInput>;
}

export interface UserUpdateManyMutationInput {
  id?: InputMaybe<StringFieldUpdateOperationsInput>;
}

export interface UserWhereInput {
  AND?: InputMaybe<Array<UserWhereInput>>;
  NOT?: InputMaybe<Array<UserWhereInput>>;
  OR?: InputMaybe<Array<UserWhereInput>>;
  committeeMemberships?: InputMaybe<CommitteeMemberListRelationFilter>;
  conferenceMemberships?: InputMaybe<ConferenceMemberListRelationFilter>;
  id?: InputMaybe<StringFilter>;
  messages?: InputMaybe<MessageListRelationFilter>;
}

export interface UserWhereUniqueInput {
  AND?: InputMaybe<Array<UserWhereInput>>;
  NOT?: InputMaybe<Array<UserWhereInput>>;
  OR?: InputMaybe<Array<UserWhereInput>>;
  committeeMemberships?: InputMaybe<CommitteeMemberListRelationFilter>;
  conferenceMemberships?: InputMaybe<ConferenceMemberListRelationFilter>;
  id?: InputMaybe<Scalars["String"]["input"]>;
  messages?: InputMaybe<MessageListRelationFilter>;
}

export const scalarsEnumsHash: ScalarsEnumsHash = {
  AgendaItemScalarFieldEnum: true,
  Boolean: true,
  CommitteeCategory: true,
  CommitteeMemberScalarFieldEnum: true,
  CommitteeScalarFieldEnum: true,
  CommitteeStatus: true,
  ConferenceCreationTokenScalarFieldEnum: true,
  ConferenceMemberScalarFieldEnum: true,
  ConferenceRole: true,
  ConferenceScalarFieldEnum: true,
  DateTime: true,
  DelegationScalarFieldEnum: true,
  Float: true,
  ID: true,
  Int: true,
  MessageCategory: true,
  MessageScalarFieldEnum: true,
  MessageStatus: true,
  NationScalarFieldEnum: true,
  NationVariant: true,
  NullsOrder: true,
  Presence: true,
  QueryMode: true,
  SortOrder: true,
  SpeakerOnListScalarFieldEnum: true,
  SpeakersListCategory: true,
  SpeakersListScalarFieldEnum: true,
  String: true,
  TransactionIsolationLevel: true,
  UserScalarFieldEnum: true,
};
export const generatedSchema = {
  AgendaItem: {
    __typename: { __type: "String!" },
    committee: { __type: "Committee!" },
    description: { __type: "String" },
    id: { __type: "ID!" },
    isActive: { __type: "Boolean!" },
    speakerLists: { __type: "[SpeakersList!]!" },
    title: { __type: "String!" },
  },
  AgendaItemCreateInput: {
    committeeId: { __type: "String!" },
    description: { __type: "String" },
    id: { __type: "String" },
    isActive: { __type: "Boolean" },
    speakerLists: {
      __type: "SpeakersListCreateNestedManyWithoutAgendaItemInput",
    },
    title: { __type: "String!" },
  },
  AgendaItemCreateNestedManyWithoutCommitteeInput: {
    connect: { __type: "[AgendaItemWhereUniqueInput!]" },
  },
  AgendaItemListRelationFilter: {
    every: { __type: "AgendaItemWhereInput" },
    none: { __type: "AgendaItemWhereInput" },
    some: { __type: "AgendaItemWhereInput" },
  },
  AgendaItemOrderByRelationAggregateInput: { _count: { __type: "SortOrder" } },
  AgendaItemOrderByWithRelationInput: {
    committee: { __type: "CommitteeOrderByWithRelationInput" },
    committeeId: { __type: "SortOrder" },
    description: { __type: "SortOrder" },
    id: { __type: "SortOrder" },
    isActive: { __type: "SortOrder" },
    speakerLists: { __type: "SpeakersListOrderByRelationAggregateInput" },
    title: { __type: "SortOrder" },
  },
  AgendaItemRelationFilter: {
    is: { __type: "AgendaItemWhereInput" },
    isNot: { __type: "AgendaItemWhereInput" },
  },
  AgendaItemUpdateInput: {
    committeeId: { __type: "StringFieldUpdateOperationsInput" },
    description: { __type: "NullableStringFieldUpdateOperationsInput" },
    id: { __type: "StringFieldUpdateOperationsInput" },
    isActive: { __type: "BoolFieldUpdateOperationsInput" },
    speakerLists: {
      __type: "SpeakersListUpdateManyWithoutAgendaItemNestedInput",
    },
    title: { __type: "StringFieldUpdateOperationsInput" },
  },
  AgendaItemUpdateManyMutationInput: {
    description: { __type: "NullableStringFieldUpdateOperationsInput" },
    id: { __type: "StringFieldUpdateOperationsInput" },
    isActive: { __type: "BoolFieldUpdateOperationsInput" },
    title: { __type: "StringFieldUpdateOperationsInput" },
  },
  AgendaItemUpdateManyWithoutCommitteeNestedInput: {
    connect: { __type: "[AgendaItemWhereUniqueInput!]" },
    disconnect: { __type: "[AgendaItemWhereUniqueInput!]" },
    set: { __type: "[AgendaItemWhereUniqueInput!]" },
  },
  AgendaItemWhereInput: {
    AND: { __type: "[AgendaItemWhereInput!]" },
    NOT: { __type: "[AgendaItemWhereInput!]" },
    OR: { __type: "[AgendaItemWhereInput!]" },
    committee: { __type: "CommitteeWhereInput" },
    committeeId: { __type: "StringFilter" },
    description: { __type: "StringNullableFilter" },
    id: { __type: "StringFilter" },
    isActive: { __type: "BoolFilter" },
    speakerLists: { __type: "SpeakersListListRelationFilter" },
    title: { __type: "StringFilter" },
  },
  AgendaItemWhereUniqueInput: {
    AND: { __type: "[AgendaItemWhereInput!]" },
    NOT: { __type: "[AgendaItemWhereInput!]" },
    OR: { __type: "[AgendaItemWhereInput!]" },
    committee: { __type: "CommitteeWhereInput" },
    committeeId: { __type: "StringFilter" },
    description: { __type: "StringNullableFilter" },
    id: { __type: "String" },
    isActive: { __type: "BoolFilter" },
    speakerLists: { __type: "SpeakersListListRelationFilter" },
    title: { __type: "StringFilter" },
  },
  BatchPayload: {
    __typename: { __type: "String!" },
    count: { __type: "Int!" },
  },
  BoolFieldUpdateOperationsInput: { set: { __type: "Boolean" } },
  BoolFilter: {
    equals: { __type: "Boolean" },
    not: { __type: "NestedBoolFilter" },
  },
  BoolWithAggregatesFilter: {
    _count: { __type: "NestedIntFilter" },
    _max: { __type: "NestedBoolFilter" },
    _min: { __type: "NestedBoolFilter" },
    equals: { __type: "Boolean" },
    not: { __type: "NestedBoolWithAggregatesFilter" },
  },
  Committee: {
    __typename: { __type: "String!" },
    abbreviation: { __type: "String!" },
    agendaItems: { __type: "[AgendaItem!]!" },
    allowDelegationsToAddThemselvesToSpeakersList: { __type: "Boolean!" },
    category: { __type: "CommitteeCategory!" },
    conference: { __type: "Conference!" },
    id: { __type: "ID!" },
    members: { __type: "[CommitteeMember!]!" },
    messages: { __type: "[Message!]!" },
    name: { __type: "String!" },
    parent: { __type: "Committee!" },
    stateOfDebate: { __type: "String" },
    status: { __type: "CommitteeStatus!" },
    statusHeadline: { __type: "String" },
    statusUntil: { __type: "DateTime" },
    subCommittees: { __type: "[Committee!]!" },
    whiteboardContent: { __type: "String!" },
  },
  CommitteeAbbreviationConferenceIdCompoundUniqueInput: {
    abbreviation: { __type: "String!" },
    conferenceId: { __type: "String!" },
  },
  CommitteeCreateInput: {
    abbreviation: { __type: "String!" },
    agendaItems: { __type: "AgendaItemCreateNestedManyWithoutCommitteeInput" },
    allowDelegationsToAddThemselvesToSpeakersList: { __type: "Boolean" },
    category: { __type: "CommitteeCategory!" },
    conferenceId: { __type: "String!" },
    id: { __type: "String" },
    members: { __type: "CommitteeMemberCreateNestedManyWithoutCommitteeInput" },
    messages: { __type: "MessageCreateNestedManyWithoutCommitteeInput" },
    name: { __type: "String!" },
    parentId: { __type: "String" },
    stateOfDebate: { __type: "String" },
    status: { __type: "CommitteeStatus" },
    statusHeadline: { __type: "String" },
    statusUntil: { __type: "DateTime" },
    subCommittees: { __type: "CommitteeCreateNestedManyWithoutParentInput" },
    whiteboardContent: { __type: "String" },
  },
  CommitteeCreateNestedManyWithoutConferenceInput: {
    connect: { __type: "[CommitteeWhereUniqueInput!]" },
  },
  CommitteeCreateNestedManyWithoutParentInput: {
    connect: { __type: "[CommitteeWhereUniqueInput!]" },
  },
  CommitteeListRelationFilter: {
    every: { __type: "CommitteeWhereInput" },
    none: { __type: "CommitteeWhereInput" },
    some: { __type: "CommitteeWhereInput" },
  },
  CommitteeMember: {
    __typename: { __type: "String!" },
    committee: { __type: "Committee!" },
    delegation: { __type: "Delegation!" },
    id: { __type: "ID!" },
    presence: { __type: "Presence!" },
    speakerLists: { __type: "[SpeakerOnList!]!" },
    user: { __type: "User!" },
  },
  CommitteeMemberCommitteeIdDelegationIdCompoundUniqueInput: {
    committeeId: { __type: "String!" },
    delegationId: { __type: "String!" },
  },
  CommitteeMemberCommitteeIdUserIdCompoundUniqueInput: {
    committeeId: { __type: "String!" },
    userId: { __type: "String!" },
  },
  CommitteeMemberCreateInput: {
    committeeId: { __type: "String!" },
    delegationId: { __type: "String" },
    id: { __type: "String" },
    presence: { __type: "Presence" },
    speakerLists: {
      __type: "SpeakerOnListCreateNestedManyWithoutCommitteeMemberInput",
    },
    userId: { __type: "String" },
  },
  CommitteeMemberCreateNestedManyWithoutCommitteeInput: {
    connect: { __type: "[CommitteeMemberWhereUniqueInput!]" },
  },
  CommitteeMemberCreateNestedManyWithoutDelegationInput: {
    connect: { __type: "[CommitteeMemberWhereUniqueInput!]" },
  },
  CommitteeMemberCreateNestedManyWithoutUserInput: {
    connect: { __type: "[CommitteeMemberWhereUniqueInput!]" },
  },
  CommitteeMemberListRelationFilter: {
    every: { __type: "CommitteeMemberWhereInput" },
    none: { __type: "CommitteeMemberWhereInput" },
    some: { __type: "CommitteeMemberWhereInput" },
  },
  CommitteeMemberOrderByRelationAggregateInput: {
    _count: { __type: "SortOrder" },
  },
  CommitteeMemberOrderByWithRelationInput: {
    committee: { __type: "CommitteeOrderByWithRelationInput" },
    committeeId: { __type: "SortOrder" },
    delegation: { __type: "DelegationOrderByWithRelationInput" },
    delegationId: { __type: "SortOrder" },
    id: { __type: "SortOrder" },
    presence: { __type: "SortOrder" },
    speakerLists: { __type: "SpeakerOnListOrderByRelationAggregateInput" },
    user: { __type: "UserOrderByWithRelationInput" },
    userId: { __type: "SortOrder" },
  },
  CommitteeMemberRelationFilter: {
    is: { __type: "CommitteeMemberWhereInput" },
    isNot: { __type: "CommitteeMemberWhereInput" },
  },
  CommitteeMemberUpdateInput: {
    committeeId: { __type: "StringFieldUpdateOperationsInput" },
    delegationId: { __type: "NullableStringFieldUpdateOperationsInput" },
    id: { __type: "StringFieldUpdateOperationsInput" },
    presence: { __type: "EnumPresenceFieldUpdateOperationsInput" },
    speakerLists: {
      __type: "SpeakerOnListUpdateManyWithoutCommitteeMemberNestedInput",
    },
    userId: { __type: "NullableStringFieldUpdateOperationsInput" },
  },
  CommitteeMemberUpdateManyMutationInput: {
    id: { __type: "StringFieldUpdateOperationsInput" },
    presence: { __type: "EnumPresenceFieldUpdateOperationsInput" },
  },
  CommitteeMemberUpdateManyWithoutCommitteeNestedInput: {
    connect: { __type: "[CommitteeMemberWhereUniqueInput!]" },
    disconnect: { __type: "[CommitteeMemberWhereUniqueInput!]" },
    set: { __type: "[CommitteeMemberWhereUniqueInput!]" },
  },
  CommitteeMemberUpdateManyWithoutDelegationNestedInput: {
    connect: { __type: "[CommitteeMemberWhereUniqueInput!]" },
    disconnect: { __type: "[CommitteeMemberWhereUniqueInput!]" },
    set: { __type: "[CommitteeMemberWhereUniqueInput!]" },
  },
  CommitteeMemberUpdateManyWithoutUserNestedInput: {
    connect: { __type: "[CommitteeMemberWhereUniqueInput!]" },
    disconnect: { __type: "[CommitteeMemberWhereUniqueInput!]" },
    set: { __type: "[CommitteeMemberWhereUniqueInput!]" },
  },
  CommitteeMemberWhereInput: {
    AND: { __type: "[CommitteeMemberWhereInput!]" },
    NOT: { __type: "[CommitteeMemberWhereInput!]" },
    OR: { __type: "[CommitteeMemberWhereInput!]" },
    committee: { __type: "CommitteeWhereInput" },
    committeeId: { __type: "StringFilter" },
    delegation: { __type: "DelegationWhereInput" },
    delegationId: { __type: "StringNullableFilter" },
    id: { __type: "StringFilter" },
    presence: { __type: "EnumPresenceFilter" },
    speakerLists: { __type: "SpeakerOnListListRelationFilter" },
    user: { __type: "UserWhereInput" },
    userId: { __type: "StringNullableFilter" },
  },
  CommitteeMemberWhereUniqueInput: {
    AND: { __type: "[CommitteeMemberWhereInput!]" },
    NOT: { __type: "[CommitteeMemberWhereInput!]" },
    OR: { __type: "[CommitteeMemberWhereInput!]" },
    committee: { __type: "CommitteeWhereInput" },
    committeeId: { __type: "StringFilter" },
    committeeId_delegationId: {
      __type: "CommitteeMemberCommitteeIdDelegationIdCompoundUniqueInput",
    },
    committeeId_userId: {
      __type: "CommitteeMemberCommitteeIdUserIdCompoundUniqueInput",
    },
    delegation: { __type: "DelegationWhereInput" },
    delegationId: { __type: "StringNullableFilter" },
    id: { __type: "String" },
    presence: { __type: "EnumPresenceFilter" },
    speakerLists: { __type: "SpeakerOnListListRelationFilter" },
    user: { __type: "UserWhereInput" },
    userId: { __type: "StringNullableFilter" },
  },
  CommitteeNameConferenceIdCompoundUniqueInput: {
    conferenceId: { __type: "String!" },
    name: { __type: "String!" },
  },
  CommitteeNullableRelationFilter: {
    is: { __type: "CommitteeWhereInput" },
    isNot: { __type: "CommitteeWhereInput" },
  },
  CommitteeOrderByRelationAggregateInput: { _count: { __type: "SortOrder" } },
  CommitteeOrderByWithRelationInput: {
    abbreviation: { __type: "SortOrder" },
    agendaItems: { __type: "AgendaItemOrderByRelationAggregateInput" },
    allowDelegationsToAddThemselvesToSpeakersList: { __type: "SortOrder" },
    category: { __type: "SortOrder" },
    conference: { __type: "ConferenceOrderByWithRelationInput" },
    conferenceId: { __type: "SortOrder" },
    id: { __type: "SortOrder" },
    members: { __type: "CommitteeMemberOrderByRelationAggregateInput" },
    messages: { __type: "MessageOrderByRelationAggregateInput" },
    name: { __type: "SortOrder" },
    parent: { __type: "CommitteeOrderByWithRelationInput" },
    parentId: { __type: "SortOrder" },
    stateOfDebate: { __type: "SortOrder" },
    status: { __type: "SortOrder" },
    statusHeadline: { __type: "SortOrder" },
    statusUntil: { __type: "SortOrder" },
    subCommittees: { __type: "CommitteeOrderByRelationAggregateInput" },
    whiteboardContent: { __type: "SortOrder" },
  },
  CommitteeRelationFilter: {
    is: { __type: "CommitteeWhereInput" },
    isNot: { __type: "CommitteeWhereInput" },
  },
  CommitteeUpdateInput: {
    abbreviation: { __type: "StringFieldUpdateOperationsInput" },
    agendaItems: { __type: "AgendaItemUpdateManyWithoutCommitteeNestedInput" },
    allowDelegationsToAddThemselvesToSpeakersList: {
      __type: "BoolFieldUpdateOperationsInput",
    },
    category: { __type: "EnumCommitteeCategoryFieldUpdateOperationsInput" },
    conferenceId: { __type: "StringFieldUpdateOperationsInput" },
    id: { __type: "StringFieldUpdateOperationsInput" },
    members: { __type: "CommitteeMemberUpdateManyWithoutCommitteeNestedInput" },
    messages: { __type: "MessageUpdateManyWithoutCommitteeNestedInput" },
    name: { __type: "StringFieldUpdateOperationsInput" },
    parentId: { __type: "NullableStringFieldUpdateOperationsInput" },
    stateOfDebate: { __type: "NullableStringFieldUpdateOperationsInput" },
    status: { __type: "EnumCommitteeStatusFieldUpdateOperationsInput" },
    statusHeadline: { __type: "NullableStringFieldUpdateOperationsInput" },
    statusUntil: { __type: "NullableDateTimeFieldUpdateOperationsInput" },
    subCommittees: { __type: "CommitteeUpdateManyWithoutParentNestedInput" },
    whiteboardContent: { __type: "StringFieldUpdateOperationsInput" },
  },
  CommitteeUpdateManyMutationInput: {
    abbreviation: { __type: "StringFieldUpdateOperationsInput" },
    allowDelegationsToAddThemselvesToSpeakersList: {
      __type: "BoolFieldUpdateOperationsInput",
    },
    category: { __type: "EnumCommitteeCategoryFieldUpdateOperationsInput" },
    id: { __type: "StringFieldUpdateOperationsInput" },
    name: { __type: "StringFieldUpdateOperationsInput" },
    stateOfDebate: { __type: "NullableStringFieldUpdateOperationsInput" },
    status: { __type: "EnumCommitteeStatusFieldUpdateOperationsInput" },
    statusHeadline: { __type: "NullableStringFieldUpdateOperationsInput" },
    statusUntil: { __type: "NullableDateTimeFieldUpdateOperationsInput" },
    whiteboardContent: { __type: "StringFieldUpdateOperationsInput" },
  },
  CommitteeUpdateManyWithoutConferenceNestedInput: {
    connect: { __type: "[CommitteeWhereUniqueInput!]" },
    disconnect: { __type: "[CommitteeWhereUniqueInput!]" },
    set: { __type: "[CommitteeWhereUniqueInput!]" },
  },
  CommitteeUpdateManyWithoutParentNestedInput: {
    connect: { __type: "[CommitteeWhereUniqueInput!]" },
    disconnect: { __type: "[CommitteeWhereUniqueInput!]" },
    set: { __type: "[CommitteeWhereUniqueInput!]" },
  },
  CommitteeWhereInput: {
    AND: { __type: "[CommitteeWhereInput!]" },
    NOT: { __type: "[CommitteeWhereInput!]" },
    OR: { __type: "[CommitteeWhereInput!]" },
    abbreviation: { __type: "StringFilter" },
    agendaItems: { __type: "AgendaItemListRelationFilter" },
    allowDelegationsToAddThemselvesToSpeakersList: { __type: "BoolFilter" },
    category: { __type: "EnumCommitteeCategoryFilter" },
    conference: { __type: "ConferenceWhereInput" },
    conferenceId: { __type: "StringFilter" },
    id: { __type: "StringFilter" },
    members: { __type: "CommitteeMemberListRelationFilter" },
    messages: { __type: "MessageListRelationFilter" },
    name: { __type: "StringFilter" },
    parent: { __type: "CommitteeWhereInput" },
    parentId: { __type: "StringNullableFilter" },
    stateOfDebate: { __type: "StringNullableFilter" },
    status: { __type: "EnumCommitteeStatusFilter" },
    statusHeadline: { __type: "StringNullableFilter" },
    statusUntil: { __type: "DateTimeNullableFilter" },
    subCommittees: { __type: "CommitteeListRelationFilter" },
    whiteboardContent: { __type: "StringFilter" },
  },
  CommitteeWhereUniqueInput: {
    AND: { __type: "[CommitteeWhereInput!]" },
    NOT: { __type: "[CommitteeWhereInput!]" },
    OR: { __type: "[CommitteeWhereInput!]" },
    abbreviation: { __type: "StringFilter" },
    abbreviation_conferenceId: {
      __type: "CommitteeAbbreviationConferenceIdCompoundUniqueInput",
    },
    agendaItems: { __type: "AgendaItemListRelationFilter" },
    allowDelegationsToAddThemselvesToSpeakersList: { __type: "BoolFilter" },
    category: { __type: "EnumCommitteeCategoryFilter" },
    conference: { __type: "ConferenceWhereInput" },
    conferenceId: { __type: "StringFilter" },
    id: { __type: "String" },
    members: { __type: "CommitteeMemberListRelationFilter" },
    messages: { __type: "MessageListRelationFilter" },
    name: { __type: "StringFilter" },
    name_conferenceId: {
      __type: "CommitteeNameConferenceIdCompoundUniqueInput",
    },
    parent: { __type: "CommitteeWhereInput" },
    parentId: { __type: "StringNullableFilter" },
    stateOfDebate: { __type: "StringNullableFilter" },
    status: { __type: "EnumCommitteeStatusFilter" },
    statusHeadline: { __type: "StringNullableFilter" },
    statusUntil: { __type: "DateTimeNullableFilter" },
    subCommittees: { __type: "CommitteeListRelationFilter" },
    whiteboardContent: { __type: "StringFilter" },
  },
  Conference: {
    __typename: { __type: "String!" },
    committees: { __type: "[Committee!]!" },
    delegations: { __type: "[Delegation!]!" },
    end: { __type: "DateTime" },
    feedbackWebsite: { __type: "String" },
    id: { __type: "ID!" },
    members: { __type: "[ConferenceMember!]!" },
    name: { __type: "String!" },
    pressWebsite: { __type: "String" },
    start: { __type: "DateTime" },
  },
  ConferenceCreateInput: {
    committees: { __type: "CommitteeCreateNestedManyWithoutConferenceInput" },
    delegations: { __type: "DelegationCreateNestedManyWithoutConferenceInput" },
    end: { __type: "DateTime" },
    feedbackWebsite: { __type: "String" },
    id: { __type: "String" },
    members: {
      __type: "ConferenceMemberCreateNestedManyWithoutConferenceInput",
    },
    name: { __type: "String!" },
    pressWebsite: { __type: "String" },
    start: { __type: "DateTime" },
  },
  ConferenceCreationTokenCreateInput: { token: { __type: "String!" } },
  ConferenceCreationTokenOrderByWithRelationInput: {
    token: { __type: "SortOrder" },
  },
  ConferenceCreationTokenUpdateInput: {
    token: { __type: "StringFieldUpdateOperationsInput" },
  },
  ConferenceCreationTokenUpdateManyMutationInput: {
    token: { __type: "StringFieldUpdateOperationsInput" },
  },
  ConferenceCreationTokenWhereInput: {
    AND: { __type: "[ConferenceCreationTokenWhereInput!]" },
    NOT: { __type: "[ConferenceCreationTokenWhereInput!]" },
    OR: { __type: "[ConferenceCreationTokenWhereInput!]" },
    token: { __type: "StringFilter" },
  },
  ConferenceCreationTokenWhereUniqueInput: {
    AND: { __type: "[ConferenceCreationTokenWhereInput!]" },
    NOT: { __type: "[ConferenceCreationTokenWhereInput!]" },
    OR: { __type: "[ConferenceCreationTokenWhereInput!]" },
    token: { __type: "String" },
  },
  ConferenceMember: {
    __typename: { __type: "String!" },
    conference: { __type: "Conference!" },
    id: { __type: "ID!" },
    role: { __type: "ConferenceRole!" },
    user: { __type: "User!" },
  },
  ConferenceMemberCreateInput: {
    conferenceId: { __type: "String!" },
    id: { __type: "String" },
    role: { __type: "ConferenceRole!" },
    userId: { __type: "String" },
  },
  ConferenceMemberCreateNestedManyWithoutConferenceInput: {
    connect: { __type: "[ConferenceMemberWhereUniqueInput!]" },
  },
  ConferenceMemberCreateNestedManyWithoutUserInput: {
    connect: { __type: "[ConferenceMemberWhereUniqueInput!]" },
  },
  ConferenceMemberListRelationFilter: {
    every: { __type: "ConferenceMemberWhereInput" },
    none: { __type: "ConferenceMemberWhereInput" },
    some: { __type: "ConferenceMemberWhereInput" },
  },
  ConferenceMemberOrderByRelationAggregateInput: {
    _count: { __type: "SortOrder" },
  },
  ConferenceMemberOrderByWithRelationInput: {
    conference: { __type: "ConferenceOrderByWithRelationInput" },
    conferenceId: { __type: "SortOrder" },
    id: { __type: "SortOrder" },
    role: { __type: "SortOrder" },
    user: { __type: "UserOrderByWithRelationInput" },
    userId: { __type: "SortOrder" },
  },
  ConferenceMemberUpdateInput: {
    conferenceId: { __type: "StringFieldUpdateOperationsInput" },
    id: { __type: "StringFieldUpdateOperationsInput" },
    role: { __type: "EnumConferenceRoleFieldUpdateOperationsInput" },
    userId: { __type: "NullableStringFieldUpdateOperationsInput" },
  },
  ConferenceMemberUpdateManyMutationInput: {
    id: { __type: "StringFieldUpdateOperationsInput" },
    role: { __type: "EnumConferenceRoleFieldUpdateOperationsInput" },
  },
  ConferenceMemberUpdateManyWithoutConferenceNestedInput: {
    connect: { __type: "[ConferenceMemberWhereUniqueInput!]" },
    disconnect: { __type: "[ConferenceMemberWhereUniqueInput!]" },
    set: { __type: "[ConferenceMemberWhereUniqueInput!]" },
  },
  ConferenceMemberUpdateManyWithoutUserNestedInput: {
    connect: { __type: "[ConferenceMemberWhereUniqueInput!]" },
    disconnect: { __type: "[ConferenceMemberWhereUniqueInput!]" },
    set: { __type: "[ConferenceMemberWhereUniqueInput!]" },
  },
  ConferenceMemberUserIdConferenceIdCompoundUniqueInput: {
    conferenceId: { __type: "String!" },
    userId: { __type: "String!" },
  },
  ConferenceMemberWhereInput: {
    AND: { __type: "[ConferenceMemberWhereInput!]" },
    NOT: { __type: "[ConferenceMemberWhereInput!]" },
    OR: { __type: "[ConferenceMemberWhereInput!]" },
    conference: { __type: "ConferenceWhereInput" },
    conferenceId: { __type: "StringFilter" },
    id: { __type: "StringFilter" },
    role: { __type: "EnumConferenceRoleFilter" },
    user: { __type: "UserWhereInput" },
    userId: { __type: "StringNullableFilter" },
  },
  ConferenceMemberWhereUniqueInput: {
    AND: { __type: "[ConferenceMemberWhereInput!]" },
    NOT: { __type: "[ConferenceMemberWhereInput!]" },
    OR: { __type: "[ConferenceMemberWhereInput!]" },
    conference: { __type: "ConferenceWhereInput" },
    conferenceId: { __type: "StringFilter" },
    id: { __type: "String" },
    role: { __type: "EnumConferenceRoleFilter" },
    user: { __type: "UserWhereInput" },
    userId: { __type: "StringNullableFilter" },
    userId_conferenceId: {
      __type: "ConferenceMemberUserIdConferenceIdCompoundUniqueInput",
    },
  },
  ConferenceOrderByWithRelationInput: {
    committees: { __type: "CommitteeOrderByRelationAggregateInput" },
    delegations: { __type: "DelegationOrderByRelationAggregateInput" },
    end: { __type: "SortOrder" },
    feedbackWebsite: { __type: "SortOrder" },
    id: { __type: "SortOrder" },
    members: { __type: "ConferenceMemberOrderByRelationAggregateInput" },
    name: { __type: "SortOrder" },
    pressWebsite: { __type: "SortOrder" },
    start: { __type: "SortOrder" },
  },
  ConferenceRelationFilter: {
    is: { __type: "ConferenceWhereInput" },
    isNot: { __type: "ConferenceWhereInput" },
  },
  ConferenceUpdateInput: {
    committees: { __type: "CommitteeUpdateManyWithoutConferenceNestedInput" },
    delegations: { __type: "DelegationUpdateManyWithoutConferenceNestedInput" },
    end: { __type: "NullableDateTimeFieldUpdateOperationsInput" },
    feedbackWebsite: { __type: "NullableStringFieldUpdateOperationsInput" },
    id: { __type: "StringFieldUpdateOperationsInput" },
    members: {
      __type: "ConferenceMemberUpdateManyWithoutConferenceNestedInput",
    },
    name: { __type: "StringFieldUpdateOperationsInput" },
    pressWebsite: { __type: "NullableStringFieldUpdateOperationsInput" },
    start: { __type: "NullableDateTimeFieldUpdateOperationsInput" },
  },
  ConferenceUpdateManyMutationInput: {
    end: { __type: "NullableDateTimeFieldUpdateOperationsInput" },
    feedbackWebsite: { __type: "NullableStringFieldUpdateOperationsInput" },
    id: { __type: "StringFieldUpdateOperationsInput" },
    name: { __type: "StringFieldUpdateOperationsInput" },
    pressWebsite: { __type: "NullableStringFieldUpdateOperationsInput" },
    start: { __type: "NullableDateTimeFieldUpdateOperationsInput" },
  },
  ConferenceWhereInput: {
    AND: { __type: "[ConferenceWhereInput!]" },
    NOT: { __type: "[ConferenceWhereInput!]" },
    OR: { __type: "[ConferenceWhereInput!]" },
    committees: { __type: "CommitteeListRelationFilter" },
    delegations: { __type: "DelegationListRelationFilter" },
    end: { __type: "DateTimeNullableFilter" },
    feedbackWebsite: { __type: "StringNullableFilter" },
    id: { __type: "StringFilter" },
    members: { __type: "ConferenceMemberListRelationFilter" },
    name: { __type: "StringFilter" },
    pressWebsite: { __type: "StringNullableFilter" },
    start: { __type: "DateTimeNullableFilter" },
  },
  ConferenceWhereUniqueInput: {
    AND: { __type: "[ConferenceWhereInput!]" },
    NOT: { __type: "[ConferenceWhereInput!]" },
    OR: { __type: "[ConferenceWhereInput!]" },
    committees: { __type: "CommitteeListRelationFilter" },
    delegations: { __type: "DelegationListRelationFilter" },
    end: { __type: "DateTimeNullableFilter" },
    feedbackWebsite: { __type: "StringNullableFilter" },
    id: { __type: "String" },
    members: { __type: "ConferenceMemberListRelationFilter" },
    name: { __type: "String" },
    pressWebsite: { __type: "StringNullableFilter" },
    start: { __type: "DateTimeNullableFilter" },
  },
  DateTimeFieldUpdateOperationsInput: { set: { __type: "DateTime" } },
  DateTimeFilter: {
    equals: { __type: "DateTime" },
    gt: { __type: "DateTime" },
    gte: { __type: "DateTime" },
    in: { __type: "[DateTime!]" },
    lt: { __type: "DateTime" },
    lte: { __type: "DateTime" },
    not: { __type: "NestedDateTimeFilter" },
    notIn: { __type: "[DateTime!]" },
  },
  DateTimeNullableFilter: {
    equals: { __type: "DateTime" },
    gt: { __type: "DateTime" },
    gte: { __type: "DateTime" },
    in: { __type: "[DateTime!]" },
    lt: { __type: "DateTime" },
    lte: { __type: "DateTime" },
    not: { __type: "NestedDateTimeNullableFilter" },
    notIn: { __type: "[DateTime!]" },
  },
  DateTimeNullableWithAggregatesFilter: {
    _count: { __type: "NestedIntNullableFilter" },
    _max: { __type: "NestedDateTimeNullableFilter" },
    _min: { __type: "NestedDateTimeNullableFilter" },
    equals: { __type: "DateTime" },
    gt: { __type: "DateTime" },
    gte: { __type: "DateTime" },
    in: { __type: "[DateTime!]" },
    lt: { __type: "DateTime" },
    lte: { __type: "DateTime" },
    not: { __type: "NestedDateTimeNullableWithAggregatesFilter" },
    notIn: { __type: "[DateTime!]" },
  },
  DateTimeWithAggregatesFilter: {
    _count: { __type: "NestedIntFilter" },
    _max: { __type: "NestedDateTimeFilter" },
    _min: { __type: "NestedDateTimeFilter" },
    equals: { __type: "DateTime" },
    gt: { __type: "DateTime" },
    gte: { __type: "DateTime" },
    in: { __type: "[DateTime!]" },
    lt: { __type: "DateTime" },
    lte: { __type: "DateTime" },
    not: { __type: "NestedDateTimeWithAggregatesFilter" },
    notIn: { __type: "[DateTime!]" },
  },
  Delegation: {
    __typename: { __type: "String!" },
    conference: { __type: "Conference!" },
    id: { __type: "ID!" },
    members: { __type: "[CommitteeMember!]!" },
    nation: { __type: "Nation!" },
  },
  DelegationConferenceIdNationIdCompoundUniqueInput: {
    conferenceId: { __type: "String!" },
    nationId: { __type: "String!" },
  },
  DelegationCreateInput: {
    conferenceId: { __type: "String!" },
    id: { __type: "String" },
    members: {
      __type: "CommitteeMemberCreateNestedManyWithoutDelegationInput",
    },
    nationId: { __type: "String!" },
  },
  DelegationCreateNestedManyWithoutConferenceInput: {
    connect: { __type: "[DelegationWhereUniqueInput!]" },
  },
  DelegationCreateNestedManyWithoutNationInput: {
    connect: { __type: "[DelegationWhereUniqueInput!]" },
  },
  DelegationListRelationFilter: {
    every: { __type: "DelegationWhereInput" },
    none: { __type: "DelegationWhereInput" },
    some: { __type: "DelegationWhereInput" },
  },
  DelegationNullableRelationFilter: {
    is: { __type: "DelegationWhereInput" },
    isNot: { __type: "DelegationWhereInput" },
  },
  DelegationOrderByRelationAggregateInput: { _count: { __type: "SortOrder" } },
  DelegationOrderByWithRelationInput: {
    conference: { __type: "ConferenceOrderByWithRelationInput" },
    conferenceId: { __type: "SortOrder" },
    id: { __type: "SortOrder" },
    members: { __type: "CommitteeMemberOrderByRelationAggregateInput" },
    nation: { __type: "NationOrderByWithRelationInput" },
    nationId: { __type: "SortOrder" },
  },
  DelegationUpdateInput: {
    conferenceId: { __type: "StringFieldUpdateOperationsInput" },
    id: { __type: "StringFieldUpdateOperationsInput" },
    members: {
      __type: "CommitteeMemberUpdateManyWithoutDelegationNestedInput",
    },
    nationId: { __type: "StringFieldUpdateOperationsInput" },
  },
  DelegationUpdateManyMutationInput: {
    id: { __type: "StringFieldUpdateOperationsInput" },
  },
  DelegationUpdateManyWithoutConferenceNestedInput: {
    connect: { __type: "[DelegationWhereUniqueInput!]" },
    disconnect: { __type: "[DelegationWhereUniqueInput!]" },
    set: { __type: "[DelegationWhereUniqueInput!]" },
  },
  DelegationUpdateManyWithoutNationNestedInput: {
    connect: { __type: "[DelegationWhereUniqueInput!]" },
    disconnect: { __type: "[DelegationWhereUniqueInput!]" },
    set: { __type: "[DelegationWhereUniqueInput!]" },
  },
  DelegationWhereInput: {
    AND: { __type: "[DelegationWhereInput!]" },
    NOT: { __type: "[DelegationWhereInput!]" },
    OR: { __type: "[DelegationWhereInput!]" },
    conference: { __type: "ConferenceWhereInput" },
    conferenceId: { __type: "StringFilter" },
    id: { __type: "StringFilter" },
    members: { __type: "CommitteeMemberListRelationFilter" },
    nation: { __type: "NationWhereInput" },
    nationId: { __type: "StringFilter" },
  },
  DelegationWhereUniqueInput: {
    AND: { __type: "[DelegationWhereInput!]" },
    NOT: { __type: "[DelegationWhereInput!]" },
    OR: { __type: "[DelegationWhereInput!]" },
    conference: { __type: "ConferenceWhereInput" },
    conferenceId: { __type: "StringFilter" },
    conferenceId_nationId: {
      __type: "DelegationConferenceIdNationIdCompoundUniqueInput",
    },
    id: { __type: "String" },
    members: { __type: "CommitteeMemberListRelationFilter" },
    nation: { __type: "NationWhereInput" },
    nationId: { __type: "StringFilter" },
  },
  EnumCommitteeCategoryFieldUpdateOperationsInput: {
    set: { __type: "CommitteeCategory" },
  },
  EnumCommitteeCategoryFilter: {
    equals: { __type: "CommitteeCategory" },
    in: { __type: "[CommitteeCategory!]" },
    not: { __type: "CommitteeCategory" },
    notIn: { __type: "[CommitteeCategory!]" },
  },
  EnumCommitteeCategoryWithAggregatesFilter: {
    _count: { __type: "NestedIntFilter" },
    _max: { __type: "NestedEnumCommitteeCategoryFilter" },
    _min: { __type: "NestedEnumCommitteeCategoryFilter" },
    equals: { __type: "CommitteeCategory" },
    in: { __type: "[CommitteeCategory!]" },
    not: { __type: "CommitteeCategory" },
    notIn: { __type: "[CommitteeCategory!]" },
  },
  EnumCommitteeStatusFieldUpdateOperationsInput: {
    set: { __type: "CommitteeStatus" },
  },
  EnumCommitteeStatusFilter: {
    equals: { __type: "CommitteeStatus" },
    in: { __type: "[CommitteeStatus!]" },
    not: { __type: "CommitteeStatus" },
    notIn: { __type: "[CommitteeStatus!]" },
  },
  EnumCommitteeStatusWithAggregatesFilter: {
    _count: { __type: "NestedIntFilter" },
    _max: { __type: "NestedEnumCommitteeStatusFilter" },
    _min: { __type: "NestedEnumCommitteeStatusFilter" },
    equals: { __type: "CommitteeStatus" },
    in: { __type: "[CommitteeStatus!]" },
    not: { __type: "CommitteeStatus" },
    notIn: { __type: "[CommitteeStatus!]" },
  },
  EnumConferenceRoleFieldUpdateOperationsInput: {
    set: { __type: "ConferenceRole" },
  },
  EnumConferenceRoleFilter: {
    equals: { __type: "ConferenceRole" },
    in: { __type: "[ConferenceRole!]" },
    not: { __type: "ConferenceRole" },
    notIn: { __type: "[ConferenceRole!]" },
  },
  EnumConferenceRoleWithAggregatesFilter: {
    _count: { __type: "NestedIntFilter" },
    _max: { __type: "NestedEnumConferenceRoleFilter" },
    _min: { __type: "NestedEnumConferenceRoleFilter" },
    equals: { __type: "ConferenceRole" },
    in: { __type: "[ConferenceRole!]" },
    not: { __type: "ConferenceRole" },
    notIn: { __type: "[ConferenceRole!]" },
  },
  EnumMessageCategoryFieldUpdateOperationsInput: {
    set: { __type: "MessageCategory" },
  },
  EnumMessageCategoryFilter: {
    equals: { __type: "MessageCategory" },
    in: { __type: "[MessageCategory!]" },
    not: { __type: "MessageCategory" },
    notIn: { __type: "[MessageCategory!]" },
  },
  EnumMessageCategoryWithAggregatesFilter: {
    _count: { __type: "NestedIntFilter" },
    _max: { __type: "NestedEnumMessageCategoryFilter" },
    _min: { __type: "NestedEnumMessageCategoryFilter" },
    equals: { __type: "MessageCategory" },
    in: { __type: "[MessageCategory!]" },
    not: { __type: "MessageCategory" },
    notIn: { __type: "[MessageCategory!]" },
  },
  EnumMessageStatusNullableListFilter: {
    equals: { __type: "[MessageStatus!]" },
    has: { __type: "MessageStatus" },
    hasEvery: { __type: "[MessageStatus!]" },
    hasSome: { __type: "[MessageStatus!]" },
    isEmpty: { __type: "Boolean" },
  },
  EnumNationVariantFieldUpdateOperationsInput: {
    set: { __type: "NationVariant" },
  },
  EnumNationVariantFilter: {
    equals: { __type: "NationVariant" },
    in: { __type: "[NationVariant!]" },
    not: { __type: "NationVariant" },
    notIn: { __type: "[NationVariant!]" },
  },
  EnumNationVariantWithAggregatesFilter: {
    _count: { __type: "NestedIntFilter" },
    _max: { __type: "NestedEnumNationVariantFilter" },
    _min: { __type: "NestedEnumNationVariantFilter" },
    equals: { __type: "NationVariant" },
    in: { __type: "[NationVariant!]" },
    not: { __type: "NationVariant" },
    notIn: { __type: "[NationVariant!]" },
  },
  EnumPresenceFieldUpdateOperationsInput: { set: { __type: "Presence" } },
  EnumPresenceFilter: {
    equals: { __type: "Presence" },
    in: { __type: "[Presence!]" },
    not: { __type: "Presence" },
    notIn: { __type: "[Presence!]" },
  },
  EnumPresenceWithAggregatesFilter: {
    _count: { __type: "NestedIntFilter" },
    _max: { __type: "NestedEnumPresenceFilter" },
    _min: { __type: "NestedEnumPresenceFilter" },
    equals: { __type: "Presence" },
    in: { __type: "[Presence!]" },
    not: { __type: "Presence" },
    notIn: { __type: "[Presence!]" },
  },
  EnumSpeakersListCategoryFieldUpdateOperationsInput: {
    set: { __type: "SpeakersListCategory" },
  },
  EnumSpeakersListCategoryFilter: {
    equals: { __type: "SpeakersListCategory" },
    in: { __type: "[SpeakersListCategory!]" },
    not: { __type: "SpeakersListCategory" },
    notIn: { __type: "[SpeakersListCategory!]" },
  },
  EnumSpeakersListCategoryWithAggregatesFilter: {
    _count: { __type: "NestedIntFilter" },
    _max: { __type: "NestedEnumSpeakersListCategoryFilter" },
    _min: { __type: "NestedEnumSpeakersListCategoryFilter" },
    equals: { __type: "SpeakersListCategory" },
    in: { __type: "[SpeakersListCategory!]" },
    not: { __type: "SpeakersListCategory" },
    notIn: { __type: "[SpeakersListCategory!]" },
  },
  IntFieldUpdateOperationsInput: {
    decrement: { __type: "Int" },
    divide: { __type: "Int" },
    increment: { __type: "Int" },
    multiply: { __type: "Int" },
    set: { __type: "Int" },
  },
  IntFilter: {
    equals: { __type: "Int" },
    gt: { __type: "Int" },
    gte: { __type: "Int" },
    in: { __type: "[Int!]" },
    lt: { __type: "Int" },
    lte: { __type: "Int" },
    not: { __type: "NestedIntFilter" },
    notIn: { __type: "[Int!]" },
  },
  IntNullableFilter: {
    equals: { __type: "Int" },
    gt: { __type: "Int" },
    gte: { __type: "Int" },
    in: { __type: "[Int!]" },
    lt: { __type: "Int" },
    lte: { __type: "Int" },
    not: { __type: "NestedIntNullableFilter" },
    notIn: { __type: "[Int!]" },
  },
  IntNullableWithAggregatesFilter: {
    _avg: { __type: "NestedFloatNullableFilter" },
    _count: { __type: "NestedIntNullableFilter" },
    _max: { __type: "NestedIntNullableFilter" },
    _min: { __type: "NestedIntNullableFilter" },
    _sum: { __type: "NestedIntNullableFilter" },
    equals: { __type: "Int" },
    gt: { __type: "Int" },
    gte: { __type: "Int" },
    in: { __type: "[Int!]" },
    lt: { __type: "Int" },
    lte: { __type: "Int" },
    not: { __type: "NestedIntNullableWithAggregatesFilter" },
    notIn: { __type: "[Int!]" },
  },
  IntWithAggregatesFilter: {
    _avg: { __type: "NestedFloatFilter" },
    _count: { __type: "NestedIntFilter" },
    _max: { __type: "NestedIntFilter" },
    _min: { __type: "NestedIntFilter" },
    _sum: { __type: "NestedIntFilter" },
    equals: { __type: "Int" },
    gt: { __type: "Int" },
    gte: { __type: "Int" },
    in: { __type: "[Int!]" },
    lt: { __type: "Int" },
    lte: { __type: "Int" },
    not: { __type: "NestedIntWithAggregatesFilter" },
    notIn: { __type: "[Int!]" },
  },
  Message: {
    __typename: { __type: "String!" },
    author: { __type: "User!" },
    category: { __type: "MessageCategory!" },
    committee: { __type: "Committee!" },
    forwarded: { __type: "Boolean!" },
    id: { __type: "ID!" },
    message: { __type: "String!" },
    metaAgendaItem: { __type: "String" },
    metaCommittee: { __type: "String" },
    metaDelegation: { __type: "String" },
    metaEmail: { __type: "String" },
    status: { __type: "[MessageStatus!]!" },
    subject: { __type: "String!" },
    timestamp: { __type: "DateTime!" },
  },
  MessageCreateInput: {
    authorId: { __type: "String!" },
    category: { __type: "MessageCategory" },
    committeeId: { __type: "String!" },
    forwarded: { __type: "Boolean" },
    id: { __type: "String" },
    message: { __type: "String!" },
    metaAgendaItem: { __type: "String" },
    metaCommittee: { __type: "String" },
    metaDelegation: { __type: "String" },
    metaEmail: { __type: "String" },
    status: { __type: "[MessageStatus!]" },
    subject: { __type: "String!" },
    timestamp: { __type: "DateTime!" },
  },
  MessageCreateNestedManyWithoutAuthorInput: {
    connect: { __type: "[MessageWhereUniqueInput!]" },
  },
  MessageCreateNestedManyWithoutCommitteeInput: {
    connect: { __type: "[MessageWhereUniqueInput!]" },
  },
  MessageListRelationFilter: {
    every: { __type: "MessageWhereInput" },
    none: { __type: "MessageWhereInput" },
    some: { __type: "MessageWhereInput" },
  },
  MessageOrderByRelationAggregateInput: { _count: { __type: "SortOrder" } },
  MessageOrderByWithRelationInput: {
    author: { __type: "UserOrderByWithRelationInput" },
    authorId: { __type: "SortOrder" },
    category: { __type: "SortOrder" },
    committee: { __type: "CommitteeOrderByWithRelationInput" },
    committeeId: { __type: "SortOrder" },
    forwarded: { __type: "SortOrder" },
    id: { __type: "SortOrder" },
    message: { __type: "SortOrder" },
    metaAgendaItem: { __type: "SortOrder" },
    metaCommittee: { __type: "SortOrder" },
    metaDelegation: { __type: "SortOrder" },
    metaEmail: { __type: "SortOrder" },
    status: { __type: "SortOrder" },
    subject: { __type: "SortOrder" },
    timestamp: { __type: "SortOrder" },
  },
  MessageUpdateInput: {
    authorId: { __type: "StringFieldUpdateOperationsInput" },
    category: { __type: "EnumMessageCategoryFieldUpdateOperationsInput" },
    committeeId: { __type: "StringFieldUpdateOperationsInput" },
    forwarded: { __type: "BoolFieldUpdateOperationsInput" },
    id: { __type: "StringFieldUpdateOperationsInput" },
    message: { __type: "StringFieldUpdateOperationsInput" },
    metaAgendaItem: { __type: "NullableStringFieldUpdateOperationsInput" },
    metaCommittee: { __type: "NullableStringFieldUpdateOperationsInput" },
    metaDelegation: { __type: "NullableStringFieldUpdateOperationsInput" },
    metaEmail: { __type: "NullableStringFieldUpdateOperationsInput" },
    status: { __type: "[MessageStatus!]" },
    subject: { __type: "StringFieldUpdateOperationsInput" },
    timestamp: { __type: "DateTimeFieldUpdateOperationsInput" },
  },
  MessageUpdateManyMutationInput: {
    category: { __type: "EnumMessageCategoryFieldUpdateOperationsInput" },
    forwarded: { __type: "BoolFieldUpdateOperationsInput" },
    id: { __type: "StringFieldUpdateOperationsInput" },
    message: { __type: "StringFieldUpdateOperationsInput" },
    metaAgendaItem: { __type: "NullableStringFieldUpdateOperationsInput" },
    metaCommittee: { __type: "NullableStringFieldUpdateOperationsInput" },
    metaDelegation: { __type: "NullableStringFieldUpdateOperationsInput" },
    metaEmail: { __type: "NullableStringFieldUpdateOperationsInput" },
    status: { __type: "[MessageStatus!]" },
    subject: { __type: "StringFieldUpdateOperationsInput" },
    timestamp: { __type: "DateTimeFieldUpdateOperationsInput" },
  },
  MessageUpdateManyWithoutAuthorNestedInput: {
    connect: { __type: "[MessageWhereUniqueInput!]" },
    disconnect: { __type: "[MessageWhereUniqueInput!]" },
    set: { __type: "[MessageWhereUniqueInput!]" },
  },
  MessageUpdateManyWithoutCommitteeNestedInput: {
    connect: { __type: "[MessageWhereUniqueInput!]" },
    disconnect: { __type: "[MessageWhereUniqueInput!]" },
    set: { __type: "[MessageWhereUniqueInput!]" },
  },
  MessageWhereInput: {
    AND: { __type: "[MessageWhereInput!]" },
    NOT: { __type: "[MessageWhereInput!]" },
    OR: { __type: "[MessageWhereInput!]" },
    author: { __type: "UserWhereInput" },
    authorId: { __type: "StringFilter" },
    category: { __type: "EnumMessageCategoryFilter" },
    committee: { __type: "CommitteeWhereInput" },
    committeeId: { __type: "StringFilter" },
    forwarded: { __type: "BoolFilter" },
    id: { __type: "StringFilter" },
    message: { __type: "StringFilter" },
    metaAgendaItem: { __type: "StringNullableFilter" },
    metaCommittee: { __type: "StringNullableFilter" },
    metaDelegation: { __type: "StringNullableFilter" },
    metaEmail: { __type: "StringNullableFilter" },
    status: { __type: "EnumMessageStatusNullableListFilter" },
    subject: { __type: "StringFilter" },
    timestamp: { __type: "DateTimeFilter" },
  },
  MessageWhereUniqueInput: {
    AND: { __type: "[MessageWhereInput!]" },
    NOT: { __type: "[MessageWhereInput!]" },
    OR: { __type: "[MessageWhereInput!]" },
    author: { __type: "UserWhereInput" },
    authorId: { __type: "StringFilter" },
    category: { __type: "EnumMessageCategoryFilter" },
    committee: { __type: "CommitteeWhereInput" },
    committeeId: { __type: "StringFilter" },
    forwarded: { __type: "BoolFilter" },
    id: { __type: "String" },
    message: { __type: "StringFilter" },
    metaAgendaItem: { __type: "StringNullableFilter" },
    metaCommittee: { __type: "StringNullableFilter" },
    metaDelegation: { __type: "StringNullableFilter" },
    metaEmail: { __type: "StringNullableFilter" },
    status: { __type: "EnumMessageStatusNullableListFilter" },
    subject: { __type: "StringFilter" },
    timestamp: { __type: "DateTimeFilter" },
  },
  Nation: {
    __typename: { __type: "String!" },
    alpha3Code: { __type: "String!" },
    delegations: { __type: "[Delegation!]!" },
    id: { __type: "ID!" },
    variant: { __type: "NationVariant!" },
  },
  NationCreateInput: {
    alpha3Code: { __type: "String!" },
    delegations: { __type: "DelegationCreateNestedManyWithoutNationInput" },
    id: { __type: "String" },
    variant: { __type: "NationVariant" },
  },
  NationOrderByWithRelationInput: {
    alpha3Code: { __type: "SortOrder" },
    delegations: { __type: "DelegationOrderByRelationAggregateInput" },
    id: { __type: "SortOrder" },
    variant: { __type: "SortOrder" },
  },
  NationRelationFilter: {
    is: { __type: "NationWhereInput" },
    isNot: { __type: "NationWhereInput" },
  },
  NationUpdateInput: {
    alpha3Code: { __type: "StringFieldUpdateOperationsInput" },
    delegations: { __type: "DelegationUpdateManyWithoutNationNestedInput" },
    id: { __type: "StringFieldUpdateOperationsInput" },
    variant: { __type: "EnumNationVariantFieldUpdateOperationsInput" },
  },
  NationUpdateManyMutationInput: {
    alpha3Code: { __type: "StringFieldUpdateOperationsInput" },
    id: { __type: "StringFieldUpdateOperationsInput" },
    variant: { __type: "EnumNationVariantFieldUpdateOperationsInput" },
  },
  NationWhereInput: {
    AND: { __type: "[NationWhereInput!]" },
    NOT: { __type: "[NationWhereInput!]" },
    OR: { __type: "[NationWhereInput!]" },
    alpha3Code: { __type: "StringFilter" },
    delegations: { __type: "DelegationListRelationFilter" },
    id: { __type: "StringFilter" },
    variant: { __type: "EnumNationVariantFilter" },
  },
  NationWhereUniqueInput: {
    AND: { __type: "[NationWhereInput!]" },
    NOT: { __type: "[NationWhereInput!]" },
    OR: { __type: "[NationWhereInput!]" },
    alpha3Code: { __type: "String" },
    delegations: { __type: "DelegationListRelationFilter" },
    id: { __type: "String" },
    variant: { __type: "EnumNationVariantFilter" },
  },
  NestedBoolFilter: {
    equals: { __type: "Boolean" },
    not: { __type: "NestedBoolFilter" },
  },
  NestedBoolWithAggregatesFilter: {
    _count: { __type: "NestedIntFilter" },
    _max: { __type: "NestedBoolFilter" },
    _min: { __type: "NestedBoolFilter" },
    equals: { __type: "Boolean" },
    not: { __type: "NestedBoolWithAggregatesFilter" },
  },
  NestedDateTimeFilter: {
    equals: { __type: "DateTime" },
    gt: { __type: "DateTime" },
    gte: { __type: "DateTime" },
    in: { __type: "[DateTime!]" },
    lt: { __type: "DateTime" },
    lte: { __type: "DateTime" },
    not: { __type: "NestedDateTimeFilter" },
    notIn: { __type: "[DateTime!]" },
  },
  NestedDateTimeNullableFilter: {
    equals: { __type: "DateTime" },
    gt: { __type: "DateTime" },
    gte: { __type: "DateTime" },
    in: { __type: "[DateTime!]" },
    lt: { __type: "DateTime" },
    lte: { __type: "DateTime" },
    not: { __type: "NestedDateTimeNullableFilter" },
    notIn: { __type: "[DateTime!]" },
  },
  NestedDateTimeNullableWithAggregatesFilter: {
    _count: { __type: "NestedIntNullableFilter" },
    _max: { __type: "NestedDateTimeNullableFilter" },
    _min: { __type: "NestedDateTimeNullableFilter" },
    equals: { __type: "DateTime" },
    gt: { __type: "DateTime" },
    gte: { __type: "DateTime" },
    in: { __type: "[DateTime!]" },
    lt: { __type: "DateTime" },
    lte: { __type: "DateTime" },
    not: { __type: "NestedDateTimeNullableWithAggregatesFilter" },
    notIn: { __type: "[DateTime!]" },
  },
  NestedDateTimeWithAggregatesFilter: {
    _count: { __type: "NestedIntFilter" },
    _max: { __type: "NestedDateTimeFilter" },
    _min: { __type: "NestedDateTimeFilter" },
    equals: { __type: "DateTime" },
    gt: { __type: "DateTime" },
    gte: { __type: "DateTime" },
    in: { __type: "[DateTime!]" },
    lt: { __type: "DateTime" },
    lte: { __type: "DateTime" },
    not: { __type: "NestedDateTimeWithAggregatesFilter" },
    notIn: { __type: "[DateTime!]" },
  },
  NestedEnumCommitteeCategoryFilter: {
    equals: { __type: "CommitteeCategory" },
    in: { __type: "[CommitteeCategory!]" },
    not: { __type: "CommitteeCategory" },
    notIn: { __type: "[CommitteeCategory!]" },
  },
  NestedEnumCommitteeCategoryWithAggregatesFilter: {
    _count: { __type: "NestedIntFilter" },
    _max: { __type: "NestedEnumCommitteeCategoryFilter" },
    _min: { __type: "NestedEnumCommitteeCategoryFilter" },
    equals: { __type: "CommitteeCategory" },
    in: { __type: "[CommitteeCategory!]" },
    not: { __type: "CommitteeCategory" },
    notIn: { __type: "[CommitteeCategory!]" },
  },
  NestedEnumCommitteeStatusFilter: {
    equals: { __type: "CommitteeStatus" },
    in: { __type: "[CommitteeStatus!]" },
    not: { __type: "CommitteeStatus" },
    notIn: { __type: "[CommitteeStatus!]" },
  },
  NestedEnumCommitteeStatusWithAggregatesFilter: {
    _count: { __type: "NestedIntFilter" },
    _max: { __type: "NestedEnumCommitteeStatusFilter" },
    _min: { __type: "NestedEnumCommitteeStatusFilter" },
    equals: { __type: "CommitteeStatus" },
    in: { __type: "[CommitteeStatus!]" },
    not: { __type: "CommitteeStatus" },
    notIn: { __type: "[CommitteeStatus!]" },
  },
  NestedEnumConferenceRoleFilter: {
    equals: { __type: "ConferenceRole" },
    in: { __type: "[ConferenceRole!]" },
    not: { __type: "ConferenceRole" },
    notIn: { __type: "[ConferenceRole!]" },
  },
  NestedEnumConferenceRoleWithAggregatesFilter: {
    _count: { __type: "NestedIntFilter" },
    _max: { __type: "NestedEnumConferenceRoleFilter" },
    _min: { __type: "NestedEnumConferenceRoleFilter" },
    equals: { __type: "ConferenceRole" },
    in: { __type: "[ConferenceRole!]" },
    not: { __type: "ConferenceRole" },
    notIn: { __type: "[ConferenceRole!]" },
  },
  NestedEnumMessageCategoryFilter: {
    equals: { __type: "MessageCategory" },
    in: { __type: "[MessageCategory!]" },
    not: { __type: "MessageCategory" },
    notIn: { __type: "[MessageCategory!]" },
  },
  NestedEnumMessageCategoryWithAggregatesFilter: {
    _count: { __type: "NestedIntFilter" },
    _max: { __type: "NestedEnumMessageCategoryFilter" },
    _min: { __type: "NestedEnumMessageCategoryFilter" },
    equals: { __type: "MessageCategory" },
    in: { __type: "[MessageCategory!]" },
    not: { __type: "MessageCategory" },
    notIn: { __type: "[MessageCategory!]" },
  },
  NestedEnumNationVariantFilter: {
    equals: { __type: "NationVariant" },
    in: { __type: "[NationVariant!]" },
    not: { __type: "NationVariant" },
    notIn: { __type: "[NationVariant!]" },
  },
  NestedEnumNationVariantWithAggregatesFilter: {
    _count: { __type: "NestedIntFilter" },
    _max: { __type: "NestedEnumNationVariantFilter" },
    _min: { __type: "NestedEnumNationVariantFilter" },
    equals: { __type: "NationVariant" },
    in: { __type: "[NationVariant!]" },
    not: { __type: "NationVariant" },
    notIn: { __type: "[NationVariant!]" },
  },
  NestedEnumPresenceFilter: {
    equals: { __type: "Presence" },
    in: { __type: "[Presence!]" },
    not: { __type: "Presence" },
    notIn: { __type: "[Presence!]" },
  },
  NestedEnumPresenceWithAggregatesFilter: {
    _count: { __type: "NestedIntFilter" },
    _max: { __type: "NestedEnumPresenceFilter" },
    _min: { __type: "NestedEnumPresenceFilter" },
    equals: { __type: "Presence" },
    in: { __type: "[Presence!]" },
    not: { __type: "Presence" },
    notIn: { __type: "[Presence!]" },
  },
  NestedEnumSpeakersListCategoryFilter: {
    equals: { __type: "SpeakersListCategory" },
    in: { __type: "[SpeakersListCategory!]" },
    not: { __type: "SpeakersListCategory" },
    notIn: { __type: "[SpeakersListCategory!]" },
  },
  NestedEnumSpeakersListCategoryWithAggregatesFilter: {
    _count: { __type: "NestedIntFilter" },
    _max: { __type: "NestedEnumSpeakersListCategoryFilter" },
    _min: { __type: "NestedEnumSpeakersListCategoryFilter" },
    equals: { __type: "SpeakersListCategory" },
    in: { __type: "[SpeakersListCategory!]" },
    not: { __type: "SpeakersListCategory" },
    notIn: { __type: "[SpeakersListCategory!]" },
  },
  NestedFloatFilter: {
    equals: { __type: "Float" },
    gt: { __type: "Float" },
    gte: { __type: "Float" },
    in: { __type: "[Float!]" },
    lt: { __type: "Float" },
    lte: { __type: "Float" },
    not: { __type: "NestedFloatFilter" },
    notIn: { __type: "[Float!]" },
  },
  NestedFloatNullableFilter: {
    equals: { __type: "Float" },
    gt: { __type: "Float" },
    gte: { __type: "Float" },
    in: { __type: "[Float!]" },
    lt: { __type: "Float" },
    lte: { __type: "Float" },
    not: { __type: "NestedFloatNullableFilter" },
    notIn: { __type: "[Float!]" },
  },
  NestedIntFilter: {
    equals: { __type: "Int" },
    gt: { __type: "Int" },
    gte: { __type: "Int" },
    in: { __type: "[Int!]" },
    lt: { __type: "Int" },
    lte: { __type: "Int" },
    not: { __type: "NestedIntFilter" },
    notIn: { __type: "[Int!]" },
  },
  NestedIntNullableFilter: {
    equals: { __type: "Int" },
    gt: { __type: "Int" },
    gte: { __type: "Int" },
    in: { __type: "[Int!]" },
    lt: { __type: "Int" },
    lte: { __type: "Int" },
    not: { __type: "NestedIntNullableFilter" },
    notIn: { __type: "[Int!]" },
  },
  NestedIntNullableWithAggregatesFilter: {
    _avg: { __type: "NestedFloatNullableFilter" },
    _count: { __type: "NestedIntNullableFilter" },
    _max: { __type: "NestedIntNullableFilter" },
    _min: { __type: "NestedIntNullableFilter" },
    _sum: { __type: "NestedIntNullableFilter" },
    equals: { __type: "Int" },
    gt: { __type: "Int" },
    gte: { __type: "Int" },
    in: { __type: "[Int!]" },
    lt: { __type: "Int" },
    lte: { __type: "Int" },
    not: { __type: "NestedIntNullableWithAggregatesFilter" },
    notIn: { __type: "[Int!]" },
  },
  NestedIntWithAggregatesFilter: {
    _avg: { __type: "NestedFloatFilter" },
    _count: { __type: "NestedIntFilter" },
    _max: { __type: "NestedIntFilter" },
    _min: { __type: "NestedIntFilter" },
    _sum: { __type: "NestedIntFilter" },
    equals: { __type: "Int" },
    gt: { __type: "Int" },
    gte: { __type: "Int" },
    in: { __type: "[Int!]" },
    lt: { __type: "Int" },
    lte: { __type: "Int" },
    not: { __type: "NestedIntWithAggregatesFilter" },
    notIn: { __type: "[Int!]" },
  },
  NestedStringFilter: {
    contains: { __type: "String" },
    endsWith: { __type: "String" },
    equals: { __type: "String" },
    gt: { __type: "String" },
    gte: { __type: "String" },
    in: { __type: "[String!]" },
    lt: { __type: "String" },
    lte: { __type: "String" },
    not: { __type: "NestedStringFilter" },
    notIn: { __type: "[String!]" },
    startsWith: { __type: "String" },
  },
  NestedStringNullableFilter: {
    contains: { __type: "String" },
    endsWith: { __type: "String" },
    equals: { __type: "String" },
    gt: { __type: "String" },
    gte: { __type: "String" },
    in: { __type: "[String!]" },
    lt: { __type: "String" },
    lte: { __type: "String" },
    not: { __type: "NestedStringNullableFilter" },
    notIn: { __type: "[String!]" },
    startsWith: { __type: "String" },
  },
  NestedStringNullableWithAggregatesFilter: {
    _count: { __type: "NestedIntNullableFilter" },
    _max: { __type: "NestedStringNullableFilter" },
    _min: { __type: "NestedStringNullableFilter" },
    contains: { __type: "String" },
    endsWith: { __type: "String" },
    equals: { __type: "String" },
    gt: { __type: "String" },
    gte: { __type: "String" },
    in: { __type: "[String!]" },
    lt: { __type: "String" },
    lte: { __type: "String" },
    not: { __type: "NestedStringNullableWithAggregatesFilter" },
    notIn: { __type: "[String!]" },
    startsWith: { __type: "String" },
  },
  NestedStringWithAggregatesFilter: {
    _count: { __type: "NestedIntFilter" },
    _max: { __type: "NestedStringFilter" },
    _min: { __type: "NestedStringFilter" },
    contains: { __type: "String" },
    endsWith: { __type: "String" },
    equals: { __type: "String" },
    gt: { __type: "String" },
    gte: { __type: "String" },
    in: { __type: "[String!]" },
    lt: { __type: "String" },
    lte: { __type: "String" },
    not: { __type: "NestedStringWithAggregatesFilter" },
    notIn: { __type: "[String!]" },
    startsWith: { __type: "String" },
  },
  NullableDateTimeFieldUpdateOperationsInput: { set: { __type: "DateTime" } },
  NullableIntFieldUpdateOperationsInput: {
    decrement: { __type: "Int" },
    divide: { __type: "Int" },
    increment: { __type: "Int" },
    multiply: { __type: "Int" },
    set: { __type: "Int" },
  },
  NullableStringFieldUpdateOperationsInput: { set: { __type: "String" } },
  SpeakerOnList: {
    __typename: { __type: "String!" },
    committeeMember: { __type: "CommitteeMember!" },
    id: { __type: "ID!" },
    position: { __type: "Int!" },
    speakersList: { __type: "SpeakersList!" },
  },
  SpeakerOnListCreateInput: {
    committeeMemberId: { __type: "String!" },
    id: { __type: "String" },
    position: { __type: "Int!" },
    speakersListId: { __type: "String!" },
  },
  SpeakerOnListCreateNestedManyWithoutCommitteeMemberInput: {
    connect: { __type: "[SpeakerOnListWhereUniqueInput!]" },
  },
  SpeakerOnListCreateNestedManyWithoutSpeakersListInput: {
    connect: { __type: "[SpeakerOnListWhereUniqueInput!]" },
  },
  SpeakerOnListListRelationFilter: {
    every: { __type: "SpeakerOnListWhereInput" },
    none: { __type: "SpeakerOnListWhereInput" },
    some: { __type: "SpeakerOnListWhereInput" },
  },
  SpeakerOnListOrderByRelationAggregateInput: {
    _count: { __type: "SortOrder" },
  },
  SpeakerOnListOrderByWithRelationInput: {
    committeeMember: { __type: "CommitteeMemberOrderByWithRelationInput" },
    committeeMemberId: { __type: "SortOrder" },
    id: { __type: "SortOrder" },
    position: { __type: "SortOrder" },
    speakersList: { __type: "SpeakersListOrderByWithRelationInput" },
    speakersListId: { __type: "SortOrder" },
  },
  SpeakerOnListSpeakersListIdCommitteeMemberIdCompoundUniqueInput: {
    committeeMemberId: { __type: "String!" },
    speakersListId: { __type: "String!" },
  },
  SpeakerOnListSpeakersListIdPositionCompoundUniqueInput: {
    position: { __type: "Int!" },
    speakersListId: { __type: "String!" },
  },
  SpeakerOnListUpdateInput: {
    committeeMemberId: { __type: "StringFieldUpdateOperationsInput" },
    id: { __type: "StringFieldUpdateOperationsInput" },
    position: { __type: "IntFieldUpdateOperationsInput" },
    speakersListId: { __type: "StringFieldUpdateOperationsInput" },
  },
  SpeakerOnListUpdateManyMutationInput: {
    id: { __type: "StringFieldUpdateOperationsInput" },
    position: { __type: "IntFieldUpdateOperationsInput" },
  },
  SpeakerOnListUpdateManyWithoutCommitteeMemberNestedInput: {
    connect: { __type: "[SpeakerOnListWhereUniqueInput!]" },
    disconnect: { __type: "[SpeakerOnListWhereUniqueInput!]" },
    set: { __type: "[SpeakerOnListWhereUniqueInput!]" },
  },
  SpeakerOnListUpdateManyWithoutSpeakersListNestedInput: {
    connect: { __type: "[SpeakerOnListWhereUniqueInput!]" },
    disconnect: { __type: "[SpeakerOnListWhereUniqueInput!]" },
    set: { __type: "[SpeakerOnListWhereUniqueInput!]" },
  },
  SpeakerOnListWhereInput: {
    AND: { __type: "[SpeakerOnListWhereInput!]" },
    NOT: { __type: "[SpeakerOnListWhereInput!]" },
    OR: { __type: "[SpeakerOnListWhereInput!]" },
    committeeMember: { __type: "CommitteeMemberWhereInput" },
    committeeMemberId: { __type: "StringFilter" },
    id: { __type: "StringFilter" },
    position: { __type: "IntFilter" },
    speakersList: { __type: "SpeakersListWhereInput" },
    speakersListId: { __type: "StringFilter" },
  },
  SpeakerOnListWhereUniqueInput: {
    AND: { __type: "[SpeakerOnListWhereInput!]" },
    NOT: { __type: "[SpeakerOnListWhereInput!]" },
    OR: { __type: "[SpeakerOnListWhereInput!]" },
    committeeMember: { __type: "CommitteeMemberWhereInput" },
    committeeMemberId: { __type: "StringFilter" },
    id: { __type: "String" },
    position: { __type: "IntFilter" },
    speakersList: { __type: "SpeakersListWhereInput" },
    speakersListId: { __type: "StringFilter" },
    speakersListId_committeeMemberId: {
      __type: "SpeakerOnListSpeakersListIdCommitteeMemberIdCompoundUniqueInput",
    },
    speakersListId_position: {
      __type: "SpeakerOnListSpeakersListIdPositionCompoundUniqueInput",
    },
  },
  SpeakersList: {
    __typename: { __type: "String!" },
    agendaItem: { __type: "AgendaItem!" },
    id: { __type: "ID!" },
    isClosed: { __type: "Boolean!" },
    speakers: { __type: "[SpeakerOnList!]!" },
    speakingTime: { __type: "Int!" },
    startTimestamp: { __type: "DateTime" },
    timeLeft: { __type: "Int" },
    type: { __type: "SpeakersListCategory!" },
  },
  SpeakersListAgendaItemIdTypeCompoundUniqueInput: {
    agendaItemId: { __type: "String!" },
    type: { __type: "SpeakersListCategory!" },
  },
  SpeakersListCreateInput: {
    agendaItemId: { __type: "String!" },
    id: { __type: "String" },
    isClosed: { __type: "Boolean" },
    speakers: {
      __type: "SpeakerOnListCreateNestedManyWithoutSpeakersListInput",
    },
    speakingTime: { __type: "Int!" },
    startTimestamp: { __type: "DateTime" },
    timeLeft: { __type: "Int" },
    type: { __type: "SpeakersListCategory!" },
  },
  SpeakersListCreateNestedManyWithoutAgendaItemInput: {
    connect: { __type: "[SpeakersListWhereUniqueInput!]" },
  },
  SpeakersListListRelationFilter: {
    every: { __type: "SpeakersListWhereInput" },
    none: { __type: "SpeakersListWhereInput" },
    some: { __type: "SpeakersListWhereInput" },
  },
  SpeakersListOrderByRelationAggregateInput: {
    _count: { __type: "SortOrder" },
  },
  SpeakersListOrderByWithRelationInput: {
    agendaItem: { __type: "AgendaItemOrderByWithRelationInput" },
    agendaItemId: { __type: "SortOrder" },
    id: { __type: "SortOrder" },
    isClosed: { __type: "SortOrder" },
    speakers: { __type: "SpeakerOnListOrderByRelationAggregateInput" },
    speakingTime: { __type: "SortOrder" },
    startTimestamp: { __type: "SortOrder" },
    timeLeft: { __type: "SortOrder" },
    type: { __type: "SortOrder" },
  },
  SpeakersListRelationFilter: {
    is: { __type: "SpeakersListWhereInput" },
    isNot: { __type: "SpeakersListWhereInput" },
  },
  SpeakersListUpdateInput: {
    agendaItemId: { __type: "StringFieldUpdateOperationsInput" },
    id: { __type: "StringFieldUpdateOperationsInput" },
    isClosed: { __type: "BoolFieldUpdateOperationsInput" },
    speakers: {
      __type: "SpeakerOnListUpdateManyWithoutSpeakersListNestedInput",
    },
    speakingTime: { __type: "IntFieldUpdateOperationsInput" },
    startTimestamp: { __type: "NullableDateTimeFieldUpdateOperationsInput" },
    timeLeft: { __type: "NullableIntFieldUpdateOperationsInput" },
    type: { __type: "EnumSpeakersListCategoryFieldUpdateOperationsInput" },
  },
  SpeakersListUpdateManyMutationInput: {
    id: { __type: "StringFieldUpdateOperationsInput" },
    isClosed: { __type: "BoolFieldUpdateOperationsInput" },
    speakingTime: { __type: "IntFieldUpdateOperationsInput" },
    startTimestamp: { __type: "NullableDateTimeFieldUpdateOperationsInput" },
    timeLeft: { __type: "NullableIntFieldUpdateOperationsInput" },
    type: { __type: "EnumSpeakersListCategoryFieldUpdateOperationsInput" },
  },
  SpeakersListUpdateManyWithoutAgendaItemNestedInput: {
    connect: { __type: "[SpeakersListWhereUniqueInput!]" },
    disconnect: { __type: "[SpeakersListWhereUniqueInput!]" },
    set: { __type: "[SpeakersListWhereUniqueInput!]" },
  },
  SpeakersListWhereInput: {
    AND: { __type: "[SpeakersListWhereInput!]" },
    NOT: { __type: "[SpeakersListWhereInput!]" },
    OR: { __type: "[SpeakersListWhereInput!]" },
    agendaItem: { __type: "AgendaItemWhereInput" },
    agendaItemId: { __type: "StringFilter" },
    id: { __type: "StringFilter" },
    isClosed: { __type: "BoolFilter" },
    speakers: { __type: "SpeakerOnListListRelationFilter" },
    speakingTime: { __type: "IntFilter" },
    startTimestamp: { __type: "DateTimeNullableFilter" },
    timeLeft: { __type: "IntNullableFilter" },
    type: { __type: "EnumSpeakersListCategoryFilter" },
  },
  SpeakersListWhereUniqueInput: {
    AND: { __type: "[SpeakersListWhereInput!]" },
    NOT: { __type: "[SpeakersListWhereInput!]" },
    OR: { __type: "[SpeakersListWhereInput!]" },
    agendaItem: { __type: "AgendaItemWhereInput" },
    agendaItemId: { __type: "StringFilter" },
    agendaItemId_type: {
      __type: "SpeakersListAgendaItemIdTypeCompoundUniqueInput",
    },
    id: { __type: "String" },
    isClosed: { __type: "BoolFilter" },
    speakers: { __type: "SpeakerOnListListRelationFilter" },
    speakingTime: { __type: "IntFilter" },
    startTimestamp: { __type: "DateTimeNullableFilter" },
    timeLeft: { __type: "IntNullableFilter" },
    type: { __type: "EnumSpeakersListCategoryFilter" },
  },
  StringFieldUpdateOperationsInput: { set: { __type: "String" } },
  StringFilter: {
    contains: { __type: "String" },
    endsWith: { __type: "String" },
    equals: { __type: "String" },
    gt: { __type: "String" },
    gte: { __type: "String" },
    in: { __type: "[String!]" },
    lt: { __type: "String" },
    lte: { __type: "String" },
    mode: { __type: "QueryMode" },
    not: { __type: "NestedStringFilter" },
    notIn: { __type: "[String!]" },
    startsWith: { __type: "String" },
  },
  StringNullableFilter: {
    contains: { __type: "String" },
    endsWith: { __type: "String" },
    equals: { __type: "String" },
    gt: { __type: "String" },
    gte: { __type: "String" },
    in: { __type: "[String!]" },
    lt: { __type: "String" },
    lte: { __type: "String" },
    mode: { __type: "QueryMode" },
    not: { __type: "NestedStringNullableFilter" },
    notIn: { __type: "[String!]" },
    startsWith: { __type: "String" },
  },
  StringNullableWithAggregatesFilter: {
    _count: { __type: "NestedIntNullableFilter" },
    _max: { __type: "NestedStringNullableFilter" },
    _min: { __type: "NestedStringNullableFilter" },
    contains: { __type: "String" },
    endsWith: { __type: "String" },
    equals: { __type: "String" },
    gt: { __type: "String" },
    gte: { __type: "String" },
    in: { __type: "[String!]" },
    lt: { __type: "String" },
    lte: { __type: "String" },
    mode: { __type: "QueryMode" },
    not: { __type: "NestedStringNullableWithAggregatesFilter" },
    notIn: { __type: "[String!]" },
    startsWith: { __type: "String" },
  },
  StringWithAggregatesFilter: {
    _count: { __type: "NestedIntFilter" },
    _max: { __type: "NestedStringFilter" },
    _min: { __type: "NestedStringFilter" },
    contains: { __type: "String" },
    endsWith: { __type: "String" },
    equals: { __type: "String" },
    gt: { __type: "String" },
    gte: { __type: "String" },
    in: { __type: "[String!]" },
    lt: { __type: "String" },
    lte: { __type: "String" },
    mode: { __type: "QueryMode" },
    not: { __type: "NestedStringWithAggregatesFilter" },
    notIn: { __type: "[String!]" },
    startsWith: { __type: "String" },
  },
  User: {
    __typename: { __type: "String!" },
    committeeMemberships: { __type: "[CommitteeMember!]!" },
    conferenceMemberships: { __type: "[ConferenceMember!]!" },
    id: { __type: "ID!" },
    messages: { __type: "[Message!]!" },
  },
  UserCreateInput: {
    committeeMemberships: {
      __type: "CommitteeMemberCreateNestedManyWithoutUserInput",
    },
    conferenceMemberships: {
      __type: "ConferenceMemberCreateNestedManyWithoutUserInput",
    },
    id: { __type: "String" },
    messages: { __type: "MessageCreateNestedManyWithoutAuthorInput" },
  },
  UserNullableRelationFilter: {
    is: { __type: "UserWhereInput" },
    isNot: { __type: "UserWhereInput" },
  },
  UserOrderByWithRelationInput: {
    committeeMemberships: {
      __type: "CommitteeMemberOrderByRelationAggregateInput",
    },
    conferenceMemberships: {
      __type: "ConferenceMemberOrderByRelationAggregateInput",
    },
    id: { __type: "SortOrder" },
    messages: { __type: "MessageOrderByRelationAggregateInput" },
  },
  UserRelationFilter: {
    is: { __type: "UserWhereInput" },
    isNot: { __type: "UserWhereInput" },
  },
  UserUpdateInput: {
    committeeMemberships: {
      __type: "CommitteeMemberUpdateManyWithoutUserNestedInput",
    },
    conferenceMemberships: {
      __type: "ConferenceMemberUpdateManyWithoutUserNestedInput",
    },
    id: { __type: "StringFieldUpdateOperationsInput" },
    messages: { __type: "MessageUpdateManyWithoutAuthorNestedInput" },
  },
  UserUpdateManyMutationInput: {
    id: { __type: "StringFieldUpdateOperationsInput" },
  },
  UserWhereInput: {
    AND: { __type: "[UserWhereInput!]" },
    NOT: { __type: "[UserWhereInput!]" },
    OR: { __type: "[UserWhereInput!]" },
    committeeMemberships: { __type: "CommitteeMemberListRelationFilter" },
    conferenceMemberships: { __type: "ConferenceMemberListRelationFilter" },
    id: { __type: "StringFilter" },
    messages: { __type: "MessageListRelationFilter" },
  },
  UserWhereUniqueInput: {
    AND: { __type: "[UserWhereInput!]" },
    NOT: { __type: "[UserWhereInput!]" },
    OR: { __type: "[UserWhereInput!]" },
    committeeMemberships: { __type: "CommitteeMemberListRelationFilter" },
    conferenceMemberships: { __type: "ConferenceMemberListRelationFilter" },
    id: { __type: "String" },
    messages: { __type: "MessageListRelationFilter" },
  },
  mutation: {
    __typename: { __type: "String!" },
    createOneAgendaItem: {
      __type: "AgendaItem!",
      __args: { data: "AgendaItemCreateInput!" },
    },
    createOneCommitteeMember: {
      __type: "CommitteeMember!",
      __args: { data: "CommitteeMemberCreateInput!" },
    },
    createOneConference: {
      __type: "Conference!",
      __args: { data: "ConferenceCreateInput!", token: "String!" },
    },
    createOneConferenceMember: {
      __type: "ConferenceMember!",
      __args: { data: "ConferenceMemberCreateInput!" },
    },
    createOneDelegation: {
      __type: "Delegation!",
      __args: { data: "DelegationCreateInput!" },
    },
    createOneMessage: {
      __type: "Message!",
      __args: { data: "MessageCreateInput!" },
    },
    createOneNation: {
      __type: "Nation!",
      __args: { data: "NationCreateInput!" },
    },
    createOneSpeakerOnList: {
      __type: "SpeakerOnList!",
      __args: { data: "SpeakerOnListCreateInput!" },
    },
    createOneSpeakersList: {
      __type: "SpeakersList!",
      __args: { data: "SpeakersListCreateInput!" },
    },
    createOneUser: { __type: "User!", __args: { data: "UserCreateInput!" } },
    createOrFindUserAfterLogin: { __type: "User!" },
    deleteOneAgendaItem: {
      __type: "AgendaItem",
      __args: { where: "AgendaItemWhereUniqueInput!" },
    },
    deleteOneCommitteeMember: {
      __type: "CommitteeMember",
      __args: { where: "CommitteeMemberWhereUniqueInput!" },
    },
    deleteOneConference: {
      __type: "Conference",
      __args: { where: "ConferenceWhereUniqueInput!" },
    },
    deleteOneConferenceMember: {
      __type: "ConferenceMember",
      __args: { where: "ConferenceMemberWhereUniqueInput!" },
    },
    deleteOneDelegation: {
      __type: "Delegation",
      __args: { where: "DelegationWhereUniqueInput!" },
    },
    deleteOneMessage: {
      __type: "Message",
      __args: { where: "MessageWhereUniqueInput!" },
    },
    deleteOneNation: {
      __type: "Nation",
      __args: { where: "NationWhereUniqueInput!" },
    },
    deleteOneSpeakerOnList: {
      __type: "SpeakerOnList",
      __args: { where: "SpeakerOnListWhereUniqueInput!" },
    },
    deleteOneSpeakersList: {
      __type: "SpeakersList",
      __args: { where: "SpeakersListWhereUniqueInput!" },
    },
    deleteOneUser: {
      __type: "User",
      __args: { where: "UserWhereUniqueInput!" },
    },
    updateOneAgendaItem: {
      __type: "AgendaItem",
      __args: {
        data: "AgendaItemUpdateInput!",
        where: "AgendaItemWhereUniqueInput!",
      },
    },
    updateOneCommitteeMember: {
      __type: "CommitteeMember",
      __args: {
        data: "CommitteeMemberUpdateInput!",
        where: "CommitteeMemberWhereUniqueInput!",
      },
    },
    updateOneConference: {
      __type: "Conference",
      __args: {
        data: "ConferenceUpdateInput!",
        where: "ConferenceWhereUniqueInput!",
      },
    },
    updateOneConferenceMember: {
      __type: "ConferenceMember",
      __args: {
        data: "ConferenceMemberUpdateInput!",
        where: "ConferenceMemberWhereUniqueInput!",
      },
    },
    updateOneDelegation: {
      __type: "Delegation",
      __args: {
        data: "DelegationUpdateInput!",
        where: "DelegationWhereUniqueInput!",
      },
    },
    updateOneMessage: {
      __type: "Message",
      __args: {
        data: "MessageUpdateInput!",
        where: "MessageWhereUniqueInput!",
      },
    },
    updateOneNation: {
      __type: "Nation",
      __args: { data: "NationUpdateInput!", where: "NationWhereUniqueInput!" },
    },
    updateOneSpeakerOnList: {
      __type: "SpeakerOnList",
      __args: {
        data: "SpeakerOnListUpdateInput!",
        where: "SpeakerOnListWhereUniqueInput!",
      },
    },
    updateOneSpeakersList: {
      __type: "SpeakersList",
      __args: {
        data: "SpeakersListUpdateInput!",
        where: "SpeakersListWhereUniqueInput!",
      },
    },
    updateOneUser: {
      __type: "User",
      __args: { data: "UserUpdateInput!", where: "UserWhereUniqueInput!" },
    },
  },
  query: {
    __typename: { __type: "String!" },
    findFirstAgendaItem: {
      __type: "AgendaItem",
      __args: {
        cursor: "AgendaItemWhereUniqueInput",
        distinct: "[AgendaItemScalarFieldEnum!]",
        orderBy: "[AgendaItemOrderByWithRelationInput!]",
        skip: "Int",
        take: "Int",
        where: "AgendaItemWhereInput",
      },
    },
    findFirstCommitteeMember: {
      __type: "CommitteeMember",
      __args: {
        cursor: "CommitteeMemberWhereUniqueInput",
        distinct: "[CommitteeMemberScalarFieldEnum!]",
        orderBy: "[CommitteeMemberOrderByWithRelationInput!]",
        skip: "Int",
        take: "Int",
        where: "CommitteeMemberWhereInput",
      },
    },
    findFirstConference: {
      __type: "Conference",
      __args: {
        cursor: "ConferenceWhereUniqueInput",
        distinct: "[ConferenceScalarFieldEnum!]",
        orderBy: "[ConferenceOrderByWithRelationInput!]",
        skip: "Int",
        take: "Int",
        where: "ConferenceWhereInput",
      },
    },
    findFirstConferenceMember: {
      __type: "ConferenceMember",
      __args: {
        cursor: "ConferenceMemberWhereUniqueInput",
        distinct: "[ConferenceMemberScalarFieldEnum!]",
        orderBy: "[ConferenceMemberOrderByWithRelationInput!]",
        skip: "Int",
        take: "Int",
        where: "ConferenceMemberWhereInput",
      },
    },
    findFirstDelegation: {
      __type: "Delegation",
      __args: {
        cursor: "DelegationWhereUniqueInput",
        distinct: "[DelegationScalarFieldEnum!]",
        orderBy: "[DelegationOrderByWithRelationInput!]",
        skip: "Int",
        take: "Int",
        where: "DelegationWhereInput",
      },
    },
    findFirstMessage: {
      __type: "Message",
      __args: {
        cursor: "MessageWhereUniqueInput",
        distinct: "[MessageScalarFieldEnum!]",
        orderBy: "[MessageOrderByWithRelationInput!]",
        skip: "Int",
        take: "Int",
        where: "MessageWhereInput",
      },
    },
    findFirstNation: {
      __type: "Nation",
      __args: {
        cursor: "NationWhereUniqueInput",
        distinct: "[NationScalarFieldEnum!]",
        orderBy: "[NationOrderByWithRelationInput!]",
        skip: "Int",
        take: "Int",
        where: "NationWhereInput",
      },
    },
    findFirstSpeakerOnList: {
      __type: "SpeakerOnList",
      __args: {
        cursor: "SpeakerOnListWhereUniqueInput",
        distinct: "[SpeakerOnListScalarFieldEnum!]",
        orderBy: "[SpeakerOnListOrderByWithRelationInput!]",
        skip: "Int",
        take: "Int",
        where: "SpeakerOnListWhereInput",
      },
    },
    findFirstSpeakersList: {
      __type: "SpeakersList",
      __args: {
        cursor: "SpeakersListWhereUniqueInput",
        distinct: "[SpeakersListScalarFieldEnum!]",
        orderBy: "[SpeakersListOrderByWithRelationInput!]",
        skip: "Int",
        take: "Int",
        where: "SpeakersListWhereInput",
      },
    },
    findFirstUser: {
      __type: "User",
      __args: {
        cursor: "UserWhereUniqueInput",
        distinct: "[UserScalarFieldEnum!]",
        orderBy: "[UserOrderByWithRelationInput!]",
        skip: "Int",
        take: "Int",
        where: "UserWhereInput",
      },
    },
    findManyAgendaItems: {
      __type: "[AgendaItem!]!",
      __args: {
        cursor: "AgendaItemWhereUniqueInput",
        distinct: "[AgendaItemScalarFieldEnum!]",
        orderBy: "[AgendaItemOrderByWithRelationInput!]",
        skip: "Int",
        take: "Int",
        where: "AgendaItemWhereInput",
      },
    },
    findManyCommitteeMembers: {
      __type: "[CommitteeMember!]!",
      __args: {
        cursor: "CommitteeMemberWhereUniqueInput",
        distinct: "[CommitteeMemberScalarFieldEnum!]",
        orderBy: "[CommitteeMemberOrderByWithRelationInput!]",
        skip: "Int",
        take: "Int",
        where: "CommitteeMemberWhereInput",
      },
    },
    findManyConferenceMembers: {
      __type: "[ConferenceMember!]!",
      __args: {
        cursor: "ConferenceMemberWhereUniqueInput",
        distinct: "[ConferenceMemberScalarFieldEnum!]",
        orderBy: "[ConferenceMemberOrderByWithRelationInput!]",
        skip: "Int",
        take: "Int",
        where: "ConferenceMemberWhereInput",
      },
    },
    findManyConferences: {
      __type: "[Conference!]!",
      __args: {
        cursor: "ConferenceWhereUniqueInput",
        distinct: "[ConferenceScalarFieldEnum!]",
        orderBy: "[ConferenceOrderByWithRelationInput!]",
        skip: "Int",
        take: "Int",
        where: "ConferenceWhereInput",
      },
    },
    findManyDelegations: {
      __type: "[Delegation!]!",
      __args: {
        cursor: "DelegationWhereUniqueInput",
        distinct: "[DelegationScalarFieldEnum!]",
        orderBy: "[DelegationOrderByWithRelationInput!]",
        skip: "Int",
        take: "Int",
        where: "DelegationWhereInput",
      },
    },
    findManyMessages: {
      __type: "[Message!]!",
      __args: {
        cursor: "MessageWhereUniqueInput",
        distinct: "[MessageScalarFieldEnum!]",
        orderBy: "[MessageOrderByWithRelationInput!]",
        skip: "Int",
        take: "Int",
        where: "MessageWhereInput",
      },
    },
    findManyNations: {
      __type: "[Nation!]!",
      __args: {
        cursor: "NationWhereUniqueInput",
        distinct: "[NationScalarFieldEnum!]",
        orderBy: "[NationOrderByWithRelationInput!]",
        skip: "Int",
        take: "Int",
        where: "NationWhereInput",
      },
    },
    findManySpeakerOnLists: {
      __type: "[SpeakerOnList!]!",
      __args: {
        cursor: "SpeakerOnListWhereUniqueInput",
        distinct: "[SpeakerOnListScalarFieldEnum!]",
        orderBy: "[SpeakerOnListOrderByWithRelationInput!]",
        skip: "Int",
        take: "Int",
        where: "SpeakerOnListWhereInput",
      },
    },
    findManySpeakersLists: {
      __type: "[SpeakersList!]!",
      __args: {
        cursor: "SpeakersListWhereUniqueInput",
        distinct: "[SpeakersListScalarFieldEnum!]",
        orderBy: "[SpeakersListOrderByWithRelationInput!]",
        skip: "Int",
        take: "Int",
        where: "SpeakersListWhereInput",
      },
    },
    findManyUsers: {
      __type: "[User!]!",
      __args: {
        cursor: "UserWhereUniqueInput",
        distinct: "[UserScalarFieldEnum!]",
        orderBy: "[UserOrderByWithRelationInput!]",
        skip: "Int",
        take: "Int",
        where: "UserWhereInput",
      },
    },
    findUniqueAgendaItem: {
      __type: "AgendaItem",
      __args: { where: "AgendaItemWhereUniqueInput!" },
    },
    findUniqueCommitteeMember: {
      __type: "CommitteeMember",
      __args: { where: "CommitteeMemberWhereUniqueInput!" },
    },
    findUniqueConference: {
      __type: "Conference",
      __args: { where: "ConferenceWhereUniqueInput!" },
    },
    findUniqueConferenceMember: {
      __type: "ConferenceMember",
      __args: { where: "ConferenceMemberWhereUniqueInput!" },
    },
    findUniqueDelegation: {
      __type: "Delegation",
      __args: { where: "DelegationWhereUniqueInput!" },
    },
    findUniqueMessage: {
      __type: "Message",
      __args: { where: "MessageWhereUniqueInput!" },
    },
    findUniqueNation: {
      __type: "Nation",
      __args: { where: "NationWhereUniqueInput!" },
    },
    findUniqueSpeakerOnList: {
      __type: "SpeakerOnList",
      __args: { where: "SpeakerOnListWhereUniqueInput!" },
    },
    findUniqueSpeakersList: {
      __type: "SpeakersList",
      __args: { where: "SpeakersListWhereUniqueInput!" },
    },
    findUniqueUser: {
      __type: "User",
      __args: { where: "UserWhereUniqueInput!" },
    },
    serverTime: { __type: "DateTime!" },
  },
  subscription: {},
} as const;

/**
 * An agenda item in a committee. This is a topic of discussion in a committee.
 */
export interface AgendaItem {
  __typename?: "AgendaItem";
  committee: Committee;
  description?: Maybe<ScalarsEnums["String"]>;
  id: ScalarsEnums["ID"];
  isActive: ScalarsEnums["Boolean"];
  speakerLists: Array<SpeakersList>;
  title: ScalarsEnums["String"];
}

/**
 * Batch payloads from prisma.
 */
export interface BatchPayload {
  __typename?: "BatchPayload";
  /**
   * Prisma Batch Payload
   */
  count: ScalarsEnums["Int"];
}

/**
 * A committee in a conference
 */
export interface Committee {
  __typename?: "Committee";
  abbreviation: ScalarsEnums["String"];
  agendaItems: Array<AgendaItem>;
  allowDelegationsToAddThemselvesToSpeakersList: ScalarsEnums["Boolean"];
  category: ScalarsEnums["CommitteeCategory"];
  conference: Conference;
  id: ScalarsEnums["ID"];
  members: Array<CommitteeMember>;
  messages: Array<Message>;
  name: ScalarsEnums["String"];
  parent: Committee;
  stateOfDebate?: Maybe<ScalarsEnums["String"]>;
  status: ScalarsEnums["CommitteeStatus"];
  statusHeadline?: Maybe<ScalarsEnums["String"]>;
  statusUntil?: Maybe<ScalarsEnums["DateTime"]>;
  subCommittees: Array<Committee>;
  whiteboardContent: ScalarsEnums["String"];
}

/**
 * A users membership in a committee, providing them with a role in the committee
 */
export interface CommitteeMember {
  __typename?: "CommitteeMember";
  committee: Committee;
  delegation: Delegation;
  id: ScalarsEnums["ID"];
  presence: ScalarsEnums["Presence"];
  speakerLists: Array<SpeakerOnList>;
  user: User;
}

/**
 * A conference in the system
 */
export interface Conference {
  __typename?: "Conference";
  committees: Array<Committee>;
  delegations: Array<Delegation>;
  end?: Maybe<ScalarsEnums["DateTime"]>;
  feedbackWebsite?: Maybe<ScalarsEnums["String"]>;
  id: ScalarsEnums["ID"];
  members: Array<ConferenceMember>;
  name: ScalarsEnums["String"];
  pressWebsite?: Maybe<ScalarsEnums["String"]>;
  start?: Maybe<ScalarsEnums["DateTime"]>;
}

/**
 * A users membership in a conference, providing them with a role in the conference
 */
export interface ConferenceMember {
  __typename?: "ConferenceMember";
  conference: Conference;
  id: ScalarsEnums["ID"];
  role: ScalarsEnums["ConferenceRole"];
  user: User;
}

export interface Delegation {
  __typename?: "Delegation";
  conference: Conference;
  id: ScalarsEnums["ID"];
  members: Array<CommitteeMember>;
  nation: Nation;
}

export interface Message {
  __typename?: "Message";
  author: User;
  category: ScalarsEnums["MessageCategory"];
  committee: Committee;
  /**
   * If the message was forwarded to the Research Service
   */
  forwarded: ScalarsEnums["Boolean"];
  id: ScalarsEnums["ID"];
  message: ScalarsEnums["String"];
  metaAgendaItem?: Maybe<ScalarsEnums["String"]>;
  metaCommittee?: Maybe<ScalarsEnums["String"]>;
  metaDelegation?: Maybe<ScalarsEnums["String"]>;
  /**
   * Saved Metadata without relation
   */
  metaEmail?: Maybe<ScalarsEnums["String"]>;
  status: Array<ScalarsEnums["MessageStatus"]>;
  subject: ScalarsEnums["String"];
  timestamp: ScalarsEnums["DateTime"];
}

/**
 * A nation in the system. E.g. Germany
 */
export interface Nation {
  __typename?: "Nation";
  alpha3Code: ScalarsEnums["String"];
  delegations: Array<Delegation>;
  id: ScalarsEnums["ID"];
  variant: ScalarsEnums["NationVariant"];
}

/**
 * A speaker on a speakers list, storing their position in the list
 */
export interface SpeakerOnList {
  __typename?: "SpeakerOnList";
  committeeMember: CommitteeMember;
  id: ScalarsEnums["ID"];
  position: ScalarsEnums["Int"];
  speakersList: SpeakersList;
}

/**
 * A speakers list in a committee
 */
export interface SpeakersList {
  __typename?: "SpeakersList";
  agendaItem: AgendaItem;
  id: ScalarsEnums["ID"];
  isClosed: ScalarsEnums["Boolean"];
  speakers: Array<SpeakerOnList>;
  /**
   * The time in seconds that a speaker has to speak
   */
  speakingTime: ScalarsEnums["Int"];
  startTimestamp?: Maybe<ScalarsEnums["DateTime"]>;
  timeLeft?: Maybe<ScalarsEnums["Int"]>;
  type: ScalarsEnums["SpeakersListCategory"];
}

/**
 * A user in the system
 */
export interface User {
  __typename?: "User";
  committeeMemberships: Array<CommitteeMember>;
  conferenceMemberships: Array<ConferenceMember>;
  id: ScalarsEnums["ID"];
  messages: Array<Message>;
}

export interface Mutation {
  __typename?: "Mutation";
  createOneAgendaItem: (args: { data: AgendaItemCreateInput }) => AgendaItem;
  createOneCommitteeMember: (args: {
    data: CommitteeMemberCreateInput;
  }) => CommitteeMember;
  createOneConference: (args: {
    data: ConferenceCreateInput;
    token: ScalarsEnums["String"];
  }) => Conference;
  createOneConferenceMember: (args: {
    data: ConferenceMemberCreateInput;
  }) => ConferenceMember;
  createOneDelegation: (args: { data: DelegationCreateInput }) => Delegation;
  createOneMessage: (args: { data: MessageCreateInput }) => Message;
  createOneNation: (args: { data: NationCreateInput }) => Nation;
  createOneSpeakerOnList: (args: {
    data: SpeakerOnListCreateInput;
  }) => SpeakerOnList;
  createOneSpeakersList: (args: {
    data: SpeakersListCreateInput;
  }) => SpeakersList;
  createOneUser: (args: { data: UserCreateInput }) => User;
  /**
   * Query the user after you have logged in. Ensures the user entity is created in the database.
   */
  createOrFindUserAfterLogin: User;
  deleteOneAgendaItem: (args: {
    where: AgendaItemWhereUniqueInput;
  }) => Maybe<AgendaItem>;
  deleteOneCommitteeMember: (args: {
    where: CommitteeMemberWhereUniqueInput;
  }) => Maybe<CommitteeMember>;
  deleteOneConference: (args: {
    where: ConferenceWhereUniqueInput;
  }) => Maybe<Conference>;
  deleteOneConferenceMember: (args: {
    where: ConferenceMemberWhereUniqueInput;
  }) => Maybe<ConferenceMember>;
  deleteOneDelegation: (args: {
    where: DelegationWhereUniqueInput;
  }) => Maybe<Delegation>;
  deleteOneMessage: (args: {
    where: MessageWhereUniqueInput;
  }) => Maybe<Message>;
  deleteOneNation: (args: { where: NationWhereUniqueInput }) => Maybe<Nation>;
  deleteOneSpeakerOnList: (args: {
    where: SpeakerOnListWhereUniqueInput;
  }) => Maybe<SpeakerOnList>;
  deleteOneSpeakersList: (args: {
    where: SpeakersListWhereUniqueInput;
  }) => Maybe<SpeakersList>;
  deleteOneUser: (args: { where: UserWhereUniqueInput }) => Maybe<User>;
  updateOneAgendaItem: (args: {
    data: AgendaItemUpdateInput;
    where: AgendaItemWhereUniqueInput;
  }) => Maybe<AgendaItem>;
  updateOneCommitteeMember: (args: {
    data: CommitteeMemberUpdateInput;
    where: CommitteeMemberWhereUniqueInput;
  }) => Maybe<CommitteeMember>;
  updateOneConference: (args: {
    data: ConferenceUpdateInput;
    where: ConferenceWhereUniqueInput;
  }) => Maybe<Conference>;
  updateOneConferenceMember: (args: {
    data: ConferenceMemberUpdateInput;
    where: ConferenceMemberWhereUniqueInput;
  }) => Maybe<ConferenceMember>;
  updateOneDelegation: (args: {
    data: DelegationUpdateInput;
    where: DelegationWhereUniqueInput;
  }) => Maybe<Delegation>;
  updateOneMessage: (args: {
    data: MessageUpdateInput;
    where: MessageWhereUniqueInput;
  }) => Maybe<Message>;
  updateOneNation: (args: {
    data: NationUpdateInput;
    where: NationWhereUniqueInput;
  }) => Maybe<Nation>;
  updateOneSpeakerOnList: (args: {
    data: SpeakerOnListUpdateInput;
    where: SpeakerOnListWhereUniqueInput;
  }) => Maybe<SpeakerOnList>;
  updateOneSpeakersList: (args: {
    data: SpeakersListUpdateInput;
    where: SpeakersListWhereUniqueInput;
  }) => Maybe<SpeakersList>;
  updateOneUser: (args: {
    data: UserUpdateInput;
    where: UserWhereUniqueInput;
  }) => Maybe<User>;
}

export interface Query {
  __typename?: "Query";
  findFirstAgendaItem: (args?: {
    cursor?: Maybe<AgendaItemWhereUniqueInput>;
    distinct?: Maybe<Array<AgendaItemScalarFieldEnum>>;
    orderBy?: Maybe<Array<AgendaItemOrderByWithRelationInput>>;
    skip?: Maybe<ScalarsEnums["Int"]>;
    take?: Maybe<ScalarsEnums["Int"]>;
    where?: Maybe<AgendaItemWhereInput>;
  }) => Maybe<AgendaItem>;
  findFirstCommitteeMember: (args?: {
    cursor?: Maybe<CommitteeMemberWhereUniqueInput>;
    distinct?: Maybe<Array<CommitteeMemberScalarFieldEnum>>;
    orderBy?: Maybe<Array<CommitteeMemberOrderByWithRelationInput>>;
    skip?: Maybe<ScalarsEnums["Int"]>;
    take?: Maybe<ScalarsEnums["Int"]>;
    where?: Maybe<CommitteeMemberWhereInput>;
  }) => Maybe<CommitteeMember>;
  findFirstConference: (args?: {
    cursor?: Maybe<ConferenceWhereUniqueInput>;
    distinct?: Maybe<Array<ConferenceScalarFieldEnum>>;
    orderBy?: Maybe<Array<ConferenceOrderByWithRelationInput>>;
    skip?: Maybe<ScalarsEnums["Int"]>;
    take?: Maybe<ScalarsEnums["Int"]>;
    where?: Maybe<ConferenceWhereInput>;
  }) => Maybe<Conference>;
  findFirstConferenceMember: (args?: {
    cursor?: Maybe<ConferenceMemberWhereUniqueInput>;
    distinct?: Maybe<Array<ConferenceMemberScalarFieldEnum>>;
    orderBy?: Maybe<Array<ConferenceMemberOrderByWithRelationInput>>;
    skip?: Maybe<ScalarsEnums["Int"]>;
    take?: Maybe<ScalarsEnums["Int"]>;
    where?: Maybe<ConferenceMemberWhereInput>;
  }) => Maybe<ConferenceMember>;
  findFirstDelegation: (args?: {
    cursor?: Maybe<DelegationWhereUniqueInput>;
    distinct?: Maybe<Array<DelegationScalarFieldEnum>>;
    orderBy?: Maybe<Array<DelegationOrderByWithRelationInput>>;
    skip?: Maybe<ScalarsEnums["Int"]>;
    take?: Maybe<ScalarsEnums["Int"]>;
    where?: Maybe<DelegationWhereInput>;
  }) => Maybe<Delegation>;
  findFirstMessage: (args?: {
    cursor?: Maybe<MessageWhereUniqueInput>;
    distinct?: Maybe<Array<MessageScalarFieldEnum>>;
    orderBy?: Maybe<Array<MessageOrderByWithRelationInput>>;
    skip?: Maybe<ScalarsEnums["Int"]>;
    take?: Maybe<ScalarsEnums["Int"]>;
    where?: Maybe<MessageWhereInput>;
  }) => Maybe<Message>;
  findFirstNation: (args?: {
    cursor?: Maybe<NationWhereUniqueInput>;
    distinct?: Maybe<Array<NationScalarFieldEnum>>;
    orderBy?: Maybe<Array<NationOrderByWithRelationInput>>;
    skip?: Maybe<ScalarsEnums["Int"]>;
    take?: Maybe<ScalarsEnums["Int"]>;
    where?: Maybe<NationWhereInput>;
  }) => Maybe<Nation>;
  findFirstSpeakerOnList: (args?: {
    cursor?: Maybe<SpeakerOnListWhereUniqueInput>;
    distinct?: Maybe<Array<SpeakerOnListScalarFieldEnum>>;
    orderBy?: Maybe<Array<SpeakerOnListOrderByWithRelationInput>>;
    skip?: Maybe<ScalarsEnums["Int"]>;
    take?: Maybe<ScalarsEnums["Int"]>;
    where?: Maybe<SpeakerOnListWhereInput>;
  }) => Maybe<SpeakerOnList>;
  findFirstSpeakersList: (args?: {
    cursor?: Maybe<SpeakersListWhereUniqueInput>;
    distinct?: Maybe<Array<SpeakersListScalarFieldEnum>>;
    orderBy?: Maybe<Array<SpeakersListOrderByWithRelationInput>>;
    skip?: Maybe<ScalarsEnums["Int"]>;
    take?: Maybe<ScalarsEnums["Int"]>;
    where?: Maybe<SpeakersListWhereInput>;
  }) => Maybe<SpeakersList>;
  findFirstUser: (args?: {
    cursor?: Maybe<UserWhereUniqueInput>;
    distinct?: Maybe<Array<UserScalarFieldEnum>>;
    orderBy?: Maybe<Array<UserOrderByWithRelationInput>>;
    skip?: Maybe<ScalarsEnums["Int"]>;
    take?: Maybe<ScalarsEnums["Int"]>;
    where?: Maybe<UserWhereInput>;
  }) => Maybe<User>;
  findManyAgendaItems: (args?: {
    cursor?: Maybe<AgendaItemWhereUniqueInput>;
    distinct?: Maybe<Array<AgendaItemScalarFieldEnum>>;
    orderBy?: Maybe<Array<AgendaItemOrderByWithRelationInput>>;
    skip?: Maybe<ScalarsEnums["Int"]>;
    take?: Maybe<ScalarsEnums["Int"]>;
    where?: Maybe<AgendaItemWhereInput>;
  }) => Array<AgendaItem>;
  findManyCommitteeMembers: (args?: {
    cursor?: Maybe<CommitteeMemberWhereUniqueInput>;
    distinct?: Maybe<Array<CommitteeMemberScalarFieldEnum>>;
    orderBy?: Maybe<Array<CommitteeMemberOrderByWithRelationInput>>;
    skip?: Maybe<ScalarsEnums["Int"]>;
    take?: Maybe<ScalarsEnums["Int"]>;
    where?: Maybe<CommitteeMemberWhereInput>;
  }) => Array<CommitteeMember>;
  findManyConferenceMembers: (args?: {
    cursor?: Maybe<ConferenceMemberWhereUniqueInput>;
    distinct?: Maybe<Array<ConferenceMemberScalarFieldEnum>>;
    orderBy?: Maybe<Array<ConferenceMemberOrderByWithRelationInput>>;
    skip?: Maybe<ScalarsEnums["Int"]>;
    take?: Maybe<ScalarsEnums["Int"]>;
    where?: Maybe<ConferenceMemberWhereInput>;
  }) => Array<ConferenceMember>;
  findManyConferences: (args?: {
    cursor?: Maybe<ConferenceWhereUniqueInput>;
    distinct?: Maybe<Array<ConferenceScalarFieldEnum>>;
    orderBy?: Maybe<Array<ConferenceOrderByWithRelationInput>>;
    skip?: Maybe<ScalarsEnums["Int"]>;
    take?: Maybe<ScalarsEnums["Int"]>;
    where?: Maybe<ConferenceWhereInput>;
  }) => Array<Conference>;
  findManyDelegations: (args?: {
    cursor?: Maybe<DelegationWhereUniqueInput>;
    distinct?: Maybe<Array<DelegationScalarFieldEnum>>;
    orderBy?: Maybe<Array<DelegationOrderByWithRelationInput>>;
    skip?: Maybe<ScalarsEnums["Int"]>;
    take?: Maybe<ScalarsEnums["Int"]>;
    where?: Maybe<DelegationWhereInput>;
  }) => Array<Delegation>;
  findManyMessages: (args?: {
    cursor?: Maybe<MessageWhereUniqueInput>;
    distinct?: Maybe<Array<MessageScalarFieldEnum>>;
    orderBy?: Maybe<Array<MessageOrderByWithRelationInput>>;
    skip?: Maybe<ScalarsEnums["Int"]>;
    take?: Maybe<ScalarsEnums["Int"]>;
    where?: Maybe<MessageWhereInput>;
  }) => Array<Message>;
  findManyNations: (args?: {
    cursor?: Maybe<NationWhereUniqueInput>;
    distinct?: Maybe<Array<NationScalarFieldEnum>>;
    orderBy?: Maybe<Array<NationOrderByWithRelationInput>>;
    skip?: Maybe<ScalarsEnums["Int"]>;
    take?: Maybe<ScalarsEnums["Int"]>;
    where?: Maybe<NationWhereInput>;
  }) => Array<Nation>;
  findManySpeakerOnLists: (args?: {
    cursor?: Maybe<SpeakerOnListWhereUniqueInput>;
    distinct?: Maybe<Array<SpeakerOnListScalarFieldEnum>>;
    orderBy?: Maybe<Array<SpeakerOnListOrderByWithRelationInput>>;
    skip?: Maybe<ScalarsEnums["Int"]>;
    take?: Maybe<ScalarsEnums["Int"]>;
    where?: Maybe<SpeakerOnListWhereInput>;
  }) => Array<SpeakerOnList>;
  findManySpeakersLists: (args?: {
    cursor?: Maybe<SpeakersListWhereUniqueInput>;
    distinct?: Maybe<Array<SpeakersListScalarFieldEnum>>;
    orderBy?: Maybe<Array<SpeakersListOrderByWithRelationInput>>;
    skip?: Maybe<ScalarsEnums["Int"]>;
    take?: Maybe<ScalarsEnums["Int"]>;
    where?: Maybe<SpeakersListWhereInput>;
  }) => Array<SpeakersList>;
  findManyUsers: (args?: {
    cursor?: Maybe<UserWhereUniqueInput>;
    distinct?: Maybe<Array<UserScalarFieldEnum>>;
    orderBy?: Maybe<Array<UserOrderByWithRelationInput>>;
    skip?: Maybe<ScalarsEnums["Int"]>;
    take?: Maybe<ScalarsEnums["Int"]>;
    where?: Maybe<UserWhereInput>;
  }) => Array<User>;
  findUniqueAgendaItem: (args: {
    where: AgendaItemWhereUniqueInput;
  }) => Maybe<AgendaItem>;
  findUniqueCommitteeMember: (args: {
    where: CommitteeMemberWhereUniqueInput;
  }) => Maybe<CommitteeMember>;
  findUniqueConference: (args: {
    where: ConferenceWhereUniqueInput;
  }) => Maybe<Conference>;
  findUniqueConferenceMember: (args: {
    where: ConferenceMemberWhereUniqueInput;
  }) => Maybe<ConferenceMember>;
  findUniqueDelegation: (args: {
    where: DelegationWhereUniqueInput;
  }) => Maybe<Delegation>;
  findUniqueMessage: (args: {
    where: MessageWhereUniqueInput;
  }) => Maybe<Message>;
  findUniqueNation: (args: { where: NationWhereUniqueInput }) => Maybe<Nation>;
  findUniqueSpeakerOnList: (args: {
    where: SpeakerOnListWhereUniqueInput;
  }) => Maybe<SpeakerOnList>;
  findUniqueSpeakersList: (args: {
    where: SpeakersListWhereUniqueInput;
  }) => Maybe<SpeakersList>;
  findUniqueUser: (args: { where: UserWhereUniqueInput }) => Maybe<User>;
  /**
   * The current server time
   */
  serverTime: ScalarsEnums["DateTime"];
}

export interface Subscription {
  __typename?: "Subscription";
}

export interface GeneratedSchema {
  query: Query;
  mutation: Mutation;
  subscription: Subscription;
}

export type ScalarsEnums = {
  [Key in keyof Scalars]: Scalars[Key] extends { output: unknown }
    ? Scalars[Key]["output"]
    : never;
} & {
  AgendaItemScalarFieldEnum: AgendaItemScalarFieldEnum;
  CommitteeCategory: CommitteeCategory;
  CommitteeMemberScalarFieldEnum: CommitteeMemberScalarFieldEnum;
  CommitteeScalarFieldEnum: CommitteeScalarFieldEnum;
  CommitteeStatus: CommitteeStatus;
  ConferenceCreationTokenScalarFieldEnum: ConferenceCreationTokenScalarFieldEnum;
  ConferenceMemberScalarFieldEnum: ConferenceMemberScalarFieldEnum;
  ConferenceRole: ConferenceRole;
  ConferenceScalarFieldEnum: ConferenceScalarFieldEnum;
  DelegationScalarFieldEnum: DelegationScalarFieldEnum;
  MessageCategory: MessageCategory;
  MessageScalarFieldEnum: MessageScalarFieldEnum;
  MessageStatus: MessageStatus;
  NationScalarFieldEnum: NationScalarFieldEnum;
  NationVariant: NationVariant;
  NullsOrder: NullsOrder;
  Presence: Presence;
  QueryMode: QueryMode;
  SortOrder: SortOrder;
  SpeakerOnListScalarFieldEnum: SpeakerOnListScalarFieldEnum;
  SpeakersListCategory: SpeakersListCategory;
  SpeakersListScalarFieldEnum: SpeakersListScalarFieldEnum;
  TransactionIsolationLevel: TransactionIsolationLevel;
  UserScalarFieldEnum: UserScalarFieldEnum;
};
