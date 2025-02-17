import { VideoGetOneOutput } from "@/modules/videos/types";
import { VideoOwner } from "@/modules/videos/ui/components/VideoOwner";

type Props = {
	video: VideoGetOneOutput;
};

export const VideoTopRow = ({ video }: Props) => {
	return (
		<div className="flex flex-col gap-4 mt-4">
			<h1 className="text-xl font-semibold">{video.title}</h1>
			<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
				<VideoOwner user={video.user} videoId={video.id} />
			</div>
		</div>
	);
};
