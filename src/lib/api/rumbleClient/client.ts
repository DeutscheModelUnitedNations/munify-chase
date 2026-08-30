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
  committeeId?: SortingParameter | null | undefined,
  createdAt?: SortingParameter | null | undefined,
  id?: SortingParameter | null | undefined,
  title?: SortingParameter | null | undefined,
  updatedAt?: SortingParameter | null | undefined    
};
		
export type AgendaitemWhereInputArgument = {
  AND?: AgendaitemWhereInputArgument[] | undefined,
  NOT?: AgendaitemWhereInputArgument | null | undefined,
  OR?: AgendaitemWhereInputArgument[] | undefined,
  committee?: CommitteeWhereInputArgument | null | undefined,
  committeeId?: IDWhereInputArgument | null | undefined,
  createdAt?: DateTimeWhereInputArgument | null | undefined,
  id?: IDWhereInputArgument | null | undefined,
  resolutionPapers?: ResolutionpaperWhereInputArgument | null | undefined,
  speakersList?: SpeakerslistWhereInputArgument | null | undefined,
  title?: StringWhereInputArgument | null | undefined,
  updatedAt?: DateTimeWhereInputArgument | null | undefined    
};
		
export type AiMessageInput = {
  content: String,
  role: AiMessageRole    
};
		
export type AiMessageRole = "assistant" | "system" | "user";
		
export type AiResponseType = "json" | "text";
		
export type Amendment = {
  createdAt: DateTime,
  documentNumber: String | null,
  id: ID,
  newContent: String | null,
  obsoletedByAmendmentId: ID | null,
  oldContent: String | null,
  paper: (p?: {
    orderBy?: ResolutionpaperOrderInputArgument | null | undefined,
    where?: ResolutionpaperWhereInputArgument | null | undefined
  }) => Resolutionpaper,
  paperId: ID,
  presentedAt: DateTime | null,
  proposer: (p?: {
    orderBy?: CommitteememberOrderInputArgument | null | undefined,
    where?: CommitteememberWhereInputArgument | null | undefined
  }) => Committeemember,
  proposerCommitteeMemberId: ID,
  reviewItemsAsSubject: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: AmendmentreviewitemOrderInputArgument | null | undefined,
    where?: AmendmentreviewitemWhereInputArgument | null | undefined
  }) => Amendmentreviewitem[],
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
		
export type AmendmentCountStats = {
  accepted: Int,
  alpha2Code: String | null,
  representationId: String,
  representationName: String | null,
  total: Int    
};
		
export type AmendmentOrderInputArgument = {
  createdAt?: SortingParameter | null | undefined,
  documentNumber?: SortingParameter | null | undefined,
  id?: SortingParameter | null | undefined,
  newContent?: SortingParameter | null | undefined,
  obsoletedByAmendmentId?: SortingParameter | null | undefined,
  oldContent?: SortingParameter | null | undefined,
  paperId?: SortingParameter | null | undefined,
  presentedAt?: SortingParameter | null | undefined,
  proposerCommitteeMemberId?: SortingParameter | null | undefined,
  status?: SortingParameter | null | undefined,
  targetClauseId?: SortingParameter | null | undefined,
  targetOperativeIndex?: SortingParameter | null | undefined,
  targetPosition?: SortingParameter | null | undefined,
  type?: SortingParameter | null | undefined,
  updatedAt?: SortingParameter | null | undefined    
};
		
export type AmendmentWhereInputArgument = {
  AND?: AmendmentWhereInputArgument[] | undefined,
  NOT?: AmendmentWhereInputArgument | null | undefined,
  OR?: AmendmentWhereInputArgument[] | undefined,
  createdAt?: DateTimeWhereInputArgument | null | undefined,
  documentNumber?: StringWhereInputArgument | null | undefined,
  id?: IDWhereInputArgument | null | undefined,
  newContent?: StringWhereInputArgument | null | undefined,
  obsoletedByAmendmentId?: IDWhereInputArgument | null | undefined,
  oldContent?: StringWhereInputArgument | null | undefined,
  paper?: ResolutionpaperWhereInputArgument | null | undefined,
  paperId?: IDWhereInputArgument | null | undefined,
  presentedAt?: DateTimeWhereInputArgument | null | undefined,
  proposer?: CommitteememberWhereInputArgument | null | undefined,
  proposerCommitteeMemberId?: IDWhereInputArgument | null | undefined,
  reviewItemsAsSubject?: AmendmentreviewitemWhereInputArgument | null | undefined,
  sponsors?: AmendmentsponsorWhereInputArgument | null | undefined,
  status?: AmendmentstatusEnum | null | undefined,
  targetClauseId?: IDWhereInputArgument | null | undefined,
  targetOperativeIndex?: IntWhereInputArgument | null | undefined,
  targetPosition?: IntWhereInputArgument | null | undefined,
  type?: AmendmenttypeEnum | null | undefined,
  updatedAt?: DateTimeWhereInputArgument | null | undefined    
};
		
export type Amendmentreviewitem = {
  aiObsolete: Boolean | null,
  aiObsoleteReason: String | null,
  aiRewriteReason: String | null,
  aiRewriteSuggestion: String | null,
  createdAt: DateTime,
  id: ID,
  paper: (p?: {
    orderBy?: ResolutionpaperOrderInputArgument | null | undefined,
    where?: ResolutionpaperWhereInputArgument | null | undefined
  }) => Resolutionpaper,
  paperId: ID,
  phase: AmendmentreviewphaseEnum,
  subjectAmendment: (p?: {
    orderBy?: AmendmentOrderInputArgument | null | undefined,
    where?: AmendmentWhereInputArgument | null | undefined
  }) => Amendment,
  subjectAmendmentId: ID,
  triggerAmendment: (p?: {
    orderBy?: AmendmentOrderInputArgument | null | undefined,
    where?: AmendmentWhereInputArgument | null | undefined
  }) => Amendment,
  triggerAmendmentId: ID,
  updatedAt: DateTime | null,
  verdictObsolete: Boolean | null,
  verdictRewrite: String | null    
};
		
export type AmendmentreviewitemOrderInputArgument = {
  aiObsolete?: SortingParameter | null | undefined,
  aiObsoleteReason?: SortingParameter | null | undefined,
  aiRewriteReason?: SortingParameter | null | undefined,
  aiRewriteSuggestion?: SortingParameter | null | undefined,
  createdAt?: SortingParameter | null | undefined,
  id?: SortingParameter | null | undefined,
  paperId?: SortingParameter | null | undefined,
  phase?: SortingParameter | null | undefined,
  subjectAmendmentId?: SortingParameter | null | undefined,
  triggerAmendmentId?: SortingParameter | null | undefined,
  updatedAt?: SortingParameter | null | undefined,
  verdictObsolete?: SortingParameter | null | undefined,
  verdictRewrite?: SortingParameter | null | undefined    
};
		
export type AmendmentreviewitemWhereInputArgument = {
  AND?: AmendmentreviewitemWhereInputArgument[] | undefined,
  NOT?: AmendmentreviewitemWhereInputArgument | null | undefined,
  OR?: AmendmentreviewitemWhereInputArgument[] | undefined,
  aiObsolete?: BooleanWhereInputArgument | null | undefined,
  aiObsoleteReason?: StringWhereInputArgument | null | undefined,
  aiRewriteReason?: StringWhereInputArgument | null | undefined,
  aiRewriteSuggestion?: StringWhereInputArgument | null | undefined,
  createdAt?: DateTimeWhereInputArgument | null | undefined,
  id?: IDWhereInputArgument | null | undefined,
  paper?: ResolutionpaperWhereInputArgument | null | undefined,
  paperId?: IDWhereInputArgument | null | undefined,
  phase?: AmendmentreviewphaseEnum | null | undefined,
  subjectAmendment?: AmendmentWhereInputArgument | null | undefined,
  subjectAmendmentId?: IDWhereInputArgument | null | undefined,
  triggerAmendment?: AmendmentWhereInputArgument | null | undefined,
  triggerAmendmentId?: IDWhereInputArgument | null | undefined,
  updatedAt?: DateTimeWhereInputArgument | null | undefined,
  verdictObsolete?: BooleanWhereInputArgument | null | undefined,
  verdictRewrite?: StringWhereInputArgument | null | undefined    
};
		
export type AmendmentreviewphaseEnum = "OBSOLESCENCE" | "RESOLVED" | "REWRITE";
		
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
  amendmentId?: SortingParameter | null | undefined,
  committeeMemberId?: SortingParameter | null | undefined,
  createdAt?: SortingParameter | null | undefined,
  id?: SortingParameter | null | undefined,
  updatedAt?: SortingParameter | null | undefined    
};
		
export type AmendmentsponsorWhereInputArgument = {
  AND?: AmendmentsponsorWhereInputArgument[] | undefined,
  NOT?: AmendmentsponsorWhereInputArgument | null | undefined,
  OR?: AmendmentsponsorWhereInputArgument[] | undefined,
  amendment?: AmendmentWhereInputArgument | null | undefined,
  amendmentId?: IDWhereInputArgument | null | undefined,
  committeeMember?: CommitteememberWhereInputArgument | null | undefined,
  committeeMemberId?: IDWhereInputArgument | null | undefined,
  createdAt?: DateTimeWhereInputArgument | null | undefined,
  id?: IDWhereInputArgument | null | undefined,
  updatedAt?: DateTimeWhereInputArgument | null | undefined    
};
		
export type AmendmentstatusEnum = "ACCEPTED" | "CONSENSUS_ADOPTED" | "PENDING" | "REJECTED" | "SUBMITTED" | "WITHDRAWN";
		
