import { SubscribedVideosSection } from "@/modules/home/ui/sections/subscribed-videos.section";

export const SubscriptionsView = () => {
	return (
		<div className="max-w-[2400px] mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
			<div>
				<h1 className="text-2xl font-bold">Subscriptions</h1>
				<h6 className="text-xs text-muted-foreground">
					Videos from your favorite creators
				</h6>
			</div>
			<SubscribedVideosSection />
		</div>
	);
};
