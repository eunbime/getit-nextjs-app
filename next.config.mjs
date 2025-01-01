const nextConfig = {
  output: "standalone",
  images: {
    domains: [
      "res.cloudinary.com",
      "res-console.cloudinary.com",
      "via.placeholder.com",
      "avatars.githubusercontent.com",
      "lh3.googleusercontent.com",
    ],
  },
  webpack: (config) => {
    // socket.io-client를 externals에서 제거하고 fallback 설정 추가
    config.externals = [...config.externals, "bcrypt"];
    config.resolve.fallback = {
      ...config.resolve.fallback,
      net: false,
    };
    return config;
  },
  experimental: {
    serverActions: true,
    appDir: true,
    optimizeCss: true,
    scrollRestoration: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // 웹소켓 연결을 위한 리라이트 설정
  async rewrites() {
    const isDevelopment = process.env.NODE_ENV === "development";
    const socketUrl = isDevelopment
      ? "http://localhost:3000/api/socket" // 개발 환경
      : "https://market-nextjs-app.vercel.app/api/socket"; // 배포 환경

    return [
      {
        source: "/api/socket/:path*",
        destination: `${socketUrl}/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Permissions-Policy",
            value:
              "interest-cohort=(), browsing-topics=(), join-ad-interest-group=(), run-ad-auction=()",
          },
        ],
      },
      {
        source: "/chat",
        headers: [
          {
            key: "Cache-Control",
            value: "private, must-revalidate",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
