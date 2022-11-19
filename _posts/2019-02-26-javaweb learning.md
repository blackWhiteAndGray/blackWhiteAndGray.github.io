---
layout:     post
title:      VSCODE
date:       2022-11-19
author:     BY RicardoPang
header-img: img/post-bg-ios9-web.jpg
catalog: 	 true
tags:
    - 前端
    - VSCODE
---

## 1. VSCODE

### 1.1 使用node启动调试

```json
{
  "type": "node",
  "request": "launch",
  "name": "启动程序",
  "program": "E:/cli.js"
}
```

- VSCODE

  ### 1.2 保存时自动格式化

  File->Preferences->User Settings

  ```json
  {
    "editor.formatOnType": false,
    "editor.formatOnSave": false
  }
  ```

### 1.3 语言改为英文

快捷键Command+Shift+P（Win下为Control）打开命令行工具,输入设置语言，会打开一个locale.json的文件，如下面所示

{ // 定义 VSCode 的显示语言。 // 请参阅 http://go.microsoft.com/fwlink/?LinkId=761051，了解支持的语言列表。 // 要更改值需要重启 VSCode。 "locale":"zh-CN" } 将locale的值改为en-US之后重启VSCode就恢复到英文版本的了!

### 1.4 快捷键

- 列选择 alt+shift+左键
- 多点编辑 按alt点击左键
- 格式化 Alt+shift+f

### 1.5 单行注释

单行注释

```js
//.+?(?=["$\r\n]
```

### 1.6 多行注释

```js
\/\*([\w\W]+?)\*\/
```

### 1.7 空行

```js
^\s*(?=\r?$)\n
```

### 1.8 全部替换

```js
((\/\*([\w\W]+?)\*\/)|(\/\/.+?(?=["$\r\n]))|(^\s*(?=\r?$)\n))
```

![emptylineregexp.png](http://img.zhufengpeixun.cn/emptylineregexp.png)

| 表达式      | 含义                                                         |
| :---------- | :----------------------------------------------------------- |
| (?:)        | 表示非捕获分组，和捕获分组唯一的区别在于，非捕获分组匹配的值不会保存起来 |
| (?=pattern) | 正向肯定查找(前瞻),后面必须跟着什么                          |

## 2.MAC

### 2.1 杀死进程

查看进程占用

```javascript
lsof -i tcp:8080 
```

该命令会显示占用8080端口的进程，有其 pid ,可以通过pid关掉该进程

```javascript
kill pid
```

### 2.2 查看端口占用

#### 2.2.1 lsof

```
lsof -i:port
lsof -i:8080
```

#### 2.2.2 netstat

```
netstat -antp | grep port
netstat -antp | grep 8080
```

## 3.安装需要编译包

### 3.1 安装sharp

- [sharp](https://www.iqi360.com/p/sharp-cn)是一个高性能的nodejs图像处理库

- [安装sharp](https://www.iqi360.com/p/sharp-cn/docs/5f8b012a5a726a40e3f0f02e)

- [安装过程中遇到sharp安装慢](https://www.cnblogs.com/zzsdream/p/13391731.html)

- [sharp-libvips](https://github.com/lovell/sharp-libvips/releases/tag/v8.10.5)

- ```js
  npm config set sharp_binary_host "https://npm.taobao.org/mirrors/sharp"
  npm config set sharp_libvips_binary_host "https://npm.taobao.org/mirrors/sharp-libvips"
  npm install sharp
  ```

  ### 3.2 编译

- [node-gyp#on-windows](https://github.com/nodejs/node-gyp#on-windows)

- [windows-build-tools](https://github.com/felixrieseberg/windows-build-tools)

- [python](https://www.python.org/)

### 3.2 cache目录

- NPM会把所有下载的包保存，放在用户文件夹下面，在我的windows10机器上是保存在C:\Users\Administrator\AppData\Roaming\npm-cache下面
- NPM install之后会计算每个包的sha1值，然后将包与他的sha1值关联保存在package.lock.json里面
- 下次NPM install的时候会根据package.lock.json里面保存的sha1值去文件夹C:\Users\Administrator\AppData\Roaming\npm-cache里面寻找包文件，如果存在，就不用再次从网上下载安装包
- NPM cache verify 重新计算C:\Users\Administrator\AppData\Roaming\npm-cache下的文件是否与sha1值匹配，如果不匹配可能删除？
- NPM cache clean --force 这个命令从C:\Users\Administrator\AppData\Roaming\npm-cache下删除所有缓存文件
- NPM不同版本算出来的sha1貌似不完全一样，所以直接用别人的package.lock.json会报sha1不匹配的error
- `yarn cache list` 查看缓存的包
- `yarn cache dir` 查询cache缓存文件目录路径
- `yarn cache clean` yarn 清除缓存
- `npm cache clean --force` npm清除缓存

## 4.Yarn

| 命令                                                      | 说明                                                         |
| :-------------------------------------------------------- | :----------------------------------------------------------- |
| yarn -v                                                   | 查看yarn版本                                                 |
| yarn config list                                          | 查看yarn的所有配置                                           |
| yarn config set registry https://registry.npm.taobao.org/ | 修改yarn的源镜像为淘宝源                                     |
| yarn config set global-folder "D:\RTE\Yarn\global"        | 修改全局安装目录, 先创建好目录(global), 我放在了Yarn安装目录下(D:\RTE\Yarn\global) |
| yarn config set prefix "D:\RTE\Yarn\global\"              | 修改全局安装目录的bin目录位置                                |
| yarn config set cache-folder "D:\RTE\Yarn\cache"          | 修改全局缓存目录, 先创建好目录(cache), 和global放在同一层目录下 |
| yarn config list                                          | 查看所有配置                                                 |
| yarn global bin                                           | 查看当前yarn的bin的位置                                      |
| yarn global dir                                           | 查看当前yarn的全局安装位置                                   |

## 5.lerna

| 命令            | 功能                                                      |
| :-------------- | :-------------------------------------------------------- |
| lerna bootstrap | 安装依赖                                                  |
| lerna clean     | 删除各个包下的node_modules                                |
| lerna init      | 创建新的lerna库                                           |
| lerna list      | 查看本地包列表                                            |
| lerna changed   | 显示自上次release tag以来有修改的包， 选项通 list         |
| lerna diff      | 显示自上次release tag以来有修改的包的差异， 执行 git diff |
| lerna exec      | 在每个包目录下执行任意命令                                |
| lerna run       | 执行每个包package.json中的脚本命令                        |
| lerna add       | 添加一个包的版本为各个包的依赖                            |
| lerna import    | 引入package                                               |
| lerna link      | 链接互相引用的库                                          |
| lerna create    | 新建package                                               |
| lerna publish   | 发布                                                      |

## 6.yarn

| 作用                        | 命令                                                         |
| :-------------------------- | :----------------------------------------------------------- |
| 查看工作空间信息            | yarn workspaces info                                         |
| 给根空间添加依赖            | yarn add chalk cross-spawn fs-extra --ignore-workspace-root-check |
| 给某个项目添加依赖          | yarn workspace create-react-app3 add commander               |
| 删除所有的 node_modules     | lerna clean 等于 yarn workspaces run clean                   |
| 安装和link                  | yarn install 等于 lerna bootstrap --npm-client yarn --use-workspaces |
| 重新获取所有的 node_modules | yarn install --force                                         |
| 查看缓存目录                | yarn cache dir                                               |
| 清除本地缓存                | yarn cache clean                                             |

## 7.调试命令

.vscode\launch.json

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "vue-cli",
            "cwd":"${workspaceFolder}",
            "runtimeExecutable": "npm",
            "runtimeArgs": [
                "run",
                "create"
            ],
            "port":9229,
            "autoAttachChildProcesses": true,
            "stopOnEntry": true,
            "skipFiles": [
                "<node_internals>/**"
            ]
        }
    ]
}
```

## 8.配置alias

Create React App无eject配置 打包成相对路径配置 在package.json中增加：

```json
"homepage": "."
```

## 9.解决vscode卡顿问题

vscode在任务管理器观察CPU占用率100% 解决方案 VScode中文件->首选项->设置 ，之后搜索"search.followSymlinks":true,然后设置为false

![exclude](https://static.zhufengpeixun.com/20210805195616161_1637830390170.png)

## 10. window编译C++

- [node-gyp](https://github.com/nodejs/node-gyp)
- [node-sass](https://www.npmjs.com/package/node-sass)

### 10.1 Python executable python2 in the PATH

- npm install 报错 check python checking for Python executable python2 in the PATH
- 删除 node_modules 文件夹
- 在 Terminal 运行 `npm install --global windows-build-tools --save`
- 再安装 `npm install node-sass --save`
- 到这里，错误应该就已经解决了，收到了 `gyp info ok` 的提示！
- 如果遇到 `Node Sass could not find a binding for your current environment`，再运行 `npm rebuild node-sass` 就可以了

### 10.2 getaddrinfo ENOENT raw.githubusercontent.com

- 点开网址 https://www.ipaddress.com/ ，输入`raw.githubusercontent.com`，点击查询：
- 修改hosts文件 `C:\Windows\System32\drivers\etc\hosts` `ip raw.githubusercontent.com`
- npm install

### 10.3 npm ERR! gyp verb which failed Error: not found: python2

- npm config set python `C:/Python27/python.exe`

### 10.4

npm ERR! gyp ERR! stack Error: spawn C:\Program Files (x86)\Microsoft Visual Studio\2019\BuildTools\MSBuild\15.0\Bin\MSBuild.exe ENOENT

npm cache clean --force

C:\Users\zhangrenyang\AppData\Roaming\npm\node_modules\node-gyp\gyp\pylib\gyp\MSVSVersion.py

npm audit fix