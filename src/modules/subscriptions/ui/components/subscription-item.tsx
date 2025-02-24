import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/user-avatar";
import { SubscriptionButton } from "@/modules/subscriptions/ui/components/subscription-button";

type Props = {
	name: string;
	imageUrl: string;
	subscriberCount: number;
	disabled: boolean;
	onUnsubscribe: () => void;
};

export const SubscriptionItem = ({
	name,
	imageUrl,
	subscriberCount,
	onUnsubscribe,
	disabled,
}: Props) => {
	return (
		<div className="flex items-start gap-4">
			<UserAvatar name={name} imageUrl={imageUrl} size="lg" />
			<div className="flex-1">
				<div className="flex items-center justify-between">
					<div>
						<h3 className="text-lg capitalize">{name}</h3>
						<p className="text-xs text-muted-foreground">
							{subscriberCount.toLocaleString()} subscribers
						</p>
					</div>
					<SubscriptionButton
						size="sm"
						disabled={disabled}
						onClick={(e) => {
							e.preventDefault();
							onUnsubscribe();
						}}
						isSubscribed={true}
					/>
				</div>
			</div>
		</div>
	);
};

export const SubscriptionItemSkeleton = () => {
	return (
		<div className="flex items-start gap-4">
			<Skeleton className="size-10 rounded-full" />
			<div className="flex-1">
				<div className="flex items-center justify-between">
					<div>
						<Skeleton className="h-4 w-24" />
						<Skeleton className="mt-1 h-3 w-20" />
					</div>
					<Skeleton className="h-8 w-20" />
				</div>
			</div>
		</div>
	);
};
