import { cn } from "@/lib/utils";
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
					<div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100"></div>
				</div>
			</div>
		</div>
	);
};
