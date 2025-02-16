const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  crossOrigin: "anonymous",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    domains: [
      "res.cloudinary.com",
      "res-console.cloudinary.com",
      "via.placeholder.com",
      "avatars.githubusercontent.com",
      "lh3.googleusercontent.com",
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    serverActions: true,
  },
  webpack: (config, { isServer }) => {
    // socket.io-client를 externals에서 제거하고 fallback 설정 추가
    config.externals = [...config.externals, "bcrypt"];

    // 클라이언트 사이드에서만 적용되는 fallback 설정
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    // socket.io 관련 설정
    config.externals.push({
      "utf-8-validate": "commonjs utf-8-validate",
      bufferutil: "commonjs bufferutil",
    });

    return config;
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
};

export default nextConfig;
