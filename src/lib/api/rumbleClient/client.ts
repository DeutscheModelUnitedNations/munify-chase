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
  resolutionPapers: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: ResolutionpaperOrderInputArgument | null | undefined,
    where?: ResolutionpaperWhereInputArgument | null | undefined
  }) => Resolutionpaper[],
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
  resolutionPapers?: ResolutionpaperOrderInputArgument | null | undefined,
  speakersList?: SpeakerslistOrderInputArgument | null | undefined,
  title?: SortingParameter | null | undefined,
  updatedAt?: SortingParameter | null | undefined    
};
		
export type AgendaitemWhereInputArgument = {
  committee?: CommitteeWhereInputArgument | null | undefined,
  committeeId?: ID | null | undefined,
  createdAt?: DateWhereInputArgument | null | undefined,
  id?: ID | null | undefined,
  resolutionPapers?: ResolutionpaperWhereInputArgument | null | undefined,
  speakersList?: SpeakerslistWhereInputArgument | null | undefined,
  title?: StringWhereInputArgument | null | undefined,
  updatedAt?: DateWhereInputArgument | null | undefined    
};
		
export type Amendment = {
  createdAt: DateTime,
  documentNumber: String | null,
  id: ID,
  newContent: JSON | null,
  paper: (p?: {
    orderBy?: ResolutionpaperOrderInputArgument | null | undefined,
    where?: ResolutionpaperWhereInputArgument | null | undefined
  }) => Resolutionpaper,
  paperId: ID,
  proposer: (p?: {
    orderBy?: CommitteememberOrderInputArgument | null | undefined,
    where?: CommitteememberWhereInputArgument | null | undefined
  }) => Committeemember,
  proposerCommitteeMemberId: ID,
  sequenceNumber: Int | null,
  sponsors: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: AmendmentsponsorOrderInputArgument | null | undefined,
    where?: AmendmentsponsorWhereInputArgument | null | undefined
  }) => Amendmentsponsor[],
  status: AmendmentstatusEnum,
  targetClauseId: ID | null,
  targetOperativeIndex: Int | null,
  targetPosition: Int | null,
  type: AmendmenttypeEnum,
  updatedAt: DateTime | null    
};
		
export type AmendmentOrderInputArgument = {
  createdAt?: SortingParameter | null | undefined,
  documentNumber?: SortingParameter | null | undefined,
  id?: SortingParameter | null | undefined,
  newContent?: SortingParameter | null | undefined,
  paper?: ResolutionpaperOrderInputArgument | null | undefined,
  paperId?: SortingParameter | null | undefined,
  proposer?: CommitteememberOrderInputArgument | null | undefined,
  proposerCommitteeMemberId?: SortingParameter | null | undefined,
  sequenceNumber?: SortingParameter | null | undefined,
  sponsors?: AmendmentsponsorOrderInputArgument | null | undefined,
  status?: SortingParameter | null | undefined,
  targetClauseId?: SortingParameter | null | undefined,
  targetOperativeIndex?: SortingParameter | null | undefined,
  targetPosition?: SortingParameter | null | undefined,
  type?: SortingParameter | null | undefined,
  updatedAt?: SortingParameter | null | undefined    
};
		
export type AmendmentWhereInputArgument = {
  createdAt?: DateWhereInputArgument | null | undefined,
  documentNumber?: StringWhereInputArgument | null | undefined,
  id?: ID | null | undefined,
  newContent?: JSON | null | undefined,
  paper?: ResolutionpaperWhereInputArgument | null | undefined,
  paperId?: ID | null | undefined,
  proposer?: CommitteememberWhereInputArgument | null | undefined,
  proposerCommitteeMemberId?: ID | null | undefined,
  sequenceNumber?: IntWhereInputArgument | null | undefined,
  sponsors?: AmendmentsponsorWhereInputArgument | null | undefined,
  status?: AmendmentstatusEnum | null | undefined,
  targetClauseId?: ID | null | undefined,
  targetOperativeIndex?: IntWhereInputArgument | null | undefined,
  targetPosition?: IntWhereInputArgument | null | undefined,
  type?: AmendmenttypeEnum | null | undefined,
  updatedAt?: DateWhereInputArgument | null | undefined    
};
		
export type Amendmentsponsor = {
  amendment: (p?: {
    orderBy?: AmendmentOrderInputArgument | null | undefined,
    where?: AmendmentWhereInputArgument | null | undefined
  }) => Amendment,
  amendmentId: ID,
  committeeMember: (p?: {
    orderBy?: CommitteememberOrderInputArgument | null | undefined,
    where?: CommitteememberWhereInputArgument | null | undefined
  }) => Committeemember,
  committeeMemberId: ID,
  createdAt: DateTime,
  id: ID,
  updatedAt: DateTime | null    
};
		
export type AmendmentsponsorOrderInputArgument = {
  amendment?: AmendmentOrderInputArgument | null | undefined,
  amendmentId?: SortingParameter | null | undefined,
  committeeMember?: CommitteememberOrderInputArgument | null | undefined,
  committeeMemberId?: SortingParameter | null | undefined,
  createdAt?: SortingParameter | null | undefined,
  id?: SortingParameter | null | undefined,
  updatedAt?: SortingParameter | null | undefined    
};
		
export type AmendmentsponsorWhereInputArgument = {
  amendment?: AmendmentWhereInputArgument | null | undefined,
  amendmentId?: ID | null | undefined,
  committeeMember?: CommitteememberWhereInputArgument | null | undefined,
  committeeMemberId?: ID | null | undefined,
  createdAt?: DateWhereInputArgument | null | undefined,
  id?: ID | null | undefined,
  updatedAt?: DateWhereInputArgument | null | undefined    
};
		
export type AmendmentstatusEnum = "ACCEPTED" | "CONSENSUS_ADOPTED" | "PENDING" | "REJECTED" | "SUBMITTED" | "WITHDRAWN";
		
export type AmendmenttypeEnum = "ADD" | "ALTER_POSITION" | "ALTER_TEXT" | "DELETE";
		
export type Boolean = boolean;
		
export type CommentvisibilityEnum = "PUBLIC" | "TEAM_ONLY";
		
