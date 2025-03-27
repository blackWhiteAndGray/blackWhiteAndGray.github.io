---
title: 前端性能优化
description: 浏览器渲染流程简介
---

> 性能优化是把双刃剑，有好的一面也有坏的一面。好的一面就是能提升网站性能，坏的一面就是配置麻烦，或者要遵守的规则太多。并且某些性能优化规则并不适用所有场景，需要谨慎使用。
>
> 在实际工作中，如何量化性能优化也是相当重要的一环。

## 一. 背景

1. 前端性能优化：以用户为导向的策略
   在当今的技术环境中，前端性能优化已经成为一个重要的议题。随着用户对于网页加载速度和交互反应时间的期望日益提高，只有具备优秀性能的网站才能在竞争中脱颖而出。性能优化就是寻找改进网站性能的方法和策略，而这篇文章的目的就是为你提供一些实用的建议。
2. 理解你的用户
   首先，理解你的用户是至关重要的。每个用户群体的需求和期望都可能大相径庭，所以我们需要根据他们的特性和行为来进行针对性的优化。这样做不仅能节省我们的优化精力，还能更有效地提升用户体验。
3. 调查加载和运行性能
   在开始优化工作之前，必须首先了解网站的加载性能和运行性能。没有了解问题的来源，就无法有效地解决问题。你可以使用各种工具，如Chrome的开发者工具，来检查和理解网站的性能瓶颈。一旦找到了问题，就可以开始制定解决方案。
4. 合理使用优化规则
   最后，我们需要明智地使用优化规则。虽然我们所有人都希望网站有最佳的性能，但是我们也必须避免过度优化。过度优化可能会导致代码难以理解和维护，甚至在某些情况下，可能会对性能产生负面影响。因此，我们应该始终确保我们的优化策略是在考虑到代码质量和可维护性的同时进行的。

> **综上所述，前端性能优化是一个复杂但必要的过程。理解用户，调查性能，以及合理使用优化规则，都是提升你网站性能的关键步骤。通过实施这些策略，你将能够创建一个既快速又用户友好的网站。**

## 二. 渲染流程

