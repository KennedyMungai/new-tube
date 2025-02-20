import { relations } from "drizzle-orm";
import {
	foreignKey,
	integer,
	pgEnum,
	pgTable,
	primaryKey,
	text,
	timestamp,
	uniqueIndex,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import {
	createInsertSchema,
	createSelectSchema,
	createUpdateSchema,
} from "drizzle-zod";

export const reactionType = pgEnum("reaction_type", ["like", "dislike"]);

export const videoVisibility = pgEnum("video_visibility", [
	"public",
	"private",
]);

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
	videoView: many(videoViews),
	videoReaction: many(videoReactions),
	subscriptions: many(subscriptions, {
		relationName: "subscriptions_viewerId_fk",
	}),
	creators: many(subscriptions, { relationName: "subscriptions_creatorId_fk" }),
	comments: many(comments),
	commentReactions: many(commentReactions),
	playlists: many(playlists),
}));

export const usersSelectSchema = createSelectSchema(users);

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
	muxStatus: varchar("mux_status", { length: 255 }),
	muxAssetId: varchar("mux_asset_id", { length: 511 }).unique(),
	muxUploadId: varchar("mux_upload_id", { length: 511 }).unique(),
	muxPlaybackId: varchar("mux_playback_id", { length: 511 }).unique(),
	muxTrackId: varchar("mux_track_id", { length: 511 }).unique(),
	muxTrackStatus: varchar("mux_track_status", { length: 255 }),
	thumbnailUrl: varchar("thumbnail_url", { length: 255 }),
	thumbnailKey: varchar("thumbnail_key", { length: 511 }),
	previewUrl: varchar("preview_url", { length: 255 }),
	previewKey: varchar("preview_key", { length: 511 }),
	duration: integer("duration").default(0).notNull(),
	visibility: videoVisibility("visibility").default("private").notNull(),
	userId: uuid("user_id")
		.references(() => users.id, { onDelete: "cascade" })
		.notNull(),
	categoryId: uuid("category_id").references(() => categories.id, {
		onDelete: "set null",
	}),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const videoRelations = relations(videos, ({ one, many }) => ({
	user: one(users, {
		fields: [videos.userId],
		references: [users.id],
	}),
	category: one(categories, {
		fields: [videos.categoryId],
		references: [categories.id],
	}),
	videoView: many(videoViews),
	videoReaction: many(videoReactions),
	comments: many(comments),
	playlistVideos: many(playlistVideos),
}));

export const videoInsertSchema = createInsertSchema(videos);
export const videoSelectSchema = createSelectSchema(videos);
export const videoUpdateSchema = createUpdateSchema(videos);

export const videoViews = pgTable(
	"video_views",
	{
		userId: uuid("user_id")
			.references(() => users.id, { onDelete: "cascade" })
			.notNull(),
		videoId: uuid("video_id")
			.references(() => videos.id, {
				onDelete: "cascade",
			})
			.notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at").defaultNow().notNull(),
	},
	(t) => [
		primaryKey({ name: "pk_video_views", columns: [t.userId, t.videoId] }),
	],
);

export const videoViewRelations = relations(videoViews, ({ one }) => ({
	user: one(users, {
		fields: [videoViews.userId],
		references: [users.id],
	}),
	video: one(videos, {
		fields: [videoViews.videoId],
		references: [videos.id],
	}),
}));

export const videoViewSelectSchema = createSelectSchema(videoViews);
export const videoViewInsertSchema = createInsertSchema(videoViews);
export const videoViewUpdateSchema = createUpdateSchema(videoViews);

export const videoReactions = pgTable(
	"video_reaction",
	{
		userId: uuid("user_id")
			.references(() => users.id, { onDelete: "cascade" })
			.notNull(),
		videoId: uuid("video_id")
			.references(() => videos.id, {
				onDelete: "cascade",
			})
			.notNull(),
		type: reactionType("type").notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at").defaultNow().notNull(),
	},
	(t) => [
		primaryKey({ name: "pk_video_reactions", columns: [t.userId, t.videoId] }),
	],
);

export const videoReactionsRelations = relations(videoReactions, ({ one }) => ({
	user: one(users, {
		fields: [videoReactions.userId],
		references: [users.id],
	}),
	video: one(videos, {
		fields: [videoReactions.videoId],
		references: [videos.id],
	}),
}));

