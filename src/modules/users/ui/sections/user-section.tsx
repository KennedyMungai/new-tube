"use client";

import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

type Props = {
	userId: string;
};

export const UserSection = ({ userId }: Props) => {
	return (
		<Suspense fallback={<p>Loading...</p>}>
			<ErrorBoundary fallback={<p>Error</p>}>
				<UserSectionSuspense userId={userId} />
			</ErrorBoundary>
		</Suspense>
	);
};

const UserSectionSuspense = ({ userId }: Props) => {
	const [data] = trpc.users.getOne.useSuspenseQuery({ id: userId });

	return <p>{JSON.stringify(data)}</p>;
};