![image-20240820003142270](https://p.ipic.vip/sewvjv.png)

- 浏览器将HTML转换成DOM树（document）
- 浏览器将CSS解析成styleSheets、CSSOM（document.styleSheets）
- 计算出DOM中每个节点的样式（attachment）
- 创建渲染树，将DOM中可见节点添加到渲染树。并计算节点渲染到页面的坐标位置（layout）
- 通过渲染树进行分层（定位、透明、transform、clip等）生成图层树
- 将不同图层交给合成线程处理。显示到浏览器上。

> **DOM (Document Object Model)**: DOM 是一种编程接口，它将网页的结构表示为一个树状结构。每个元素、属性、和文本节点都是树中的一个节点。通过 DOM，开发者可以使用 JavaScript 动态地访问和修改网页内容。
>
> **CSSOM (CSS Object Model)**: CSSOM 是与 DOM 类似的概念，但它专门用于表示网页的样式。浏览器会将 CSS 样式表解析成一个对象模型，称为 CSSOM，它与 DOM 一起工作以确定网页的外观。
>
> **Rendering Tree (渲染树)**: 渲染树是浏览器根据 DOM 和 CSSOM 生成的，用来表示页面中每个可见元素的样式和位置。浏览器通过渲染树来计算每个元素的外观，并将它们绘制到屏幕上。
>
> **Reflow (重排)**: 重排指的是当网页的布局发生变化时，浏览器需要重新计算元素的位置和大小。比如，添加一个新的元素到页面上，或者改变一个元素的大小，就会触发重排。
>
> **Repaint (重绘)**: 重绘指的是当元素的外观发生变化，但不影响布局时，浏览器重新绘制这些元素的过程。比如，改变元素的颜色、背景等属性时会触发重绘。

## 三. 关键渲染路径

![image-20240820003118619](https://p.ipic.vip/60h1gx.png)

- 重排：添加元素、删除元素、修改大小、移动元素位置、获取位置
- 重绘：改变元素样式不影响它在文档流中的位置

1. 强制同步布局问题

   ```html
   <!-- JavaScript强制将计算样式和布局操作提前到当前任务 -->

   <div id="app"></div>
   <script>
     function reflow() {
       let el = document.getElementById('app')
       let node = document.createElement('h1')
       node.innerHTML = 'hello'
       el.appendChild(node)
       // 强制同步布局
       console.log(app.offsetHeight)
     }
     requestAnimationFrame(reflow)
   </script>
   ```

2. 布局抖动问题

   ```javascript
   // 在一段JavaScript代码中反复执行布局操作

   function reflow() {
     let el = document.getElementById('app')
     let node = document.createElement('h1')
     node.innerHTML = 'hello'
     el.appendChild(node)
     // 强制同步布局
     console.log(app.offsetHeight)
   }
   window.addEventListener('load', function () {
     for (let i = 0; i < 100; i++) {
       reflow()
     }
   })
   ```

3. 减少重排和重绘

   - 脱离文档流
   - 使用css3动画
   - will-change

## 四. 如何量化性能优化

1. 用户体验指标（性能指标）

| 关键时间节点 | 描述                                     | 含义                                                                    |
| ------------ | ---------------------------------------- | ----------------------------------------------------------------------- |
| `TTFB`       | `time to first byte`(首字节时间)         | 从用户发出请求到接收到服务器返回的第一个字节的时间                      |
| `TTI`        | `Time to Interactive`(可交互时间)        | 页面完全加载并且可以响应用户交互的时间                                  |
| `DCL`        | `DOMContentLoaded` (事件耗时)            | 浏览器完成解析 HTML 并生成 DOM 树的时间，不包括样式表、图片等资源的加载 |
| `L`          | `onLoad` (事件耗时)                      | 页面及所有依赖资源（如图片、样式表）完全加载完成的时间                  |
| `FP`         | `First Paint`（首次绘制)                 | 页面第一次绘制像素到屏幕上的时间                                        |
| `FCP`        | `First Contentful Paint`(首次内容绘制)   | 页面首次绘制有意义内容（如文本、图像）的时间                            |
| `FMP`        | `First Meaningful paint`(首次有意义绘制) | 页面首次呈现对用户有意义内容的时间                                      |
| `LCP`        | `Largest Contentful Paint`(最大内容渲染) | 页面视口中最大的元素（如大图或标题）加载完成的时间                      |
| `FID`        | `First Input Delay`(首次输入延迟)        | 用户首次与页面交互（如点击按钮）到页面开始响应的时间                    |

```javascript
<div style="background:red;height:100px;width:100px"></div>
<script>
  window.onload = function () {
  let ele = document.createElement('h1');
  ele.innerHTML = 'pf';
  document.body.appendChild(ele)
}
setTimeout(() => {
  const {
    fetchStart,
    requestStart,
    responseStart,
    domInteractive,
    domContentLoadedEventEnd,
    loadEventStart
  } = performance.timing;


  let TTFB = responseStart - requestStart; // ttfb
  let TTI = domInteractive - fetchStart; // tti
  let DCL = domContentLoadedEventEnd - fetchStart // dcl
  let L = loadEventStart - fetchStart;
  console.log(TTFB, TTI, DCL, L)

  const paint = performance.getEntriesByType('paint');
  const FP = paint[0].startTime;
  const FCP = paint[1].startTime; // 2s~4s
}, 2000);

let FMP;
new PerformanceObserver((entryList, observer) => {
  let entries = entryList.getEntries();
  FMP = entries[0];
  observer.disconnect();
  console.log(FMP)
}).observe({ entryTypes: ['element'] });

let LCP;
new PerformanceObserver((entryList, observer) => {
  let entries = entryList.getEntries();
  LCP = entries[entries.length - 1];
  observer.disconnect();
  console.log(LCP); // 2.5s-4s
}).observe({ entryTypes: ['largest-contentful-paint'] });

let FID;
new PerformanceObserver((entryList, observer) => {
  let firstInput = entryList.getEntries()[0];
  if (firstInput) {
    FID = firstInput.processingStart - firstInput.startTime;
    observer.disconnect();
    console.log(FID)
  }
}).observe({ type: 'first-input', buffered: true });
</script>
```

- **TBT**

  阻塞总时间，记录FCP到TTI之间所有场任务阻塞时间总和

- **CLS**

  非预期位移波动，手机等小屏更敏感，数值大用户体验差

2. 三大核心指标

   - LCP：速度指标
   - FID：交互体验指标
   - CLS：稳定指标

   ```tex
   // 实例
   LCP (Largest Contentful Paint)
   实际案例：
   在一个新闻网站上，LCP 可能是页面加载过程中最大的图片或文章标题。如果 LCP 时间过长，用户可能会认为页面加载缓慢或不稳定。
   应用场景：
   优化图像加载：使用图片懒加载技术或 CDN，确保用户首先看到的内容尽快呈现。
   提前加载重要资源：优先加载页面首屏的重要内容，如大标题或主要图像，以提升 LCP 性能。

   FID (First Input Delay)
   实际案例：
   在一个电子商务网站中，如果 FID 时间过长，用户点击“添加到购物车”按钮后，响应延迟会导致用户体验不佳，可能导致购物车放弃率上升。
   应用场景：
   优化 JavaScript 执行：减少长任务和主线程阻塞，确保页面能迅速响应用户的点击或输入操作。
   使用 Web Workers：将与 UI 无关的计算密集型任务移到 Web Workers 中，以保持主线程的流畅性。

   CLS (Cumulative Layout Shift)
   实际案例：
   在一个博客网站中，如果用户正在阅读文章，而页面突然因为加载广告或图片导致内容位移，用户体验会大幅下降。
   应用场景：
   预留空间：为图片、广告等内容预留空间，避免加载过程中发生布局位移。
   延迟加载：确保广告和第三方内容在不影响用户体验的情况下进行加载。
   ```

3. 检查加载性能

   - 白屏时间：指从输入网址，到页面开始显示内容的时间。

     ```javascript
     <script>
       new Date() - performance.timing.navigationStart // 通过 domLoading 和 navigationStart 也可以 
       performance.timing.domLoading - performance.timing.navigationStart
     </script>
     ```

   - 首屏时间：指从输入网址，到页面完全渲染的时间。

     - 在 `window.onload` 事件里执行 `new Date() - performance.timing.navigationStart` 即可获取首屏时间。

4. 检查运行性能

   > 配合Chrome开发者工具

   - 打开网站，按 F12 选择 performance，点击左上角的灰色圆点，变成红色就代表开始记录了。这时可以模仿用户使用网站，在使用完毕后，点击 stop，然后你就能看到网站运行期间的性能报告。如果有红色的块，代表有掉帧的情况；如果是绿色，则代表 FPS 很好。

   - 通过安装 [Lighthouse](https://chromewebstore.google.com/detail/lighthouse/blipmdconlkpinefehnmjammfjpmpbjk)插件来获取性能指标

## 五. 如何根据指标进行优化

1. 加载时优化
   - 减少http请求，多个小文件合并为一个大文件
   - http2
     - 多路复用
     - 首部压缩
     - 流量控制
     - 服务器推送
   - 服务端渲染ssr，服务器负责根据节点生成html
   - 静态资源用CDN
   - 将CSS放文件头部，JavaScript放文件底部
     - CSS执行会阻塞渲染，阻止JS执行
     - JS加载和执行会阻塞HTML解析，阻止CSSOM构建
   - 字体图标iconfont代替图片图标
   - 善用缓存，添加Expires或max-age等
   - 压缩文件
     - webpack
       - JavaScript：UglifyPlugin
       - CSS ：MiniCssExtractPlugin
       - HTML：HtmlWebpackPlugin
     - 请求头向Accept-Encoding添加gzip
   - 图片优化
     - 延迟加载
     - 使用@media根据屏幕大小加载合适图片
     - 降低图片质量
     - 利用css3效果代替图片
     - webp
   - webpack按需加载代码、提取第三方库代码、减少转换冗余代码
2. 运行时优化
   - 减少重排重绘
   - 事件委托（事件冒泡）
   - 查找表代替if-else或Switch
   - requestAnimationFrame实现视觉变化（动画）
   - Web Workers 执行与UI无关的长时间运行脚本
   - 降低CSS选择器复杂性
   - flexbox布局代替定位或浮动
   - 使用 transform 和 opacity 属性更改来实现动画（合成器处理）

## 总结

**LCP（Largest Contentful Paint）：**

- 定义：LCP 代表页面主内容加载完成的时间，通常用于衡量页面的感知加载速度。LCP 是指页面中最大可见内容元素的渲染时间，如图片、视频、或大块文本。
- 捕获方式：可以使用 PerformanceObserver 来监听 largest-contentful-paint 类型的性能条目。

**TTI（Time to Interactive）：**

- 定义：TTI 表示页面变得完全可交互的时间点，即页面内容已经渲染，且用户可以进行输入并且页面可以快速响应。
  口径：TTI 通常是指从页面开始加载到页面主线程在5秒内没有长时间任务（超过50ms），且页面已经渲染并可以交互的时间点。
- 捕获方式：可以通过 Lighthouse 等工具进行计算，或自定义逻辑检测页面加载后是否有长时间任务。

**FID（First Input Delay）：**

- 定义：FID 衡量的是用户首次与页面交互（如点击链接、按钮等）到浏览器能够响应交互的时间。
- 捕获方式：可以使用 PerformanceEventTiming API 捕获用户的首次交互事件，并计算事件发生到事件处理程序执行之间的时间差。

**CLS（Cumulative Layout Shift）：**

- 定义：CLS 衡量页面在整个生命周期内布局偏移的累计分数，反映了页面视觉稳定性。
- 捕获方式：通过 PerformanceObserver 监听 layout-shift 条目，并累积所有非用户输入导致的布局偏移得分。

**FCP（First Contentful Paint）：**

- 定义：FCP 代表页面首次渲染任何内容的时间点，如文本、图像或 SVG。
- 捕获方式：使用 PerformanceObserver 监听 paint 类型的条目，获取 first-contentful-paint。

**TTFB（Time to First Byte）：**

- 定义：TTFB 表示浏览器发出请求到接收到第一个字节响应的时间，通常用于衡量服务器响应速度。
- 捕获方式：可以通过 performance.timing 的 responseStart 和 requestStart 来计算。
