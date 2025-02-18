import { UserAvatar } from "@/components/user-avatar";
import { CommentGetManyOutput } from "@/modules/comments/types";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

type Props = {
	comment: CommentGetManyOutput[number];
};

export const CommentItem = ({ comment }: Props) => {
	return (
		<div>
			<div className="flex gap-4">
				<Link href={`/users/${comment.userId}`}>
					<UserAvatar
						size="lg"
						imageUrl={comment.user.imageUrl ?? "/user-placeholder.svg"}
						name={comment.user.name}
					/>
				</Link>
				<div className="flex-1 min-w-0">
					<Link href={`/users/${comment.userId}`}>
						<div className="flex items-center gap-2 mb-0.5">
							<span className="font-medium text-sm pb-0.5">
								{comment.user.name}
							</span>
							<span className="text-xs text-muted-foreground">
								{formatDistanceToNow(comment.createdAt, { addSuffix: true })}
							</span>
						</div>
					</Link>
					<p className="text-sm">{comment.value}</p>
				</div>
			</div>
		</div>
	);
};