export type AmendmenttypeEnum = "ADD" | "ALTER_POSITION" | "ALTER_TEXT" | "DELETE";
		
export type AttendanceTrendPoint = {
  date: String,
  uniqueUsersPresent: Int    
};
		
export type BigInt = unknown;
		
export type BigIntWhereInputArgument = {
  AND?: BigIntWhereInputArgument[] | undefined,
  NOT?: BigIntWhereInputArgument | null | undefined,
  OR?: BigIntWhereInputArgument[] | undefined,
  eq?: BigInt | null | undefined,
  gt?: BigInt | null | undefined,
  gte?: BigInt | null | undefined,
  in?: BigInt[] | undefined,
  isNotNull?: Boolean | null | undefined,
  isNull?: Boolean | null | undefined,
  lt?: BigInt | null | undefined,
  lte?: BigInt | null | undefined,
  ne?: BigInt | null | undefined,
  notIn?: BigInt[] | undefined    
};
		
export type Boolean = boolean;
		
export type BooleanWhereInputArgument = {
  AND?: BooleanWhereInputArgument[] | undefined,
  NOT?: BooleanWhereInputArgument | null | undefined,
  OR?: BooleanWhereInputArgument[] | undefined,
  arrayContained?: Boolean[] | undefined,
  arrayContains?: Boolean[] | undefined,
  arrayOverlaps?: Boolean[] | undefined,
  eq?: Boolean | null | undefined,
  in?: Boolean[] | undefined,
  isNotNull?: Boolean | null | undefined,
  isNull?: Boolean | null | undefined,
  ne?: Boolean | null | undefined,
  notIn?: Boolean[] | undefined    
};
		
export type Bytes = unknown;
		
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
  activeRollCallSession: (p?: {
    orderBy?: RollcallsessionOrderInputArgument | null | undefined,
    where?: RollcallsessionWhereInputArgument | null | undefined
  }) => Rollcallsession | null,
  activeRollCallSessionId: ID | null,
  activeVotingSession: (p?: {
    orderBy?: VotingsessionOrderInputArgument | null | undefined,
    where?: VotingsessionWhereInputArgument | null | undefined
  }) => Votingsession | null,
  activeVotingSessionId: ID | null,
  agendaItems: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: AgendaitemOrderInputArgument | null | undefined,
    where?: AgendaitemWhereInputArgument | null | undefined
  }) => Agendaitem[],
  allowDelegationsToAddThemselvesToSpeakersList: Boolean,
  allowRequests: Boolean,
  amendmentSponsoringOpen: Boolean,
  amendmentSubmissionOpen: Boolean,
  conference: (p?: {
    orderBy?: ConferenceOrderInputArgument | null | undefined,
    where?: ConferenceWhereInputArgument | null | undefined
  }) => Conference | null,
  conferenceId: ID,
  createdAt: DateTime,
  currentOperativeIndex: Int,
  customSimpleMajority: Int | null,
  customTwoThirdsMajority: Int | null,
  displayRegionalGroups: Boolean,
  id: ID,
  lastResolutionAdoptionDate: DateTime | null,
  members: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: CommitteememberOrderInputArgument | null | undefined,
    where?: CommitteememberWhereInputArgument | null | undefined
  }) => Committeemember[],
  name: String,
  paperSupportThreshold: Int,
  presenceEvents: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: PresenceeventOrderInputArgument | null | undefined,
    where?: PresenceeventWhereInputArgument | null | undefined
  }) => Presenceevent[],
  presentationLayout: String,
  presentationResolutionFontSize: Int,
  presentationRootFontSize: Int,
  requests: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: RequestOrderInputArgument | null | undefined,
    where?: RequestWhereInputArgument | null | undefined
  }) => Request[],
  resolutionPapers: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: ResolutionpaperOrderInputArgument | null | undefined,
    where?: ResolutionpaperWhereInputArgument | null | undefined
  }) => Resolutionpaper[],
  rollCallSessions: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: RollcallsessionOrderInputArgument | null | undefined,
    where?: RollcallsessionWhereInputArgument | null | undefined
  }) => Rollcallsession[],
  showWhiteboard: Boolean,
  simpleMajority: Int,
  stateOfDebate: String | null,
  status: CommitteestatusEnum,
  statusHeadline: String,
  statusUntil: DateTime,
  supportReevaluationOpen: Boolean,
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
		
export type CommitteeActivityStats = {
  committeeAbbreviation: String,
  committeeId: String,
  committeeName: String,
  speechCount: Int,
  totalSpeakingSeconds: Int,
  voteCount: Int    
};
		
export type CommitteeOrderInputArgument = {
  abbreviation?: SortingParameter | null | undefined,
  activeAgendaItemId?: SortingParameter | null | undefined,
  activeAmendmentId?: SortingParameter | null | undefined,
  activeDraftResolutionId?: SortingParameter | null | undefined,
  activeRollCallSessionId?: SortingParameter | null | undefined,
  activeVotingSessionId?: SortingParameter | null | undefined,
  allowDelegationsToAddThemselvesToSpeakersList?: SortingParameter | null | undefined,
  allowRequests?: SortingParameter | null | undefined,
  amendmentSponsoringOpen?: SortingParameter | null | undefined,
  amendmentSubmissionOpen?: SortingParameter | null | undefined,
  conferenceId?: SortingParameter | null | undefined,
  createdAt?: SortingParameter | null | undefined,
  currentOperativeIndex?: SortingParameter | null | undefined,
  customSimpleMajority?: SortingParameter | null | undefined,
  customTwoThirdsMajority?: SortingParameter | null | undefined,
  displayRegionalGroups?: SortingParameter | null | undefined,
  id?: SortingParameter | null | undefined,
  lastResolutionAdoptionDate?: SortingParameter | null | undefined,
  name?: SortingParameter | null | undefined,
  paperSupportThreshold?: SortingParameter | null | undefined,
  presentationLayout?: SortingParameter | null | undefined,
  presentationResolutionFontSize?: SortingParameter | null | undefined,
  presentationRootFontSize?: SortingParameter | null | undefined,
  showWhiteboard?: SortingParameter | null | undefined,
  stateOfDebate?: SortingParameter | null | undefined,
  status?: SortingParameter | null | undefined,
  statusHeadline?: SortingParameter | null | undefined,
  statusUntil?: SortingParameter | null | undefined,
  supportReevaluationOpen?: SortingParameter | null | undefined,
  updatedAt?: SortingParameter | null | undefined,
  whiteboardContent?: SortingParameter | null | undefined    
};
		
export type CommitteeWhereInputArgument = {
  AND?: CommitteeWhereInputArgument[] | undefined,
  NOT?: CommitteeWhereInputArgument | null | undefined,
  OR?: CommitteeWhereInputArgument[] | undefined,
  abbreviation?: StringWhereInputArgument | null | undefined,
  activeAgendaItem?: AgendaitemWhereInputArgument | null | undefined,
  activeAgendaItemId?: IDWhereInputArgument | null | undefined,
  activeAmendment?: AmendmentWhereInputArgument | null | undefined,
  activeAmendmentId?: IDWhereInputArgument | null | undefined,
  activeDraftResolution?: ResolutionpaperWhereInputArgument | null | undefined,
  activeDraftResolutionId?: IDWhereInputArgument | null | undefined,
  activeRollCallSession?: RollcallsessionWhereInputArgument | null | undefined,
  activeRollCallSessionId?: IDWhereInputArgument | null | undefined,
  activeVotingSession?: VotingsessionWhereInputArgument | null | undefined,
  activeVotingSessionId?: IDWhereInputArgument | null | undefined,
  agendaItems?: AgendaitemWhereInputArgument | null | undefined,
  allowDelegationsToAddThemselvesToSpeakersList?: BooleanWhereInputArgument | null | undefined,
  allowRequests?: BooleanWhereInputArgument | null | undefined,
  amendmentSponsoringOpen?: BooleanWhereInputArgument | null | undefined,
  amendmentSubmissionOpen?: BooleanWhereInputArgument | null | undefined,
  conference?: ConferenceWhereInputArgument | null | undefined,
  conferenceId?: IDWhereInputArgument | null | undefined,
  createdAt?: DateTimeWhereInputArgument | null | undefined,
  currentOperativeIndex?: IntWhereInputArgument | null | undefined,
  customSimpleMajority?: IntWhereInputArgument | null | undefined,
  customTwoThirdsMajority?: IntWhereInputArgument | null | undefined,
  displayRegionalGroups?: BooleanWhereInputArgument | null | undefined,
  id?: IDWhereInputArgument | null | undefined,
  lastResolutionAdoptionDate?: DateTimeWhereInputArgument | null | undefined,
  members?: CommitteememberWhereInputArgument | null | undefined,
  name?: StringWhereInputArgument | null | undefined,
  paperSupportThreshold?: IntWhereInputArgument | null | undefined,
  presenceEvents?: PresenceeventWhereInputArgument | null | undefined,
  presentationLayout?: StringWhereInputArgument | null | undefined,
  presentationResolutionFontSize?: IntWhereInputArgument | null | undefined,
  presentationRootFontSize?: IntWhereInputArgument | null | undefined,
  requests?: RequestWhereInputArgument | null | undefined,
  resolutionPapers?: ResolutionpaperWhereInputArgument | null | undefined,
  rollCallSessions?: RollcallsessionWhereInputArgument | null | undefined,
  showWhiteboard?: BooleanWhereInputArgument | null | undefined,
  stateOfDebate?: StringWhereInputArgument | null | undefined,
  status?: CommitteestatusEnum | null | undefined,
  statusHeadline?: StringWhereInputArgument | null | undefined,
  statusUntil?: DateTimeWhereInputArgument | null | undefined,
  supportReevaluationOpen?: BooleanWhereInputArgument | null | undefined,
  updatedAt?: DateTimeWhereInputArgument | null | undefined,
  votingSessions?: VotingsessionWhereInputArgument | null | undefined,
  whiteboardContent?: StringWhereInputArgument | null | undefined    
};
		
