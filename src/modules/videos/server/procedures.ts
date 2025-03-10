import { db } from "@/db";
import {
	subscriptions,
	users,
	videoReactions,
	videos,
	videoUpdateSchema,
	videoViews,
} from "@/db/schema";
import { mux } from "@/lib/mux";
import {
	baseProcedure,
	createTRPCRouter,
	protectedProcedure,
} from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import {
	and,
	desc,
	eq,
	getTableColumns,
	inArray,
	isNotNull,
	lt,
	or,
} from "drizzle-orm";
import { UTApi } from "uploadthing/server";
import { z } from "zod";

export const videosRouter = createTRPCRouter({
	getOne: baseProcedure
		.input(z.object({ id: z.string().uuid() }))
		.query(async ({ input, ctx }) => {
			const { clerkUserId } = ctx;

			let userId;

			const [user] = await db
				.select()
				.from(users)
				.where(inArray(users.clerkId, clerkUserId ? [clerkUserId] : []));

			if (user) userId = user.id;

			// Common Table Expressions
			const viewerReactions = db.$with("viewerReactions").as(
				db
					.select({
						videoId: videoReactions.videoId,
						type: videoReactions.type,
					})
					.from(videoReactions)
					.where(inArray(videoReactions.userId, userId ? [userId] : [])),
			);

			const viewerSubscriptions = db.$with("viewerSubscriptions").as(
				db
					.select()
					.from(subscriptions)
					.where(inArray(subscriptions.viewerId, userId ? [userId] : [])),
			);

			const [existingVideo] = await db
				.with(viewerReactions, viewerSubscriptions)
				.select({
					...getTableColumns(videos),
					user: {
						...getTableColumns(users),
						subscriberCount: db.$count(
							subscriptions,
							eq(subscriptions.creatorId, users.id),
						),
						viewerSubscribed: isNotNull(viewerSubscriptions.viewerId).mapWith(
							Boolean,
						),
					},
					videoViews: db.$count(videoViews, eq(videoViews.videoId, videos.id)),
					likeCount: db.$count(
						videoReactions,
						and(
							eq(videoReactions.videoId, videos.id),
							eq(videoReactions.type, "like"),
						),
					),
					dislikeCount: db.$count(
						videoReactions,
						and(
							eq(videoReactions.videoId, videos.id),
							eq(videoReactions.type, "dislike"),
						),
					),
					viewerReaction: viewerReactions.type,
				})
				.from(videos)
				.innerJoin(users, eq(videos.userId, users.id))
				.leftJoin(viewerReactions, eq(viewerReactions.videoId, videos.id))
				.leftJoin(
					viewerSubscriptions,
					eq(viewerSubscriptions.creatorId, users.id),
				)
				.where(eq(videos.id, input.id));

			if (!existingVideo) throw new TRPCError({ code: "NOT_FOUND" });

			return existingVideo;
		}),
	getMany: baseProcedure
		.input(
			z.object({
				userId: z.string().uuid().nullish(),
				categoryId: z.string().uuid().nullish(),
				cursor: z
					.object({
						id: z.string().uuid(),
						updatedAt: z.date(),
					})
					.nullish(),
				limit: z.number().min(1).max(100),
			}),
		)
		.query(async ({ input }) => {
			const { limit, cursor, categoryId, userId } = input;

			const data = await db
				.select({
					...getTableColumns(videos),
					user: users,
					viewCount: db.$count(videoViews, eq(videoViews.videoId, videos.id)),
					likeCount: db.$count(
						videoReactions,
						and(
							eq(videoReactions.videoId, videos.id),
							eq(videoReactions.type, "like"),
						),
					),
					dislikeCount: db.$count(
						videoReactions,
						and(
							eq(videoReactions.videoId, videos.id),
							eq(videoReactions.type, "dislike"),
						),
					),
				})
				.from(videos)
				.innerJoin(users, eq(videos.userId, users.id))
				.where(
					and(
						eq(videos.visibility, "public"),
						categoryId ? eq(videos.categoryId, categoryId) : undefined,
						userId ? eq(videos.userId, userId) : undefined,
						cursor
							? or(
									lt(videos.updatedAt, cursor.updatedAt),
									and(
										eq(videos.updatedAt, cursor.updatedAt),
										lt(videos.id, cursor.id),
									),
								)
							: undefined,
					),
				)
				.orderBy(desc(videos.updatedAt), desc(videos.id))
				.limit(limit + 1);

			const hasMore = data.length > limit;

			// Remove the last item if there is more
			const items = hasMore ? data.slice(0, -1) : data;

			// Set the next cursor to the last item if there is more data
			const lastItem = items[items.length - 1];
			const nextCursor = hasMore
				? { id: lastItem.id, updatedAt: lastItem.updatedAt }
				: null;

			return { items, nextCursor };
		}),
	getManyTrending: baseProcedure
		.input(
			z.object({
				cursor: z
					.object({
						id: z.string().uuid(),
						viewCount: z.number(),
					})
					.nullish(),
				limit: z.number().min(1).max(100),
			}),
		)
		.query(async ({ input }) => {
			const { limit, cursor } = input;

			const viewCountSubquery = db.$count(
				videoViews,
				eq(videoViews.videoId, videos.id),
			);

			const data = await db
				.select({
					...getTableColumns(videos),
					user: users,
					viewCount: viewCountSubquery,
					likeCount: db.$count(
						videoReactions,
						and(
							eq(videoReactions.videoId, videos.id),
							eq(videoReactions.type, "like"),
						),
					),
					dislikeCount: db.$count(
						videoReactions,
						and(
							eq(videoReactions.videoId, videos.id),
							eq(videoReactions.type, "dislike"),
						),
					),
				})
				.from(videos)
				.innerJoin(users, eq(videos.userId, users.id))
				.where(
					and(
						eq(videos.visibility, "public"),
						cursor
							? or(
									lt(viewCountSubquery, cursor.viewCount),
									and(
										eq(viewCountSubquery, cursor.viewCount),
										lt(videos.id, cursor.id),
									),
								)
							: undefined,
					),
				)
				.orderBy(desc(viewCountSubquery), desc(videos.id))
				.limit(limit + 1);

			const hasMore = data.length > limit;

			// Remove the last item if there is more
			const items = hasMore ? data.slice(0, -1) : data;

			// Set the next cursor to the last item if there is more data
			const lastItem = items[items.length - 1];
			const nextCursor = hasMore
				? { id: lastItem.id, viewCount: lastItem.viewCount }
				: null;

			return { items, nextCursor };
		}),
	getManySubscribed: protectedProcedure
		.input(
			z.object({
				cursor: z
					.object({
						id: z.string().uuid(),
						updatedAt: z.date(),
					})
					.nullish(),
				limit: z.number().min(1).max(100),
			}),
		)
		.query(async ({ input, ctx }) => {
			const { id: userId } = ctx.user;
			const { limit, cursor } = input;

			const viewerSubscriptions = db
				.$with("viewer_subscriptions")
				.as(
					db
						.select({ userId: subscriptions.creatorId })
						.from(subscriptions)
						.where(eq(subscriptions.viewerId, userId)),
				);

			const data = await db
				.with(viewerSubscriptions)
				.select({
					...getTableColumns(videos),
					user: users,
					viewCount: db.$count(videoViews, eq(videoViews.videoId, videos.id)),
					likeCount: db.$count(
						videoReactions,
						and(
							eq(videoReactions.videoId, videos.id),
							eq(videoReactions.type, "like"),
						),
					),
					dislikeCount: db.$count(
						videoReactions,
						and(
							eq(videoReactions.videoId, videos.id),
							eq(videoReactions.type, "dislike"),
						),
					),
				})
				.from(videos)
				.innerJoin(users, eq(videos.userId, users.id))
				.innerJoin(
					viewerSubscriptions,
					eq(viewerSubscriptions.userId, users.id),
				)
				.where(
					and(
						eq(videos.visibility, "public"),
						cursor
							? or(
									lt(videos.updatedAt, cursor.updatedAt),
									and(
										eq(videos.updatedAt, cursor.updatedAt),
										lt(videos.id, cursor.id),
									),
								)
							: undefined,
					),
				)
				.orderBy(desc(videos.updatedAt), desc(videos.id))
				.limit(limit + 1);

			const hasMore = data.length > limit;

			// Remove the last item if there is more
			const items = hasMore ? data.slice(0, -1) : data;

			// Set the next cursor to the last item if there is more data
			const lastItem = items[items.length - 1];
			const nextCursor = hasMore
				? { id: lastItem.id, updatedAt: lastItem.updatedAt }
				: null;

			return { items, nextCursor };
		}),
	create: protectedProcedure.mutation(async ({ ctx }) => {
		const { id: userId } = ctx.user;

		const upload = await mux.video.uploads.create({
			new_asset_settings: {
				passthrough: userId,
				playback_policy: ["public"],
				input: [
					{
						generated_subtitles: [
							{
								language_code: "en",
								name: "English",
							},
						],
					},
				],
			},
			cors_origin: "*", // TODO: In production, set to the application's URL
		});

		const [video] = await db
			.insert(videos)
			.values({
				userId,
				title: "Untitled",
				muxStatus: "waiting",
				muxUploadId: upload.id,
			})
			.returning();

		return { video, url: upload.url };
	}),
	update: protectedProcedure
		.input(videoUpdateSchema)
		.mutation(async ({ ctx, input }) => {
			const { id: userId } = ctx.user;
			const { title, description, thumbnailUrl, categoryId, visibility, id } =
				input;

			if (!id)
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Video ID is required",
				});

			const [updatedVideo] = await db
				.update(videos)
				.set({ title, description, thumbnailUrl, categoryId, visibility })
				.where(and(eq(videos.userId, userId), eq(videos.id, id)))
				.returning();

			if (!updatedVideo)
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Video could not be updated",
				});

			return updatedVideo;
		}),
	remove: protectedProcedure
		.input(z.object({ id: z.string().uuid() }))
		.mutation(async ({ ctx, input }) => {
			const { id: userId } = ctx.user;

			const [removedVideo] = await db
				.delete(videos)
				.where(and(eq(videos.id, input.id), eq(videos.userId, userId)))
				.returning();

			if (!removedVideo) {
				throw new TRPCError({ code: "NOT_FOUND", message: "Video not found" });
			}

			return removedVideo;
		}),
	revalidate: protectedProcedure
		.input(z.object({ id: z.string().uuid() }))
		.mutation(async ({ ctx, input }) => {
			const { id: userId } = ctx.user;

			const [existingVideo] = await db
				.select()
				.from(videos)
				.where(and(eq(videos.id, input.id), eq(videos.userId, userId)));

			if (!existingVideo)
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Video not found",
				});

			if (!existingVideo.muxUploadId)
				throw new TRPCError({ code: "BAD_REQUEST" });

			const upload = await mux.video.uploads.retrieve(
				existingVideo.muxUploadId,
			);

			if (!upload || !upload.asset_id)
				throw new TRPCError({ code: "BAD_REQUEST" });

			const asset = await mux.video.assets.retrieve(upload.asset_id);
			const duration = asset.duration ? Math.round(asset.duration * 1000) : 0;

			if (!asset) throw new TRPCError({ code: "BAD_REQUEST" });

			const [updatedVideo] = await db
				.update(videos)
				.set({
					muxStatus: asset.status,
					muxPlaybackId: asset.playback_ids?.[0].id,
					muxAssetId: asset.id,
					duration,
				})
				.where(and(eq(videos.id, input.id), eq(videos.userId, userId)))
				.returning();

			return updatedVideo;
		}),
	restoreThumbnail: protectedProcedure
		.input(z.object({ id: z.string().uuid() }))
		.mutation(async ({ ctx, input }) => {
			const { id: userId } = ctx.user;

			const [existingVideo] = await db
				.select()
				.from(videos)
				.where(and(eq(videos.id, input.id), eq(videos.userId, userId)));

			if (!existingVideo) {
				throw new TRPCError({ code: "NOT_FOUND", message: "Video not found" });
			}

			if (existingVideo.thumbnailKey) {
				const utApi = new UTApi();

				await utApi.deleteFiles(existingVideo.thumbnailKey);

				await db
					.update(videos)
					.set({ thumbnailKey: null, thumbnailUrl: null })
					.where(and(eq(videos.id, input.id), eq(videos.userId, userId)));
			}

			if (!existingVideo.muxPlaybackId) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Video does not have a playback ID",
				});
			}

			const tempThumbnailUrl = `https://image.mux.com/${existingVideo.muxPlaybackId}/thumbnail.jpg`;

			const utApi = new UTApi();
			const uploadedThumbnail =
				await utApi.uploadFilesFromUrl(tempThumbnailUrl);

			if (!uploadedThumbnail.data) {
				throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
			}

			const { key: thumbnailKey, ufsUrl: thumbnailUrl } =
				uploadedThumbnail.data;

			const [updatedVideo] = await db
				.update(videos)
				.set({ thumbnailUrl, thumbnailKey })
				.where(and(eq(videos.id, input.id), eq(videos.userId, userId)))
				.returning();

			return updatedVideo;
		}),
});