export type Committee = {
  abbreviation: String,
  activeAgendaItem: (p?: {
    orderBy?: AgendaitemOrderInputArgument | null | undefined,
    where?: AgendaitemWhereInputArgument | null | undefined
  }) => Agendaitem | null,
  activeAgendaItemId: ID | null,
  activeAmendment: (p?: {
    orderBy?: AmendmentOrderInputArgument | null | undefined,
    where?: AmendmentWhereInputArgument | null | undefined
  }) => Amendment | null,
  activeAmendmentId: ID | null,
  activeDraftResolution: (p?: {
    orderBy?: ResolutionpaperOrderInputArgument | null | undefined,
    where?: ResolutionpaperWhereInputArgument | null | undefined
  }) => Resolutionpaper | null,
  activeDraftResolutionId: ID | null,
  agendaItems: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: AgendaitemOrderInputArgument | null | undefined,
    where?: AgendaitemWhereInputArgument | null | undefined
  }) => Agendaitem[],
  allowDelegationsToAddThemselvesToSpeakersList: Boolean,
  amendmentSponsoringOpen: Boolean,
  amendmentSubmissionOpen: Boolean,
  conference: (p?: {
    orderBy?: ConferenceOrderInputArgument | null | undefined,
    where?: ConferenceWhereInputArgument | null | undefined
  }) => Conference | null,
  conferenceId: ID,
  createdAt: DateTime,
  currentOperativeClauseId: ID | null,
  currentOperativeIndex: Int | null,
  customPaperSupportThreshold: Int | null,
  customSimpleMajority: Int | null,
  customTwoThirdsMajority: Int | null,
  id: ID,
  lastResolutionAdoptionDate: DateTime | null,
  maxDraftResolutions: Int,
  members: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: CommitteememberOrderInputArgument | null | undefined,
    where?: CommitteememberWhereInputArgument | null | undefined
  }) => Committeemember[],
  name: String,
  nsaPresenceEvents: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: NsapresenceeventOrderInputArgument | null | undefined,
    where?: NsapresenceeventWhereInputArgument | null | undefined
  }) => Nsapresenceevent[],
  paperSupportThreshold: Int,
  resolutionHeadline: String | null,
  resolutionPapers: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: ResolutionpaperOrderInputArgument | null | undefined,
    where?: ResolutionpaperWhereInputArgument | null | undefined
  }) => Resolutionpaper[],
  showWhiteboard: Boolean,
  simpleMajority: Int,
  stateOfDebate: String | null,
  status: CommitteestatusEnum,
  statusHeadline: String,
  statusUntil: DateTime,
  supportReEvaluationOpen: Boolean,
  totalPresent: Int,
  twoThirdsMajority: Int,
  updatedAt: DateTime | null,
  whiteboardContent: String | null    
};
		
export type CommitteeOrderInputArgument = {
  abbreviation?: SortingParameter | null | undefined,
  activeAgendaItem?: AgendaitemOrderInputArgument | null | undefined,
  activeAgendaItemId?: SortingParameter | null | undefined,
  activeAmendment?: AmendmentOrderInputArgument | null | undefined,
  activeAmendmentId?: SortingParameter | null | undefined,
  activeDraftResolution?: ResolutionpaperOrderInputArgument | null | undefined,
  activeDraftResolutionId?: SortingParameter | null | undefined,
  agendaItems?: AgendaitemOrderInputArgument | null | undefined,
  allowDelegationsToAddThemselvesToSpeakersList?: SortingParameter | null | undefined,
  amendmentSponsoringOpen?: SortingParameter | null | undefined,
  amendmentSubmissionOpen?: SortingParameter | null | undefined,
  conference?: ConferenceOrderInputArgument | null | undefined,
  conferenceId?: SortingParameter | null | undefined,
  createdAt?: SortingParameter | null | undefined,
  currentOperativeClauseId?: SortingParameter | null | undefined,
  currentOperativeIndex?: SortingParameter | null | undefined,
  customPaperSupportThreshold?: SortingParameter | null | undefined,
  customSimpleMajority?: SortingParameter | null | undefined,
  customTwoThirdsMajority?: SortingParameter | null | undefined,
  id?: SortingParameter | null | undefined,
  lastResolutionAdoptionDate?: SortingParameter | null | undefined,
  maxDraftResolutions?: SortingParameter | null | undefined,
  members?: CommitteememberOrderInputArgument | null | undefined,
  name?: SortingParameter | null | undefined,
  nsaPresenceEvents?: NsapresenceeventOrderInputArgument | null | undefined,
  resolutionHeadline?: SortingParameter | null | undefined,
  resolutionPapers?: ResolutionpaperOrderInputArgument | null | undefined,
  showWhiteboard?: SortingParameter | null | undefined,
  stateOfDebate?: SortingParameter | null | undefined,
  status?: SortingParameter | null | undefined,
  statusHeadline?: SortingParameter | null | undefined,
  statusUntil?: SortingParameter | null | undefined,
  supportReEvaluationOpen?: SortingParameter | null | undefined,
  updatedAt?: SortingParameter | null | undefined,
  whiteboardContent?: SortingParameter | null | undefined    
};
		
export type CommitteeWhereInputArgument = {
  abbreviation?: StringWhereInputArgument | null | undefined,
  activeAgendaItem?: AgendaitemWhereInputArgument | null | undefined,
  activeAgendaItemId?: ID | null | undefined,
  activeAmendment?: AmendmentWhereInputArgument | null | undefined,
  activeAmendmentId?: ID | null | undefined,
  activeDraftResolution?: ResolutionpaperWhereInputArgument | null | undefined,
  activeDraftResolutionId?: ID | null | undefined,
  agendaItems?: AgendaitemWhereInputArgument | null | undefined,
  allowDelegationsToAddThemselvesToSpeakersList?: Boolean | null | undefined,
  amendmentSponsoringOpen?: Boolean | null | undefined,
  amendmentSubmissionOpen?: Boolean | null | undefined,
  conference?: ConferenceWhereInputArgument | null | undefined,
  conferenceId?: ID | null | undefined,
  createdAt?: DateWhereInputArgument | null | undefined,
  currentOperativeClauseId?: ID | null | undefined,
  currentOperativeIndex?: IntWhereInputArgument | null | undefined,
  customPaperSupportThreshold?: IntWhereInputArgument | null | undefined,
  customSimpleMajority?: IntWhereInputArgument | null | undefined,
  customTwoThirdsMajority?: IntWhereInputArgument | null | undefined,
  id?: ID | null | undefined,
  lastResolutionAdoptionDate?: DateWhereInputArgument | null | undefined,
  maxDraftResolutions?: IntWhereInputArgument | null | undefined,
  members?: CommitteememberWhereInputArgument | null | undefined,
  name?: StringWhereInputArgument | null | undefined,
  nsaPresenceEvents?: NsapresenceeventWhereInputArgument | null | undefined,
  resolutionHeadline?: StringWhereInputArgument | null | undefined,
  resolutionPapers?: ResolutionpaperWhereInputArgument | null | undefined,
  showWhiteboard?: Boolean | null | undefined,
  stateOfDebate?: StringWhereInputArgument | null | undefined,
  status?: CommitteestatusEnum | null | undefined,
  statusHeadline?: StringWhereInputArgument | null | undefined,
  statusUntil?: DateWhereInputArgument | null | undefined,
  supportReEvaluationOpen?: Boolean | null | undefined,
  updatedAt?: DateWhereInputArgument | null | undefined,
  whiteboardContent?: StringWhereInputArgument | null | undefined    
};
		
export type Committeemember = {
  amendmentSponsors: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: AmendmentsponsorOrderInputArgument | null | undefined,
    where?: AmendmentsponsorWhereInputArgument | null | undefined
  }) => Amendmentsponsor[],
  committee: (p?: {
    orderBy?: CommitteeOrderInputArgument | null | undefined,
    where?: CommitteeWhereInputArgument | null | undefined
  }) => Committee,
  committeeId: ID,
  createdAt: DateTime,
  createdPapers: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: ResolutionpaperOrderInputArgument | null | undefined,
    where?: ResolutionpaperWhereInputArgument | null | undefined
  }) => Resolutionpaper[],
  id: ID,
  paperSponsors: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: PapersponsorOrderInputArgument | null | undefined,
    where?: PapersponsorWhereInputArgument | null | undefined
  }) => Papersponsor[],
  presenceChangedTimestamps: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: PresencechangedtimestampOrderInputArgument | null | undefined,
    where?: PresencechangedtimestampWhereInputArgument | null | undefined
  }) => Presencechangedtimestamp[],
  present: Boolean,
  proposedAmendments: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: AmendmentOrderInputArgument | null | undefined,
    where?: AmendmentWhereInputArgument | null | undefined
  }) => Amendment[],
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
  }) => Conferenceuser[]    
};
		
