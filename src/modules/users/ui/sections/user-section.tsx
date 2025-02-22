"use client";

import { Separator } from "@/components/ui/separator";
import {
	UserPageBanner,
	UserPageBannerSkeleton,
} from "@/modules/users/ui/components/user-page-banner";
import {
	UserPageInfo,
	UserPageInfoSkeleton,
} from "@/modules/users/ui/components/user-page-info";
import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

type Props = {
	userId: string;
};

export const UserSection = ({ userId }: Props) => {
	return (
		<Suspense fallback={<UserSectionSkeleton />}>
			<ErrorBoundary fallback={<p>Error</p>}>
				<UserSectionSuspense userId={userId} />
			</ErrorBoundary>
		</Suspense>
	);
};

const UserSectionSkeleton = () => {
	return (
		<div className="flex flex-col">
			<UserPageBannerSkeleton />
			<UserPageInfoSkeleton />
			<Separator />
		</div>
	);
};

const UserSectionSuspense = ({ userId }: Props) => {
	const [user] = trpc.users.getOne.useSuspenseQuery({ id: userId });

	return (
		<div className="flex flex-col">
			<UserPageBanner user={user} />
			<UserPageInfo user={user} />
			<Separator />
		</div>
	);
};
