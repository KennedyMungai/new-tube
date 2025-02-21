import { PlaylistGetManyOutput } from "@/modules/playlists/types";
import Link from "next/link";

type Props = {
	data: PlaylistGetManyOutput["items"][number];
};

export const PlaylistGridCard = ({ data }: Props) => {
	return (
		<Link href={`/playlists/${data.id}`}>
			<div className="flex flex-col gap-2 w-full group">{data.name}</div>
		</Link>
	);
};
