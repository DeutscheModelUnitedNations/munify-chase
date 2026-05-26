import { nanoid } from '../../lib/helpers/nanoid';
import {
	pgTable,
	text,
	timestamp,
	date,
	unique,
	pgEnum,
	boolean,
	smallint,
	index,
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
		customTwoThirdsMajority: smallint() // 66% by default
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

export const conferenceUser = pgTable(
	'conference_user',
	{
		...defaultIdAndTimestamps,
		conferenceUserType: conferenceUserType().notNull(),
		userEmail: text().notNull().unique(), // using email instead of uuid to allow creating OIDC users by email adress without having to wait for the user to create an account
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

export const presenceEventType = pgEnum('presence_event_type', ['CHECK_IN', 'CHECK_OUT']);
export const presenceEventMarker = pgEnum('presence_event_marker', ['AUTO_SWITCH']);
export const presenceEvent = pgTable('presence_event', {
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
	triggeredByConferenceUserId: text().references((): AnyPgColumn => conferenceUser.id, {
		onDelete: 'set null'
	}),

	timestamp: timestamp().defaultNow().notNull(),
	eventType: presenceEventType().notNull(),
	marker: presenceEventMarker(),
	note: text()
});
