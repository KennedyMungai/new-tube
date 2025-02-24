import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
import { useSubscription } from "@/modules/subscriptions/hooks/use-subscription";
import { SubscriptionButton } from "@/modules/subscriptions/ui/components/subscription-button";
import { UserInfo } from "@/modules/users/ui/components/user-info";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { VideoGetOneOutput } from "../../types";

type Props = {
	user: VideoGetOneOutput["user"];
	videoId: string;
};

export const VideoOwner = ({ user, videoId }: Props) => {
	const { userId, isLoaded } = useAuth();

	const { isPending, onClick } = useSubscription({
		isSubscribed: user.viewerSubscribed,
		userId: user.id,
		fromVideoId: videoId,
	});

	return (
		<div className="flex items-center sm:items-start justify-between sm:justify-start gap-3 min-w-0">
			<Link prefetch href={`/users/${user.id}`}>
				<div className="flex items-center gap-3 min-w-0">
					<UserAvatar imageUrl={user.imageUrl} name={user.name} size="lg" />
					<div className="flex flex-col gap-1 min-w-0">
						<UserInfo size={"lg"} name={user.name} />
						<span className="text-sm text-muted-foreground line-clamp-1">
							{user.subscriberCount}{" "}
							{user.subscriberCount === 1 ? "subscriber" : "subscribers"}
						</span>
					</div>
				</div>
			</Link>
			{userId === user.clerkId ? (
				<Button className="rounded-full" asChild variant={"secondary"}>
					<Link prefetch href={`/studio/videos/${videoId}`}>
						Edit Video
					</Link>
				</Button>
			) : (
				<SubscriptionButton
					onClick={onClick}
					disabled={isPending || !isLoaded}
					isSubscribed={user.viewerSubscribed}
					size="default"
					className="flex-none"
				/>
			)}
		</div>
	);
};
