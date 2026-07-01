import { nanoid } from '../../lib/helpers/nanoid';
import {
	snakeCase,
	text,
	timestamp,
	date,
	unique,
	pgEnum,
	boolean,
	smallint,
	integer,
	bytea,
	type AnyPgColumn
} from 'drizzle-orm/pg-core';

const defaultTimestamps = {
	createdAt: timestamp().defaultNow().notNull(),
	updatedAt: timestamp({ mode: 'date' })
		.defaultNow()
		.$onUpdate(() => new Date())
};
const defaultIdAndTimestamps = {
	id: text()
		.$defaultFn(() => nanoid())
		.primaryKey()
		.notNull(),
	...defaultTimestamps
};

export const user = snakeCase.table('user', {
	id: text().primaryKey().unique().notNull(),
	...defaultTimestamps,

	// OIDC fields
	email: text().notNull().unique(),
	familyName: text().notNull(),
	givenName: text().notNull(),
	locale: text(),
	preferredUsername: text().notNull()
});

export const conference = snakeCase.table('conference', {
	...defaultIdAndTimestamps,
	title: text().notNull(),
	pressWebsite: text(),
	location: text(),
	startDate: date({ mode: 'date' }),
	endDate: date({ mode: 'date' }),
	hasModeratedCaucus: boolean().notNull().default(false),
	logoSvg: text()
});

export const committeeStatus = pgEnum('committee_status', [
	'FORMAL',
	'INFORMAL',
	'MODERATED_INFORMAL',
	'PAUSE',
	'SUSPENSION'
]);

export const committee = snakeCase.table(
	'committee',
	{
		...defaultIdAndTimestamps,
		name: text().notNull(),
		abbreviation: text().notNull(),
		conferenceId: text()
			.notNull()
			.references(() => conference.id, { onDelete: 'cascade' }),
		whiteboardContent: text().default('<p></p>'),
		showWhiteboard: boolean().notNull().default(true),
		status: committeeStatus().notNull().default('SUSPENSION'),
		statusHeadline: text().notNull().default(''),
		statusUntil: timestamp({ mode: 'date' }).defaultNow().notNull(),
		stateOfDebate: text(),
		allowDelegationsToAddThemselvesToSpeakersList: boolean().notNull().default(false),
		activeAgendaItemId: text().references(() => agendaItem.id),
		activeRollCallSessionId: text().references((): AnyPgColumn => rollCallSession.id, {
			onDelete: 'set null'
		}),
		activeVotingSessionId: text().references((): AnyPgColumn => votingSession.id, {
			onDelete: 'set null'
		}),
		activeDraftResolutionId: text().references((): AnyPgColumn => resolutionPaper.id, {
			onDelete: 'set null'
		}),
		activeAmendmentId: text().references((): AnyPgColumn => amendment.id, {
			onDelete: 'set null'
		}),
		supportReevaluationOpen: boolean().notNull().default(false),
		amendmentSubmissionOpen: boolean().notNull().default(true),
		amendmentSponsoringOpen: boolean().notNull().default(true),
		currentOperativeIndex: smallint().notNull().default(0),
		//TODO should these defaults be set at DB level?
		customSimpleMajority: smallint(), // 50% by default
		customTwoThirdsMajority: smallint(), // 66% by default
		paperSupportThreshold: smallint().notNull().default(10), // percentage, 10% by default
		presentationLayout: text().notNull().default('default'),
		presentationRootFontSize: smallint().notNull().default(16),
		presentationResolutionFontSize: smallint().notNull().default(16),
		displayRegionalGroups: boolean().notNull().default(false),
		lastResolutionAdoptionDate: timestamp({ mode: 'date' })
	},
	(t) => [unique().on(t.conferenceId, t.name), unique().on(t.conferenceId, t.abbreviation)]
);

export const conferenceUserType = pgEnum('conference_user_type', [
	'ADMIN',
	'TEAM',
	'SPECTATOR',
	'DELEGATE',
	'NON_STATE_ACTOR'
]);

export const representationType = pgEnum('representation_type', ['DELEGATION', 'NSA', 'UN']);
export const regionalGroup = pgEnum('regional_group', [
	'AFRICA',
	'ASIA_PACIFIC',
	'EASTERN_EUROPE',
	'LATIN_AMERICA_CARIBBEAN',
	'WESTERN_EUROPE_OTHERS'
]);

