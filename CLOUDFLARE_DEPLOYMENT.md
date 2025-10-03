# Cloudflare Pages 部署指南

## 🚀 快速部署

### 方法一：通过 Cloudflare Dashboard（推荐）

1. **准备构建文件**
   ```bash
   # 构建 Cloudflare 版本
   npm run build:cloudflare
   ```

2. **上传到 Cloudflare Pages**
   - 访问 [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - 进入 "Pages" 部分
   - 点击 "Create a project"
   - 选择 "Upload assets"
   - 上传 `out` 文件夹中的所有内容
   - 设置项目名称（如：`impa-pdf-search`）
   - 点击 "Deploy site"

### 方法二：通过 Git 集成

1. **连接 GitHub 仓库**
   - 在 Cloudflare Pages 中选择 "Connect to Git"
   - 授权并选择你的 GitHub 仓库
   - 设置构建配置：
     - **Build command**: `npm run build:cloudflare`
     - **Build output directory**: `out`
     - **Root directory**: `/` (项目根目录)

2. **环境变量设置**
   ```
   NODE_VERSION=18
   NPM_VERSION=9
   ```

## 📁 项目结构说明

### 构建后的文件结构
```
out/
├── index.html              # 首页
├── search.html             # 搜索页面
├── pdfs/                   # PDF 文件
├── icon-*.png              # PWA 图标
├── brand-icon.svg          # 品牌图标
├── manifest.json           # PWA 配置
├── sw.js                   # Service Worker
├── pdf.worker.min.js       # PDF.js Worker
├── _next/                  # Next.js 构建文件
└── _headers                # Cloudflare 头部配置
```

## ⚙️ 配置文件说明

### 1. next.config.cloudflare.ts
- 使用 `output: 'export'` 进行静态导出
- 禁用服务器端功能
- 优化 PDF.js 配置
- 设置正确的输出目录

### 2. _headers
- 配置缓存策略
- 设置安全头
- 优化 PDF 文件访问
- 配置 Service Worker

### 3. _redirects
- 处理 Next.js 路由
- 配置 PDF 文件访问
- 处理 PWA 资源

## 🔧 部署步骤详解

### 步骤 1：本地构建
```bash
# 安装依赖
npm install

# 构建 Cloudflare 版本
npm run build:cloudflare
```

### 步骤 2：验证构建结果
```bash
# 检查构建输出
ls -la out/

# 应该看到以下关键文件：
# - index.html
# - search.html
# - pdfs/
# - _headers
# - _redirects
```

### 步骤 3：上传到 Cloudflare
1. 压缩 `out` 文件夹
2. 在 Cloudflare Pages 中上传
3. 等待部署完成

### 步骤 4：配置自定义域名（可选）
1. 在 Cloudflare Pages 项目设置中
2. 添加自定义域名
3. 配置 DNS 记录

## 🌐 部署后的访问

### 默认 URL
- 部署完成后会获得类似 `https://your-project.pages.dev` 的 URL

### 功能验证
1. **首页访问**: `https://your-project.pages.dev/`
2. **搜索功能**: `https://your-project.pages.dev/search?q=test`
4. **PWA 安装**: 在移动设备上测试安装功能

## 📱 PWA 功能验证

### iOS 设备
1. 在 Safari 中打开网站
2. 点击分享按钮
3. 选择"添加到主屏幕"
4. 验证图标和全屏显示

### Android 设备
1. 在 Chrome 中打开网站
2. 点击安装提示
3. 验证应用图标和功能

## 🚨 常见问题解决

### 问题 1：部署后返回 404 错误
**原因**: `_redirects` 文件中的无效重定向规则
**解决方案**：
```bash
# 检查并修复 _redirects 文件
# 确保没有无限循环规则
# 使用正确的状态码（200, 301, 302 等）
```

### 问题 2：PDF 文件无法加载
**解决方案**：
- 检查 `_redirects` 文件中的 PDF 路由配置
- 确保 PDF 文件在 `out/pdfs/` 目录中
- 验证 `_headers` 中的 PDF 缓存配置

### 问题 3：搜索功能不工作
**解决方案**：
- 检查 `_redirects` 中的搜索路由配置
- 确保 `search.html` 文件存在
- 验证 JavaScript 文件正确加载

### 问题 4：PWA 功能异常
**解决方案**：
- 检查 `manifest.json` 文件
- 验证 Service Worker 配置
- 确保图标文件存在

### 问题 5：构建失败
**解决方案**：
```bash
# 清理缓存
rm -rf .next out node_modules
npm install
npm run build:cloudflare
```

### 问题 6：重定向循环错误
**解决方案**：
- 检查 `_redirects` 文件中的通配符规则
- 避免使用 `/*` 模式导致循环
- 使用精确匹配或正确的重定向逻辑

**详细修复指南**: 请参考 [CLOUDFLARE_DEPLOYMENT_FIX.md](./CLOUDFLARE_DEPLOYMENT_FIX.md)

## 🔄 更新部署

### 自动更新（Git 集成）
- 推送代码到 GitHub
- Cloudflare 自动构建和部署

### 手动更新
```bash
# 重新构建
npm run build:cloudflare

# 重新上传 out 文件夹
```

## 📊 性能优化

### Cloudflare 自动优化
- 全球 CDN 分发
- 自动压缩
- 图片优化
- 缓存策略

### 项目特定优化
- PDF 文件长期缓存
- 静态资源缓存
- Service Worker 缓存策略

## 🔒 安全配置

### 自动安全头
- X-Content-Type-Options
- X-Frame-Options
- X-XSS-Protection
- Referrer-Policy

### 内容安全策略
可以在 Cloudflare Dashboard 中配置 CSP 头

## 📈 监控和分析

### Cloudflare Analytics
- 访问统计
- 性能指标
- 错误监控

### 自定义监控
- 在代码中添加分析工具
- 监控 PDF 加载性能
- 跟踪用户搜索行为

## 🎯 最佳实践

1. **定期更新依赖**
2. **监控构建大小**
3. **优化 PDF 文件大小**
4. **测试所有功能**
5. **配置适当的缓存策略**

## 📞 技术支持

如果遇到问题，可以：
1. 检查 Cloudflare Pages 构建日志
2. 查看浏览器控制台错误
3. 验证配置文件语法
4. 参考 Cloudflare Pages 文档

---

**注意**: 这个项目已经针对 Cloudflare Pages 进行了优化，包括静态导出、缓存策略、路由配置等。部署后应该能够完美运行所有功能。
