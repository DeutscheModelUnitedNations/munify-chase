// This file is auto-generated. Do not edit manually.
// @generated
/* eslint-disable */
// biome-ignore-all lint: This file is auto-generated
// biome-ignore-all assist: This file is auto-generated
// biome-ignore-all syntax: This file is auto-generated
import { urqlClient } from "../client";
import { Client, fetchExchange } from '@urql/core';
import { cacheExchange } from '@urql/exchange-graphcache';
import { nativeDateExchange } from '@m1212e/rumble/client';
import { schema } from './schema';
import { makeLiveQuery, makeMutation, makeSubscription, makeQuery } from '@m1212e/rumble/client';

export type Agendaitem = {
  committee: (p?: {
    orderBy?: CommitteeOrderInputArgument | null | undefined,
    where?: CommitteeWhereInputArgument | null | undefined
  }) => Committee | null,
  committeeId: ID,
  createdAt: DateTime,
  id: ID,
  isActive: Boolean,
  speakersList: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: SpeakerslistOrderInputArgument | null | undefined,
    where?: SpeakerslistWhereInputArgument | null | undefined
  }) => Speakerslist[],
  title: String,
  updatedAt: DateTime | null    
};
		
export type AgendaitemOrderInputArgument = {
  committee?: CommitteeOrderInputArgument | null | undefined,
  committeeId?: SortingParameter | null | undefined,
  createdAt?: SortingParameter | null | undefined,
  id?: SortingParameter | null | undefined,
  speakersList?: SpeakerslistOrderInputArgument | null | undefined,
  title?: SortingParameter | null | undefined,
  updatedAt?: SortingParameter | null | undefined    
};
		
export type AgendaitemWhereInputArgument = {
  committee?: CommitteeWhereInputArgument | null | undefined,
  committeeId?: ID | null | undefined,
  createdAt?: DateWhereInputArgument | null | undefined,
  id?: ID | null | undefined,
  speakersList?: SpeakerslistWhereInputArgument | null | undefined,
  title?: StringWhereInputArgument | null | undefined,
  updatedAt?: DateWhereInputArgument | null | undefined    
};
		
export type Boolean = boolean;
		
export type Committee = {
  abbreviation: String,
  activeAgendaItem: (p?: {
    orderBy?: AgendaitemOrderInputArgument | null | undefined,
    where?: AgendaitemWhereInputArgument | null | undefined
  }) => Agendaitem | null,
  activeAgendaItemId: ID | null,
  agendaItems: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: AgendaitemOrderInputArgument | null | undefined,
    where?: AgendaitemWhereInputArgument | null | undefined
  }) => Agendaitem[],
  allowDelegationsToAddThemselvesToSpeakersList: Boolean,
  conference: (p?: {
    orderBy?: ConferenceOrderInputArgument | null | undefined,
    where?: ConferenceWhereInputArgument | null | undefined
  }) => Conference | null,
  conferenceId: ID,
  createdAt: DateTime,
  customSimpleMajority: Int | null,
  customTwoThirdsMajority: Int | null,
  displayRegionalGroups: Boolean,
  id: ID,
  members: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: CommitteememberOrderInputArgument | null | undefined,
    where?: CommitteememberWhereInputArgument | null | undefined
  }) => Committeemember[],
  name: String,
  presenceEvents: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: PresenceeventOrderInputArgument | null | undefined,
    where?: PresenceeventWhereInputArgument | null | undefined
  }) => Presenceevent[],
  presentationLayout: String,
  presentationResolutionFontSize: Int,
  presentationRootFontSize: Int,
  showWhiteboard: Boolean,
  simpleMajority: Int,
  stateOfDebate: String | null,
  status: CommitteestatusEnum,
  statusHeadline: String,
  statusUntil: DateTime,
  totalPresent: Int,
  twoThirdsMajority: Int,
  updatedAt: DateTime | null,
  votingSessions: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: VotingsessionOrderInputArgument | null | undefined,
    where?: VotingsessionWhereInputArgument | null | undefined
  }) => Votingsession[],
  whiteboardContent: String | null    
};
		
export type CommitteeOrderInputArgument = {
  abbreviation?: SortingParameter | null | undefined,
  activeAgendaItem?: AgendaitemOrderInputArgument | null | undefined,
  activeAgendaItemId?: SortingParameter | null | undefined,
  agendaItems?: AgendaitemOrderInputArgument | null | undefined,
  allowDelegationsToAddThemselvesToSpeakersList?: SortingParameter | null | undefined,
  conference?: ConferenceOrderInputArgument | null | undefined,
  conferenceId?: SortingParameter | null | undefined,
  createdAt?: SortingParameter | null | undefined,
  customSimpleMajority?: SortingParameter | null | undefined,
  customTwoThirdsMajority?: SortingParameter | null | undefined,
  displayRegionalGroups?: SortingParameter | null | undefined,
  id?: SortingParameter | null | undefined,
  members?: CommitteememberOrderInputArgument | null | undefined,
  name?: SortingParameter | null | undefined,
  presenceEvents?: PresenceeventOrderInputArgument | null | undefined,
  presentationLayout?: SortingParameter | null | undefined,
  presentationResolutionFontSize?: SortingParameter | null | undefined,
  presentationRootFontSize?: SortingParameter | null | undefined,
  showWhiteboard?: SortingParameter | null | undefined,
  stateOfDebate?: SortingParameter | null | undefined,
  status?: SortingParameter | null | undefined,
  statusHeadline?: SortingParameter | null | undefined,
  statusUntil?: SortingParameter | null | undefined,
  updatedAt?: SortingParameter | null | undefined,
  votingSessions?: VotingsessionOrderInputArgument | null | undefined,
  whiteboardContent?: SortingParameter | null | undefined    
};
		
export type CommitteeWhereInputArgument = {
  abbreviation?: StringWhereInputArgument | null | undefined,
  activeAgendaItem?: AgendaitemWhereInputArgument | null | undefined,
  activeAgendaItemId?: ID | null | undefined,
  agendaItems?: AgendaitemWhereInputArgument | null | undefined,
  allowDelegationsToAddThemselvesToSpeakersList?: Boolean | null | undefined,
  conference?: ConferenceWhereInputArgument | null | undefined,
  conferenceId?: ID | null | undefined,
  createdAt?: DateWhereInputArgument | null | undefined,
  customSimpleMajority?: IntWhereInputArgument | null | undefined,
  customTwoThirdsMajority?: IntWhereInputArgument | null | undefined,
  displayRegionalGroups?: Boolean | null | undefined,
  id?: ID | null | undefined,
  members?: CommitteememberWhereInputArgument | null | undefined,
  name?: StringWhereInputArgument | null | undefined,
  presenceEvents?: PresenceeventWhereInputArgument | null | undefined,
  presentationLayout?: StringWhereInputArgument | null | undefined,
  presentationResolutionFontSize?: IntWhereInputArgument | null | undefined,
  presentationRootFontSize?: IntWhereInputArgument | null | undefined,
  showWhiteboard?: Boolean | null | undefined,
  stateOfDebate?: StringWhereInputArgument | null | undefined,
  status?: CommitteestatusEnum | null | undefined,
  statusHeadline?: StringWhereInputArgument | null | undefined,
  statusUntil?: DateWhereInputArgument | null | undefined,
  updatedAt?: DateWhereInputArgument | null | undefined,
  votingSessions?: VotingsessionWhereInputArgument | null | undefined,
  whiteboardContent?: StringWhereInputArgument | null | undefined    
};
		
