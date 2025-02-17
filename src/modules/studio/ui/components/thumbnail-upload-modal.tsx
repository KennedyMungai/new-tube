import { ResponsiveModal } from "@/components/responsive-modal";
import { UploadDropzone } from "@/lib/uploadthing";

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
	return (
		<ResponsiveModal
			title={"Upload a thumbnail"}
			open={open}
			onOpenChange={onOpenChange}>
			<UploadDropzone endpoint={"imageUploader"} />
		</ResponsiveModal>
	);
};
