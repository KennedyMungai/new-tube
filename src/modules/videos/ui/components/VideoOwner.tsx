import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
import { usersSelectSchema } from "@/db/schema";
import { SubscriptionButton } from "@/modules/subscriptions/ui/components/subscription-button";
import { UserInfo } from "@/modules/users/ui/components/user-info";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { z } from "zod";

type Props = {
	user: z.infer<typeof usersSelectSchema>;
	videoId: string;
};

export const VideoOwner = ({ user, videoId }: Props) => {
	const { userId } = useAuth();

	return (
		<div className="flex items-center sm:items-start justify-between sm:justify-start gap-3 min-w-0">
			<Link href={`/users/${user.id}`}>
				<div className="flex items-center gap-3 min-w-0">
					<UserAvatar imageUrl={user.imageUrl} name={user.name} size="lg" />
					<UserInfo size={"lg"} name={user.name} />
					<span className="text-sm text-muted-foreground line-clamp-1">
						{/* TODO: Properly fill in the subscribers */}
						{0} Subscribers
					</span>
				</div>
			</Link>
			{userId === user.clerkId ? (
				<Button className="rounded-full" asChild variant={"secondary"}>
					<Link href={`/studio/videos/${videoId}`}>Edit Video</Link>
				</Button>
			) : (
				<SubscriptionButton
					onClick={() => {}}
					disabled={false}
					isSubscribed={false}
					size="default"
					className="flex-none"
				/>
			)}
		</div>
	);
};
