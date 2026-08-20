import { defineRelations } from 'drizzle-orm';
import * as schema from './schema';

export const relations = defineRelations(schema, (r) => ({
	user: {
		conferenceMemberships: r.many.conferenceUser({
			from: r.user.email,
			to: r.conferenceUser.userEmail
		})
	},
	conference: {
		committees: r.many.committee({
			from: r.conference.id,
			to: r.committee.conferenceId
		}),
		users: r.many.conferenceUser({
			from: r.conference.id,
			to: r.conferenceUser.conferenceId
		}),
		members: r.many.conferenceMember({
			from: r.conference.id,
			to: r.conferenceMember.conferenceId
		}),
		representations: r.many.representation({
			from: r.conference.id,
			to: r.representation.conferenceId
		}),
		requestTypes: r.many.requestType({
			from: r.conference.id,
			to: r.requestType.conferenceId
		})
	},
	committee: {
		conference: r.one.conference({
			from: r.committee.conferenceId,
			to: r.conference.id
		}),
		activeAgendaItem: r.one.agendaItem({
			from: r.committee.activeAgendaItemId,
			to: r.agendaItem.id
		}),
		activeRollCallSession: r.one.rollCallSession({
			from: r.committee.activeRollCallSessionId,
			to: r.rollCallSession.id,
			optional: true
		}),
		activeVotingSession: r.one.votingSession({
			from: r.committee.activeVotingSessionId,
			to: r.votingSession.id,
			optional: true
		}),
		activeDraftResolution: r.one.resolutionPaper({
			from: r.committee.activeDraftResolutionId,
			to: r.resolutionPaper.id,
			optional: true
		}),
		activeAmendment: r.one.amendment({
			from: r.committee.activeAmendmentId,
			to: r.amendment.id,
			optional: true
		}),
		agendaItems: r.many.agendaItem({
			from: r.committee.id,
			to: r.agendaItem.committeeId
		}),
		members: r.many.committeeMember({
			from: r.committee.id,
			to: r.committeeMember.committeeId
		}),
		presenceEvents: r.many.presenceEvent({
			from: r.committee.id,
			to: r.presenceEvent.committeeId
		}),
		rollCallSessions: r.many.rollCallSession({
			from: r.committee.id,
			to: r.rollCallSession.committeeId
		}),
		votingSessions: r.many.votingSession({
			from: r.committee.id,
			to: r.votingSession.committeeId
		}),
		resolutionPapers: r.many.resolutionPaper({
			from: r.committee.id,
			to: r.resolutionPaper.committeeId
		}),
		requests: r.many.request({
			from: r.committee.id,
			to: r.request.committeeId
		})
	},
	committeeMember: {
		representation: r.one.representation({
			from: r.committeeMember.representationId,
			to: r.representation.id,
			optional: false
		}),
		committee: r.one.committee({
			from: r.committeeMember.committeeId,
			to: r.committee.id,
			optional: false
		}),
		users: r.many.conferenceUser({
			from: r.committeeMember.id,
			to: r.conferenceUser.committeeMemberId
		}),
		votingVotes: r.many.votingVote({
			from: r.committeeMember.id,
			to: r.votingVote.committeeMemberId
		}),
		createdPapers: r.many.resolutionPaper({
			from: r.committeeMember.id,
			to: r.resolutionPaper.creatorCommitteeMemberId
		}),
		paperSponsorships: r.many.paperSponsor({
			from: r.committeeMember.id,
			to: r.paperSponsor.committeeMemberId
		}),
		proposedAmendments: r.many.amendment({
			from: r.committeeMember.id,
			to: r.amendment.proposerCommitteeMemberId
		}),
		amendmentSponsorships: r.many.amendmentSponsor({
			from: r.committeeMember.id,
			to: r.amendmentSponsor.committeeMemberId
		})
	},
	conferenceUser: {
		// Optional: a conferenceUser row is created on import / by admin entry
		// before the person ever logs in. The `user` row is only inserted on
		// successful OIDC login (see services/OIDC.ts), so for unredeemed accounts
		// this relation legitimately resolves to null.
		user: r.one.user({
			from: r.conferenceUser.userEmail,
			to: r.user.email,
			optional: true
		}),
		conference: r.one.conference({
			from: r.conferenceUser.conferenceId,
			to: r.conference.id,
			optional: false
		}),
		committeeMember: r.one.committeeMember({
			from: r.conferenceUser.committeeMemberId,
			to: r.committeeMember.id,
			optional: true
		}),
		conferenceMember: r.one.conferenceMember({
			from: r.conferenceUser.conferenceMemberId,
			to: r.conferenceMember.id,
			optional: true
		}),
		presenceEvents: r.many.presenceEvent({
			from: r.conferenceUser.id,
			to: r.presenceEvent.conferenceUserId
		}),
		triggeredPresenceEvents: r.many.presenceEvent({
			from: r.conferenceUser.id,
			to: r.presenceEvent.triggeredByConferenceUserId
		}),
		paperEditorships: r.many.paperEditor({
			from: r.conferenceUser.id,
			to: r.paperEditor.conferenceUserId
		}),
		authoredComments: r.many.resolutionComment({
			from: r.conferenceUser.id,
			to: r.resolutionComment.authorConferenceUserId
		}),
		requests: r.many.request({
			from: r.conferenceUser.id,
			to: r.request.conferenceUserId
		}),
		resolvedRequests: r.many.request({
			from: r.conferenceUser.id,
			to: r.request.resolvedByConferenceUserId
		})
	},
	representation: {
		conference: r.one.conference({
			from: r.representation.conferenceId,
			to: r.conference.id
		}),
		conferenceMembers: r.many.conferenceMember({
			from: r.representation.id,
			to: r.conferenceMember.representationId
		}),
		committeeMembers: r.many.committeeMember({
			from: r.representation.id,
			to: r.committeeMember.representationId
		})
	},
	conferenceMember: {
		conference: r.one.conference({
			from: r.conferenceMember.conferenceId,
			to: r.conference.id
		}),
		representation: r.one.representation({
			from: r.conferenceMember.representationId,
			to: r.representation.id,
			optional: false
		}),
		speakerOnList: r.many.speakerOnList({
			from: r.conferenceMember.id,
			to: r.speakerOnList.conferenceMemberId
		}),
		users: r.many.conferenceUser({
			from: r.conferenceMember.id,
			to: r.conferenceUser.conferenceMemberId
		})
	},
	agendaItem: {
		committee: r.one.committee({
			from: r.agendaItem.committeeId,
			to: r.committee.id
		}),
		speakersList: r.many.speakersList({
			from: r.agendaItem.id,
			to: r.speakersList.agendaItemId
		}),
		resolutionPapers: r.many.resolutionPaper({
			from: r.agendaItem.id,
			to: r.resolutionPaper.agendaItemId
		})
	},
	speakersList: {
		agendaItem: r.one.agendaItem({
			from: r.speakersList.agendaItemId,
			to: r.agendaItem.id
		}),
		speakers: r.many.speakerOnList({
			from: r.speakersList.id,
			to: r.speakerOnList.speakersListId
		})
	},
	speakerOnList: {
		speakersList: r.one.speakersList({
			from: r.speakerOnList.speakersListId,
			to: r.speakersList.id
		}),
		committeeMember: r.one.committeeMember({
			from: r.speakerOnList.committeeMemberId,
			to: r.committeeMember.id
		}),
		conferenceMember: r.one.conferenceMember({
			from: r.speakerOnList.conferenceMemberId,
			to: r.conferenceMember.id
		})
	},
	spokenTimePeriod: {
		committeeMember: r.one.committeeMember({
			from: r.spokenTimePeriod.committeeMemberId,
			to: r.committeeMember.id
		}),
		conferenceMember: r.one.conferenceMember({
			from: r.spokenTimePeriod.conferenceMemberId,
			to: r.conferenceMember.id
		}),
		speakersList: r.one.speakersList({
			from: r.spokenTimePeriod.speakersListId,
			to: r.speakersList.id
		})
	},
	committeeTopicChangedTimestamp: {
		agendaItem: r.one.agendaItem({
			from: r.committeeTopicChangedTimestamp.agendaItemId,
			to: r.agendaItem.id
		}),
		committee: r.one.committee({
			from: r.committeeTopicChangedTimestamp.committeeId,
			to: r.committee.id
		})
	},
	presenceEvent: {
		conferenceUser: r.one.conferenceUser({
			from: r.presenceEvent.conferenceUserId,
			to: r.conferenceUser.id,
			optional: false
		}),
		committee: r.one.committee({
			from: r.presenceEvent.committeeId,
			to: r.committee.id,
			optional: false
		}),
		triggeredBy: r.one.conferenceUser({
			from: r.presenceEvent.triggeredByConferenceUserId,
			to: r.conferenceUser.id,
			optional: true
		}),
		rollCallSession: r.one.rollCallSession({
			from: r.presenceEvent.rollCallSessionId,
			to: r.rollCallSession.id,
			optional: true
		})
	},
	rollCallSession: {
		committee: r.one.committee({
			from: r.rollCallSession.committeeId,
			to: r.committee.id,
			optional: false
		}),
		startedBy: r.one.conferenceUser({
			from: r.rollCallSession.startedByConferenceUserId,
			to: r.conferenceUser.id,
			optional: true
		}),
		presenceEvents: r.many.presenceEvent({
			from: r.rollCallSession.id,
			to: r.presenceEvent.rollCallSessionId
		})
	},
	votingSession: {
		committee: r.one.committee({
			from: r.votingSession.committeeId,
			to: r.committee.id,
			optional: false
		}),
		startedBy: r.one.conferenceUser({
			from: r.votingSession.startedByConferenceUserId,
			to: r.conferenceUser.id,
			optional: true
		}),
		votes: r.many.votingVote({
			from: r.votingSession.id,
			to: r.votingVote.votingSessionId
		})
	},
	votingVote: {
		votingSession: r.one.votingSession({
			from: r.votingVote.votingSessionId,
			to: r.votingSession.id,
			optional: false
		}),
		committeeMember: r.one.committeeMember({
			from: r.votingVote.committeeMemberId,
			to: r.committeeMember.id,
			optional: false
		})
	},
	resolutionPaper: {
		committee: r.one.committee({
			from: r.resolutionPaper.committeeId,
			to: r.committee.id,
			optional: false
		}),
		agendaItem: r.one.agendaItem({
			from: r.resolutionPaper.agendaItemId,
			to: r.agendaItem.id,
			optional: false
		}),
		creatorCommitteeMember: r.one.committeeMember({
			from: r.resolutionPaper.creatorCommitteeMemberId,
			to: r.committeeMember.id,
			optional: false
		}),
		snapshots: r.many.paperContentSnapshot({
			from: r.resolutionPaper.id,
			to: r.paperContentSnapshot.paperId
		}),
		sponsors: r.many.paperSponsor({
			from: r.resolutionPaper.id,
			to: r.paperSponsor.paperId
		}),
		editors: r.many.paperEditor({
			from: r.resolutionPaper.id,
			to: r.paperEditor.paperId
		}),
		shareCodes: r.many.paperShareCode({
			from: r.resolutionPaper.id,
			to: r.paperShareCode.paperId
		}),
		comments: r.many.resolutionComment({
			from: r.resolutionPaper.id,
			to: r.resolutionComment.paperId
		}),
		amendments: r.many.amendment({
			from: r.resolutionPaper.id,
			to: r.amendment.paperId
		}),
		operativeClauseVotes: r.many.operativeClauseVote({
			from: r.resolutionPaper.id,
			to: r.operativeClauseVote.paperId
		}),
		vote: r.one.votingSession({
			from: r.resolutionPaper.voteVotingSessionId,
			to: r.votingSession.id,
			optional: true
		})
	},
	paperContentSnapshot: {
		paper: r.one.resolutionPaper({
			from: r.paperContentSnapshot.paperId,
			to: r.resolutionPaper.id,
			optional: false
		})
	},
	paperSponsor: {
		paper: r.one.resolutionPaper({
			from: r.paperSponsor.paperId,
			to: r.resolutionPaper.id,
			optional: false
		}),
		committeeMember: r.one.committeeMember({
			from: r.paperSponsor.committeeMemberId,
			to: r.committeeMember.id,
			optional: false
		})
	},
	paperEditor: {
		paper: r.one.resolutionPaper({
			from: r.paperEditor.paperId,
			to: r.resolutionPaper.id,
			optional: false
		}),
		conferenceUser: r.one.conferenceUser({
			from: r.paperEditor.conferenceUserId,
			to: r.conferenceUser.id,
			optional: false
		})
	},
	paperShareCode: {
		paper: r.one.resolutionPaper({
			from: r.paperShareCode.paperId,
			to: r.resolutionPaper.id,
			optional: false
		})
	},
	resolutionComment: {
		paper: r.one.resolutionPaper({
			from: r.resolutionComment.paperId,
			to: r.resolutionPaper.id,
			optional: false
		}),
		author: r.one.conferenceUser({
			from: r.resolutionComment.authorConferenceUserId,
			to: r.conferenceUser.id,
			optional: false
		}),
		parent: r.one.resolutionComment({
			from: r.resolutionComment.parentCommentId,
			to: r.resolutionComment.id,
			optional: true
		}),
		replies: r.many.resolutionComment({
			from: r.resolutionComment.id,
			to: r.resolutionComment.parentCommentId
		})
	},
	amendment: {
		paper: r.one.resolutionPaper({
			from: r.amendment.paperId,
			to: r.resolutionPaper.id,
			optional: false
		}),
		proposer: r.one.committeeMember({
			from: r.amendment.proposerCommitteeMemberId,
			to: r.committeeMember.id,
			optional: false
		}),
		sponsors: r.many.amendmentSponsor({
			from: r.amendment.id,
			to: r.amendmentSponsor.amendmentId
		}),
		reviewItemsAsSubject: r.many.amendmentReviewItem({
			from: r.amendment.id,
			to: r.amendmentReviewItem.subjectAmendmentId
		})
	},
	amendmentReviewItem: {
		paper: r.one.resolutionPaper({
			from: r.amendmentReviewItem.paperId,
			to: r.resolutionPaper.id,
			optional: false
		}),
		triggerAmendment: r.one.amendment({
			from: r.amendmentReviewItem.triggerAmendmentId,
			to: r.amendment.id,
			optional: false
		}),
		subjectAmendment: r.one.amendment({
			from: r.amendmentReviewItem.subjectAmendmentId,
			to: r.amendment.id,
			optional: false
		})
	},
	amendmentSponsor: {
		amendment: r.one.amendment({
			from: r.amendmentSponsor.amendmentId,
			to: r.amendment.id,
			optional: false
		}),
		committeeMember: r.one.committeeMember({
			from: r.amendmentSponsor.committeeMemberId,
			to: r.committeeMember.id,
			optional: false
		})
	},
	operativeClauseVote: {
		paper: r.one.resolutionPaper({
			from: r.operativeClauseVote.paperId,
			to: r.resolutionPaper.id,
			optional: false
		}),
		vote: r.one.votingSession({
			from: r.operativeClauseVote.votingSessionId,
			to: r.votingSession.id,
			optional: false
		})
	},
	requestType: {
		conference: r.one.conference({
			from: r.requestType.conferenceId,
			to: r.conference.id,
			optional: false
		}),
		requests: r.many.request({
			from: r.requestType.id,
			to: r.request.requestTypeId
		})
	},
	request: {
		committee: r.one.committee({
			from: r.request.committeeId,
			to: r.committee.id,
			optional: false
		}),
		requestType: r.one.requestType({
			from: r.request.requestTypeId,
			to: r.requestType.id,
			optional: false
		}),
		conferenceUser: r.one.conferenceUser({
			from: r.request.conferenceUserId,
			to: r.conferenceUser.id,
			optional: false
		}),
		resolvedBy: r.one.conferenceUser({
			from: r.request.resolvedByConferenceUserId,
			to: r.conferenceUser.id,
			optional: true
		})
	}
}));
