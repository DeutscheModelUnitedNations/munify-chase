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
		votingSessions: r.many.votingSession({
			from: r.committee.id,
			to: r.votingSession.committeeId
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
	}
}));
