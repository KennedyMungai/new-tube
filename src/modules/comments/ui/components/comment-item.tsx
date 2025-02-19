import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/user-avatar";
import { cn } from "@/lib/utils";
import { CommentGetManyOutput } from "@/modules/comments/types";
import { trpc } from "@/trpc/client";
import { useAuth, useClerk } from "@clerk/nextjs";
import { formatDistanceToNow } from "date-fns";
import {
	MessageSquareIcon,
	MoreVerticalIcon,
	ThumbsDownIcon,
	ThumbsUpIcon,
	Trash2Icon,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

type Props = {
	comment: CommentGetManyOutput["items"][number];
};

export const CommentItem = ({ comment }: Props) => {
	const { userId } = useAuth();
	const clerk = useClerk();
	const utils = trpc.useUtils();

	const remove = trpc.comments.remove.useMutation({
		onSuccess: () => {
			toast.success("Comment deleted ");

			utils.comments.getMany.invalidate({ videoId: comment.videoId });
		},
		onError: (error) => {
			toast.error("Something went wrong");

			if (error.data?.code === "UNAUTHORIZED") {
				clerk.openSignIn();
			}
		},
	});

	const like = trpc.commentReactions.like.useMutation({
		onSuccess: () => {
			utils.comments.getMany.invalidate({ videoId: comment.videoId });
		},
		onError: (error) => {
			toast.error("Something went wrong");

			if (error.data?.code === "UNAUTHORIZED") {
				clerk.openSignIn();
			}
		},
	});
	const dislike = trpc.commentReactions.dislike.useMutation({
		onSuccess: () => {
			utils.comments.getMany.invalidate({ videoId: comment.videoId });
		},
		onError: (error) => {
			toast.error("Something went wrong");

			if (error.data?.code === "UNAUTHORIZED") {
				clerk.openSignIn();
			}
		},
	});

	const isPending = like.isPending || dislike.isPending || remove.isPending;

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
					<div className="flex items-center gap-2 mt-1">
						<div className="flex items-center gap-x-1">
							<div className="flex items-center">
								<Button
									className="size-8 rounded-full disabled:cursor-not-allowed"
									size="icon"
									variant={"ghost"}
									disabled={isPending}
									onClick={() => like.mutate({ commentId: comment.id })}>
									<ThumbsUpIcon
										className={cn(
											comment.viewerReaction === "like" && "fill-black",
										)}
									/>
								</Button>
								<span className="text-xs text-muted-foreground">
									{comment.likeCount}
								</span>
							</div>
							<div className="flex items-center">
								<Button
									className="size-8 rounded-full disabled:cursor-not-allowed"
									size="icon"
									variant={"ghost"}
									disabled={isPending}
									onClick={() => dislike.mutate({ commentId: comment.id })}>
									<ThumbsDownIcon
										className={cn(
											comment.viewerReaction === "dislike" && "fill-black",
										)}
									/>
								</Button>
								<span className="text-xs text-muted-foreground">
									{comment.dislikeCount}
								</span>
							</div>
						</div>
					</div>
				</div>
				<DropdownMenu modal={false}>
					<DropdownMenuTrigger asChild>
						<Button
							variant={"ghost"}
							size={"icon"}
							className="size-8 rounded-full">
							<MoreVerticalIcon />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem onClick={() => {}}>
							<MessageSquareIcon className="size-4" /> Reply
						</DropdownMenuItem>
						{comment.user.clerkId === userId && (
							<DropdownMenuItem
								onClick={() => remove.mutate({ id: comment.id })}
								disabled={isPending}
								className="disabled:cursor-not-allowed">
								<Trash2Icon className="size-4" /> Delete
							</DropdownMenuItem>
						)}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
};