export type Committeemember = {
  committee: (p?: {
    orderBy?: CommitteeOrderInputArgument | null | undefined,
    where?: CommitteeWhereInputArgument | null | undefined
  }) => Committee,
  committeeId: ID,
  createdAt: DateTime,
  id: ID,
  present: Boolean,
  representation: (p?: {
    orderBy?: RepresentationOrderInputArgument | null | undefined,
    where?: RepresentationWhereInputArgument | null | undefined
  }) => Representation,
  representationId: ID,
  updatedAt: DateTime | null,
  users: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: ConferenceuserOrderInputArgument | null | undefined,
    where?: ConferenceuserWhereInputArgument | null | undefined
  }) => Conferenceuser[],
  votingVotes: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: VotingvoteOrderInputArgument | null | undefined,
    where?: VotingvoteWhereInputArgument | null | undefined
  }) => Votingvote[]    
};
		
export type CommitteememberOrderInputArgument = {
  committee?: CommitteeOrderInputArgument | null | undefined,
  committeeId?: SortingParameter | null | undefined,
  createdAt?: SortingParameter | null | undefined,
  id?: SortingParameter | null | undefined,
  present?: SortingParameter | null | undefined,
  representation?: RepresentationOrderInputArgument | null | undefined,
  representationId?: SortingParameter | null | undefined,
  updatedAt?: SortingParameter | null | undefined,
  users?: ConferenceuserOrderInputArgument | null | undefined,
  votingVotes?: VotingvoteOrderInputArgument | null | undefined    
};
		
export type CommitteememberWhereInputArgument = {
  committee?: CommitteeWhereInputArgument | null | undefined,
  committeeId?: ID | null | undefined,
  createdAt?: DateWhereInputArgument | null | undefined,
  id?: ID | null | undefined,
  present?: Boolean | null | undefined,
  representation?: RepresentationWhereInputArgument | null | undefined,
  representationId?: ID | null | undefined,
  updatedAt?: DateWhereInputArgument | null | undefined,
  users?: ConferenceuserWhereInputArgument | null | undefined,
  votingVotes?: VotingvoteWhereInputArgument | null | undefined    
};
		
export type CommitteestatusEnum = "FORMAL" | "INFORMAL" | "MODERATED_INFORMAL" | "PAUSE" | "SUSPENSION";
		
export type Conference = {
  committees: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: CommitteeOrderInputArgument | null | undefined,
    where?: CommitteeWhereInputArgument | null | undefined
  }) => Committee[],
  createdAt: DateTime,
  endDate: Date | null,
  hasModeratedCaucus: Boolean,
  id: ID,
  location: String | null,
  logoSvg: String | null,
  members: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: ConferencememberOrderInputArgument | null | undefined,
    where?: ConferencememberWhereInputArgument | null | undefined
  }) => Conferencemember[],
  pressWebsite: String | null,
  representations: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: RepresentationOrderInputArgument | null | undefined,
    where?: RepresentationWhereInputArgument | null | undefined
  }) => Representation[],
  startDate: Date | null,
  title: String,
  uniqueConferenceMembers: (p?: {
    where?: ConferencememberWhereInputArgument | null | undefined
  }) => Conferencemember[],
  updatedAt: DateTime | null,
  users: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: ConferenceuserOrderInputArgument | null | undefined,
    where?: ConferenceuserWhereInputArgument | null | undefined
  }) => Conferenceuser[]    
};
		
export type ConferenceOrderInputArgument = {
  committees?: CommitteeOrderInputArgument | null | undefined,
  createdAt?: SortingParameter | null | undefined,
  endDate?: SortingParameter | null | undefined,
  hasModeratedCaucus?: SortingParameter | null | undefined,
  id?: SortingParameter | null | undefined,
  location?: SortingParameter | null | undefined,
  logoSvg?: SortingParameter | null | undefined,
  members?: ConferencememberOrderInputArgument | null | undefined,
  pressWebsite?: SortingParameter | null | undefined,
  representations?: RepresentationOrderInputArgument | null | undefined,
  startDate?: SortingParameter | null | undefined,
  title?: SortingParameter | null | undefined,
  updatedAt?: SortingParameter | null | undefined,
  users?: ConferenceuserOrderInputArgument | null | undefined    
};
		
export type ConferenceWhereInputArgument = {
  committees?: CommitteeWhereInputArgument | null | undefined,
  createdAt?: DateWhereInputArgument | null | undefined,
  endDate?: DateWhereInputArgument | null | undefined,
  hasModeratedCaucus?: Boolean | null | undefined,
  id?: ID | null | undefined,
  location?: StringWhereInputArgument | null | undefined,
  logoSvg?: StringWhereInputArgument | null | undefined,
  members?: ConferencememberWhereInputArgument | null | undefined,
  pressWebsite?: StringWhereInputArgument | null | undefined,
  representations?: RepresentationWhereInputArgument | null | undefined,
  startDate?: DateWhereInputArgument | null | undefined,
  title?: StringWhereInputArgument | null | undefined,
  updatedAt?: DateWhereInputArgument | null | undefined,
  users?: ConferenceuserWhereInputArgument | null | undefined    
};
		
export type Conferencemember = {
  conference: (p?: {
    orderBy?: ConferenceOrderInputArgument | null | undefined,
    where?: ConferenceWhereInputArgument | null | undefined
  }) => Conference | null,
  conferenceId: ID,
  createdAt: DateTime,
  id: ID,
  representation: (p?: {
    orderBy?: RepresentationOrderInputArgument | null | undefined,
    where?: RepresentationWhereInputArgument | null | undefined
  }) => Representation,
  representationId: ID,
  speakerOnList: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: SpeakeronlistOrderInputArgument | null | undefined,
    where?: SpeakeronlistWhereInputArgument | null | undefined
  }) => Speakeronlist[],
  updatedAt: DateTime | null,
  users: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: ConferenceuserOrderInputArgument | null | undefined,
    where?: ConferenceuserWhereInputArgument | null | undefined
  }) => Conferenceuser[]    
};
		
export type ConferencememberOrderInputArgument = {
  conference?: ConferenceOrderInputArgument | null | undefined,
  conferenceId?: SortingParameter | null | undefined,
  createdAt?: SortingParameter | null | undefined,
  id?: SortingParameter | null | undefined,
  representation?: RepresentationOrderInputArgument | null | undefined,
  representationId?: SortingParameter | null | undefined,
  speakerOnList?: SpeakeronlistOrderInputArgument | null | undefined,
  updatedAt?: SortingParameter | null | undefined,
  users?: ConferenceuserOrderInputArgument | null | undefined    
};
		
export type ConferencememberWhereInputArgument = {
  conference?: ConferenceWhereInputArgument | null | undefined,
  conferenceId?: ID | null | undefined,
  createdAt?: DateWhereInputArgument | null | undefined,
  id?: ID | null | undefined,
  representation?: RepresentationWhereInputArgument | null | undefined,
  representationId?: ID | null | undefined,
  speakerOnList?: SpeakeronlistWhereInputArgument | null | undefined,
  updatedAt?: DateWhereInputArgument | null | undefined,
  users?: ConferenceuserWhereInputArgument | null | undefined    
};
		
