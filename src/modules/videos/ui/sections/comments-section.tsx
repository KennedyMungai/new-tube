"use client";

import { trpc } from "@/trpc/client";

type Props = {
	videoId: string;
};

export const CommentsSection = ({ videoId }: Props) => {
	const [comments] = trpc.comments.getMany.useSuspenseQuery({ videoId });

	return <div>{JSON.stringify(comments)}</div>;
};
