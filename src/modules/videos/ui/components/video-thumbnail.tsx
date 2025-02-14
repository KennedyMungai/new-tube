import Image from "next/image";

type Props = {
	imageUrl?: string | null;
	previewUrl?: string | null;
	title: string;
};

export const VideoThumbnail = ({ imageUrl, previewUrl, title }: Props) => {
	return (
		<div className="relative group">
			{/* Thumbnail Wrapper */}
			<div className="relative w-full overflow-hidden rounded-xl aspect-video">
				<Image
					src={imageUrl ?? "/placeholder.svg"}
					alt="Thumbnail"
					fill
					className="size-full object-cover group-hover:opacity-0 transition-opacity duration-300 opacity-100"
				/>
				<Image
					src={previewUrl ?? "/placeholder.svg"}
					alt="Thumbnail"
					fill
					className="size-full object-cover group-hover:opacity-100 transition-opacity duration-300 opacity-0"
				/>
			</div>

			{/* Video Duration Box */}
			{/* TODO: Add video duration box */}
			<div></div>
		</div>
	);
};
