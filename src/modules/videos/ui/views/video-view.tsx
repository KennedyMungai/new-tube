import { CommentsSection } from "@/modules/videos/ui/sections/comments-section";
import { SuggestionsSection } from "@/modules/videos/ui/sections/suggestions-section";
import { VideoSection } from "@/modules/videos/ui/sections/video-section";

type Props = {
	videoId: string;
};

export const VideoView = ({ videoId }: Props) => {
	return (
		<div className="flex flex-col max-w-[1700px] mx-auto p-2.5 px-4 mb-10">
			<div className="flex flex-col lg:flex-row gap-6">
				<div className="flex-1 min-w-0">
					<VideoSection videoId={videoId} />
					<div className="xl:hidden block mt-4">
						<SuggestionsSection />
					</div>
					<CommentsSection />
				</div>
				<div className="hidden xl:block xl:w-[380px] 2xl:w-[460px] shrink-1">
					<SuggestionsSection />
				</div>
			</div>
		</div>
	);
};
