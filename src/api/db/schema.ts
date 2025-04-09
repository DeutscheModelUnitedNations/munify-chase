import {
	pgTable,
	text,
	timestamp,
	unique,
	uuid,
	pgEnum,
	boolean,
	smallint,
	primaryKey,
	type AnyPgColumn
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

export const user = pgTable('user', {
	// we can't use uuid for this because the ID provider might not stick to uuid format
	id: text('id').primaryKey().unique().notNull(),
	email: text('email').notNull().unique(),
	familyName: text('family_name').notNull(),
	givenName: text('given_name').notNull(),
	locale: text('locale').notNull(),
	preferredUsername: text('preferred_username').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.notNull()
		.$onUpdate(() => sql`now()`)
});

export const usersRelations = relations(user, ({ one, many }) => ({
	conferenceMemberships: many(conferenceUser)
}));

export const conference = pgTable('conference', {
	id: uuid('id').primaryKey().unique().notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.notNull()
		.$onUpdate(() => sql`now()`),
	enabled: boolean('enabled').notNull().default(true),
	pressWebsite: text('press_website')
});

export const conferenceRelations = relations(conference, ({ one, many }) => ({
	committees: many(committee),
	members: many(conferenceUser)
}));

export const committeeStatus = pgEnum('committee_status', [
	'FORMAL',
	'INFORMAL',
	'PAUSE',
	'SUSPENSION'
]);

export const committee = pgTable(
	'committee',
	{
		id: uuid('id').primaryKey().unique().notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at')
			.notNull()
			.$onUpdate(() => sql`now()`),
		name: text('name').notNull(),
		abbreviation: text('abbreviation').notNull(),
		conferenceId: uuid('conference')
			.notNull()
			.references(() => conference.id),
		whiteboardContent: text('whiteboard_content').default('<p>Whiteboard</p>'),
		showWhiteboard: boolean('show_whiteboard').notNull().default(true),
		status: committeeStatus('status').notNull().default('SUSPENSION'),
		statusHeadline: text('status_headline').default(''),
		statusUntil: timestamp('status_until')
			.notNull()
			.default(sql`now()`),
		stateOfDebate: text('state_of_debate').default(''),
		allowDelegationsToAddThemselvesToSpeakersList: boolean(
			'allow_delegations_to_add_themselves_to_speakers_list'
		)
			.notNull()
			.default(false),
		activeAgendaItemId: uuid('active_agenda_item').references((): AnyPgColumn => agendaItem.id)
	},
	(t) => [unique().on(t.conferenceId, t.name), unique().on(t.conferenceId, t.abbreviation)]
);

export const committeeRelations = relations(committee, ({ one, many }) => ({
	conference: one(conference, {
		fields: [committee.conferenceId],
		references: [conference.id]
	}),
	activeAgendaItem: one(agendaItem, {
		fields: [committee.activeAgendaItemId],
		references: [agendaItem.id]
	}),
	agendaItems: many(agendaItem)
}));

export const conferenceUserType = pgEnum('conferenceUserType', [
	'ADMIN',
	'TEAM',
	'SPECTATOR',
	'DELEGATE',
	'NON_STATE_ACTOR'
]);

export const conferenceUser = pgTable('conference_user', {
	id: uuid('id').primaryKey().unique().notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.notNull()
		.$onUpdate(() => sql`now()`),
	conferenceUserType: conferenceUserType('conference_user_type').notNull(),
	userId: text('user')
		.notNull()
		.references(() => user.id),
	conferenceId: uuid('conference')
		.notNull()
		.references(() => conference.id),
	conferenceMemberId: uuid('conference_member'),
	committeeMemberId: uuid('committee_member')
});

export const conferenceUserRelations = relations(conferenceUser, ({ one }) => ({
	user: one(user, {
		fields: [conferenceUser.userId],
		references: [user.id]
	}),
	conference: one(conference, {
		fields: [conferenceUser.conferenceId],
		references: [conference.id]
	})
}));

export const representationType = pgEnum('representationType', ['DELEGATION', 'NSA', 'UN']);

export const representation = pgTable('representation', {
	id: uuid('id').primaryKey().unique().notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.notNull()
		.$onUpdate(() => sql`now()`),
	name: text(),
	alpha2Code: text(),
	alpha3Code: text(),
	type: representationType().notNull()
});

export const conferenceMember = pgTable('conference_member', {
	id: uuid('id').primaryKey().unique().notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.notNull()
		.$onUpdate(() => sql`now()`),
	representationId: uuid('representation')
		.notNull()
		.references(() => representation.id)
});

export const committeeMember = pgTable('committee_member', {
	id: uuid('id').primaryKey().unique().notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.notNull()
		.$onUpdate(() => sql`now()`),
	present: boolean('present').notNull().default(false),
	committeeId: uuid('committee')
		.notNull()
		.references(() => committee.id),
	representationId: uuid('representation')
		.notNull()
		.references(() => representation.id)
});

export const committeeMemberRelations = relations(committeeMember, ({ one, many }) => ({
	conferenceMember: one(conferenceUser, {
		fields: [committeeMember.conferenceMemberId],
		references: [conferenceUser.id]
	}),
	committee: one(committee, {
		fields: [committeeMember.committeeId],
		references: [committee.id]
	}),
	speakerOnList: many(speakerOnList)
}));

export const agendaItem = pgTable('agenda_item', {
	id: uuid('id').primaryKey().unique().notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.notNull()
		.$onUpdate(() => sql`now()`),
	committeeId: uuid('committee')
		.references(() => committee.id, { onDelete: 'cascade' })
		.notNull(),
	title: text('title').notNull()
});

export const agendaItemRelations = relations(agendaItem, ({ one }) => ({
	committee: one(committee, {
		fields: [agendaItem.committeeId],
		references: [committee.id]
	})
}));

export const speakersListCategory = pgEnum('committee_status', ['SPEAKERS_LIST', 'COMMENT_LIST']);

export const speakersList = pgTable(
	'speakers_list',
	{
		id: uuid('id').primaryKey().unique().notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at')
			.notNull()
			.$onUpdate(() => sql`now()`),
		agendaItemId: uuid('agendaItem')
			.references(() => committee.id, { onDelete: 'cascade' })
			.notNull(),
		type: speakersListCategory().notNull(),
		speakingTime: smallint().notNull(),
		timeLeft: smallint().notNull().default(0),
		startTimestamp: timestamp(),
		isClosed: boolean().default(false).notNull()
	},
	(t) => [unique().on(t.agendaItemId, t.type)]
);

export const speakersListRelations = relations(speakersList, ({ many }) => ({
	agendaItems: many(agendaItem),
	speakers: many(speakerOnList)
}));

export const speakerOnList = pgTable(
	'speaker_on_list',
	{
		id: uuid('id').primaryKey().unique().notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at')
			.notNull()
			.$onUpdate(() => sql`now()`),
		committeeMemberId: uuid('committee_member')
			.references(() => committeeMember.id)
			.notNull(),
		speakersListId: uuid('speakers_list')
			.references(() => speakersList.id)
			.notNull(),
		position: smallint().notNull()
	},
	(t) => [
		unique().on(t.speakersListId, t.position),
		unique().on(t.speakersListId, t.committeeMemberId)
	]
);

export const speakerOnListRelations = relations(speakerOnList, ({ one }) => ({
	speakersList: one(speakersList, {
		fields: [speakerOnList.speakersListId],
		references: [speakersList.id]
	}),
	committeeMember: one(committeeMember, {
		fields: [speakerOnList.committeeMemberId],
		references: [committeeMember.id]
	})
}));
