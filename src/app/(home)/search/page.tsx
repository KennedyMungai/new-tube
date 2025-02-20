export const dynamic = "force-dynamic";

type Props = {
	searchParams: Promise<{ query?: string; categoryId?: string }>;
};

const SearchPage = async ({ searchParams }: Props) => {
	const { query, categoryId } = await searchParams;

	return <div>{query ?? "No query was detected"}</div>;
};

export default SearchPage;