export type CommitteememberOrderInputArgument = {
  amendmentSponsors?: AmendmentsponsorOrderInputArgument | null | undefined,
  committee?: CommitteeOrderInputArgument | null | undefined,
  committeeId?: SortingParameter | null | undefined,
  createdAt?: SortingParameter | null | undefined,
  createdPapers?: ResolutionpaperOrderInputArgument | null | undefined,
  id?: SortingParameter | null | undefined,
  paperSponsors?: PapersponsorOrderInputArgument | null | undefined,
  presenceChangedTimestamps?: PresencechangedtimestampOrderInputArgument | null | undefined,
  present?: SortingParameter | null | undefined,
  proposedAmendments?: AmendmentOrderInputArgument | null | undefined,
  representation?: RepresentationOrderInputArgument | null | undefined,
  representationId?: SortingParameter | null | undefined,
  updatedAt?: SortingParameter | null | undefined,
  users?: ConferenceuserOrderInputArgument | null | undefined    
};
		
export type CommitteememberWhereInputArgument = {
  amendmentSponsors?: AmendmentsponsorWhereInputArgument | null | undefined,
  committee?: CommitteeWhereInputArgument | null | undefined,
  committeeId?: ID | null | undefined,
  createdAt?: DateWhereInputArgument | null | undefined,
  createdPapers?: ResolutionpaperWhereInputArgument | null | undefined,
  id?: ID | null | undefined,
  paperSponsors?: PapersponsorWhereInputArgument | null | undefined,
  presenceChangedTimestamps?: PresencechangedtimestampWhereInputArgument | null | undefined,
  present?: Boolean | null | undefined,
  proposedAmendments?: AmendmentWhereInputArgument | null | undefined,
  representation?: RepresentationWhereInputArgument | null | undefined,
  representationId?: ID | null | undefined,
  updatedAt?: DateWhereInputArgument | null | undefined,
  users?: ConferenceuserWhereInputArgument | null | undefined    
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
  nsaPresenceEvents: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: NsapresenceeventOrderInputArgument | null | undefined,
    where?: NsapresenceeventWhereInputArgument | null | undefined
  }) => Nsapresenceevent[],
  pressWebsite: String | null,
  representations: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: RepresentationOrderInputArgument | null | undefined,
    where?: RepresentationWhereInputArgument | null | undefined
  }) => Representation[],
  resolutionFeatureEnabled: Boolean,
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
  nsaPresenceEvents?: NsapresenceeventOrderInputArgument | null | undefined,
  pressWebsite?: SortingParameter | null | undefined,
  representations?: RepresentationOrderInputArgument | null | undefined,
  resolutionFeatureEnabled?: SortingParameter | null | undefined,
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
  nsaPresenceEvents?: NsapresenceeventWhereInputArgument | null | undefined,
  pressWebsite?: StringWhereInputArgument | null | undefined,
  representations?: RepresentationWhereInputArgument | null | undefined,
  resolutionFeatureEnabled?: Boolean | null | undefined,
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
  comments: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: ResolutioncommentOrderInputArgument | null | undefined,
    where?: ResolutioncommentWhereInputArgument | null | undefined
  }) => Resolutioncomment[],
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
  nsaPresenceEvents: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: NsapresenceeventOrderInputArgument | null | undefined,
    where?: NsapresenceeventWhereInputArgument | null | undefined
  }) => Nsapresenceevent[],
  paperEditors: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: PapereditorOrderInputArgument | null | undefined,
    where?: PapereditorWhereInputArgument | null | undefined
  }) => Papereditor[],
  triggeredNsaPresenceEvents: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: NsapresenceeventOrderInputArgument | null | undefined,
    where?: NsapresenceeventWhereInputArgument | null | undefined
  }) => Nsapresenceevent[],
  updatedAt: DateTime | null,
  user: () => User | null,
  userEmail: String    
};
		
export type ConferenceuserOrderInputArgument = {
  attendanceCode?: SortingParameter | null | undefined,
  comments?: ResolutioncommentOrderInputArgument | null | undefined,
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
  nsaPresenceEvents?: NsapresenceeventOrderInputArgument | null | undefined,
  paperEditors?: PapereditorOrderInputArgument | null | undefined,
  triggeredNsaPresenceEvents?: NsapresenceeventOrderInputArgument | null | undefined,
  updatedAt?: SortingParameter | null | undefined,
  user?: UserOrderInputArgument | null | undefined,
  userEmail?: SortingParameter | null | undefined    
};
		
