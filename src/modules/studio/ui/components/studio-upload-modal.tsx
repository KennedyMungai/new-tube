"use client";

import { Button } from "@/components/ui/button";
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
	});

	return (
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
	);
};
