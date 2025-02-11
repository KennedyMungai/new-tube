import { ReactNode } from "react";

type Props = {
	children: ReactNode;
};

const HomeLayout = ({ children }: Props) => {
	return <div className="h-full">{children}</div>;
};

export default HomeLayout;