export type ConferenceuserWhereInputArgument = {
  attendanceCode?: StringWhereInputArgument | null | undefined,
  comments?: ResolutioncommentWhereInputArgument | null | undefined,
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
  nsaPresenceEvents?: NsapresenceeventWhereInputArgument | null | undefined,
  paperEditors?: PapereditorWhereInputArgument | null | undefined,
  triggeredNsaPresenceEvents?: NsapresenceeventWhereInputArgument | null | undefined,
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
  name: String,
  resolutionHeadline?: String | null | undefined    
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
  acceptAmendment: (p: {
    amendmentId: ID
  }) => Amendment,
  addAmendmentSponsor: (p: {
    amendmentId: ID,
    committeeMemberId: ID
  }) => Amendmentsponsor,
  addSpeakerOnList: (p: {
    committeeMemberId?: ID | null | undefined,
    conferenceMemberId?: ID | null | undefined,
    id?: ID | null | undefined,
    position?: Int | null | undefined,
    speakersListId: ID
  }) => Speakeronlist,
  addSponsor: (p: {
    committeeMemberId: ID,
    paperId: ID
  }) => Papersponsor,
  adoptByConsensus: (p: {
    amendmentId: ID
  }) => Amendment,
  chairCreateAmendment: (p: {
    committeeMemberId: ID,
    newContent?: JSON | null | undefined,
    paperId: ID,
    targetClauseId?: String | null | undefined,
    targetOperativeIndex?: Int | null | undefined,
    targetPosition?: Int | null | undefined,
    type: unknown
  }) => Amendment,
  chairCreateResolutionPaper: (p: {
    agendaItemId: ID,
    committeeId: ID,
    committeeMemberId: ID,
    title?: String | null | undefined
  }) => Resolutionpaper,
  clearSpeakersList: (p: {
    id: ID
  }) => Speakerslist,
  createAgendaItem: (p: {
    committeeId: ID,
    id?: ID | null | undefined,
    title: String
  }) => Agendaitem,
  createAmendment: (p: {
    newContent?: JSON | null | undefined,
    paperId: ID,
    targetClauseId?: String | null | undefined,
    targetOperativeIndex?: Int | null | undefined,
    targetPosition?: Int | null | undefined,
    type: unknown
  }) => Amendment,
  createComment: (p: {
    clauseId?: String | null | undefined,
    content: String,
    id?: ID | null | undefined,
    paperId: ID,
    parentCommentId?: ID | null | undefined,
    visibility?: unknown | null | undefined
  }) => Resolutioncomment,
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
  createResolutionPaper: (p: {
    agendaItemId: ID,
    committeeId: ID,
    title?: String | null | undefined
  }) => Resolutionpaper,
  createShareCode: (p: {
    paperId: ID,
    permission: unknown
  }) => Papersharecode,
  deleteClauseVote: Boolean,
  deleteComment: Boolean,
  deleteCommittee: Boolean,
  deleteCommitteeMember: Boolean,
  deleteConference: Boolean,
  deleteConferenceMember: Boolean,
  deleteConferenceUser: Boolean,
  deleteNsaPresenceEvent: (p: {
    id: ID
  }) => Nsapresenceevent,
  deleteRepresentation: Boolean,
  deleteShareCode: Boolean,
  editAmendment: (p: {
    amendmentId: ID,
    newContent?: JSON | null | undefined,
    proposerCommitteeMemberId?: ID | null | undefined,
    targetClauseId?: String | null | undefined,
    targetOperativeIndex?: Int | null | undefined,
    targetPosition?: Int | null | undefined
  }) => Amendment,
  importDelegatorConference: (p: {
    data: ImportData
  }) => Conference,
  insertNsaPresenceEvent: (p: {
    committeeId: ID,
    conferenceUserId: ID,
    note?: String | null | undefined,
    timestamp: DateTime,
    type: unknown
  }) => Nsapresenceevent,
  moveSpeakerToPosition: (p: {
    id: ID,
    position: Int
  }) => Speakeronlist,
  promoteToDraftResolution: (p: {
    paperId: ID
  }) => Resolutionpaper,
  recordClauseVote: (p: {
    clauseId: String,
    outcome: unknown,
    paperId: ID,
    votesAbstain?: Int | null | undefined,
    votesAgainst: Int,
    votesFor: Int
  }) => Operativeclausevote,
  recordNsaCheckIn: (p: {
    code: String,
    committeeId: ID
  }) => Nsapresenceevent,
  recordNsaCheckOut: (p: {
    code: String,
    committeeId: ID
  }) => Nsapresenceevent,
  recordVoteResult: (p: {
    outcome: unknown,
    paperId: ID,
    votesAbstain?: Int | null | undefined,
    votesAgainst: Int,
    votesFor: Int
  }) => Resolutionpaper,
  redeemShareCode: (p: {
    code: String
  }) => ShareCodeRedemptionResult,
  regenerateNsaAttendanceCode: (p: {
    conferenceUserId: ID
  }) => Conferenceuser,
  rejectAmendment: (p: {
    amendmentId: ID
  }) => Amendment,
  removeAmendmentSponsor: Boolean,
  removeEditor: Boolean,
  removeSpeakerOnList: (p: {
    speakerOnListId: ID
  }) => Speakerslist,
  removeSponsor: Boolean,
  revertPaperStatus: (p: {
    paperId: ID,
    restoreSnapshot?: Boolean | null | undefined
  }) => Resolutionpaper,
  selfAddToSpeakersList: (p: {
    id?: ID | null | undefined,
    speakersListId: ID
  }) => Speakeronlist,
  selfRemoveFromSpeakersList: (p: {
    speakersListId: ID
  }) => Speakerslist,
  setPresenceForCommitteeMembers: (p: {
    ids: unknown,
    present: Boolean
  }) => Committeemember[],
  softDeletePaper: Boolean,
  startVotingPhase: (p: {
    paperId: ID
  }) => Resolutionpaper,
  submitPaper: (p: {
    paperId: ID
  }) => Resolutionpaper,
  updateComment: (p: {
    commentId: ID,
    content: String
  }) => Resolutioncomment,
  updateCommittee: (p: {
    abbreviation?: String | null | undefined,
    activeAgendaItemId?: ID | null | undefined,
    activeAmendmentId?: ID | null | undefined,
    activeDraftResolutionId?: ID | null | undefined,
    allowDelegationsToAddThemselvesToSpeakersList?: Boolean | null | undefined,
    amendmentSponsoringOpen?: Boolean | null | undefined,
    amendmentSubmissionOpen?: Boolean | null | undefined,
    clearActiveAmendment?: Boolean | null | undefined,
    clearActiveDraftResolution?: Boolean | null | undefined,
    currentOperativeClauseId?: String | null | undefined,
    currentOperativeIndex?: Int | null | undefined,
    id: ID,
    lastResolutionAdoptionDate?: DateTime | null | undefined,
    maxDraftResolutions?: Int | null | undefined,
    name?: String | null | undefined,
    showWhiteboard?: Boolean | null | undefined,
    stateOfDebate?: String | null | undefined,
    status?: unknown | null | undefined,
    statusHeadline?: String | null | undefined,
    statusUntil?: DateTime | null | undefined,
    supportReEvaluationOpen?: Boolean | null | undefined,
    whiteboardContent?: String | null | undefined
  }) => Committee,
  updateConference: (p: {
    endDate?: Date | null | undefined,
    hasModeratedCaucus?: Boolean | null | undefined,
    id: ID,
    location?: String | null | undefined,
    logoSvg?: String | null | undefined,
    pressWebsite?: String | null | undefined,
    resolutionFeatureEnabled?: Boolean | null | undefined,
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
  updateNsaPresenceEvent: (p: {
    committeeId?: ID | null | undefined,
    id: ID,
    note?: String | null | undefined,
    timestamp?: DateTime | null | undefined,
    type?: unknown | null | undefined
  }) => Nsapresenceevent,
  updatePaperTitle: (p: {
    paperId: ID,
    title: String
  }) => Resolutionpaper,
  updateSpeakerOnList: (p: {
    id: ID,
    overwriteName?: String | null | undefined
  }) => Speakeronlist,
  updateSpeakersList: (p: {
    id: ID,
    isClosed?: Boolean | null | undefined,
    speakingTime?: Int | null | undefined,
    startTimestamp?: DateTime | null | undefined,
    stopTimer?: Boolean | null | undefined,
    timeLeft?: Int | null | undefined
  }) => Speakerslist,
  withdrawAmendment: (p: {
    amendmentId: ID
  }) => Amendment    
};
		
export type Nsapresenceevent = {
  committee: (p?: {
    orderBy?: CommitteeOrderInputArgument | null | undefined,
    where?: CommitteeWhereInputArgument | null | undefined
  }) => Committee,
  committeeId: ID,
  conference: (p?: {
    orderBy?: ConferenceOrderInputArgument | null | undefined,
    where?: ConferenceWhereInputArgument | null | undefined
  }) => Conference,
  conferenceId: ID,
  conferenceUser: (p?: {
    orderBy?: ConferenceuserOrderInputArgument | null | undefined,
    where?: ConferenceuserWhereInputArgument | null | undefined
  }) => Conferenceuser,
  conferenceUserId: ID,
  createdAt: DateTime,
  id: ID,
  note: String | null,
  timestamp: DateTime,
  triggeredBy: (p?: {
    orderBy?: ConferenceuserOrderInputArgument | null | undefined,
    where?: ConferenceuserWhereInputArgument | null | undefined
  }) => Conferenceuser | null,
  triggeredByConferenceUserId: ID | null,
  type: NsapresenceeventtypeEnum,
  updatedAt: DateTime | null    
};
		
export type NsapresenceeventOrderInputArgument = {
  committee?: CommitteeOrderInputArgument | null | undefined,
  committeeId?: SortingParameter | null | undefined,
  conference?: ConferenceOrderInputArgument | null | undefined,
  conferenceId?: SortingParameter | null | undefined,
  conferenceUser?: ConferenceuserOrderInputArgument | null | undefined,
  conferenceUserId?: SortingParameter | null | undefined,
  createdAt?: SortingParameter | null | undefined,
  id?: SortingParameter | null | undefined,
  note?: SortingParameter | null | undefined,
  timestamp?: SortingParameter | null | undefined,
  triggeredBy?: ConferenceuserOrderInputArgument | null | undefined,
  triggeredByConferenceUserId?: SortingParameter | null | undefined,
  type?: SortingParameter | null | undefined,
  updatedAt?: SortingParameter | null | undefined    
};
		
export type NsapresenceeventWhereInputArgument = {
  committee?: CommitteeWhereInputArgument | null | undefined,
  committeeId?: ID | null | undefined,
  conference?: ConferenceWhereInputArgument | null | undefined,
  conferenceId?: ID | null | undefined,
  conferenceUser?: ConferenceuserWhereInputArgument | null | undefined,
  conferenceUserId?: ID | null | undefined,
  createdAt?: DateWhereInputArgument | null | undefined,
  id?: ID | null | undefined,
  note?: StringWhereInputArgument | null | undefined,
  timestamp?: DateWhereInputArgument | null | undefined,
  triggeredBy?: ConferenceuserWhereInputArgument | null | undefined,
  triggeredByConferenceUserId?: ID | null | undefined,
  type?: NsapresenceeventtypeEnum | null | undefined,
  updatedAt?: DateWhereInputArgument | null | undefined    
};
		
export type NsapresenceeventtypeEnum = "CHECK_IN" | "CHECK_OUT";
		
export type Operativeclausevote = {
  clauseId: ID,
  createdAt: DateTime,
  id: ID,
  outcome: VoteoutcomeEnum,
  paper: (p?: {
    orderBy?: ResolutionpaperOrderInputArgument | null | undefined,
    where?: ResolutionpaperWhereInputArgument | null | undefined
  }) => Resolutionpaper,
  paperId: ID,
  updatedAt: DateTime | null,
  votesAbstain: Int,
  votesAgainst: Int,
  votesFor: Int    
};
		
export type OperativeclausevoteOrderInputArgument = {
  clauseId?: SortingParameter | null | undefined,
  createdAt?: SortingParameter | null | undefined,
  id?: SortingParameter | null | undefined,
  outcome?: SortingParameter | null | undefined,
  paper?: ResolutionpaperOrderInputArgument | null | undefined,
  paperId?: SortingParameter | null | undefined,
  updatedAt?: SortingParameter | null | undefined,
  votesAbstain?: SortingParameter | null | undefined,
  votesAgainst?: SortingParameter | null | undefined,
  votesFor?: SortingParameter | null | undefined    
};
		
export type OperativeclausevoteWhereInputArgument = {
  clauseId?: ID | null | undefined,
  createdAt?: DateWhereInputArgument | null | undefined,
  id?: ID | null | undefined,
  outcome?: VoteoutcomeEnum | null | undefined,
  paper?: ResolutionpaperWhereInputArgument | null | undefined,
  paperId?: ID | null | undefined,
  updatedAt?: DateWhereInputArgument | null | undefined,
  votesAbstain?: IntWhereInputArgument | null | undefined,
  votesAgainst?: IntWhereInputArgument | null | undefined,
  votesFor?: IntWhereInputArgument | null | undefined    
};
		
export type Papercontentsnapshot = {
  content: JSON | null,
  createdAt: DateTime,
  id: ID,
  paper: (p?: {
    orderBy?: ResolutionpaperOrderInputArgument | null | undefined,
    where?: ResolutionpaperWhereInputArgument | null | undefined
  }) => Resolutionpaper,
  paperId: ID,
  trigger: String | null,
  updatedAt: DateTime | null    
};
		
export type PapercontentsnapshotOrderInputArgument = {
  content?: SortingParameter | null | undefined,
  createdAt?: SortingParameter | null | undefined,
  id?: SortingParameter | null | undefined,
  paper?: ResolutionpaperOrderInputArgument | null | undefined,
  paperId?: SortingParameter | null | undefined,
  trigger?: SortingParameter | null | undefined,
  updatedAt?: SortingParameter | null | undefined    
};
		
export type PapercontentsnapshotWhereInputArgument = {
  content?: JSON | null | undefined,
  createdAt?: DateWhereInputArgument | null | undefined,
  id?: ID | null | undefined,
  paper?: ResolutionpaperWhereInputArgument | null | undefined,
  paperId?: ID | null | undefined,
  trigger?: StringWhereInputArgument | null | undefined,
  updatedAt?: DateWhereInputArgument | null | undefined    
};
		
export type Papereditor = {
  conferenceUser: (p?: {
    orderBy?: ConferenceuserOrderInputArgument | null | undefined,
    where?: ConferenceuserWhereInputArgument | null | undefined
  }) => Conferenceuser,
  conferenceUserId: ID,
  createdAt: DateTime,
  id: ID,
  paper: (p?: {
    orderBy?: ResolutionpaperOrderInputArgument | null | undefined,
    where?: ResolutionpaperWhereInputArgument | null | undefined
  }) => Resolutionpaper,
  paperId: ID,
  updatedAt: DateTime | null    
};
		
export type PapereditorOrderInputArgument = {
  conferenceUser?: ConferenceuserOrderInputArgument | null | undefined,
  conferenceUserId?: SortingParameter | null | undefined,
  createdAt?: SortingParameter | null | undefined,
  id?: SortingParameter | null | undefined,
  paper?: ResolutionpaperOrderInputArgument | null | undefined,
  paperId?: SortingParameter | null | undefined,
  updatedAt?: SortingParameter | null | undefined    
};
		
export type PapereditorWhereInputArgument = {
  conferenceUser?: ConferenceuserWhereInputArgument | null | undefined,
  conferenceUserId?: ID | null | undefined,
  createdAt?: DateWhereInputArgument | null | undefined,
  id?: ID | null | undefined,
  paper?: ResolutionpaperWhereInputArgument | null | undefined,
  paperId?: ID | null | undefined,
  updatedAt?: DateWhereInputArgument | null | undefined    
};
		
export type Papersharecode = {
  code: String,
  createdAt: DateTime,
  id: ID,
  paper: (p?: {
    orderBy?: ResolutionpaperOrderInputArgument | null | undefined,
    where?: ResolutionpaperWhereInputArgument | null | undefined
  }) => Resolutionpaper,
  paperId: ID,
  permission: SharecodepermissionEnum,
  updatedAt: DateTime | null    
};
		
export type PapersharecodeOrderInputArgument = {
  code?: SortingParameter | null | undefined,
  createdAt?: SortingParameter | null | undefined,
  id?: SortingParameter | null | undefined,
  paper?: ResolutionpaperOrderInputArgument | null | undefined,
  paperId?: SortingParameter | null | undefined,
  permission?: SortingParameter | null | undefined,
  updatedAt?: SortingParameter | null | undefined    
};
		
export type PapersharecodeWhereInputArgument = {
  code?: StringWhereInputArgument | null | undefined,
  createdAt?: DateWhereInputArgument | null | undefined,
  id?: ID | null | undefined,
  paper?: ResolutionpaperWhereInputArgument | null | undefined,
  paperId?: ID | null | undefined,
  permission?: SharecodepermissionEnum | null | undefined,
  updatedAt?: DateWhereInputArgument | null | undefined    
};
		
export type Papersponsor = {
  committeeMember: (p?: {
    orderBy?: CommitteememberOrderInputArgument | null | undefined,
    where?: CommitteememberWhereInputArgument | null | undefined
  }) => Committeemember,
  committeeMemberId: ID,
  createdAt: DateTime,
  id: ID,
  paper: (p?: {
    orderBy?: ResolutionpaperOrderInputArgument | null | undefined,
    where?: ResolutionpaperWhereInputArgument | null | undefined
  }) => Resolutionpaper,
  paperId: ID,
  updatedAt: DateTime | null    
};
		
export type PapersponsorOrderInputArgument = {
  committeeMember?: CommitteememberOrderInputArgument | null | undefined,
  committeeMemberId?: SortingParameter | null | undefined,
  createdAt?: SortingParameter | null | undefined,
  id?: SortingParameter | null | undefined,
  paper?: ResolutionpaperOrderInputArgument | null | undefined,
  paperId?: SortingParameter | null | undefined,
  updatedAt?: SortingParameter | null | undefined    
};
		
export type PapersponsorWhereInputArgument = {
  committeeMember?: CommitteememberWhereInputArgument | null | undefined,
  committeeMemberId?: ID | null | undefined,
  createdAt?: DateWhereInputArgument | null | undefined,
  id?: ID | null | undefined,
  paper?: ResolutionpaperWhereInputArgument | null | undefined,
  paperId?: ID | null | undefined,
  updatedAt?: DateWhereInputArgument | null | undefined    
};
		
export type PaperstatusEnum = "AMENDMENT_PHASE" | "DRAFT_RESOLUTION" | "FINAL" | "SUBMITTED" | "VOTING_PHASE" | "WORKING_PAPER";
		
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
  amendment: (p: {
    id: ID
  }) => Amendment,
  amendmentSponsor: (p: {
    id: ID
  }) => Amendmentsponsor,
  amendmentSponsors: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: AmendmentsponsorOrderInputArgument | null | undefined,
    where?: AmendmentsponsorWhereInputArgument | null | undefined
  }) => Amendmentsponsor[],
  amendments: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: AmendmentOrderInputArgument | null | undefined,
    where?: AmendmentWhereInputArgument | null | undefined
  }) => Amendment[],
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
  nsaPresenceEvent: (p: {
    id: ID
  }) => Nsapresenceevent,
  nsaPresenceEvents: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: NsapresenceeventOrderInputArgument | null | undefined,
    where?: NsapresenceeventWhereInputArgument | null | undefined
  }) => Nsapresenceevent[],
  operativeClauseVote: (p: {
    id: ID
  }) => Operativeclausevote,
  operativeClauseVotes: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: OperativeclausevoteOrderInputArgument | null | undefined,
    where?: OperativeclausevoteWhereInputArgument | null | undefined
  }) => Operativeclausevote[],
  paperContentSnapshot: (p: {
    id: ID
  }) => Papercontentsnapshot,
  paperContentSnapshots: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: PapercontentsnapshotOrderInputArgument | null | undefined,
    where?: PapercontentsnapshotWhereInputArgument | null | undefined
  }) => Papercontentsnapshot[],
  paperEditor: (p: {
    id: ID
  }) => Papereditor,
  paperEditors: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: PapereditorOrderInputArgument | null | undefined,
    where?: PapereditorWhereInputArgument | null | undefined
  }) => Papereditor[],
  paperShareCode: (p: {
    id: ID
  }) => Papersharecode,
  paperShareCodes: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: PapersharecodeOrderInputArgument | null | undefined,
    where?: PapersharecodeWhereInputArgument | null | undefined
  }) => Papersharecode[],
  paperSponsor: (p: {
    id: ID
  }) => Papersponsor,
  paperSponsors: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: PapersponsorOrderInputArgument | null | undefined,
    where?: PapersponsorWhereInputArgument | null | undefined
  }) => Papersponsor[],
  presenceChangedTimestamp: (p: {
    id: ID
  }) => Presencechangedtimestamp,
  presenceChangedTimestamps: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: PresencechangedtimestampOrderInputArgument | null | undefined,
    where?: PresencechangedtimestampWhereInputArgument | null | undefined
  }) => Presencechangedtimestamp[],
  representation: (p: {
    id: ID
  }) => Representation,
  representations: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: RepresentationOrderInputArgument | null | undefined,
    where?: RepresentationWhereInputArgument | null | undefined
  }) => Representation[],
  resolutionComment: (p: {
    id: ID
  }) => Resolutioncomment,
  resolutionComments: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: ResolutioncommentOrderInputArgument | null | undefined,
    where?: ResolutioncommentWhereInputArgument | null | undefined
  }) => Resolutioncomment[],
  resolutionPaper: (p: {
    id: ID
  }) => Resolutionpaper,
  resolutionPapers: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: ResolutionpaperOrderInputArgument | null | undefined,
    where?: ResolutionpaperWhereInputArgument | null | undefined
  }) => Resolutionpaper[],
  resolutionVoteResult: (p: {
    id: ID
  }) => Resolutionvoteresult,
  resolutionVoteResults: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: ResolutionvoteresultOrderInputArgument | null | undefined,
    where?: ResolutionvoteresultWhereInputArgument | null | undefined
  }) => Resolutionvoteresult[],
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
  }) => User[]    
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
		
