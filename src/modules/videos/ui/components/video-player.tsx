import MuxPlayer from "@mux/mux-player-react";

type Props = {
	playbackId?: string | null;
	thumbnailUrl?: string | null;
	autoPlay?: boolean;
	onPlay?: () => void;
};

export const VideoPlayer = ({
	playbackId,
	thumbnailUrl,
	autoPlay,
	onPlay,
}: Props) => {
	if (!playbackId) return null;

	return (
		<MuxPlayer
			playbackId={playbackId}
			poster={thumbnailUrl ?? "/placeholder.svg"}
			playerInitTime={0}
			autoPlay={autoPlay}
			thumbnailTime={0}
			accentColor="#FF2056"
			onPlay={onPlay}
			className="size-full object-contain"
		/>
	);
};