export type Conferenceuser = {
  attendanceCode: String | null,
  committeeMember: (p?: {
    orderBy?: CommitteememberOrderInputArgument | null | undefined,
    where?: CommitteememberWhereInputArgument | null | undefined
  }) => Committeemember | null,
  committeeMemberId: ID | null,
  conference: (p?: {
    orderBy?: ConferenceOrderInputArgument | null | undefined,
    where?: ConferenceWhereInputArgument | null | undefined
  }) => Conference,
  conferenceId: ID,
  conferenceMember: (p?: {
    orderBy?: ConferencememberOrderInputArgument | null | undefined,
    where?: ConferencememberWhereInputArgument | null | undefined
  }) => Conferencemember | null,
  conferenceMemberId: ID | null,
  conferenceUserType: ConferenceusertypeEnum,
  createdAt: DateTime,
  currentCheckedInSince: DateTime | null,
  currentCommitteeId: String | null,
  id: ID,
  isCheckedIn: Boolean,
  name: String | null,
  presenceEvents: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: PresenceeventOrderInputArgument | null | undefined,
    where?: PresenceeventWhereInputArgument | null | undefined
  }) => Presenceevent[],
  triggeredPresenceEvents: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: PresenceeventOrderInputArgument | null | undefined,
    where?: PresenceeventWhereInputArgument | null | undefined
  }) => Presenceevent[],
  updatedAt: DateTime | null,
  user: () => User | null,
  userEmail: String    
};
		
export type ConferenceuserOrderInputArgument = {
  attendanceCode?: SortingParameter | null | undefined,
  committeeMember?: CommitteememberOrderInputArgument | null | undefined,
  committeeMemberId?: SortingParameter | null | undefined,
  conference?: ConferenceOrderInputArgument | null | undefined,
  conferenceId?: SortingParameter | null | undefined,
  conferenceMember?: ConferencememberOrderInputArgument | null | undefined,
  conferenceMemberId?: SortingParameter | null | undefined,
  conferenceUserType?: SortingParameter | null | undefined,
  createdAt?: SortingParameter | null | undefined,
  id?: SortingParameter | null | undefined,
  name?: SortingParameter | null | undefined,
  presenceEvents?: PresenceeventOrderInputArgument | null | undefined,
  triggeredPresenceEvents?: PresenceeventOrderInputArgument | null | undefined,
  updatedAt?: SortingParameter | null | undefined,
  user?: UserOrderInputArgument | null | undefined,
  userEmail?: SortingParameter | null | undefined    
};
		
export type ConferenceuserWhereInputArgument = {
  attendanceCode?: StringWhereInputArgument | null | undefined,
  committeeMember?: CommitteememberWhereInputArgument | null | undefined,
  committeeMemberId?: ID | null | undefined,
  conference?: ConferenceWhereInputArgument | null | undefined,
  conferenceId?: ID | null | undefined,
  conferenceMember?: ConferencememberWhereInputArgument | null | undefined,
  conferenceMemberId?: ID | null | undefined,
  conferenceUserType?: ConferenceusertypeEnum | null | undefined,
  createdAt?: DateWhereInputArgument | null | undefined,
  id?: ID | null | undefined,
  name?: StringWhereInputArgument | null | undefined,
  presenceEvents?: PresenceeventWhereInputArgument | null | undefined,
  triggeredPresenceEvents?: PresenceeventWhereInputArgument | null | undefined,
  updatedAt?: DateWhereInputArgument | null | undefined,
  user?: UserWhereInputArgument | null | undefined,
  userEmail?: StringWhereInputArgument | null | undefined    
};
		
export type ConferenceusertypeEnum = "ADMIN" | "DELEGATE" | "NON_STATE_ACTOR" | "SPECTATOR" | "TEAM";
		
export type DateTime = Date;
		
export type DateWhereInputArgument = {
  AND?: DateWhereInputArgument[] | undefined,
  NOT?: DateWhereInputArgument | null | undefined,
  OR?: DateWhereInputArgument[] | undefined,
  arrayContained?: Date[] | undefined,
  arrayContains?: Date[] | undefined,
  arrayOverlaps?: Date[] | undefined,
  eq?: Date | null | undefined,
  gt?: Date | null | undefined,
  gte?: Date | null | undefined,
  ilike?: String | null | undefined,
  in?: Date[] | undefined,
  isNotNull?: Boolean | null | undefined,
  isNull?: Boolean | null | undefined,
  like?: String | null | undefined,
  lt?: Date | null | undefined,
  lte?: Date | null | undefined,
  ne?: Date | null | undefined,
  notIlike?: String | null | undefined,
  notIn?: Date[] | undefined,
  notLike?: String | null | undefined    
};
		
export type Float = number;
		
export type FloatWhereInputArgument = {
  AND?: FloatWhereInputArgument[] | undefined,
  NOT?: FloatWhereInputArgument | null | undefined,
  OR?: FloatWhereInputArgument[] | undefined,
  arrayContained?: Float[] | undefined,
  arrayContains?: Float[] | undefined,
  arrayOverlaps?: Float[] | undefined,
  eq?: Float | null | undefined,
  gt?: Float | null | undefined,
  gte?: Float | null | undefined,
  ilike?: String | null | undefined,
  in?: Float[] | undefined,
  isNotNull?: Boolean | null | undefined,
  isNull?: Boolean | null | undefined,
  like?: String | null | undefined,
  lt?: Float | null | undefined,
  lte?: Float | null | undefined,
  ne?: Float | null | undefined,
  notIlike?: String | null | undefined,
  notIn?: Float[] | undefined,
  notLike?: String | null | undefined    
};
		
export type ID = string;
		
export type ImportData = {
  agendaItems?: ImportDataAgendaItem[] | undefined,
  committeeMembers?: ImportDataCommitteeMember[] | undefined,
  committees?: ImportDataCommittee[] | undefined,
  conferenceMembers?: ImportDataConferenceMember[] | undefined,
  conferenceUsers?: ImportDataConferenceUser[] | undefined,
  endDate?: Date | null | undefined,
  id: ID,
  location?: String | null | undefined,
  representations?: ImportDataRepresentation[] | undefined,
  startDate?: Date | null | undefined,
  title: String    
};
		
export type ImportDataAgendaItem = {
  committeeId: ID,
  id?: ID | null | undefined,
  title: String    
};
		
export type ImportDataCommittee = {
  abbreviation: String,
  id: ID,
  name: String    
};
		
export type ImportDataCommitteeMember = {
  committeeId: ID,
  id: ID,
  representationId: ID    
};
		
export type ImportDataConferenceMember = {
  id: ID,
  representationId: ID    
};
		
export type ImportDataConferenceUser = {
  committeeMemberId?: ID | null | undefined,
  conferenceMemberId?: ID | null | undefined,
  conferenceUserType: ConferenceusertypeEnum,
  id?: ID | null | undefined,
  name?: String | null | undefined,
  userEmail: String    
};
		
export type ImportDataRepresentation = {
  alpha2Code?: String | null | undefined,
  alpha3Code?: String | null | undefined,
  faIcon?: String | null | undefined,
  id: ID,
  name?: String | null | undefined,
  regionalGroup?: RegionalgroupEnum | null | undefined,
  representationType: RepresentationtypeEnum    
};
		
export type Int = number;
		
