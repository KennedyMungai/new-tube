"use client";

import { DEFAULT_LIMIT } from "@/constants";
import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

type Props = {
	categoryId?: string;
};

export const HomeVideosSection = ({ categoryId }: Props) => {
	return (
		<Suspense fallback={<HomeVideosSectionSkeleton />}>
			<ErrorBoundary fallback={<p>Error</p>}>
				<HomeVideosSectionSuspense categoryId={categoryId} />
			</ErrorBoundary>
		</Suspense>
	);
};

const HomeVideosSectionSkeleton = () => {
	return <div>Loading...</div>;
};

const HomeVideosSectionSuspense = ({ categoryId }: Props) => {
	const [videos, query] = trpc.videos.getMany.useSuspenseInfiniteQuery(
		{
			categoryId,
			limit: DEFAULT_LIMIT,
		},
		{
			getNextPageParam: (lastPage) => lastPage.nextCursor,
		},
	);

	return <div>{JSON.stringify(videos)}</div>;
};
