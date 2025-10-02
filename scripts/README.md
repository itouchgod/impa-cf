# PDF文件上传脚本使用说明

## 📚 概述

这个脚本用于将本地PDF文件上传到Cloudflare Pages，实现PDF文件的云端存储和访问。

## 🚀 使用方法

### 1. 环境要求

- Python 3.6+
- 已安装并配置 Cloudflare Wrangler CLI
- 已登录 Cloudflare 账户

### 2. 运行脚本

```bash
# 进入项目根目录
cd /path/to/impa

# 运行上传脚本
python3 scripts/upload_pdfs.py
```

### 3. 脚本功能

- ✅ 自动扫描 `public/pdfs/sections/` 目录下的所有PDF文件
- ✅ 创建临时目录并复制文件
- ✅ 生成美观的文件列表展示页面
- ✅ 使用 Wrangler 部署到 Cloudflare Pages
- ✅ 自动清理临时文件

## 📁 文件结构

```
scripts/
├── upload_pdfs.py          # 主上传脚本
├── upload-pdfs-to-cloudflare.js  # JavaScript版本（备用）
└── README.md              # 使用说明
```

## 🔧 配置选项

在 `upload_pdfs.py` 中可以修改以下配置：

```python
CONFIG = {
    'project_name': 'impa-pdf-storage',           # Cloudflare Pages项目名
    'pdf_source_dir': './public/pdfs/sections',   # PDF文件源目录
    'temp_dir': './temp-cloudflare-upload',       # 临时目录
    'account_id': '3bdbf85a2f2a120ab9724fdc625749f2'  # Cloudflare账户ID
}
```

## 📊 部署结果

### 访问地址

- **新部署地址**: https://98f17a84.impa-pdf-storage.pages.dev
- **自定义域名**: https://ceb894f3.impa-pdf-storage.pages.dev
- **项目主页**: https://impa-pdf-storage.pages.dev

### 文件统计

- **总文件数**: 39个PDF文件
- **总大小**: 约400MB
- **包含文件**: 
  - 所有IMPA Marine Stores Guide章节PDF
  - `accurate-split-info.json` 配置文件

## 🛠️ 故障排除

### 常见问题

1. **Wrangler未安装**
   ```bash
   npm install -g wrangler
   ```

2. **未登录Cloudflare**
   ```bash
   wrangler login
   ```

3. **权限不足**
   - 确保账户有Pages项目的写入权限
   - 检查项目名称是否正确

4. **文件上传失败**
   - 检查网络连接
   - 确认文件大小未超过Cloudflare限制
   - 查看Wrangler日志获取详细错误信息

### 日志位置

Wrangler日志位置：
```
/Users/roger/Library/Preferences/.wrangler/logs/
```

## 🔄 重新部署

如果需要重新上传文件，直接运行脚本即可：

```bash
python3 scripts/upload_pdfs.py
```

脚本会自动：
- 清理旧的临时文件
- 重新扫描PDF文件
- 重新部署到Cloudflare Pages

## 📝 注意事项

1. **文件大小限制**: Cloudflare Pages对单个文件有大小限制
2. **部署时间**: 大文件上传可能需要几分钟时间
3. **缓存更新**: 部署后可能需要等待几分钟才能看到更新
4. **备份**: 建议在部署前备份重要文件

## 🎯 自动化集成

可以将此脚本集成到CI/CD流程中：

```bash
# 在package.json中添加脚本
{
  "scripts": {
    "deploy-pdfs": "python3 scripts/upload_pdfs.py"
  }
}
```

## 📞 支持

如果遇到问题，请检查：
1. Cloudflare账户状态
2. Wrangler版本和配置
3. 网络连接状态
4. 文件权限和路径
