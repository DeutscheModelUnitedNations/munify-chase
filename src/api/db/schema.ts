import {
	integer,
	pgTable,
	serial,
	text,
	timestamp,
	unique,
	uuid,
	pgEnum,
	boolean
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

// id String @id @default(nanoid())

// // these are OIDC fields and only will be updated by the issuer in the login flow
// email              String @unique
// family_name        String
// given_name         String
// locale             String
// preferred_username String

// createdAt DateTime @default(now())
// updatedAt DateTime @default(now()) @updatedAt

export const user = pgTable('user', {
	id: uuid('id').primaryKey().unique().notNull(),
	name: text('name').notNull(),
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

export const conference = pgTable('conference', {
	id: uuid('id').primaryKey().unique().notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.notNull()
		.$onUpdate(() => sql`now()`),
	enabled: boolean('enabled').notNull().default(true),
	pressWebsite: text('press_website')
});

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

export const conferenceRole = pgEnum('role', ['admin', 'team', 'spectator', 'participant']);

export const conferenceMember = pgTable('conference_member', {
	id: uuid('id').primaryKey().unique().notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.notNull()
		.$onUpdate(() => sql`now()`),
	role: conferenceRole('conference_role').notNull(),
	userId: uuid('user').references(() => user.id),
	conferenceId: uuid('conference')
		.notNull()
		.references(() => conference.id)
});

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
	committeeId: uuid('committee').references(() => committee.id),
	role: text('role').notNull() // ??? Really a good idea? (Nicht wertend gemeint, total objektiv)
});

// export const usersRelations = relations(users, ({ many }) => ({
// 	posts: many(posts)
// }));
