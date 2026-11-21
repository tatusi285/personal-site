# 个人网站 · 上线说明

一个**纯静态**的个人主页：没有构建步骤、没有 npm 依赖、不加载任何外部 CDN 资源。
所有文件都在一个仓库里，`git push` 后 GitHub Pages 自动发布。

> 当前内容（2026 年 11 月）：成都工业学院软件工程 2024 级 · 李瀚；
> 4 个精选项目 + 3 个其他原型、四条能力、四类可实习方向；
> 邮箱 2499371088@qq.com、电话 182 1577 1018、GitHub [@tatusi285](https://github.com/tatusi285)。

```
personal-site/
├── index.html                  # 页面结构与全部文字内容
├── assets/
│   ├── styles.css              # 配色、排版、响应式、动画
│   ├── main.js                 # 主题切换、移动端菜单、滚动动效、复制邮箱
│   ├── me.webp                 # 头像（640×640 面部特写）
│   └── work/                   # 项目实录素材
│       ├── haloflux.mp4        #   屏保实录 27 秒 · 1280×720 · 1.4 MB
│       ├── haloflux-poster.jpg #   视频封面帧
│       ├── disk-keeper.webp    #   存储总览界面截图
│       ├── dsh-maintenance.webp#   体检报告控制台截图
│       └── memory-paper.webp   #   论文首页
└── README.md                   # 本文件
```

---

## 一、先本地看效果

直接双击 `index.html` 用浏览器打开即可（不需要装任何东西）。
检查三件事：手机宽度下排版是否正常、右上角能切换深浅色、邮箱按钮能复制。

---

## 二、发布：GitHub Pages（已启用）

线上地址：**<https://tatusi285.github.io/personal-site/>**
仓库：<https://github.com/tatusi285/personal-site>（公开，`main` 分支）

发布链路很简单：**`git push` → GitHub Pages 自动构建 → 1~2 分钟后线上更新**。
不用手动上传，也不用登录任何第三方面板。

### 以后怎么更新内容

改完文件，在 `personal-site` 目录执行：

```powershell
git add .
git commit -m "更新内容"
git push
```

进度看仓库的 **Actions** 标签，`pages build and deployment` 跑绿就发布完成。

### 当初是怎么开的（备查）

仓库 **Settings → Pages** → Source 选 `Deploy from a branch` → 分支 `main`、目录 `/ (root)` → Save。
根目录的 `.nojekyll` 是给 Pages 的标记，让它原样发布静态文件、不跑 Jekyll 处理——**不要删**。

### 为什么不是 Cloudflare Pages

原本计划用 Cloudflare Pages，但在国内部分网络下 `dash.cloudflare.com` 直接超时（API 端点是通的，可创建 Token 又必须进面板），所以改走 GitHub Pages。
以后若网络/域名条件变了想换回去，文件不用改：Cloudflare Pages 连同一个仓库、构建命令留空、输出目录 `/` 即可，两个地址可以并存。

---

## 三、接自己的域名（可选，随时可加）

1. 买域名（阿里云 / 腾讯云 / Cloudflare Registrar 都可以，`.com` 约 ¥70–90/年）
2. 仓库 **Settings → Pages → Custom domain** 填入域名 → Save
3. 到域名商加解析：`CNAME` 记录指向 `tatusi285.github.io`（根域名用 A 记录指向 GitHub 的四个 IP）
4. 等 DNS 生效后，在 Pages 页面勾上 **Enforce HTTPS**（证书是自动签发的）

> 用境外托管**不需要备案**。只有把服务器/对象存储放在中国大陆境内时才需要 ICP 备案。


---

## 四、改内容：搜索 `EDIT:` 就行

打开 `index.html`，全局搜索 `EDIT:`，每一处上方或旁边都有注释告诉你该替换什么。

| 位置 | 说明 |
| --- | --- |
| `<title>` / `description` | 浏览器标签和搜索结果里的标题、简介 |
| `og:*` 标签 | 分享到微信/推特时的卡片信息，现在是真实网址 |
| 首屏 | 名字、身份、自我介绍、状态徽标、数据栏 |
| 头像 | `assets/me.webp`（640×640，面部特写）。换照片时保持正方形，或直接替换后调 `build` 参数 |
| 社交链接 | GitHub / Email / 电话，多余的整行删掉 |
| 关于 | 两段工作说明 + “当前工作”三条 + 技术栈标签 |
| 项目 | 每个 `<article class="card project">` 一个项目，含 `<figure class="work-figure">` 实录区；不需要实录就删掉整个 figure |
| 其他原型 | `<ol class="proto-list">` 里的三行，复制 `<li>` 可增加 |
| 能力 | 每个 `<article class="card ability">` 一条，四条约占满两行 |
| 实习 | `<ol class="proto-list role-list">` 里每行一个方向，`<em>` 是方向副标题；上方留了可实习时间/地点的 EDIT 注释位 |
| 联系 | 改 `<a href="mailto:...">` 的地址与按钮文字；电话改 `href="tel:+86..."` 和显示文字；“复制邮箱”会自动读取 mailto 链接 |

> 顶部还有一段 `application/ld+json` 结构化数据（姓名、职务、邮箱、电话、学校），
> 改联系方式时记得同步，搜索引擎与分享卡片会读它。

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
`github.io` 在国内有时快有时慢（实测首屏 1 秒左右，但会受网络波动影响）。两条路：
① 接一个自己的域名指向 GitHub Pages，通常比裸 `github.io` 稳定；
② 换成 Cloudflare Pages / Vercel 部署同一套文件（国内速度略好），或放到阿里云 OSS / 腾讯云 COS + CDN（最快，但自定义域名要先备案，个人备案约 1–3 周）。

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
