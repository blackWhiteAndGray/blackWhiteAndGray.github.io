---
title: Node Library依赖分析
description: 工具
---

> 在本次技术分享中，将主要探讨《Node Library 依赖关系分析工具》， 重点介绍使用Vite作为构建工具，TypeScript提供类型安全，结合Vue3和Pinia构建前端架构；通过集成D3.js实现复杂的数据可视化； 强化开发体验,，包括ESLint和Prettier的代码规范， 以及Commitlint的提交规范;；后端服务使用koa框架,，并通过命令行工具增强用户交互； 最后，分享从项目设计到实现阶段如何解决数据处理和性能优化的挑战.。期望通过这次交流,，与大家共同提升数据可视化开发的技能。

## 概述

本工具旨在为开发者提供一种高效的方式来分析和管理项目的依赖关系。通过递归 `node_modules` 目录和解析锁文件，构建出清晰的依赖关系图，并使用 D3.js 实现可视化展示。

## 效果

![image-20240813191127934](https://p.ipic.vip/4o6dxb.png)

<video controls width="100%">
  <source src="./library.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

## 核心技术选型

1. **前端技术栈**：
   - **Vue 3**：基于 Composition API 构建，提供响应式的数据绑定和组件化开发。
   - **D3.js**：用于依赖关系图的渲染，提供数据驱动的动态可视化能力。
   - **TypeScript**：为整个项目提供类型安全，增强代码可读性和可维护性。
2. **后端技术栈**：
   - **Koa**：轻量级的 Node.js 框架，负责 API 服务和依赖数据的处理。
   - **Commander + Inquirer**：用于命令行交互，实现灵活的参数配置和用户提示。
3. **构建工具**：
   - **Vite**：现代化构建工具，快速打包和开发服务器启动。
   - **ESLint + Prettier**：统一代码风格和格式，确保代码质量。

## 系统设计概述

1. **递归 `node_modules` 构建依赖关系**：

   - 通过 `DependencyGraphBuilder` 类递归扫描 `node_modules`，构建完整的依赖关系图。
   - 控制递归深度，避免堆栈溢出，并通过 `visited` 集合追踪已访问的节点，防止循环依赖。

   ```tsx
   import {
     IGraphProps,
     INodeArrayProps,
     IGetGrapDataOptions,
     IDepOptions,
     ICheckFileResult,
     IBuildGraphOptions
   } from './type'
   import { isArray, isObject } from './utils'
   import * as path from 'path'
   import * as fs from 'fs/promises'

   export class DependencyGraphBuilder {
     // 记录已访问过的依赖, 避免重复处理
     private visited: Set<string> = new Set()
     // 最大递归深度, 限制依赖搜索的深度
     private maxDepth: number = 0

     constructor(private pkgDir: string) {
       // 接收包目录路径
       this.pkgDir = pkgDir
     }

     /**
      * 获取依赖包及其依赖项的图形数据
      * @param options 包含查询条件, 包信息, 深度
      * @returns 图形数据, 包含依赖关系图和节点数组
      */
     public async getGraphData(options: IGetGrapDataOptions) {
       const { searchQuery, pkg, depth } = options

       if (isObject(pkg) && !isArray(pkg)) {
         const allDeps = this.getDependency(pkg) // 获取所有依赖项
         this.visited.clear() // 清空已访问依赖项
         this.maxDepth = depth ?? 2 // 设置最大递归深度, 默认为 2

         // 构建依赖关系图
         const graphData = await this.buildGraph({
           pkgDir: this.pkgDir,
           source: undefined, // 当前源依赖未定义
           dependencies: allDeps,
           depth: 0, // 初始化深度为 0
           typeCounter: 1,
           searchQuery
         })

         // 返回去重后的数据
         return this.removeDuplicates(graphData.graph, graphData.nodeArray)
       }

       // 传入的依赖包不是有效的对象
       throw new Error('依赖包无效')
     }

     // 获取依赖项, 包括生产依赖和开发依赖
     private getDependency(pkg: IDepOptions) {
       return {
         ...pkg.dependencies,
         ...pkg.devDependencies
       }
     }

     /**
      * 构建依赖关系图
      * @param pkgDir 依赖包路径
      * @param source 依赖包名称
      * @param dependencies 依赖包依赖
      * @param depth 递归深度
      * @param typeCounter 节点类型计数器, 用于分组
      * @param searchQuery 搜索查询条件
      * @returns 构建后的依赖关系图和节点数组
      */
     private async buildGraph({
       pkgDir,
       source,
       dependencies,
       depth = 0,
       typeCounter = 1,
       searchQuery
     }: IBuildGraphOptions): Promise<{
       graph: IGraphProps[]
       nodeArray: INodeArrayProps[]
     }> {
       // 清空已访问记录
       this.visited.clear()

       // 初始化依赖关系图和节点数组
       const graph: IGraphProps[] = []
       const nodeArray: INodeArrayProps[] = []

       // 如果以达到最大递归深度, 停止递归并返回当前结果
       if (depth > this.maxDepth) {
         return { graph, nodeArray }
       }

       // 遍历当前层依赖项
       for (const dep in dependencies) {
         // 格式化依赖项名称
         const curDep = dep + dependencies[dep].replace('^', '@')

         // 检查是否已处理过该依赖项, 如果是, 则跳过
         if (this.visited.has(curDep)) {
           continue
         }
         this.visited.add(curDep) // 标记为已处理

         // 如果搜索条件匹配当前依赖项就添加到节点数组
         if (searchQuery == dep) {
           nodeArray.push({ id: dep, group: typeCounter })
         }
         // 如果没有搜索条件或搜索条件与源依赖相同, 则处理当前依赖项
         if (searchQuery === undefined || searchQuery === source) {
           // 将依赖加入图
           if (source) {
             graph.push({
               source,
               target: dep,
               value: typeCounter
             })
           }
           nodeArray.push({ id: dep, group: typeCounter })
         }

         // 实际文件夹路径
         const depPkgPath = this.getDepPkgPath(pkgDir, dep)
         const { status, childPath } = await this.checkFile(depPkgPath)
         if (!status) {
           continue
         }
         const depPkg = await fs.readFile(depPkgPath, 'utf-8')
         if (!depPkg) {
           continue
         }

         // 获取子依赖dependencies
         const childDeps = this.getDependency(JSON.parse(depPkg))
         // 递归调用buildGraph(下一层)
         const childGraphResult = await this.buildGraph({
           pkgDir: childPath!,
           source: dep,
           dependencies: childDeps,
           depth: depth + 1,
           typeCounter: typeCounter,
           searchQuery: searchQuery === dep ? dep : searchQuery
         })

         // 合并下一层返回的graph和nodeArray到当前层 确保当前层的数据包含了下一层的结果
         nodeArray.push(...childGraphResult.nodeArray)
         graph.push(...childGraphResult.graph)

         typeCounter++
       }

       // 返回当前层的graph和nodeArray到上一层调用者
       return { graph, nodeArray }
     }

     /**
      * 检查指定路径的文件是否存在且它是一个文件
      * @param depPkgPath 要检查的路径
      * @returns 返回对象,包含状态和子路径
      */
     private async checkFile(depPkgPath: string): Promise<ICheckFileResult> {
       try {
         // stat描述文件或目录的信息, 如大小、修改时间等
         const stats = await fs.stat(depPkgPath)
         // 检查是否是文件
         if (stats.isFile()) {
           return { status: true, childPath: depPkgPath }
         } else {
           // 如果不是文件，返回错误
           console.error(`路径不是一个文件: ${depPkgPath}`)
           return { status: false }
         }
       } catch (err: any) {
         if (err.code === 'ENOENT') {
           console.error(`文件未找到: ${depPkgPath}`)
         } else {
           console.error(`检查文件出错: ${err.message}`)
         }
         return { status: false }
       }
     }

     // 去重
     private removeDuplicates(
       graph: IGraphProps[],
       nodeArray: INodeArrayProps[]
     ) {
       // 使用Map结构去重数组
       const uniqueGraph = Array.from(
         new Map(
           graph.map((item) => [item.source + item.target, item])
         ).values()
       )
       const uniqueNodeArray = Array.from(
         new Map(nodeArray.map((item) => [item.id, item])).values()
       )
       return { graph: uniqueGraph, nodeArray: uniqueNodeArray }
     }

     // 获取依赖文件夹路径
     private getDepFolderPath(baseDir: string, dep: string) {
       // 判断baseDir是否已经是node_modules路径, 如果是直接用
       // 否则解析相对路径获取node_modules目录
       const nodeModulesDir = baseDir.includes('node_modules')
         ? baseDir.substring(
             0,
             baseDir.indexOf('node_modules') + 'node_modules'.length
           )
         : path.join(path.dirname(require.resolve(baseDir)), 'node_modules')

       // 拼接获取以来的实际路径
       return path.join(nodeModulesDir, dep)
     }

     // 获取依赖包路径
     private getDepPkgPath(baseDir: string, dependency: string): string {
       // 获取依赖文件夹路径, 并拼接package.json获取完整依赖包json文件路径
       return path.join(
         this.getDepFolderPath(baseDir, dependency),
         'package.json'
       )
     }
   }
   ```

2. **锁文件解析**：

   - 使用抽象基类 `baseDepGraph`，根据不同包管理器的锁文件（如 `pnpm`、`npm`、`yarn`）解析依赖关系。
   - 生成的依赖数据以 `graph` 和 `nodeArray` 形式返回，用于后续的图形渲染。

   ```tsx
   // 解析pnpm lock file 其他同理
   import { readWantedLockfile } from '@pnpm/lockfile-file'
   import {
     IGraphData,
     IGraphProps,
     ILockFileOptions,
     INodeArrayProps,
     IPackageInfo
   } from '../type'
   import { baseDepGraph } from './base'

   // 解析包名和版本信息
   // @antfu/utils@0.7.8:{resolution: {…}}
   // @babel/code-frame@7.24.6:{resolution: {…}, engines: {…}}
   const parseFromSpecify = (specifier: string): IPackageInfo => {
     // 正则: 匹配pnpm文件的包描述
     const REGEXP = /^\/(@?[\w\d.-]+(\/[\w\d.-]+)?)\/([\d\w.-]+)(\/?.*)$/
     const match = specifier.match(REGEXP)
     if (match) {
       const [, name, , version] = match
       return {
         name, // 包名
         specifier, // 完整描述
         version // 版本
       }
     }
     return {
       name: '',
       specifier,
       version: ''
     }
   }

   export class PnpmLockGraph extends baseDepGraph {
     private lockPath: string // 锁文件路径

     constructor(options: ILockFileOptions) {
       super()
       const { lockPath } = options
       this.lockPath = lockPath
     }

     // 解析依赖图
     async parse(): Promise<IGraphData> {
       // 从锁文件读取数据
       // readWantedLockfile读取pnpm-lock.yaml文件 返回imporers(项目导入者 多个项目工作区)和packages(所有包的依赖关系和版本信息)
       const lockfileData = await readWantedLockfile(
         this.lockPath.slice(0, this.lockPath.lastIndexOf('/')),
         {
           ignoreIncompatible: true // 忽略不兼容的版本
         }
       )
       if (!lockfileData) {
         throw new Error('读取pnpm-lock.yaml文件失败')
       }

       const { importers, packages } = lockfileData

       // 初始化依赖关系
       const graph: IGraphProps[] = []
       // 存储所有出现过的节点
       const nodeSet = new Set<string>()

       // 处理导入依赖
       if (importers) {
         for (const [
           importerName,
           { dependencies = {}, devDependencies = {} }
         ] of Object.entries(importers)) {
           nodeSet.add(importerName) // 添加导入节点

           for (const [depName] of Object.entries({
             ...dependencies,
             ...devDependencies
           })) {
             graph.push({
               source: importerName, // 依赖源
               target: depName // 依赖目标
             })
             nodeSet.add(depName) // 添加依赖节点
           }
         }
       }

       // 处理包依赖
       if (packages) {
         for (const [specifier, packageInfo] of Object.entries(packages)) {
           const { name } = parseFromSpecify(specifier)
           if (!name) continue

           nodeSet.add(name) // 添加包节点

           for (const [depName] of Object.entries({
             ...packageInfo.dependencies, // 运行时依赖 必需
             ...packageInfo.peerDependencies, // 外部包 已被项目使用者安装
             ...packageInfo.optionalDependencies // 可选依赖 可选
           })) {
             graph.push({
               source: name, // 依赖源
               target: depName // 依赖目标
             })
             nodeSet.add(depName) // 添加依赖节点
           }
         }
       }

       // 转节点数组
       const nodeArray: INodeArrayProps[] = Array.from(nodeSet).map((id) => ({
         id
       }))

       return {
         graph,
         nodeArray
       }
     }
   }
   ```

3. **D3.js 渲染**：

   - 使用 `convertData` 函数将依赖关系数据转换为 D3.js 可用的 `links` 和 `nodes`。
   - 提供交互性：节点拖拽、缩放、关联信息显示等。

   ```tsx
   // 渲染图表
   const renderChart = (convertedData: { nodes: any[]; links: any[] }) => {
     if (!chart.value) {
       return
     }

     // 清空图表容器
     chart.value.innerHTML = ''

     // 模拟会改变链接和节点 创建一个副本
     const links = convertedData.links.map((d) => ({ ...d })) // 创建链接副本
     const nodes = convertedData.nodes.map((d) => ({ ...d })) // 创建节点副本

     // 定义图表的尺寸
     const width = 928
     const height = 600

     // 定义颜色比例尺
     const color = d3.scaleOrdinal(d3.schemeCategory10)

     // 定义缩放
     const zoom = d3
       .zoom()
       .scaleExtent([1, 10]) // 设置缩放范围，1 表示原始大小，10 表示最大放大为原始大小的10倍
       .on('zoom', (d3: any) => zoomed(d3))

     // 创建svg容器
     const svg = d3
       .create('svg')
       .attr('width', width)
       .attr('height', height)
       .attr('viewBox', [0, 0, width, height])
       .attr('style', 'max-width: 100%; height: auto;')
       .call(zoom as d3.ZoomBehavior<any, any>)

     // 创建连接线
     const link = svg
       .append('g')
       .selectAll('line')
       .data(links)
       .join('line')
       .attr('stroke-width', 1.5)
       .attr('stroke', '#999')
       .attr('stroke-opacity', 0.6)
       .attr('fill', 'none')
       .on('mouseover', handleLinkMouseOver) // 添加鼠标移入事件
       .on('mouseout', handleLinkMouseOut) // 添加鼠标移出事件

     // 创建节点
     const node = svg
       .append('g')
       .attr('fill', 'currentColor')
       .attr('stroke-linecap', 'round')
       .attr('stroke-linejoin', 'round')
       .selectAll('circle')
       .data(nodes)
       .join('circle')
       .attr('r', 6)
       .attr('fill', (d) => color(String(d.group)))
       .style('cursor', 'pointer')
       .style('position', 'relative')
       .call(drag() as any) // 添加拖动事件
       .on('mouseover', handleMouseOver) // 添加鼠标移入事件
       .on('mouseout', handleMouseOut) // 添加鼠标移出事件

     // 将SVG添加到容器
     chart.value.appendChild(svg.node()!)

     // 链接鼠标移入事件
     function handleLinkMouseOver(event: MouseEvent, d: any) {
       // 移除旧的tooltip
       d3.select('.custom-link-tooltip').remove()

       // 获取鼠标相对于文档的位置
       const mouseX = event.pageX
       const mouseY = event.pageY

       // 计算 tooltip 的位置相对于鼠标位置
       const tooltipOffsetX = 10 // 水平偏移量
       const tooltipOffsetY = 10 // 垂直偏移量

       // 显示tooltip
       d3.select('body')
         .append('div')
         .attr('class', 'custom-link-tooltip')
         .html(`来源：${d.source.id}<br/>去向：${d.target.id}`)
         .style('position', 'absolute')
         .style('left', `${mouseX + tooltipOffsetX}px`)
         .style('top', `${mouseY + tooltipOffsetY}px`)
         .style('opacity', 0.9)
         .style('visibility', 'visible')
         .style('z-index', 9999)
         .style('background-color', 'white')
         .style('color', '#333')
         .style('border-radius', '4px')
         .style('padding', '8px')
         .style('font-size', '14px')
         .style('box-shadow', '2px 2px 6px rgba(0, 0, 0, 0.1)')
     }

     // 链接鼠标移出事件
     function handleLinkMouseOut() {
       d3.select('.custom-link-tooltip').remove()
     }

     // 鼠标移入节点 自定义高亮
     function handleMouseOver(event: MouseEvent, d: any) {
       // 当前节点
       var hoveredNode = d
       console.log(hoveredNode)

       // 移除旧的tooltip
       d3.select('.custom-tooltip').remove()

       // 设置节点的透明度
       node.style('opacity', (d: any) => {
         if (d.id === hoveredNode.id) return 1
         const opacityValue = links.some((item) => {
           return item.source.id === hoveredNode.id && item.target.id === d.id
         })
           ? 1
           : 0.1
         return opacityValue
       })
       // 设置连接线的透明度
       link.style('opacity', (link: any) => (link.source === d ? 1 : 0.1))

       // 获取鼠标相对于文档的位置
       const mouseX = event.pageX
       const mouseY = event.pageY

       // 计算 tooltip 的位置相对于鼠标位置
       const tooltipOffsetX = 10 // 水平偏移量
       const tooltipOffsetY = 10 // 垂直偏移量

       // 显示tooltip
       d3.select('body')
         .append('div')
         .attr('class', 'custom-tooltip')
         .html(`${hoveredNode.id}`)
         .style('position', 'absolute')
         .style('left', `${mouseX + tooltipOffsetX}px`)
         .style('top', `${mouseY + tooltipOffsetY}px`)
         .style('opacity', 0.9)
         .style('visibility', 'visible')
         .style('z-index', 9999)
         .style('background-color', 'white')
         .style('color', '#333')
         .style('border-radius', '4px')
         .style('padding', '8px')
         .style('font-size', '14px')
         .style('box-shadow', '2px 2px 6px rgba(0, 0, 0, 0.1)')
     }

     // 移出节点时的处理函数
     function handleMouseOut() {
       // 设置节点的透明度
       node.style('opacity', 1)
       // 设置连接线的透明度
       link.style('opacity', 1)

       // 隐藏tooltip
       d3.select('.custom-tooltip').remove()
     }

     // 添加拖动
     function drag() {
       // 拖动开始
       function dragstarted(event: any) {
         if (!event.active) simulation.alphaTarget(0.3).restart()
         event.subject.fx = event.subject.x
         event.subject.fy = event.subject.y
       }
       // 拖动中
       function dragged(event: any) {
         event.subject.fx = event.x
         event.subject.fy = event.y
       }
       // 拖动结束
       function dragended(event: any) {
         if (!event.active) simulation.alphaTarget(0)
         event.subject.fx = null
         event.subject.fy = null
       }

       return d3
         .drag()
         .on('start', dragstarted)
         .on('drag', dragged)
         .on('end', dragended)
     }

     function zoomed(event: any) {
       // 获取缩放和平移的变换
       const transform = event.transform
       link.attr('transform', transform)
       node.attr('transform', transform)
     }

     // 设置链接和节点的位置
     function ticked() {
       link
         .attr('x1', (d: any) => d.source.x)
         .attr('y1', (d: any) => d.source.y)
         .attr('x2', (d: any) => d.target.x)
         .attr('y2', (d: any) => d.target.y)

       node.attr('cx', (d: any) => d.x).attr('cy', (d: any) => d.y)
     }

     if (simulation) {
       simulation.stop()
     }

     // 创建模型
     simulation = d3
       .forceSimulation(nodes as any)
       .force(
         'link',
         d3.forceLink(links).id((d: any) => d.id)
       )
       .force('charge', d3.forceManyBody())
       .force('center', d3.forceCenter(width / 2, height / 2))
       .on('tick', ticked)
   }
   ```

4. **命令行交互**：

   - 基于 `Commander` 和 `Inquirer` 实现动态命令配置和交互提示。
   - 处理无效命令输入，并提供帮助信息。

   ```tsx
   cmd.action(async (cmdObj) => {
     if (action === '*') {
       console.log('没有找到对应的命令')
     } else {
       const answers = await inquirer.prompt({
         type: 'confirm',
         name: 'isParseLockFile',
         message:
           '是否希望通过解析lock文件来生成依赖关系图？否则会递归读取node_modules（默认解析锁文件, depth参数无效）',
         default: true
       })
       const { depth, json } = cmdObj
       const { isParseLockFile } = answers
       startServer(depth, json, isParseLockFile)
     }
   })

   // 开启服务器
   export const startServer = async (
     depth: number,
     json: string,
     isParseLockFile: boolean
   ) => {
     // debugger
     // 解析锁文件(isParseLockFile 为 true)
     if (isParseLockFile) {
       // 定义不同锁文件类型对应的处理类
       const lockFileClasses = {
         'pnpm-lock.yaml': PnpmLockGraph,
         'yarn.lock': YarnLockGraph,
         'package-lock.json': NpmLockGraph
       }
       // 获取锁文件信息
       const lockFileInfo = await getProjectLockFile()
       if (lockFileInfo) {
         const { name, content, lockPath } = lockFileInfo
         // 根据锁文件名选择对应的处理类
         const LockGraphClass = lockFileClasses[name]
         // 处理锁文件
         await processLockFile(
           LockGraphClass,
           { name, content, lockPath },
           json,
           isParseLockFile
         )
       } else {
         console.error('没有找到 lock file')
         process.exit(1)
       }
     } else {
       // 读 node_modules 里面的 packages 的目录/文件，找出依赖关系
       if (json) {
         generateAndSaveGraph(depth, json)
       } else {
         startApiServer(depth, null, isParseLockFile)
       }
     }
   }
   ```

## 关键问题与解决方案

1. **循环依赖与重复依赖**：
   - 使用 `visited` 集合跟踪已访问节点，防止循环依赖。
   - 通过 `removeDuplicates` 方法去除图中重复的节点和边。
2. **递归深度与性能控制**：
   - 设置递归深度上限，默认值为 2，可通过参数自定义。
   - 优化递归逻辑，减少性能开销。
3. **多包管理器支持**：
   - 针对不同类型的锁文件，定义抽象解析方法，确保兼容 `pnpm`、`npm`、`yarn`。
4. **D3.js 可视化挑战**：
   - 实现了层级渲染、颜色映射、节点关联数据展示和拖拽功能。
   - 自定义缩放和鼠标事件处理，实现更好的用户交互体验。

## 结语

通过此工具的开发，我们不仅解决了项目依赖关系复杂性的问题，还通过高效的技术选型和系统设计，提升了整个项目的可视化和用户体验。希望此项目的经验能够为其他开发者提供有益的参考。

[源码地址](https://github.com/RicardoPang/pf-dep-graph)
