import { HomeLayout } from "@/modules/home/ui/layouts/home-layout";
import { ReactNode } from "react";

export const dynamic = "force-dynamic";

type Props = {
	children: ReactNode;
};

const HomeRouteLayout = ({ children }: Props) => {
	return <HomeLayout>{children}</HomeLayout>;
};

export default HomeRouteLayout;