export type IntWhereInputArgument = {
  AND?: IntWhereInputArgument[] | undefined,
  NOT?: IntWhereInputArgument | null | undefined,
  OR?: IntWhereInputArgument[] | undefined,
  arrayContained?: Int[] | undefined,
  arrayContains?: Int[] | undefined,
  arrayOverlaps?: Int[] | undefined,
  eq?: Int | null | undefined,
  gt?: Int | null | undefined,
  gte?: Int | null | undefined,
  ilike?: String | null | undefined,
  in?: Int[] | undefined,
  isNotNull?: Boolean | null | undefined,
  isNull?: Boolean | null | undefined,
  like?: String | null | undefined,
  lt?: Int | null | undefined,
  lte?: Int | null | undefined,
  ne?: Int | null | undefined,
  notIlike?: String | null | undefined,
  notIn?: Int[] | undefined,
  notLike?: String | null | undefined    
};
		
export type JSON = any;
		
export type Mutation = {
  addSpeakerOnList: (p: {
    committeeMemberId?: ID | null | undefined,
    conferenceMemberId?: ID | null | undefined,
    position?: Int | null | undefined,
    speakersListId: ID
  }) => Speakeronlist,
  clearSpeakersList: (p: {
    id: ID
  }) => Speakerslist,
  completeRollCallSession: (p: {
    id: ID
  }) => Boolean,
  completeVotingSession: (p: {
    id: ID,
    outcome?: unknown | null | undefined
  }) => Boolean,
  createAgendaItem: (p: {
    committeeId: ID,
    title: String
  }) => Agendaitem,
  createCommittee: (p: {
    abbreviation: String,
    conferenceId: ID,
    name: String
  }) => Committee,
  createCommitteeMember: (p: {
    committeeId: ID,
    representationId: ID
  }) => Committeemember,
  createConferenceMember: (p: {
    conferenceId: ID,
    representationId: ID
  }) => Conferencemember,
  createConferenceUser: (p: {
    conferenceId: ID,
    conferenceUserType: unknown,
    name?: String | null | undefined,
    userEmail: String
  }) => Conferenceuser,
  createRepresentation: (p: {
    alpha2Code?: String | null | undefined,
    alpha3Code?: String | null | undefined,
    conferenceId: ID,
    faIcon?: String | null | undefined,
    name?: String | null | undefined,
    type: unknown
  }) => Representation,
  deleteCommittee: (p: {
    id: ID
  }) => Boolean,
  deleteCommitteeMember: (p: {
    id: ID
  }) => Boolean,
  deleteConference: (p: {
    id: ID
  }) => Boolean,
  deleteConferenceMember: (p: {
    id: ID
  }) => Boolean,
  deleteConferenceUser: (p: {
    id: ID
  }) => Boolean,
  deletePresenceEvent: (p: {
    id: ID
  }) => Presenceevent,
  deleteRepresentation: (p: {
    id: ID
  }) => Boolean,
  importDelegatorConference: (p: {
    data: ImportData
  }) => Conference,
  insertPresenceEvent: (p: {
    committeeId: ID,
    conferenceUserId: ID,
    markerType?: unknown | null | undefined,
    note?: String | null | undefined,
    present: Boolean,
    timestamp?: DateTime | null | undefined
  }) => Presenceevent,
  moveSpeakerToPosition: (p: {
    id: ID,
    position: Int
  }) => Speakeronlist,
  recordNsaCheckIn: (p: {
    code: String,
    committeeId: ID
  }) => Presenceevent,
  recordNsaCheckOut: (p: {
    code: String,
    committeeId: ID
  }) => Presenceevent,
  regenerateNsaAttendanceCode: (p: {
    conferenceUserId: ID
  }) => Conferenceuser,
  removeSpeakerOnList: (p: {
    speakerOnListId: ID
  }) => Speakerslist,
  selfAddToSpeakersList: (p: {
    speakersListId: ID
  }) => Speakeronlist,
  selfRemoveFromSpeakersList: (p: {
    speakersListId: ID
  }) => Speakerslist,
  setPresenceForCommitteeMembers: (p: {
    ids: unknown,
    present: Boolean,
    rollCallSessionId?: ID | null | undefined
  }) => Committeemember[],
  setRollCallSessionIndex: (p: {
    currentMemberIndex: Int,
    id: ID
  }) => Rollcallsession,
  setVoteForMember: (p: {
    committeeMemberId: ID,
    sessionId: ID,
    vote: unknown
  }) => Votingvote,
  startRollCallSession: (p: {
    committeeId: ID
  }) => Rollcallsession,
  startVotingSession: (p: {
    committeeId: ID,
    currentStage?: unknown | null | undefined,
    majority: unknown,
    majorityAmount: Int,
    mode: unknown,
    voteName?: String | null | undefined,
    withAbstentions: Boolean
  }) => Votingsession,
  updateCommittee: (p: {
    abbreviation?: String | null | undefined,
    activeAgendaItemId?: ID | null | undefined,
    allowDelegationsToAddThemselvesToSpeakersList?: Boolean | null | undefined,
    displayRegionalGroups?: Boolean | null | undefined,
    id: ID,
    name?: String | null | undefined,
    presentationLayout?: String | null | undefined,
    presentationResolutionFontSize?: Int | null | undefined,
    presentationRootFontSize?: Int | null | undefined,
    showWhiteboard?: Boolean | null | undefined,
    stateOfDebate?: String | null | undefined,
    status?: unknown | null | undefined,
    statusHeadline?: String | null | undefined,
    statusUntil?: DateTime | null | undefined,
    whiteboardContent?: String | null | undefined
  }) => Committee,
  updateConference: (p: {
    endDate?: Date | null | undefined,
    hasModeratedCaucus?: Boolean | null | undefined,
    id: ID,
    location?: String | null | undefined,
    logoSvg?: String | null | undefined,
    pressWebsite?: String | null | undefined,
    startDate?: Date | null | undefined,
    title?: String | null | undefined
  }) => Conference,
  updateConferenceUser: (p: {
    committeeMemberId?: ID | null | undefined,
    conferenceMemberId?: ID | null | undefined,
    conferenceUserType: unknown,
    id: ID,
    name?: String | null | undefined
  }) => Conferenceuser,
  updatePresenceEvent: (p: {
    committeeId?: ID | null | undefined,
    id: ID,
    note?: String | null | undefined,
    present?: Boolean | null | undefined,
    timestamp?: DateTime | null | undefined
  }) => Presenceevent,
  updateSpeakerOnList: (p: {
    id: ID,
    overwriteName?: String | null | undefined
  }) => Speakeronlist,
  updateSpeakersList: (p: {
    id: ID,
    isClosed?: Boolean | null | undefined,
    phase?: unknown | null | undefined,
    speakingTime?: Int | null | undefined,
    startTimestamp?: DateTime | null | undefined,
    stopTimer?: Boolean | null | undefined,
    timeLeft?: Int | null | undefined
  }) => Speakerslist,
  updateVotingSession: (p: {
    currentMemberIndex?: Int | null | undefined,
    currentStage?: unknown | null | undefined,
    id: ID,
    votesAbstain?: Int | null | undefined,
    votesCon?: Int | null | undefined,
    votesPro?: Int | null | undefined
  }) => Votingsession    
};
		
