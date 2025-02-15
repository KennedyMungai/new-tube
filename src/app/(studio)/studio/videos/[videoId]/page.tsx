import { trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

type Props = {
	params: Promise<{ videoId: string }>;
};

const VideoPage = async ({ params }: Props) => {
	const { videoId } = await params;

	void trpc.studio.getOne({ id: videoId });

	return <div>{videoId}</div>;
};

export default VideoPage;