export const representation = snakeCase.table(
	'representation',
	{
		...defaultIdAndTimestamps,
		name: text(),
		alpha2Code: text(),
		alpha3Code: text(),
		type: representationType().notNull(),
		faIcon: text(),
		regionalGroup: regionalGroup(),
		conferenceId: text()
			.notNull()
			.references(() => conference.id, { onDelete: 'cascade' })
	},
	(t) => [
		unique().on(t.conferenceId, t.name),
		unique().on(t.conferenceId, t.alpha2Code, t.alpha3Code)
	]
);

export const conferenceMember = snakeCase.table('conference_member', {
	...defaultIdAndTimestamps,
	conferenceId: text()
		.notNull()
		.references(() => conference.id, { onDelete: 'cascade' }),
	representationId: text()
		.notNull()
		.references(() => representation.id)
});

export const committeeMember = snakeCase.table('committee_member', {
	...defaultIdAndTimestamps,
	present: boolean().notNull().default(false),
	committeeId: text()
		.notNull()
		.references(() => committee.id, { onDelete: 'cascade' }),
	representationId: text()
		.notNull()
		.references(() => representation.id)
});

export const conferenceUser = snakeCase.table(
	'conference_user',
	{
		...defaultIdAndTimestamps,
		conferenceUserType: conferenceUserType().notNull(),
		userEmail: text().notNull(), // using email instead of uuid to allow creating OIDC users by email adress without having to wait for the user to create an account
		// optional display name; the user table is created lazily on first OIDC
		// login, so we keep names on the conferenceUser instead. UI falls back to
		// userEmail when null.
		name: text(),
		conferenceId: text()
			.notNull()
			.references(() => conference.id, { onDelete: 'cascade' }),
		conferenceMemberId: text().references(() => conferenceMember.id, { onDelete: 'cascade' }),
		committeeMemberId: text().references(() => committeeMember.id, { onDelete: 'cascade' }),
		// short alphanumeric fallback code printed on NSA badges for manual check-in/out
		// when the QR scanner can't be used. Only set for NON_STATE_ACTOR users.
		attendanceCode: text()
	},
	// Postgres default NULLS DISTINCT keeps the constraint compatible with the many
	// non-NSA users that have attendanceCode = NULL.
	(t) => [unique().on(t.conferenceId, t.attendanceCode), unique().on(t.conferenceId, t.userEmail)]
);

export const agendaItem = snakeCase.table('agenda_item', {
	...defaultIdAndTimestamps,
	committeeId: text()
		.references((): AnyPgColumn => committee.id, { onDelete: 'cascade' })
		.notNull(),
	title: text().notNull()
});

export const speakersListCategory = pgEnum('speakers_list_category', [
	'SPEAKERS_LIST',
	'COMMENT_LIST'
]);

export const speakersListPhase = pgEnum('speakers_list_phase', [
	'SPEECH',
	'SPEECH_DONE',
	'QUESTION',
	'ANSWER',
	'ANSWER_DONE'
]);

export const speakersList = snakeCase.table(
	'speakers_list',
	{
		...defaultIdAndTimestamps,
		agendaItemId: text()
			.references(() => agendaItem.id, { onDelete: 'cascade' })
			.notNull(),
		type: speakersListCategory().notNull(),
		speakingTime: smallint().notNull(),
		timeLeft: smallint().notNull().default(0),
		startTimestamp: timestamp(),
		isClosed: boolean().default(false).notNull(),
		phase: speakersListPhase().default('SPEECH').notNull()
	},
	(t) => [unique().on(t.agendaItemId, t.type)]
);

export const speakerOnList = snakeCase.table(
	'speaker_on_list',
	{
		...defaultIdAndTimestamps,
		committeeMemberId: text().references(() => committeeMember.id, { onDelete: 'cascade' }),
		conferenceMemberId: text().references(() => conferenceMember.id, {
			onDelete: 'cascade'
		}),
		speakersListId: text()
			.references(() => speakersList.id, { onDelete: 'cascade' })
			.notNull(),
		position: smallint().notNull(),
		overwriteName: text()
	},
	(t) => [
		unique().on(t.speakersListId, t.position),
		unique().on(t.speakersListId, t.committeeMemberId),
		unique().on(t.speakersListId, t.conferenceMemberId)
	]
);

