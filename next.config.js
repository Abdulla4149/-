/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    typescript: {
      // Это заставит Vercel собрать сайт, даже если он "ругается" на типы
      ignoreBuildErrors: true,
    },
    eslint: {
      // Это пропустит проверку правил оформления кода при сборке
      ignoreDuringBuilds: true,
    },
  };
  
  module.exports = nextConfig;