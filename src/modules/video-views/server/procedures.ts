import { db } from "@/db";
import { videoViews } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const videoViewsRouter = createTRPCRouter({
	create: protectedProcedure
		.input(z.object({ videoId: z.string().uuid() }))
		.mutation(async ({ input, ctx }) => {
			const { id: userId } = ctx.user;
			const { videoId } = input;

			const [existingVideoView] = await db
				.select()
				.from(videoViews)
				.where(
					and(eq(videoViews.userId, userId), eq(videoViews.videoId, videoId)),
				);

			if (existingVideoView) return existingVideoView;

			const [createdVideoView] = await db
				.insert(videoViews)
				.values({ userId, videoId })
				.returning();

			return createdVideoView;
		}),
});