export const spokenTimePeriod = snakeCase.table('spoken_time_period', {
	...defaultIdAndTimestamps,
	committeeMemberId: text().references(() => committeeMember.id, { onDelete: 'cascade' }),
	conferenceMemberId: text().references(() => conferenceMember.id, {
		onDelete: 'cascade'
	}),
	speakersListId: text()
		.references(() => speakersList.id, { onDelete: 'cascade' })
		.notNull(),
	startTimestamp: timestamp().notNull(),
	endTimestamp: timestamp().notNull()
});

export const committeeTopicChangedTimestamp = snakeCase.table('committee_topic_changed_timestamp', {
	...defaultIdAndTimestamps,
	committeeId: text().references(() => committee.id, { onDelete: 'cascade' }),
	agendaItemId: text().references(() => agendaItem.id, { onDelete: 'cascade' }),
	timestamp: timestamp().notNull()
});

export const rollCallSession = snakeCase.table('roll_call_session', {
	...defaultIdAndTimestamps,
	committeeId: text()
		.notNull()
		.references(() => committee.id, { onDelete: 'cascade' }),
	startedByConferenceUserId: text().references(() => conferenceUser.id, {
		onDelete: 'set null'
	}),
	currentMemberIndex: integer().notNull().default(0),
	completedAt: timestamp()
});

export const presenceEventMarker = pgEnum('presence_event_marker', [
	'AUTO_SWITCH',
	'ROLL_CALL',
	'NSA_SCAN',
	'MANUAL'
]);
export const presenceEvent = snakeCase.table('presence_event', {
	id: text()
		.$defaultFn(() => nanoid())
		.primaryKey(),

	conferenceUserId: text()
		.notNull()
		.references(() => conferenceUser.id, { onDelete: 'cascade' }),
	committeeId: text()
		.notNull()
		.references(() => committee.id, { onDelete: 'cascade' }),
	// chair/admin who triggered the event; null for system-generated auto-checkouts on switch
	triggeredByConferenceUserId: text().references(() => conferenceUser.id, {
		onDelete: 'set null'
	}),

	rollCallSessionId: text().references(() => rollCallSession.id, {
		onDelete: 'set null'
	}),

	timestamp: timestamp().defaultNow().notNull(),
	present: boolean().notNull(),
	type: presenceEventMarker().notNull(),
	note: text()
});

export const votingMode = pgEnum('voting_mode', ['SHOW_OF_HANDS', 'ROLL_CALL']);
export const votingMajorityType = pgEnum('voting_majority_type', [
	'SIMPLE',
	'ABSOLUTE',
	'TWO_THIRDS'
]);
export const votingStage = pgEnum('voting_stage', ['PRO', 'CON', 'ABSTAIN', 'EVALUATION']);
export const votingOutcome = pgEnum('voting_outcome', ['ADOPTED', 'REJECTED']);
export const voteChoice = pgEnum('vote_choice', ['PRO', 'CON', 'ABSTAIN']);

export const votingSession = snakeCase.table('voting_session', {
	...defaultIdAndTimestamps,
	committeeId: text()
		.notNull()
		.references(() => committee.id, { onDelete: 'cascade' }),
	startedByConferenceUserId: text().references(() => conferenceUser.id, {
		onDelete: 'set null'
	}),
	mode: votingMode().notNull(),
	voteName: text(),
	majority: votingMajorityType().notNull(),
	withAbstentions: boolean().notNull().default(false),
	majorityAmount: integer().notNull(),
	currentStage: votingStage(),
	votesPro: integer().notNull().default(0),
	votesCon: integer().notNull().default(0),
	votesAbstain: integer().notNull().default(0),
	currentMemberIndex: integer().notNull().default(0),
	completedAt: timestamp(),
	outcome: votingOutcome()
});

