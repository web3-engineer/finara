/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Isso evita erros comuns de pacotes ESM em Web3
  transpilePackages: ['@rainbow-me/rainbowkit', 'wagmi', 'viem'],
  // Se você usa imagens de parceiros ou logos externos
  images: {
    domains: ['raw.githubusercontent.com', 'etherscan.io'],
  },
  // Garante que o build não trave por avisos de linting na Vercel
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;