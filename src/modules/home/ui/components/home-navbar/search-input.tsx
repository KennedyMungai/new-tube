"use client";

import { Button } from "@/components/ui/button";
import { APP_URL } from "@/constants";
import { SearchIcon, XIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

export const SearchInput = () => {
	const router = useRouter();

	const searchParams = useSearchParams();
	const query = searchParams.get("query") ?? "";

	const [value, setValue] = useState(query);

	const handleSearch = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const url = new URL("/search", APP_URL);
		const newQuery = value.trim();

		url.searchParams.set("query", encodeURIComponent(newQuery));

		if (newQuery === "") url.searchParams.delete("query");

		setValue(newQuery);
		router.push(url.toString());
	};

	return (
		<form onSubmit={handleSearch} className="flex w-full max-w-[600px]">
			<div className="relative w-full">
				<input
					type="text"
					placeholder="Search"
					value={value}
					onChange={(e) => setValue(e.target.value)}
					className="w-full pl-4 py-2 pr-12 rounded-l-full border focus:outline-none focus:border-blue-500 text-gray-500"
				/>
				{value && (
					<Button
						onClick={() => setValue("")}
						size="icon"
						variant="ghost"
						type="button"
						className="rounded-full absolute right-2 top-0.5 -translate-1/2">
						<XIcon className="text-gray-500" />
					</Button>
				)}
			</div>
			<button
				type="submit"
				disabled={!value.trim()}
				className="px-5 py-2.5 bg-gray-100 border border-l-0 rounded-r-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed">
				<SearchIcon className="size-5" />
			</button>
		</form>
	);
};
