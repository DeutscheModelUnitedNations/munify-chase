import { Client, fetchExchange } from '@urql/core';
import { cacheExchange } from '@urql/exchange-graphcache';
import { makeLiveQuery, makeMutation, makeSubscription, makeQuery } from '@m1212e/rumble';

export type Agendaitem = {
  committee: (p?: {
    orderBy?: CommitteeOrderInputArgument | null | undefined,
    where?: CommitteeWhereInputArgument | null | undefined
  }) => Committee | null,
  committeeId: ID,
  createdAt: DateTime,
  id: ID,
  isActive: Boolean | null,
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
  customPaperSupportThreshold: Int | null,
  customSimpleMajority: Int | null,
  customTwoThirdsMajority: Int | null,
  id: ID,
  lastResolutionAdoptionDate: DateTime | null,
  members: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: CommitteememberOrderInputArgument | null | undefined,
    where?: CommitteememberWhereInputArgument | null | undefined
  }) => Committeemember[],
  name: String,
  paperSupportThreshold: Int | null,
  showWhiteboard: Boolean,
  simpleMajority: Int | null,
  stateOfDebate: String | null,
  status: StatusEnum,
  statusHeadline: String,
  statusUntil: DateTime,
  totalPresent: Int | null,
  twoThirdsMajority: Int | null,
  updatedAt: DateTime | null,
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
  customPaperSupportThreshold?: SortingParameter | null | undefined,
  customSimpleMajority?: SortingParameter | null | undefined,
  customTwoThirdsMajority?: SortingParameter | null | undefined,
  id?: SortingParameter | null | undefined,
  lastResolutionAdoptionDate?: SortingParameter | null | undefined,
  members?: CommitteememberOrderInputArgument | null | undefined,
  name?: SortingParameter | null | undefined,
  showWhiteboard?: SortingParameter | null | undefined,
  stateOfDebate?: SortingParameter | null | undefined,
  status?: SortingParameter | null | undefined,
  statusHeadline?: SortingParameter | null | undefined,
  statusUntil?: SortingParameter | null | undefined,
  updatedAt?: SortingParameter | null | undefined,
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
  customPaperSupportThreshold?: IntWhereInputArgument | null | undefined,
  customSimpleMajority?: IntWhereInputArgument | null | undefined,
  customTwoThirdsMajority?: IntWhereInputArgument | null | undefined,
  id?: ID | null | undefined,
  lastResolutionAdoptionDate?: DateWhereInputArgument | null | undefined,
  members?: CommitteememberWhereInputArgument | null | undefined,
  name?: StringWhereInputArgument | null | undefined,
  showWhiteboard?: Boolean | null | undefined,
  stateOfDebate?: StringWhereInputArgument | null | undefined,
  status?: StatusEnum | null | undefined,
  statusHeadline?: StringWhereInputArgument | null | undefined,
  statusUntil?: DateWhereInputArgument | null | undefined,
  updatedAt?: DateWhereInputArgument | null | undefined,
  whiteboardContent?: StringWhereInputArgument | null | undefined    
};
		
export type Committeemember = {
  committeeId: ID,
  createdAt: DateTime,
  id: ID,
  presenceChangedTimestamps: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: PresencechangedtimestampOrderInputArgument | null | undefined,
    where?: PresencechangedtimestampWhereInputArgument | null | undefined
  }) => Presencechangedtimestamp[],
  present: Boolean,
  representation: (p?: {
    orderBy?: RepresentationOrderInputArgument | null | undefined,
    where?: RepresentationWhereInputArgument | null | undefined
  }) => Representation,
  representationId: ID,
  updatedAt: DateTime | null,
  user: (p?: {
    orderBy?: ConferenceuserOrderInputArgument | null | undefined,
    where?: ConferenceuserWhereInputArgument | null | undefined
  }) => Conferenceuser | null    
};
		
export type CommitteememberOrderInputArgument = {
  committeeId?: SortingParameter | null | undefined,
  createdAt?: SortingParameter | null | undefined,
  id?: SortingParameter | null | undefined,
  presenceChangedTimestamps?: PresencechangedtimestampOrderInputArgument | null | undefined,
  present?: SortingParameter | null | undefined,
  representation?: RepresentationOrderInputArgument | null | undefined,
  representationId?: SortingParameter | null | undefined,
  updatedAt?: SortingParameter | null | undefined,
  user?: ConferenceuserOrderInputArgument | null | undefined    
};
		
