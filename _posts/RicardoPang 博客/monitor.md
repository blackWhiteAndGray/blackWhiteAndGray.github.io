---
title: 前端监控与埋点
description: 开发SDK
---

> 获取用户行为以及跟踪产品在用户端的使用情况，并以监控数据为基础，指明产品优化的方向。

# 前端监控埋点

## 一、为什么需要监控：

1. 快速发现和解决问题：通过实时监控前端错误和性能瓶颈，能够迅速定位和修复问题，减少用户流失。
2. 数据驱动决策：收集的用户行为和性能数据为产品优化和业务决策提供了有力支持。
3. 提升技术深度和广度：前端监控系统的实现涉及多项技术，全面提升了工程师的技能水平。
4. 业务扩展可能性：提供了更多的数据维度，支持业务的进一步扩展和创新。

## 二、前端监控目标

#### 2.1 稳定性(stability)

| 错误名称 | 备注                       |
| :------- | :------------------------- |
| JS错误   | JS执行错误或者promise异常  |
| 资源异常 | script、link等资源加载异常 |
| 接口错误 | ajax或fetch请求接口异常    |
| 白屏     | 页面空白                   |

#### 2.2 用户体验(experience)

| 错误名称                                    | 备注                                                         |
| :------------------------------------------ | :----------------------------------------------------------- |
| 加载时间                                    | 各个阶段的加载时间                                           |
| TTFB(time to first byte)(首字节时间)        | 是指浏览器发起第一个请求到数据返回第一个字节所消耗的时间，这个时间包含了网络请求时间、后端处理时间 |
| FP(First Paint)(首次绘制)                   | 首次绘制包括了任何用户自定义的背景绘制，它是将第一个像素点绘制到屏幕的时刻 |
| FCP(First Content Paint)(首次内容绘制)      | 首次内容绘制是浏览器将第一个DOM渲染到屏幕的时间,可以是任何文本、图像、SVG等的时间 |
| FMP(First Meaningful paint)(首次有意义绘制) | 首次有意义绘制是页面可用性的量度标准                         |
| FID(First Input Delay)(首次输入延迟)        | 用户首次和页面交互到页面响应交互的时间                       |
| 卡顿                                        | 超过50ms的长任务                                             |

#### 2.3 业务(business)

| 错误名称       | 备注                             |
| :------------- | :------------------------------- |
| PV             | page view 即页面浏览量或点击量   |
| UV             | 指访问某个站点的不同IP地址的人数 |
| 页面的停留时间 | 用户在每一个页面的停留时间       |

## 三、前端监控流程

1. 前端埋点
2. 数据上报
3. 分析和计算 将采集到的数据进行加工汇总
4. 可视化展示 将数据按各种维度进行展示
5. 监控报警 发现问题后按一定的条件触发报警

