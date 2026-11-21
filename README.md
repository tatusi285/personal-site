# 个人网站 · 上线说明

一个**纯静态**的个人主页：没有构建步骤、没有 npm 依赖、不加载任何外部 CDN 资源。
三个文件就能部署，推送到 GitHub 后 Cloudflare Pages 会自动发布，全世界都能访问。

> 当前内容已按李瀚的信息填写（2026 年 11 月）：成都工业学院软件工程 2024 级、
> 六个项目、四条能力、邮箱 2499371088@qq.com、GitHub [@tatusi285](https://github.com/tatusi285)。

```
personal-site/
├── index.html          # 页面结构与全部文字内容
├── assets/
│   ├── styles.css      # 配色、排版、响应式、动画
│   └── main.js         # 主题切换、移动端菜单、滚动动效、复制邮箱
└── README.md           # 本文件
```

---

## 一、先本地看效果

直接双击 `index.html` 用浏览器打开即可（不需要装任何东西）。
检查三件事：手机宽度下排版是否正常、右上角能切换深浅色、邮箱按钮能复制。

---

## 二、发布到 Cloudflare Pages（免费，无需备案）

### 第 1 步：把文件放进 GitHub

在 github.com 右上角 `+` → **New repository**，名字比如 `personal-site`，Public / Private 都可以，**不要**勾选自动加 README。

然后在 PowerShell 里执行（把 `<你的用户名>` 换成你的 GitHub 用户名）：

```powershell
cd "C:\Users\LH\Documents\deepseek-harness\default-workspace\personal-site"
git init -b main
git add .
git commit -m "init: 个人主页"
git remote add origin https://github.com/<你的用户名>/personal-site.git
git push -u origin main
```

> 推送时会弹窗要求登录 GitHub，正常授权即可。如果提示找不到仓库，先确认仓库已经在网页上创建好。

### 第 2 步：让 Cloudflare 接上这个仓库

1. 打开 <https://dash.cloudflare.com> 注册/登录（免费，只需要邮箱，不用信用卡）
2. 左侧 **Workers & Pages** → **Create** → 选 **Pages** → **Connect to Git**
3. 授权 GitHub，选中刚才的 `personal-site` 仓库 → **Begin setup**
4. 构建配置**照抄**下面三项（这是纯静态站，不要让它跑构建）：

| 配置项 | 填什么 |
| --- | --- |
| Framework preset | `None` |
| Build command | **留空** |
| Build output directory | `/` |

5. 点 **Save and Deploy**，等 20 秒左右

完成后你会拿到一个网址：`https://personal-site-xxx.pages.dev`。**这就是你的正式网站了**，手机、朋友、任何设备都能打开。

### 第 3 步：以后怎么更新内容

改 `index.html` 里的文字 → 在 `personal-site` 目录执行：

```powershell
git add .
git commit -m "更新内容"
git push
```

Cloudflare 会自动重新部署，几十秒后线上就是新版本。

---

## 三、接自己的域名（可选，随时可加）

1. 买域名（Cloudflare Registrar / 阿里云 / 腾讯云都可以，`.com` 约 ¥70–90/年）
2. Cloudflare Pages 项目 → **Custom domains** → **Set up a custom domain** → 输入域名
3. 按提示加一条 DNS 记录（域名如果本身就托管在 Cloudflare，它会自动配好，点一下就行）
4. 证书是自动签发的，不需要手动配 HTTPS

> 用境外托管**不需要备案**。只有把服务器/对象存储放在中国大陆境内时才需要 ICP 备案。

---

## 四、改内容：搜索 `EDIT:` 就行

打开 `index.html`，全局搜索 `EDIT:`，每一处上方或旁边都有注释告诉你该替换什么。

| 位置 | 说明 |
| --- | --- |
| `<title>` / `description` | 浏览器标签和搜索结果里的标题、简介 |
| `og:*` 标签 | 分享到微信/推特时的卡片信息，上线后填真实网址 |
| 首屏 | 名字、身份、自我介绍、状态徽标、数据栏 |
| 头像 | 换成真人照片：把 `<div class="avatar">…</div>` 换成 `<img class="avatar" src="assets/me.jpg" alt="你的名字" />`，图片放 `assets/` 里 |
| 社交链接 | GitHub / X / Email，多余的整行删掉 |
| 关于 | 两段自我介绍 + “最近”三条 + 技能标签 |
| 作品 | 每个 `<article class="card project">` 是一个项目，复制整段就能加项目 |
| 能力 | 每个 `<article class="card ability">` 一条能力，四条约占满两行 |
| 联系 | 改 `<a href="mailto:...">` 里的地址和按钮上显示的文字即可；“复制邮箱”按钮会自动读取这个链接，不用另改 |

### 换配色

打开 `assets/styles.css`，最上面的 `:root` 里改这几个变量，全站跟着变：

```css
--accent: #5eead4;   /* 主色：按钮、链接、年份 */
--accent-2: #a78bfa; /* 渐变副色：头像光环、品牌方块 */
```

浅色模式的配色在 `html[data-theme="light"]` 那一段里，通常只需要同步改 `--accent`。

---

## 五、几种常见情况的处理

**国内访问偏慢？**
Cloudflare 的免费节点在国内速度中等，一般是“能打开、首屏 1–3 秒”。如果访客主要在国内且很在意速度：
把同样的文件上传到阿里云 OSS / 腾讯云 COS 的静态网站托管 + CDN，成本几元/月，但**自定义域名需要先备案**（个人备案约 1–3 周）。

**想以后加博客？**
现在这套是“零构建”，加文章系统会累。真要写长文时，把项目换成 `Astro`：`index.html` 的内容搬进 `public/` 或改写成 `.astro` 组件，文章用 Markdown，Cloudflare 那边构建命令填 `npm run build`、输出目录填 `dist` 即可。需要我改，直接说。

**想加访问统计？**
推荐 [Umami](https://umami.is) 或 Cloudflare Web Analytics（免费、无 Cookie、不用改代码，在 Cloudflare 面板一键开启）。不要用需要弹 Cookie 同意条的统计。

**改完想撤销？**
`git checkout -- index.html` 可以丢弃未提交的修改；已推送的可以用 `git revert`。

---

## 六、已包含的细节

- 深色 / 浅色双主题，跟随系统，手动切换后记住选择，刷新不闪白
- 手机端汉堡菜单、单列布局、触控友好的按钮尺寸
- 滚动时元素依次淡入；系统开启“减少动效”时自动关闭动画
- 语义化标签 + 键盘可访问 + `:focus-visible` 焦点样式 + 跳转正文链接
- 不加载任何外部字体、图标库、统计脚本：首屏只发 4 个请求
- 打印样式（Ctrl+P 导出 PDF 时不会出现导航和头像）
