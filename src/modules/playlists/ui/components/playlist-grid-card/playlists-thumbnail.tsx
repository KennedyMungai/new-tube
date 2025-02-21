import { cn } from "@/lib/utils";
import { ListVideoIcon, PlayIcon } from "lucide-react";
import Image from "next/image";

type Props = {
	imageUrl?: string;
	title: string;
	videoCount: number;
	className?: string;
};

export const PlaylistsThumbnail = ({
	imageUrl,
	title,
	videoCount,
	className,
}: Props) => {
	return (
		<div className={cn("relative pt-3 group", className)}>
			{/* Stack Effect Layers */}
			<div className="relative">
				{/* Background Layers */}{" "}
				<div
					className={cn(
						"absolute -top-3 left-1/2 -translate-x-1/2 w-[97%] overflow-hidden rounded-xl bg-black/20 aspect-video",
					)}
				/>
				<div
					className={cn(
						"absolute -top-1.5 left-1/2 -translate-x-1/2 w-[98.5%] overflow-hidden rounded-xl bg-black/25 aspect-video",
					)}
				/>
				{/* Main Image */}
				<div className="relative overflow-hidden w-full rounded-xl aspect-video">
					<Image
						src={imageUrl ?? ""}
						alt={title}
						title={title}
						fill
						className="size-full object-cover"
						unoptimized={!!imageUrl}
					/>
					{/* Hover Overlay */}
					<div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center duration-150">
						<div className="flex items-center gap-x-2">
							<PlayIcon className="size-5 text-white fill-white" />
							<span className="text-white font-medium">Play All</span>
						</div>
					</div>
				</div>
			</div>
			{/* Video Count Indicator */}
			<div className="absolute bottom-2 right-2 px-1 py-0.5 rounded bg-black/80 text-white text-xs font-medium flex items-center gap-x-1">
				<ListVideoIcon className="size-4" />
				<span>{videoCount} videos</span>
			</div>
		</div>
	);
};
