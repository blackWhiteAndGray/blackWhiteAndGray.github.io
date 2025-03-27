---
title: 从零开始实现一个简化版 Webpack 打包器
description: 手写
---

> Webpack 是现代前端开发中不可或缺的打包工具，它能够将多个模块及其依赖关系打包成一个或多个输出文件，从而优化浏览器加载性能。然而，对于很多开发者来说，Webpack 的内部机制可能显得神秘和复杂。本文将通过构建一个简化版的 Webpack，深入探讨其核心原理和实现细节，帮助你更好地理解 Webpack 的工作方式。

## 一、读取文件内容与解析依赖关系

Webpack 的打包过程从读取入口文件开始，并通过递归解析其依赖关系，逐步构建出整个项目的依赖图。我们可以将这一过程拆解为以下几个步骤：

1. **读取文件内容**：通过 Node.js 的 `fs` 模块读取文件内容。
2. **抽象语法树（AST）解析**：通过 Babel 的 `parser` 模块将文件内容解析为 AST，进而分析出模块的依赖关系。
3. **处理依赖**：遍历 AST，提取出所有的 `import` 语句，并将其路径记录下来。

以下是实现这些步骤的代码示例：

```javascript
const fs = require('fs')
const path = require('path')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const { transformFromAst } = require('@babel/core')

let id = 0

function createAsset(filePath) {
  // 1. 读取文件内容
  let source = fs.readFileSync(filePath, { encoding: 'utf-8' })

  // 2. 解析依赖关系
  const ast = parser.parse(source, { sourceType: 'module' })
  const deps = []
  traverse(ast, {
    ImportDeclaration({ node }) {
      deps.push(node.source.value)
    }
  })

  // 3. 转换代码为兼容格式
  const { code } = transformFromAst(ast, null, {
    presets: ['@babel/preset-env']
  })

  return {
    id: id++,
    filePath,
    code,
    deps,
    mapping: {}
  }
}
```

## 二、构建依赖图

在解析完入口文件及其依赖后，我们需要通过递归处理所有依赖模块，构建出整个项目的依赖图。依赖图的每个节点代表一个模块，每个模块包含其 ID、路径、代码内容、依赖模块的路径等信息。

```javascript
function createGraph(entry) {
  const mainAsset = createAsset(entry)
  const queue = [mainAsset]

  for (const asset of queue) {
    asset.deps.forEach((relativePath) => {
      const child = createAsset(
        path.resolve(path.dirname(asset.filePath), relativePath)
      )
      asset.mapping[relativePath] = child.id
      queue.push(child)
    })
  }

  return queue
}
```

在这个函数中，`queue` 队列用于存储所有待处理的模块。通过遍历队列中的每个模块，我们递归解析其依赖模块，并将其加入队列，最终生成完整的依赖图。

## 三、生成打包文件

有了依赖图后，我们就可以根据它生成最终的打包文件。打包文件的核心是一个自执行函数，它能够在浏览器中运行，加载并执行所有模块的代码。

```javascript
function build(graph) {
  let modules = ''

  graph.forEach((mod) => {
    modules += `
      ${mod.id}: [
        function (require, module, exports) {
          ${mod.code}
        },
        ${JSON.stringify(mod.mapping)},
      ],
    `
  })

  const result = `
    (function(modules) {
      function require(id) {
        const [fn, mapping] = modules[id];
        function localRequire(name) {
          return require(mapping[name]);
        }
        const module = { exports : {} };
        fn(localRequire, module, module.exports);
        return module.exports;
      }
      require(0);
    })({${modules}})
  `

  fs.writeFileSync('./dist/bundle.js', result)
}
```

在这个构建过程中，我们将每个模块的代码及其依赖关系包装成一个函数，并将这些函数存储在一个对象中。随后，通过自执行函数启动模块加载，逐个解析模块并执行它们的代码。

## 四、扩展：编写自定义Loader

Webpack 提供了 Loader 机制，允许开发者在打包过程中对模块内容进行自定义处理。例如，处理 JSON 文件时，我们可以编写一个简单的 JSON Loader，将 JSON 文件转换为 ES6 模块导出。

```javascript
function jsonLoader(source) {
  return `export default ${JSON.stringify(source)}`
}
```

在简化版 Webpack 中，我们可以根据配置应用这些 Loader 来处理不同类型的文件：

```javascript
const webpackConfig = {
  module: {
    rules: [
      {
        test: /\.json$/,
        use: [jsonLoader]
      }
    ]
  }
}

function applyLoaders(source, filePath) {
  const loaders = webpackConfig.module.rules
  loaders.forEach(({ test, use }) => {
    if (test.test(filePath)) {
      use.forEach((loader) => {
        source = loader(source)
      })
    }
  })
  return source
}
```

## 五、扩展：编写自定义Plugin

插件机制是 Webpack 的另一个重要特性。它允许开发者在打包过程的各个阶段插入自定义逻辑。通过编写 Plugin，我们可以实现更多高级功能，如修改输出文件路径、生成额外的文件等。

```javascript
class ChangeOutputPath {
  apply(hooks) {
    hooks.emitFile.tap('ChangeOutputPath', (context) => {
      console.log('Changing output path...')
      context.changeOutputPath('./dist/new_bundle.js')
    })
  }
}

const hooks = {
  emitFile: new SyncHook(['context'])
}

function initPlugins() {
  const plugins = [new ChangeOutputPath()]
  plugins.forEach((plugin) => plugin.apply(hooks))
}

initPlugins()
```

在这个例子中，`ChangeOutputPath` 插件通过监听 `emitFile` 钩子，修改了最终输出文件的路径。

## 六、总结

本文通过构建一个简化版的 Webpack，深入探讨了其核心原理及实现细节。我们了解了如何从入口文件开始，递归解析模块的依赖关系，生成依赖图，最终构建出打包文件。此外，我们还扩展实现了 Loader 和 Plugin 的机制，展示了如何通过它们自定义打包过程。

通过这种方式，我们不仅掌握了 Webpack 的工作原理，还能够在实际项目中灵活运用这些机制，打造高效、灵活的构建工具链。希望这篇文章能够帮助你更好地理解 Webpack 的内部机制，并激发你在前端工程化方面的更多探索和实践。

[源码](https://github.com/RicardoPang/pf-mini-webpack)
