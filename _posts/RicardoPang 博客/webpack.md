---
title: 深入理解Webpack
description: 手写Webpack Loader 和 Plugin
---

## 1. 什么是Webpack

Webpack可以看作是一个模块打包工具，它会分析你的项目结构，找到JavaScript模块以及其他一些浏览器不能直接运行的扩展语言（如Scss、TypeScript等），并将其打包为适合浏览器使用的格式。

![image-20240815230040881](https://p.ipic.vip/op2a1i.png)

构建就是将源代码转换为用于线上发布的可执行JavaScript、CSS、HTML代码，包括：

- 代码转换：将TypeScript编译为JavaScript，将SCSS编译为CSS等。
- 文件优化：压缩JavaScript、CSS、HTML代码，并合并以减少请求数，压缩并合并图片等。
- 代码分割：提取多个页面的公共代码，并提取首屏不需要立即执行的部分代码，使其异步加载。
- 模块合并：在模块化项目中，通常有许多模块和文件，构建工具需要将这些模块分类并合并为一个文件。
- 自动刷新：监听本地源代码的变化，自动重新构建并刷新浏览器。
- 代码校验：在代码提交到仓库之前，校验代码是否符合规范，以及单元测试是否通过。
- 自动发布：更新完代码后，自动构建出用于线上发布的代码并传输给发布系统。

> 构建其实是前端开发中工程化和自动化思想的体现，它将一系列流程用代码串联起来，使这些复杂的流程能够自动化执行。构建为前端开发注入了更大的活力，解放了我们的生产力。

## 2. 项目搭建

#### 2.1 初始化项目

```shell
mkdir pf-webpack
cd pf-webpack
npm init -y
```

#### 2.2 webpack核心概念

- Entry：入口，webpack执行构建的第一步从Entry开始，可抽象为输入。
- Module：模块，在webpack里一切皆模块，一个模块对应一个文件。webpack会从配置的Entry开始，递归找出所有依赖的模块。
- Chunk：代码块，一个Chunk由多个模块组合而成，用于代码合并和分割。
- Loader：模块转换器，用于将模块的原内容按需求转换为新内容。
- Plugin：扩展插件，在webpack构建流程中的特定时刻注入扩展逻辑，改变构建结果或实现特定功能。
- Output：输出结果，webpack在处理并生成最终代码后，输出结果文件。
- context：项目打包的路径上下文，如果指定了context，那么entry和output都是相对于上下文路径的，context必须是一个绝对路径。

> webpack启动后会从`Entry`里的配置`Module`开始递归解析`Entry`依赖的所有`Module`。每找到一个`Module`，就会根据配置的`Loader`去找出对应的转换规则，对`Module`进行转换后，再解析出当前`Module`依赖的`Module`。这些模块会以`Entry`为单位进行分组，一个`Entry`和其他所有依赖的`Module`备份到一个组也就是`Chunk`。最后webpack会把所有`Chunk`转换成文件输出。在整个流程中webpack会在恰当的时机执行`Plugin`里的定义逻辑

#### 2.3 配置webpack

```shell
// 安装npm包
npm install webpack webpack-cli -D

// 创建src目录
mkdir src

// 创建dist目录
mkdir dist

// 创建 /dist/index.html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
<div id="root"></div>
<script src="bundle.js"></script>
</body>
</html>

// 基本配置文件 webpack.config.js
const path = require('path');
module.exports = {
  context:process.cwd(),
    entry: './src/index.js', // 配置入口文件
    output: { // 配置出库文件
        path: path.resolve(__dirname,'dist'),
        filename:'bundle.js'
    },
    module: {}, // 配置模块，主要用于配置不同文件的加载器
    plugins: [], // 配置插件
    devServer: {} // 配置开发服务器
}

// mode 用于提供模式配置，告诉webpack相应地使用其内置的优化（development、production、none）

// 生产(production)
// 性能相关配置
performance:{hints:"error"....}
// 某些chunk的子chunk已一种方式被确定和标记,这些子chunks在加载更大的块时不必加载
optimization.flagIncludedChunks:true
// 给经常使用的ids更短的值
optimization.occurrenceOrder:true
// 确定每个模块下被使用的导出
optimization.usedExports:true
// 识别package.json or rules sideEffects 标志
optimization.sideEffects:true
// 尝试查找模块图中可以安全连接到单个模块中的段。- -
optimization.concatenateModules:true
// 使用uglify-js压缩代码
optimization.minimize:true
```

#### 2.4 配置开发服务器

```shell
// 安装npm包
npm i webpack-dev-server –D

// contentBase 配置开发服务运行时的文件根目录
// host：开发服务器监听的主机地址
// compress 开发服务器是否启动gzip等压缩
// port：开发服务器监听的端口
+ devServer:{
+        contentBase:path.resolve(__dirname,'dist'),
+        host:'localhost',
+        compress:true,
+        port:8080
+ }

+  "scripts": {
+    "build": "webpack",
+    "dev": "webpack-dev-server --open "
+  }
```

#### 2.5 支持加载css

`Loader` 允许 webpack 处理不同类型的文件并将它们转换为 JavaScript 可识别的模块，例如 CSS、ES6/7、JSX 等等。

- test：匹配处理文件的扩展名的正则
- use：loader名称
- include/exclude：手动指定必须处理的文件夹或屏蔽不需要处理的文件夹
- options：为loader提供额外设置选项

```json
// loader 用法

// loader
module: {
        rules: [
            {
                test: /\.css/,
+                loader:['style-loader','css-loader']
            }
        ]
    }

// use
module: {
        rules: [
            {
                test: /\.css/,
+                use:['style-loader','css-loader']
            }
        ]
    },

// use+loader
module: {
  rules: [
    {
      test: /\.css/,
      include: path.resolve(__dirname,'src'),
      exclude: /node_modules/,
      use: [{
        loader: 'style-loader',
        options: {
          insert:'top'
        }
      },'css-loader']
    }
  ]
}
```

#### 2.6 插件

- `plugin` 用于处理除模块代码转换外的其他构建任务。
- 模块代码转换工作由`loader`来处理
- 除此之外的其他工作通常由 `plugin` 完成

```html
// 自动产出html

// 安装npm包
cnpm i html-webpack-plugin -D

// 使用
+    +entry:{
+        index:'./src/index.js',  // chunk名字 index
+        common:'./src/common.js' //chunk名字 common
+    },

    plugins: [
+       new HtmlWebpackPlugin({
+            template:'./src/index.html',//指定模板文件
+            filename:'index.html',//产出后的文件名
+            inject:false,
+            hash:true,//为了避免缓存，可以在产出的资源后面添加hash值
+            chunks:['common','index'],
+            chunksSortMode:'manual'//对引入代码块进行排序的模式
+        }),
    )]

<head>
+ <% for (var css in htmlWebpackPlugin.files.css) { %>
+        <link href="<%= htmlWebpackPlugin.files.css[css] %>" rel="stylesheet">
+ <% } %>
</head>
<body>
+ <% for (var chunk in htmlWebpackPlugin.files.chunks) { %>
+ <script src="<%= htmlWebpackPlugin.files.chunks[chunk].entry %>"></script>
+ <% } %>
</body>
```

#### 2.7 支持图片

```html
// 安装npm包 file-loader 
// 解决CSS等文件中的引入图片路径问题 
// url-loader 在图片大小小于 limit 时会将图片转换为 BASE64 编码，而在图片大小超过 limit 时，则会使用 file-loader 进行拷贝。
npm i file-loader url-loader -D

// js引入图片
let logo=require('./images/logo.png');
let img=new Image();
img.src=logo;
document.body.appendChild(img);

// webpack.config.js
{
  test:/\.(jpg|png|bmp|gif|svg)/,
    use:[
    {
       loader:'url-loader',
       options:{limit:4096}
    }
  ]
}

// css引入图片
.logo{
    width:355px;
    height:133px;
    background-image: url(./images/logo.png);
    background-size: cover;
}

// html
<div class="logo"></div>
```

#### 2.8 分离css

> 因为 CSS 和 JS 可以并行下载，当 HTML 文件很大时，我们可以将 CSS 单独提取出来加载。
>
> [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin)
>
> filename 打包入口文件
>
> chunkFilename 用来打包`import('module')`方法中引入的模块

```shell
// 安装依赖模块
npm install --save-dev mini-css-extract-plugin

// 配置webpack.config.js
plugins: [
       //参数类似于webpackOptions.output
+        new MiniCssExtractPlugin({
+            filename: '[name].css',
+            chunkFilename:'[id].css'
+        }),

{
                test: /\.css/,
                include: path.resolve(__dirname,'src'),
                exclude: /node_modules/,
                use: [{
+                    loader: MiniCssExtractPlugin.loader
                },'css-loader']
            }

// 内联css
// 注意此插件要放在HtmlWebpackPlugin的下面
// HtmlWebpackPlugin的inject设置为true
npm i html-inline-css-webpack-plugin -D

+const HtmlInlineCssWebpackPlugin= require('html-inline-css-webpack-plugin').default;

plugins:[
  new HtmlWebpackPlugin({}),
+  new HtmlInlineCssWebpackPlugin()
]

// 压缩js和css
// 用terser-webpack-plugin替换掉uglifyjs-webpack-plugin解决uglifyjs不支持es6语法问题
npm i uglifyjs-webpack-plugin terser-webpack-plugin optimize-css-assets-webpack-plugin -D

const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
module.exports = {
    mode: 'production',
    optimization: {
        minimizer: [
           /*  new UglifyJsPlugin({
                cache: true,//启动缓存
                parallel: true,//启动并行压缩
                //如果为true的话，可以获得sourcemap
                sourceMap: true // set to true if you want JS source maps
            }), */
            new TerserPlugin({
                 parallel: true,
                 cache: true
            }),
            //压缩css资源的
            new OptimizeCSSAssetsPlugin({
                 assetNameRegExp:/\.css$/g,
                 //cssnano是PostCSS的CSS优化和分解插件。cssnano采用格式很好的CSS，并通过许多优化，以确保最终的生产环境尽可能小。
                 cssProcessor:require('cssnano')
            })
        ]
    },

// css和image存放单独目录
// 去掉HtmlInlineCssWebpackPlugin
// outputPath 输出路径
// publicPath指定的是构建后在html里的路径
// 如果在CSS文件中引入图片，而图片放在了image目录下，就需要配置图片的publicPath为/images,或者
{
   loader:MiniCssExtractPlugin.loader,
      options:{
+        publicPath:'/'
      }  
      
{
  test:/\.(jpg|jpeg|png|bmp|gif|svg|ttf|woff|woff2|eot)/,
  use:[
        {
          loader:'url-loader',
          options:{
              limit: 4096,
+              outputPath: 'images',
+              publicPath:'/images'
          }
        }
     ]
}      

output: {
        path: path.resolve(__dirname,'dist'),
        filename: 'bundle.js',
+        publicPath:'/'
    },
{
  test:/\.(jpg|jpeg|png|bmp|gif|svg|ttf|woff|woff2|eot)/,
  use:[
        {
          loader:'url-loader',
          options:{
              limit: 4096,
+              outputPath: 'images',
+              publicPath:'/images'
          }
        }
     ]
}

plugins: [
    new MiniCssExtractPlugin({
-       //filename: '[name].css',
-       //chunkFilename: '[id].css',
+       chunkFilename: 'css/[id].css',
+       filename: 'css/[name].[hash].[chunkhash].[contenthash].css',//name是代码码chunk的名字
    }),

// 文件指纹
// 打包后输出的文件名和后缀
// hash一般是结合CDN缓存来使用，通过webpack构建之后，生成对应文件名自动带上对应的MD5值。如果文件内容改变的话，那么对应文件哈希值也会改变，对应的HTML引用的URL地址也会改变，触发CDN服务器从源服务器上拉取对应数据，进而更新本地缓存。
// Hash 是整个项目的hash值，其根据每次编译内容计算得到，每次编译之后都会生成新的hash,即修改任何文件都会导致所有文件的hash发生改变。无法实现前端静态资源的浏览器长缓存
// chunkhash 根据不同的入口文件(Entry)进行依赖文件解析、构建对应的chunk，生成对应的哈希值 支持缓存
// contenthash 保证即使css文件所处的模块里就算其他文件内容改变，只要css文件内容不变，那么不会重复构建
```

#### 2.9 编译LESS和SASS

```css
// 安装less
npm i less less-loader -D
npm i node-sass sass-loader -D

// 编写样式文件
// less
@color:red;
.less-container{
    color:@color;
}

// scss
$color:green;
.sass-container{
    color:$color;
}

// webpack.config.js
{
  test: /\.less/,
    include: path.resolve(__dirname,'src'),
    exclude: /node_modules/,
    use: [{
      loader: MiniCssExtractPlugin.loader,
  },'css-loader','less-loader']
},
{
  test: /\.scss/,
    include: path.resolve(__dirname,'src'),
    exclude: /node_modules/,
    use: [{
      loader: MiniCssExtractPlugin.loader,
  },'css-loader','sass-loader']
},
```

#### 2.10 处理css3属性前缀

为了提高浏览器兼容性，我们需要为 CSS3 属性添加 `-webkit`、`-ms`、`-o`、`-moz` 等前缀。

```css
// 安装依赖
npm i postcss-loader autoprefixer -D

// postcss.config.js
module.exports={
    plugins:[require('autoprefixer')]
}

// webpack.config.js
{
   test:/\.css$/,
   use:[MiniCssExtractPlugin.loader,'css-loader','postcss-loader'],
   include:path.join(__dirname,'./src'),
   exclude:/node_modules/
}
```

#### 2.11 转义 ES6/ES7/JSX

Babel 是一个 JavaScript 编译平台，可以将 ES6/ES7 和 React 的 JSX 转换为 ES5

```js
// 安装依赖
npm i babel-loader @babel/core @babel/preset-env  @babel/preset-react  -D
npm i @babel/plugin-proposal-decorators @babel/plugin-proposal-class-properties -D

// webpack.config.js
{
    test: /\.jsx?$/,
    use: {
        loader: 'babel-loader',
        options:{
         "presets": ["@babel/preset-env"],
         "plugins": [
            ["@babel/plugin-proposal-decorators", { "legacy": true }],
            ["@babel/plugin-proposal-class-properties", { "loose" : true }]
         ]
        }
    },
    include: path.join(__dirname,'src'),
    exclude:/node_modules/
}

// .babelrc
{
  "presets": ["@babel/preset-env"],
  "plugins": [
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    ["@babel/plugin-proposal-class-properties", { "loose" : true }]
  ]
}

// ESLint校验代码格式规范（建议基于eslint:recommend配置进行改进，定制团队规范）
// 安装依赖
npm install eslint eslint-loader babel-eslint --D

// .eslintrc.js
module.exports = {
  root: true,
  //指定解析器选项
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2015
  },
  //指定脚本的运行环境
  env: {
    browser: true,
  },
  // 启用的规则及其各自的错误级别
  rules: {
    "indent": ["error", 4],//缩进风格
    "quotes": ["error", "double"],//引号类型 
    "semi": ["error", "always"],//关闭语句强制分号结尾
    "no-console": "error",//禁止使用console
    "arrow-parens": 0 //箭头函数用小括号括起来
  }
}

// webpack.config.js
module: {
  //配置加载规则
  rules: [
    {
      test: /\.js$/,
      loader: 'eslint-loader',
      enforce: "pre",
      include: [path.resolve(__dirname, 'src')], // 指定检查的目录
      options: { fix: true } // 这里的配置项参数将会被传递到 eslint 的 CLIEngine   
    },
    
// 引入字体
// 配置loader
    {
      test:/\.(woff|ttf|eot|svg|otf)$/,
      use:{
        //url内部内置了file-loader
        loader:'url-loader',
        options:{//如果要加载的图片大小小于10K的话，就把这张图片转成base64编码内嵌到html网页中去
          limit:10*1024
        }
      }
    },   
    
// 使用字体
@font-face {
    src: url('./fonts/HabanoST.otf') format('truetype');
    font-family: 'HabanoST';
}

.welcome {
    font-size:100px;
    font-family: 'HabanoST';
}    
```

#### 2.12 如何调试打包后的代码

- Source Map 是一种技术，旨在解决开发代码与实际运行代码不一致时，帮助我们调试并定位到原始开发代码。

| 类型                         | 含义                                                         |
| ---------------------------- | ------------------------------------------------------------ |
| source-map                   | 完整的 Source Map，质量最高，但构建速度较慢。                |
| eval-source-map              | 通过 eval 包裹的完整 Source Map，质量高，但性能最差。        |
| cheap-module-eval-source-map | 仅包含行信息的 Source Map，质量高，性能一般。                |
| cheap-eval-source-map        | 生成代码的行信息，每个模块通过 eval 执行，Source Map 作为 eval 的 data URL 存在。 |
| eval                         | 仅生成代码，每个模块通过 eval 执行，包含 @sourceURL，适合缓存 Source Map 的构建模式。 |
| cheap-source-map             | 生成代码的行信息，不包含列映射，且不使用 loader 生成的 Source Map。 |
| cheap-module-source-map      | 仅包含行信息的 Source Map，使用 loader 生成的映射信息。      |

这些配置项看起来复杂，但其实只是由 eval、source-map、cheap、module 和 inline 五个关键字的任意组合形成的。

| 关键字     | 含义                                                         |
| :--------- | :----------------------------------------------------------- |
| eval       | 使用eval包裹模块代码                                         |
| source-map | 产生.map文件                                                 |
| cheap      | 不包含列信息（关于列信息的解释下面会有详细介绍)也不包含loader的sourcemap |
| module     | 包含loader的sourcemap（比如jsx to js ，babel的sourcemap）,否则无法定义源文件 |
| inline     | 将.map作为DataURI嵌入，不单独生成.map文件                    |