export type Resolutioncomment = {
  author: (p?: {
    orderBy?: ConferenceuserOrderInputArgument | null | undefined,
    where?: ConferenceuserWhereInputArgument | null | undefined
  }) => Conferenceuser,
  authorConferenceUserId: ID,
  clauseId: ID | null,
  content: String,
  createdAt: DateTime,
  id: ID,
  paper: (p?: {
    orderBy?: ResolutionpaperOrderInputArgument | null | undefined,
    where?: ResolutionpaperWhereInputArgument | null | undefined
  }) => Resolutionpaper,
  paperId: ID,
  parentComment: (p?: {
    orderBy?: ResolutioncommentOrderInputArgument | null | undefined,
    where?: ResolutioncommentWhereInputArgument | null | undefined
  }) => Resolutioncomment | null,
  parentCommentId: ID | null,
  replies: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: ResolutioncommentOrderInputArgument | null | undefined,
    where?: ResolutioncommentWhereInputArgument | null | undefined
  }) => Resolutioncomment[],
  updatedAt: DateTime | null,
  visibility: CommentvisibilityEnum    
};
		
export type ResolutioncommentOrderInputArgument = {
  author?: ConferenceuserOrderInputArgument | null | undefined,
  authorConferenceUserId?: SortingParameter | null | undefined,
  clauseId?: SortingParameter | null | undefined,
  content?: SortingParameter | null | undefined,
  createdAt?: SortingParameter | null | undefined,
  id?: SortingParameter | null | undefined,
  paper?: ResolutionpaperOrderInputArgument | null | undefined,
  paperId?: SortingParameter | null | undefined,
  parentComment?: ResolutioncommentOrderInputArgument | null | undefined,
  parentCommentId?: SortingParameter | null | undefined,
  replies?: ResolutioncommentOrderInputArgument | null | undefined,
  updatedAt?: SortingParameter | null | undefined,
  visibility?: SortingParameter | null | undefined    
};
		