export type Presenceevent = {
  committee: (p?: {
    orderBy?: CommitteeOrderInputArgument | null | undefined,
    where?: CommitteeWhereInputArgument | null | undefined
  }) => Committee,
  committeeId: ID,
  conferenceUser: (p?: {
    orderBy?: ConferenceuserOrderInputArgument | null | undefined,
    where?: ConferenceuserWhereInputArgument | null | undefined
  }) => Conferenceuser,
  conferenceUserId: ID,
  id: ID,
  note: String | null,
  present: Boolean,
  rollCallSession: (p?: {
    orderBy?: RollcallsessionOrderInputArgument | null | undefined,
    where?: RollcallsessionWhereInputArgument | null | undefined
  }) => Rollcallsession | null,
  rollCallSessionId: ID | null,
  timestamp: DateTime,
  triggeredBy: (p?: {
    orderBy?: ConferenceuserOrderInputArgument | null | undefined,
    where?: ConferenceuserWhereInputArgument | null | undefined
  }) => Conferenceuser | null,
  triggeredByConferenceUserId: ID | null,
  type: PresenceeventmarkerEnum    
};
		
export type PresenceeventOrderInputArgument = {
  committee?: CommitteeOrderInputArgument | null | undefined,
  committeeId?: SortingParameter | null | undefined,
  conferenceUser?: ConferenceuserOrderInputArgument | null | undefined,
  conferenceUserId?: SortingParameter | null | undefined,
  id?: SortingParameter | null | undefined,
  note?: SortingParameter | null | undefined,
  present?: SortingParameter | null | undefined,
  rollCallSession?: RollcallsessionOrderInputArgument | null | undefined,
  rollCallSessionId?: SortingParameter | null | undefined,
  timestamp?: SortingParameter | null | undefined,
  triggeredBy?: ConferenceuserOrderInputArgument | null | undefined,
  triggeredByConferenceUserId?: SortingParameter | null | undefined,
  type?: SortingParameter | null | undefined    
};
		
export type PresenceeventWhereInputArgument = {
  committee?: CommitteeWhereInputArgument | null | undefined,
  committeeId?: ID | null | undefined,
  conferenceUser?: ConferenceuserWhereInputArgument | null | undefined,
  conferenceUserId?: ID | null | undefined,
  id?: ID | null | undefined,
  note?: StringWhereInputArgument | null | undefined,
  present?: Boolean | null | undefined,
  rollCallSession?: RollcallsessionWhereInputArgument | null | undefined,
  rollCallSessionId?: ID | null | undefined,
  timestamp?: DateWhereInputArgument | null | undefined,
  triggeredBy?: ConferenceuserWhereInputArgument | null | undefined,
  triggeredByConferenceUserId?: ID | null | undefined,
  type?: PresenceeventmarkerEnum | null | undefined    
};
		
export type PresenceeventmarkerEnum = "AUTO_SWITCH" | "MANUAL" | "NSA_SCAN" | "ROLL_CALL";
		
export type Query = {
  agendaItem: (p: {
    id: ID
  }) => Agendaitem,
  agendaItems: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: AgendaitemOrderInputArgument | null | undefined,
    where?: AgendaitemWhereInputArgument | null | undefined
  }) => Agendaitem[],
  committee: (p: {
    id: ID
  }) => Committee,
  committeeMember: (p: {
    id: ID
  }) => Committeemember,
  committeeMembers: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: CommitteememberOrderInputArgument | null | undefined,
    where?: CommitteememberWhereInputArgument | null | undefined
  }) => Committeemember[],
  committees: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: CommitteeOrderInputArgument | null | undefined,
    where?: CommitteeWhereInputArgument | null | undefined
  }) => Committee[],
  conference: (p: {
    id: ID
  }) => Conference,
  conferenceMember: (p: {
    id: ID
  }) => Conferencemember,
  conferenceMembers: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: ConferencememberOrderInputArgument | null | undefined,
    where?: ConferencememberWhereInputArgument | null | undefined
  }) => Conferencemember[],
  conferenceUser: (p: {
    id: ID
  }) => Conferenceuser,
  conferenceUsers: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: ConferenceuserOrderInputArgument | null | undefined,
    where?: ConferenceuserWhereInputArgument | null | undefined
  }) => Conferenceuser[],
  conferences: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: ConferenceOrderInputArgument | null | undefined,
    where?: ConferenceWhereInputArgument | null | undefined
  }) => Conference[],
  currentUserClaims: () => UserClaims,
  isGlobalAdmin: Boolean,
  presenceEvent: (p: {
    id: ID
  }) => Presenceevent,
  presenceEvents: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: PresenceeventOrderInputArgument | null | undefined,
    where?: PresenceeventWhereInputArgument | null | undefined
  }) => Presenceevent[],
  representation: (p: {
    id: ID
  }) => Representation,
  representations: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: RepresentationOrderInputArgument | null | undefined,
    where?: RepresentationWhereInputArgument | null | undefined
  }) => Representation[],
  rollCallSession: (p: {
    id: ID
  }) => Rollcallsession,
  rollCallSessions: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: RollcallsessionOrderInputArgument | null | undefined,
    where?: RollcallsessionWhereInputArgument | null | undefined
  }) => Rollcallsession[],
  serverTime: DateTime,
  speakerOnList: (p: {
    id: ID
  }) => Speakeronlist,
  speakerOnLists: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: SpeakeronlistOrderInputArgument | null | undefined,
    where?: SpeakeronlistWhereInputArgument | null | undefined
  }) => Speakeronlist[],
  speakersList: (p: {
    id: ID
  }) => Speakerslist,
  speakersLists: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: SpeakerslistOrderInputArgument | null | undefined,
    where?: SpeakerslistWhereInputArgument | null | undefined
  }) => Speakerslist[],
  user: (p: {
    id: ID
  }) => User,
  users: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: UserOrderInputArgument | null | undefined,
    where?: UserWhereInputArgument | null | undefined
  }) => User[],
  votingSession: (p: {
    id: ID
  }) => Votingsession,
  votingSessions: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: VotingsessionOrderInputArgument | null | undefined,
    where?: VotingsessionWhereInputArgument | null | undefined
  }) => Votingsession[],
  votingVote: (p: {
    id: ID
  }) => Votingvote,
  votingVotes: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: VotingvoteOrderInputArgument | null | undefined,
    where?: VotingvoteWhereInputArgument | null | undefined
  }) => Votingvote[]    
};
		
export type RegionalgroupEnum = "AFRICA" | "ASIA_PACIFIC" | "EASTERN_EUROPE" | "LATIN_AMERICA_CARIBBEAN" | "WESTERN_EUROPE_OTHERS";
		
export type Representation = {
  alpha2Code: String | null,
  alpha3Code: String | null,
  committeeMembers: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: CommitteememberOrderInputArgument | null | undefined,
    where?: CommitteememberWhereInputArgument | null | undefined
  }) => Committeemember[],
  conference: (p?: {
    orderBy?: ConferenceOrderInputArgument | null | undefined,
    where?: ConferenceWhereInputArgument | null | undefined
  }) => Conference | null,
  conferenceId: ID,
  conferenceMembers: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: ConferencememberOrderInputArgument | null | undefined,
    where?: ConferencememberWhereInputArgument | null | undefined
  }) => Conferencemember[],
  createdAt: DateTime,
  faIcon: String | null,
  id: ID,
  name: String | null,
  regionalGroup: RegionalgroupEnum | null,
  type: RepresentationtypeEnum,
  updatedAt: DateTime | null    
};
		
