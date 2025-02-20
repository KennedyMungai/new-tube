"use client";

import { FilterCarousel } from "@/components/filter-carousel";
import { trpc } from "@/trpc/client";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

type Props = {
	categoryId?: string;
};

export const CategoriesSection = ({ categoryId }: Props) => {
	return (
		<Suspense fallback={<CategoriesSkeleton />}>
			<ErrorBoundary fallback={<p>Error...</p>}>
				<CategoriesSectionSuspense categoryId={categoryId} />
			</ErrorBoundary>
		</Suspense>
	);
};

const CategoriesSkeleton = () => (
	<FilterCarousel isLoading onSelect={() => {}} data={[]} />
);

const CategoriesSectionSuspense = ({ categoryId }: Props) => {
	const [categories] = trpc.categories.getMany.useSuspenseQuery();

	const router = useRouter();

	const data = categories.map(({ name, id }) => ({
		value: id,
		label: name,
	}));

	const onSelect = (value: string | null) => {
		const url = new URL(window.location.href);

		if (value) url.searchParams.set("categoryId", value);
		else url.searchParams.delete("categoryId");

		router.push(url.toString());
	};

	return <FilterCarousel value={categoryId} data={data} onSelect={onSelect} />;
};
