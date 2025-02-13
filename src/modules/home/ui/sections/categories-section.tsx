"use client";

import { FilterCarousel } from "@/components/filter-carousel";
import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

type Props = {
	categoryId?: string;
};

export const CategoriesSection = ({ categoryId }: Props) => {
	return (
		<Suspense fallback={<p>Loading...</p>}>
			<ErrorBoundary fallback={<p>Error...</p>}>
				<CategoriesSectionSuspense categoryId={categoryId} />
			</ErrorBoundary>
		</Suspense>
	);
};

const CategoriesSectionSuspense = ({ categoryId }: Props) => {
	const [categories] = trpc.categories.getMany.useSuspenseQuery();

	const data = categories.map(({ name, id }) => ({
		value: id,
		label: name,
	}));

	return <FilterCarousel value={categoryId} data={data} onSelect={(info) => console.info(info)} />;
};
