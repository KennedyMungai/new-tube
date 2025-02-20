import { DEFAULT_LIMIT } from "@/constants";
import { TrendingView } from "@/modules/videos/ui/views/trending-view";
import { HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

const TrendingPage = () => {
	void trpc.videos.getManyTrending.prefetchInfinite({ limit: DEFAULT_LIMIT });

	return (
		<HydrateClient>
			<TrendingView />
		</HydrateClient>
	);
};

export default TrendingPage;