#### 2.13 打包第三方库

```js
// 直接引入
import _ from 'lodash';
alert(_.join(['a','b','c'],'@'));

// 插件引入
+ new webpack.ProvidePlugin({
+     _:'lodash'
+ })

// expose-loader 不需要任何其他的插件配合，只要将下面的代码添加到所有的loader之前
require("expose-loader?libraryName!./file.js");

// externals 如果我们想引用一个库，但不希望 webpack 将其打包，同时又不影响在程序中以 CommonJS (CMD)、Asynchronous Module Definition (AMD) 或者 window/global 全局等方式使用。
+ externals: {
+         jquery: 'jQuery'//如果要在浏览器中运行，那么不用添加什么前缀，默认设置就是global
+ },
module: {
  
// 外链CDN html-webpack-externals-plugin
+ const htmlWebpackExternalsPlugin= require('html-webpack-externals-plugin');
  new htmlWebpackExternalsPlugin({
    externals:[
      {
        module:'react',
        entry:'https://cdn.bootcss.com/react/15.6.1/react.js',
        global:'React'
      },
      {
        module:'react-dom',
        entry:'https://cdn.bootcss.com/react/15.6.1/react-dom.js',
        global:'ReactDOM'
      }
    ]
  })   
```

#### 2.14 watch 代码修改自动重新编译

