### 个人博客

> 博客文章格式采用是 MarkDown+ YAML 的方式

```javascript
---
layout:     post   				    # 使用的布局（不需要改）
title:      My First Post 				# 标题
subtitle:   Hello World, Hello Blog #副标题
date:       2017-02-06 				# 时间
author:     BY 						# 作者
header-img: img/post-bg-2015.jpg 	#这篇文章标题背景图片
catalog: true 						# 是否归档
tags:								#标签
    - 生活
---

## Hey
>这是我的第一篇博客。

进入你的博客主页，新的文章将会出现在你的主页上.
```

### 项目启动

1. jekyll s

### 更新到 cloudflare

1. bundle exec jekyll build
2. wrangler pages deploy \_site --project-name ricardo-blog
