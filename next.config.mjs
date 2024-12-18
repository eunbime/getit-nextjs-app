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
    config.externals = [...config.externals, "bcrypt"];
    return config;
  },
  experimental: {
    serverActions: true,
  },
  // 동적 렌더링 경고 무시
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
