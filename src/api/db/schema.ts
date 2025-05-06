import {
	pgTable,
	text,
	timestamp,
	unique,
	uuid,
	pgEnum,
	boolean,
	smallint,
	type AnyPgColumn
} from 'drizzle-orm/pg-core';

const defaultTimestamps = {
	createdAt: timestamp().defaultNow().notNull(),
	updatedAt: timestamp({ mode: 'date' })
		.defaultNow()
		.$onUpdate(() => new Date())
};
const defaultIdAndTimestamps = {
	id: uuid().defaultRandom().primaryKey().notNull(),
	...defaultTimestamps
};

export const user = pgTable('user', {
	// we can't use uuid for this because the ID provider might not stick to uuid format
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
	pressWebsite: text()
});

export const committeeStatus = pgEnum('committee_status', [
	'FORMAL',
	'INFORMAL',
	'PAUSE',
	'SUSPENSION'
]);

export const committee = pgTable(
	'committee',
	{
		...defaultIdAndTimestamps,
		name: text().notNull(),
		abbreviation: text().notNull(),
		conferenceId: uuid()
			.notNull()
			.references(() => conference.id, { onDelete: 'cascade' }),
		whiteboardContent: text().default('<p></p>'),
		showWhiteboard: boolean().notNull().default(true),
		status: committeeStatus().notNull().default('SUSPENSION'),
		statusHeadline: text().notNull().default(''),
		statusUntil: timestamp({ mode: 'date' }).defaultNow().notNull(),
		stateOfDebate: text(),
		allowDelegationsToAddThemselvesToSpeakersList: boolean().notNull().default(false),
		activeAgendaItemId: uuid().references((): AnyPgColumn => agendaItem.id),
		customSimpleMajority: smallint(), // 50% by default
		customTwoThirdsMajority: smallint(), // 66% by default
		customPaperSupportThreshold: smallint() // 10% by default
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

export const conferenceUser = pgTable('conference_user', {
	...defaultIdAndTimestamps,
	conferenceUserType: conferenceUserType().notNull(),
	userId: text()
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	conferenceId: uuid()
		.notNull()
		.references(() => conference.id, { onDelete: 'cascade' }),
	conferenceMemberId: uuid(),
	committeeMemberId: uuid()
});

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
		regionalGroup: regionalGroup(),
		conferenceId: uuid()
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
	conferenceId: uuid()
		.notNull()
		.references(() => conference.id, { onDelete: 'cascade' }),
	representationId: uuid()
		.notNull()
		.references(() => representation.id)
});

export const committeeMember = pgTable('committee_member', {
	...defaultIdAndTimestamps,
	present: boolean().notNull().default(false),
	committeeId: uuid()
		.notNull()
		.references(() => committee.id, { onDelete: 'cascade' }),
	representationId: uuid()
		.notNull()
		.references(() => representation.id)
});

export const agendaItem = pgTable('agenda_item', {
	...defaultIdAndTimestamps,
	committeeId: uuid()
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
		agendaItemId: uuid()
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
		committeeMemberId: uuid().references(() => committeeMember.id, { onDelete: 'cascade' }),
		conferenceMemberId: uuid().references((): AnyPgColumn => conferenceMember.id, {
			onDelete: 'cascade'
		}),
		speakersListId: uuid()
			.references(() => speakersList.id, { onDelete: 'cascade' })
			.notNull(),
		position: smallint().notNull()
	},
	(t) => [
		unique().on(t.speakersListId, t.position),
		unique().on(t.speakersListId, t.committeeMemberId),
		unique().on(t.speakersListId, t.conferenceMemberId)
	]
);
