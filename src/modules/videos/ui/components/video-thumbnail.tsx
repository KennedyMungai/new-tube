import Image from "next/image";

type Props = {
	imageUrl?: string | null;
};

export const VideoThumbnail = ({ imageUrl }: Props) => {
	return (
		<div className="relative">
			{/* Thumbnail Wrapper */}
			<div className="relative w-full overflow-hidden rounded-xl aspect-video">
				<Image
					src={imageUrl ?? "/placeholder.svg"}
					alt="Thumbnail"
					fill
					className="size-full object-cover"
				/>
			</div>

			{/* Video Duration Box */}
			{/* TODO: Add video duration box */}
			<div></div>
		</div>
	);
};