export type RepresentationOrderInputArgument = {
  alpha2Code?: SortingParameter | null | undefined,
  alpha3Code?: SortingParameter | null | undefined,
  committeeMembers?: CommitteememberOrderInputArgument | null | undefined,
  conference?: ConferenceOrderInputArgument | null | undefined,
  conferenceId?: SortingParameter | null | undefined,
  conferenceMembers?: ConferencememberOrderInputArgument | null | undefined,
  createdAt?: SortingParameter | null | undefined,
  faIcon?: SortingParameter | null | undefined,
  id?: SortingParameter | null | undefined,
  name?: SortingParameter | null | undefined,
  regionalGroup?: SortingParameter | null | undefined,
  type?: SortingParameter | null | undefined,
  updatedAt?: SortingParameter | null | undefined    
};
		
export type RepresentationWhereInputArgument = {
  alpha2Code?: StringWhereInputArgument | null | undefined,
  alpha3Code?: StringWhereInputArgument | null | undefined,
  committeeMembers?: CommitteememberWhereInputArgument | null | undefined,
  conference?: ConferenceWhereInputArgument | null | undefined,
  conferenceId?: ID | null | undefined,
  conferenceMembers?: ConferencememberWhereInputArgument | null | undefined,
  createdAt?: DateWhereInputArgument | null | undefined,
  faIcon?: StringWhereInputArgument | null | undefined,
  id?: ID | null | undefined,
  name?: StringWhereInputArgument | null | undefined,
  regionalGroup?: RegionalgroupEnum | null | undefined,
  type?: RepresentationtypeEnum | null | undefined,
  updatedAt?: DateWhereInputArgument | null | undefined    
};
		
export type RepresentationtypeEnum = "DELEGATION" | "NSA" | "UN";
		
export type Rollcallsession = {
  committee: (p?: {
    orderBy?: CommitteeOrderInputArgument | null | undefined,
    where?: CommitteeWhereInputArgument | null | undefined
  }) => Committee,
  committeeId: ID,
  completedAt: DateTime | null,
  createdAt: DateTime,
  currentMemberIndex: Int,
  id: ID,
  presenceEvents: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: PresenceeventOrderInputArgument | null | undefined,
    where?: PresenceeventWhereInputArgument | null | undefined
  }) => Presenceevent[],
  startedBy: (p?: {
    orderBy?: ConferenceuserOrderInputArgument | null | undefined,
    where?: ConferenceuserWhereInputArgument | null | undefined
  }) => Conferenceuser | null,
  startedByConferenceUserId: ID | null,
  updatedAt: DateTime | null    
};
		
export type RollcallsessionOrderInputArgument = {
  committee?: CommitteeOrderInputArgument | null | undefined,
  committeeId?: SortingParameter | null | undefined,
  completedAt?: SortingParameter | null | undefined,
  createdAt?: SortingParameter | null | undefined,
  currentMemberIndex?: SortingParameter | null | undefined,
  id?: SortingParameter | null | undefined,
  presenceEvents?: PresenceeventOrderInputArgument | null | undefined,
  startedBy?: ConferenceuserOrderInputArgument | null | undefined,
  startedByConferenceUserId?: SortingParameter | null | undefined,
  updatedAt?: SortingParameter | null | undefined    
};
		
export type RollcallsessionWhereInputArgument = {
  committee?: CommitteeWhereInputArgument | null | undefined,
  committeeId?: ID | null | undefined,
  completedAt?: DateWhereInputArgument | null | undefined,
  createdAt?: DateWhereInputArgument | null | undefined,
  currentMemberIndex?: IntWhereInputArgument | null | undefined,
  id?: ID | null | undefined,
  presenceEvents?: PresenceeventWhereInputArgument | null | undefined,
  startedBy?: ConferenceuserWhereInputArgument | null | undefined,
  startedByConferenceUserId?: ID | null | undefined,
  updatedAt?: DateWhereInputArgument | null | undefined    
};
		
export type SortingParameter = "asc" | "desc";
		
export type Speakeronlist = {
  committeeMember: (p?: {
    orderBy?: CommitteememberOrderInputArgument | null | undefined,
    where?: CommitteememberWhereInputArgument | null | undefined
  }) => Committeemember | null,
  committeeMemberId: ID | null,
  conferenceMember: (p?: {
    orderBy?: ConferencememberOrderInputArgument | null | undefined,
    where?: ConferencememberWhereInputArgument | null | undefined
  }) => Conferencemember | null,
  conferenceMemberId: ID | null,
  createdAt: DateTime,
  id: ID,
  overwriteName: String | null,
  position: Int,
  speakersList: (p?: {
    orderBy?: SpeakerslistOrderInputArgument | null | undefined,
    where?: SpeakerslistWhereInputArgument | null | undefined
  }) => Speakerslist | null,
  speakersListId: ID,
  updatedAt: DateTime | null    
};
		
export type SpeakeronlistOrderInputArgument = {
  committeeMember?: CommitteememberOrderInputArgument | null | undefined,
  committeeMemberId?: SortingParameter | null | undefined,
  conferenceMember?: ConferencememberOrderInputArgument | null | undefined,
  conferenceMemberId?: SortingParameter | null | undefined,
  createdAt?: SortingParameter | null | undefined,
  id?: SortingParameter | null | undefined,
  overwriteName?: SortingParameter | null | undefined,
  position?: SortingParameter | null | undefined,
  speakersList?: SpeakerslistOrderInputArgument | null | undefined,
  speakersListId?: SortingParameter | null | undefined,
  updatedAt?: SortingParameter | null | undefined    
};
		
export type SpeakeronlistWhereInputArgument = {
  committeeMember?: CommitteememberWhereInputArgument | null | undefined,
  committeeMemberId?: ID | null | undefined,
  conferenceMember?: ConferencememberWhereInputArgument | null | undefined,
  conferenceMemberId?: ID | null | undefined,
  createdAt?: DateWhereInputArgument | null | undefined,
  id?: ID | null | undefined,
  overwriteName?: StringWhereInputArgument | null | undefined,
  position?: IntWhereInputArgument | null | undefined,
  speakersList?: SpeakerslistWhereInputArgument | null | undefined,
  speakersListId?: ID | null | undefined,
  updatedAt?: DateWhereInputArgument | null | undefined    
};
		
export type Speakerslist = {
  agendaItem: (p?: {
    orderBy?: AgendaitemOrderInputArgument | null | undefined,
    where?: AgendaitemWhereInputArgument | null | undefined
  }) => Agendaitem | null,
  agendaItemId: ID,
  createdAt: DateTime,
  id: ID,
  isClosed: Boolean,
  phase: SpeakerslistphaseEnum,
  speakers: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: SpeakeronlistOrderInputArgument | null | undefined,
    where?: SpeakeronlistWhereInputArgument | null | undefined
  }) => Speakeronlist[],
  speakingTime: Int,
  startTimestamp: DateTime | null,
  timeLeft: Int,
  type: SpeakerslistcategoryEnum,
  updatedAt: DateTime | null    
};
		
export type SpeakerslistOrderInputArgument = {
  agendaItem?: AgendaitemOrderInputArgument | null | undefined,
  agendaItemId?: SortingParameter | null | undefined,
  createdAt?: SortingParameter | null | undefined,
  id?: SortingParameter | null | undefined,
  isClosed?: SortingParameter | null | undefined,
  phase?: SortingParameter | null | undefined,
  speakers?: SpeakeronlistOrderInputArgument | null | undefined,
  speakingTime?: SortingParameter | null | undefined,
  startTimestamp?: SortingParameter | null | undefined,
  timeLeft?: SortingParameter | null | undefined,
  type?: SortingParameter | null | undefined,
  updatedAt?: SortingParameter | null | undefined    
};
		
