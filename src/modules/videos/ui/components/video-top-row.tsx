import { VideoGetOneOutput } from "@/modules/videos/types";
import { VideoMenu } from "@/modules/videos/ui/components/video-menu";
import { VideoOwner } from "@/modules/videos/ui/components/video-owner";
import { VideoReactions } from "@/modules/videos/ui/components/video-reactions";

type Props = {
	video: VideoGetOneOutput;
};

export const VideoTopRow = ({ video }: Props) => {
	return (
		<div className="flex flex-col gap-4 mt-4">
			<h1 className="text-xl font-semibold">{video.title}</h1>
			<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
				<VideoOwner user={video.user} videoId={video.id} />
				<div className="flex overflow-x-auto sm:min-w-[calc(50% - 6px)] sm:justify-end sm:overflow-visible pb-2 -mb-2 sm:pb-0 sm:mb-0 gap-2">
					<VideoReactions />
					<VideoMenu />
				</div>
			</div>
		</div>
	);
};