export type CommitteememberWhereInputArgument = {
  committeeId?: ID | null | undefined,
  createdAt?: DateWhereInputArgument | null | undefined,
  id?: ID | null | undefined,
  presenceChangedTimestamps?: PresencechangedtimestampWhereInputArgument | null | undefined,
  present?: Boolean | null | undefined,
  representation?: RepresentationWhereInputArgument | null | undefined,
  representationId?: ID | null | undefined,
  updatedAt?: DateWhereInputArgument | null | undefined,
  user?: ConferenceuserWhereInputArgument | null | undefined    
};
		
export type CommitteestatusEnum = "FORMAL" | "INFORMAL" | "PAUSE" | "SUSPENSION";
		
export type Conference = {
  committees: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: CommitteeOrderInputArgument | null | undefined,
    where?: CommitteeWhereInputArgument | null | undefined
  }) => Committee[],
  createdAt: DateTime,
  id: ID,
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
  id?: SortingParameter | null | undefined,
  members?: ConferencememberOrderInputArgument | null | undefined,
  pressWebsite?: SortingParameter | null | undefined,
  representations?: RepresentationOrderInputArgument | null | undefined,
  title?: SortingParameter | null | undefined,
  updatedAt?: SortingParameter | null | undefined,
  users?: ConferenceuserOrderInputArgument | null | undefined    
};
		
export type ConferenceWhereInputArgument = {
  committees?: CommitteeWhereInputArgument | null | undefined,
  createdAt?: DateWhereInputArgument | null | undefined,
  id?: ID | null | undefined,
  members?: ConferencememberWhereInputArgument | null | undefined,
  pressWebsite?: StringWhereInputArgument | null | undefined,
  representations?: RepresentationWhereInputArgument | null | undefined,
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
  user: (p?: {
    orderBy?: ConferenceuserOrderInputArgument | null | undefined,
    where?: ConferenceuserWhereInputArgument | null | undefined
  }) => Conferenceuser | null    
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
  user?: ConferenceuserOrderInputArgument | null | undefined    
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
  user?: ConferenceuserWhereInputArgument | null | undefined    
};
		
export type Conferenceuser = {
  committeeMemberId: ID | null,
  conference: (p?: {
    orderBy?: ConferenceOrderInputArgument | null | undefined,
    where?: ConferenceWhereInputArgument | null | undefined
  }) => Conference,
  conferenceId: ID,
  conferenceMemberId: ID | null,
  conferenceUserType: ConferenceusertypeEnum,
  createdAt: DateTime,
  id: ID,
  updatedAt: DateTime | null,
  user: (p?: {
    orderBy?: UserOrderInputArgument | null | undefined,
    where?: UserWhereInputArgument | null | undefined
  }) => User | null,
  userEmail: String    
};
		
export type ConferenceuserOrderInputArgument = {
  committeeMemberId?: SortingParameter | null | undefined,
  conference?: ConferenceOrderInputArgument | null | undefined,
  conferenceId?: SortingParameter | null | undefined,
  conferenceMemberId?: SortingParameter | null | undefined,
  conferenceUserType?: SortingParameter | null | undefined,
  createdAt?: SortingParameter | null | undefined,
  id?: SortingParameter | null | undefined,
  updatedAt?: SortingParameter | null | undefined,
  user?: UserOrderInputArgument | null | undefined,
  userEmail?: SortingParameter | null | undefined    
};
		
export type ConferenceuserWhereInputArgument = {
  committeeMemberId?: ID | null | undefined,
  conference?: ConferenceWhereInputArgument | null | undefined,
  conferenceId?: ID | null | undefined,
  conferenceMemberId?: ID | null | undefined,
  conferenceUserType?: ConferenceusertypeEnum | null | undefined,
  createdAt?: DateWhereInputArgument | null | undefined,
  id?: ID | null | undefined,
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
  id: ID,
  representations?: ImportDataRepresentation[] | undefined,
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
  }) => Speakeronlist | null,
  clearSpeakersList: (p: {
    id: ID
  }) => Speakerslist | null,
  createAgendaItem: (p: {
    committeeId: ID,
    title: String
  }) => Agendaitem | null,
  importDelegatorConference: (p: {
    data: ImportData
  }) => Conference | null,
  moveSpeakerToPosition: (p: {
    id: ID,
    position: Int
  }) => Speakeronlist | null,
  removeSpeakerOnList: (p: {
    speakerOnListId: ID
  }) => Speakerslist | null,
  setPresenceForCommitteeMembers: (p: {
    ids: unknown,
    present: Boolean
  }) => Committeemember[],
  updateCommittee: (p: {
    activeAgendaItemId?: ID | null | undefined,
    id: ID,
    lastResolutionAdoptionDate?: DateTime | null | undefined,
    showWhiteboard?: Boolean | null | undefined,
    stateOfDebate?: String | null | undefined,
    status?: unknown | null | undefined,
    statusHeadline?: String | null | undefined,
    statusUntil?: DateTime | null | undefined,
    whiteboardContent?: String | null | undefined
  }) => Committee | null,
  updateSpeakerOnList: (p: {
    id: ID,
    overwriteName?: String | null | undefined
  }) => Speakeronlist | null,
  updateSpeakersList: (p: {
    id: ID,
    isClosed?: Boolean | null | undefined,
    speakingTime?: Int | null | undefined,
    startTimestamp?: DateTime | null | undefined,
    stopTimer?: Boolean | null | undefined,
    timeLeft?: Int | null | undefined
  }) => Speakerslist | null    
};
		
