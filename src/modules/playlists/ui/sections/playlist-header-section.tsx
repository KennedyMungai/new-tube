type Props = {
	playlistId: string;
};

export const PlaylistHeaderSection = ({ playlistId }: Props) => {
	return <div>{playlistId}</div>;
};
