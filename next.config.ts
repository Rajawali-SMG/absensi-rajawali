import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	experimental: {
		cssChunking: true,
	},
	typedRoutes: true,
};

export default nextConfig;
