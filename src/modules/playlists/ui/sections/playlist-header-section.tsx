"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/trpc/client";
import { Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { toast } from "sonner";

type Props = {
	playlistId: string;
};

export const PlaylistHeaderSection = ({ playlistId }: Props) => {
	return (
		<Suspense fallback={<PlaylistHeaderSectionSkeleton />}>
			<ErrorBoundary fallback={<p>Error</p>}>
				<PlaylistHeaderSectionSuspense playlistId={playlistId} />
			</ErrorBoundary>
		</Suspense>
	);
};

const PlaylistHeaderSectionSkeleton = () => {
	return (
		<div className="flex flex-col gap-y-2">
			<Skeleton className="h-6 w-24" />
			<Skeleton className="h-4 w-32" />
		</div>
	);
};

const PlaylistHeaderSectionSuspense = ({ playlistId }: Props) => {
	const utils = trpc.useUtils();
	const router = useRouter();

	const [playlist] = trpc.playlists.getOne.useSuspenseQuery({
		playlistId,
	});

	const remove = trpc.playlists.remove.useMutation({
		onSuccess: () => {
			toast.success("Playlist removed");
			utils.playlists.getMany.invalidate();
			router.push("/playlists");
		},
		onError: () => toast.error("Something went wrong"),
	});

	return (
		<div className="flex justify-between items-center">
			<div>
				<h1 className="text-2xl font-bold">
					{playlist.name ?? "Your playlist"}
				</h1>
				<p className="text-xs text-muted-foreground">
					Videos saved to this playlist
				</p>
			</div>
			<Button
				variant={"outline"}
				size={"icon"}
				onClick={() => remove.mutate({ playlistId })}
				disabled={remove.isPending}
				className="rounded-full">
				<Trash2Icon className="size-4" />
			</Button>
		</div>
	);
};
