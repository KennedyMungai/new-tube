import { DEFAULT_LIMIT } from "@/constants";
import { HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

type Props = {
	params: Promise<{ playlistId: string }>;
};

const PlaylistPage = async ({ params }: Props) => {
	const { playlistId } = await params;

	void trpc.playlists.getVideos.prefetchInfinite({
		playlistId,
		limit: DEFAULT_LIMIT,
	});

	return <HydrateClient>PlaylistPage</HydrateClient>;
};

export default PlaylistPage;