![image-20240830225214439](https://p.ipic.vip/sd6rn0.png)

#### 3.1 常见埋点方案

- 代码埋点
  - 代码埋点，就是以嵌入代码的形式进行埋点，比如需要监控用户的点击事件，会选择在用户点击时，插入一段代码，保存这个监听行为或者直接将监听行为以某一种数据格式直接传递给server端。此外比如需要统计产品的PV和UV的时候，需要在网页的初始化时，发送用户的访问信息等。
  - 优点：可以在任意时刻，精确的发送或保存所需要的数据信息。
  - 缺点：工作量较大，每一个组件的埋点都需要添加相应的代码。
- 可视化埋点
  - 通过可视化交互的手段，代替代码埋点。将业务代码和埋点代码分离，提供一个可视化交互的页面，输入为业务代码，通过这个可视化系统，可以在业务代码中自定义的增加埋点事件等等，最后输出的代码耦合了业务代码和埋点代码。
  - 可视化埋点听起来比较高大上，实际上跟代码埋点还是区别不大。也就是用一个系统来实现手动插入代码埋点的过程。
  - 缺点：可视化埋点可以埋点的控件有限，不能手动定制。
- 无埋点
  - 无埋点并不是说不需要埋点，而是`全部埋点`，前端的任意一个事件都被绑定一个标识，所有的事件都别记录下来。通过定期上传记录文件，配合文件解析，解析出来我们想要的数据，并生成可视化报告供专业人员分析因此实现“无埋点”统计。
  - 从语言层面实现无埋点也很简单，比如从页面的js代码中，找出dom上被绑定的事件，然后进行全埋点
  - 优点：由于采集的是全量数据，所以产品迭代过程中是不需要关注埋点逻辑的，也不会出现漏埋、误埋等现象
  - 缺点：无埋点采集全量数据，给数据传输和服务器增加压力。无法灵活的定制各个事件所需要上传的数据。

## 四、编写监控采集脚本

#### 4.1 开通日志服务

- [日志服务(Log Service,简称 SLS)](https://sls.console.aliyun.com/lognext/profile)是针对日志类数据一站式服务，用户无需开发就能快捷完成数据采集、消费、投递以及查询分析等功能，帮助提升运维、运营效率，建立 DT 时代海量日志处理能力

  ![iShot_2024-08-31_10.41.20](https://p.ipic.vip/wiwxn0.png)

  ![iShot_2024-08-31_10.42.48](https://p.ipic.vip/rwu5jc.png)

  ![iShot_2024-08-31_10.43.05](https://p.ipic.vip/2m0cer.png)

  ![iShot_2024-08-31_10.43.49](https://p.ipic.vip/673djj.png)

  ![iShot_2024-08-31_10.44.15](https://p.ipic.vip/swu9v1.png)

  ![iShot_2024-08-31_10.44.31](https://p.ipic.vip/h3zj2b.png)

  ![iShot_2024-08-31_10.44.44](https://p.ipic.vip/h0llz3.png)

  ![image-20240907090138190](https://p.ipic.vip/a12c31.png)

- [日志服务帮助文档](https://help.aliyun.com/product/28958.html)

#### 4.2 监控错误

- JS错误：JS错误、Promise异常

- 资源异常：监听error

- 数据结构设计

  - jsError

    ```js
    {
      "title": "前端监控系统",//页面标题
      "url": "http://localhost:8080/",//页面URL
      "timestamp": "1590815288710",//访问时间戳
      "userAgent": "Chrome",//用户浏览器类型
      "kind": "stability",//大类
      "type": "error",//小类
      "errorType": "jsError",//错误类型
      "message": "Uncaught TypeError: Cannot set property 'error' of undefined",//类型详情
      "filename": "http://localhost:8080/",//访问的文件名
      "position": "0:0",//行列信息
      "stack": "btnClick (http://localhost:8080/:20:39)^HTMLInputElement.onclick (http://localhost:8080/:14:72)",//堆栈信息
      "selector": "HTML BODY #container .content INPUT"//选择器
    }
    ```

  - promiseError

    ```js
    {
      "title": "前端监控系统",//页面标题
      "url": "http://localhost:8080/",//页面URL
      "timestamp": "1590815290600",//访问时间戳
      "userAgent": "Chrome",//用户浏览器类型
      "kind": "stability",//大类
      "type": "error",//小类
      "errorType": "promiseError",//错误类型
      "message": "someVar is not defined",//类型详情
      "filename": "http://localhost:8080/",//访问的文件名
      "position": "24:29",//行列信息
      "stack": "http://localhost:8080/:24:29^new Promise (<anonymous>)^btnPromiseClick (http://localhost:8080/:23:13)^HTMLInputElement.onclick (http://localhost:8080/:15:86)",//堆栈信息
      "selector": "HTML BODY #container .content INPUT"//选择器
    }
    ```

  - resourceError

    ```js
    {
      "title": "前端监控系统",//页面标题
      "url": "http://localhost:8080/",//页面URL
      "timestamp": "1590816168643",//访问时间戳
      "userAgent": "Chrome",//用户浏览器类型
      "kind": "stability",//大类
      "type": "error",//小类
      "errorType": "resourceError",//错误类型
      "filename": "http://localhost:8080/error.js",//访问的文件名
      "tagName": "SCRIPT",//标签名
      "timeStamp": "76",//时间
      "selector": "HTML BODY SCRIPT"//选择器
    }
    ```

- 实现

  1. vite.config.ts

     ```tsx
     import { defineConfig, Plugin, ViteDevServer } from 'vite'
     
     // 创建一个自定义插件来模拟 webpack 的 before 功能
     const mockServerPlugin = (): Plugin => ({
       name: 'mock-server',
       configureServer(server: ViteDevServer) {
         server.middlewares.use((req, res, next) => {
           if (req.url === '/success' && req.method === 'GET') {
             res.setHeader('Content-Type', 'application/json')
             res.end(JSON.stringify({ id: 1 }))
             return
           }
           if (req.url === '/error' && req.method === 'POST') {
             res.statusCode = 500
             res.end()
             return
           }
           next()
         })
       }
     })
     
     // https://vitejs.dev/config/
     export default defineConfig({
       build: {
         rollupOptions: {
           input: './index.ts',
           output: [
             {
               format: 'es', // 输出格式为 ES 模块
               dir: 'dist/es',
               entryFileNames: '[name].js',
               preserveModules: true, // 保留原来目录结构
               preserveModulesRoot: '.',
               assetFileNames: '[name][extname]'
             },
             {
               format: 'commonjs', // 输出格式为 CommonJS 模块
               dir: 'dist/lib',
               entryFileNames: '[name].js',
               preserveModules: true,
               preserveModulesRoot: '.',
               assetFileNames: '[name][extname]'
             },
             {
               format: 'es',
               dir: 'dist',
               entryFileNames: '[name].mjs', // 输出单文件
               assetFileNames: '[name][extname]'
             },
             {
               format: 'commonjs',
               dir: 'dist',
               entryFileNames: '[name].js',
               assetFileNames: '[name][extname]'
             }
           ],
           preserveEntrySignatures: 'strict' // 保留入口签名
         },
         sourcemap: true, // 生成 source map，对应到具体代码
         emptyOutDir: false
       },
       plugins: [mockServerPlugin()],
       server: {
         port: 8080,
         open: true
       }
     })
     ```

  2. index.html

     ```html
     <!doctype html>
     <html lang="en">
       <head>
         <meta charset="UTF-8" />
         <link rel="icon" href="/favicon.ico" />
         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
         <title>前端监控</title>
       </head>
       <body>
         <div id="app"></div>
         <div id="container">
           <div
             class="content"
             style="
               width: 600px;
               height: 600px;
               word-wrap: break-word;
               background-color: gray;
             "
           >
             <button id="clickBtn" onclick="clickMe()">点我</button>
             <input type="button" value="点击抛出错误" onclick="errorClick()" />
             <input
               type="button"
               value="点击抛出Promise错误"
               onclick="promiseErrorClick()"
             />
             <input
               id="successBtn"
               type="button"
               value="ajax成功请求"
               onclick="sendSuccess()"
             />
             <input
               id="errorBtn"
               type="button"
               value="ajax失败请求"
               onclick="sendError()"
             />
             <button id="longTaskBtn">执行longTask</button>
           </div>
         </div>
         <script>
           function clickMe() {
             let start = Date.now()
             while (Date.now() - start < 1000) {}
           }
           function errorClick() {
             window.someVar.error = 'error'
           }
           function promiseErrorClick() {
             new Promise(function (resolve, reject) {
               window.someVar.error = 'error'
             })
           }
           function sendSuccess() {
             const xhr = new XMLHttpRequest()
             xhr.open('GET', '/success', true)
             xhr.responseType = 'json'
             xhr.onload = function () {
               console.log(xhr.response)
             }
             xhr.send()
           }
           function sendError() {
             const xhr = new XMLHttpRequest()
             xhr.open('POST', '/error', true)
             xhr.responseType = 'json'
             xhr.onload = function () {
               console.log(xhr.response)
             }
             xhr.onerror = function () {
               console.log('error')
             }
             xhr.send('name=pf')
           }
           setTimeout(() => {
             let content = document.getElementsByClassName('content')[0]
             let h1 = document.createElement('h1')
             h1.innerHTML = '我是这个页面中最有意义的内容'
             h1.setAttribute('elementtiming', 'meaningful')
             content.appendChild(h1)
           }, 2000)
     
           let longTaskBtn = document.getElementById('longTaskBtn')
           longTaskBtn.addEventListener('click', longTask)
           function longTask() {
             let start = Date.now()
             console.log('longTask开始 start', start)
             while (Date.now() < 200 + start) {}
             console.log('longTask结束 end', Date.now() - start)
           }
         </script>
         <script type="module">
           import { init } from './index.ts'
     
           // 初始化监控
           init({
             jsError: true,
             xhr: true,
             blankScreen: true,
             timing: true,
             longTask: true,
             trackPageView: true
           })
         </script>
         <script src="somelink.js"></script>
       </body>
     </html>
     ```

  3. src/index.ts

     ```tsx
     import { injectJsError } from './src/monitor/lib/jsError'
     import { injectXHR } from './src/monitor/lib/xhr'
     import { blankScreen } from './src/monitor/lib/blankScreen'
     import { timing } from './src/monitor/lib/timing'
     import { longTask } from './src/monitor/lib/longTask'
     import { trackPageView } from './src/monitor/lib/pv'
     
     interface MonitorOptions {
       jsError?: boolean
       xhr?: boolean
       blankScreen?: boolean
       timing?: boolean
       longTask?: boolean
       trackPageView?: boolean
     }
     
     function init(options: MonitorOptions = {}): void {
       const {
         jsError = true,
         xhr = true,
         blankScreen: enableBlankScreen = true,
         timing: enableTiming = true,
         longTask: enableLongTask = true,
         trackPageView: enableTrackPageView = true
       } = options
     
       if (jsError) injectJsError()
       if (xhr) injectXHR()
       if (enableBlankScreen) blankScreen()
       if (enableTiming) timing()
       if (enableLongTask) longTask()
       if (enableTrackPageView) trackPageView()
     }
     
     export {
       init,
       injectJsError,
       injectXHR,
       blankScreen,
       timing,
       longTask,
       trackPageView
     }
     
     export default {
       init,
       injectJsError,
       injectXHR,
       blankScreen,
       timing,
       longTask,
       trackPageView
     }
     ```

  4. src\monitor\lib\jsError.ts

     ```tsx
     import formatTime from '../utils/formatTime'
     import getLastEvent from '../utils/getLastEvent'
     import getSelector, { getEventPath } from '../utils/getSelector'
     import tracker from '../utils/tracker'
     
     interface ErrorDetails {
       kind: string
       type: string
       errorType: string
       message?: string
       filename?: string
       position?: string
       stack?: string
       selector: string
       tagName?: string
       timeStamp?: string
     }
     
     export function injectJsError() {
       // 监听全局未捕获的错误
       window.addEventListener('error', handleErrorEvent, true)
       window.addEventListener('unhandledrejection', handlePromiseRejection, true)
     
       function handleErrorEvent(event: ErrorEvent) {
         const lastEvent = getLastEvent() // 最后一个交互事件
         if (isResourceError(event)) {
           // 脚本加载错误
           const target = event.target as HTMLScriptElement | HTMLLinkElement
           sendErrorReport({
             kind: 'stability', // 监控指标的大类(稳定性)
             type: 'error', // 小类型 这是一个错误
             errorType: 'resourceError', // js或css资源加载错误
             filename:
               target instanceof HTMLScriptElement ? target.src : target.href, // 哪个文件报错了(加载失败的资源)
             tagName: target.tagName, // script(标签名)
             timeStamp: formatTime(event.timeStamp), //时间
             selector: getSelector(target) // 代表最后一个操作的元素(选择器)
           })
         } else {
           sendErrorReport({
             kind: 'stability',
             type: 'error',
             errorType: 'jsError',
             message: event.message, // 报错信息
             filename: event.filename, // 报错链接
             position: `${event.lineno}:${event.colno}`, // 行列号
             stack: getLines(event.error?.stack), // 错误堆栈
             selector: lastEvent ? getSelector(getEventPath(lastEvent)) : '' // CSS选择器
           })
         }
       }
     
       function handlePromiseRejection(event: PromiseRejectionEvent) {
         const lastEvent = getLastEvent()
         const { message, filename, line, column, stack } = parsePromiseError(
           event.reason
         )
         sendErrorReport({
           kind: 'stability',
           type: 'error',
           errorType: 'promiseError',
           message,
           filename,
           position: `${line}:${column}`,
           stack,
           selector: lastEvent ? getSelector(getEventPath(lastEvent)) : ''
         })
       }
     
       function parsePromiseError(reason: any) {
         let message = ''
         let filename = ''
         let line = 0
         let column = 0
         let stack = ''
     
         if (typeof reason === 'string') {
           message = reason
         } else if (reason && typeof reason === 'object' && reason.stack) {
           // 说明是一个错误对象
           message = reason.message
           const matchResult = reason.stack.match(/at\s+(.+):(\d+):(\d+)/)
           if (matchResult) {
             ;[filename, line, column] = matchResult.slice(1, 4)
           }
           stack = getLines(reason.stack)
         }
     
         return { message, filename, line, column, stack }
       }
     
       function sendErrorReport(details: ErrorDetails) {
         tracker.send(details)
       }
     
       function isResourceError(event: ErrorEvent) {
         return (
           event.target &&
           (event.target instanceof HTMLScriptElement ||
             event.target instanceof HTMLLinkElement)
         )
       }
     
       function getLines(stack: string = '') {
         return stack
           .split('\n')
           .slice(1)
           .map((itme) => itme.replace(/^\s+at\s+/g, ''))
           .join('^')
       }
     }
     ```

  5. src\monitor\util\formatTime.ts

     ```tsx
     /**
      * 通过删除任何小数点来格式化时间值
      * @param time - 要格式化的时间值。可以是数字还是字符串.
      * @returns 时间的字符串表示形式，不带小数点.
      */
     export function formatTime(time: number | string): string {
       return String(time).split('.')[0]
     }
     
     export default formatTime
     ```

  6. src\monitor\util\getLastEvent.ts

     ```tsx
     type EventType = 'click' | 'touchstart' | 'mousedown' | 'keydown' | 'mouseover'
     
     let lastEvent: Event | undefined
     
     const eventTypes: EventType[] = [
       'click',
       'touchstart',
       'mousedown',
       'keydown',
       'mouseover'
     ]
     
     const handleEvent = (event: Event): void => {
       lastEvent = event
     }
     
     const addEventListeners = (eventTypes: EventType[]): void => {
       eventTypes.forEach((eventType) => {
         document.addEventListener(eventType, handleEvent, {
           capture: true, // 捕获阶段
           passive: true // 默认不阻止默认事件
         })
       })
     }
     
     addEventListeners(eventTypes)
     
     export default function getLastEvent(): Event | undefined {
       return lastEvent
     }
     ```

  7. src\monitor\util\getSelector.ts

     ```tsx
     export default function getSelector(
       pathsOrTarget: HTMLElement | HTMLElement[]
     ): string {
       if (Array.isArray(pathsOrTarget)) {
         // 可能是数组
         return getSelectors(pathsOrTarget)
       } else {
         // 也有可能是对象
         const path: HTMLElement[] = []
         let current: HTMLElement | null = pathsOrTarget
         while (current) {
           path.push(current)
           current = current.parentNode as HTMLElement
         }
         return getSelectors(path)
       }
     }
     
     function getSelectors(path: HTMLElement[]): string {
       return path
         .reverse()
         .filter((element) => {
           return !(element instanceof Document) && !(element instanceof Window)
         })
         .map((element) => {
           let selector = ''
           if (element.id) {
             return `${element.tagName.toLowerCase()}#${element.id}`
           } else if (element.className) {
             return `${element.tagName.toLowerCase()}.${element.className}`
           } else {
             selector = element.tagName.toLowerCase()
           }
           return selector
         })
         .join(' ')
     }
     
     export function getEventPath(event: Event): HTMLElement[] {
       const path = []
       let currentElement: HTMLElement | null = event.target as HTMLElement
     
       while (currentElement) {
         path.push(currentElement)
         currentElement = currentElement.parentElement
       }
       return path
     }
     ```

  8. src\monitor\util\tracker.ts

     ```tsx
     import userAgent from 'user-agent'
     
     // 注意下面改成自己的信息(https://sls.console.aliyun.com/lognext/profile)
     const host = 'cn-guangzhou.log.aliyuncs.com'
     const project = 'pf-front-monitor'
     const logStore = 'pf-front-monitor-store'
     
     interface ExtraData {
       title: string
       url: string
       timestamp: number
       userAgent: string // 用户ID
       [key: string]: string | number
     }
     
     function getExtraData(): ExtraData {
       return {
         title: document.title,
         url: location.href,
         timestamp: Date.now(),
         userAgent: userAgent.parse(navigator.userAgent).name
       }
     }
     
     // gif图片上传 图片速度 快 没有跨域问题
     class SendTracker {
       private url: string
       private xhr: XMLHttpRequest
     
       constructor() {
         this.url = `http://${project}.${host}/logstores/${logStore}/track`
         this.xhr = new XMLHttpRequest()
       }
     
       send(data: Record<string, any> = {}): void {
         const extraData = getExtraData()
         const log = { ...extraData, ...data }
     
         // 对象的值不能是数字
         for (const key in log) {
           if (typeof log[key] === 'number') {
             log[key] = `${log[key]}`
           }
         }
     
         console.log('log', log)
         const body = JSON.stringify({
           __logs__: [log]
         })
     
         this.xhr.open('POST', this.url, true)
         this.xhr.setRequestHeader('Content-Type', 'application/json')
         this.xhr.setRequestHeader('x-log-apiversion', '0.6.0')
         this.xhr.setRequestHeader('x-log-bodyrawsize', body.length.toString())
     
         this.xhr.send(body)
       }
     }
     
     export default new SendTracker()
     ```

#### 4.3 接口异常采集脚本

##### 4.3.1 数据设计

```js
{
  "title": "前端监控系统", //标题
  "url": "http://localhost:8080/", //url
  "timestamp": "1590817024490", //timestamp
  "userAgent": "Chrome", //浏览器版本
  "kind": "stability", //大类
  "type": "xhr", //小类
  "eventType": "load", //事件类型
  "pathname": "/success", //路径
  "status": "200-OK", //状态码
  "duration": "7", //持续时间
  "response": "{\"id\":1}", //响应内容
  "params": ""  //参数
}
```

##### 4.3.2 实现

1. src\index.html

   ```js
   <input
   	id="successBtn"
   	type="button"
   	value="ajax成功请求"
   	onclick="sendSuccess()"
   />
   <input
   	id="errorBtn"
   	type="button"
   	value="ajax失败请求"
   	onclick="sendError()"
   />
   
   function sendSuccess() {
     const xhr = new XMLHttpRequest()
     xhr.open('GET', '/success', true)
     xhr.responseType = 'json'
     xhr.onload = function () {
       console.log(xhr.response)
     }
     xhr.send()
   }
   function sendError() {
     const xhr = new XMLHttpRequest()
     xhr.open('POST', '/error', true)
     xhr.responseType = 'json'
     xhr.onload = function () {
       console.log(xhr.response)
     }
     xhr.onerror = function () {
       console.log('error')
     }
     xhr.send('name=pf')
   }
   ```

2. vite.config.ts

   ```tsx
   // 创建一个自定义插件来模拟 webpack 的 before 功能
   const mockServerPlugin = (): Plugin => ({
     name: 'mock-server',
     configureServer(server: ViteDevServer) {
       server.middlewares.use((req, res, next) => {
         if (req.url === '/success' && req.method === 'GET') {
           res.setHeader('Content-Type', 'application/json')
           res.end(JSON.stringify({ id: 1 }))
           return
         }
         if (req.url === '/error' && req.method === 'POST') {
           res.statusCode = 500
           res.end()
           return
         }
         next()
       })
     }
   })
   ```

3. src\monitor\lib\xhr.ts

   ```tsx
   import tracker from '../utils/tracker'
   
   interface LogData {
     method: string
     url: string
     async: boolean
   }
   
   export function injectXHR(): void {
     const XMLHttpRequest = window.XMLHttpRequest
     const originalOpen = XMLHttpRequest.prototype.open
     const originalSend = XMLHttpRequest.prototype.send
   
     XMLHttpRequest.prototype.open = function (
       method: string,
       url: string | URL,
       async: boolean = true
     ): void {
       if (!/logstores|sockjs/.test(url.toString())) {
         ;(this as any).logData = { method, url: url.toString(), async } as LogData
       }
       return originalOpen.apply(this, arguments as any)
     }
   
     XMLHttpRequest.prototype.send = function (
       ...args: [body?: Document | XMLHttpRequestBodyInit | null]
     ): void {
       const logData = (this as any).logData as LogData | undefined
       if (logData) {
         const startTime = Date.now() // 发送之前记录一下开始时间
   
         const handleEvent = (eventType: string) => (): void => {
           const duration = Date.now() - startTime
           const status = this.status // status 2xx 304 成功 其它 就是失败
           const statusText = this.statusText
           const response = this.response ? JSON.stringify(this.response) : ''
   
           tracker.send({
             kind: 'stability',
             type: 'xhr',
             eventType, // load,error,abort
             pathname: logData.url, // 请求路径
             status: `${status}-${statusText}`, // 状态码
             duration, // 持续时间
             response, // 响应体
             params: args[0] || ''
           })
         }
   
         this.addEventListener('load', handleEvent('load'), false)
         this.addEventListener('error', handleEvent('error'), false)
         this.addEventListener('abort', handleEvent('abort'), false)
       }
   
       return originalSend.apply(this, args)
     }
   }
   ```

#### 4.4 白屏：页面什么内容都没有

##### 4.4.1 数据设计

```js
{
  "title": "前端监控系统",
  "url": "http://localhost:8080/",
  "timestamp": "1590822618759",
  "userAgent": "chrome",
  "kind": "stability",      //大类
  "type": "blank",          //小类
  "emptyPoints": "0",       //空白点
  "screen": "2049x1152",    //分辨率
  "viewPoint": "2048x994",  //视口
  "selector": "HTML BODY #container" //选择器
}
```

##### 4.4.2 实现

1. src\monitor\util\onload.ts

   ```tsx
   export default function onload(callback: () => void) {
     if (document.readyState === 'complete') {
       callback()
     } else {
       window.addEventListener('load', callback)
     }
   }
   ```

2. src\monitor\lib\blankScreen.ts

   ```tsx
   import tracker from '../utils/tracker'
   import onload from '../utils/onload'
   
   type ElementSelector = string
   const wrapperElements: ElementSelector[] = [
     'html',
     'body',
     '#container',
     '.content'
   ]
   let emptyPoints = 0
   
   /**
    * 根据元素生成选择器
    */
   function getElementSelector(element: Element): ElementSelector {
     if (element.id) {
       return `#${element.id}`
     } else if (element.className) {
       return `.${element.className.split(' ').filter(Boolean).join('.')}`
     } else {
       return element.nodeName.toLowerCase()
     }
   }
   
   /**
    * 判断元素是否为 wrapper 元素
    */
   function isWrapperElement(element: Element): void {
     const selector = getElementSelector(element)
     if (wrapperElements.includes(selector)) {
       emptyPoints++
     }
   }
   
   /**
    * 获取页面的空白区域检测点
    */
   function checkScreenPoints(): void {
     const width = window.innerWidth
     const height = window.innerHeight
   
     for (let i = 1; i <= 9; i++) {
       const xElements = document.elementsFromPoint((width * i) / 10, height / 2)
       const yElements = document.elementsFromPoint(width / 2, (height * i) / 10)
       isWrapperElement(xElements[0])
       isWrapperElement(yElements[0])
     }
   }
   
   /**
    * 发送白屏检测数据
    * screen.width  屏幕的宽度   screen.height 屏幕的高度
    * window.innerWidth 去除工具条与滚动条的窗口宽度 window.innerHeight 去除工具条与滚动条的窗口高度
    */
   function reportBlankScreen(): void {
     if (emptyPoints >= 18) {
       const centerElement = document.elementsFromPoint(
         window.innerWidth / 2,
         window.innerHeight / 2
       )[0]
       tracker.send({
         kind: 'stability',
         type: 'blank',
         emptyPoints, // 空白点
         screen: `${window.screen.width}X${window.screen.height}`, // 分辨率
         viewPoint: `${window.innerWidth}X${window.innerHeight}`, // 视口
         selector: getElementSelector(centerElement) // 选择器
       })
     }
   }
   
   /**
    * 初始化白屏检测
    * 垂直水平线设置18个点, 如果点都是document或body就是白屏
    */
   export function blankScreen(): void {
     onload(() => {
       checkScreenPoints()
       reportBlankScreen()
     })
   }
   ```

   #### 4.5 加载时间

   ##### 4.5.1 阶段含义

   | 字段                       | 含义                                                         |
   | :------------------------- | :----------------------------------------------------------- |
   | navigationStart            | 初始化页面，在同一个浏览器上下文中前一个页面unload的时间戳，如果没有前一个页面的unload,则与fetchStart值相等 |
   | redirectStart              | 第一个HTTP重定向发生的时间,有跳转且是同域的重定向,否则为0    |
   | redirectEnd                | 最后一个重定向完成时的时间,否则为0                           |
   | fetchStart                 | 浏览器准备好使用http请求获取文档的时间,这发生在检查缓存之前  |
   | domainLookupStart          | DNS域名开始查询的时间,如果有本地的缓存或keep-alive则时间为0  |
   | domainLookupEnd            | DNS域名结束查询的时间                                        |
   | connectStart               | TCP开始建立连接的时间,如果是持久连接,则与`fetchStart`值相等  |
   | secureConnectionStart      | https 连接开始的时间,如果不是安全连接则为0                   |
   | connectEnd                 | TCP完成握手的时间，如果是持久连接则与`fetchStart`值相等      |
   | requestStart               | HTTP请求读取真实文档开始的时间,包括从本地缓存读取            |
   | requestEnd                 | HTTP请求读取真实文档结束的时间,包括从本地缓存读取            |
   | responseStart              | 返回浏览器从服务器收到（或从本地缓存读取）第一个字节时的Unix毫秒时间戳 |
   | responseEnd                | 返回浏览器从服务器收到（或从本地缓存读取，或从本地资源读取）最后一个字节时的Unix毫秒时间戳 |
   | unloadEventStart           | 前一个页面的unload的时间戳 如果没有则为0                     |
   | unloadEventEnd             | 与`unloadEventStart`相对应，返回的是`unload`函数执行完成的时间戳 |
   | domLoading                 | 返回当前网页DOM结构开始解析时的时间戳,此时`document.readyState`变成loading,并将抛出`readyStateChange`事件 |
   | domInteractive             | 返回当前网页DOM结构结束解析、开始加载内嵌资源时时间戳,`document.readyState` 变成`interactive`，并将抛出`readyStateChange`事件(注意只是DOM树解析完成,这时候并没有开始加载网页内的资源) |
   | domContentLoadedEventStart | 网页domContentLoaded事件发生的时间                           |
   | domContentLoadedEventEnd   | 网页domContentLoaded事件脚本执行完毕的时间,domReady的时间    |
   | domComplete                | DOM树解析完成,且资源也准备就绪的时间,`document.readyState`变成`complete`.并将抛出`readystatechange`事件 |
   | loadEventStart             | load 事件发送给文档，也即load回调函数开始执行的时间          |
   | loadEventEnd               | load回调函数执行完成的时间                                   |

   ##### 4.5.2 阶段计算

   | 字段             | 描述                                 | 计算方式                                              | 意义                                                         |
   | :--------------- | :----------------------------------- | :---------------------------------------------------- | :----------------------------------------------------------- |
   | unload           | 前一个页面卸载耗时                   | unloadEventEnd – unloadEventStart                     | -                                                            |
   | redirect         | 重定向耗时                           | redirectEnd – redirectStart                           | 重定向的时间                                                 |
   | appCache         | 缓存耗时                             | domainLookupStart – fetchStart                        | 读取缓存的时间                                               |
   | dns              | DNS 解析耗时                         | domainLookupEnd – domainLookupStart                   | 可观察域名解析服务是否正常                                   |
   | tcp              | TCP 连接耗时                         | connectEnd – connectStart                             | 建立连接的耗时                                               |
   | ssl              | SSL 安全连接耗时                     | connectEnd – secureConnectionStart                    | 反映数据安全连接建立耗时                                     |
   | ttfb             | Time to First Byte(TTFB)网络请求耗时 | responseStart – requestStart                          | TTFB是发出页面请求到接收到应答数据第一个字节所花费的毫秒数   |
   | response         | 响应数据传输耗时                     | responseEnd – responseStart                           | 观察网络是否正常                                             |
   | dom              | DOM解析耗时                          | domInteractive – responseEnd                          | 观察DOM结构是否合理，是否有JS阻塞页面解析                    |
   | dcl              | DOMContentLoaded 事件耗时            | domContentLoadedEventEnd – domContentLoadedEventStart | 当 HTML 文档被完全加载和解析完成之后，DOMContentLoaded 事件被触发，无需等待样式表、图像和子框架的完成加载 |
   | resources        | 资源加载耗时                         | domComplete – domContentLoadedEventEnd                | 可观察文档流是否过大                                         |
   | domReady         | DOM阶段渲染耗时                      | domContentLoadedEventEnd – fetchStart                 | DOM树和页面资源加载完成时间，会触发`domContentLoaded`事件    |
   | 首次渲染耗时     | 首次渲染耗时                         | responseEnd-fetchStart                                | 加载文档到看到第一帧非空图像的时间，也叫白屏时间             |
   | 首次可交互时间   | 首次可交互时间                       | domInteractive-fetchStart                             | DOM树解析完成时间，此时document.readyState为interactive      |
   | 首包时间耗时     | 首包时间                             | responseStart-domainLookupStart                       | DNS解析到响应返回给浏览器第一个字节的时间                    |
   | 页面完全加载时间 | 页面完全加载时间                     | loadEventStart - fetchStart                           | -                                                            |
   | onLoad           | onLoad事件耗时                       | loadEventEnd – loadEventStart                         | -                                                            |

   ![加载时间](https://p.ipic.vip/czuy64.jpg)

   ![加载时间2](https://p.ipic.vip/r9h3rq.png)

   ##### 4.5.3 数据结构

   ```js
   {
     "title": "前端监控系统",
     "url": "http://localhost:8080/",
     "timestamp": "1590828364183",
     "userAgent": "chrome",
     "kind": "experience",
     "type": "timing",
     "connectTime": "0",
     "ttfbTime": "1",
     "responseTime": "1",
     "parseDOMTime": "80",
     "domContentLoadedTime": "0",
     "timeToInteractive": "88",
     "loadTime": "89"
   }
   ```

   ##### 4.5.4 实现

   1. src\monitor\lib\timing.ts

      ```tsx
      import tracker from '../utils/tracker'
      import onload from '../utils/onload'
      import getLastEvent from '../utils/getLastEvent'
      import getSelector, { getEventPath } from '../utils/getSelector'
      import formatTime from '../utils/formatTime'
      
      interface PaintMetrics {
        firstPaint: string | undefined
        firstContentfulPaint: string | undefined
        firstMeaningfulPaint: string | undefined
        largestContentfulPaint: string | undefined
      }
      
      interface TimingMetrics {
        connectTime: number
        ttfbTime: number
        responseTime: number
        parseDOMTime: number
        domContentLoadedTime: number
        timeToInteractive: number
        loadTime: number
      }
      
      interface InputDelayMetrics {
        inputDelay: string
        duration: string
        startTime: string
        selector: string
      }
      
      export function timing() {
        let FMP: PerformanceEntry | undefined
        let LCP: PerformanceEntry | undefined
      
        // 观察页面中有意义的元素
        function observePerformanceEntries(
          entryType: string,
          callback: (entry: PerformanceEntry) => void
        ) {
          if (!PerformanceObserver) return
          new PerformanceObserver((entryList, observer) => {
            const entries = entryList.getEntries()
            callback(entries[0])
            observer.disconnect() // 不再观察了
          }).observe({ entryTypes: [entryType] })
        }
      
        // 监听 FMP 和 LCP
        observePerformanceEntries('element', (entry) => {
          FMP = entry
        })
        observePerformanceEntries('largest-contentful-paint', (entry) => {
          LCP = entry
        })
      
        // 监听 FID
        observePerformanceEntries('first-input', (entry) => {
          const firstInput = entry as PerformanceEventTiming // 类型断言为 PerformanceEventTiming
          console.log('FID', firstInput)
          const lastEvent = getLastEvent()
          // processingStart 开始处理时间 startTime 开始点击时间 差值就是处理的延迟
          const inputDelay = firstInput.processingStart - firstInput.startTime
          // 处理耗时
          const duration = firstInput.duration
      
          if (inputDelay > 0 || duration > 0) {
            const inputDelayMetrics: InputDelayMetrics = {
              inputDelay: formatTime(inputDelay), // 延时事件
              duration: formatTime(duration), // 处理事件
              startTime: formatTime(firstInput.startTime),
              selector: lastEvent
                ? getSelector(getEventPath(lastEvent) || lastEvent.target)
                : ''
            }
            tracker.send({
              kind: 'experience', // 用户体验指标
              type: 'firstInputDelay', // 首次输入延迟
              ...inputDelayMetrics
            })
          }
        })
      
        // 页面加载后，获取并发送相关的时间和绘制性能指标
        onload(() => {
          setTimeout(() => {
            const [navigationEntry] = performance.getEntriesByType(
              'navigation'
            ) as PerformanceNavigationTiming[]
            if (!navigationEntry) return
      
            const timingMetrics: TimingMetrics = {
              connectTime: navigationEntry.connectEnd - navigationEntry.connectStart, // 连接时间
              ttfbTime: navigationEntry.responseStart - navigationEntry.requestStart, // 首字节时间
              responseTime:
                navigationEntry.responseEnd - navigationEntry.responseStart, // 响应读取时间
              parseDOMTime:
                navigationEntry.loadEventStart - navigationEntry.domInteractive, // DOM 解析时间
              domContentLoadedTime:
                navigationEntry.domContentLoadedEventEnd - navigationEntry.fetchStart, // DOMContentLoaded 时间
              timeToInteractive:
                navigationEntry.domInteractive - navigationEntry.fetchStart, // 首次可交互时间
              loadTime: navigationEntry.loadEventStart - navigationEntry.fetchStart // 完整页面加载时间
            }
      
            // 发送时间性能指标
            sendMetrics('timing', timingMetrics)
      
            // 获取绘制性能条目
            const FP = performance.getEntriesByName('first-paint')[0] as
              | PerformanceEntry
              | undefined
            const FCP = performance.getEntriesByName('first-contentful-paint')[0] as
              | PerformanceEntry
              | undefined
      
            console.log('FP', FP)
            console.log('FCP', FCP)
            console.log('FMP', FMP)
            console.log('LCP', LCP)
      
            const paintMetrics: PaintMetrics = {
              firstPaint: formatTime(FP?.startTime || 0),
              firstContentfulPaint: formatTime(FCP?.startTime || 0),
              firstMeaningfulPaint: formatTime(FMP?.startTime || 0),
              largestContentfulPaint: formatTime(LCP?.startTime || 0)
            }
      
            // 发送绘制性能指标
            sendMetrics('paint', paintMetrics)
          }, 3000)
        })
      }
      
      function sendMetrics(type: string, metrics: object) {
        tracker.send({
          kind: 'experience', // 用户体验指标
          type, // 统计每个阶段的时间
          ...metrics
        })
      }
      ```

   #### 4.6 性能指标

   | 字段 | 描述                                     | 备注                                                         | 计算方式 |
   | :--- | :--------------------------------------- | :----------------------------------------------------------- | :------- |
   | FP   | First Paint(首次绘制)                    | 包括了任何用户自定义的背景绘制，它是首先将像素绘制到屏幕的时刻 |          |
   | FCP  | First Content Paint(首次内容绘制)        | 是浏览器将第一个 DOM 渲染到屏幕的时间,可能是文本、图像、SVG等,这其实就是白屏时间 |          |
   | FMP  | First Meaningful Paint(首次有意义绘制)   | 页面有意义的内容渲染的时间                                   |          |
   | LCP  | (Largest Contentful Paint)(最大内容渲染) | 代表在viewport中最大的页面元素加载的时间                     |          |
   | DCL  | (DomContentLoaded)(DOM加载完成)          | 当 HTML 文档被完全加载和解析完成之后,`DOMContentLoaded` 事件被触发，无需等待样式表、图像和子框架的完成加载 |          |
   | L    | (onLoad)                                 | 当依赖的资源全部加载完毕之后才会触发                         |          |
   | TTI  | (Time to Interactive) 可交互时间         | 用于标记应用已进行视觉渲染并能可靠响应用户输入的时间点       |          |
   | FID  | First Input Delay(首次输入延迟)          | 用户首次和页面交互(单击链接，点击按钮等)到页面响应交互的时间 |          |

   ![性能指标](https://p.ipic.vip/xz700q.png)

   ![性能指标2](https://p.ipic.vip/pmgmjp.jpg)

   ##### 4.6.1 数据结构设计

   1. paint

      ```js
      {
        "title": "前端监控系统",
        "url": "http://localhost:8080/",
        "timestamp": "1590828364186",
        "userAgent": "chrome",
        "kind": "experience",
        "type": "paint",
        "firstPaint": "102",
        "firstContentPaint": "2130",
        "firstMeaningfulPaint": "2130",
        "largestContentfulPaint": "2130"
      }
      ```

   2. firstInputDelay

      ```js
      {
        "title": "前端监控系统",
        "url": "http://localhost:8080/",
        "timestamp": "1590828477284",
        "userAgent": "chrome",
        "kind": "experience",
        "type": "firstInputDelay",
        "inputDelay": "3",
        "duration": "8",
        "startTime": "4812.344999983907",
        "selector": "HTML BODY #container .content H1"
      }
      ```

   ##### 4.6.2 实现

   1. src\monitor\lib\timing.ts

   #### 4.7 卡顿

   > 响应用户交互的响应时间如果大于100ms,用户就会感觉卡顿

   ##### 4.7.1 数据设计

   ```js
   {
     "title": "前端监控系统",
     "url": "http://localhost:8080/",
     "timestamp": "1590828656781",
     "userAgent": "chrome",
     "kind": "experience",
     "type": "longTask",
     "eventType": "mouseover",
     "startTime": "9331",
     "duration": "200",
     "selector": "HTML BODY #container .content"
   }
   ```

   ##### 4.7.2 实现

   1. src\monitor\lib\longTask.ts

      ```tsx
      import formatTime from '../utils/formatTime'
      import getLastEvent from '../utils/getLastEvent'
      import getSelector, { getEventPath } from '../utils/getSelector'
      import tracker from '../utils/tracker'
      
      interface LongTaskDetails {
        kind: 'experience'
        type: 'longTask'
        eventType: string
        startTime: string
        duration: string
        selector: string
      }
      
      const LONG_TASK_THRESHOLD = 100 // ms
      
      export function longTask(): void {
        const observer = new PerformanceObserver(handleLongTasks)
        observer.observe({ entryTypes: ['longtask'] })
      }
      
      function handleLongTasks(list: PerformanceObserverEntryList): void {
        list
          .getEntries()
          .filter((entry) => entry.duration > LONG_TASK_THRESHOLD)
          .forEach(reportLongTask)
      }
      
      function reportLongTask(entry: PerformanceEntry): void {
        const lastEvent = getLastEvent()
        const taskDetails = createLongTaskDetails(entry, lastEvent)
      
        requestIdleCallback(() => tracker.send(taskDetails))
      }
      
      function createLongTaskDetails(
        entry: PerformanceEntry,
        lastEvent: Event | undefined
      ): LongTaskDetails {
        return {
          kind: 'experience',
          type: 'longTask',
          eventType: lastEvent?.type || '',
          startTime: formatTime(entry.startTime),
          duration: formatTime(entry.duration),
          selector: lastEvent
            ? getSelector(getEventPath(lastEvent) || lastEvent.target)
            : ''
        }
      }
      ```

   #### 4.8 pv

   - RTT(Round Trip Time)一个连接的往返时间，即数据发送时刻到接收到确认的时刻的差值

     ![rtt](https://p.ipic.vip/glnj7b.jpg)

   ##### 4.8.1 数据结构

   ```js
   {
     "title": "前端监控系统",
     "url": "http://localhost:8080/",
     "timestamp": "1590829304423",
     "userAgent": "chrome",
     "kind": "business",
     "type": "pv",
     "effectiveType": "4g",
     "rtt": "50",
     "screen": "2049x1152"
   }
   ```

   ##### 4.8.2 实现

   1. src\monitor\lib\pv.ts

      ```tsx
      import tracker from '../utils/tracker'
      
      interface PVData {
        kind: 'business'
        type: 'pv'
        effectiveType: string
        rtt: number
        screen: string
      }
      
      interface StayTimeData {
        kind: 'business'
        type: 'stayTime'
        stayTime: number
      }
      
      interface NetworkConnection {
        effectiveType?: string
        rtt?: number
      }
      
      /**
       * 跟踪页面浏览量和停留时间
       */
      export function trackPageView(): void {
        sendPageViewData()
        trackStayTime()
      }
      
      function sendPageViewData(): void {
        const connection = getNetworkConnection()
        const pvData: PVData = {
          kind: 'business',
          type: 'pv',
          effectiveType: connection.effectiveType || 'unknown', // 网络环境
          rtt: connection.rtt || 0, // 往返时间
          screen: getScreenResolution() // 屏幕分辨率
        }
        tracker.send(pvData)
      }
      
      function trackStayTime(): void {
        const startTime = Date.now()
        window.addEventListener(
          'unload',
          () => {
            const stayTime = Date.now() - startTime
            const stayTimeData: StayTimeData = {
              kind: 'business',
              type: 'stayTime',
              stayTime
            }
            tracker.send(stayTimeData)
          },
          { once: true }
        )
      }
      
      function getNetworkConnection(): NetworkConnection {
        const nav = navigator as any
        return nav.connection || nav.mozConnection || nav.webkitConnection || {}
      }
      
      function getScreenResolution(): string {
        return `${window.screen.width}x${window.screen.height}`
      }
      ```

## 五、总结

- 前端监控类型
  - 页面访问行为： PV、UV、PV 点击率、UV 点击率、用户在每个页面停留时间、用户通过什么入口访问。
  - 用户操作行为：模块曝光、模块点击、滚动、表单操作。
  - 页面性能：首屏渲染时间、白屏时间、API 请求时间。
  - 异常监控：JS Error、API 异常、业务异常
  - 业务监控，成交金额、每日消息数
- 应用场景
  - 平台：百度（流量统计和分析免费） 阿里云 ARMS、友盟
- 为什么自建：数据保留自己服务器、扩展更多分析维度和能力
- 用户行为数据：用户页面操作、页面跳转、网络请求、自定义事件、控制台输出
- 错误数据： 后端接口错误、前端 JS 错误、APP Native 错误
- 架构设计
  - 前端监控 JSSDK：采集、上报（页面 PV、性能、页面操作行为）
  - 监控 API 和大数据仓库 - 接收上报数据
  - 数据仓库：MaxCompute 数据存储 数据查询
  - 监控数据可视化
  - 日志大数据清洗
  - 大数据回流 RDS（非结构化数据 => 结构化数据）
  - 对结构化进行运算生成图表

![image-20240830092515453](https://p.ipic.vip/or4cjc.png)

- 流量指标

  1. 页面访问行为
     - PV：页面浏览量，count(type = pv)
     - UV：用户浏览量，count(type = pv, distinct visitor_id)
       - 未登录用户，客户端生成visitor_id（uuid持久化存储）
       - 已登录用户，获取用户user_id，写入visitor_id
     - PV点击率：页面点击率，count(type = click) / PV
       - 可以大于100%
     - UV点击率： 用户点击率，count(type = click, distinct visitor_id) / UV
       - 不可以大于100%
     - 停留时间：用户从打开页面到关闭页面的总时长，leave page time (beforeunonload) - open time(onload)

  2. 可视化

     - 折线图

     - 表格

- 参考：[源码](https://github.com/RicardoPang/pf-monitor)

- 链家开源（工业级）：[源码](https://github.com/RicardoPang/pf-front-monitor)
