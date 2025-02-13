import { PageClient } from "@/app/(home)/client";
import { HydrateClient, trpc } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

const HomePage = async () => {
	void trpc.hello.prefetch({ text: "chickens" });

	return (
		<HydrateClient>
			<Suspense fallback={<p>Loading...</p>}>
				<ErrorBoundary fallback={<div>Something went wrong</div>}>
					<PageClient />
				</ErrorBoundary>
			</Suspense>
		</HydrateClient>
	);
};

export default HomePage;