export const videoReactionsSelectSchema = createSelectSchema(videoReactions);
export const videoReactionsInsertSchema = createInsertSchema(videoReactions);
export const videoReactionsUpdateSchema = createUpdateSchema(videoReactions);

export const subscriptions = pgTable(
	"subscriptions",
	{
		viewerId: uuid("viewer_id")
			.references(() => users.id, {
				onDelete: "cascade",
			})
			.notNull(),
		creatorId: uuid("creator_id")
			.references(() => users.id, {
				onDelete: "cascade",
			})
			.notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at").defaultNow().notNull(),
	},
	(t) => [
		primaryKey({
			name: "pk_subscriptions",
			columns: [t.viewerId, t.creatorId],
		}),
	],
);

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
	viewer: one(users, {
		fields: [subscriptions.viewerId],
		references: [users.id],
		relationName: "subscriptions_viewerId_fk",
	}),
	creator: one(users, {
		fields: [subscriptions.creatorId],
		references: [users.id],
		relationName: "subscriptions_creatorId_fk",
	}),
}));

export const comments = pgTable(
	"comments",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		parentId: uuid("parent_id"),
		userId: uuid("user_id")
			.references(() => users.id, { onDelete: "cascade" })
			.notNull(),
		videoId: uuid("video_id")
			.references(() => videos.id, { onDelete: "cascade" })
			.notNull(),
		value: text("value").notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at").defaultNow().notNull(),
	},
	(t) => {
		return [
			foreignKey({
				columns: [t.parentId],
				foreignColumns: [t.id],
				name: "fk_comments_parent_id",
			}).onDelete("cascade"),
		];
	},
);

export const commentsRelations = relations(comments, ({ one, many }) => ({
	user: one(users, {
		fields: [comments.userId],
		references: [users.id],
	}),
	video: one(videos, {
		fields: [comments.videoId],
		references: [videos.id],
	}),
	parent: one(comments, {
		fields: [comments.parentId],
		references: [comments.id],
		relationName: "fk_comments_parent_id",
	}),
	commentReactions: many(commentReactions),
	replies: many(comments, {
		relationName: "fk_comments_parent_id",
	}),
}));

export const commentsSelectSchema = createSelectSchema(comments);
export const commentsInsertSchema = createInsertSchema(comments);
export const commentsUpdateSchema = createUpdateSchema(comments);

export const commentReactions = pgTable(
	"comment_reactions",
	{
		commentId: uuid("comment_id")
			.references(() => comments.id, {
				onDelete: "cascade",
			})
			.notNull(),
		userId: uuid("user_id")
			.references(() => users.id, {
				onDelete: "cascade",
			})
			.notNull(),
		type: reactionType("type").notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at").defaultNow().notNull(),
	},
	(t) => [
		primaryKey({
			name: "pk_comment_reactions",
			columns: [t.commentId, t.userId],
		}),
	],
);

export const commentRelations = relations(commentReactions, ({ one }) => ({
	comment: one(comments, {
		fields: [commentReactions.commentId],
		references: [comments.id],
	}),
	user: one(users, {
		fields: [commentReactions.userId],
		references: [users.id],
	}),
}));

export const playlists = pgTable("playlists", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: varchar("name", { length: 255 }).notNull(),
	description: text("description"),
	userId: uuid("user_id")
		.references(() => users.id, { onDelete: "cascade" })
		.notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const playlistsRelations = relations(playlists, ({ one, many }) => ({
	user: one(users, {
		fields: [playlists.userId],
		references: [users.id],
	}),
	playlistVideos: many(playlistVideos),
}));

export const playlistVideos = pgTable(
	"playlist_videos",
	{
		playlistId: uuid("playlist_id")
			.references(() => playlists.id, {
				onDelete: "cascade",
			})
			.notNull(),
		videoId: uuid("video_id")
			.references(() => videos.id, {
				onDelete: "cascade",
			})
			.notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at").defaultNow().notNull(),
	},
	(t) => [
		primaryKey({
			name: "pk_playlist_videos",
			columns: [t.playlistId, t.videoId],
		}),
	],
);

export const playlistRelations = relations(playlistVideos, ({ one }) => ({
	playlist: one(playlists, {
		fields: [playlistVideos.playlistId],
		references: [playlists.id],
	}),
	video: one(videos, {
		fields: [playlistVideos.videoId],
		references: [videos.id],
	}),
}));