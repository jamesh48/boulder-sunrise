/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'secure-content.meetupstatic.com',
        port: '',
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;
