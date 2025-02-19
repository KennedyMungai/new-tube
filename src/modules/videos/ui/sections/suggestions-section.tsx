"use client";

import { DEFAULT_LIMIT } from "@/constants";
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

	return <div>{JSON.stringify(suggestions)}</div>;
};