export type ResolutioncommentWhereInputArgument = {
  author?: ConferenceuserWhereInputArgument | null | undefined,
  authorConferenceUserId?: ID | null | undefined,
  clauseId?: ID | null | undefined,
  content?: StringWhereInputArgument | null | undefined,
  createdAt?: DateWhereInputArgument | null | undefined,
  id?: ID | null | undefined,
  paper?: ResolutionpaperWhereInputArgument | null | undefined,
  paperId?: ID | null | undefined,
  parentComment?: ResolutioncommentWhereInputArgument | null | undefined,
  parentCommentId?: ID | null | undefined,
  replies?: ResolutioncommentWhereInputArgument | null | undefined,
  updatedAt?: DateWhereInputArgument | null | undefined,
  visibility?: CommentvisibilityEnum | null | undefined    
};
		
export type Resolutionpaper = {
  agendaItem: (p?: {
    orderBy?: AgendaitemOrderInputArgument | null | undefined,
    where?: AgendaitemWhereInputArgument | null | undefined
  }) => Agendaitem,
  agendaItemId: ID,
  amendments: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: AmendmentOrderInputArgument | null | undefined,
    where?: AmendmentWhereInputArgument | null | undefined
  }) => Amendment[],
  comments: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: ResolutioncommentOrderInputArgument | null | undefined,
    where?: ResolutioncommentWhereInputArgument | null | undefined
  }) => Resolutioncomment[],
  committee: (p?: {
    orderBy?: CommitteeOrderInputArgument | null | undefined,
    where?: CommitteeWhereInputArgument | null | undefined
  }) => Committee,
  committeeId: ID,
  content: JSON | null,
  createdAt: DateTime,
  creator: (p?: {
    orderBy?: CommitteememberOrderInputArgument | null | undefined,
    where?: CommitteememberWhereInputArgument | null | undefined
  }) => Committeemember,
  creatorCommitteeMemberId: ID,
  deletedAt: DateTime | null,
  documentNumber: String | null,
  editors: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: PapereditorOrderInputArgument | null | undefined,
    where?: PapereditorWhereInputArgument | null | undefined
  }) => Papereditor[],
  id: ID,
  operativeClauseVotes: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: OperativeclausevoteOrderInputArgument | null | undefined,
    where?: OperativeclausevoteWhereInputArgument | null | undefined
  }) => Operativeclausevote[],
  sequenceNumber: Int | null,
  shareCodes: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: PapersharecodeOrderInputArgument | null | undefined,
    where?: PapersharecodeWhereInputArgument | null | undefined
  }) => Papersharecode[],
  snapshots: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: PapercontentsnapshotOrderInputArgument | null | undefined,
    where?: PapercontentsnapshotWhereInputArgument | null | undefined
  }) => Papercontentsnapshot[],
  sponsors: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: PapersponsorOrderInputArgument | null | undefined,
    where?: PapersponsorWhereInputArgument | null | undefined
  }) => Papersponsor[],
  status: PaperstatusEnum,
  title: String | null,
  updatedAt: DateTime | null,
  voteResult: (p?: {
    orderBy?: ResolutionvoteresultOrderInputArgument | null | undefined,
    where?: ResolutionvoteresultWhereInputArgument | null | undefined
  }) => Resolutionvoteresult | null    
};
		
