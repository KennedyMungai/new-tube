"use client";

import { trpc } from "@/trpc/client";

type Props = {
	categoryId?: string;
};

export const CategoriesSection = ({ categoryId }: Props) => {
	const [categories] = trpc.categories.getMany.useSuspenseQuery();

	return <div>{JSON.stringify(categories)}</div>;
};
