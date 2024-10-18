/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    env: {
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
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