```js
module.exports = {
  //默认false,也就是不开启
  watch:true,
  //只有开启监听模式时，watchOptions才有意义
  watchOptions:{
    //默认为空，不监听的文件或者文件夹，支持正则匹配
    ignored:/node_modules/,
    //监听到变化发生后会等300ms再去执行，默认300ms
    aggregateTimeout:300,
    //判断文件是否发生变化是通过轮询文件系统来实现的，默认每秒轮询 1000 次。
    poll:1000
  }
}
```

#### 2.15 添加版权信息

```js
+ new webpack.BannerPlugin('版权信息'),
```

#### 2.16 拷贝静态文件

```js
npm i copy-webpack-plugin -D

new CopyWebpackPlugin([{
  from: path.resolve(__dirname,'src/assets'),// 静态资源目录源路径
  to:path.resolve(__dirname,'dist/assets') // 目标地址，相对于output的path目录
}])
```

#### 2.17 打包前清空输出目录

```js
npm i  clean-webpack-plugin -D

const {CleanWebpackPlugin} = require('clean-webpack-plugin');
plugins:[
  new CleanWebpackPlugin({cleanOnceBeforeBuildPatterns: ['**/*', '!static-files*'],})
]
```

#### 2.18 服务器代理

```js
// 修改路径
proxy: {
  "/api": {
    target: 'http://localhost:3000',
      pathRewrite:{"^/api":""}        
  }            
}
```

