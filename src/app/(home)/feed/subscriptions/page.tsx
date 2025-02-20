import { DEFAULT_LIMIT } from "@/constants";
import { HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

const SubscriptionsPage = () => {
	void trpc.videos.getManySubscribed.prefetchInfinite({ limit: DEFAULT_LIMIT });

	return <HydrateClient>SubscriptionsPage</HydrateClient>;
};

export default SubscriptionsPage;
