import { StudioLayout } from "@/modules/studio/ui/layouts/studio-layout";
import { ReactNode } from "react";

export const dynamic = "force-dynamic";

type Props = {
	children: ReactNode;
};

const StudioRouteLayout = ({ children }: Props) => {
	return <StudioLayout>{children}</StudioLayout>;
};

export default StudioRouteLayout;