#### 2.19 resolve解析

```js
// extensions 导入时不用添加文件扩展名
resolve: {
  extensions: [".js",".jsx",".json",".css"]
},
  
// alias 配置别名加快模块查找速度
const bootstrap = path.resolve(__dirname,'node_modules/_bootstrap@3.3.7@bootstrap/dist/css/bootstrap.css');
resolve: {
+    alias:{
+        "bootstrap":bootstrap
+    }
},
  
// modules 直接声明依赖名的模块
  resolve: {
    modules: ['node_modules'],
  }  
  
// resolveLoader配置解析loader是默认配置
  module.exports = {
    resolveLoader: {
      modules: [ 'node_modules' ],
      extensions: [ '.js', '.json' ],
      mainFields: [ 'loader', 'main' ]
    }
  };  
```

#### 2.20 noParse

- 配置哪些模块文件的内容不需要进行解析

```js
module.exports = {
  // ...
  module: {
    noParse: /jquery|lodash/, // 正则表达式
    // 或者使用函数
    noParse(content) {
      return /jquery|lodash/.test(content)
    },
  }
}...
```

#### 2.21 DefinePlugin

- 配置全局常量

```js
new webpack.DefinePlugin({
  PRODUCTION: JSON.stringify(true),
  VERSION: "1",
  EXPRESSION: "1+2",
  COPYRIGHT: {
    AUTHOR: JSON.stringify("常量")
  }
})
```

#### 2.22 IgnorePlugin

- 忽略某些特定的模块，让webpack不把指定的模块打包进去

```js
import moment from  'moment';
console.log(moment);

new webpack.IgnorePlugin(/^\.\/locale/,/moment$/)
```

#### 2.23 区分环境变量

- 日常的前端开发工作中，一般都会有两套构建环境
- 一套开发时使用，构建结果用于本地开发调试，不进行代码压缩，打印 debug 信息，包含 sourcemap 文件
- 一套构建后的结果是直接应用于线上的，即代码都是压缩后，运行时不打印 debug 信息，静态文件不包括 sourcemap
- webpack 4.x 版本引入了 `mode` 的概念
- 当你指定使用 production mode 时，默认会启用各种性能优化的功能，包括构建结果优化以及 webpack 运行性能优化
- 如果是 development mode，则会开启 debug 工具，运行时打印详细的错误信息，并进行更快速的增量编译。

```js
// 获取mode参数
npm install --save-dev optimize-css-assets-webpack-plugin

  "scripts": {
+    "dev": "webpack-dev-server --env=development --open"
  },
    
const TerserWebpackPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
module.exports=(env,argv) => ({
    optimization: {
        minimizer: argv.mode == 'production'?[            
            new TerserWebpackPlugin({
               parallel:true,//开启多进程并行压缩
               cache:true//开启缓存
      }),
            new OptimizeCssAssetsWebpackPlugin({})
        ]:[]
    }
})    
```

```js
// 封装log方法 通过 process.env.NODE_ENV 这个变量获取mode
export default function log(...args) {
  if (process.env.NODE_ENV == 'development') {
    console.log.apply(console,args);
  }
}
```

```js
// 拆分配置
webpack.base.js：基础部分，即多个文件中共享的配置
webpack.development.js：开发环境使用的配置
webpack.production.js：生产环境使用的配置
webpack.test.js：测试环境使用的配置...

const { smart } = require('webpack-merge')
const webpack = require('webpack')
const base = require('./webpack.base.js')
module.exports = smart(base, {
  module: {
    rules: [],
  }
})
```