export type Committeemember = {
  amendmentSponsorships: (p?: {
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
  paperSponsorships: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: PapersponsorOrderInputArgument | null | undefined,
    where?: PapersponsorWhereInputArgument | null | undefined
  }) => Papersponsor[],
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
  }) => Conferenceuser[],
  votingVotes: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: VotingvoteOrderInputArgument | null | undefined,
    where?: VotingvoteWhereInputArgument | null | undefined
  }) => Votingvote[]    
};
		
export type CommitteememberOrderInputArgument = {
  committeeId?: SortingParameter | null | undefined,
  createdAt?: SortingParameter | null | undefined,
  id?: SortingParameter | null | undefined,
  present?: SortingParameter | null | undefined,
  representationId?: SortingParameter | null | undefined,
  updatedAt?: SortingParameter | null | undefined    
};
		
export type CommitteememberWhereInputArgument = {
  AND?: CommitteememberWhereInputArgument[] | undefined,
  NOT?: CommitteememberWhereInputArgument | null | undefined,
  OR?: CommitteememberWhereInputArgument[] | undefined,
  amendmentSponsorships?: AmendmentsponsorWhereInputArgument | null | undefined,
  committee?: CommitteeWhereInputArgument | null | undefined,
  committeeId?: IDWhereInputArgument | null | undefined,
  createdAt?: DateTimeWhereInputArgument | null | undefined,
  createdPapers?: ResolutionpaperWhereInputArgument | null | undefined,
  id?: IDWhereInputArgument | null | undefined,
  paperSponsorships?: PapersponsorWhereInputArgument | null | undefined,
  present?: BooleanWhereInputArgument | null | undefined,
  proposedAmendments?: AmendmentWhereInputArgument | null | undefined,
  representation?: RepresentationWhereInputArgument | null | undefined,
  representationId?: IDWhereInputArgument | null | undefined,
  updatedAt?: DateTimeWhereInputArgument | null | undefined,
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
  requestTypes: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: RequesttypeOrderInputArgument | null | undefined,
    where?: RequesttypeWhereInputArgument | null | undefined
  }) => Requesttype[],
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
  createdAt?: SortingParameter | null | undefined,
  endDate?: SortingParameter | null | undefined,
  hasModeratedCaucus?: SortingParameter | null | undefined,
  id?: SortingParameter | null | undefined,
  location?: SortingParameter | null | undefined,
  logoSvg?: SortingParameter | null | undefined,
  pressWebsite?: SortingParameter | null | undefined,
  startDate?: SortingParameter | null | undefined,
  title?: SortingParameter | null | undefined,
  updatedAt?: SortingParameter | null | undefined    
};
		
export type ConferenceStats = {
  amendmentSuccessRate: () => AmendmentCountStats[],
  attendanceTrend: () => AttendanceTrendPoint[],
  commentLeaderboard: () => DelegationSpeakingStats[],
  committeeActivity: () => CommitteeActivityStats[],
  mostContrarian: () => ContraryStats[],
  nsaLeaderboard: () => DelegationSpeakingStats[],
  paperSponsorLeaderboard: () => PaperSponsorStats[],
  speakingByRegion: () => RegionalStats[],
  speakingFairness: () => SpeakingFairness,
  speakingLeaderboard: () => DelegationSpeakingStats[],
  speakingTimeline: () => SpeakingTimelineBucket[],
  votingAlignment: () => VotingAlignmentStats[]    
};
		
export type ConferenceWhereInputArgument = {
  AND?: ConferenceWhereInputArgument[] | undefined,
  NOT?: ConferenceWhereInputArgument | null | undefined,
  OR?: ConferenceWhereInputArgument[] | undefined,
  committees?: CommitteeWhereInputArgument | null | undefined,
  createdAt?: DateTimeWhereInputArgument | null | undefined,
  endDate?: DateWhereInputArgument | null | undefined,
  hasModeratedCaucus?: BooleanWhereInputArgument | null | undefined,
  id?: IDWhereInputArgument | null | undefined,
  location?: StringWhereInputArgument | null | undefined,
  logoSvg?: StringWhereInputArgument | null | undefined,
  members?: ConferencememberWhereInputArgument | null | undefined,
  pressWebsite?: StringWhereInputArgument | null | undefined,
  representations?: RepresentationWhereInputArgument | null | undefined,
  requestTypes?: RequesttypeWhereInputArgument | null | undefined,
  startDate?: DateWhereInputArgument | null | undefined,
  title?: StringWhereInputArgument | null | undefined,
  updatedAt?: DateTimeWhereInputArgument | null | undefined,
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
  conferenceId?: SortingParameter | null | undefined,
  createdAt?: SortingParameter | null | undefined,
  id?: SortingParameter | null | undefined,
  representationId?: SortingParameter | null | undefined,
  updatedAt?: SortingParameter | null | undefined    
};
		
export type ConferencememberWhereInputArgument = {
  AND?: ConferencememberWhereInputArgument[] | undefined,
  NOT?: ConferencememberWhereInputArgument | null | undefined,
  OR?: ConferencememberWhereInputArgument[] | undefined,
  conference?: ConferenceWhereInputArgument | null | undefined,
  conferenceId?: IDWhereInputArgument | null | undefined,
  createdAt?: DateTimeWhereInputArgument | null | undefined,
  id?: IDWhereInputArgument | null | undefined,
  representation?: RepresentationWhereInputArgument | null | undefined,
  representationId?: IDWhereInputArgument | null | undefined,
  speakerOnList?: SpeakeronlistWhereInputArgument | null | undefined,
  updatedAt?: DateTimeWhereInputArgument | null | undefined,
  users?: ConferenceuserWhereInputArgument | null | undefined    
};
		
export type Conferenceuser = {
  attendanceCode: String | null,
  authoredComments: (p?: {
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
  paperEditorships: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: PapereditorOrderInputArgument | null | undefined,
    where?: PapereditorWhereInputArgument | null | undefined
  }) => Papereditor[],
  presenceEvents: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: PresenceeventOrderInputArgument | null | undefined,
    where?: PresenceeventWhereInputArgument | null | undefined
  }) => Presenceevent[],
  requests: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: RequestOrderInputArgument | null | undefined,
    where?: RequestWhereInputArgument | null | undefined
  }) => Request[],
  resolvedRequests: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: RequestOrderInputArgument | null | undefined,
    where?: RequestWhereInputArgument | null | undefined
  }) => Request[],
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
  committeeMemberId?: SortingParameter | null | undefined,
  conferenceId?: SortingParameter | null | undefined,
  conferenceMemberId?: SortingParameter | null | undefined,
  conferenceUserType?: SortingParameter | null | undefined,
  createdAt?: SortingParameter | null | undefined,
  id?: SortingParameter | null | undefined,
  name?: SortingParameter | null | undefined,
  updatedAt?: SortingParameter | null | undefined,
  userEmail?: SortingParameter | null | undefined    
};
		
export type ConferenceuserWhereInputArgument = {
  AND?: ConferenceuserWhereInputArgument[] | undefined,
  NOT?: ConferenceuserWhereInputArgument | null | undefined,
  OR?: ConferenceuserWhereInputArgument[] | undefined,
  attendanceCode?: StringWhereInputArgument | null | undefined,
  authoredComments?: ResolutioncommentWhereInputArgument | null | undefined,
  committeeMember?: CommitteememberWhereInputArgument | null | undefined,
  committeeMemberId?: IDWhereInputArgument | null | undefined,
  conference?: ConferenceWhereInputArgument | null | undefined,
  conferenceId?: IDWhereInputArgument | null | undefined,
  conferenceMember?: ConferencememberWhereInputArgument | null | undefined,
  conferenceMemberId?: IDWhereInputArgument | null | undefined,
  conferenceUserType?: ConferenceusertypeEnum | null | undefined,
  createdAt?: DateTimeWhereInputArgument | null | undefined,
  id?: IDWhereInputArgument | null | undefined,
  name?: StringWhereInputArgument | null | undefined,
  paperEditorships?: PapereditorWhereInputArgument | null | undefined,
  presenceEvents?: PresenceeventWhereInputArgument | null | undefined,
  requests?: RequestWhereInputArgument | null | undefined,
  resolvedRequests?: RequestWhereInputArgument | null | undefined,
  triggeredPresenceEvents?: PresenceeventWhereInputArgument | null | undefined,
  updatedAt?: DateTimeWhereInputArgument | null | undefined,
  user?: UserWhereInputArgument | null | undefined,
  userEmail?: StringWhereInputArgument | null | undefined    
};
		
export type ConferenceusertypeEnum = "ADMIN" | "DELEGATE" | "NON_STATE_ACTOR" | "SPECTATOR" | "TEAM";
		
export type ContraryStats = {
  alpha2Code: String | null,
  contraryVotes: Int,
  representationId: String,
  representationName: String | null,
  totalVotes: Int    
};
		
export type DateTime = Date;
		
