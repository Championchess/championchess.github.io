# 詹冠其个人主页：本地查看与 GitHub 发布

这个版本是纯静态网站。无需安装软件、无需构建，也不需要数据库。

## 先在本地打开

双击本文件同一文件夹中的 **index.html**，选择 Chrome、Safari 或其他浏览器打开。

请保留整个 `guanqi-site` 文件夹的结构：HTML 会读取同目录的样式、交互文件和 `assets` 里的照片、GIF。单独复制 `index.html` 会丢失这些素材。

- 收录所提供的全部 14 篇论文，每篇都有标题、发表位置、作者、摘要和 GIF。
- EGM 标注 **ECCV 2026**。
- ELIP 标注 **IEEE CBMI 2025 · Best Paper Candidate**。
- 物理属性论文显示为 ***CVPR*, 2026 (Best Paper Runner-Up, VGBE Workshop)**，正式 BibTeX 保留 Workshop 会议信息。
- 可按研究方向筛选、搜索论文、按年份排序；点击 demo 可放大并下载 GIF。
- “Pause demos” 暂停所有动画。若操作系统启用了减少动态效果，默认显示静态预览。
- 图片和演示全部保存在本地。点击论文、项目、代码、Scholar 等外部链接时才需要联网。

## 发布到 GitHub Pages：浏览器操作即可

### 1. 新建仓库

登录 [GitHub](https://github.com/)，点击右上角 **＋ → New repository**。

- Repository name 填：**你的GitHub用户名.github.io**。
- 例如用户名是 `yourname`，仓库名就是 `yourname.github.io`。这里的用户名要换成你的真实 GitHub 用户名，并使用小写。
- 选择 **Public**。GitHub Free 的 Pages 使用公开仓库。
- 勾选 **Add a README file**，点击 **Create repository**。

如果这个同名仓库已经存在，直接进入它。先查看现有文件，避免不小心覆盖已经在线使用的网站。

### 2. 上传网站文件

进入仓库，点击 **Add file → Upload files**。

从 Finder 中打开 `guanqi-site`，把**文件夹里面的内容**拖进去：

```text
index.html                 ← 必须在仓库根目录
styles.css
app.js
assets/                    ← 整个文件夹，包含照片、GIF 和静态预览
publications.bib
papers.json
.nojekyll                  ← 隐藏文件，可选；本项目附带
README-发布到GitHub.md
```

不要把 ZIP 压缩包当网站上传；请先解压。也不要再把整个 `guanqi-site` 文件夹作为一层目录上传，否则根目录找不到 `index.html`。

最下面填写提交说明，例如 `Add personal homepage`，点击 **Commit changes**。文件上传需要一小段时间，等所有文件上传完再提交。

`.nojekyll` 在 Finder 中默认隐藏，可按 **Command + Shift + .** 显示。即使通过浏览器上传时漏掉它，这个网站的普通 HTML、CSS、JS 和素材路径也仍可使用默认 Pages 流程。

### 3. 开启 Pages

进入仓库顶部 **Settings → 左侧 Pages**：

1. 在 **Build and deployment → Source** 选择 **Deploy from a branch**。
2. Branch 选择 **main**，目录选择 **/ (root)**。
3. 点击 **Save**。

### 4. 查看上线结果

等待部署完成，通常几分钟，官方说明最长可能需要约 10 分钟。回到 **Settings → Pages**，点击 **Visit site**。

地址将是：

```text
https://你的GitHub用户名.github.io/
```

如果看到 404，检查仓库名是否正确、`index.html` 是否在根目录，以及 Pages 是否选择了 `main / (root)`。也可以在仓库 **Actions** 中查看部署是否完成。

### 5. 以后更新

在 GitHub 仓库里打开 `index.html`，点击铅笔按钮编辑文字，保存并提交即可。修改样式用 `styles.css`；替换动图则上传到 `assets/demos/`，保留原文件名即可。

`papers.json` 是论文资料的结构化备份，`publications.bib` 是引用集合。页面已经写成静态 HTML，所以单独修改 JSON 不会自动改变网页；论文信息变动时应同时更新 HTML 和引用文件。

## 网站内容

研究主线为：**foundation / generative models → 理解、生成与交互物理世界 → World Models / Physical AI**。

- 全部 14 篇论文均配有独立的研究主题、简介与 GIF。
- 页面包含 5 场 invited talks、学术服务，以及个人兴趣。
- 联系入口位于页面顶部，可在 `index.html` 中修改 Email 链接。

## GitHub 官方说明

- [创建 GitHub Pages 站点](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)
- [选择发布分支和目录](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
