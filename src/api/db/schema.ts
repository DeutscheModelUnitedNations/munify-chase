import { pgTable, text, timestamp, unique, uuid, pgEnum, boolean } from 'drizzle-orm/pg-core';
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
		.$onUpdate(() => sql`now() `)
});

export const usersRelations = relations(user, ({ one, many }) => ({
	conferenceMemberships: many(conferenceMember)
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
	members: many(conferenceMember)
}));

export const committeeStatus = pgEnum('committee_status', [
	'formal',
	'informal',
	'pause',
	'suspension'
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
		status: committeeStatus('status').notNull().default('suspension'),
		statusHeadline: text('status_headline').default(''),
		statusUntil: timestamp('status_until')
			.notNull()
			.default(sql`now()`),
		stateOfDebate: text('state_of_debate').default(''),
		allowDelegationsToAddThemselvesToSpeakersList: boolean(
			'allow_delegations_to_add_themselves_to_speakers_list'
		)
			.notNull()
			.default(false)
	},
	(t) => [unique().on(t.conferenceId, t.name), unique().on(t.conferenceId, t.abbreviation)]
);

export const committeeRelations = relations(committee, ({ one }) => ({
	conference: one(conference, {
		fields: [committee.conferenceId],
		references: [conference.id]
	})
}));

export const conferenceRole = pgEnum('role', ['admin', 'team', 'spectator', 'participant']);

export const conferenceMember = pgTable('conference_member', {
	id: uuid('id').primaryKey().unique().notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.notNull()
		.$onUpdate(() => sql`now()`),
	role: conferenceRole('conference_role').notNull(),
	userId: text('user')
		.notNull()
		.references(() => user.id),
	conferenceId: uuid('conference')
		.notNull()
		.references(() => conference.id)
});

export const conferenceMemberRelations = relations(conferenceMember, ({ one }) => ({
	user: one(user, {
		fields: [conferenceMember.userId],
		references: [user.id]
	}),
	conference: one(conference, {
		fields: [conferenceMember.conferenceId],
		references: [conference.id]
	})
}));

export const committeeMember = pgTable('committee_member', {
	id: uuid('id').primaryKey().unique().notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.notNull()
		.$onUpdate(() => sql`now()`),
	present: boolean('present').notNull().default(false),
	conferenceMemberId: uuid('conference_member')
		.notNull()
		.references(() => conferenceMember.id),
	committeeId: uuid('committee')
		.notNull()
		.references(() => committee.id),
	role: text('role').notNull() // ??? Really a good idea? (Nicht wertend gemeint, total objektiv)
});

export const committeeMemberRelations = relations(committeeMember, ({ one }) => ({
	conferenceMember: one(conferenceMember, {
		fields: [committeeMember.conferenceMemberId],
		references: [conferenceMember.id]
	}),
	committee: one(committee, {
		fields: [committeeMember.committeeId],
		references: [committee.id]
	})
}));
