/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.SUPABASE_URL.replace("https://", ""),
        port: "",
        pathname: "/storage/**",
      },
    ],
  },
};

module.exports = nextConfig;
