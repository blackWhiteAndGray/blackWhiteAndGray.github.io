---
title: 前端工程化
description: Eslint+Prettier+husky+commitlint+lint+staged规范前端工程代码规范
---

> 记录自己的前端工作流，总结一份自己的前端工作流搭建流程，方便以后使用，创建一个简单的模板。

## Vue3 项目框架搭建

#### 1. 使用`Vite`脚手架初始化项目

> [vite 官网](https://cn.vitejs.dev/guide/)

```bash
npm init vue@latest
```

![image-20240805140002333](https://p.ipic.vip/p0lyd4.png)

#### 2. 项目目录结构

![image-20240811103917787](https://p.ipic.vip/fqmffz.png)

#### 3. CSS 样式

- normalize.css
- reset.css

![image-20240811104918736](https://p.ipic.vip/90z1zk.png)

#### 4. 路由配置

![image-20240811105300818](https://p.ipic.vip/fbm4jc.png)

#### 5. 状态管理

- vuex: 目前依然使用较多的状态管理库
- pinia: 强烈推荐, 未来趋势的状态管理库

![image-20240811105509846](https://p.ipic.vip/oubhlc.png)

#### 6. 网络请求封装 axios

![image-20240811105643020](https://p.ipic.vip/mz6sk0.png)

#### 7. 环境变量配置

https://cn.vitejs.dev/guide/env-and-mode.html#modes

- Vite 的环境变量：开发环境 `dev` 、生产环境，`prod`
- Vite 在一个特殊的 import.meta.env 对象上暴露环境变量。这里有一些在所有情况下都可以使用的内建变量：
  - import.meta.env.MODE: {string} 应用运行的模式。
  - import.meta.env.PROD: {boolean} 应用是否运行在生产环境。
  - import.meta.env.DEV: {boolean} 应用是否运行在开发环境 (永远与 import.meta.env.PROD 相反)。
  - import.meta.env.SSR: {boolean} 应用是否运行在 server 上。

```text
新建文件
.env
.env.development
.env.production

项目配置的内容
文件内容 VITE_URL=dev
文件内容 VITE_URL=prod
```

![image-20240811112140025](https://p.ipic.vip/hfc1ve.png)

#### 8. Element-Plus 集成

- 安装：https://element-plus.org/zh-CN/guide/installation.html
- 导入：https://element-plus.org/zh-CN/guide/quickstart.html

## 集成 editorconfig 配置

> EditorConfig 为不同编辑器上处理同一个项目的多个开发人员维护一致的编码风格

http://editorconfig.org

```yaml
# .editorconfig

root = true

[*] # 表示所有文件适用
charset = utf-8 # 设置文件字符集为 utf-8
indent_style = space # 缩进风格（tab | space）
indent_size = 2 # 缩进大小
end_of_line = lf # 控制换行类型(lf | cr | crlf)
trim_trailing_whitespace = true # 去除行尾的任意空白字符
insert_final_newline = true # 始终在文件末尾插入一个新行

[*.md] # 表示仅 md 文件适用以下规则
max_line_length = off
trim_trailing_whitespace = false
```

VSCode 安装一个插件：EditorConfig for VS Code

![image-20240403170119374](https://p.ipic.vip/10aza2.png)

## 使用 prettier 工具

> Prettier 代码格式化工具，支持 JavaScript、TypeScript、CSS、SCSS、Less、JSX、Vue 等语言。

https://www.prettier.cn/

1. 安装 Prettier

   ```shell
   npm install prettier -D
   ```

2. 配置.prettierrc 文件

   ```json
   {
     "useTabs": false,
     "tabWidth": 2,
     "printWidth": 80,
     "singleQuote": true,
     "trailingComma": "none",
     "semi": false
   }
   ```

   - useTabs：使用 tab 缩进还是空格缩进，选择 false
   - tabWidth：tab 是空格的情况下，是几个空格，选择 2 个
   - printWidth：当前字符的长度，推荐 80
   - singleQuote：使用单引号还是双引号，推荐单引号
   - trailingComma：在多行输入的尾逗号是否添加
   - semi： 语句末尾是否要加分号，默认为 true

3. 创建.prettierignore 忽略文件

   ```
   /dist/*
   .local
   .output.js
   /node_modules/**

   **/*.svg
   **/*.sh

   /public/*
   ```

4. VSCode 安装一个插件：Prettier

   ![image-20240403191852801](https://p.ipic.vip/4e02ae.png)

5. VSCode 中的配置

   - settings => format on save => 勾选上

   - settings => editor default format => 选择 prettier

     ![image-20240810123731164](../../../Library/Application Support/typora-user-images/image-20240810123731164.png)

6. 测试 Prettier 是否生效

   - 在代码中保存代码

   - 配置一次性修改的命令：在 package.json 中配置一个 scripts

     ```json
     "prettier": "prettier --write ."
     ```

## 使用 ESLint 检测

> `eslint`运行代码前就可以发现一些语法错误和潜在的 bug，目标是保证团队代码的一致 性和避免错误

> 区别联系：`eslint`偏向于把控项目的代码质量，而`prettier`更偏向于统一项目的编码 风格。`eslint`有小部分的代码格式化功能，一般和`prettier`结合使用

https://zh-hans.eslint.org/docs/latest/use/getting-started

1. 配置 ESLint 环境

   - 创建项目时选择 ESLint，Vue 会默认配置

   - 配置脚本

     ```shell
     # 在package.json，配置script脚本，项目安装eslint配置
     "lint:create": "eslint --init"
  
     #执行
     npm run lint:create
  
     # 会自动创建一个.eslintrc.cjs文件
     ```

2. VSCode 需要安装 ESLint 插件

   ![image-20240403192629564](https://p.ipic.vip/eprkd3.png)

3. 解决 ESLint 和 Prettier 冲突的问题

   ```shell
   npm install eslint-plugin-prettier eslint-config-prettier -D
   ```

   添加 Prettier 插件

   ```json
   # .eslintrc.cjs

   extends: [
     'plugin:vue/vue3-essential',
     'eslint:recommended',
     '@vue/eslint-config-typescript',
     '@vue/eslint-config-prettier',
     'plugin:prettier/recommended'
   ]
   ```

4. VSCode 中 ESLint 配置

   ```json
   "eslint.lintTask.enable": true,
   "eslint.alwaysShowStatus": true,
   "eslint.validate": [
     "javascript",
     "javascriptreact",
     "typescript",
     "typescriptreact"
   ],
   "editor.codeActionsOnSave": {
     "source.fixAll.eslint": true
   },
   ```

## git Husky 和 eslint

> 问题：虽然项目使用 eslint 了，但是不能保证组员提交代码之前都将 eslint 问题解决掉了

1. husky 是一个 git hook 工具，帮助触发 git 提交的每个阶段：pre-commit、commit-msg、pre-push

   - 保证代码仓库中的代码都是符合 eslint 规范
   - 需要组员执行 **git commit** 命令的时候对其进行校验，如果不符合 eslint 规范，那么自动通过规范进修复

2. 使用

   - 使用自动配置命令

     ```shell
     npx husky-init && npm install
     ```

     这里会做三件事

     1. 安装 husky 相关依赖

        ![image-20240811123013952](https://p.ipic.vip/i8f9v3.png)

     2. 在项目目录下创建 **.husky** 文件夹

        ![image-20240811122903035](https://p.ipic.vip/chao70.png)

     3. 在 package.json 中添加一个脚本

        ![image-20240811123107570](https://p.ipic.vip/xt22n1.png)

     接下来，我们需要去完成一个操作：进行 commit 时，执行 lint 脚本（这个时候执行 git commit 的时候会自动对代码进行 lint 校验）

     ![image-20240403215146797](https://p.ipic.vip/svrnx8.png)

## git commit 规范

1. 代码提交风格

   > 通常我们的 git commit 会按照统一的⻛格来提交，这样可以快速定位每次提交的内容，方便之后对版本
   >
   > 进行控制。

   ![image-20240403215814390](https://p.ipic.vip/xpr6yw.png)

   但是每次手动编写这些比较麻烦，我们可以使用一个工具 Commitizen，它是一个帮助我们编写规范 commit message 的工具

   - 安装 Commitizen

   ```shell
   npm install commitizen -D
   ```

   - 安装 cz-conventional-changelog， 并且初始化 cz-conventional-changelog

   ```shell
   npx commitizen init cz-conventional-changelog --save-dev --save-exact
   ```

   上面的命令帮助我们安装 cz-conventional-changelog

   ![image-20240811123627255](https://p.ipic.vip/scosye.png)

   并且在 package.json 中进行配置：

   ![image-20240811123709851](https://p.ipic.vip/e6fg2m.png)

   这个时候我们提交代码需要使用 `npx cz`：

   - 第一步选择 type，本次更新的类型

   | Type     | 作用                                                                                   |
   | -------- | -------------------------------------------------------------------------------------- |
   | feat     | 新增特性 (feature)                                                                     |
   | fix      | 修复 Bug(bug fix)                                                                      |
   | docs     | 修改文档 (documentation)                                                               |
   | style    | 代码格式修改(white-space, formatting, missing semi colons, etc)                        |
   | refactor | 代码重构(refactor)                                                                     |
   | perf     | 改善性能(A code change that improves performance)                                      |
   | test     | 测试(when adding missing tests)                                                        |
   | build    | 变更项目构建或外部依赖（例如 scopes: webpack、gulp、npm 等）                           |
   | ci       | 更改持续集成软件的配置文件和 package 中的 scripts 命令，例如 scopes: Travis, Circle 等 |
   | chore    | 变更构建流程或辅助工具(比如更改测试环境)                                               |
   | revert   | 代码回退                                                                               |

   - 第二步选择本次修改的范围（作用域）

   ![image-20240403220648854](https://p.ipic.vip/rsm813.png)

   - 第三步选择提交的信息

     ![image-20240403220701023](https://p.ipic.vip/zo4ty6.png)

   - 第四步提交详细的描述信息

     ![image-20240403220710658](https://p.ipic.vip/o91mki.png)

   - 第五步是否是一次重大的更改

     ![image-20240403220719539](https://p.ipic.vip/eyq12y.png)

   - 第六步是否影响某个 open issue

     ![image-20240403220729788](https://p.ipic.vip/xnxnyy.png)

   我们也可以在 scripts 中构建一个命令来执行 cz

   ![image-20240811124043305](https://p.ipic.vip/xa2q1a.png)

2. 代码提交验证

   > 解决不按照 cz 规范提交，依然通过 git commit 按照不规范的格式来提交代码应该怎么解决？

   - 通过 commitlint 来限制提交

     1. 安装

        ```shell
        npm i @commitlint/config-conventional @commitlint/cli -D
        ```

     2. 根目录创建 commitlint.config.js 文件，配置 commitlint

        ```js
        module.exports = {
          extends: ['@commitlint/config-conventional']
        }
        ```

     3. 使用 husky 生成 commit-msg 文件，验证提交信息

        ```shell
        npx husky add .husky/commit-msg "npx --no-install commitlint --edit $1"
        ```

### `stylelint`钩子

> CSS 检查器(linter)，帮助我们规避 CSS 代码中的错误并保持一致的编码风格

https://stylelint.io/user-guide/get-started

1. 安装 vscode 插件，Stylelint
2. 修改 settings.json，添加下面代码

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.stylelint": true
  },
  "stylelint.validate": ["css", "less", "scss", "vue"]
}
```

3. 安装项目需要的校验库，（常见的规则包）

```shell
pnpm install stylelint stylelint-config-standard -D
```

4. 根目录下建立 .stylelintrc.cjs

```js
module.exports = {
  extends: ['stylelint-config-standard']
}
```

这是一个标准样式库，也可以自动添加一些样式规则在 stylelintrc.cjs 文件里面

5. 执行 npx stylelint "\*_/_.css"
   发现项目里面的 style.css 全局样式文件，报错很多
   具体到对应的文件，按 ctrl+s 就会执行自动格式化我们在 setting.json 里面添加的语句（第 2 步）

6. 增加 vue 里面的样式支持（附带 less 和 scss 的支持）

```shell
# 对less的支持
pnpm install stylelint-less stylelint-config-recommended-less -D

# 对scss的支持
pnpm install stylelint-scss stylelint-config-recommended-scss postcss -D

# 对postcss的支持
pnpm install postcss-html stylelint-config-standard-scss stylelint-config-recommended-vue postcss -D （对vue里面样式的支持，vue的样式需要依赖前面这个库）
```

Vite 也同时提供了对 .scss .sass .less .styl .stylus 文件的内置支持，不需要再安装特定插件和预处理器

```js
extends: [
  "stylelint-config-standard",
  "stylelint-config-recommended-less",
  "stylelint-config-recommended-scss",
  "stylelint-config-recommended-vue"
]

scss的extends
extends:[
  "stylelint-config-standard-scss",
  "stylelint-config-recommended-vue/scss"
]
```

7. package.json 文件添加

```json
"lint:css": "stylelint **/*.{vue,css,sass,scss} --fix"
```

8. 给 vite 添加插件

```shell
pnpm install vite-plugin-stylelint -D
```

修改 vite.config.js 文件

```js
import stylelitPlugin from 'vite-plugin-stylelint';

plugins: [... stylelitPlugin()],
```

9. 添加到 lint-staged 里面，在暂存区对文件进行格式化

```js
"lint-staged": {
  "*.{js,jsx,vue,ts,tsx}": [
    "npm run lint",
    "npm run prettier-format"
  ],
    "*.{vue,less,css,scss,sass}": [
      "npm run lint:css"
    ]
}
```

10. 添加一个.stylelintignore 文件

    ```js
    /dist/*
    /public/*
    ```

11. .stylelintrc.cjs 内部的其他配置
    ```js
    module.exports = {
      extends: [
        'stylelint-config-standard',
        'stylelint-config-recommended-vue'
      ],
      overrides: [
        // 若项目中存在scss文件，添加以下配置
        {
          files: ['*.scss', '**/*.scss'],
          customSyntax: 'postcss-scss',
          extends: ['stylelint-config-recommended-scss']
        },
        // 若项目中存在less文件，添加以下配置
        {
          files: ['*.less', '**/*.less'],
          customSyntax: 'postcss-less',
          extends: ['stylelint-config-recommended-less']
        }
      ]
    }
    ```

## 补充：

#### 1. 技术栈参考

| 技术栈介绍    |                                                                                               |
| ------------- | --------------------------------------------------------------------------------------------- |
| 开发工具      | Visual Studio Code                                                                            |
| 编程语言      | TypeScript 4.x + JavaScript                                                                   |
| 构建工具      | Vite 3.x / Webpack5.x                                                                         |
| 前端框架      | Vue 3.x + setup                                                                               |
| 路由工具      | Vue Router 4.x                                                                                |
| 状态管理      | Vuex 4.x / Pinia                                                                              |
| UI 框架       | Element Plus                                                                                  |
| 可视化        | Echart5.x                                                                                     |
| 工具库        | @vueuse/core + dayjs + countup.js 等等 [前端库推荐](https://www.bestblogs.dev/article/e0b092) |
| CSS 预编译    | Sass / Less                                                                                   |
| HTTP 工具     | Axios                                                                                         |
| Git Hook 工具 | husky                                                                                         |
| 代码规范      | EditorConfig + Prettier + ESLint                                                              |
| 提交规范      | Commitizen + Commitlint                                                                       |
| 自动部署      | Centos + Jenkins + Nginx                                                                      |

#### 2. 项目打包和自动化部署

- 项目部署和 DevOps

  - DevOps 是 Development 和 Operations 两个词的结合，将开发和运维结合起来的模式：

    ![17233517603573](https://p.ipic.vip/fbttnw.jpg)

  - 持续集成和持续交付

    伴随着 DevOps 一起出现的两个词就是持续集成和持续交付(部署)：

    - CI 是 Continuous Integration（持续集成）；
    - CD 是两种翻译：Continuous Delivery（持续交付）或 Continuous Deployment（持续部署）；

  - 自动化部署流程

    ![17233517603588](https://p.ipic.vip/7lesv6.jpg)

- 购买云服务器

  - https://aliyun.com/

- 搭建服务器环境

  1. jenkins 自动化部署

     - 安装 Java 环境
     - 安装 Jenkins
     - Jenkins 用户
     - Jenkins 配置
     - Jenkins 任务

  2. nginx 安装和配置

     - 安装 nginx

       ```shell
       # 安装
       dnf install nginx
       # 启动
       systemctl start nginx
       systemctl status nginx
       systemctl enable nginx
       ```

     - 配置 nginx

       - nginx 配置文件目录

         /etc/nginx/nginx.conf

       - 我们这里主要配置 nginx 的用户和默认访问目录（配置用户：）

         ![17233517603844](../../../Documents/RicardoPang/前端系统课完结/000 资料/11\_阶段十一-Vue3+TS 项目实战/11-阶段十一-Vue3+TS 后台系统实战/Day10/笔记/assets/17233517603844.jpg)

       - 通过 Linux 命令创建文件夹和文件：

       ```shell
       # 通过Linux命令创建文件夹和文件
       mkdir /root/mall_cms
       cd /root/mall_cms
       touch index.html
       
       vi index.html
       ```

       - 配置访问目录：

         ![17233517603861](https://p.ipic.vip/rxqtap.jpg)

#### 3. 动态路由

> 根据用户的权限信息，动态的添加路由（而不是一次性的注册所有的路由）

1. 基于角色（Role）的动态路由管理

   ```js
   const roles = {
     "superadmin": [所有的路由] => router.main.children
     "admin": [一部分路由] => router.main.children
   	"service": [少部分路由] => router.main.children
   	"manager": [] => 重新发布/后端返回这个对象（json数据，后端必须组织好这个json）
   }
   // 弊端：每增加一个角色，都要增加key/value
   ```

2. 基于菜单（Menu）的动态路由管理

   ```js
   userMenus => 动态展示菜单
   系统总览/核心技术/用户管理、角色管理/...
   
   // 登录接口请求的三个内容
   // 1. token
   // 2. 用户信息：角色信息（role对象）
   // 3. 菜单信息
   ```

## 总结

1. 项目搭建
2. 项目打包和自动化部署
3. 源码: https://github.com/RicardoPang/pf-vue3-ts-template
