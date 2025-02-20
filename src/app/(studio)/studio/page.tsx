import { StudioView } from "@/modules/studio/ui/views/studio-view";
import { HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

const StudioPage = async () => {
	// HACK: Remove if it causes a build error
	void (trpc.categories.getMany.prefetchInfinite(/*{ limit: DEFAULT_LIMIT }*/));

	return (
		<HydrateClient>
			<StudioView />
		</HydrateClient>
	);
};

export default StudioPage;
