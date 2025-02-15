import { HomeView } from "@/modules/home/ui/views/home-view";
import { HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

type Props = {
	searchParams: Promise<{ categoryId?: string }>;
};

const HomePage = async ({ searchParams }: Props) => {
	const { categoryId } = await searchParams;

	void trpc.categories.getMany.prefetchInfinite();

	return (
		<HydrateClient>
			<HomeView categoryId={categoryId} />
		</HydrateClient>
	);
};

export default HomePage;
