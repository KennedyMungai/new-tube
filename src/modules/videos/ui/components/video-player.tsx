import MuxPlayer from "@mux/mux-player-react";
import { THUMBNAIL_FALLBACK } from "@/modules/videos/constants";

type Props = {
	playbackId?: string | null;
	thumbnailUrl?: string | null;
	autoPlay?: boolean;
	onPlay?: () => void;
};

export const VideoPlayer = ({ playbackId, thumbnailUrl, autoPlay, onPlay }: Props) => {
	return (
		<div className="relative">
			<MuxPlayer
				playbackId={playbackId ?? ""}
				poster={thumbnailUrl ?? THUMBNAIL_FALLBACK}
				playerInitTime={0}
				autoPlay={autoPlay}
				thumbnailTime={0}
				accentColor="#FF2056"
				onPlay={onPlay}
				className="size-full object-contain"
			/>
		</div>
	);
};
