import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/user-avatar";
import { cn } from "@/lib/utils";
import { useSubscription } from "@/modules/subscriptions/hooks/use-subscription";
import { SubscriptionButton } from "@/modules/subscriptions/ui/components/subscription-button";
import { UsersGetOneOutput } from "@/modules/users/types";
import { useAuth, useClerk } from "@clerk/nextjs";
import Link from "next/link";

type Props = {
	user: UsersGetOneOutput;
};

export const UserPageInfo = ({ user }: Props) => {
	const clerk = useClerk();
	const { userId, isLoaded } = useAuth();

	const { isPending, onClick } = useSubscription({
		userId: user.id,
		isSubscribed: user.viewerSubscribed,
	});

	return (
		<div className="py-6">
			{/* Mobile Layout */}
			<div className="flex flex-col md:hidden">
				<div className="flex items-center gap-3">
					<UserAvatar
						imageUrl={user.imageUrl}
						size="lg"
						name={user.name}
						onClick={() => {
							if (user.clerkId === userId) {
								clerk.openUserProfile();
							}
						}}
						className="size-[60px]"
					/>
					<div className="flex-1 min-w-0">
						<h1 className="text-xl font-bold capitalize">{user.name}</h1>
						<div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
							<span>{user.subscriberCount} subscribers</span>
							<span>&bull;</span>
							<span>{user.videoCount} videos</span>
						</div>
					</div>
				</div>
				{userId === user.clerkId ? (
					<Button
						variant={"secondary"}
						asChild
						className="w-full mt-3 rounded-full">
						<Link href="/studio">Go to studio</Link>
					</Button>
				) : (
					<SubscriptionButton
						disabled={isPending || !isLoaded}
						onClick={onClick}
						isSubscribed={user.viewerSubscribed}
						size={"default"}
						className="mt-3 w-full"
					/>
				)}
			</div>

			{/* Desktop Layout */}
			<div className="md:flex hidden items-start gap-4">
				<UserAvatar
					imageUrl={user.imageUrl}
					size="xl"
					name={user.name}
					onClick={() => {
						if (user.clerkId === userId) {
							clerk.openUserProfile();
						}
					}}
					className={cn(
						userId === user.clerkId
							? "cursor-pointer hover:opacity-80 transition-opacity duration-300"
							: "",
					)}
				/>
				<div className="flex-1 min-w-0">
					<h1 className="text-4xl font-bold capitalize">{user.name}</h1>
					<div className="flex items-center gap-1 text-sm text-muted-foreground mt-3">
						<span>{user.subscriberCount} subscribers</span>
						<span>&bull;</span>
						<span>{user.videoCount} videos</span>
					</div>
					{userId === user.clerkId ? (
						<Button variant={"secondary"} asChild className="mt-3 rounded-full">
							<Link href="/studio">Go to studio</Link>
						</Button>
					) : (
						<SubscriptionButton
							disabled={isPending || !isLoaded}
							onClick={onClick}
							isSubscribed={user.viewerSubscribed}
							size={"default"}
							className="mt-3"
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export const UserPageInfoSkeleton = () => {
	return (
		<div className="py-6">
			{/* Mobile Layout */}
			<div className="flex flex-col md:hidden">
				<div className="flex items-center gap-6">
					<Skeleton className="size-[60px] rounded-full" />
					<div className="flex-1 min-w-0">
						<Skeleton className="h-6 w-32" />
						<Skeleton className="h-4 w-48 mt-1" />
					</div>
				</div>
				<Skeleton className="h-10 w-full mt-3 rounded-full" />
			</div>

			{/* Desktop Layout */}
			<div className="hidden md:flex items-start gap-4">
				<Skeleton className="size-[160px] rounded-full" />
				<div className="flex-1 min-w-0">
					<Skeleton className="h-8 w-64" />
					<Skeleton className="h-5 w-48 mt-4" />
					<Skeleton className="h-10 w-32 mt-3 rounded-full" />
				</div>
			</div>
		</div>
	);
};