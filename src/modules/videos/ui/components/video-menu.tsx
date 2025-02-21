import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { APP_URL } from "@/constants";
import { PlaylistAddModal } from "@/modules/playlists/ui/components/playlist-add-modal";
import {
	ListPlusIcon,
	MoreVerticalIcon,
	ShareIcon,
	Trash2Icon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
	videoId: string;
	variant?: "ghost" | "secondary";
	onRemove?: () => void;
};

export const VideoMenu = ({ videoId, onRemove, variant = "ghost" }: Props) => {
	const [isOpen, setIsOpen] = useState(false);

	const onShare = () => {
		const fullUrl = `${APP_URL}/videos/${videoId}`;
		navigator.clipboard.writeText(fullUrl);
		toast.success("Link copied to the clipboard");
	};

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant={variant} size="icon" className="rounded-full">
						<MoreVerticalIcon className="size-5" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
					<DropdownMenuItem onClick={onShare}>
						<ShareIcon className="mr-2 size-4" />
						Share
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setIsOpen(true)}>
						<ListPlusIcon className="mr-2 size-4" />
						Add to playlist
					</DropdownMenuItem>
					{onRemove && (
						<DropdownMenuItem onClick={() => {}}>
							<Trash2Icon className="mr-2 size-4" />
							Remove
						</DropdownMenuItem>
					)}
				</DropdownMenuContent>
			</DropdownMenu>
			<PlaylistAddModal open={isOpen} onOpenChange={setIsOpen} videoId={videoId} />
		</>
	);
};
