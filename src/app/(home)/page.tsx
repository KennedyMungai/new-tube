import { HydrateClient, trpc } from "@/trpc/server";

const HomePage = async () => {
	void trpc.categories.getMany.prefetch();

	return <HydrateClient></HydrateClient>;
};

export default HomePage;
