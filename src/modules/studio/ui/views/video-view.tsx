import { FormSection } from "@/modules/studio/ui/sections/form-section";

type Props = {
	videoId: string;
};

export const VideoView = ({ videoId }: Props) => {
	return (
		<div className="px-4 pt-2.5 max-w-screen-lg pb-6">
			<FormSection videoId={videoId} />
		</div>
	);
};
