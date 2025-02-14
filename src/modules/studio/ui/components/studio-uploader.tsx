import MuxUploader, {
	MuxUploaderDrop,
	MuxUploaderFileSelect,
	MuxUploaderProgress,
	MuxUploaderStatus,
} from "@mux/mux-uploader-react";

type Props = {
	endpoint?: string | null;
	onSuccess: () => void;
};

export const StudioUploader = ({ onSuccess, endpoint }: Props) => {
	return (
		<div>
			<MuxUploader endpoint={endpoint} />
		</div>
	);
};
