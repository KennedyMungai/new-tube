import { Separator } from "@/components/ui/separator";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { MainSection } from "@/modules/home/ui/components/home-navbar/home-sidebar/main-section";
import { PersonalSection } from "@/modules/home/ui/components/home-navbar/home-sidebar/personal-section";

export const StudioSidebar = () => {
	return (
		<Sidebar className="pt-16 z-40 border-none" collapsible="icon">
			<SidebarContent className="bg-background">
				<MainSection />
				<Separator />
				<PersonalSection />
			</SidebarContent>
		</Sidebar>
	);
};
