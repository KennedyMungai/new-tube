"use client";

import { InfiniteScroll } from "@/components/infinite-scroll";
import { DEFAULT_LIMIT } from "@/constants";
import {
	VideoGridCard,
	VideoGridCardSkeleton,
} from "@/modules/videos/ui/components/video-grid-card";
import {
	VideoRowCard,
	VideoRowCardSkeleton,
} from "@/modules/videos/ui/components/video-row-card";
import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

type Props = {
	query?: string;
	categoryId?: string;
};

export const ResultsSection = ({ categoryId, query }: Props) => {
	return (
		<Suspense
			// HACK: So that the component updates whenever either the categoryId or query changes
			key={`${query}-${categoryId}`}
			fallback={<ResultsSectionSkeleton />}>
			<ErrorBoundary fallback={<p>Error</p>}>
				<ResultsSectionSuspense categoryId={categoryId} query={query} />
			</ErrorBoundary>
		</Suspense>
	);
};

const ResultsSectionSkeleton = () => {
	return (
		<div>
			<div className="hidden flex-col gap-4 md:flex">
				{Array.from({ length: 6 }).map((_, index) => (
					<VideoRowCardSkeleton key={index} />
				))}
			</div>
			<div className="flex flex-col gap-4 p-4 pt-6 md:hidden">
				{Array.from({ length: 5 }).map((_, index) => (
					<VideoGridCardSkeleton key={index} />
				))}
			</div>
		</div>
	);
};

const ResultsSectionSuspense = ({ categoryId, query }: Props) => {
	const [results, resultQuery] = trpc.search.getMany.useSuspenseInfiniteQuery(
		{
			query,
			categoryId,
			limit: DEFAULT_LIMIT,
		},
		{
			getNextPageParam: (lastPage) => lastPage.nextCursor,
		},
	);

	return (
		<div>
			<div className="flex flex-col gap-4 gap-y-10 md:hidden">
				{results.pages
					.flatMap((page) => page.items)
					.map((video) => (
						<VideoGridCard key={video.id} data={video} />
					))}
			</div>
			<div className="md:flex hidden flex-col gap-4">
				{results.pages
					.flatMap((page) => page.items)
					.map((video) => (
						<VideoRowCard key={video.id} data={video} />
					))}
			</div>
			<InfiniteScroll
				hasNextPage={resultQuery.hasNextPage}
				isFetchingNextPage={resultQuery.isFetchingNextPage}
				fetchNextPage={resultQuery.fetchNextPage}
			/>
		</div>
	);
};
