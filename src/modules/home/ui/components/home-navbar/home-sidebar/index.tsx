import { Separator } from "@/components/ui/separator";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { MainItems } from "@/modules/home/ui/components/home-navbar/home-sidebar/main-items";
import { PersonalItems } from "@/modules/home/ui/components/home-navbar/home-sidebar/personal-items";

export const HomeSidebar = () => {
	return (
		<Sidebar className="pt-16 z-40 border-none" collapsible="icon">
			<SidebarContent className="bg-background">
				<MainItems />
				<Separator />
				<PersonalItems />
			</SidebarContent>
		</Sidebar>
	);
};
