import { Skeleton } from "@/components/ui/skeleton";
import { formatDuration } from "@/lib/utils";
import { THUMBNAIL_FALLBACK } from "@/modules/videos/constants";
import Image from "next/image";

type Props = {
	imageUrl?: string | null;
	previewUrl?: string | null;
	title: string;
	duration: number;
};

export const VideoThumbnailSkeleton = () => {
	return (
		<div className="relative w-full overflow-hidden rounded-xl aspect-video">
			<Skeleton className="size-full" />
		</div>
	);
};

export const VideoThumbnail = ({
	imageUrl,
	previewUrl,
	title,
	duration,
}: Props) => {
	return (
		<div className="relative group">
			{/* Thumbnail Wrapper */}
			<div className="relative w-full overflow-hidden rounded-xl aspect-video">
				<Image
					src={imageUrl ?? THUMBNAIL_FALLBACK}
					alt={title}
					fill
					className="size-full object-cover group-hover:opacity-0 transition-opacity duration-300 opacity-100"
				/>
				<Image
					src={previewUrl ?? THUMBNAIL_FALLBACK}
					alt={title}
					fill
					unoptimized={!!previewUrl}
					className="size-full object-cover group-hover:opacity-100 transition-opacity duration-300 opacity-0"
				/>
			</div>
			{/* Video Duration Box */}
			<div className="absolute bottom-2 right-2 px-1 py-0.5 rounded bg-black/80 text-white text-xs font-medium">
				{formatDuration(duration)}
			</div>
		</div>
	);
};
