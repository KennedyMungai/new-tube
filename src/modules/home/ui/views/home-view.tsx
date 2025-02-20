import { CategoriesSection } from "@/modules/home/ui/sections/categories-section";
import { HomeVideosSection } from "@/modules/videos/ui/sections/home-videos-section";

type Props = {
	categoryId?: string;
};

export const HomeView = ({ categoryId }: Props) => {
	return (
		<div className="max-w-[2400px] mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
			<CategoriesSection categoryId={categoryId} />
			<HomeVideosSection categoryId={categoryId} />
		</div>
	);
};
