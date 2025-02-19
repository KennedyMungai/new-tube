import { db } from "@/db";
import { commentReactions } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const commentReactionsRouter = createTRPCRouter({
	like: protectedProcedure
		.input(
			z.object({
				commentId: z.string().uuid(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { id: userId } = ctx.user;
			const { commentId } = input;

			const [existingCommentReactionLike] = await db
				.select()
				.from(commentReactions)
				.where(
					and(
						eq(commentReactions.commentId, commentId),
						eq(commentReactions.userId, userId),
						eq(commentReactions.type, "like"),
					),
				);

			if (existingCommentReactionLike) {
				const [deletedViewerReaction] = await db
					.delete(commentReactions)
					.where(
						and(
							eq(commentReactions.commentId, commentId),
							eq(commentReactions.userId, userId),
						),
					)
					.returning();

				return deletedViewerReaction;
			}
		}),
	dislike: protectedProcedure
		.input(
			z.object({
				commentId: z.string().uuid(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { id: userId } = ctx.user;
			const { commentId } = input;

			const [existingCommentReactionDislike] = await db
				.select()
				.from(commentReactions)
				.where(
					and(
						eq(commentReactions.commentId, commentId),
						eq(commentReactions.userId, userId),
						eq(commentReactions.type, "dislike"),
					),
				);

			if (existingCommentReactionDislike) {
				const [deletedViewerReaction] = await db
					.delete(commentReactions)
					.where(
						and(
							eq(commentReactions.commentId, commentId),
							eq(commentReactions.userId, userId),
						),
					)
					.returning();

				return deletedViewerReaction;
			}
		}),
});
