import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare Pages 优化配置
  output: 'export', // 静态导出，适配 Cloudflare Pages
  trailingSlash: true, // 添加尾部斜杠，提升兼容性
  skipTrailingSlashRedirect: true, // 跳过重定向
  
  // 禁用服务器端功能
  distDir: 'out', // 输出目录
  
  // 跳过 not-found 页面生成
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
  
  // 图片优化 - 保持未优化状态
  images: {
    unoptimized: true, // PDF 图标不需要优化
  },
  
  // 性能优化
  compress: true,
  poweredByHeader: false,
  
  // 服务器端外部包配置
  serverExternalPackages: ['canvas'],
  
  webpack: (config, { isServer, dev }) => {
    // PDF.js worker 配置
    config.resolve.alias.canvas = false;

    if (isServer) {
      // 在服务器端构建时忽略 canvas 模块
      config.externals = [...(config.externals || []), 'canvas'];
    }

    // 生产环境优化
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
            pdfjs: {
              test: /[\\/]node_modules[\\/]pdfjs-dist[\\/]/,
              name: 'pdfjs',
              chunks: 'all',
              priority: 10,
            },
          },
        },
      };
    }

    return config;
  },
};

export default nextConfig;