export type DateTimeWhereInputArgument = {
  AND?: DateTimeWhereInputArgument[] | undefined,
  NOT?: DateTimeWhereInputArgument | null | undefined,
  OR?: DateTimeWhereInputArgument[] | undefined,
  arrayContained?: DateTime[] | undefined,
  arrayContains?: DateTime[] | undefined,
  arrayOverlaps?: DateTime[] | undefined,
  eq?: DateTime | null | undefined,
  gt?: DateTime | null | undefined,
  gte?: DateTime | null | undefined,
  in?: DateTime[] | undefined,
  isNotNull?: Boolean | null | undefined,
  isNull?: Boolean | null | undefined,
  lt?: DateTime | null | undefined,
  lte?: DateTime | null | undefined,
  ne?: DateTime | null | undefined,
  notIn?: DateTime[] | undefined    
};
		
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
		
export type DelegationSpeakingStats = {
  alpha2Code: String | null,
  commentCount: Int,
  regionalGroup: String | null,
  representationId: String,
  representationName: String | null,
  representationType: String | null,
  speechCount: Int,
  totalSeconds: Int    
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
		
export type IDWhereInputArgument = {
  AND?: IDWhereInputArgument[] | undefined,
  NOT?: IDWhereInputArgument | null | undefined,
  OR?: IDWhereInputArgument[] | undefined,
  arrayContained?: ID[] | undefined,
  arrayContains?: ID[] | undefined,
  arrayOverlaps?: ID[] | undefined,
  eq?: ID | null | undefined,
  gt?: ID | null | undefined,
  gte?: ID | null | undefined,
  ilike?: String | null | undefined,
  in?: ID[] | undefined,
  isNotNull?: Boolean | null | undefined,
  isNull?: Boolean | null | undefined,
  like?: String | null | undefined,
  lt?: ID | null | undefined,
  lte?: ID | null | undefined,
  ne?: ID | null | undefined,
  notIlike?: String | null | undefined,
  notIn?: ID[] | undefined,
  notLike?: String | null | undefined    
};
		
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
  requestTypes?: ImportDataRequestType[] | undefined,
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
		
export type ImportDataRequestType = {
  enabled?: Boolean | null | undefined,
  faIcon?: String | null | undefined,
  id?: ID | null | undefined,
  name: String    
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
		
export type JSONWhereInputArgument = {
  AND?: JSONWhereInputArgument[] | undefined,
  NOT?: JSONWhereInputArgument | null | undefined,
  OR?: JSONWhereInputArgument[] | undefined,
  arrayContained?: JSON[] | undefined,
  arrayContains?: JSON[] | undefined,
  arrayOverlaps?: JSON[] | undefined,
  eq?: JSON | null | undefined,
  in?: JSON[] | undefined,
  isNotNull?: Boolean | null | undefined,
  isNull?: Boolean | null | undefined,
  ne?: JSON | null | undefined,
  notIn?: JSON[] | undefined    
};
		
export type Mutation = {
  acceptAmendment: (p: {
    consensus?: Boolean | null | undefined,
    id: ID
  }) => Amendment,
  addAmendmentSponsor: (p: {
    amendmentId: ID,
    committeeMemberId?: ID | null | undefined,
    id?: ID | null | undefined
  }) => Amendmentsponsor,
  addPaperEditor: (p: {
    conferenceUserId: ID,
    id?: ID | null | undefined,
    paperId: ID
  }) => Papereditor,
  addPaperSponsor: (p: {
    committeeMemberId?: ID | null | undefined,
    id?: ID | null | undefined,
    paperId: ID
  }) => Papersponsor,
  addSpeakerOnList: (p: {
    committeeMemberId?: ID | null | undefined,
    conferenceMemberId?: ID | null | undefined,
    id?: ID | null | undefined,
    position?: Int | null | undefined,
    speakersListId: ID
  }) => Speakeronlist,
  castDeviceVote: (p: {
    committeeMemberId?: ID | null | undefined,
    id?: ID | null | undefined,
    sessionId: ID,
    vote: VotechoiceEnum
  }) => Votingvote,
  clearSpeakersList: (p: {
    id: ID
  }) => Speakerslist,
  completeRollCallSession: (p: {
    id: ID
  }) => Boolean,
  completeVotingSession: (p: {
    id: ID,
    outcome?: VotingoutcomeEnum | null | undefined
  }) => Boolean,
  concludeResolutionPaperVote: (p: {
    paperId: ID,
    votingSessionId: ID
  }) => Resolutionpaper,
  createAgendaItem: (p: {
    commentListId?: ID | null | undefined,
    committeeId: ID,
    id?: ID | null | undefined,
    speakersListId?: ID | null | undefined,
    title: String
  }) => Agendaitem,
  createAmendment: (p: {
    id?: ID | null | undefined,
    newContent?: String | null | undefined,
    paperId: ID,
    proposerCommitteeMemberId?: ID | null | undefined,
    status?: AmendmentstatusEnum | null | undefined,
    targetClauseId?: String | null | undefined,
    targetOperativeIndex?: Int | null | undefined,
    targetPosition?: Int | null | undefined,
    type: AmendmenttypeEnum
  }) => Amendment,
  createCommittee: (p: {
    abbreviation: String,
    conferenceId: ID,
    id?: ID | null | undefined,
    name: String
  }) => Committee,
  createCommitteeMember: (p: {
    committeeId: ID,
    id?: ID | null | undefined,
    representationId: ID
  }) => Committeemember,
  createConferenceMember: (p: {
    conferenceId: ID,
    id?: ID | null | undefined,
    representationId: ID
  }) => Conferencemember,
  createConferenceUser: (p: {
    conferenceId: ID,
    conferenceUserType: ConferenceusertypeEnum,
    id?: ID | null | undefined,
    name?: String | null | undefined,
    userEmail: String
  }) => Conferenceuser,
  createManualSnapshot: (p: {
    id?: ID | null | undefined,
    paperId: ID
  }) => Papercontentsnapshot,
  createPaperShareCode: (p: {
    id?: ID | null | undefined,
    paperId: ID,
    permission: SharecodepermissionEnum
  }) => Papersharecode,
  createRepresentation: (p: {
    alpha2Code?: String | null | undefined,
    alpha3Code?: String | null | undefined,
    conferenceId: ID,
    faIcon?: String | null | undefined,
    id?: ID | null | undefined,
    name?: String | null | undefined,
    type: RepresentationtypeEnum
  }) => Representation,
  createRequest: (p: {
    committeeId: ID,
    id?: ID | null | undefined,
    requestTypeId: ID
  }) => Request,
  createRequestType: (p: {
    conferenceId: ID,
    faIcon?: String | null | undefined,
    id?: ID | null | undefined,
    name: String
  }) => Requesttype,
  createResolutionComment: (p: {
    clauseId?: String | null | undefined,
    content: String,
    id?: ID | null | undefined,
    paperId: ID,
    parentCommentId?: ID | null | undefined,
    visibility?: CommentvisibilityEnum | null | undefined
  }) => Resolutioncomment,
  createResolutionPaper: (p: {
    agendaItemId: ID,
    committeeId: ID,
    creatorCommitteeMemberId?: ID | null | undefined,
    id?: ID | null | undefined,
    status?: PaperstatusEnum | null | undefined,
    title?: String | null | undefined
  }) => Resolutionpaper,
  deleteAmendment: (p: {
    id: ID
  }) => Boolean,
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
  deletePaperShareCode: (p: {
    id: ID
  }) => Boolean,
  deletePresenceEvent: (p: {
    id: ID
  }) => Presenceevent,
  deleteRepresentation: (p: {
    id: ID
  }) => Boolean,
  deleteRequestType: (p: {
    id: ID
  }) => Boolean,
  deleteResolutionComment: (p: {
    id: ID
  }) => Boolean,
  deleteResolutionPaper: (p: {
    id: ID
  }) => Boolean,
  importDelegatorConference: (p: {
    data: ImportData
  }) => Conference,
  insertPresenceEvent: (p: {
    committeeId: ID,
    conferenceUserId: ID,
    id?: ID | null | undefined,
    markerType?: PresenceeventmarkerEnum | null | undefined,
    note?: String | null | undefined,
    present: Boolean,
    timestamp?: DateTime | null | undefined
  }) => Presenceevent,
  linkOperativeClauseVote: (p: {
    clauseId: String,
    id?: ID | null | undefined,
    paperId: ID,
    votingSessionId: ID
  }) => Operativeclausevote,
  moveSpeakerToPosition: (p: {
    id: ID,
    position: Int
  }) => Speakeronlist,
  recordNsaCheckIn: (p: {
    code: String,
    committeeId: ID,
    id?: ID | null | undefined
  }) => Presenceevent,
  recordNsaCheckOut: (p: {
    code: String,
    committeeId: ID,
    id?: ID | null | undefined
  }) => Presenceevent,
  redeemPaperShareCode: (p: {
    code: String
  }) => Boolean,
  regenerateNsaAttendanceCode: (p: {
    conferenceUserId: ID
  }) => Conferenceuser,
  rejectAmendment: (p: {
    id: ID
  }) => Amendment,
  removeAmendmentSponsor: (p: {
    id: ID
  }) => Boolean,
  removePaperEditor: (p: {
    id: ID
  }) => Boolean,
  removePaperSponsor: (p: {
    id: ID
  }) => Boolean,
  removeSpeakerOnList: (p: {
    speakerOnListId: ID
  }) => Speakerslist,
  resolveRequest: (p: {
    id: ID
  }) => Request,
  restorePaperFromSnapshot: (p: {
    snapshotId: ID
  }) => Papercontentsnapshot,
  selfAddToSpeakersList: (p: {
    id?: ID | null | undefined,
    speakersListId: ID
  }) => Speakeronlist,
  selfRemoveFromSpeakersList: (p: {
    speakersListId: ID
  }) => Speakerslist,
  setActiveAmendment: (p: {
    amendmentId?: ID | null | undefined,
    committeeId: ID
  }) => Committee,
  setActiveDraftResolution: (p: {
    committeeId: ID,
    paperId?: ID | null | undefined
  }) => Committee,
  setCommitteeResolutionToggles: (p: {
    amendmentSponsoringOpen?: Boolean | null | undefined,
    amendmentSubmissionOpen?: Boolean | null | undefined,
    committeeId: ID,
    currentOperativeIndex?: Int | null | undefined,
    supportReevaluationOpen?: Boolean | null | undefined
  }) => Committee,
  setPresenceForCommitteeMembers: (p: {
    ids: ID[],
    present: Boolean,
    rollCallSessionId?: ID | null | undefined
  }) => Committeemember[],
  setRollCallSessionIndex: (p: {
    currentMemberIndex: Int,
    id: ID
  }) => Rollcallsession,
  setVoteForMember: (p: {
    committeeMemberId: ID,
    id?: ID | null | undefined,
    sessionId: ID,
    vote: VotechoiceEnum
  }) => Votingvote,
  startRollCallSession: (p: {
    committeeId: ID,
    id?: ID | null | undefined
  }) => Rollcallsession,
  startVotingSession: (p: {
    committeeId: ID,
    currentStage?: VotingstageEnum | null | undefined,
    deviceVotingWindowSeconds?: Int | null | undefined,
    id?: ID | null | undefined,
    majority: VotingmajoritytypeEnum,
    majorityAmount: Int,
    mode: VotingmodeEnum,
    voteName?: String | null | undefined,
    withAbstentions: Boolean
  }) => Votingsession,
  submitAmendment: (p: {
    id: ID
  }) => Amendment,
  unlinkOperativeClauseVote: (p: {
    clauseId: String,
    paperId: ID
  }) => Boolean,
  updateAmendmentReviewItem: (p: {
    aiObsolete?: Boolean | null | undefined,
    aiObsoleteReason?: String | null | undefined,
    aiRewriteReason?: String | null | undefined,
    aiRewriteSuggestion?: String | null | undefined,
    phase?: AmendmentreviewphaseEnum | null | undefined,
    reviewItemId: ID,
    verdictObsolete?: Boolean | null | undefined,
    verdictRewrite?: String | null | undefined
  }) => Boolean,
  updateCommittee: (p: {
    abbreviation?: String | null | undefined,
    activeAgendaItemId?: ID | null | undefined,
    allowDelegationsToAddThemselvesToSpeakersList?: Boolean | null | undefined,
    allowRequests?: Boolean | null | undefined,
    displayRegionalGroups?: Boolean | null | undefined,
    id: ID,
    name?: String | null | undefined,
    presentationLayout?: String | null | undefined,
    presentationResolutionFontSize?: Int | null | undefined,
    presentationRootFontSize?: Int | null | undefined,
    showWhiteboard?: Boolean | null | undefined,
    stateOfDebate?: String | null | undefined,
    status?: CommitteestatusEnum | null | undefined,
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
    conferenceUserType: ConferenceusertypeEnum,
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
  updateRequestType: (p: {
    enabled?: Boolean | null | undefined,
    faIcon?: String | null | undefined,
    id: ID,
    name?: String | null | undefined,
    priority?: Int | null | undefined
  }) => Requesttype,
  updateResolutionComment: (p: {
    content: String,
    id: ID
  }) => Resolutioncomment,
  updateResolutionPaper: (p: {
    deployConfetti?: Boolean | null | undefined,
    documentNumber?: String | null | undefined,
    id: ID,
    status?: PaperstatusEnum | null | undefined,
    title?: String | null | undefined
  }) => Resolutionpaper,
  updateSpeakerOnList: (p: {
    id: ID,
    overwriteName?: String | null | undefined
  }) => Speakeronlist,
  updateSpeakersList: (p: {
    id: ID,
    isClosed?: Boolean | null | undefined,
    phase?: SpeakerslistphaseEnum | null | undefined,
    speakingTime?: Int | null | undefined,
    startTimestamp?: DateTime | null | undefined,
    stopTimer?: Boolean | null | undefined,
    timeLeft?: Int | null | undefined
  }) => Speakerslist,
  updateVotingSession: (p: {
    currentMemberIndex?: Int | null | undefined,
    currentStage?: VotingstageEnum | null | undefined,
    id: ID,
    votesAbstain?: Int | null | undefined,
    votesCon?: Int | null | undefined,
    votesPro?: Int | null | undefined
  }) => Votingsession,
  withdrawRequest: (p: {
    id: ID
  }) => Request    
};
		
export type Operativeclausevote = {
  clauseId: ID,
  createdAt: DateTime,
  id: ID,
  paper: (p?: {
    orderBy?: ResolutionpaperOrderInputArgument | null | undefined,
    where?: ResolutionpaperWhereInputArgument | null | undefined
  }) => Resolutionpaper,
  paperId: ID,
  updatedAt: DateTime | null,
  vote: (p?: {
    orderBy?: VotingsessionOrderInputArgument | null | undefined,
    where?: VotingsessionWhereInputArgument | null | undefined
  }) => Votingsession,
  votingSessionId: ID    
};
		
export type OperativeclausevoteOrderInputArgument = {
  clauseId?: SortingParameter | null | undefined,
  createdAt?: SortingParameter | null | undefined,
  id?: SortingParameter | null | undefined,
  paperId?: SortingParameter | null | undefined,
  updatedAt?: SortingParameter | null | undefined,
  votingSessionId?: SortingParameter | null | undefined    
};
		
export type OperativeclausevoteWhereInputArgument = {
  AND?: OperativeclausevoteWhereInputArgument[] | undefined,
  NOT?: OperativeclausevoteWhereInputArgument | null | undefined,
  OR?: OperativeclausevoteWhereInputArgument[] | undefined,
  clauseId?: IDWhereInputArgument | null | undefined,
  createdAt?: DateTimeWhereInputArgument | null | undefined,
  id?: IDWhereInputArgument | null | undefined,
  paper?: ResolutionpaperWhereInputArgument | null | undefined,
  paperId?: IDWhereInputArgument | null | undefined,
  updatedAt?: DateTimeWhereInputArgument | null | undefined,
  vote?: VotingsessionWhereInputArgument | null | undefined,
  votingSessionId?: IDWhereInputArgument | null | undefined    
};
		
export type PaperSponsorStats = {
  alpha2Code: String | null,
  representationId: String,
  representationName: String | null,
  sponsorships: Int    
};
		
export type Papercontentsnapshot = {
  content: String,
  createdAt: DateTime,
  id: ID,
  paper: (p?: {
    orderBy?: ResolutionpaperOrderInputArgument | null | undefined,
    where?: ResolutionpaperWhereInputArgument | null | undefined
  }) => Resolutionpaper,
  paperId: ID,
  trigger: SnapshottriggerEnum,
  updatedAt: DateTime | null    
};
		
export type PapercontentsnapshotOrderInputArgument = {
  content?: SortingParameter | null | undefined,
  createdAt?: SortingParameter | null | undefined,
  id?: SortingParameter | null | undefined,
  paperId?: SortingParameter | null | undefined,
  trigger?: SortingParameter | null | undefined,
  updatedAt?: SortingParameter | null | undefined    
};
		
export type PapercontentsnapshotWhereInputArgument = {
  AND?: PapercontentsnapshotWhereInputArgument[] | undefined,
  NOT?: PapercontentsnapshotWhereInputArgument | null | undefined,
  OR?: PapercontentsnapshotWhereInputArgument[] | undefined,
  content?: StringWhereInputArgument | null | undefined,
  createdAt?: DateTimeWhereInputArgument | null | undefined,
  id?: IDWhereInputArgument | null | undefined,
  paper?: ResolutionpaperWhereInputArgument | null | undefined,
  paperId?: IDWhereInputArgument | null | undefined,
  trigger?: SnapshottriggerEnum | null | undefined,
  updatedAt?: DateTimeWhereInputArgument | null | undefined    
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
  conferenceUserId?: SortingParameter | null | undefined,
  createdAt?: SortingParameter | null | undefined,
  id?: SortingParameter | null | undefined,
  paperId?: SortingParameter | null | undefined,
  updatedAt?: SortingParameter | null | undefined    
};
		
export type PapereditorWhereInputArgument = {
  AND?: PapereditorWhereInputArgument[] | undefined,
  NOT?: PapereditorWhereInputArgument | null | undefined,
  OR?: PapereditorWhereInputArgument[] | undefined,
  conferenceUser?: ConferenceuserWhereInputArgument | null | undefined,
  conferenceUserId?: IDWhereInputArgument | null | undefined,
  createdAt?: DateTimeWhereInputArgument | null | undefined,
  id?: IDWhereInputArgument | null | undefined,
  paper?: ResolutionpaperWhereInputArgument | null | undefined,
  paperId?: IDWhereInputArgument | null | undefined,
  updatedAt?: DateTimeWhereInputArgument | null | undefined    
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
  paperId?: SortingParameter | null | undefined,
  permission?: SortingParameter | null | undefined,
  updatedAt?: SortingParameter | null | undefined    
};
		
export type PapersharecodeWhereInputArgument = {
  AND?: PapersharecodeWhereInputArgument[] | undefined,
  NOT?: PapersharecodeWhereInputArgument | null | undefined,
  OR?: PapersharecodeWhereInputArgument[] | undefined,
  code?: StringWhereInputArgument | null | undefined,
  createdAt?: DateTimeWhereInputArgument | null | undefined,
  id?: IDWhereInputArgument | null | undefined,
  paper?: ResolutionpaperWhereInputArgument | null | undefined,
  paperId?: IDWhereInputArgument | null | undefined,
  permission?: SharecodepermissionEnum | null | undefined,
  updatedAt?: DateTimeWhereInputArgument | null | undefined    
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
  committeeMemberId?: SortingParameter | null | undefined,
  createdAt?: SortingParameter | null | undefined,
  id?: SortingParameter | null | undefined,
  paperId?: SortingParameter | null | undefined,
  updatedAt?: SortingParameter | null | undefined    
};
		
export type PapersponsorWhereInputArgument = {
  AND?: PapersponsorWhereInputArgument[] | undefined,
  NOT?: PapersponsorWhereInputArgument | null | undefined,
  OR?: PapersponsorWhereInputArgument[] | undefined,
  committeeMember?: CommitteememberWhereInputArgument | null | undefined,
  committeeMemberId?: IDWhereInputArgument | null | undefined,
  createdAt?: DateTimeWhereInputArgument | null | undefined,
  id?: IDWhereInputArgument | null | undefined,
  paper?: ResolutionpaperWhereInputArgument | null | undefined,
  paperId?: IDWhereInputArgument | null | undefined,
  updatedAt?: DateTimeWhereInputArgument | null | undefined    
};
		
export type PaperstatusEnum = "AMENDMENT_PHASE" | "DRAFT_RESOLUTION" | "FINAL" | "SUBMITTED" | "VOTING_PHASE" | "WORKING_PAPER";
		
export type PersonalActivityStats = {
  amendmentsAccepted: Int,
  amendmentsProposed: Int,
  papersSponsored: Int    
};
		
export type PersonalAttendanceStats = {
  committeesCount: Int,
  totalSeconds: Int    
};
		
export type PersonalSpeakingStats = {
  avgSpeechSeconds: Float,
  avgWaitSeconds: Float,
  commentCount: Int,
  longestSpeechSeconds: Int,
  speakingPercentile: Float,
  speakingToAttendanceRatio: Float,
  speechCount: Int,
  totalSeconds: Int    
};
		
export type PersonalStats = {
  activity: () => PersonalActivityStats,
  attendance: () => PersonalAttendanceStats,
  speaking: () => PersonalSpeakingStats,
  voting: () => PersonalVotingStats    
};
		
export type PersonalVotingStats = {
  abstain: Int,
  con: Int,
  pro: Int,
  total: Int    
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
  committeeId?: SortingParameter | null | undefined,
  conferenceUserId?: SortingParameter | null | undefined,
  id?: SortingParameter | null | undefined,
  note?: SortingParameter | null | undefined,
  present?: SortingParameter | null | undefined,
  rollCallSessionId?: SortingParameter | null | undefined,
  timestamp?: SortingParameter | null | undefined,
  triggeredByConferenceUserId?: SortingParameter | null | undefined,
  type?: SortingParameter | null | undefined    
};
		
export type PresenceeventWhereInputArgument = {
  AND?: PresenceeventWhereInputArgument[] | undefined,
  NOT?: PresenceeventWhereInputArgument | null | undefined,
  OR?: PresenceeventWhereInputArgument[] | undefined,
  committee?: CommitteeWhereInputArgument | null | undefined,
  committeeId?: IDWhereInputArgument | null | undefined,
  conferenceUser?: ConferenceuserWhereInputArgument | null | undefined,
  conferenceUserId?: IDWhereInputArgument | null | undefined,
  id?: IDWhereInputArgument | null | undefined,
  note?: StringWhereInputArgument | null | undefined,
  present?: BooleanWhereInputArgument | null | undefined,
  rollCallSession?: RollcallsessionWhereInputArgument | null | undefined,
  rollCallSessionId?: IDWhereInputArgument | null | undefined,
  timestamp?: DateTimeWhereInputArgument | null | undefined,
  triggeredBy?: ConferenceuserWhereInputArgument | null | undefined,
  triggeredByConferenceUserId?: IDWhereInputArgument | null | undefined,
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
  aiCall: (p: {
    maxTokens?: Int | null | undefined,
    messages: AiMessageInput[],
    responseJSONSchema?: String | null | undefined,
    responseType?: AiResponseType | null | undefined,
    temperature?: Float | null | undefined
  }) => String | null,
  amendment: (p: {
    id: ID
  }) => Amendment,
  amendmentReviewItem: (p: {
    id: ID
  }) => Amendmentreviewitem,
  amendmentReviewItems: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: AmendmentreviewitemOrderInputArgument | null | undefined,
    where?: AmendmentreviewitemWhereInputArgument | null | undefined
  }) => Amendmentreviewitem[],
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
  conferenceStats: (p: {
    conferenceId: ID
  }) => ConferenceStats | null,
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
  hasAiProviders: Boolean,
  isGlobalAdmin: Boolean,
  myStats: (p: {
    conferenceId: ID
  }) => PersonalStats | null,
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
  request: (p: {
    id: ID
  }) => Request,
  requestType: (p: {
    id: ID
  }) => Requesttype,
  requestTypes: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: RequesttypeOrderInputArgument | null | undefined,
    where?: RequesttypeWhereInputArgument | null | undefined
  }) => Requesttype[],
  requests: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: RequestOrderInputArgument | null | undefined,
    where?: RequestWhereInputArgument | null | undefined
  }) => Request[],
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
		