export type ResolutionpaperOrderInputArgument = {
  agendaItem?: AgendaitemOrderInputArgument | null | undefined,
  agendaItemId?: SortingParameter | null | undefined,
  amendments?: AmendmentOrderInputArgument | null | undefined,
  comments?: ResolutioncommentOrderInputArgument | null | undefined,
  committee?: CommitteeOrderInputArgument | null | undefined,
  committeeId?: SortingParameter | null | undefined,
  content?: SortingParameter | null | undefined,
  createdAt?: SortingParameter | null | undefined,
  creator?: CommitteememberOrderInputArgument | null | undefined,
  creatorCommitteeMemberId?: SortingParameter | null | undefined,
  deletedAt?: SortingParameter | null | undefined,
  documentNumber?: SortingParameter | null | undefined,
  editors?: PapereditorOrderInputArgument | null | undefined,
  id?: SortingParameter | null | undefined,
  operativeClauseVotes?: OperativeclausevoteOrderInputArgument | null | undefined,
  sequenceNumber?: SortingParameter | null | undefined,
  shareCodes?: PapersharecodeOrderInputArgument | null | undefined,
  snapshots?: PapercontentsnapshotOrderInputArgument | null | undefined,
  sponsors?: PapersponsorOrderInputArgument | null | undefined,
  status?: SortingParameter | null | undefined,
  title?: SortingParameter | null | undefined,
  updatedAt?: SortingParameter | null | undefined,
  voteResult?: ResolutionvoteresultOrderInputArgument | null | undefined    
};
		
export type ResolutionpaperWhereInputArgument = {
  agendaItem?: AgendaitemWhereInputArgument | null | undefined,
  agendaItemId?: ID | null | undefined,
  amendments?: AmendmentWhereInputArgument | null | undefined,
  comments?: ResolutioncommentWhereInputArgument | null | undefined,
  committee?: CommitteeWhereInputArgument | null | undefined,
  committeeId?: ID | null | undefined,
  content?: JSON | null | undefined,
  createdAt?: DateWhereInputArgument | null | undefined,
  creator?: CommitteememberWhereInputArgument | null | undefined,
  creatorCommitteeMemberId?: ID | null | undefined,
  deletedAt?: DateWhereInputArgument | null | undefined,
  documentNumber?: StringWhereInputArgument | null | undefined,
  editors?: PapereditorWhereInputArgument | null | undefined,
  id?: ID | null | undefined,
  operativeClauseVotes?: OperativeclausevoteWhereInputArgument | null | undefined,
  sequenceNumber?: IntWhereInputArgument | null | undefined,
  shareCodes?: PapersharecodeWhereInputArgument | null | undefined,
  snapshots?: PapercontentsnapshotWhereInputArgument | null | undefined,
  sponsors?: PapersponsorWhereInputArgument | null | undefined,
  status?: PaperstatusEnum | null | undefined,
  title?: StringWhereInputArgument | null | undefined,
  updatedAt?: DateWhereInputArgument | null | undefined,
  voteResult?: ResolutionvoteresultWhereInputArgument | null | undefined    
};
		
