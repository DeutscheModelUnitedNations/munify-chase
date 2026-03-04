import { nanoid } from '../../lib/helpers/nanoid';
import {
	pgTable,
	text,
	timestamp,
	unique,
	pgEnum,
	boolean,
	smallint,
	integer,
	json,
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

export const user = pgTable('user', {
	id: text().primaryKey().unique().notNull(),
	...defaultTimestamps,

	// OIDC fields
	email: text().notNull().unique(),
	familyName: text().notNull(),
	givenName: text().notNull(),
	locale: text(),
	preferredUsername: text().notNull()
});

export const conference = pgTable('conference', {
	...defaultIdAndTimestamps,
	title: text().notNull(),
	pressWebsite: text(),
	hasModeratedCaucus: boolean().notNull().default(false)
});

export const committeeStatus = pgEnum('committee_status', [
	'FORMAL',
	'INFORMAL',
	'MODERATED_INFORMAL',
	'PAUSE',
	'SUSPENSION'
]);

export const committee = pgTable(
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
		activeAgendaItemId: text().references((): AnyPgColumn => agendaItem.id),
		//TODO should these defaults be set at DB level?
		customSimpleMajority: smallint(), // 50% by default
		customTwoThirdsMajority: smallint(), // 66% by default
		customPaperSupportThreshold: smallint(), // 10% by default
		lastResolutionAdoptionDate: timestamp({ mode: 'date' }),
		maxDraftResolutions: smallint().notNull().default(3),
		activeDraftResolutionId: text().references((): AnyPgColumn => resolutionPaper.id),
		currentOperativeIndex: smallint(),
		supportReEvaluationOpen: boolean().notNull().default(false)
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

export const representation = pgTable(
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

export const conferenceMember = pgTable('conference_member', {
	...defaultIdAndTimestamps,
	conferenceId: text()
		.notNull()
		.references(() => conference.id, { onDelete: 'cascade' }),
	representationId: text()
		.notNull()
		.references(() => representation.id)
});

export const committeeMember = pgTable('committee_member', {
	...defaultIdAndTimestamps,
	present: boolean().notNull().default(false),
	committeeId: text()
		.notNull()
		.references(() => committee.id, { onDelete: 'cascade' }),
	representationId: text()
		.notNull()
		.references(() => representation.id)
});

export const conferenceUser = pgTable('conference_user', {
	...defaultIdAndTimestamps,
	conferenceUserType: conferenceUserType().notNull(),
	userEmail: text().notNull(), // using email instead of uuid to allow creating OIDC users by email adress without having to wait for the user to create an account
	conferenceId: text()
		.notNull()
		.references(() => conference.id, { onDelete: 'cascade' }),
	conferenceMemberId: text().references(() => conferenceMember.id, { onDelete: 'cascade' }),
	committeeMemberId: text().references(() => committeeMember.id, { onDelete: 'cascade' })
});

export const agendaItem = pgTable('agenda_item', {
	...defaultIdAndTimestamps,
	committeeId: text()
		.references(() => committee.id, { onDelete: 'cascade' })
		.notNull(),
	title: text().notNull()
});

export const speakersListCategory = pgEnum('speakers_list_category', [
	'SPEAKERS_LIST',
	'COMMENT_LIST'
]);

export const speakersList = pgTable(
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
		isClosed: boolean().default(false).notNull()
	},
	(t) => [unique().on(t.agendaItemId, t.type)]
);

export const speakerOnList = pgTable(
	'speaker_on_list',
	{
		...defaultIdAndTimestamps,
		committeeMemberId: text().references(() => committeeMember.id, { onDelete: 'cascade' }),
		conferenceMemberId: text().references((): AnyPgColumn => conferenceMember.id, {
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

export const spokenTimePeriod = pgTable('spoken_time_period', {
	...defaultIdAndTimestamps,
	committeeMemberId: text().references(() => committeeMember.id, { onDelete: 'cascade' }),
	conferenceMemberId: text().references((): AnyPgColumn => conferenceMember.id, {
		onDelete: 'cascade'
	}),
	speakersListId: text()
		.references(() => speakersList.id, { onDelete: 'cascade' })
		.notNull(),
	startTimestamp: timestamp().notNull(),
	endTimestamp: timestamp().notNull()
});

export const committeeTopicChangedTimestamp = pgTable('committee_topic_changed_timestamp', {
	...defaultIdAndTimestamps,
	committeeId: text().references(() => committee.id, { onDelete: 'cascade' }),
	agendaItemId: text().references(() => agendaItem.id, { onDelete: 'cascade' }),
	timestamp: timestamp().notNull()
});

export const presenceChangedTimestamp = pgTable('presence_changed_timestamp', {
	...defaultIdAndTimestamps,
	committeeMemberId: text()
		.notNull()
		.references(() => committeeMember.id, { onDelete: 'cascade' }),
	timestamp: timestamp().notNull(),
	presentSetTo: boolean().notNull()
});

// Resolution enums

export const paperStatus = pgEnum('paper_status', [
	'WORKING_PAPER',
	'SUBMITTED',
	'DRAFT_RESOLUTION',
	'AMENDMENT_PHASE',
	'FINAL'
]);

export const shareCodePermission = pgEnum('share_code_permission', ['SPONSOR', 'EDIT']);

export const commentVisibility = pgEnum('comment_visibility', ['PUBLIC', 'TEAM_ONLY']);

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

export const voteOutcome = pgEnum('vote_outcome', ['ADOPTED', 'REJECTED', 'SENT_BACK']);

// Resolution tables

export const resolutionPaper = pgTable('resolution_paper', {
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
	content: json(),
	title: text(),
	documentNumber: text(),
	sequenceNumber: smallint(),
	deletedAt: timestamp()
});

export const paperContentSnapshot = pgTable('paper_content_snapshot', {
	...defaultIdAndTimestamps,
	paperId: text()
		.notNull()
		.references(() => resolutionPaper.id, { onDelete: 'cascade' }),
	content: json(),
	trigger: text()
});

export const paperSponsor = pgTable(
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

export const paperShareCode = pgTable('paper_share_code', {
	...defaultIdAndTimestamps,
	paperId: text()
		.notNull()
		.references(() => resolutionPaper.id, { onDelete: 'cascade' }),
	code: text().notNull().unique(),
	permission: shareCodePermission().notNull()
});

export const paperEditor = pgTable(
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

export const resolutionComment = pgTable('resolution_comment', {
	...defaultIdAndTimestamps,
	paperId: text()
		.notNull()
		.references(() => resolutionPaper.id, { onDelete: 'cascade' }),
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

export const amendment = pgTable('amendment', {
	...defaultIdAndTimestamps,
	paperId: text()
		.notNull()
		.references(() => resolutionPaper.id, { onDelete: 'cascade' }),
	proposerCommitteeMemberId: text()
		.notNull()
		.references(() => committeeMember.id, { onDelete: 'cascade' }),
	type: amendmentType().notNull(),
	status: amendmentStatus().notNull().default('PENDING'),
	targetClauseId: text(),
	targetOperativeIndex: smallint(),
	newContent: json(),
	targetPosition: smallint()
});

export const amendmentSponsor = pgTable(
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

export const operativeClauseVote = pgTable('operative_clause_vote', {
	...defaultIdAndTimestamps,
	paperId: text()
		.notNull()
		.references(() => resolutionPaper.id, { onDelete: 'cascade' }),
	clauseId: text().notNull(),
	outcome: voteOutcome().notNull(),
	votesFor: integer().notNull(),
	votesAgainst: integer().notNull(),
	votesAbstain: integer().notNull().default(0)
});

export const paperClauseLock = pgTable(
	'paper_clause_lock',
	{
		...defaultIdAndTimestamps,
		paperId: text()
			.notNull()
			.references(() => resolutionPaper.id, { onDelete: 'cascade' }),
		clauseId: text().notNull(),
		conferenceUserId: text()
			.notNull()
			.references(() => conferenceUser.id, { onDelete: 'cascade' }),
		acquiredAt: timestamp({ mode: 'date' }).defaultNow().notNull()
	},
	(t) => [unique().on(t.paperId, t.clauseId)]
);

export const resolutionVoteResult = pgTable('resolution_vote_result', {
	...defaultIdAndTimestamps,
	paperId: text()
		.notNull()
		.unique()
		.references(() => resolutionPaper.id, { onDelete: 'cascade' }),
	outcome: voteOutcome().notNull(),
	votesFor: integer().notNull(),
	votesAgainst: integer().notNull(),
	votesAbstain: integer().notNull().default(0)
});
