import { PlaylistsView } from "@/modules/playlists/ui/views/playlists-view";
import { HydrateClient } from "@/trpc/server";

export const dynamic = "force-dynamic";

const PlaylistPage = async () => {
	return (
		<HydrateClient>
			<PlaylistsView />
		</HydrateClient>
	);
};

export default PlaylistPage;