export type Presencechangedtimestamp = {
  committeeMember: (p?: {
    orderBy?: CommitteememberOrderInputArgument | null | undefined,
    where?: CommitteememberWhereInputArgument | null | undefined
  }) => Committeemember | null,
  committeeMemberId: ID,
  createdAt: DateTime,
  id: ID,
  presentSetTo: Boolean,
  timestamp: DateTime,
  updatedAt: DateTime | null    
};
		
export type PresencechangedtimestampOrderInputArgument = {
  committeeMember?: CommitteememberOrderInputArgument | null | undefined,
  committeeMemberId?: SortingParameter | null | undefined,
  createdAt?: SortingParameter | null | undefined,
  id?: SortingParameter | null | undefined,
  presentSetTo?: SortingParameter | null | undefined,
  timestamp?: SortingParameter | null | undefined,
  updatedAt?: SortingParameter | null | undefined    
};
		
export type PresencechangedtimestampWhereInputArgument = {
  committeeMember?: CommitteememberWhereInputArgument | null | undefined,
  committeeMemberId?: ID | null | undefined,
  createdAt?: DateWhereInputArgument | null | undefined,
  id?: ID | null | undefined,
  presentSetTo?: Boolean | null | undefined,
  timestamp?: DateWhereInputArgument | null | undefined,
  updatedAt?: DateWhereInputArgument | null | undefined    
};
		
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
  agendaItemsCount: Int,
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
  committeeMembersCount: Int,
  committees: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: CommitteeOrderInputArgument | null | undefined,
    where?: CommitteeWhereInputArgument | null | undefined
  }) => Committee[],
  committeesCount: Int,
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
  conferenceMembersCount: Int,
  conferenceUser: (p: {
    id: ID
  }) => Conferenceuser,
  conferenceUsers: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: ConferenceuserOrderInputArgument | null | undefined,
    where?: ConferenceuserWhereInputArgument | null | undefined
  }) => Conferenceuser[],
  conferenceUsersCount: Int,
  conferences: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: ConferenceOrderInputArgument | null | undefined,
    where?: ConferenceWhereInputArgument | null | undefined
  }) => Conference[],
  conferencesCount: Int,
  presenceChangedTimestamp: (p: {
    id: ID
  }) => Presencechangedtimestamp,
  presenceChangedTimestamps: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: PresencechangedtimestampOrderInputArgument | null | undefined,
    where?: PresencechangedtimestampWhereInputArgument | null | undefined
  }) => Presencechangedtimestamp[],
  presenceChangedTimestampsCount: Int,
  representation: (p: {
    id: ID
  }) => Representation,
  representations: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: RepresentationOrderInputArgument | null | undefined,
    where?: RepresentationWhereInputArgument | null | undefined
  }) => Representation[],
  representationsCount: Int,
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
  speakerOnListsCount: Int,
  speakersList: (p: {
    id: ID
  }) => Speakerslist,
  speakersLists: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: SpeakerslistOrderInputArgument | null | undefined,
    where?: SpeakerslistWhereInputArgument | null | undefined
  }) => Speakerslist[],
  speakersListsCount: Int,
  user: (p: {
    id: ID
  }) => User,
  users: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: UserOrderInputArgument | null | undefined,
    where?: UserWhereInputArgument | null | undefined
  }) => User[],
  usersCount: Int    
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
  type: TypeEnum,
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
  type?: TypeEnum | null | undefined,
  updatedAt?: DateWhereInputArgument | null | undefined    
};
		
export type RepresentationtypeEnum = "DELEGATION" | "NSA" | "UN";
		
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
  speakers: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: SpeakeronlistOrderInputArgument | null | undefined,
    where?: SpeakeronlistWhereInputArgument | null | undefined
  }) => Speakeronlist[],
  speakingTime: Int,
  startTimestamp: DateTime | null,
  timeLeft: Int,
  type: TypeEnum,
  updatedAt: DateTime | null    
};
		
