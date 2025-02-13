import { SidebarProvider } from "@/components/ui/sidebar";
import { HomeNavbar } from "@/modules/home/ui/components/home-navbar"	;
import { HomeSidebar } from "@/modules/home/ui/components/home-navbar/home-sidebar";
import { ReactNode } from "react";

type Props = {
	children: ReactNode;
};

export const StudioLayout = ({ children }: Props) => {
	return (
		<SidebarProvider>
			<div className="w-full">
				<HomeNavbar />
				<div className="flex h-full pt-[4rem]">
					<HomeSidebar />{" "}
					<main className="flex-1 overflow-y-auto">{children}</main>
				</div>
			</div>
		</SidebarProvider>
	);
};
