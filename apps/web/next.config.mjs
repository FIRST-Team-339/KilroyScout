/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/teams",
        destination: "/event#teams",
        permanent: true
      }
    ]
  }
};

export default nextConfig;