export const votingVote = snakeCase.table(
	'voting_vote',
	{
		...defaultIdAndTimestamps,
		votingSessionId: text()
			.notNull()
			.references(() => votingSession.id, { onDelete: 'cascade' }),
		committeeMemberId: text()
			.notNull()
			.references(() => committeeMember.id, { onDelete: 'cascade' }),
		vote: voteChoice().notNull()
	},
	(t) => [unique().on(t.votingSessionId, t.committeeMemberId)]
);

// ----------------------------------------------------------------------------
// Resolution feature
// ----------------------------------------------------------------------------

export const paperStatus = pgEnum('paper_status', [
	'WORKING_PAPER',
	'SUBMITTED',
	'DRAFT_RESOLUTION',
	'AMENDMENT_PHASE',
	'VOTING_PHASE',
	'FINAL'
]);

export const amendmentType = pgEnum('amendment_type', [
	'DELETE',
	'ADD',
	'ALTER_TEXT',
	'ALTER_POSITION'
]);

export const amendmentStatus = pgEnum('amendment_status', [
	'PENDING',
	'SUBMITTED',
	'CONSENSUS_ADOPTED',
	'ACCEPTED',
	'REJECTED',
	'WITHDRAWN'
]);

export const amendmentReviewPhase = pgEnum('amendment_review_phase', [
	'OBSOLESCENCE',
	'REWRITE',
	'RESOLVED'
]);

export const shareCodePermission = pgEnum('share_code_permission', ['SPONSOR', 'EDIT']);

export const commentVisibility = pgEnum('comment_visibility', ['PUBLIC', 'TEAM_ONLY']);

export const snapshotTrigger = pgEnum('snapshot_trigger', [
	'SUBMITTED',
	'AMENDMENT_APPLIED',
	'VOTE_CONCLUDED',
	'MANUAL'
]);

export const resolutionPaper = snakeCase.table('resolution_paper', {
	...defaultIdAndTimestamps,
	committeeId: text()
		.notNull()
		.references(() => committee.id, { onDelete: 'cascade' }),
	agendaItemId: text()
		.notNull()
		.references(() => agendaItem.id, { onDelete: 'cascade' }),
	creatorCommitteeMemberId: text()
		.notNull()
		.references(() => committeeMember.id, { onDelete: 'cascade' }),
	status: paperStatus().notNull().default('WORKING_PAPER'),
	title: text(),
	documentNumber: text(),
	// Final resolution-level vote. Tallies and outcome live on the linked
	// votingSession row.
	voteVotingSessionId: text().references((): AnyPgColumn => votingSession.id, {
		onDelete: 'set null'
	})
});

export const paperYjsDoc = snakeCase.table('paper_yjs_doc', {
	...defaultIdAndTimestamps,
	paperId: text()
		.notNull()
		.unique()
		.references(() => resolutionPaper.id, { onDelete: 'cascade' }),
	state: bytea().notNull()
});

export const paperContentSnapshot = snakeCase.table('paper_content_snapshot', {
	...defaultIdAndTimestamps,
	paperId: text()
		.notNull()
		.references(() => resolutionPaper.id, { onDelete: 'cascade' }),
	content: text().notNull(), // JSON serialized Resolution
	trigger: snapshotTrigger().notNull()
});

export const paperSponsor = snakeCase.table(
	'paper_sponsor',
	{
		...defaultIdAndTimestamps,
		paperId: text()
			.notNull()
			.references(() => resolutionPaper.id, { onDelete: 'cascade' }),
		committeeMemberId: text()
			.notNull()
			.references(() => committeeMember.id, { onDelete: 'cascade' })
	},
	(t) => [unique().on(t.paperId, t.committeeMemberId)]
);

export const paperEditor = snakeCase.table(
	'paper_editor',
	{
		...defaultIdAndTimestamps,
		paperId: text()
			.notNull()
			.references(() => resolutionPaper.id, { onDelete: 'cascade' }),
		conferenceUserId: text()
			.notNull()
			.references(() => conferenceUser.id, { onDelete: 'cascade' })
	},
	(t) => [unique().on(t.paperId, t.conferenceUserId)]
);

export const paperShareCode = snakeCase.table('paper_share_code', {
	...defaultIdAndTimestamps,
	paperId: text()
		.notNull()
		.references(() => resolutionPaper.id, { onDelete: 'cascade' }),
	code: text().notNull().unique(),
	permission: shareCodePermission().notNull()
});

