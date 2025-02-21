"use client";

import { InfiniteScroll } from "@/components/infinite-scroll";
import { DEFAULT_LIMIT } from "@/constants";
import { VideoGridCardSkeleton } from "@/modules/videos/ui/components/video-grid-card";
import { VideoRowCardSkeleton } from "@/modules/videos/ui/components/video-row-card";
import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export const PlaylistsSection = () => {
	return (
		<Suspense fallback={<PlaylistsSectionSkeleton />}>
			<ErrorBoundary fallback={<p>Error</p>}>
				<PlaylistsSectionSuspense />
			</ErrorBoundary>
		</Suspense>
	);
};

const PlaylistsSectionSkeleton = () => {
	return (
		<div>
			<div className="flex flex-col gap-4 gap-y-10 md:hidden">
				{Array.from({ length: 20 }).map((_, index) => (
					<VideoGridCardSkeleton key={index} />
				))}
			</div>
			<div className="md:flex flex-col gap-4 hidden">
				{Array.from({ length: 20 }).map((_, index) => (
					<VideoRowCardSkeleton key={index} size="compact" />
				))}
			</div>
		</div>
	);
};

const PlaylistsSectionSuspense = () => {
	const [playlists, query] = trpc.playlists.getMany.useSuspenseInfiniteQuery(
		{
			limit: DEFAULT_LIMIT,
		},
		{
			getNextPageParam: (lastPage) => lastPage.nextCursor,
		},
	);

	return (
		<>
			<div className="flex flex-col gap-4 gap-y-10 md:hidden">
				{JSON.stringify(playlists)}
			</div>
			<InfiniteScroll
				hasNextPage={query.hasNextPage}
				isFetchingNextPage={query.isFetchingNextPage}
				fetchNextPage={query.fetchNextPage}
			/>
		</>
	);
};
