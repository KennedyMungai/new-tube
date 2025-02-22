import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/user-avatar";
import { UserInfo } from "@/modules/users/ui/components/user-info";
import { VideoGetManyOutput } from "@/modules/videos/types";
import { VideoMenu } from "@/modules/videos/ui/components/video-menu";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useMemo } from "react";

type Props = {
	data: VideoGetManyOutput["items"][number];
	onRemove?: () => void;
};

export const VideoInfoSkeleton = () => {
	return (
		<div className="flex gap-3">
			<Skeleton className="size-10 flex-shrink-0 rounded-full" />
			<div className="min-w-0 flex-1 space-y-2">
				<Skeleton className="h-5 w-[90%]" />
				<Skeleton className="h-5 w-[70%]" />
			</div>
		</div>
	);
};

export const VideoInfo = ({ data, onRemove }: Props) => {
	const compactViews = useMemo(
		() => Intl.NumberFormat("en-US").format(data.viewCount),
		[data.viewCount],
	);

	const compactDate = useMemo(
		() => formatDistanceToNow(data.createdAt, { addSuffix: true }),
		[data.createdAt],
	);

	return (
		<div className="flex gap-3">
			<Link href={`/users/${data.user.id}`}>
				<UserAvatar imageUrl={data.user.imageUrl} name={data.user.name} />
			</Link>
			<div className="min-w-0 flex-1">
				<Link href={`/videos/${data.id}`}>
					<h3 className="font-medium line-clamp-1 lg:line-clamp-2 text-base break-words">
						{data.title}
					</h3>
				</Link>
				<Link href={`/users/${data.user.id}`}>
					<UserInfo name={data.user.name} />
				</Link>
				<Link href={`/videos/${data.id}`}>
					<p className="text-xs text-gray-600 line-clamp-1">
						{compactViews} views &bull; {compactDate}
					</p>
				</Link>
			</div>
			<div className="flex-shrink-0">
				<VideoMenu videoId={data.id} onRemove={onRemove} />
			</div>
		</div>
	);
};
