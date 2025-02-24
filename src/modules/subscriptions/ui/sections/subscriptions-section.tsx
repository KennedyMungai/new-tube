"use client";

import { InfiniteScroll } from "@/components/infinite-scroll";
import { DEFAULT_LIMIT } from "@/constants";
import {
	SubscriptionItem,
	SubscriptionItemSkeleton,
} from "@/modules/subscriptions/ui/components/subscription-item";
import { trpc } from "@/trpc/client";
import Link from "next/link";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { toast } from "sonner";

export const SubscriptionsSection = () => {
	return (
		<Suspense fallback={<SubscriptionsSectionSkeleton />}>
			<ErrorBoundary fallback={<p>Error</p>}>
				<SubscriptionsSectionSuspense />
			</ErrorBoundary>
		</Suspense>
	);
};

const SubscriptionsSectionSkeleton = () => {
	return (
		<div className="flex flex-col gap-4">
			<div className="md:flex flex-col gap-4 hidden">
				{Array.from({ length: 10 }).map((_, index) => (
					<SubscriptionItemSkeleton key={index} />
				))}
			</div>
		</div>
	);
};

const SubscriptionsSectionSuspense = () => {
	const utils = trpc.useUtils();

	const [subscriptions, query] =
		trpc.subscriptions.getMany.useSuspenseInfiniteQuery(
			{
				limit: DEFAULT_LIMIT,
			},
			{
				getNextPageParam: (lastPage) => lastPage.nextCursor,
			},
		);

	const unsubscribe = trpc.subscriptions.remove.useMutation({
		onSuccess: (data) => {
			toast.success("Unsubscribed");

			utils.videos.getManySubscribed.invalidate();
			utils.users.getOne.invalidate({ id: data.creatorId });
			utils.subscriptions.getMany.invalidate();
		},
		onError: () => toast.error("Something went wrong"),
	});

	return (
		<>
			<div className="flex flex-col gap-4">
				{subscriptions.pages
					.flatMap((page) => page.items)
					.map((subscription) => (
						<Link
							href={`/users/${subscription.user.id}`}
							key={subscription.creatorId}>
							<SubscriptionItem
								name={subscription.user.name}
								imageUrl={subscription.user.imageUrl}
								subscriberCount={subscription.user.subscriberCount}
								disabled={unsubscribe.isPending}
								onUnsubscribe={() =>
									unsubscribe.mutate({ userId: subscription.creatorId })
								}
							/>
						</Link>
					))}
			</div>
			<InfiniteScroll
				hasNextPage={query.hasNextPage}
				isFetchingNextPage={query.isFetchingNextPage}
				fetchNextPage={query.fetchNextPage}
			/>
		</>
	);
};