export type RegionalStats = {
  delegationCount: Int,
  group: String,
  speechCount: Int,
  totalSeconds: Int    
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
  conferenceId?: SortingParameter | null | undefined,
  createdAt?: SortingParameter | null | undefined,
  faIcon?: SortingParameter | null | undefined,
  id?: SortingParameter | null | undefined,
  name?: SortingParameter | null | undefined,
  regionalGroup?: SortingParameter | null | undefined,
  type?: SortingParameter | null | undefined,
  updatedAt?: SortingParameter | null | undefined    
};
		
export type RepresentationWhereInputArgument = {
  AND?: RepresentationWhereInputArgument[] | undefined,
  NOT?: RepresentationWhereInputArgument | null | undefined,
  OR?: RepresentationWhereInputArgument[] | undefined,
  alpha2Code?: StringWhereInputArgument | null | undefined,
  alpha3Code?: StringWhereInputArgument | null | undefined,
  committeeMembers?: CommitteememberWhereInputArgument | null | undefined,
  conference?: ConferenceWhereInputArgument | null | undefined,
  conferenceId?: IDWhereInputArgument | null | undefined,
  conferenceMembers?: ConferencememberWhereInputArgument | null | undefined,
  createdAt?: DateTimeWhereInputArgument | null | undefined,
  faIcon?: StringWhereInputArgument | null | undefined,
  id?: IDWhereInputArgument | null | undefined,
  name?: StringWhereInputArgument | null | undefined,
  regionalGroup?: RegionalgroupEnum | null | undefined,
  type?: RepresentationtypeEnum | null | undefined,
  updatedAt?: DateTimeWhereInputArgument | null | undefined    
};
		
