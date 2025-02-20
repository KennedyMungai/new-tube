import { DEFAULT_LIMIT } from "@/constants";
import { VideoView } from "@/modules/videos/ui/views/video-view";
import { HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

type Props = {
	params: Promise<{ videoId: string }>;
};

const VideoPage = async ({ params }: Props) => {
	const { videoId } = await params;

	void trpc.videos.getOne.prefetch({ id: videoId });
	void trpc.comments.getMany.prefetchInfinite({
		videoId,
		limit: DEFAULT_LIMIT,
	});
	void trpc.suggestions.getMany.prefetchInfinite({
		videoId,
		limit: DEFAULT_LIMIT,
	});

	return (
		<HydrateClient>
			<VideoView videoId={videoId} />
		</HydrateClient>
	);
};

export default VideoPage;