#### 2.24 对图片进行压缩和优化

```js
npm install image-webpack-loader --save-dev

{
          test: /\.(png|svg|jpg|gif|jpeg|ico)$/,
          use: [
            'file-loader',
+           {
+             loader: 'image-webpack-loader',
+             options: {
+               mozjpeg: {
+                 progressive: true,
+                 quality: 65
+               },
+               optipng: {
+                 enabled: false,
+               },
+               pngquant: {
+                 quality: '65-90',
+                 speed: 4
+               },
+               gifsicle: {
+                 interlaced: false,
+               },
+               webp: {
+                 quality: 75
+               }
+             }
+           },
          ]
        }
```

#### 2.25 多入口MPA 多页应用

```js
const path=require('path');
const HtmlWebpackPlugin=require('html-webpack-plugin');
const htmlWebpackPlugins=[];
const glob = require('glob');
const entry={};
const entryFiles = glob.sync('./src/**/index.js');
entryFiles.forEach((entryFile,index)=>{
  let entryName = path.dirname(entryFile).split('/').pop();
  entry[entryName]=entryFile;
  htmlWebpackPlugins.push(new HtmlWebpackPlugin({
    template:`./src/${entryName}/index.html`,
    filename:`${entryName}/index.html`,
    chunks:[entryName],
    inject:true,
    minify:{
      html5:true,
      collapseWhitespace:true,
      preserveLineBreaks:false,
      minifyCSS:true,
      minifyJS:true,
      removeComments:false
    }
  }));
}); 

module.exports={
  entry,
  plugins: [
    //other plugins
    ...htmlWebpackPlugins
  ]
}
```

#### 2.26 日志优化

| 预设        | 替代  | 描述                     |
| :---------- | :---- | :----------------------- |
| errors-only | none  | 只在错误时输出           |
| minimal     | none  | *发生错误或新编译时输出* |
| none        | false | 没有输出                 |
| normal      | true  | 标准输出                 |
| verbose     | none  | 全部输出                 |

```js
npm i friendly-errors-webpack-plugin

+ stats:'verbose',
  plugins:[
+   new FriendlyErrorsWebpackPlugin()
  ]
```

#### 2.27 日志输出

```js
  "scripts": {
    "build": "webpack",
+    "build:stats":"webpack --json > stats.json",
    "dev": "webpack-dev-server --open"
  },
    
const webpack = require('webpack');
const config = require('./webpack.config.js');
webpack(config,(err,stats)=>{
  if(err){
    console.log(err);
  }
  if(stats.hasErrors()){
    return console.error(stats.toString("errors-only"));
  }
  console.log(stats);
});    
```

#### 2.28 费时分析

```js
const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin');
const smw = new SpeedMeasureWebpackPlugin();
module.exports =smw.wrap({
});
```

#### 2.29  生成代码分析报告

```js
npm i webpack-bundle-analyzer -D

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
module.exports={
  plugins: [
    new BundleAnalyzerPlugin()  // 使用默认配置
    // 默认配置的具体配置项
    // new BundleAnalyzerPlugin({
    //   analyzerMode: 'server',
    //   analyzerHost: '127.0.0.1',
    //   analyzerPort: '8888',
    //   reportFilename: 'report.html',
    //   defaultSizes: 'parsed',
    //   openAnalyzer: true,
    //   generateStatsFile: false,
    //   statsFilename: 'stats.json',
    //   statsOptions: null,
    //   excludeAssets: null,
    //   logLevel: info
    // })
  ]
}

{
 "scripts": {
    "dev": "webpack --config webpack.dev.js --progress"
  }
}

// webpack.config.js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
module.exports={
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'disabled', // 不启动展示打包报告的http服务器
      generateStatsFile: true, // 是否生成stats.json文件
    }),
  ]
}

{
 "scripts": {
    "generateAnalyzFile": "webpack --profile --json > stats.json", // 生成分析文件
    "analyz": "webpack-bundle-analyzer --port 8888 ./dist/stats.json" // 启动展示打包报告的http服务器
  }
}

npm run generateAnalyzFile
npm run analyz
```

#### 2.30 px自动转成rem

```js
npm i px2rem-loader lib-flexible -D

// html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>主页</title>
    <script>
      let docEle = document.documentElement;
      function setRemUnit () {
        //750/10=75   375/10=37.5
        docEle.style.fontSize = docEle.clientWidth / 10 + 'px';
      }
      setRemUnit();
      window.addEventListener('resize', setRemUnit);
    </script>
</head>
<body>
    <div id="root"></div>
</body>

// css
*{
    padding: 0;
    margin: 0;
}
#root{
    width:375px;
    height:375px;
    border:1px solid red;
    box-sizing: border-box;
}

// webpack.config.js
 {
        test:/\.css$/,//如果要require或import的文件是css的文件的话
        //从右向左处理CSS文件,loader是一个函数
        use:[{
                loader:MiniCssExtractPlugin.loader,
                options:{
                     publicPath: (resourcePath, context) => {
                        return '/';
                    }
                    //publicPath: '/'
                }
        },{
                    loader:'css-loader',
                    options:{
                        //Enables/Disables or setups number of loaders applied before CSS loader.
                        importLoaders:0
                    }
                },{
                    loader:'postcss-loader',
                    options:{
                        plugins:[
                            require('autoprefixer')
                        ]
                    }
                },{
+                    loader:'px2rem-loader',
+                    options:{
+                        remUnit:75,
+                        remPrecesion:8
+                    }
+                }]
+            },
```

## 3. 优化

#### 3.1 PurgecssWebpackPlugin 去除未使用的css

```js
npm i -D purgecss-webpack-plugin mini-css-extract-plugin glob

// webpack.config.js
+ const glob = require('glob');
+ const PurgecssPlugin = require('purgecss-webpack-plugin');

module.exports = {
  mode: 'development',
  plugins: [
+    new PurgecssPlugin({
+      paths: glob.sync(`${path.join(__dirname, 'src')}/**/*` // 指定需要检查的文件路径
+    }),
  ],
}

plugins: [
+        new MiniCssExtractPlugin({
+            filename: '[name].css',
+            chunkFilename:'[id].css'
+        }),

{
                test: /\.css/,
                include: path.resolve(__dirname,'src'),
                exclude: /node_modules/,
                use: [{
+                    loader: MiniCssExtractPlugin.loader
                },'css-loader']
            }
```

