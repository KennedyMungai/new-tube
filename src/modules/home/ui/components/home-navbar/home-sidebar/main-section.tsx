"use client";

import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
	FlameIcon,
	HomeIcon,
	PlaySquareIcon,
	type LucideIcon,
} from "lucide-react";
import Link from "next/link";

const items: {
	title: string;
	url: string;
	icon: LucideIcon;
	auth?: boolean;
}[] = [
	{
		title: "Home",
		url: "/",
		icon: HomeIcon,
	},
	{
		title: "Subscriptions",
		url: "/feed/subscriptions",
		icon: PlaySquareIcon,
		auth: true,
	},
	{
		title: "Trending",
		url: "/feed/trending",
		icon: FlameIcon,
	},
];

export const MainSection = () => {
	return (
		<SidebarGroup>
			<SidebarGroupContent>
				<SidebarMenu>
					{items.map((item) => (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton
								tooltip={item.title}
								isActive={false} // TODO: Change to look at current pathname
								asChild
								onClick={() => {}} // TODO: Add click handler
							>
								<Link href={item.url} className="flex items-center gap-4">
									<item.icon />
									<span className="text-sm">{item.title}</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
};
