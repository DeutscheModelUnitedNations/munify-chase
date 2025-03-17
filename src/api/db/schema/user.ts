import { boolean, integer, pgTable, serial, text } from "drizzle-orm/pg-core";

import { relations } from "drizzle-orm";

export const users = pgTable("users", {
	id: serial("id").primaryKey(),
	name: text("name").notNull(),
});

export const usersRelations = relations(users, ({ one, many }) => ({
	posts: many(posts),
}));

export const posts = pgTable("posts", {
	id: serial("id").primaryKey(),
	content: text("content").notNull(),
	authorId: integer("author_id").references(() => users.id, {
		onDelete: "cascade",
	}),
});

export const postsRelations = relations(posts, ({ one, many }) => ({
	author: one(users, { fields: [posts.authorId], references: [users.id] }),
}));