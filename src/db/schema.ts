import {
	pgTable,
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