#### 3.2 DllPlugin 打包动态链接库

```js
const path=require('path');
const DllPlugin=require('webpack/lib/DllPlugin');
module.exports={
  entry: {
    react:['react','react-dom']
  },// 把 React 相关模块的放到一个单独的动态链接库
  output: {
    path: path.resolve(__dirname,'dist'),// 输出的文件都放到 dist 目录下
    filename: '[name].dll.js',//输出的动态链接库的文件名称，[name] 代表当前动态链接库的名称
    library: '_dll_[name]',//存放动态链接库的全局变量名称,例如对应 react 来说就是 _dll_react
  },
  plugins: [
    new DllPlugin({
      // 动态链接库的全局变量名称，需要和 output.library 中保持一致
      // 该字段的值也就是输出的 manifest.json 文件 中 name 字段的值
      // 例如 react.manifest.json 中就有 "name": "_dll_react"
      name: '_dll_[name]',
      // 描述动态链接库的 manifest.json 文件输出时的文件名称
      path: path.join(__dirname, 'dist', '[name].manifest.json')
    })
  ]
}

webpack --config webpack.dll.config.js --mode development

// 使用动态链接库文件
const DllReferencePlugin = require('webpack/lib/DllReferencePlugin')
plugins: [
  new DllReferencePlugin({
    manifest:require('./dist/react.manifest.json')
  })
]

webpack --config webpack.config.js --mode development

// html使用
<script src="react.dll.js"></script>
<script src="bundle.js"></script>
```

#### 3.3 thread-loader 多进程管理

- 把这个 loader 放置在其他 loader 之前， 放置在这个 loader 之后的 loader 就会在一个单独的 worker 池(worker pool)中运行

```js
{
  test: /\.(js)$/,
    use: [
      {
        loader:'thread-loader',
        options:{
          workers:3
        }
      }, 
      {
        loader:'babel-loader'
      }
    ],
}
```

#### 3.4 CDN 内容分发网络

- 通过把资源部署到世界各地，用户在访问时按照就近原则从离用户最近的服务器获取资源，从而加速资源的获取速度。

- 将 HTML 文件放在自己的服务器上，不缓存 HTML 文件
- 静态的JavaScript、CSS、图片等文件开启CDN和缓存，并且文件名带上HASH值
- 为了并行加载不阻塞，把不同的静态资源分配到不同的CDN服务器上
- 同一时刻针对同一个域名的资源并行请求是有限制，可以通过在 HTML HEAD 标签中 加入`<link rel="dns-prefetch" href="http://img.xxx.cn">`去预解析域名，以降低域名解析带来的延迟

```js
// 接入CDN
output: {
        path: path.resolve(__dirname, 'dist'),
+        filename: '[name]_[hash:8].js',
+        publicPath: 'http://img.xxx.cn'
    },
```

#### 3.5 Tree Shaking

- “Tree shaking 只将使用到的方法打包到 bundle 中，未使用的方法将在 uglify 阶段被移除。原理是利用es6模块的特点,只能作为模块顶层语句出现,import的模块名只能是字符串常量
  - ES6 模块的关键特性
    - **静态结构**：ES6 模块的导入导出是在编译时就确定的，具有静态结构。即模块的依赖关系在代码运行之前已经可以确定。相比之下，CommonJS 模块（如 `require`）则是动态加载的，这使得静态分析变得更加困难。
    - **按需导入**：ES6 模块允许开发者只导入他们需要的部分，而不是导入整个模块。例如，`import { specificFunction } from './module'` 只导入 `module` 中的 `specificFunction`，不需要的部分则不会被打包工具考虑。
    - **导出方式明确**：ES6 模块明确规定了哪些内容被导出，这意味着打包工具可以轻松地识别哪些导出是未被使用的，从而安全地删除这些未使用的导出。
  - Tree Shaking 的实现
    - **依赖分析**：打包工具首先对代码进行依赖分析，构建模块的依赖图。由于 ES6 模块的静态结构，工具可以轻松地识别每个模块中的导入和导出。
    - **标记未使用的代码**：在构建依赖图时，打包工具会检查每个导出是否在其他地方被引用。如果某个导出未被引用，则它和它所依赖的代码都会被标记为“未使用”。
    - **移除未使用的代码**：在最终打包阶段，打包工具会移除所有标记为“未使用”的代码，这就是 Tree Shaking 的过程。这样，生成的最终包会更小，加载速度更快。
- webpack默认支持，在.babelrc里设置`module:false`即可在`production mode`下默认开启

```js
    "presets":[
+        ["@babel/preset-env",{"modules":false}],//转译 ES6 ES7
        "@babel/preset-react"//转译JSX语法
    ],
```

#### 3.6 代码分割

- 对于大的Web应用来讲，将所有的代码都放在一个文件中显然是不够有效的，特别是当你的某些代码块是在某些特殊的时候才会被用到。
- webpack有一个功能就是将你的代码库分割成chunks语块，当代码运行到需要它们的时候再进行加载。 适用的场景
- 抽离相同代码到一个共享块
- 脚本懒加载，使得初始下载的代码更小

