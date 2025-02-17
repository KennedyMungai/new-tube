import { ResponsiveModal } from "@/components/responsive-modal";

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
			<p>Hello!</p>
		</ResponsiveModal>
	);
};
