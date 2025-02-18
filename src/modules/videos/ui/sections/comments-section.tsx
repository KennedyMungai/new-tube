"use client";

import { CommentForm } from "@/modules/comments/ui/components/comment-form";
import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

type Props = {
	videoId: string;
};

export const CommentsSection = ({ videoId }: Props) => {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<ErrorBoundary fallback={<p>Error!</p>}>
				<CommentsSectionSuspense videoId={videoId} />
			</ErrorBoundary>
		</Suspense>
	);
};

const CommentsSectionSuspense = ({ videoId }: Props) => {
	const [comments] = trpc.comments.getMany.useSuspenseQuery({ videoId });

	return (
		<div className="mt-6">
			<div className="flex flex-col gap-6">
				<h1>0 Comments</h1>
				<CommentForm videoId={videoId} />
			</div>
			{JSON.stringify(comments)}
		</div>
	);
};
