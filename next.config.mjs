const nextConfig = {
  output: "standalone",
  images: {
    domains: [
      "res.cloudinary.com",
      "res-console.cloudinary.com",
      "via.placeholder.com",
    ],
  },
  webpack: (config) => {
    config.externals = [...config.externals, "bcrypt", "socket.io-client"];
    return config;
  },
  experimental: {
    serverActions: true,
  },
  // 동적 렌더링 경고 무시
  eslint: {
    ignoreDuringBuilds: true,
  },
  // 웹소켓 연결을 위한 리라이트 설정
  async rewrites() {
    return [
      {
        source: "/api/socket/:path*",
        destination: `${process.env.NEXT_PUBLIC_SITE_URL}/api/socket/:path*`,
      },
    ];
  },
};

export default nextConfig;