export type SpeakerslistWhereInputArgument = {
  agendaItem?: AgendaitemWhereInputArgument | null | undefined,
  agendaItemId?: ID | null | undefined,
  createdAt?: DateWhereInputArgument | null | undefined,
  id?: ID | null | undefined,
  isClosed?: Boolean | null | undefined,
  phase?: SpeakerslistphaseEnum | null | undefined,
  speakers?: SpeakeronlistWhereInputArgument | null | undefined,
  speakingTime?: IntWhereInputArgument | null | undefined,
  startTimestamp?: DateWhereInputArgument | null | undefined,
  timeLeft?: IntWhereInputArgument | null | undefined,
  type?: SpeakerslistcategoryEnum | null | undefined,
  updatedAt?: DateWhereInputArgument | null | undefined    
};
		
export type SpeakerslistcategoryEnum = "COMMENT_LIST" | "SPEAKERS_LIST";
		
export type SpeakerslistphaseEnum = "ANSWER" | "ANSWER_DONE" | "QUESTION" | "SPEECH" | "SPEECH_DONE";
		
export type String = string;
		
export type StringWhereInputArgument = {
  AND?: StringWhereInputArgument[] | undefined,
  NOT?: StringWhereInputArgument | null | undefined,
  OR?: StringWhereInputArgument[] | undefined,
  arrayContained?: String[] | undefined,
  arrayContains?: String[] | undefined,
  arrayOverlaps?: String[] | undefined,
  eq?: String | null | undefined,
  gt?: String | null | undefined,
  gte?: String | null | undefined,
  ilike?: String | null | undefined,
  in?: String[] | undefined,
  isNotNull?: Boolean | null | undefined,
  isNull?: Boolean | null | undefined,
  like?: String | null | undefined,
  lt?: String | null | undefined,
  lte?: String | null | undefined,
  ne?: String | null | undefined,
  notIlike?: String | null | undefined,
  notIn?: String[] | undefined,
  notLike?: String | null | undefined    
};
		
export type Subscription = {
  agendaItem: (p: {
    id: ID
  }) => Agendaitem,
  agendaItems: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: AgendaitemOrderInputArgument | null | undefined,
    where?: AgendaitemWhereInputArgument | null | undefined
  }) => Agendaitem[],
  committee: (p: {
    id: ID
  }) => Committee,
  committeeMember: (p: {
    id: ID
  }) => Committeemember,
  committeeMembers: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: CommitteememberOrderInputArgument | null | undefined,
    where?: CommitteememberWhereInputArgument | null | undefined
  }) => Committeemember[],
  committees: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: CommitteeOrderInputArgument | null | undefined,
    where?: CommitteeWhereInputArgument | null | undefined
  }) => Committee[],
  conference: (p: {
    id: ID
  }) => Conference,
  conferenceMember: (p: {
    id: ID
  }) => Conferencemember,
  conferenceMembers: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: ConferencememberOrderInputArgument | null | undefined,
    where?: ConferencememberWhereInputArgument | null | undefined
  }) => Conferencemember[],
  conferenceUser: (p: {
    id: ID
  }) => Conferenceuser,
  conferenceUsers: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: ConferenceuserOrderInputArgument | null | undefined,
    where?: ConferenceuserWhereInputArgument | null | undefined
  }) => Conferenceuser[],
  conferences: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: ConferenceOrderInputArgument | null | undefined,
    where?: ConferenceWhereInputArgument | null | undefined
  }) => Conference[],
  presenceEvent: (p: {
    id: ID
  }) => Presenceevent,
  presenceEvents: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: PresenceeventOrderInputArgument | null | undefined,
    where?: PresenceeventWhereInputArgument | null | undefined
  }) => Presenceevent[],
  representation: (p: {
    id: ID
  }) => Representation,
  representations: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: RepresentationOrderInputArgument | null | undefined,
    where?: RepresentationWhereInputArgument | null | undefined
  }) => Representation[],
  rollCallSession: (p: {
    id: ID
  }) => Rollcallsession,
  rollCallSessions: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: RollcallsessionOrderInputArgument | null | undefined,
    where?: RollcallsessionWhereInputArgument | null | undefined
  }) => Rollcallsession[],
  speakerOnList: (p: {
    id: ID
  }) => Speakeronlist,
  speakerOnLists: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: SpeakeronlistOrderInputArgument | null | undefined,
    where?: SpeakeronlistWhereInputArgument | null | undefined
  }) => Speakeronlist[],
  speakersList: (p: {
    id: ID
  }) => Speakerslist,
  speakersLists: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: SpeakerslistOrderInputArgument | null | undefined,
    where?: SpeakerslistWhereInputArgument | null | undefined
  }) => Speakerslist[],
  user: (p: {
    id: ID
  }) => User,
  users: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: UserOrderInputArgument | null | undefined,
    where?: UserWhereInputArgument | null | undefined
  }) => User[],
  votingSession: (p: {
    id: ID
  }) => Votingsession,
  votingSessions: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: VotingsessionOrderInputArgument | null | undefined,
    where?: VotingsessionWhereInputArgument | null | undefined
  }) => Votingsession[],
  votingVote: (p: {
    id: ID
  }) => Votingvote,
  votingVotes: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: VotingvoteOrderInputArgument | null | undefined,
    where?: VotingvoteWhereInputArgument | null | undefined
  }) => Votingvote[]    
};
		
export type User = {
  conferenceMemberships: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: ConferenceuserOrderInputArgument | null | undefined,
    where?: ConferenceuserWhereInputArgument | null | undefined
  }) => Conferenceuser[],
  createdAt: DateTime,
  email: String,
  familyName: String,
  givenName: String,
  id: ID,
  locale: String | null,
  preferredUsername: String,
  updatedAt: DateTime | null    
};
		
export type UserClaims = {
  email: String | null,
  familyName: String | null,
  givenName: String | null,
  id: String,
  locale: String | null,
  preferredUsername: String | null    
};
		
export type UserOrderInputArgument = {
  conferenceMemberships?: ConferenceuserOrderInputArgument | null | undefined,
  createdAt?: SortingParameter | null | undefined,
  email?: SortingParameter | null | undefined,
  familyName?: SortingParameter | null | undefined,
  givenName?: SortingParameter | null | undefined,
  id?: SortingParameter | null | undefined,
  locale?: SortingParameter | null | undefined,
  preferredUsername?: SortingParameter | null | undefined,
  updatedAt?: SortingParameter | null | undefined    
};
		
export type UserWhereInputArgument = {
  conferenceMemberships?: ConferenceuserWhereInputArgument | null | undefined,
  createdAt?: DateWhereInputArgument | null | undefined,
  email?: StringWhereInputArgument | null | undefined,
  familyName?: StringWhereInputArgument | null | undefined,
  givenName?: StringWhereInputArgument | null | undefined,
  id?: ID | null | undefined,
  locale?: StringWhereInputArgument | null | undefined,
  preferredUsername?: StringWhereInputArgument | null | undefined,
  updatedAt?: DateWhereInputArgument | null | undefined    
};
		
export type VotechoiceEnum = "ABSTAIN" | "CON" | "PRO";
		
export type VotingmajoritytypeEnum = "ABSOLUTE" | "SIMPLE" | "TWO_THIRDS";
		