```js
// Entry Point 不灵活 重复导入模块
entry: {
  index: "./src/index.js",
    login: "./src/login.js"
}

// 动态导入和懒加载：对于首次打开页面需要的功能直接加载，尽快展示给用户,某些依赖大量代码的功能点可以按需加载
document.querySelector('#clickBtn').addEventListener('click',() => {
    import('./hello').then(result => {
        console.log(result.default);
    });
});

// 提取公共代码：把公共代码抽离成单独文件进行加载能进行优化，可以减少网络传输流量，降低服务器成本
// 默认配置
optimization: {
  splitChunks: {
    chunks: "all",//默认作用于异步chunk，值为all/initial/async
      minSize: 30000,  //默认值是30kb,代码块的最小尺寸
        minChunks: 1,  //被多少模块共享,在分割之前模块的被引用次数
          maxAsyncRequests: 5,  //按需加载最大并行请求数量
            maxInitialRequests: 3,  //一个入口的最大并行请求数量
              name: true,  //打包后的名称，默认是chunk的名字通过分隔符（默认是～）分隔开，如vendor~
                automaticNameDelimiter: '~',//默认webpack将会使用入口名和代码块的名称生成命名,比如 'vendors~main.js'
                  cacheGroups: { //设置缓存组用来抽取满足不同规则的chunk,下面以生成common为例
                    vendors: {
                      chunks: "initial",
                        test: /node_modules/,//条件
                          priority: -10 ///优先级，一个chunk很可能满足多个缓存组，会被抽取到优先级高的缓存组中,为了能够让自定义缓存组有更高的优先级(默认0),默认缓存组的priority属性为负值.
                    },
                      commons: {
                        chunks: "initial",
                          minSize: 0,//最小提取字节数
                            minChunks: 2, //最少被几个chunk引用
                              priority: -20,
                                reuseExistingChunk: true//    如果该chunk中引用了已经被抽取的chunk，直接引用该chunk，不会重复打包代码
                      }
                  }
  },
}

// webpack.config.js
entry: {
  pageA: './src/pageA',
  pageB: './src/pageB',
  pageC: './src/pageC'
},
  output: {
    path: path.resolve(__dirname,'dist'),
      filename: '[name].js'
  },
    plugins:[
      new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: 'pageA.html',
        excludeChunks: ['pageB','pageC']
      }),
      new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: 'pageB.html',
        excludeChunks: ['pageA','pageC']
      }),
      new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: 'pageC.html',
        excludeChunks: ['pageA','pageB']
      })
    ]
```

#### 3.7 开启 Scope Hoisting

- Scope Hoisting 可以让 Webpack 打包出来的代码文件更小、运行的更快
- 初始情况下，Webpack 转换后的模块会被包裹在一个函数中
- 代码体积更小，因为函数申明语句会产生大量代码
- 代码在运行时因为创建的函数作用域更少了，内存开销也随之变小
- 大量作用域包裹代码会导致体积增大
- 运行时创建的函数作用域变多，内存开销增大
- scope hoisting的原理是将所有的模块按照引用顺序放在一个函数作用域里，然后适当地重命名一些变量以防止命名冲突
- 这个功能在mode为production下默认开启,开发环境要用 `webpack.optimize.ModuleConcatenationPlugin`插件
- 也要使用ES6 Module,CJS不支持

```js
// 开发环境插件配置
module.exports = {
  resolve: {
    // 针对 Npm 中的第三方模块优先采用 jsnext:main 中指向的 ES6 模块化语法的文件
    mainFields: ['jsnext:main', 'browser', 'main']
  },
  plugins: [
    // 开启 Scope Hoisting
    new webpack.optimize.ModuleConcatenationPlugin(),
  ],
};
```

#### 3.8 HMR提升开发效率

- 模块热替换
- Hot Reloading，当代码变更时通知浏览器刷新页面，以避免频繁手动刷新浏览器页面
- 局部替换模块代码，无需刷新整个页面
- 原理是当一个源码发生变化时，只重新编译发生变化的模块，再用新输出的模块替换掉浏览器中对应的老模块
- 模块热替换技术的优势有：
  - 实时预览反应更快，等待时间更短。
  - 不刷新浏览器能保留当前网页的运行状态，例如在使用 Redux 来管理数据的应用中搭配模块热替换能做到代码更新时Redux 中的数据还保持不变
- 原理：和自动刷新原理类似，都需要往要开发的网页中注入一个代理客户端用于连接 DevServer 和网页
  - 内部工作机制
    - **监听文件变化**：HMR 会监视源码文件的变化。当检测到文件发生改变时，Webpack 会重新编译这个文件，但只重新编译发生变化的模块，而不是重新编译整个项目。
    - **增量编译**：Webpack 在编译过程中只生成更新后的模块，这些模块被称为 `Hot Module`，并不会重新打包整个项目的文件。这些模块会与其他没有改变的模块进行结合，生成一个新的 bundle。
    - **通知 HMR 代理**：编译完成后，Webpack DevServer 会通知在浏览器端运行的 HMR 代理（通常是注入到页面中的 JavaScript 代码），告知哪些模块发生了变化。HMR 代理会根据这些信息来决定如何更新页面上的模块。
    - **模块替换与更新**：HMR 代理会获取更新后的模块，并替换掉页面中对应的旧模块。如果模块支持自定义更新逻辑（通过 `module.hot.accept` 等 API），则会调用相应的更新方法。否则，将触发页面的刷新。
    - **状态保留**：在应用 Redux 或其他状态管理库的场景中，HMR 可以在模块更新时保留当前应用的状态，不会因为模块更新而导致页面的刷新或状态丢失。这使得开发过程中，用户不必重新操作页面来恢复状态。

