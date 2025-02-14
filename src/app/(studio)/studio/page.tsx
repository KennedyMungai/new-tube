import { StudioView } from "@/modules/studio/ui/views/studio-view";
import { HydrateClient, trpc } from "@/trpc/server";

const StudioPage = async () => {
	void trpc.categories.getMany
		.prefetchInfinite
		// { limit: DEFAULT_LIMIT }
		();

	return (
		<HydrateClient>
			<StudioView />
		</HydrateClient>
	);
};

export default StudioPage;