export const resolutionComment = snakeCase.table('resolution_comment', {
	...defaultIdAndTimestamps,
	paperId: text()
		.notNull()
		.references(() => resolutionPaper.id, { onDelete: 'cascade' }),
	// References a Y.Doc clause id (string from the library's generateClauseId).
	// Intentionally not a FK — clauses live in the Y.Doc, not the DB.
	clauseId: text(),
	authorConferenceUserId: text()
		.notNull()
		.references(() => conferenceUser.id, { onDelete: 'cascade' }),
	content: text().notNull(),
	visibility: commentVisibility().notNull().default('PUBLIC'),
	parentCommentId: text().references((): AnyPgColumn => resolutionComment.id, {
		onDelete: 'cascade'
	})
});

export const amendment = snakeCase.table('amendment', {
	...defaultIdAndTimestamps,
	paperId: text()
		.notNull()
		.references(() => resolutionPaper.id, { onDelete: 'cascade' }),
	proposerCommitteeMemberId: text()
		.notNull()
		.references(() => committeeMember.id, { onDelete: 'cascade' }),
	type: amendmentType().notNull(),
	status: amendmentStatus().notNull().default('PENDING'),
	// Y.Doc clause id this amendment targets. Stored as plain text — not a FK.
	targetClauseId: text(),
	// Snapshot of the operative index at proposal time (used to detect stale targets).
	targetOperativeIndex: smallint(),
	// RES-Markup fragment for ADD / ALTER_TEXT.
	newContent: text(),
	// RES-Markup fragment for ADD / ALTER_TEXT (store the old value of the clause for direct comparison after acceptance).
	oldContent: text(),
	// Destination index for ADD / ALTER_POSITION.
	targetPosition: smallint(),
	documentNumber: text(),
	// Set when this amendment is stamped as the active beamer amendment, gives ordering ground truth.
	presentedAt: timestamp(),
	// Set when this amendment was withdrawn because another was accepted and rendered it obsolete.
	obsoletedByAmendmentId: text().references((): AnyPgColumn => amendment.id, {
		onDelete: 'set null'
	})
});

export const amendmentSponsor = snakeCase.table(
	'amendment_sponsor',
	{
		...defaultIdAndTimestamps,
		amendmentId: text()
			.notNull()
			.references(() => amendment.id, { onDelete: 'cascade' }),
		committeeMemberId: text()
			.notNull()
			.references(() => committeeMember.id, { onDelete: 'cascade' })
	},
	(t) => [unique().on(t.amendmentId, t.committeeMemberId)]
);

export const operativeClauseVote = snakeCase.table(
	'operative_clause_vote',
	{
		...defaultIdAndTimestamps,
		paperId: text()
			.notNull()
			.references(() => resolutionPaper.id, { onDelete: 'cascade' }),
		clauseId: text().notNull(),
		// Reference row only — the actual vote tally + outcome live on the
		// linked votingSession.
		votingSessionId: text()
			.notNull()
			.references(() => votingSession.id, { onDelete: 'cascade' })
	},
	(t) => [unique().on(t.paperId, t.clauseId)]
);

// One row per (accepted amendment × affected remaining amendment). Drives the
// post-acceptance review flow. The review for a paper is complete when all rows
// for that paper have resolved = true.
export const amendmentReviewItem = snakeCase.table('amendment_review_item', {
	...defaultIdAndTimestamps,
	paperId: text()
		.notNull()
		.references(() => resolutionPaper.id, { onDelete: 'cascade' }),
	// The amendment that was accepted and triggered this review.
	triggerAmendmentId: text()
		.notNull()
		.references(() => amendment.id, { onDelete: 'cascade' }),
	// The amendment whose fate is being decided in this review item.
	subjectAmendmentId: text()
		.notNull()
		.references(() => amendment.id, { onDelete: 'cascade' }),
	phase: amendmentReviewPhase().notNull(),
	// ai suggestion for this amendment's fate
	aiObsolete: boolean(),
	aiRewriteSuggestion: text(),
	// Human verdict to be set by the chair/admin
	verdictObsolete: boolean(),
	verdictRewrite: text()
});
