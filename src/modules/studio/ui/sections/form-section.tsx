"use client";

import { trpc } from "@/trpc/client";

type Props = {
	videoId: string;
};

export const FormSection = ({ videoId }: Props) => {
	const [video] = trpc.studio.getOne.useSuspenseQuery({ id: videoId });

	return <div>{JSON.stringify(video)}</div>;
};
