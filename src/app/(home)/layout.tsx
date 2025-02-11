import { ReactNode } from "react";

type Props = {
	children: ReactNode;
};

const HomeLayout = ({ children }: Props) => {
	return <div>{children}</div>;
};

export default HomeLayout;
