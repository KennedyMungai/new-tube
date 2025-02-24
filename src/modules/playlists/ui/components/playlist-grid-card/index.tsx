import { PlaylistGetManyOutput } from "@/modules/playlists/types";
import {
	PlaylistInfo,
	PlaylistInfoSkeleton,
} from "@/modules/playlists/ui/components/playlist-grid-card/playlist-info";
import {
	PlaylistsThumbnail,
	PlaylistsThumbnailSkeleton,
} from "@/modules/playlists/ui/components/playlist-grid-card/playlists-thumbnail";
import { THUMBNAIL_FALLBACK } from "@/modules/videos/constants";
import Link from "next/link";

type Props = {
	data: PlaylistGetManyOutput["items"][number];
};

export const PlaylistGridCardSkeleton = () => {
	return (
		<div className="flex flex-col gap-2 w-full">
			<PlaylistsThumbnailSkeleton />
			<PlaylistInfoSkeleton />
		</div>
	);
};

export const PlaylistGridCard = ({ data }: Props) => {
	return (
		<Link prefetch href={`/playlists/${data.id}`}>
			<div className="flex flex-col gap-2 w-full group">
				<PlaylistsThumbnail
					imageUrl={data.thumbnailUrl ?? THUMBNAIL_FALLBACK}
					title={data.name}
					videoCount={data.playlistVideoCount}
				/>
				<PlaylistInfo data={data} />
			</div>
		</Link>
	);
};
