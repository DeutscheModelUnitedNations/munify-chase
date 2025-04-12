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

const defaultIdAndTimestamps = {
	id: uuid().primaryKey().notNull(),
	createdAt: timestamp().defaultNow().notNull(),
	updatedAt: timestamp()
		.notNull()
		.$onUpdate(() => sql`now()`)
};
const defaultTimestamps = {
	createdAt: timestamp().defaultNow().notNull(),
	updatedAt: timestamp()
		.notNull()
		.$onUpdate(() => sql`now()`)
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

export const usersRelations = relations(user, ({ one, many }) => ({
	conferenceMemberships: many(conferenceUser)
}));

export const conference = pgTable('conference', {
	...defaultIdAndTimestamps,
	enabled: boolean().notNull().default(true),
	pressWebsite: text()
});

export const conferenceRelations = relations(conference, ({ one, many }) => ({
	committees: many(committee),
	users: many(conferenceUser),
	members: many(conferenceMember)
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
		...defaultIdAndTimestamps,
		name: text().notNull(),
		abbreviation: text().notNull(),
		conferenceId: uuid()
			.notNull()
			.references(() => conference.id, { onDelete: 'cascade' }),
		whiteboardContent: text().default('<p>Whiteboard</p>'),
		showWhiteboard: boolean().notNull().default(true),
		status: committeeStatus().notNull().default('SUSPENSION'),
		statusHeadline: text().notNull().default(''),
		statusUntil: timestamp()
			.notNull()
			.default(sql`now()`),
		stateOfDebate: text(),
		allowDelegationsToAddThemselvesToSpeakersList: boolean().notNull().default(false),
		activeAgendaItemId: uuid().references((): AnyPgColumn => agendaItem.id)
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
		references: [agendaItem.id],
		relationName: 'activeAgendaItem'
	}),
	agendaItems: many(agendaItem, {
		relationName: 'associatedAgendaItems'
	}),
	members: many(committeeMember)
}));

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

export const representationType = pgEnum('representation_type', ['DELEGATION', 'NSA', 'UN']);

export const representation = pgTable('representation', {
	...defaultIdAndTimestamps,
	name: text(),
	alpha2Code: text(),
	alpha3Code: text(),
	type: representationType().notNull()
});

export const representationRelations = relations(representation, ({ many }) => ({
	conferenceMembers: many(conferenceMember),
	committeeMembers: many(committeeMember)
}));

export const conferenceMember = pgTable('conference_member', {
	...defaultIdAndTimestamps,
	conferenceId: uuid()
		.notNull()
		.references(() => conference.id, { onDelete: 'cascade' }),
	representationId: uuid()
		.notNull()
		.references(() => representation.id)
});

export const conferenceMemberRelations = relations(conferenceMember, ({ one, many }) => ({
	conference: one(conference, {
		fields: [conferenceMember.conferenceId],
		references: [conference.id]
	}),
	representation: one(representation, {
		fields: [conferenceMember.representationId],
		references: [representation.id]
	}),
	speakerOnList: many(speakerOnList)
}));

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

export const committeeMemberRelations = relations(committeeMember, ({ one, many }) => ({
	committee: one(committee, {
		fields: [committeeMember.committeeId],
		references: [committee.id]
	}),
	representation: one(representation, {
		fields: [committeeMember.representationId],
		references: [representation.id]
	}),
	speakerOnList: many(speakerOnList)
}));

export const agendaItem = pgTable('agenda_item', {
	...defaultIdAndTimestamps,
	committeeId: uuid()
		.references(() => committee.id, { onDelete: 'cascade' })
		.notNull(),
	title: text().notNull()
});

export const agendaItemRelations = relations(agendaItem, ({ one }) => ({
	committee: one(committee, {
		fields: [agendaItem.committeeId],
		references: [committee.id],
		relationName: 'associatedAgendaItems'
	}),
	speakersList: one(speakersList, {
		fields: [agendaItem.id],
		references: [speakersList.agendaItemId]
	})
}));

export const speakersListCategory = pgEnum('speakers_list_category', [
	'SPEAKERS_LIST',
	'COMMENT_LIST'
]);

export const speakersList = pgTable(
	'speakers_list',
	{
		...defaultIdAndTimestamps,
		agendaItemId: uuid()
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

export const speakersListRelations = relations(speakersList, ({ many, one }) => ({
	agendaItem: one(agendaItem, {
		fields: [speakersList.agendaItemId],
		references: [agendaItem.id]
	}),
	speakers: many(speakerOnList)
}));

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

export const speakerOnListRelations = relations(speakerOnList, ({ one }) => ({
	speakersList: one(speakersList, {
		fields: [speakerOnList.speakersListId],
		references: [speakersList.id]
	}),
	committeeMember: one(committeeMember, {
		fields: [speakerOnList.committeeMemberId],
		references: [committeeMember.id]
	}),
	conferenceMember: one(conferenceMember, {
		fields: [speakerOnList.conferenceMemberId],
		references: [conferenceMember.id]
	})
}));
