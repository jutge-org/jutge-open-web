import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    async redirects() {
        return [
            {
                source: '/statistics',
                destination: '/activity',
                permanent: true,
            },
        ];
    },
};

export default nextConfig;
