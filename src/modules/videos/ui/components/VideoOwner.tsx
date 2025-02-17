import { UserAvatar } from "@/components/user-avatar";
import { usersSelectSchema } from "@/db/schema";
import Link from "next/link";
import { z } from "zod";

type Props = {
	user: z.infer<typeof usersSelectSchema>;
	videoId: string;
};

export const VideoOwner = ({ user, videoId }: Props) => {
	return (
		<div className="flex items-center sm:items-start justify-between sm:justify-start gap-3 min-w-0">
			<Link href={`/users/${user.id}`}>
				<div className="flex items-center gap-3 min-w-0">
					<UserAvatar imageUrl={user.imageUrl} name={user.name} size="lg" />
					<span className="text-sm text-muted-foreground line-clamp-1">
						{/* TODO: Properly fill in the subscribers */}
						{0} Subscribers
					</span>
				</div>
			</Link>
		</div>
	);
};
