import type { NextConfig } from "next";

const nextConfig: NextConfig = {

    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'jutge.org',
                port: '',
                pathname: '/**',
                search: '',
            },
        ],
    },

    async redirects() {
        return [
            {
                source: '/statistics',
                destination: '/activity',
                permanent: true,
            },
            {
                source: '/courses/enrolled',
                destination: '/courses',
                permanent: true,
            },
            {
                source: '/courses/archived',
                destination: '/courses?tab=archived',
                permanent: true,
            },
            {
                source: '/courses/available',
                destination: '/courses?tab=available',
                permanent: true,
            },
            {
                source: '/courses/public/:course_key',
                destination: '/courses/public',
                permanent: true,
            },
        ];
    },
};

export default nextConfig;