![webpackhmr](https://p.ipic.vip/r4k176.png)

```js
// 配置hot,默认不开启
const webpack = require('webpack');
module.exports = {
  entry:{
    main:'./src/index.js',
  },
  plugins: [
    // 该插件的作用就是实现模块热替换，实际上当启动时带上 `--hot` 参数，会注入该插件，生成 .hot-update.json 文件。
    new webpack.NamedModulesPlugin(), // 用于启动 HMR 时可以显示模块的相对路径
    new webpack.HotModuleReplacementPlugin(), // Hot Module Replacement 的插件
  ],
  devServer:{
    // 告诉 DevServer 要开启模块热替换模式
    hot: true,      
  }  
};
```

## 4. 补充

#### 4.1 loader实现思路

- 安装必要依赖
- 引入 Babel 核心模块
- 定义 Loader 函数，接收三个参数：`source`（源代码）、`inputSourceMap`（输入的 Source Map），以及 `data`（其他数据）
- 配置 Babel 转换选项
- 调用 Babel 转换代码
- 返回处理结果
- 在 Webpack 中配置 Loader
- 设置 Webpack 规则

```js
npm i @babel/preset-env @babel/core -D

const babel = require("@babel/core");
function loader(source, inputSourceMap, data) {
  const options = {
    presets: ["@babel/preset-env"],
    inputSourceMap: inputSourceMap,
    sourceMaps: true, //ourceMaps: true 是告诉 babel 要生成 sourcemap
    filename: this.request.split("!")[1].split("/").pop(),
  };
  //在webpack.config.js中 增加devtool: 'eval-source-map'
  let { code, map, ast } = babel.transform(source, options);
  return this.callback(null, code, map, ast);
}
module.exports = loader;
resolveLoader: {
  alias: {//可以配置别名
    "babel-loader": resolve('./build/babel-loader.js')
  },//也可以配置loaders加载目录
    modules: [path.resolve('./loaders'), 'node_modules']
},
  {
    test: /\.js$/,
      use:['babel-loader']
  }
```

例子二：将 XML 文件内容转换为 JSON 对象

```js
const loaderUtils = require('loader-utils'); // 引入 loader-utils 库，用于处理 Loader 的选项和其他实用功能
const xml2js = require('xml2js'); // 引入 xml2js 库，用于将 XML 解析为 JSON

// 创建一个 xml2js 的解析器实例
const parser = new xml2js.Parser();

// 导出一个 Webpack Loader 函数
module.exports = function(source) {
  // 启用缓存机制，提升构建性能
  this.cacheable && this.cacheable();

  // 使用 loader-utils 获取 Loader 的配置选项
  const options = loaderUtils.getOptions(this);

  // 保持对当前 Loader 实例的引用，以便在回调中使用
  const self = this;

  // 使用 xml2js 的解析器将 XML 字符串解析为 JSON 对象
  parser.parseString(source, function (err, result) {
    // 调用 Loader 的回调函数，传递错误和处理后的结果
    // 如果解析成功（err 为 null 或 undefined），将 JSON 结果转换为模块导出格式
    // 如果解析失败，传递错误信息
    self.callback(err, !err && "module.exports = " + JSON.stringify(result));
  });
};
```



#### 4.2 plugin实现思路

> 插件向第三方开发者提供了 `webpack` 引擎中完整的能力。使用阶段式的构建回调，开发者可以引入它们自己的行为到 `webpack` 构建流程中。
>
> `webpack` 插件由以下组成：
>
> - 一个 `JavaScript` 命名函数。
> - 在插件函数的 `prototype` 上定义一个`apply`方法。
> - 指定一个绑定到 `webpack` 自身的事件钩子。
> - 处理 `webpack` 内部实例的特定数据。
> - 功能完成后调用 `webpack` 提供的回调。

- 为什么需要一个插件

  - webpack 基础配置无法满足需求

  - 插件几乎能够任意更改 webpack 编译结果

  - webpack 内部也是通过大量内部插件实现的

- Compiler 和 Compilation

  - 在插件开发中最重要的两个资源就是 `compiler` 和 `compilation` 对象。理解它们的角色是扩展 `webpack` 引擎重要的第一步。
  - `compiler` 对象代表了完整的 `webpack` 环境配置。这个对象在启动 `webpack` 时被一次性建立，并配置好所有可操作的设置，包括 `options`，`loader` 和 `plugin`。当在 `webpack` 环境中应用一个插件时，插件将收到此 `compiler` 对象的引用。可以使用它来访问 `webpack` 的主环境。
  - `compilation` 对象代表了一次资源版本构建。当运行 `webpack` 开发环境中间件时，每当检测到一个文件变化，就会创建一个新的 `compilation`，从而生成一组新的编译资源。一个 `compilation` 对象表现了当前的模块资源、编译生成资源、变化的文件、以及被跟踪依赖的状态信息。`compilation` 对象也提供了很多关键时机的回调，以供插件做自定义处理时选择使用。

- 编写Plugin

  - 为 Webpack 构建的输出文件添加自定义的注释

  ```js
  const { ConcatSource } = require('webpack-sources'); // 引入 webpack-sources 中的 ConcatSource，用于连接多个源文件
  
  // 用于生成带注释的字符串
  const wrapComment = (str) => {
    // 如果字符串中没有换行符，生成单行注释
    if (!str.includes('\n')) return `/*! ${str} */`;
    
    // 如果字符串中有换行符，生成多行注释
    return `/*!\n * ${str.split('\n').join('\n * ')}\n */`;
  };
  
  class MyBannerPlugin {
    // 构造函数，接受一个选项对象或字符串
    constructor(options) {
      // 检查传入的参数数量是否大于1
      if (arguments.length > 1) throw new Error("MyBannerPlugin only takes one argument (pass an options object or string)");
  
      // 如果传入的 options 是字符串，将其转换为对象形式
      if (typeof options === 'string') {
        options = {
          banner: options,
          raw: false // 默认生成带注释的 banner
        };
      }
  
      // 保存选项到实例中
      this.options = options || {};
      // 根据 raw 选项决定是否使用注释形式
      this.banner = this.options.raw ? options.banner : wrapComment(options.banner);
    }
  
    // Webpack 插件的核心方法
    apply(compiler) {
      // 获取 banner 字符串
      const banner = this.banner;
  
      // 在控制台输出 banner 字符串，方便调试
      console.log('banner: ', banner);
  
      // 监听 Webpack 的 compilation 钩子
      compiler.hooks.compilation.tap("MyBannerPlugin", compilation => {
        // 监听 compilation 的 optimizeChunkAssets 钩子
        compilation.hooks.optimizeChunkAssets.tap("MyBannerPlugin", chunks => {
          // 遍历所有的 chunk
          for (const chunk of chunks) {
            // 遍历每个 chunk 的文件
            for (const file of chunk.files) {
              // 更新文件的内容，将 banner 插入到文件开头
              compilation.updateAsset(
                file,
                old => new ConcatSource(banner, '\n', old) // 使用 ConcatSource 将 banner 和原文件内容连接
              );
            }
          }
        });
      });
    }
  }
  
  // 导出插件
  module.exports = MyBannerPlugin;
  ```
