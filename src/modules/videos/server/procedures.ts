import { db } from "@/db";
import { videos, videoUpdateSchema } from "@/db/schema";
import { mux } from "@/lib/mux";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { UTApi } from "uploadthing/server";
import { z } from "zod";

export const videosRouter = createTRPCRouter({
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

			const thumbnailUrl = `https://image.mux.com/${existingVideo.muxPlaybackId}/thumbnail.jpg`;

			const [updatedVideo] = await db
				.update(videos)
				.set({ thumbnailUrl })
				.where(and(eq(videos.id, input.id), eq(videos.userId, userId)))
				.returning();

			return updatedVideo;
		}),
});
