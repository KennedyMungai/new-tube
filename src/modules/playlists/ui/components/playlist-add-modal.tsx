"use client";

import { ResponsiveModal } from "@/components/responsive-modal";
import { Button } from "@/components/ui/button";
import { DEFAULT_LIMIT } from "@/constants";
import { trpc } from "@/trpc/client";
import { Loader2Icon, SquareCheckIcon, SquareIcon } from "lucide-react";

type Props = {
	open: boolean;
	videoId: string;
	onOpenChange: (open: boolean) => void;
};

export const PlaylistAddModal = ({ onOpenChange, open, videoId }: Props) => {
	const utils = trpc.useUtils();

	const { data: playlists, isLoading } =
		trpc.playlists.getManyForVideo.useInfiniteQuery(
			{
				limit: DEFAULT_LIMIT,
				videoId,
			},
			{
				getNextPageParam: (lastPage) => lastPage.nextCursor,
				enabled: !!videoId && open,
			},
		);

	const handleOpenChange = () => {
		utils.playlists.getManyForVideo.reset();

		onOpenChange(false);
	};

	return (
		<ResponsiveModal
			title="Add to playlist"
			open={open}
			onOpenChange={handleOpenChange}>
			<div className="flex flex-col gap-2">
				{isLoading && (
					<div className="flex justify-center p-4">
						<Loader2Icon className="animate-spin size-5 text-muted-foreground" />
					</div>
				)}
				{playlists?.pages
					.flatMap((page) => page.items)
					.map((playlist) => (
						<Button
							key={playlist.id}
							variant={"ghost"}
							className="w-full justify-start px-2 [&_svg]:size-5"
							size="lg">
							{playlist.containsVideo ? (
								<SquareCheckIcon className="mr-2" />
							) : (
								<SquareIcon className="mr-2" />
							)}
							{playlist.name}
						</Button>
					))}
			</div>
		</ResponsiveModal>
	);
};
