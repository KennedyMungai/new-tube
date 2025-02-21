import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

type Props = {
	playlistId: string;
};

export const PlaylistHeaderSection = ({ playlistId }: Props) => {
	return (
		<Suspense fallback={<p>Loading...</p>}>
			<ErrorBoundary fallback={<p>Error</p>}>
				<PlaylistHeaderSectionSuspense playlistId={playlistId} />
			</ErrorBoundary>
		</Suspense>
	);
};

const PlaylistHeaderSectionSuspense = ({ playlistId }: Props) => {
	return (
		<div className="flex justify-between items-center">
			<div>
				<h1 className="text-2xl font-bold">History</h1>
				<p className="text-xs text-muted-foreground">
					Videos from the playlist
				</p>
			</div>
			<Button variant={"outline"} size={"icon"} className="rounded-full">
				<Trash2Icon className="size-4" />
			</Button>
		</div>
	);
};
