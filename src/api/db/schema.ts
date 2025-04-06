import { integer, pgTable, serial, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { relations, sql } from 'drizzle-orm';

export const user = pgTable('user', {
	// since we set the ID from the auth provider we can't make sure the ID is a uuid
	id: text('id').primaryKey().unique().notNull(),
	email: text('email').notNull().unique(),
	familyName: text('family_name').notNull(),
	givenName: text('given_name').notNull(),
	locale: text('locale').notNull(),
	preferredUsername: text('preferred_username').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.notNull()
		.$onUpdate(() => new Date())
});

export const userRelations = relations(user, ({ many }) => ({
	messages: many(message)
}));

export const message = pgTable('message', {
	id: uuid('id').defaultRandom().primaryKey().unique().notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.notNull()
		.$onUpdate(() => new Date()),
	content: text('content').notNull(),
	userId: text('user_id')
		.notNull()
		.unique()
		.references(() => user.id, { onDelete: 'cascade' })
});

export const messageRelations = relations(message, ({ one }) => ({
	user: one(user, {
		fields: [message.userId],
		references: [user.id]
	})
}));
