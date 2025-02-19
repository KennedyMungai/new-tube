"use client";

import { DEFAULT_LIMIT } from "@/constants";
import { VideoRowCard } from "@/modules/videos/ui/components/video-row-card";
import { trpc } from "@/trpc/client";

type Props = {
	videoId: string;
};

export const SuggestionsSection = ({ videoId }: Props) => {
	const [suggestions] = trpc.suggestions.getMany.useSuspenseInfiniteQuery(
		{
			videoId,
			limit: DEFAULT_LIMIT,
		},
		{
			getNextPageParam: (lastPage) => lastPage.nextCursor,
		},
	);

	return (
		<div className="flex flex-col gap-y-4 h-screen overflow-auto">
			{suggestions.pages.flatMap((page) =>
				page.items.map((video) => (
					<VideoRowCard key={video.id} data={video} size="compact" />
				)),
			)}
		</div>
	);
};
