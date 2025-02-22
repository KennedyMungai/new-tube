import { DEFAULT_LIMIT } from "@/constants";
import { UserView } from "@/modules/users/ui/views/user-view";
import { HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

type Props = {
	params: Promise<{ userId: string }>;
};

const UserPage = async ({ params }: Props) => {
	const { userId } = await params;

	void trpc.users.getOne.prefetch({ id: userId });
	void trpc.videos.getMany.prefetchInfinite({
		userId,
		limit: DEFAULT_LIMIT,
	});

	return (
		<HydrateClient>
			<UserView userId={userId} />
		</HydrateClient>
	);
};

export default UserPage;