export type Resolutionvoteresult = {
  createdAt: DateTime,
  id: ID,
  outcome: VoteoutcomeEnum,
  paper: (p?: {
    orderBy?: ResolutionpaperOrderInputArgument | null | undefined,
    where?: ResolutionpaperWhereInputArgument | null | undefined
  }) => Resolutionpaper,
  paperId: ID,
  updatedAt: DateTime | null,
  votesAbstain: Int,
  votesAgainst: Int,
  votesFor: Int    
};
		
export type ResolutionvoteresultOrderInputArgument = {
  createdAt?: SortingParameter | null | undefined,
  id?: SortingParameter | null | undefined,
  outcome?: SortingParameter | null | undefined,
  paper?: ResolutionpaperOrderInputArgument | null | undefined,
  paperId?: SortingParameter | null | undefined,
  updatedAt?: SortingParameter | null | undefined,
  votesAbstain?: SortingParameter | null | undefined,
  votesAgainst?: SortingParameter | null | undefined,
  votesFor?: SortingParameter | null | undefined    
};
		
export type ResolutionvoteresultWhereInputArgument = {
  createdAt?: DateWhereInputArgument | null | undefined,
  id?: ID | null | undefined,
  outcome?: VoteoutcomeEnum | null | undefined,
  paper?: ResolutionpaperWhereInputArgument | null | undefined,
  paperId?: ID | null | undefined,
  updatedAt?: DateWhereInputArgument | null | undefined,
  votesAbstain?: IntWhereInputArgument | null | undefined,
  votesAgainst?: IntWhereInputArgument | null | undefined,
  votesFor?: IntWhereInputArgument | null | undefined    
};
		
export type ShareCodeRedemptionResult = {
  paperId: ID,
  permission: String    
};
		
export type SharecodepermissionEnum = "EDIT" | "SPONSOR";
		
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
  type: SpeakerslistcategoryEnum,
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
  type?: SpeakerslistcategoryEnum | null | undefined,
  updatedAt?: DateWhereInputArgument | null | undefined    
};
		
export type SpeakerslistcategoryEnum = "COMMENT_LIST" | "SPEAKERS_LIST";
		
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
  amendment: (p: {
    id: ID
  }) => Amendment,
  amendmentSponsor: (p: {
    id: ID
  }) => Amendmentsponsor,
  amendmentSponsors: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: AmendmentsponsorOrderInputArgument | null | undefined,
    where?: AmendmentsponsorWhereInputArgument | null | undefined
  }) => Amendmentsponsor[],
  amendments: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: AmendmentOrderInputArgument | null | undefined,
    where?: AmendmentWhereInputArgument | null | undefined
  }) => Amendment[],
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
  nsaPresenceEvent: (p: {
    id: ID
  }) => Nsapresenceevent,
  nsaPresenceEvents: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: NsapresenceeventOrderInputArgument | null | undefined,
    where?: NsapresenceeventWhereInputArgument | null | undefined
  }) => Nsapresenceevent[],
  operativeClauseVote: (p: {
    id: ID
  }) => Operativeclausevote,
  operativeClauseVotes: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: OperativeclausevoteOrderInputArgument | null | undefined,
    where?: OperativeclausevoteWhereInputArgument | null | undefined
  }) => Operativeclausevote[],
  paperContentSnapshot: (p: {
    id: ID
  }) => Papercontentsnapshot,
  paperContentSnapshots: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: PapercontentsnapshotOrderInputArgument | null | undefined,
    where?: PapercontentsnapshotWhereInputArgument | null | undefined
  }) => Papercontentsnapshot[],
  paperEditor: (p: {
    id: ID
  }) => Papereditor,
  paperEditors: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: PapereditorOrderInputArgument | null | undefined,
    where?: PapereditorWhereInputArgument | null | undefined
  }) => Papereditor[],
  paperShareCode: (p: {
    id: ID
  }) => Papersharecode,
  paperShareCodes: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: PapersharecodeOrderInputArgument | null | undefined,
    where?: PapersharecodeWhereInputArgument | null | undefined
  }) => Papersharecode[],
  paperSponsor: (p: {
    id: ID
  }) => Papersponsor,
  paperSponsors: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: PapersponsorOrderInputArgument | null | undefined,
    where?: PapersponsorWhereInputArgument | null | undefined
  }) => Papersponsor[],
  presenceChangedTimestamp: (p: {
    id: ID
  }) => Presencechangedtimestamp,
  presenceChangedTimestamps: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: PresencechangedtimestampOrderInputArgument | null | undefined,
    where?: PresencechangedtimestampWhereInputArgument | null | undefined
  }) => Presencechangedtimestamp[],
  representation: (p: {
    id: ID
  }) => Representation,
  representations: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: RepresentationOrderInputArgument | null | undefined,
    where?: RepresentationWhereInputArgument | null | undefined
  }) => Representation[],
  resolutionComment: (p: {
    id: ID
  }) => Resolutioncomment,
  resolutionComments: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: ResolutioncommentOrderInputArgument | null | undefined,
    where?: ResolutioncommentWhereInputArgument | null | undefined
  }) => Resolutioncomment[],
  resolutionPaper: (p: {
    id: ID
  }) => Resolutionpaper,
  resolutionPapers: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: ResolutionpaperOrderInputArgument | null | undefined,
    where?: ResolutionpaperWhereInputArgument | null | undefined
  }) => Resolutionpaper[],
  resolutionVoteResult: (p: {
    id: ID
  }) => Resolutionvoteresult,
  resolutionVoteResults: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: ResolutionvoteresultOrderInputArgument | null | undefined,
    where?: ResolutionvoteresultWhereInputArgument | null | undefined
  }) => Resolutionvoteresult[],
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
  }) => User[]    
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
		
export type VoteoutcomeEnum = "ADOPTED" | "REJECTED" | "SENT_BACK";
		
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
	  availableSubscriptions: new Set(["agendaItem", "agendaItems", "amendment", "amendmentSponsor", "amendmentSponsors", "amendments", "committee", "committeeMember", "committeeMembers", "committees", "conference", "conferenceMember", "conferenceMembers", "conferenceUser", "conferenceUsers", "conferences", "nsaPresenceEvent", "nsaPresenceEvents", "operativeClauseVote", "operativeClauseVotes", "paperContentSnapshot", "paperContentSnapshots", "paperEditor", "paperEditors", "paperShareCode", "paperShareCodes", "paperSponsor", "paperSponsors", "presenceChangedTimestamp", "presenceChangedTimestamps", "representation", "representations", "resolutionComment", "resolutionComments", "resolutionPaper", "resolutionPapers", "resolutionVoteResult", "resolutionVoteResults", "speakerOnList", "speakerOnLists", "speakersList", "speakersLists", "user", "users"]),
		schema,
    autoIncludeIdField: 'id'
  }),
  /**
   * A mutation that can be used to e.g. create, update or delete data.
   */
  mutate: makeMutation<Mutation>({
	  urqlClient,
		schema,
    autoIncludeIdField: 'id'
  }),
  /**
   * A continuous stream of results that updates when the server sends new data.
   */
  subscribe: makeSubscription<Subscription>({
	  urqlClient,
		schema,
    autoIncludeIdField: 'id'
  }),
  /**
   * A one-time fetch of data.
   */
  query: makeQuery<Query>({
	  urqlClient,
		schema,
    autoIncludeIdField: 'id'
  }),
}