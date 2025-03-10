import "@/app/globals.css";
import { Toaster } from "@/components/ui/sonner";
import { TRPCProvider } from "@/trpc/client";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "New Tube",
	description: "A cool video streaming application",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ClerkProvider afterSignOutUrl={"/"}>
			<html lang="en" suppressHydrationWarning>
				<body className={`${inter.className} antialiased`}>
					<TRPCProvider>
						{children}
						<Toaster />
					</TRPCProvider>
				</body>
			</html>
		</ClerkProvider>
	);
}
