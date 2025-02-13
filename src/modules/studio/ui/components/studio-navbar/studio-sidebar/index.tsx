import { Separator } from "@/components/ui/separator";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { MainSection } from "@/modules/studio/ui/components/studio-navbar/studio-sidebar/main-section";
import { PersonalSection } from "@/modules/studio/ui/components/studio-navbar/studio-sidebar/personal-section";

export const StudioSidebar = () => {
	return (
		<Sidebar className="pt-16 z-40" collapsible="icon">
			<SidebarContent className="bg-background">
				<MainSection />
				<Separator />
				<PersonalSection />
			</SidebarContent>
		</Sidebar>
	);
};
