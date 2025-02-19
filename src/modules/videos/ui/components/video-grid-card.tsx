import { VideoGetManyOutput } from "@/modules/videos/types";
import { VideoThumbnail } from "@/modules/videos/ui/components/video-thumbnail";
import Link from "next/link";

type Props = {
	data: VideoGetManyOutput["items"][number];
	onRemove?: () => void;
};

export const VideoGridCard = ({ data, onRemove }: Props) => {
	return (
		<div className="flex flex-col gap-2 w-full group">
			<Link href={`/videos/${data.id}`}>
				<VideoThumbnail
					imageUrl={data.thumbnailUrl}
					previewUrl={data.previewUrl}
					title={data.title}
					duration={data.duration}
				/>
			</Link>
		</div>
	);
};
