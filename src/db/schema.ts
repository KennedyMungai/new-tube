import { relations } from "drizzle-orm";
import {
	pgTable,
	text,
	timestamp,
	uniqueIndex,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable(
	"users",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		clerkId: varchar("clerk_id", { length: 255 }).unique().notNull(),
		name: varchar("name", { length: 255 }).notNull(),
		// TODO: Add banner fields
		// bannerUrl: varchar("banner_url", { length: 255 }).notNull(),
		imageUrl: varchar("image_url", { length: 512 }).notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at").defaultNow().notNull(),
	},
	(t) => [uniqueIndex("clerk_id_idx").on(t.clerkId)],
);

export const userRelations = relations(users, ({ many }) => ({
	videos: many(videos),
}));

export const categories = pgTable(
	"categories",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		name: varchar("name", { length: 255 }).unique().notNull(),
		description: text("description"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at").defaultNow().notNull(),
	},
	(t) => [uniqueIndex("name_idx").on(t.name)],
);

export const categoryRelations = relations(categories, ({ many }) => ({
	videos: many(videos),
}));

export const videos = pgTable("videos", {
	id: uuid("id").defaultRandom().primaryKey(),
	title: varchar("title", { length: 255 }).notNull(),
	description: text("description"),
	userId: uuid("user_id")
		.references(() => users.id, { onDelete: "cascade" })
		.notNull(),
	categoryId: uuid("category_id").references(() => categories.id, {
		onDelete: "set null",
	}),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const videoRelations = relations(videos, ({ one }) => ({
	user: one(users, {
		fields: [videos.userId],
		references: [users.id],
	}),
	category: one(categories, {
		fields: [videos.categoryId],
		references: [categories.id],
	}),
}));
