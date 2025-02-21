import { PlaylistHeaderSection } from "@/modules/playlists/ui/sections/playlist-header-section";
import { VideosSection } from "@/modules/playlists/ui/sections/videos-section";

type Props = {
	playlistId: string;
};

export const VideosView = ({ playlistId }: Props) => {
	return (
		<div className="max-w-screen-md mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
			<PlaylistHeaderSection playlistId={playlistId} />
			<VideosSection playlistId={playlistId} />
		</div>
	);
};
