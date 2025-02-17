"use client";

import { cn } from "@/lib/utils";
import { VideoBanner } from "@/modules/videos/ui/components/video-banner";
import { VideoPlayer } from "@/modules/videos/ui/components/video-player";
import { VideoTopRow } from "@/modules/videos/ui/components/VideoTopRow";
import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

type Props = {
	videoId: string;
};

export const VideoSection = ({ videoId }: Props) => {
	return (
		<Suspense fallback={<p>Loading...</p>}>
			<ErrorBoundary fallback={<p>Error!</p>}>
				<VideoSectionSuspense videoId={videoId} />
			</ErrorBoundary>
		</Suspense>
	);
};

const VideoSectionSuspense = ({ videoId }: Props) => {
	const [video] = trpc.videos.getOne.useSuspenseQuery({ id: videoId });

	return (
		<>
			<div
				className={cn(
					"aspect-video bg-black rounded-xl overflow-hidden relative",
					video.muxStatus !== "ready" && "rounded-b-none",
				)}>
				<VideoPlayer
					autoPlay
					onPlay={() => {}}
					playbackId={video.muxPlaybackId}
					thumbnailUrl={video.thumbnailUrl}
				/>
			</div>
			<VideoBanner status={video.muxStatus} />
			<VideoTopRow video={video} />
		</>
	);
};