export type VotingmodeEnum = "ROLL_CALL" | "SHOW_OF_HANDS";
		
export type VotingoutcomeEnum = "ADOPTED" | "REJECTED";
		
export type Votingsession = {
  committee: (p?: {
    orderBy?: CommitteeOrderInputArgument | null | undefined,
    where?: CommitteeWhereInputArgument | null | undefined
  }) => Committee,
  committeeId: ID,
  completedAt: DateTime | null,
  createdAt: DateTime,
  currentMemberIndex: Int,
  currentStage: VotingstageEnum | null,
  id: ID,
  majority: VotingmajoritytypeEnum,
  majorityAmount: Int,
  mode: VotingmodeEnum,
  outcome: VotingoutcomeEnum | null,
  startedBy: (p?: {
    orderBy?: ConferenceuserOrderInputArgument | null | undefined,
    where?: ConferenceuserWhereInputArgument | null | undefined
  }) => Conferenceuser | null,
  startedByConferenceUserId: ID | null,
  updatedAt: DateTime | null,
  voteName: String | null,
  votes: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: VotingvoteOrderInputArgument | null | undefined,
    where?: VotingvoteWhereInputArgument | null | undefined
  }) => Votingvote[],
  votesAbstain: Int,
  votesCon: Int,
  votesPro: Int,
  withAbstentions: Boolean    
};
		
export type VotingsessionOrderInputArgument = {
  committee?: CommitteeOrderInputArgument | null | undefined,
  committeeId?: SortingParameter | null | undefined,
  completedAt?: SortingParameter | null | undefined,
  createdAt?: SortingParameter | null | undefined,
  currentMemberIndex?: SortingParameter | null | undefined,
  currentStage?: SortingParameter | null | undefined,
  id?: SortingParameter | null | undefined,
  majority?: SortingParameter | null | undefined,
  majorityAmount?: SortingParameter | null | undefined,
  mode?: SortingParameter | null | undefined,
  outcome?: SortingParameter | null | undefined,
  startedBy?: ConferenceuserOrderInputArgument | null | undefined,
  startedByConferenceUserId?: SortingParameter | null | undefined,
  updatedAt?: SortingParameter | null | undefined,
  voteName?: SortingParameter | null | undefined,
  votes?: VotingvoteOrderInputArgument | null | undefined,
  votesAbstain?: SortingParameter | null | undefined,
  votesCon?: SortingParameter | null | undefined,
  votesPro?: SortingParameter | null | undefined,
  withAbstentions?: SortingParameter | null | undefined    
};
		
export type VotingsessionWhereInputArgument = {
  committee?: CommitteeWhereInputArgument | null | undefined,
  committeeId?: ID | null | undefined,
  completedAt?: DateWhereInputArgument | null | undefined,
  createdAt?: DateWhereInputArgument | null | undefined,
  currentMemberIndex?: IntWhereInputArgument | null | undefined,
  currentStage?: VotingstageEnum | null | undefined,
  id?: ID | null | undefined,
  majority?: VotingmajoritytypeEnum | null | undefined,
  majorityAmount?: IntWhereInputArgument | null | undefined,
  mode?: VotingmodeEnum | null | undefined,
  outcome?: VotingoutcomeEnum | null | undefined,
  startedBy?: ConferenceuserWhereInputArgument | null | undefined,
  startedByConferenceUserId?: ID | null | undefined,
  updatedAt?: DateWhereInputArgument | null | undefined,
  voteName?: StringWhereInputArgument | null | undefined,
  votes?: VotingvoteWhereInputArgument | null | undefined,
  votesAbstain?: IntWhereInputArgument | null | undefined,
  votesCon?: IntWhereInputArgument | null | undefined,
  votesPro?: IntWhereInputArgument | null | undefined,
  withAbstentions?: Boolean | null | undefined    
};
		
export type VotingstageEnum = "ABSTAIN" | "CON" | "EVALUATION" | "PRO";
		
export type Votingvote = {
  committeeMember: (p?: {
    orderBy?: CommitteememberOrderInputArgument | null | undefined,
    where?: CommitteememberWhereInputArgument | null | undefined
  }) => Committeemember,
  committeeMemberId: ID,
  createdAt: DateTime,
  id: ID,
  updatedAt: DateTime | null,
  vote: VotechoiceEnum,
  votingSession: (p?: {
    orderBy?: VotingsessionOrderInputArgument | null | undefined,
    where?: VotingsessionWhereInputArgument | null | undefined
  }) => Votingsession,
  votingSessionId: ID    
};
		
export type VotingvoteOrderInputArgument = {
  committeeMember?: CommitteememberOrderInputArgument | null | undefined,
  committeeMemberId?: SortingParameter | null | undefined,
  createdAt?: SortingParameter | null | undefined,
  id?: SortingParameter | null | undefined,
  updatedAt?: SortingParameter | null | undefined,
  vote?: SortingParameter | null | undefined,
  votingSession?: VotingsessionOrderInputArgument | null | undefined,
  votingSessionId?: SortingParameter | null | undefined    
};
		
export type VotingvoteWhereInputArgument = {
  committeeMember?: CommitteememberWhereInputArgument | null | undefined,
  committeeMemberId?: ID | null | undefined,
  createdAt?: DateWhereInputArgument | null | undefined,
  id?: ID | null | undefined,
  updatedAt?: DateWhereInputArgument | null | undefined,
  vote?: VotechoiceEnum | null | undefined,
  votingSession?: VotingsessionWhereInputArgument | null | undefined,
  votingSessionId?: ID | null | undefined    
};
		
export const defaultOptions: ConstructorParameters<Client>[0] = {
  url: "/api/graphql",
  fetchSubscriptions: true,
  exchanges: [cacheExchange({ schema }), nativeDateExchange, fetchExchange],
  fetchOptions: {
    credentials: "include",
  },
  requestPolicy: "cache-and-network",
}

export const client = {
  /**
   * A query and subscription combination. First queries and if exists, also subscribes to a subscription of the same name.
   * Combines the results of both, so the result is first the query result and then live updates from the subscription.
   * Assumes that the query and subscription return the same fields as per default when using the rumble query helpers.
   * If no subscription with the same name exists, this will just be a query.
   *
   * Internally, this does some magic to make the data reactive with Svelte's reactivity system. But it can be used with other frameworks as well.
   */
  liveQuery: makeLiveQuery<Query>({
	  urqlClient,
	  availableSubscriptions: new Set(["agendaItem", "agendaItems", "committee", "committeeMember", "committeeMembers", "committees", "conference", "conferenceMember", "conferenceMembers", "conferenceUser", "conferenceUsers", "conferences", "presenceEvent", "presenceEvents", "representation", "representations", "rollCallSession", "rollCallSessions", "speakerOnList", "speakerOnLists", "speakersList", "speakersLists", "user", "users", "votingSession", "votingSessions", "votingVote", "votingVotes"]),
		schema,
  }),
  /**
   * A mutation that can be used to e.g. create, update or delete data.
   */
  mutate: makeMutation<Mutation>({
	  urqlClient,
		schema,
  }),
  /**
   * A continuous stream of results that updates when the server sends new data.
   */
  subscribe: makeSubscription<Subscription>({
	  urqlClient,
		schema,
  }),
  /**
   * A one-time fetch of data.
   */
  query: makeQuery<Query>({
	  urqlClient,
		schema,
  }),
}