import { UsersGetOneOutput } from "@/modules/users/types";

type Props = {
	user: UsersGetOneOutput;
};

export const UserPageInfo = ({ user }: Props) => {
	return <div>{JSON.stringify(user)}</div>;
};
