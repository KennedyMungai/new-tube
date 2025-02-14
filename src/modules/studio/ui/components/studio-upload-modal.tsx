"use client";

import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";
import { PlusIcon } from "lucide-react";

export const StudioUploadModal = () => {
	const create = trpc.videos.create.useMutation();

	return (
		<Button variant={"secondary"} onClick={() => create.mutate}>
			<PlusIcon className="mr-2" />
			<span>Create</span>
		</Button>
	);
};
