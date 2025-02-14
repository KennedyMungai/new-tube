import Image from "next/image";

type Props = {
	imageUrl?: string | null;
	previewUrl?: string | null;
	title: string;
	duration: number | null;
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
					src={imageUrl ?? "/placeholder.svg"}
					alt={title}
					fill
					className="size-full object-cover group-hover:opacity-0 transition-opacity duration-300 opacity-100"
				/>
				<Image
					src={previewUrl ?? "/placeholder.svg"}
					alt={title}
					fill
					className="size-full object-cover group-hover:opacity-100 transition-opacity duration-300 opacity-0"
				/>
			</div>
			{/* Video Duration Box */}
			<div className="absolute bottom-2 right-2 px-1 py-0.5 rounded bg-black/80 text-white text-xs font-medium">
				{duration}
			</div>
			<div></div>
		</div>
	);
};
