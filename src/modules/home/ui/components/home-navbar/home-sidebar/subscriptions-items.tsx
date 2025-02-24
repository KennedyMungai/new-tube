"use client";

import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/user-avatar";
import { DEFAULT_LIMIT } from "@/constants";
import { trpc } from "@/trpc/client";
import { ListIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const SubscriptionItemsLoadingSkeleton = () => {
	return (
		<>
			{Array.from({ length: 4 }).map((_, index) => (
				<SidebarMenuItem key={index}>
					<SidebarMenuButton
						disabled
						tooltip="Loading..."
						isActive={false}
						asChild>
						<div className="flex items-center gap-4">
							<Skeleton className="size-6 rounded-full shrink-0" />
							<Skeleton className="h-4 w-full" />
						</div>
					</SidebarMenuButton>
				</SidebarMenuItem>
			))}
		</>
	);
};

export const SubscriptionsItems = () => {
	const pathname = usePathname();
	const { data, isLoading } = trpc.subscriptions.getMany.useInfiniteQuery(
		{
			limit: DEFAULT_LIMIT,
		},
		{
			getNextPageParam: (lastPage) => lastPage.nextCursor,
		},
	);

	return (
		<SidebarGroup>
			<SidebarGroupLabel>Subscriptions</SidebarGroupLabel>
			<SidebarGroupContent>
				<SidebarMenu>
					{isLoading ? (
						<SubscriptionItemsLoadingSkeleton />
					) : (
						data?.pages
							.flatMap((page) => page.items)
							.map((subscription) => (
								<SidebarMenuItem
									key={`${subscription.creatorId}-${subscription.viewerId}`}>
									<SidebarMenuButton
										tooltip={subscription.user.name}
										isActive={pathname === `/users/${subscription.user.id}`}
										asChild>
										<Link
											href={`/users/${subscription.user.id}`}
											className="flex items-center gap-4">
											<UserAvatar
												imageUrl={subscription.user.imageUrl}
												name={subscription.user.name}
												size={"sm"}
											/>
											<span className="text-sm">{subscription.user.name}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))
					)}
					{!isLoading && (
						<SidebarMenuItem className="mt-2">
							<SidebarMenuButton
								asChild
								isActive={pathname === "/subscriptions"}
								tooltip={"All subscriptions"}>
								<Link href="/subscriptions">
									<ListIcon className="size-4" />
									<span className="text-sm">All subscriptions</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					)}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
};
