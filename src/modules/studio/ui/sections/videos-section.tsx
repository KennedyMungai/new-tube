"use client";

import { DEFAULT_LIMIT } from "@/constants";
import { trpc } from "@/trpc/client";
import { Suspense, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

export const VideosSection = () => {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => setIsMounted(true), []);

	if (!isMounted) return null;

	return (
		<Suspense fallback={<p>Loading...</p>}>
			<ErrorBoundary fallback={<p>Error!</p>}>
				<VideosSectionSuspense></VideosSectionSuspense>
			</ErrorBoundary>
		</Suspense>
	);
};

const VideosSectionSuspense = () => {
	const [data] = trpc.studio.getMany.useSuspenseInfiniteQuery(
		{ limit: DEFAULT_LIMIT },
		{
			getNextPageParam: (lastPage) => lastPage.nextCursor,
		},
	);

	return <div>{JSON.stringify(data)}</div>;
};
