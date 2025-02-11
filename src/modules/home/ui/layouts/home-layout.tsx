import { SidebarProvider } from "@/components/ui/sidebar";
import { HomeNavbar } from "@/modules/home/ui/components/home-navbar";
import { ReactNode } from "react";

type Props = {
	children: ReactNode;
};

export const HomeLayout = ({ children }: Props) => {
	return (
		<SidebarProvider>
			<div className="w-full">
				<HomeNavbar />
				<div>{children}</div>
			</div>
		</SidebarProvider>
	);
};