export type RepresentationtypeEnum = "DELEGATION" | "NSA" | "UN";
		
export type Request = {
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
  createdAt: DateTime,
  id: ID,
  requestType: (p?: {
    orderBy?: RequesttypeOrderInputArgument | null | undefined,
    where?: RequesttypeWhereInputArgument | null | undefined
  }) => Requesttype,
  requestTypeId: ID,
  resolvedAt: DateTime | null,
  resolvedBy: (p?: {
    orderBy?: ConferenceuserOrderInputArgument | null | undefined,
    where?: ConferenceuserWhereInputArgument | null | undefined
  }) => Conferenceuser | null,
  resolvedByConferenceUserId: ID | null,
  status: RequeststatusEnum,
  updatedAt: DateTime | null    
};
		
export type RequestOrderInputArgument = {
  committeeId?: SortingParameter | null | undefined,
  conferenceUserId?: SortingParameter | null | undefined,
  createdAt?: SortingParameter | null | undefined,
  id?: SortingParameter | null | undefined,
  requestTypeId?: SortingParameter | null | undefined,
  resolvedAt?: SortingParameter | null | undefined,
  resolvedByConferenceUserId?: SortingParameter | null | undefined,
  status?: SortingParameter | null | undefined,
  updatedAt?: SortingParameter | null | undefined    
};
		
export type RequestWhereInputArgument = {
  AND?: RequestWhereInputArgument[] | undefined,
  NOT?: RequestWhereInputArgument | null | undefined,
  OR?: RequestWhereInputArgument[] | undefined,
  committee?: CommitteeWhereInputArgument | null | undefined,
  committeeId?: IDWhereInputArgument | null | undefined,
  conferenceUser?: ConferenceuserWhereInputArgument | null | undefined,
  conferenceUserId?: IDWhereInputArgument | null | undefined,
  createdAt?: DateTimeWhereInputArgument | null | undefined,
  id?: IDWhereInputArgument | null | undefined,
  requestType?: RequesttypeWhereInputArgument | null | undefined,
  requestTypeId?: IDWhereInputArgument | null | undefined,
  resolvedAt?: DateTimeWhereInputArgument | null | undefined,
  resolvedBy?: ConferenceuserWhereInputArgument | null | undefined,
  resolvedByConferenceUserId?: IDWhereInputArgument | null | undefined,
  status?: RequeststatusEnum | null | undefined,
  updatedAt?: DateTimeWhereInputArgument | null | undefined    
};
		
