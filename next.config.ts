import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "image.mux.com",
			},
			{
				protocol: "https",
				hostname: "utfs.io",
			},
			{
				protocol: "https",
				hostname: "seal.ingest.uploadthing.com",
			},
			{
				protocol: "https",
				hostname: "6bkwru486v.ufs.sh",
			},
		],
	},
};

export default nextConfig;
