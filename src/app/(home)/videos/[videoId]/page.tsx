import { VideoView } from "@/modules/videos/ui/views/video-view";
import { HydrateClient, trpc } from "@/trpc/server";

type Props = {
	params: Promise<{ videoId: string }>;
};

const VideoPage = async ({ params }: Props) => {
	const { videoId } = await params;

	void trpc.videos.getOne.prefetch({ id: videoId });
	// TODO: Don't forget to use prefetchInfinite to fetch the comments
	void trpc.comments.getMany.prefetch({ videoId });

	return (
		<HydrateClient>
			<VideoView videoId={videoId} />
		</HydrateClient>
	);
};

export default VideoPage;
