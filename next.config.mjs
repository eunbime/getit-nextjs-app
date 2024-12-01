const nextConfig = {
  /* config options here */
  experimental: {
    appDir: true, // 반드시 활성화되어야 함
  },
  images: {
    domains: [
      "res.cloudinary.com",
      "res-console.cloudinary.com",
      "via.placeholder.com",
    ],
  },
};

export default nextConfig;
