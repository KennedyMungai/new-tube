import { db } from "@/db";
import { comments, users } from "@/db/schema";
import {
	baseProcedure,
	createTRPCRouter,
	protectedProcedure,
} from "@/trpc/init";
import { and, desc, eq, getTableColumns, lt, or } from "drizzle-orm";
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
		.query(async ({ input }) => {
			const { videoId, cursor, limit } = input;

			const commentsData = await db
				.select({
					...getTableColumns(comments),
					user: users,
					totalCount: db.$count(comments, eq(comments.videoId, videoId)),
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
				.orderBy(desc(comments.updatedAt), desc(comments.id))
				.limit(limit + 1);

			const hasMore = commentsData.length > limit;

			// Remove the last item if there is more
			const items = hasMore ? commentsData.slice(0, -1) : commentsData;

			// Set the next cursor to the last item if there is more data
			const lastItem = items[items.length - 1];
			const nextCursor = hasMore
				? { id: lastItem.id, updatedAt: lastItem.updatedAt }
				: null;

			return { items, nextCursor };
		}),
});
