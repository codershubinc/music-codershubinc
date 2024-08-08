/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        missingSuspenseWithCSRBailout: false,
    },
    images: {
        domains: [
            'cdn2.iconfinder.com'
        ]
    }
};

export default nextConfig;
