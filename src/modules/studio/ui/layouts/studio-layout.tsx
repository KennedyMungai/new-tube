import { SidebarProvider } from "@/components/ui/sidebar";
import { StudioNavbar } from "@/modules/studio/ui/components/studio-navbar";
import { StudioSidebar } from "@/modules/studio/ui/components/studio-navbar/studio-sidebar";
import { ReactNode } from "react";

type Props = {
	children: ReactNode;
};

export const StudioLayout = ({ children }: Props) => {
	return (
		<SidebarProvider>
			<div className="w-full">
				<StudioNavbar />
				<div className="flex h-full pt-[4rem]">
					<StudioSidebar />{" "}
					<main className="flex-1 overflow-y-auto">{children}</main>
				</div>
			</div>
		</SidebarProvider>
	);
};
