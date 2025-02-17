import { ResponsiveModal } from "@/components/responsive-modal";
import { UploadDropzone } from "@/lib/uploadthing";
import { trpc } from "@/trpc/client";

type Props = {
	videoId: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

export const ThumbnailUploadModal = ({
	onOpenChange,
	open,
	videoId,
}: Props) => {
	const utils = trpc.useUtils();

	const onUploadComplete = () => {
		onOpenChange(false);
		utils.studio.getOne.invalidate({ id: videoId });
		utils.studio.getMany.invalidate();
	};

	return (
		<ResponsiveModal
			title={"Upload a thumbnail"}
			open={open}
			onOpenChange={onOpenChange}>
			<UploadDropzone
				endpoint={"thumbnailUploader"}
				input={{ videoId }}
				onClientUploadComplete={onUploadComplete}
			/>
		</ResponsiveModal>
	);
};