export type RequeststatusEnum = "PENDING" | "RESOLVED" | "WITHDRAWN";
		
export type Requesttype = {
  conference: (p?: {
    orderBy?: ConferenceOrderInputArgument | null | undefined,
    where?: ConferenceWhereInputArgument | null | undefined
  }) => Conference,
  conferenceId: ID,
  createdAt: DateTime,
  enabled: Boolean,
  faIcon: String | null,
  id: ID,
  name: String,
  priority: Int,
  requests: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: RequestOrderInputArgument | null | undefined,
    where?: RequestWhereInputArgument | null | undefined
  }) => Request[],
  updatedAt: DateTime | null    
};
		
export type RequesttypeOrderInputArgument = {
  conferenceId?: SortingParameter | null | undefined,
  createdAt?: SortingParameter | null | undefined,
  enabled?: SortingParameter | null | undefined,
  faIcon?: SortingParameter | null | undefined,
  id?: SortingParameter | null | undefined,
  name?: SortingParameter | null | undefined,
  priority?: SortingParameter | null | undefined,
  updatedAt?: SortingParameter | null | undefined    
};
		
export type RequesttypeWhereInputArgument = {
  AND?: RequesttypeWhereInputArgument[] | undefined,
  NOT?: RequesttypeWhereInputArgument | null | undefined,
  OR?: RequesttypeWhereInputArgument[] | undefined,
  conference?: ConferenceWhereInputArgument | null | undefined,
  conferenceId?: IDWhereInputArgument | null | undefined,
  createdAt?: DateTimeWhereInputArgument | null | undefined,
  enabled?: BooleanWhereInputArgument | null | undefined,
  faIcon?: StringWhereInputArgument | null | undefined,
  id?: IDWhereInputArgument | null | undefined,
  name?: StringWhereInputArgument | null | undefined,
  priority?: IntWhereInputArgument | null | undefined,
  requests?: RequestWhereInputArgument | null | undefined,
  updatedAt?: DateTimeWhereInputArgument | null | undefined    
};
		
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
  parent: (p?: {
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
  authorConferenceUserId?: SortingParameter | null | undefined,
  clauseId?: SortingParameter | null | undefined,
  content?: SortingParameter | null | undefined,
  createdAt?: SortingParameter | null | undefined,
  id?: SortingParameter | null | undefined,
  paperId?: SortingParameter | null | undefined,
  parentCommentId?: SortingParameter | null | undefined,
  updatedAt?: SortingParameter | null | undefined,
  visibility?: SortingParameter | null | undefined    
};
		
export type ResolutioncommentWhereInputArgument = {
  AND?: ResolutioncommentWhereInputArgument[] | undefined,
  NOT?: ResolutioncommentWhereInputArgument | null | undefined,
  OR?: ResolutioncommentWhereInputArgument[] | undefined,
  author?: ConferenceuserWhereInputArgument | null | undefined,
  authorConferenceUserId?: IDWhereInputArgument | null | undefined,
  clauseId?: IDWhereInputArgument | null | undefined,
  content?: StringWhereInputArgument | null | undefined,
  createdAt?: DateTimeWhereInputArgument | null | undefined,
  id?: IDWhereInputArgument | null | undefined,
  paper?: ResolutionpaperWhereInputArgument | null | undefined,
  paperId?: IDWhereInputArgument | null | undefined,
  parent?: ResolutioncommentWhereInputArgument | null | undefined,
  parentCommentId?: IDWhereInputArgument | null | undefined,
  replies?: ResolutioncommentWhereInputArgument | null | undefined,
  updatedAt?: DateTimeWhereInputArgument | null | undefined,
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
  createdAt: DateTime,
  creatorCommitteeMember: (p?: {
    orderBy?: CommitteememberOrderInputArgument | null | undefined,
    where?: CommitteememberWhereInputArgument | null | undefined
  }) => Committeemember,
  creatorCommitteeMemberId: ID,
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
  vote: (p?: {
    orderBy?: VotingsessionOrderInputArgument | null | undefined,
    where?: VotingsessionWhereInputArgument | null | undefined
  }) => Votingsession | null,
  voteVotingSessionId: ID | null    
};
		
export type ResolutionpaperOrderInputArgument = {
  agendaItemId?: SortingParameter | null | undefined,
  committeeId?: SortingParameter | null | undefined,
  createdAt?: SortingParameter | null | undefined,
  creatorCommitteeMemberId?: SortingParameter | null | undefined,
  documentNumber?: SortingParameter | null | undefined,
  id?: SortingParameter | null | undefined,
  status?: SortingParameter | null | undefined,
  title?: SortingParameter | null | undefined,
  updatedAt?: SortingParameter | null | undefined,
  voteVotingSessionId?: SortingParameter | null | undefined    
};
		
export type ResolutionpaperWhereInputArgument = {
  AND?: ResolutionpaperWhereInputArgument[] | undefined,
  NOT?: ResolutionpaperWhereInputArgument | null | undefined,
  OR?: ResolutionpaperWhereInputArgument[] | undefined,
  agendaItem?: AgendaitemWhereInputArgument | null | undefined,
  agendaItemId?: IDWhereInputArgument | null | undefined,
  amendments?: AmendmentWhereInputArgument | null | undefined,
  comments?: ResolutioncommentWhereInputArgument | null | undefined,
  committee?: CommitteeWhereInputArgument | null | undefined,
  committeeId?: IDWhereInputArgument | null | undefined,
  createdAt?: DateTimeWhereInputArgument | null | undefined,
  creatorCommitteeMember?: CommitteememberWhereInputArgument | null | undefined,
  creatorCommitteeMemberId?: IDWhereInputArgument | null | undefined,
  documentNumber?: StringWhereInputArgument | null | undefined,
  editors?: PapereditorWhereInputArgument | null | undefined,
  id?: IDWhereInputArgument | null | undefined,
  operativeClauseVotes?: OperativeclausevoteWhereInputArgument | null | undefined,
  shareCodes?: PapersharecodeWhereInputArgument | null | undefined,
  snapshots?: PapercontentsnapshotWhereInputArgument | null | undefined,
  sponsors?: PapersponsorWhereInputArgument | null | undefined,
  status?: PaperstatusEnum | null | undefined,
  title?: StringWhereInputArgument | null | undefined,
  updatedAt?: DateTimeWhereInputArgument | null | undefined,
  vote?: VotingsessionWhereInputArgument | null | undefined,
  voteVotingSessionId?: IDWhereInputArgument | null | undefined    
};
		
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
  committeeId?: SortingParameter | null | undefined,
  completedAt?: SortingParameter | null | undefined,
  createdAt?: SortingParameter | null | undefined,
  currentMemberIndex?: SortingParameter | null | undefined,
  id?: SortingParameter | null | undefined,
  startedByConferenceUserId?: SortingParameter | null | undefined,
  updatedAt?: SortingParameter | null | undefined    
};
		
export type RollcallsessionWhereInputArgument = {
  AND?: RollcallsessionWhereInputArgument[] | undefined,
  NOT?: RollcallsessionWhereInputArgument | null | undefined,
  OR?: RollcallsessionWhereInputArgument[] | undefined,
  committee?: CommitteeWhereInputArgument | null | undefined,
  committeeId?: IDWhereInputArgument | null | undefined,
  completedAt?: DateTimeWhereInputArgument | null | undefined,
  createdAt?: DateTimeWhereInputArgument | null | undefined,
  currentMemberIndex?: IntWhereInputArgument | null | undefined,
  id?: IDWhereInputArgument | null | undefined,
  presenceEvents?: PresenceeventWhereInputArgument | null | undefined,
  startedBy?: ConferenceuserWhereInputArgument | null | undefined,
  startedByConferenceUserId?: IDWhereInputArgument | null | undefined,
  updatedAt?: DateTimeWhereInputArgument | null | undefined    
};
		
export type SharecodepermissionEnum = "EDIT" | "SPONSOR";
		
export type SnapshottriggerEnum = "AMENDMENT_APPLIED" | "MANUAL" | "SUBMITTED" | "VOTE_CONCLUDED";
		
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
  committeeMemberId?: SortingParameter | null | undefined,
  conferenceMemberId?: SortingParameter | null | undefined,
  createdAt?: SortingParameter | null | undefined,
  id?: SortingParameter | null | undefined,
  overwriteName?: SortingParameter | null | undefined,
  position?: SortingParameter | null | undefined,
  speakersListId?: SortingParameter | null | undefined,
  updatedAt?: SortingParameter | null | undefined    
};
		
export type SpeakeronlistWhereInputArgument = {
  AND?: SpeakeronlistWhereInputArgument[] | undefined,
  NOT?: SpeakeronlistWhereInputArgument | null | undefined,
  OR?: SpeakeronlistWhereInputArgument[] | undefined,
  committeeMember?: CommitteememberWhereInputArgument | null | undefined,
  committeeMemberId?: IDWhereInputArgument | null | undefined,
  conferenceMember?: ConferencememberWhereInputArgument | null | undefined,
  conferenceMemberId?: IDWhereInputArgument | null | undefined,
  createdAt?: DateTimeWhereInputArgument | null | undefined,
  id?: IDWhereInputArgument | null | undefined,
  overwriteName?: StringWhereInputArgument | null | undefined,
  position?: IntWhereInputArgument | null | undefined,
  speakersList?: SpeakerslistWhereInputArgument | null | undefined,
  speakersListId?: IDWhereInputArgument | null | undefined,
  updatedAt?: DateTimeWhereInputArgument | null | undefined    
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
  agendaItemId?: SortingParameter | null | undefined,
  createdAt?: SortingParameter | null | undefined,
  id?: SortingParameter | null | undefined,
  isClosed?: SortingParameter | null | undefined,
  phase?: SortingParameter | null | undefined,
  speakingTime?: SortingParameter | null | undefined,
  startTimestamp?: SortingParameter | null | undefined,
  timeLeft?: SortingParameter | null | undefined,
  type?: SortingParameter | null | undefined,
  updatedAt?: SortingParameter | null | undefined    
};
		
