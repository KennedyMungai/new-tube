type Props = {
	params: Promise<{ videoId: string }>;
};

const VideoPage = async ({ params }: Props) => {
	const { videoId } = await params;

	return <div>{videoId}</div>;
};

export default VideoPage;
