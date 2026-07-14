import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    cacheComponents: true,
    //    productionBrowserSourceMaps: true,

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
        ]
    },
}

export default nextConfig