export type SpeakerslistOrderInputArgument = {
  agendaItem?: AgendaitemOrderInputArgument | null | undefined,
  agendaItemId?: SortingParameter | null | undefined,
  createdAt?: SortingParameter | null | undefined,
  id?: SortingParameter | null | undefined,
  isClosed?: SortingParameter | null | undefined,
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
  speakers?: SpeakeronlistWhereInputArgument | null | undefined,
  speakingTime?: IntWhereInputArgument | null | undefined,
  startTimestamp?: DateWhereInputArgument | null | undefined,
  timeLeft?: IntWhereInputArgument | null | undefined,
  type?: TypeEnum | null | undefined,
  updatedAt?: DateWhereInputArgument | null | undefined    
};
		
export type StatusEnum = "FORMAL" | "INFORMAL" | "PAUSE" | "SUSPENSION";
		
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
  agendaItemsCount: Int,
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
  committeeMembersCount: Int,
  committees: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: CommitteeOrderInputArgument | null | undefined,
    where?: CommitteeWhereInputArgument | null | undefined
  }) => Committee[],
  committeesCount: Int,
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
  conferenceMembersCount: Int,
  conferenceUser: (p: {
    id: ID
  }) => Conferenceuser,
  conferenceUsers: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: ConferenceuserOrderInputArgument | null | undefined,
    where?: ConferenceuserWhereInputArgument | null | undefined
  }) => Conferenceuser[],
  conferenceUsersCount: Int,
  conferences: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: ConferenceOrderInputArgument | null | undefined,
    where?: ConferenceWhereInputArgument | null | undefined
  }) => Conference[],
  conferencesCount: Int,
  presenceChangedTimestamp: (p: {
    id: ID
  }) => Presencechangedtimestamp,
  presenceChangedTimestamps: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: PresencechangedtimestampOrderInputArgument | null | undefined,
    where?: PresencechangedtimestampWhereInputArgument | null | undefined
  }) => Presencechangedtimestamp[],
  presenceChangedTimestampsCount: Int,
  representation: (p: {
    id: ID
  }) => Representation,
  representations: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: RepresentationOrderInputArgument | null | undefined,
    where?: RepresentationWhereInputArgument | null | undefined
  }) => Representation[],
  representationsCount: Int,
  speakerOnList: (p: {
    id: ID
  }) => Speakeronlist,
  speakerOnLists: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: SpeakeronlistOrderInputArgument | null | undefined,
    where?: SpeakeronlistWhereInputArgument | null | undefined
  }) => Speakeronlist[],
  speakerOnListsCount: Int,
  speakersList: (p: {
    id: ID
  }) => Speakerslist,
  speakersLists: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: SpeakerslistOrderInputArgument | null | undefined,
    where?: SpeakerslistWhereInputArgument | null | undefined
  }) => Speakerslist[],
  speakersListsCount: Int,
  user: (p: {
    id: ID
  }) => User,
  users: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: UserOrderInputArgument | null | undefined,
    where?: UserWhereInputArgument | null | undefined
  }) => User[],
  usersCount: Int    
};
		
export type TypeEnum = "DELEGATION" | "NSA" | "UN";
		
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
		
const urqlClient = new Client({
  url: "/api/graphql",
  fetchSubscriptions: true,
  exchanges: [cacheExchange({}), fetchExchange],
  fetchOptions: {
    credentials: "include",
  },
  requestPolicy: "cache-and-network",
});

export const client = {
  /**
   * A query and subscription combination. First queries and if exists, also subscribes to a subscription of the same name.
   * Combines the results of both, so the result is first the query result and then live updates from the subscription.
   * Assumes that the query and subscription return the same fields as per default when using the rumble query helpers.
   * If no subscription with the same name exists, this will just be a query.
   */
  liveQuery: makeLiveQuery<Query>({
	  urqlClient,
	  availableSubscriptions: new Set(["agendaItem", "agendaItems", "agendaItemsCount", "committee", "committeeMember", "committeeMembers", "committeeMembersCount", "committees", "committeesCount", "conference", "conferenceMember", "conferenceMembers", "conferenceMembersCount", "conferenceUser", "conferenceUsers", "conferenceUsersCount", "conferences", "conferencesCount", "presenceChangedTimestamp", "presenceChangedTimestamps", "presenceChangedTimestampsCount", "representation", "representations", "representationsCount", "speakerOnList", "speakerOnLists", "speakerOnListsCount", "speakersList", "speakersLists", "speakersListsCount", "user", "users", "usersCount"]),
  }),
  /**
   * A mutation that can be used to e.g. create, update or delete data.
   */
  mutate: makeMutation<Mutation>({
	  urqlClient,
  }),
  /**
   * A continuous stream of results that updates when the server sends new data.
   */
  subscribe: makeSubscription<Subscription>({
	  urqlClient,
  }),
  /**
   * A one-time fetch of data.
   */
  query: makeQuery<Query>({
	  urqlClient,
  }),
}