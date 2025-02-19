import { db } from "@/db";
import { commentReactions, comments, users } from "@/db/schema";
import {
	baseProcedure,
	createTRPCRouter,
	protectedProcedure,
} from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import {
	and,
	count,
	desc,
	eq,
	getTableColumns,
	inArray,
	lt,
	or,
} from "drizzle-orm";
import { z } from "zod";

export const commentsRouter = createTRPCRouter({
	create: protectedProcedure
		.input(z.object({ videoId: z.string().uuid(), value: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const { videoId, value } = input;
			const { id: userId } = ctx.user;

			const [createdComment] = await db
				.insert(comments)
				.values({ userId, videoId, value })
				.returning();

			return createdComment;
		}),
	getMany: baseProcedure
		.input(
			z.object({
				videoId: z.string().uuid(),
				cursor: z
					.object({ id: z.string().uuid(), updatedAt: z.date() })
					.nullish(),
				limit: z.number().min(1).max(100),
			}),
		)
		.query(async ({ input, ctx }) => {
			const { videoId, cursor, limit } = input;
			const { clerkUserId } = ctx;

			let userId;

			const [user] = await db
				.select()
				.from(users)
				.where(inArray(users.clerkId, clerkUserId ? [clerkUserId] : []));

			if (user) userId = user.id;

			const viewerReactions = db.$with("viewer_reactions").as(
				db
					.select({
						commentId: commentReactions.commentId,
						type: commentReactions.type,
					})
					.from(commentReactions)
					.where(inArray(commentReactions.userId, userId ? [userId] : [])),
			);

			const [[totalData], commentsData] = await Promise.all([
				await db
					.select({
						count: count(),
					})
					.from(comments)
					.where(eq(comments.videoId, videoId)),
				await db
					.with(viewerReactions)
					.select({
						...getTableColumns(comments),
						user: users,
						viewerReaction: viewerReactions.type,
						likeCount: db.$count(
							commentReactions,
							and(
								eq(commentReactions.type, "like"),
								eq(commentReactions.commentId, comments.id),
							),
						),
						dislikeCount: db.$count(
							commentReactions,
							and(
								eq(commentReactions.type, "dislike"),
								eq(commentReactions.commentId, comments.id),
							),
						),
					})
					.from(comments)
					.where(
						and(
							eq(comments.videoId, videoId),
							cursor
								? or(
										lt(comments.updatedAt, cursor.updatedAt),
										and(
											eq(comments.updatedAt, cursor.updatedAt),
											lt(comments.id, cursor.id),
										),
									)
								: undefined,
						),
					)
					.innerJoin(users, eq(users.id, comments.userId))
					.leftJoin(viewerReactions, eq(viewerReactions.commentId, comments.id))
					.orderBy(desc(comments.updatedAt), desc(comments.id))
					.limit(limit + 1),
			]);

			const hasMore = commentsData.length > limit;

			// Remove the last item if there is more
			const items = hasMore ? commentsData.slice(0, -1) : commentsData;

			// Set the next cursor to the last item if there is more data
			const lastItem = items[items.length - 1];
			const nextCursor = hasMore
				? { id: lastItem.id, updatedAt: lastItem.updatedAt }
				: null;

			return { items, nextCursor, totalCount: totalData.count };
		}),
	remove: protectedProcedure
		.input(z.object({ id: z.string().uuid() }))
		.mutation(async ({ ctx, input }) => {
			const { id: commentId } = input;
			const { id: userId } = ctx.user;

			const [deletedComment] = await db
				.delete(comments)
				.where(and(eq(comments.id, commentId), eq(comments.userId, userId)))
				.returning();

			if (!deletedComment)
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Comment not found",
				});

			return deletedComment;
		}),
});
