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
import { CommentForm } from "@/modules/comments/ui/components/comment-form";
import { CommentReplies } from "@/modules/comments/ui/components/comment-replies";
import { trpc } from "@/trpc/client";
import { useAuth, useClerk } from "@clerk/nextjs";
import { formatDistanceToNow } from "date-fns";
import {
	ChevronDownIcon,
	ChevronUpIcon,
	MessageSquareIcon,
	MoreVerticalIcon,
	ThumbsDownIcon,
	ThumbsUpIcon,
	Trash2Icon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
	comment: CommentGetManyOutput["items"][number];
	variant?: "reply" | "comment";
};

export const CommentItem = ({ comment, variant = "comment" }: Props) => {
	const { userId } = useAuth();
	const clerk = useClerk();
	const utils = trpc.useUtils();

	const [isReplyOpen, setIsReplyOpen] = useState(false);
	const [isRepliesOpen, setIsRepliesOpen] = useState(false);

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
						size={variant === "comment" ? "lg" : "sm"}
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
							{variant === "comment" && (
								<Button
									size="sm"
									variant={"ghost"}
									className="h-8 ml-4"
									onClick={() => setIsReplyOpen(true)}>
									Reply
								</Button>
							)}
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
						<DropdownMenuItem onClick={() => setIsReplyOpen(true)}>
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
			{isReplyOpen && variant === "comment" && (
				<div className="mt-4 pl-14">
					<CommentForm
						videoId={comment.videoId}
						onSuccess={() => {
							setIsReplyOpen(false);
							setIsRepliesOpen(true);
						}}
						onCancel={() => setIsReplyOpen(false)}
						variant="reply"
						parentId={comment.id}
					/>
				</div>
			)}
			{comment.replyCount > 0 && variant === "comment" && (
				<div className="pl-14">
					<Button
						size="sm"
						variant={"tertiary"}
						onClick={() => setIsRepliesOpen((current) => !current)}>
						{isRepliesOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
						{comment.replyCount} replies
					</Button>
				</div>
			)}
			{comment.replyCount > 0 && variant === "comment" && isRepliesOpen && (
				<CommentReplies parentId={comment.id} videoId={comment.videoId} />
			)}
		</div>
	);
};
