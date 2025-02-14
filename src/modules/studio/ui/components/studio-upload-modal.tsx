"use client";

import { ResponsiveModal } from "@/components/responsive-modal";
import { Button } from "@/components/ui/button";
import { StudioUploader } from "@/modules/studio/ui/components/studio-uploader";
import { trpc } from "@/trpc/client";
import { Loader2Icon, PlusIcon } from "lucide-react";
import { toast } from "sonner";

export const StudioUploadModal = () => {
	const utils = trpc.useUtils();
	const create = trpc.videos.create.useMutation({
		onSuccess: () => {
			utils.studio.getMany.invalidate();
			toast.success("Video created successfully");
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	return (
		<>
			<Button
				variant={"secondary"}
				onClick={() => create.mutate()}
				disabled={create.isPending}>
				{create.isPending ? (
					<Loader2Icon className="size-5 animate-spin text-muted-foreground" />
				) : (
					<PlusIcon className="mr-2" />
				)}
				<span>Create</span>
			</Button>
			<ResponsiveModal
				title="Upload a video"
				open={!!create.data?.url}
				onOpenChange={() => create.reset()}>
				{create.data?.url ? (
					<StudioUploader endpoint={create.data.url} onSuccess={() => {}} />
				) : (
					<Loader2Icon className="animate-spin text-muted-foreground size-5" />
				)}
			</ResponsiveModal>
		</>
	);
};
