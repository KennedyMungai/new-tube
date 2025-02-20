import { trpc } from "@/trpc/client";
import { useClerk } from "@clerk/nextjs";
import { toast } from "sonner";

type Props = {
	userId: string;
	isSubscribed: boolean;
	fromVideoId?: string;
};

export const useSubscription = ({
	isSubscribed,
	userId,
	fromVideoId,
}: Props) => {
	const clerk = useClerk();
	const utils = trpc.useUtils();

	const subscribe = trpc.subscriptions.create.useMutation({
		onSuccess: () => {
			toast.success("Subscribed");

			// TODO: Reinvalidate subscriptions.getMany and users.getOne
			utils.videos.getManySubscribed.invalidate();

			if (fromVideoId) utils.videos.getOne.invalidate({ id: fromVideoId });
		},
		onError: (error) => {
			toast.error("Something went wrong");

			if (error.data?.code === "UNAUTHORIZED") {
				clerk.openSignIn();
			}
		},
	});
	const unsubscribe = trpc.subscriptions.remove.useMutation({
		onSuccess: () => {
			toast.success("Unsubscribed");

			// TODO: Reinvalidate subscriptions.getMany and users.getOne
			utils.videos.getManySubscribed.invalidate();

			if (fromVideoId) utils.videos.getOne.invalidate({ id: fromVideoId });
		},
		onError: (error) => {
			toast.error("Something went wrong");

			if (error.data?.code === "UNAUTHORIZED") {
				clerk.openSignIn();
			}
		},
	});

	const isPending = subscribe.isPending || unsubscribe.isPending;

	const onClick = () => {
		if (isSubscribed) unsubscribe.mutate({ userId });
		else subscribe.mutate({ userId });
	};

	return {
		isPending,
		onClick,
	};
};