export type SpeakerslistWhereInputArgument = {
  AND?: SpeakerslistWhereInputArgument[] | undefined,
  NOT?: SpeakerslistWhereInputArgument | null | undefined,
  OR?: SpeakerslistWhereInputArgument[] | undefined,
  agendaItem?: AgendaitemWhereInputArgument | null | undefined,
  agendaItemId?: IDWhereInputArgument | null | undefined,
  createdAt?: DateTimeWhereInputArgument | null | undefined,
  id?: IDWhereInputArgument | null | undefined,
  isClosed?: BooleanWhereInputArgument | null | undefined,
  phase?: SpeakerslistphaseEnum | null | undefined,
  speakers?: SpeakeronlistWhereInputArgument | null | undefined,
  speakingTime?: IntWhereInputArgument | null | undefined,
  startTimestamp?: DateTimeWhereInputArgument | null | undefined,
  timeLeft?: IntWhereInputArgument | null | undefined,
  type?: SpeakerslistcategoryEnum | null | undefined,
  updatedAt?: DateTimeWhereInputArgument | null | undefined    
};
		
export type SpeakerslistcategoryEnum = "COMMENT_LIST" | "SPEAKERS_LIST";
		
export type SpeakerslistphaseEnum = "ANSWER" | "ANSWER_DONE" | "QUESTION" | "SPEECH" | "SPEECH_DONE";
		
export type SpeakingFairness = {
  gini: Float,
  stdDevSeconds: Float    
};
		
export type SpeakingTimelineBucket = {
  bucket: String,
  totalSeconds: Int    
};
		
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
  amendmentReviewItem: (p: {
    id: ID
  }) => Amendmentreviewitem,
  amendmentReviewItems: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: AmendmentreviewitemOrderInputArgument | null | undefined,
    where?: AmendmentreviewitemWhereInputArgument | null | undefined
  }) => Amendmentreviewitem[],
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
  request: (p: {
    id: ID
  }) => Request,
  requestType: (p: {
    id: ID
  }) => Requesttype,
  requestTypes: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: RequesttypeOrderInputArgument | null | undefined,
    where?: RequesttypeWhereInputArgument | null | undefined
  }) => Requesttype[],
  requests: (p?: {
    limit?: Int | null | undefined,
    offset?: Int | null | undefined,
    orderBy?: RequestOrderInputArgument | null | undefined,
    where?: RequestWhereInputArgument | null | undefined
  }) => Request[],
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
  AND?: UserWhereInputArgument[] | undefined,
  NOT?: UserWhereInputArgument | null | undefined,
  OR?: UserWhereInputArgument[] | undefined,
  conferenceMemberships?: ConferenceuserWhereInputArgument | null | undefined,
  createdAt?: DateTimeWhereInputArgument | null | undefined,
  email?: StringWhereInputArgument | null | undefined,
  familyName?: StringWhereInputArgument | null | undefined,
  givenName?: StringWhereInputArgument | null | undefined,
  id?: IDWhereInputArgument | null | undefined,
  locale?: StringWhereInputArgument | null | undefined,
  preferredUsername?: StringWhereInputArgument | null | undefined,
  updatedAt?: DateTimeWhereInputArgument | null | undefined    
};
		
export type VotechoiceEnum = "ABSTAIN" | "CON" | "PRO";
		
export type VotingAlignmentStats = {
  agreementRate: Float,
  representation1Alpha2Code: String | null,
  representation1Id: String,
  representation1Name: String | null,
  representation2Alpha2Code: String | null,
  representation2Id: String,
  representation2Name: String | null,
  votesCompared: Int    
};
		
export type VotingmajoritytypeEnum = "ABSOLUTE" | "SIMPLE" | "TWO_THIRDS";
		
export type VotingmodeEnum = "DEVICE_BASED" | "ROLL_CALL" | "SHOW_OF_HANDS";
		
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
  deviceVotingStartedAt: DateTime | null,
  deviceVotingWindowSeconds: Int | null,
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
  committeeId?: SortingParameter | null | undefined,
  completedAt?: SortingParameter | null | undefined,
  createdAt?: SortingParameter | null | undefined,
  currentMemberIndex?: SortingParameter | null | undefined,
  currentStage?: SortingParameter | null | undefined,
  deviceVotingStartedAt?: SortingParameter | null | undefined,
  deviceVotingWindowSeconds?: SortingParameter | null | undefined,
  id?: SortingParameter | null | undefined,
  majority?: SortingParameter | null | undefined,
  majorityAmount?: SortingParameter | null | undefined,
  mode?: SortingParameter | null | undefined,
  outcome?: SortingParameter | null | undefined,
  startedByConferenceUserId?: SortingParameter | null | undefined,
  updatedAt?: SortingParameter | null | undefined,
  voteName?: SortingParameter | null | undefined,
  votesAbstain?: SortingParameter | null | undefined,
  votesCon?: SortingParameter | null | undefined,
  votesPro?: SortingParameter | null | undefined,
  withAbstentions?: SortingParameter | null | undefined    
};
		
export type VotingsessionWhereInputArgument = {
  AND?: VotingsessionWhereInputArgument[] | undefined,
  NOT?: VotingsessionWhereInputArgument | null | undefined,
  OR?: VotingsessionWhereInputArgument[] | undefined,
  committee?: CommitteeWhereInputArgument | null | undefined,
  committeeId?: IDWhereInputArgument | null | undefined,
  completedAt?: DateTimeWhereInputArgument | null | undefined,
  createdAt?: DateTimeWhereInputArgument | null | undefined,
  currentMemberIndex?: IntWhereInputArgument | null | undefined,
  currentStage?: VotingstageEnum | null | undefined,
  deviceVotingStartedAt?: DateTimeWhereInputArgument | null | undefined,
  deviceVotingWindowSeconds?: IntWhereInputArgument | null | undefined,
  id?: IDWhereInputArgument | null | undefined,
  majority?: VotingmajoritytypeEnum | null | undefined,
  majorityAmount?: IntWhereInputArgument | null | undefined,
  mode?: VotingmodeEnum | null | undefined,
  outcome?: VotingoutcomeEnum | null | undefined,
  startedBy?: ConferenceuserWhereInputArgument | null | undefined,
  startedByConferenceUserId?: IDWhereInputArgument | null | undefined,
  updatedAt?: DateTimeWhereInputArgument | null | undefined,
  voteName?: StringWhereInputArgument | null | undefined,
  votes?: VotingvoteWhereInputArgument | null | undefined,
  votesAbstain?: IntWhereInputArgument | null | undefined,
  votesCon?: IntWhereInputArgument | null | undefined,
  votesPro?: IntWhereInputArgument | null | undefined,
  withAbstentions?: BooleanWhereInputArgument | null | undefined    
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
  committeeMemberId?: SortingParameter | null | undefined,
  createdAt?: SortingParameter | null | undefined,
  id?: SortingParameter | null | undefined,
  updatedAt?: SortingParameter | null | undefined,
  vote?: SortingParameter | null | undefined,
  votingSessionId?: SortingParameter | null | undefined    
};
		
export type VotingvoteWhereInputArgument = {
  AND?: VotingvoteWhereInputArgument[] | undefined,
  NOT?: VotingvoteWhereInputArgument | null | undefined,
  OR?: VotingvoteWhereInputArgument[] | undefined,
  committeeMember?: CommitteememberWhereInputArgument | null | undefined,
  committeeMemberId?: IDWhereInputArgument | null | undefined,
  createdAt?: DateTimeWhereInputArgument | null | undefined,
  id?: IDWhereInputArgument | null | undefined,
  updatedAt?: DateTimeWhereInputArgument | null | undefined,
  vote?: VotechoiceEnum | null | undefined,
  votingSession?: VotingsessionWhereInputArgument | null | undefined,
  votingSessionId?: IDWhereInputArgument | null | undefined    
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
	  availableSubscriptions: new Set(["agendaItem", "agendaItems", "amendment", "amendmentReviewItem", "amendmentReviewItems", "amendmentSponsor", "amendmentSponsors", "amendments", "committee", "committeeMember", "committeeMembers", "committees", "conference", "conferenceMember", "conferenceMembers", "conferenceUser", "conferenceUsers", "conferences", "operativeClauseVote", "operativeClauseVotes", "paperContentSnapshot", "paperContentSnapshots", "paperEditor", "paperEditors", "paperShareCode", "paperShareCodes", "paperSponsor", "paperSponsors", "presenceEvent", "presenceEvents", "representation", "representations", "request", "requestType", "requestTypes", "requests", "resolutionComment", "resolutionComments", "resolutionPaper", "resolutionPapers", "rollCallSession", "rollCallSessions", "speakerOnList", "speakerOnLists", "speakersList", "speakersLists", "user", "users", "votingSession", "votingSessions", "votingVote", "votingVotes"]),
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