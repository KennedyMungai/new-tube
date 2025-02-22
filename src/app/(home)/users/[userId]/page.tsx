import { UserView } from "@/modules/users/ui/views/user-view";
import { HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

type Props = {
	params: Promise<{ userId: string }>;
};

const UserPage = async ({ params }: Props) => {
	const { userId } = await params;

	void trpc.users.getOne.prefetch({ id: userId });

	return (
		<HydrateClient>
			<UserView userId={userId} />
		</HydrateClient>
	);
};

export default UserPage;
