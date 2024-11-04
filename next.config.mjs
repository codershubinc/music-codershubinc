/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        missingSuspenseWithCSRBailout: false,
    },
    images: { 
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn2.iconfinder.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'www.citypng.com',
                port: '',
                pathname: '/**',
            },
        ],
    }
};

export default nextConfig;
