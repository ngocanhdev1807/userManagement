/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "http://localhost:3000/auth/register",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
