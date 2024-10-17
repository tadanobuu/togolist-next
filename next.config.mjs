/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'zyuekgrvgrilgtfagjge.supabase.co',
                port: '',
                pathname: '/storage/**', 
            },
        ],
    },
};

export default nextConfig;
