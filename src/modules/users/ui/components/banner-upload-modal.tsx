import { ResponsiveModal } from "@/components/responsive-modal";
import { UploadDropzone } from "@/lib/uploadthing";
import { trpc } from "@/trpc/client";

type Props = {
	userId: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

export const BannerUploadModal = ({ onOpenChange, open, userId }: Props) => {
	const utils = trpc.useUtils();

	const onUploadComplete = () => {
		onOpenChange(false);
		utils.users.getOne.invalidate({ id: userId });
		utils.studio.getMany.invalidate();
	};

	return (
		<ResponsiveModal
			title={"Upload a banner for the user"}
			open={open}
			onOpenChange={onOpenChange}>
			<UploadDropzone
				endpoint={"bannerUploader"}
				onClientUploadComplete={onUploadComplete}
			/>
		</ResponsiveModal>
	);
};
