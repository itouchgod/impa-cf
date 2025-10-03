#!/bin/bash

# Cloudflare Pages 部署脚本
# 使用方法: ./deploy-cloudflare.sh

echo "🚀 开始 Cloudflare Pages 部署..."

# 检查 Node.js 和 npm
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm 未安装，请先安装 npm"
    exit 1
fi

# 安装依赖
echo "📦 安装依赖..."
npm install

# 构建 Cloudflare 版本
echo "🔨 构建 Cloudflare 版本..."
npm run build:cloudflare

# 检查构建结果
if [ ! -d "out" ]; then
    echo "❌ 构建失败，out 目录不存在"
    exit 1
fi

echo "✅ 构建成功！"
echo ""
echo "📁 构建文件位置: ./out/"
echo "📊 构建文件大小:"
du -sh out/
echo ""
echo "🌐 部署步骤:"
echo "1. 访问 https://dash.cloudflare.com/"
echo "2. 进入 'Pages' 部分"
echo "3. 点击 'Create a project'"
echo "4. 选择 'Upload assets'"
echo "5. 上传 out 文件夹中的所有内容"
echo "6. 设置项目名称（如：impa-pdf-search）"
echo "7. 点击 'Deploy site'"
echo ""
echo "📋 或者使用 Git 集成:"
echo "1. 推送代码到 GitHub"
echo "2. 在 Cloudflare Pages 中选择 'Connect to Git'"
echo "3. 设置构建命令: npm run build:cloudflare"
echo "4. 设置输出目录: out"
echo ""
echo "🎉 部署完成后，你将获得一个类似 https://your-project.pages.dev 的 URL"
