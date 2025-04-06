import { integer, pgTable, serial, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { relations, sql } from 'drizzle-orm';

export const user = pgTable('user', {
	id: uuid('id').defaultRandom().primaryKey().unique().notNull(),
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

// export const usersRelations = relations(users, ({ many }) => ({
// 	posts: many(posts)
// }));
