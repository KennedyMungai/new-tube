"use client";

import { InfiniteScroll } from "@/components/infinite-scroll";
import { DEFAULT_LIMIT } from "@/constants";
import { VideoGridCard } from "@/modules/videos/ui/components/video-grid-card";
import { VideoRowCard } from "@/modules/videos/ui/components/video-row-card";
import { trpc } from "@/trpc/client";

type Props = {
	videoId: string;
};

export const SuggestionsSection = ({ videoId }: Props) => {
	const [suggestions, query] =
		trpc.suggestions.getMany.useSuspenseInfiniteQuery(
			{
				videoId,
				limit: DEFAULT_LIMIT,
			},
			{
				getNextPageParam: (lastPage) => lastPage.nextCursor,
			},
		);

	return (
		<>
			<div className="hidden md:block space-y-3">
				{suggestions.pages.flatMap((page) =>
					page.items.map((video) => (
						<VideoRowCard key={video.id} data={video} size="compact" />
					)),
				)}
			</div>
			<div className="block md:hidden space-y-10">
				{suggestions.pages.flatMap((page) =>
					page.items.map((video) => (
						<VideoGridCard key={video.id} data={video} />
					)),
				)}
			</div>
			<InfiniteScroll
				hasNextPage={query.hasNextPage}
				isFetchingNextPage={query.isFetchingNextPage}
				fetchNextPage={query.fetchNextPage}
			/>
		</>
	);
};
