"use client";

import { Button } from "@/components/ui/button";
import { PlaylistCreateModal } from "@/modules/playlists/ui/components/playlist-create-modal";
import { PlaylistsSection } from "@/modules/playlists/ui/sections/playlists-section";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

export const PlaylistsView = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="max-w-[2400px] mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-2xl font-bold">Playlists</h1>
					<p className="text-xs text-muted-foreground">
						Collections you have created
					</p>
				</div>
				<Button
					variant={"outline"}
					size="icon"
					className="rounded-full"
					onClick={() => setIsOpen(true)}>
					<PlusIcon />
				</Button>
			</div>
			<PlaylistsSection />
			<PlaylistCreateModal open={isOpen} onOpenChange={setIsOpen} />
		</div>
	);
};
