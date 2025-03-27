---
title: 手写Vue2.0源码
description: 核心逻辑以及功能的实现
---

## 一.使用Rollup搭建开发环境

> _Rollup_ 是一个 JavaScript 模块打包器,可以将小块代码编译成大块复杂的代码， `rollup.js`更专注于`Javascript`类库打包。

#### 1.安装rollup环境

```bash
npm install @babel/preset-env @babel/core rollup rollup-plugin-babel rollup-plugin-serve cross-env -D
```

#### 2.rollup.config.js编写

```js
import babel from 'rollup-plugin-babel'
import serve from 'rollup-plugin-serve'

// 常见的模块规范 import export (ESModule) module.exports require (CommonJS)
// AMD 比较老的模块规范 systemjs 模块规范
// ES6Module commonjs umd 支持amd 和 cmd Vue)

export default {
  input: './src/index.js', // 打包项目的入口文件
  output: {
    format: 'umd', // 打包后的结果是umd模块规范
    file: 'dist/vue.js', // 打包出的文件结果放在哪个目录
    name: 'Vue', // 打包后的全局变量的名字
    sourcemap: true
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    process.env.ENV === 'development'
      ? serve({
          open: true,
          openPage: '/public/index.html',
          port: 3000,
          contentBase: ''
        })
      : null
  ]
}
```

#### 3.配置.babelrc

```js
{
  "presets": ["@babel/preset-env"]
}
```

#### 4.执行脚本配置

```js
// package.json
"scripts": {
  "build:dev": "rollup -c",
  "serve": "cross-env ENV=development rollup -c -w"
}
```

## 二.Vue响应式原理

#### 导出Vue构造函数

```js
// 整个自己编写的Vue入口

import { initMixin } from './init'

// es6的类, 要求所有的扩展都在类的内部来进行扩展

function Vue(options) {
  this._init(options)
}

initMixin(Vue) // 后续再扩展都可以采用这种方式

// 给Vue添加原型方法我们通过文件的方式来添加, 防止所有的功能都在一个文件中来处理
export default Vue
```

#### init方法初始化Vue状态

```js
import { initState } from './state'

export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this
    // vue中会判断如果是$开头的属性不会被变成响应式数据
    this.$options = options // 所有后续的扩展方法都有一个$options选项可以获取用户的所有选项

    // 对于实例的数据源 props data methods computed watch
    // prop data
    initState(vm)
  }
}
```

#### 根据不同属性进行初始化操作

```js
export function initState(vm) {
  // 获取传入的数据对象
  const options = vm.$options

  // 后续实现计算属性 watch props methods
  if (options.data) {
    // 初始化data
    initData(vm)
  }
}
function initData(vm) {}
```

#### 1. 初始化数据

```js
import { observe } from './observer/index'
function initData(vm) {
  let data = vm.$options.data
  // 如果是函数就拿到函数的返回值, 否则就直接采用data作为数据源
  data = vm._data = typeof data === 'function' ? data.call(vm) : data
  // 属性劫持, 采用defineProperty将所有的属性进行劫持
  observe(data)
}
```

#### 2. 递归属性劫持

```js
import arrayPrototype from './array'

class Observer {
  constructor(data) {
    // 如果有__ob__属性, 说明被观测过了
    Object.defineProperty(data, '__ob__', {
      value: this,
      enumerable: false, // 不可枚举
      writable: true,
      configurable: true
    })
    if (Array.isArray(data)) {
      // 如果是数组的话也是用defineProperty回浪费很多性能, 并且很少用户会通过索引操作 arr[666] = 777
      // vue3中的Polyfill直接就给数组做代理了
      // 改写数组的方法, 勇敢用户调用了可以改写数组方法的api, 那么就去劫持这个方法
      // 变异方法 push pop shift unshift reverse sort splice
      // 修改数组的索引和长度无法更新视图
      data.__proto__ = arrayPrototype
      // 如果数组里面放的是对象类型, 期望它也会被变成响应式的
      this.observeArray(data)
    } else {
      this.walk(data)
    }
  }
  observeArray(data) {
    data.forEach((item) => observe(item)) // 如果是对象才观测
  }
  walk(data) {
    // 循环对象, 尽量不用for in 会遍历原型链
    let keys = Object.keys(data)
    keys.forEach((key) => {
      // 没有重写数组里的每一项
      defineReactive(data, key, data[key])
    })
  }
}

// 性能不好的原因, 所有的属性都被重新定义了一遍
// 一上来需要将对象深度代理, 性能差
function defineReactive(data, key, value) {
  observe(value) // 递归代理属性
  // 属性会全部被重写添加了get和set
  Object.defineProperty(data, key, {
    get() {
      return value
    },
    set(newValue) {
      observe(newValue) // 赋值一个对象, 也可以实现响应式数据
      if (newValue !== value) {
        value = newValue
      }
    }
  })
}

export function observe(data) {
  if (typeof data !== 'object' || data == null) {
    // 如果不是对象类型, 那么不需要做任何处理
    return
  }
  if (data.__ob__) {
    // 说明这个属性已经被代理过了
    return
  }
  // 如果一个对象已经被观测了, 就不要再次被观测了
  // __ob__ 标识是否又被观测过
  return new Observer(data)
}
```

#### 3. 数组方法劫持

```js
class Observer {
  constructor(data) {
    if (Array.isArray(data)) {
      // 如果是数组的话也是用defineProperty回浪费很多性能, 并且很少用户会通过索引操作 arr[666] = 777
      // vue3中的Polyfill直接就给数组做代理了
      // 改写数组的方法, 勇敢用户调用了可以改写数组方法的api, 那么就去劫持这个方法
      // 变异方法 push pop shift unshift reverse sort splice
      // 修改数组的索引和长度无法更新视图
      data.__proto__ = arrayPrototype
      // 如果数组里面放的是对象类型, 期望它也会被变成响应式的
      this.observeArray(data)
    } else {
      this.walk(data)
    }
  }
  observeArray(data) {
    data.forEach((item) => observe(item)) // 如果是对象才观测
  }
}
```

##### 重写数组原型方法

```js
let oldArrayPrototype = Array.prototype
// arrayPrototype.__proto__ = Array.prototype

let arrayPrototype = Object.create(oldArrayPrototype)
let methods = ['push', 'pop', 'shift', 'unshift', 'splice', 'reverse', 'sort']
methods.forEach((method) => {
  // 用户调用push方法会先自己重写的方法, 之后调用数组原来的方法
  arrayPrototype[method] = function (...args) {
    let inserted
    const ob = this.__ob__
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args // 数组
        break
      case 'splice': // arr.splice(1, 1, xxx)
        inserted = args.slice(2)
        break
      default:
        break
    }
    if (inserted) {
      // 对新增的数据再次进行观测
      ob.observeArray(inserted)
    }
    return oldArrayPrototype[method].call(this, ...args)
  }
})

export default arrayPrototype
```

##### 增加**ob**属性

```js
class Observer {
  constructor(data) {
    // 如果有__ob__属性, 说明被观测过了
    Object.defineProperty(data, '__ob__', {
      value: this,
      enumerable: false, // 不可枚举
      writable: true,
      configurable: true
    })
  }
}
```

> 给所有响应式数据增加标识，并且可以在响应式上获取`Observer`实例上的方法

#### 4. 数据代理

```js
function proxy(vm, source, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[source][key]
    },
    set(newValue) {
      vm[source][key] = newValue
    }
  })
}

function initData(vm) {
  let data = vm.$options.data
  // 如果是函数就拿到函数的返回值, 否则就直接采用data作为数据源
  data = vm._data = typeof data === 'function' ? data.call(vm) : data
  // 期望用户可以直接通过 vm.xxx 获取值, 也可以这样取值 vm._data.xxx
  for (let key in data) {
    proxy(vm, '_data', key)
  }
  // 属性劫持, 采用defineProperty将所有的属性进行劫持
  observe(data)
}
```

## 三.模板编译

```js
Vue.prototype._init = function (options) {
  const vm = this
  // vue中会判断如果是$开头的属性不会被变成响应式数据
  this.$options = options // 所有后续的扩展方法都有一个$options选项可以获取用户的所有选项

  // 对于实例的数据源 props data methods computed watch
  // prop data
  initState(vm)

  // 状态初始化完毕后需要进行页面挂载
  if (vm.$options.el) {
    // el属性和直接调用$mount是一样的
    vm.$mount(vm.$options.el)
  }
}

Vue.prototype.$mount = function (el) {
  const vm = this
  el = document.querySelector(el)
  const options = vm.$options
  if (!options.render) {
    let template = options.template
    if (!template && el) {
      template = el.outerHTML
    }
    // 将template变成render函数
    // 创建render函数 => 虚拟dom => 渲染真实dom
    const render = compileToFunctions(template) // 开始编译
    options.render = render
  }
  // 将当前组件实例挂载到真实的el节点上面
  return mountComponent(vm, el)
}
```

将template编译成render函数

#### 1.解析标签和内容

```js
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*` //匹配标签名 形如 abc-123
const qnameCapture = `((?:${ncname}\\:)?${ncname})` //匹配特殊标签 形如 abc:234 前面的abc:可有可无
const startTagOpen = new RegExp(`^<${qnameCapture}`) // 匹配标签开始 形如 <abc-123 捕获里面的标签名
const startTagClose = /^\s*(\/?)>/ // 匹配标签结束  >
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`) // 匹配标签结尾 如 </abc-123> 捕获里面的标签名
const attribute =
  /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/ // 匹配属性  形如 id="app"

export function parse(html) {
  let root // 树的操作，需要根据开始标签和结束标签产生一棵树
  // 如何构建树的父子关系
  let stack = []
  while (html) {
    // 一个个字符来解析将结果跑出去
    let textEnd = html.indexOf('<')
    if (textEnd === 0) {
      const startTagMatch = parseStartTag() // 解析开始标签
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs)
        continue
      }
      let matches
      if ((matches = html.match(endTag))) {
        // </div> 不是开始就会走到结束
        end(matches[1])
        advance(matches[0].length)
        continue
      }
    }
    let text
    if (textEnd >= 0) {
      text = html.substring(0, textEnd)
    }
    if (text) {
      advance(text.length)
      chars(text)
    }
  }
  function createASTElement(tagName, attrs) {
    return {
      tag: tagName,
      attrs,
      children: [],
      parent: null,
      type: 1
    }
  }
  function start(tagName, attrs) {
    const element = createASTElement(tagName, attrs)
    if (root == null) {
      root = element
    }
    const parent = stack[stack.length - 1] // 取到栈中最后一个
    if (parent) {
      element.parent = parent // 让这个元素记住自己的父亲是谁
      parent.children.push(element) // 让父亲记住儿子是谁
    }
    // 将原素放到栈中
    stack.push(element)
  }
  function end(tagName) {
    stack.pop()
  }
  function chars(text) {
    text = text.replace(/\s/g, '')
    if (text) {
      const parent = stack[stack.length - 1]
      parent.children.push({
        type: 3,
        text
      })
    }
  }
  function parseStartTag() {
    const matches = html.match(startTagOpen)
    if (matches) {
      const match = {
        tagName: matches[1],
        attrs: []
      }
      advance(matches[0].length)
      // 继续解析开始标签的属性
      let end, attr
      while (
        !(end = html.match(startTagClose)) &&
        (attr = html.match(attribute))
      ) {
        // 只要没有匹配到结束标签就一直匹配
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5] || true
        })
        advance(attr[0].length) // 解析一个属性删除一个
      }
      if (end) {
        advance(end[0].length)
        return match
      }
    }
  }
  function advance(n) {
    html = html.substring(n) // 每次根据传入的长度截取html
  }
  return root
}
```

#### 2.生成ast语法树

语法树就是用对象描述js语法

```js
{
    tag:'div',
    type:1,
    children:[{tag:'span',type:1,attrs:[],parent:'div对象'}],
    attrs:[{name:'pf',age:10}],
    parent:null
}
```

```js
let root // 树的操作，需要根据开始标签和结束标签产生一棵树
// 如何构建树的父子关系
let stack = []
while (html) {
  // 一个个字符来解析将结果跑出去
  let textEnd = html.indexOf('<')
  if (textEnd === 0) {
    const startTagMatch = parseStartTag() // 解析开始标签
    if (startTagMatch) {
      start(startTagMatch.tagName, startTagMatch.attrs)
      continue
    }
    let matches
    if ((matches = html.match(endTag))) {
      // </div> 不是开始就会走到结束
      end(matches[1])
      advance(matches[0].length)
      continue
    }
  }
  let text
  if (textEnd >= 0) {
    text = html.substring(0, textEnd)
  }
  if (text) {
    advance(text.length)
    chars(text)
  }
}
function createASTElement(tagName, attrs) {
  return {
    tag: tagName,
    attrs,
    children: [],
    parent: null,
    type: 1
  }
}
function start(tagName, attrs) {
  const element = createASTElement(tagName, attrs)
  if (root == null) {
    root = element
  }
  const parent = stack[stack.length - 1] // 取到栈中最后一个
  if (parent) {
    element.parent = parent // 让这个元素记住自己的父亲是谁
    parent.children.push(element) // 让父亲记住儿子是谁
  }
  // 将原素放到栈中
  stack.push(element)
}
function end(tagName) {
  stack.pop()
}
function chars(text) {
  text = text.replace(/\s/g, '')
  if (text) {
    const parent = stack[stack.length - 1]
    parent.children.push({
      type: 3,
      text
    })
  }
}
```

#### 3.生成代码

template转换成render函数的结果

```js
<div style="color:red">hello {{name}} <span></span></div>
render(){
   return _c('div',{style:{color:'red'}},_v('hello'+_s(name)),_c('span',undefined,''))
}
```

实现代码生成

```js
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g //匹配花括号 {{  }} 捕获花括号里面的内容

// 处理attrs属性
function genProps(attrs) {
  let str = ''
  for (let i = 0; i < attrs.length; i++) {
    let attr = attrs[i]
    // 特殊属性 style
    if (attr.name === 'style') {
      const obj = {}
      attr.value.split(';').reduce((memo, current) => {
        const [key, value] = current.split(':')
        memo[key] = value
        return memo
      }, obj)
      attr.value = obj
    }
    str += `${attr.name}:${JSON.stringify(attr.value)},`
  }
  return `{${str.slice(0, -1)}}`
}

function gen(node) {
  if (node.type === 1) {
    return generate(node)
  } else {
    const text = node.text
    if (!defaultTagRE.test(text)) {
      return `_v(${JSON.stringify(text)})` // 不带表达式
    } else {
      const tokens = []
      let match
      // exec 遇到全局匹配会有 lastIndex 问题，每次匹配谦虚要将lastIndex置为0
      let startIndex = (defaultTagRE.lastIndex = 0)
      while ((match = defaultTagRE.exec(text))) {
        const endIndex = match.index // 匹配到的索引 abc ｛｛aa｝｝ {{bb}} cd
        if (endIndex > startIndex) {
          tokens.push(JSON.stringify(text.slice(startIndex, endIndex)))
        }
        tokens.push(`_s(${match[1].trim()})`)
        startIndex = endIndex + match[0].length
      }
      if (startIndex < text.length) {
        // 将最后的尾巴也丢进去
        tokens.push(JSON.stringify(text.slice(startIndex)))
      }
      return `_v(${tokens.join('+')})` // 组合成最终的语法
    }
  }
}

// 生成子节点，递归创建
function genChildren(el) {
  const children = el.children
  if (children) {
    return `${children.map((child) => gen(child)).join(',')}`
  }
}

export function generate(el) {
  // 字符串拼接
  const children = genChildren(el)
  let code = `_c('${el.tag}',${
    el.attrs.length ? `${genProps(el.attrs)}` : 'undefined'
  }${children ? `,${children}` : ''})` // _c('div', {className: 'xxx'}, _v('hello world'))
  return code
}
```

#### 4.生成render函数

```js
// 将模板变成render函数，通过with+new Function的方式让字符串变成js语法来执行
export function compileToFunctions(template) {
  const ast = parse(template)

  // 通过ast语法树转换成render函数
  const code = generate(ast)

  // 使用with改变作用域为this
  const renderFn = new Function(`with(this) {return ${code}}`)
  return renderFn
}
```

## 五.依赖收集

每个属性都要有一个`dep`,每个`dep`中存放着`watcher`,同一个`watcher`会被多个`dep`所记录。

#### 1. 在渲染是存储watcher

```js
get() {
  // debugger;
  Dep.target = this; // 静态属性就是只有一份
  this.getter(); // 会去vm上取值  vm._update(vm._render) 取name 和age
  Dep.target = null; // 渲染完毕后就清空
}
```

```js
let id = 0
class Dep {
  constructor() {
    this.id = id++ // 属性的dep要收集watcher
    this.subs = [] // 这里存放着当前属性对应的watcher有哪些
  }
  depend() {
    // 这里我们不希望放重复的watcher，而且刚才只是一个单向的关系 dep -> watcher
    // watcher 记录dep
    // this.subs.push(Dep.target);

    Dep.target.addDep(this) // 让watcher记住dep

    // dep 和 watcher是一个多对多的关系 （一个属性可以在多个组件中使用 dep -> 多个watcher）
    // 一个组件中由多个属性组成 （一个watcher 对应多个dep）
  }
  addSub(watcher) {
    this.subs.push(watcher)
  }
  notify() {
    this.subs.forEach((watcher) => watcher.update()) // 告诉watcher要更新了
  }
}
Dep.target = null

export default Dep
```

#### 2. 对象依赖收集

```js
// 性能不好的原因, 所有的属性都被重新定义了一遍
// 一上来需要将对象深度代理, 性能差
// 闭包 属性劫持
function defineReactive(data, key, value) {
  const childOb = observe(value) // 递归代理属性, childOb就是当前的实例
  // 属性会全部被重写添加了get和set
  let dep = new Dep() // 每一个属性都有一个dep
  Object.defineProperty(data, key, {
    // 取值的时候 会执行get
    get() {
      if (Dep.target) {
        dep.depend() // 让这个属性的收集器记住当前的watcher
        if (childOb) {
          childOb.dep.depend() // 让数组和对象本身也实现依赖收集
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    // 修改的时候 会执行set
    set(newValue) {
      // 修改的时候 会执行set
      if (newValue === value) return
      observe(newValue)
      value = newValue
      dep.notify() // 通知更新
    }
  })
}
```

- Dep实现

  ```js
  let id = 0
  class Dep {
    constructor() {
      this.id = id++ // 属性的dep要收集watcher
      this.subs = [] // 这里存放着当前属性对应的watcher有哪些
    }
    depend() {
      // 这里我们不希望放重复的watcher，而且刚才只是一个单向的关系 dep -> watcher
      // watcher 记录dep
      // this.subs.push(Dep.target);

      Dep.target.addDep(this) // 让watcher记住dep

      // dep 和 watcher是一个多对多的关系 （一个属性可以在多个组件中使用 dep -> 多个watcher）
      // 一个组件中由多个属性组成 （一个watcher 对应多个dep）
    }
    addSub(watcher) {
      this.subs.push(watcher)
    }
    notify() {
      this.subs.forEach((watcher) => watcher.update()) // 告诉watcher要更新了
    }
  }
  Dep.target = null

  export default Dep
  ```

- watcher

  ```js
  import Dep from './dep'

  let id = 0

  // 1）当我们创建渲染watcher的时候我们会把当前的渲染watcher放到Dep.target上
  // 2) 调用_render() 会取值 走到get上
  // 每个属性有一个dep（属性就是被观察者）,watcher就是观察者（属性变化了会通知观察者来更新） -> 观察者模式
  class Watcher {
    // 不同组件有不同的watcher 目前只有一个渲染根实例的
    constructor(vm, fn, options) {
      this.id = id++
      this.renderWatcher = options // 是一个渲染watcher
      this.getter = fn // getter意味着调用这个函数可以发生取值操作
      this.deps = [] // 后续我们实现计算属性，和一些清理工作需要用到
      this.depsId = new Set()
      this.get()
    }
    addDep(dep) {
      // 一个组件 对应着多个属性 重复的属性也不用记录
      let id = dep.id
      if (!this.depsId.has(id)) {
        this.deps.push(dep)
        this.depsId.add(id)
        dep.addSub(this) // watcher已经记住了dep了而且去重了，此时让dep也记住watcher
      }
    }
    get() {
      // debugger;
      Dep.target = this // 静态属性就是只有一份
      this.getter() // 会去vm上取值  vm._update(vm._render) 取name 和age
      Dep.target = null // 渲染完毕后就清空
    }
    update() {
      console.log('update')
      queueWatcher(this) // 把当前的watcher 暂存起来
      // this.get(); // 重新渲染
    }
    run() {
      this.get() // 渲染的时候用的是最新的vm来渲染的
    }
  }

  export default Watcher
  ```

#### 3. 数组依赖收集

- 递归收集数组依赖

  ```js
  function defineReactive(data, key, value) {
    const childOb = observe(value); // 递归代理属性, childOb就是当前的实例
    // 属性会全部被重写添加了get和set
    let dep = new Dep(); // 每一个属性都有一个dep
    Object.defineProperty(data, key, {
      // 取值的时候 会执行get
      get() {
        if (Dep.target) {
          dep.depend(); // 让这个属性的收集器记住当前的watcher
          if (childOb) {
            childOb.dep.depend(); // 让数组和对象本身也实现依赖收集
            if (Array.isArray(value)) {
              dependArray(value);
            }
          }
        }
        return value;
      },
      // ...
  }

  // 深层次嵌套会递归, 递归多了性能差, 不粗案子属性监控不到, 存在的属性要重写方法
  function dependArray(value) {
    for (let i = 0; i < value.length; i++) {
      let current = value[i];
      current.__ob__ && current.__ob__.dep.depend();
      if (Array.isArray(current)) {
        dependArray(current);
      }
    }
  }
  ```

  ```js
  // 获取数组原型
  let oldArrayPrototype = Array.prototype
  // arrayPrototype.__proto__ = Array.prototype
  let arrayPrototype = Object.create(oldArrayPrototype)
  // 数组变异方法
  let methods = ['push', 'pop', 'shift', 'unshift', 'splice', 'reverse', 'sort']
  methods.forEach((method) => {
    // 用户调用push方法会先自己重写的方法, 之后调用数组原来的方法
    arrayPrototype[method] = function (...args) {
      // 需要对新增的数据再次进行劫持
      let inserted
      const ob = this.__ob__
      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args // 数组
          break
        case 'splice': // arr.splice(1, 1, xxx)
          inserted = args.slice(2)
          break
        default:
          break
      }
      if (inserted) {
        // 对新增的数据再次进行观测
        ob.observeArray(inserted)
      }
      const result = oldArrayPrototype[method].call(this, ...args)
      ob.dep.notify() // 数据变化了, 通知对应的watcher实现更新逻辑
      return result
    }
  })

  export default arrayPrototype
  ```

## 六.Vue异步更新之nextTick

#### 1. 实现队列机制

```js
update() {
  console.log('update');
  queueWatcher(this); // 把当前的watcher 暂存起来
  // this.get(); // 重新渲染
}
```

- scheduler

  ```js
  // watcher.js
  let queue = []
  let has = {}
  let pending = false // 防抖
  function flushSchedulerQueue() {
    let flushQueue = queue.slice(0)
    queue = []
    has = {}
    pending = false
    flushQueue.forEach((q) => q.run()) // 在刷新的过程中可能还有新的watcher，重新放到queue中
  }
  function queueWatcher(watcher) {
    const id = watcher.id
    if (!has[id]) {
      queue.push(watcher)
      has[id] = true
      // 不管我们的update执行多少次 ，但是最终只执行一轮刷新操作
      if (!pending) {
        nextTick(flushSchedulerQueue, 0)
        pending = true
      }
    }
  }
  ```

#### 2. nextTick实现原理

```js
// watcher.js
let callbacks = []
let waiting = false
function flushCallbacks() {
  let cbs = callbacks.slice(0)
  waiting = false
  callbacks = []
  cbs.forEach((cb) => cb()) // 按照顺序依次执行
}
// nextTick 没有直接使用某个api 而是采用优雅降级的方式
// 内部先采用的是promise（ie不兼容）MutationObserver(h5的api) 可以考虑ie专享的 setImmediate setTimeout
let timerFunc
if (Promise) {
  timerFunc = () => {
    Promise.resolve().then(flushCallbacks)
  }
} else if (MutationObserver) {
  let observer = new MutationObserver(flushCallbacks) // 这里传入的回调是异步执行的
  let textNode = document.createTextNode(1)
  observer.observe(textNode, {
    characterData: true
  })
  timerFunc = () => {
    textNode.textContent = 2
  }
} else if (setImmediate) {
  timerFunc = () => {
    setImmediate(flushCallbacks)
  }
} else {
  timerFunc = () => {
    setTimeout(flushCallbacks)
  }
}
// 异步任务分为两种,宏任务/微任务
// 宏任务 setTimeout setImmediate(IE下支持性能优于setTimeout)
// 微任务 promise.then mutationObserver
// Vue在更新的时候希望尽快的更新页面 Promise.then MutationObserver setImmediate setImmediate
// Vue3不再考虑兼容性问题了, 所以后续Vue3中直接使用Promise.then
export function nextTick(cb) {
  // 先内部还是先用户的？
  callbacks.push(cb) // 维护nextTick中的cakllback方法
  console.log(callbacks)
  if (!waiting) {
    timerFunc()
    // Promise.resolve().then(flushCallbacks);
    waiting = true
  }
}
```

## 七.Vue中Diff算法

```js
// index.js
// ------------- 为了方便观察前后的虚拟节点-- 测试的-----------------
let vm0 = new Vue({
  data: {
    name: 'pf',
    age: 22
  }
})
let render0 = compileToFunctions(
  `<div class="a" style="color: lightblue;" b="1"><span>{{name}}</span><span>{{age}}</span></div>`
)
let oldVnode = render0.call(vm0)
let ele = createElm(oldVnode)
document.body.appendChild(ele)

let vm = new Vue({
  data: {
    message: 'hello world'
  }
})
let render = compileToFunctions(
  `<div class="b" style="color: red" c=33><span>{{message}}</span></div>`
)
let newVnode = render.call(vm)

let render1 = compileToFunctions(`<ul  a="1" style="color:blue">
    <li key="A">a</li>
    <li key="B">b</li>
    <li key="C">c</li>
    <li key="D">d</li>
</ul>`)
let vm1 = new Vue({ data: { name: 'pf' } })
let prevVnode = render1.call(vm1)
let el = createElm(prevVnode)
document.body.appendChild(el)

let render2 = compileToFunctions(`<ul  a="1"  style="color:red;">
    <li key="C">c</li>
    <li key="A">a</li>
    <li key="D">d</li>
    <li key="E">e</li>
    <li key="Q">q</li>
</ul>`)
let vm2 = new Vue({ data: { name: 'zf' } })
let nextVnode = render2.call(vm2)

// 直接将新的节点替换掉了老的，不是直接替换 而是比较两个人的区别之后在替换 diff算法
// diff算法是一个平级比较的过程 父亲和父亲比对，儿子和儿子比对
// 主要比对标签名和key来判断是不是同一个元素, 如果标签和key都一样说明两个元素使同一个元素
setTimeout(() => {
  // patch(oldVnode, newVnode);

  patch(prevVnode, nextVnode)
}, 2000)
```

> 我们想掌握vue中的diff算法就先构建出两个虚拟`dom` 之后做patch

![vuediff](https://p.ipic.vip/797fjt.jpg)

> diff算法：采用双指针的方式比较两个节点
>
> 1. 比较开头节点
> 2. 比较结尾节点
> 3. 比较尾头节点
> 4. 比较头尾节点
> 5. 乱序比对：根据老的列表做一个映射关系 用新的去找 找到则移动 找不到则添加 最后多余的删除

### 1.基本Diff算法

#### 比对标签

```js
// case1: 前后两个虚拟节点不是相同节点 直接替换掉即可
if (!isSameVnode(oldVnode, vnode)) {
  return oldVnode.el.parentNode.replaceChild(createElm(vnode), oldVnode.el)
}
```

> 在diff过程中会先比较标签是否一致，如果标签不一致用新的标签替换掉老的标签

```js
// case2: 两个元素虚拟节点都是文本的情况下 用新文本替换到老文本
if (!oldVnode.tag) {
  if (oldVnode.text !== vnode.text) {
    return (el.textContent = vnode.text)
  }
}
```

> 如果标签一致，有可能都是文本节点，那就比较文本的内容即可

#### 比对属性

```js
// case3: 两个都是标签 比对标签属性
patchProps(el, oldVnode.data, vnode.data)

function patchProps(el, oldProps = {}, props = {}) {
  // 老的属性中有 新的没有 要删除老的
  const oldStyles = oldProps.style || {}
  const newStyles = props.style || {}
  for (let key in oldStyles) {
    // 老的样式有 新的没有则删除
    if (!newStyles[key]) {
      el.style[key] = ''
    }
  }
  for (let key in oldProps) {
    // 老的属性有 新的没有删除属性
    if (!props[key]) {
      el.removeAttribute(key)
    }
  }
  for (let key in props) {
    // 用新的覆盖老的
    if (key === 'style') {
      for (let styleName in props.style) {
        el.style[styleName] = props.style[styleName]
      }
    } else {
      el.setAttribute(key, props[key])
    }
  }
}
```

> 当标签相同时，我们可以复用老的标签元素，并且进行属性的比对

#### 比对子元素

```js
// case4: 比较儿子节点 一方有儿子 一方没儿子 两方都有儿子
const oldChildren = oldVnode.children || []
const newChildren = vnode.children || []
if (oldChildren.length > 0 && newChildren.length > 0) {
  // 完整diff算法 比对两个儿子 一层层比较, 不涉及夸级比较
  updateChildren(el, oldChildren, newChildren)
} else if (newChildren.length > 0) {
  // 没有老的 有新的
  mountChildren(el, newChildren)
} else if (oldChildren.length > 0) {
  // 新的没有 老的有 直接删除
  el.innerHTML = '' // 可以循环删除
}

function mountChildren(el, newChildren) {
  for (let i = 0; i < newChildren.length; i++) {
    let child = newChildren[i]
    el.appendChild(createElm(child))
  }
}
```

> 这里要判断新老节点儿子的状况

### 2.Diff优化策略

#### 在开头和结尾新增元素

```js
function isSameVnode(n1, n2) {
  // 如果两个人的标签和key 一样我认为是同一个节点 虚拟节点一样我就可以复用真实节点了
  return n1.tag === n2.tag && n1.key === n2.key
}
// Vue2.0中采用双指针的方式比较两个节点
// 操作列表经常会有push shift pop unshift reverse sort这些方法(针对镇邪情况做一些优化)
function updateChildren(el, oldChildren, newChildren) {
  // Vue中创建了4个指针 分别指向老孩子和新孩子的头尾
  // 分别一次进行比较有一方先比较完毕就结束
  let oldStartIndex = 0
  let newStartIndex = 0
  let oldEndIndex = oldChildren.length - 1
  let newEndIndex = newChildren.length - 1

  let oldStartVnode = oldChildren[0]
  let newStartVnode = newChildren[0]
  let oldEndVnode = oldChildren[oldEndIndex]
  let newEndVnode = newChildren[newEndIndex]

  // 有任何一个不满足则停止 || 有一个为true就继续走
  // 双方有一方的头指针 大于尾部指针则停止循环
  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    if (isSameVnode(oldStartVnode, newStartVnode)) {
      // 说明两个是同一个元素 要比较属性和它的儿子
      patchVnode(oldStartVnode, newStartVnode)
      oldStartVnode = oldChildren[++oldStartIndex]
      newStartVnode = newChildren[++newStartIndex]
      // 比较开头节点
    } else if (isSameVnode(oldEndVnode, newEndVnode)) {
      // 说明两个是同一个元素 要比较属性和它的儿子
      patchVnode(oldEndVnode, newEndVnode)
      oldEndVnode = oldChildren[--oldEndIndex]
      newEndVnode = newChildren[--newEndIndex]
      // 比较结尾节点
    }
  }
  if (newStartIndex <= newEndIndex) {
    // 新的多了 多余的就插入进去
    for (let i = newStartIndex; i <= newEndIndex; i++) {
      const childEl = createElm(newChildren[i])
      // 这里可能向后追加 还可能是向前追加
      let anchor = newChildren[newEndIndex + 1]
        ? newChildren[newEndIndex + 1].el
        : null // 获取下一个元素
      el.insertBefore(childEl, anchor) // anchor为null的时候则会认为是appendChild
    }
  }
}
```

#### 头移尾、尾头

```js
else if (isSameVnode(oldEndVnode, newEndVnode)) {
  // 说明两个是同一个元素 要比较属性和它的儿子
  patchVnode(oldEndVnode, newEndVnode);
  oldEndVnode = oldChildren[--oldEndIndex];
  newEndVnode = newChildren[--newEndIndex];
  // 比较结尾节点
} else if (isSameVnode(oldEndVnode, newStartVnode)) {
  patchVnode(oldEndVnode, newStartVnode);
  // insertBefore具备移动性 会将原来的元素移动走
  el.insertBefore(oldEndVnode.el, oldStartVnode.el); // 将老的尾巴移动到老的前面去
  oldEndVnode = oldChildren[--oldEndIndex];
  newStartVnode = newChildren[++newStartIndex];
  // 比较尾头节点
}
```

> 操作列表经常会有push shift pop unshift reverse sort这些方法(针对镇邪情况做一些优化)。以上四个条件对常见的dom操作进行了优化

#### 暴力比对

```js
function makeIndexByKey(children) {
  const map = {}
  children.forEach((child, index) => {
    map[child.key] = index
  })
  return map
}
const map = makeIndexByKey(oldChildren)
```

> 对所有的孩子元素进行编号

```js
// 根据老的列表做一个映射关系 用新的去找 找到则移动 找不到则添加 最后多余的删除
// 给动态列表添加key的时候 要尽量避免使用索引 因为索引前后都是从0开始 可能会发生错误复用
const moveIndex = map[newStartVnode.key] // 如果拿到则说明是要移动的索引
if (moveIndex !== undefined) {
  const moveVnode = oldChildren[moveIndex] // 找到对应的虚拟节点 复用
  el.insertBefore(moveVnode.el, oldStartVnode.el)
  oldChildren[moveIndex] = undefined // 表示这个节点已经移动走了
  patchVnode(moveVnode, newStartVnode) // 比对属性和子节点
} else {
  el.insertBefore(createElm(newStartVnode), oldStartVnode.el)
}
newStartVnode = newChildren[++newStartIndex]
// 乱序比对
```

### 3. 更新操作

```js
Vue.prototype._update = function (vnode) {
  // 将虚拟节点变成真实节点
  // 将vnode渲染到el元素中
  const vm = this
  const prevVnode = vm._vnode // 上一次的vNode
  if (!prevVnode) {
    vm.$el = patch(vm.$el, vnode) // 可以初始化渲染，后续更新也走这个patch方法
  } else {
    vm.$el = patch(prevVnode, vnode)
  }
  vm._vnode = vnode // 渲染完毕后重新更新vnode
}
```

## 八.生命周期合并

### 1.Mixin原理

```js
// gloablAPI.js
export default function initGlobalAPI(Vue) {
  Vue.options = {}
  Vue.mixin = function (options) {
    this.options = mergeOptions(this.options, options)
    return this
  }
}
```

### 2.合并生命周期

```js
// gloablAPI.js
LIFECYCLE.forEach((hook) => {
  strats[hook] = function (p, c) {
    if (c) {
      // 如果儿子有 父亲有 让父亲和儿子拼在一起
      if (p) {
        return p.concat(c) // 最终八生命周期都合并在一起了
      } else {
        return [c] // 儿子有父亲没有 则将儿子包装秤数组
      }
    } else {
      return p // 如果儿子没有则用父亲即可
    }
  }
})

export function mergeOptions(parent, child) {
  const options = {}
  for (let key in parent) {
    // 循环老的
    mergeField(key)
  }
  for (let key in child) {
    if (!parent.hasOwnProperty(key)) {
      mergeField(key)
    }
  }
  function mergeField(key) {
    // 策略模式 减少if-else
    if (strats[key]) {
      options[key] = strats[key](parent[key], child[key])
    } else {
      // 如果不在测量中则以儿子为主
      options[key] = child[key] || parent[key] // 优先采用儿子 再采用父亲
    }
  }
  return options
}
```

### 3.调用生命周期

```js
// lifecycle.js
export function callHook(vm, hook) {
  const handlers = vm.$options[hook]
  if (handlers) {
    for (let i = 0; i < handlers.length; i++) {
      handlers[i].call(vm)
    }
  }
}
```

### 4.初始化流程中调用生命周期

```js
// init.js
Vue.prototype._init = function (options) {
  const vm = this
  // vue中会判断如果是$开头的属性不会被变成响应式数据
  this.$options = mergeOptions(vm.constructor.options, options) // 所有后续的扩展方法都有一个$options选项可以获取用户的所有选项

  // 对于实例的数据源 props data methods computed watch
  // prop data
  callHook(vm, 'beforeCreate')
  initState(vm)
  callHook(vm, 'created')

  // 状态初始化完毕后需要进行页面挂载
  if (vm.$options.el) {
    // el属性和直接调用$mount是一样的
    vm.$mount(vm.$options.el)
  }
}
```

## 九.Watch & Computed

### 1.Watch实现原理

```js
const vm = new Vue({
  el: '#app',
  data: {
    name: 'pf',
    a: { a: 1 },
    arr: ['1', '2', '3'],
    age: 22,
    address: '广州'
  },
  methods: {
    handler(newVal, oldVal) {
      console.log(newVal, oldVal)
    }
  },
  watch: {
    name(newVal, oldVal) {
      console.log(newVal, oldVal)
    },
    a(newVal, oldVal) {
      console.log(newVal, oldVal)
    },
    arr: [
      (newVal, oldVal) => {
        console.log(newVal, oldVal)
      }
    ],
    age: [
      'handler',
      {
        handler: (newVal, oldVal) => {
          console.log(newVal, oldVal)
        },
        immediate: true
      }
    ]
  }
})
vm.$watch('a.a', (newVal, oldVal) => {
  console.log(newVal, oldVal)
})
setTimeout(() => {
  vm.a.a = 22
  vm.name.a = 'ricardopang'
  vm.a = { b: 2 }
  vm.arr.push('123')
  vm.age = 33
}, 1000)
```

> 选项中如果有watch则对watch进行初始化

```js
// state.js
export function initState(vm) {
  // ...
  if (options.watch) {
    initWatch(vm)
  }
}
```

#### 选项中如果有watch则对watch进行初始化

```js
// state.js
function initWatch(vm) {
  const watch = vm.$options.watch
  for (let key in watch) {
    const handler = watch[key] // 字符串 数组 函数
    if (Array.isArray(handler)) {
      for (let i = 0; i < handler.length; i++) {
        createWatch(vm, key, handler[i])
      }
    } else {
      // 对当前属性进行创建watcher 存放的回调是handler 取数据是从vm上获取
      createWatch(vm, key, handler)
    }
  }
}

function createWatch(vm, key, handler) {
  // 判断如果handler是一个字符串 可以采用实例上的方法
  let options
  if (typeof handler === 'object' && handler !== null) {
    options = handler
    handler = handler.handler
  }
  if (typeof handler === 'string') {
    handler = vm[handler]
  }
  return vm.$watch(key, handler, options)
}
```

> 这里涉及了watch的三种写法,1.值是对象、2.值是数组、3.值是字符串 （如果是对象可以传入一些watch参数），最终会调用vm.$watch来实现

#### 扩展Vue原型上的方法，都通过mixin的方式来进行添加

```js
// state.js
export function stateMixin(Vue) {
  Vue.prototype.$nextTick = nextTick
  Vue.prototype.$watch = function (exprOrFn, cb, options = {}) {
    options.user = true // 标记为用户watcher
    const watcher = new Watcher(this, exprOrFn, options, cb)
    if (options.immediate) {
      cb.call(this, watcher.value)
    }
  }
}
```

```js
// observer/watcher.js
class Watcher {
  // 不同组件有不同的watcher   目前只有一个 渲染根实例的
  constructor(vm, exprOrFn, options, cb) {
    // ...
    // 如果给的是一个字符串 需要去通过字符串取值
    if (typeof exprOrFn === 'string') {
      this.getter = function () {
        const path = exprOrFn.split('.') // [a.b]
        return path.reduce((vm, current) => {
          vm = vm[current]
          return vm
        }, vm)
      }
    } else {
      this.getter = exprOrFn // getter意味着调用这个函数可以发生取值操作
    }

    // ...
    this.cb = cb
    this.vm = vm
    this.user = options.user // 标识是否是用户自己的watcher

    this.value = this.get() // 实现页面渲染
  }
  addDep(dep) {
    // 一个组件 对应着多个属性 重复的属性也不用记录
    let id = dep.id
    if (!this.depsId.has(id)) {
      this.deps.push(dep)
      this.depsId.add(id)
      dep.addSub(this) // watcher已经记住了dep了而且去重了，此时让dep也记住watcher
    }
  }
  evaluate() {
    this.value = this.get() // 获取到用户函数的返回值 并且还要标识为脏
    this.dirty = false
  }
  get() {
    pushTarget(this) // 静态属性就是只有一份
    let value = this.getter.call(this.vm) // 会去vm上取值  vm._update(vm._render) 取name 和age
    popTarget() // 渲染完毕后就清空
    return value
  }
  run() {
    let oldValue = this.value
    let newValue = this.get() // 渲染的时候用的是最新的vm来渲染的
    this.value = newValue
    if (this.user && this.cb) {
      this.cb.call(this.vm, newValue, oldValue)
    }
  }
}
```

> 还是借助vue响应式原理，默认在取值时将watcher存放到对应属性的dep中，当数据发生变化时通知对应的watcher重新执行

### 2.Computed实现原理

```js
// state.js
if (options.computed) {
  initComputed(vm)
}

function initComputed(vm) {
  const computed = vm.$options.computed
  const watchers = (vm._computedWatchers = {}) // 将计算属性watcher保存到vm上
  for (let key in computed) {
    let userDef = computed[key]
    // 监控计算属性中get的变化
    const fn = typeof userDef === 'function' ? userDef : userDef.get
    // 如果直接new Watcher 默认就会执行fn 将属性和watcher对应起来
    watchers[key] = new Watcher(vm, fn, { lazy: true })
    defineComputed(vm, key, userDef)
  }
}
```

> 每个计算属性也都是一个`watcher`，计算属性需要表示lazy:true，这样在初始化watcher时不会立即调用计算属性方法

```js
// watcher.js
class Watcher {
  constructor(vm, exprOrFn, callback, options) {
    this.vm = vm
    this.dirty = this.lazy
    // ...
    this.value = this.lazy ? undefined : this.get() // 调用get方法 会让渲染watcher执行
  }
}
```

> 默认计算属性需要保存一个dirty属性，用来实现缓存功能

```js
// state.js
function defineComputed(target, key, userDef) {
  const setter = userDef.set || (() => {})
  // 每次取值都会执行 可以通过实例拿到对应的属性
  Object.defineProperty(target, key, {
    get: createComputedGetter(key),
    set: setter
  })
}
```

创建缓存getter

```js
// state.js

// 计算属性根本不会收集依赖 只会让自己的依赖属性去收集依赖
function createComputedGetter(key) {
  return function () {
    const watcher = this._computedWatchers[key] // 获取到对应属性的watcher
    if (watcher.dirty) {
      // 如果是脏的就去执行 用户传入的函数
      watcher.evaluate() // 求值后 dirty变为了false 下次就不求值了
    }
    // 在求值的过程中 stack = [渲染watcher, 计算属性watcher]
    // 在evaluate执行完毕后 stack = [渲染watcher] => Dep.target = 渲染watcher
    if (Dep.target) {
      // 让计算属性watcher对应的两个dep记录watcher即可
      // 计算属性出栈后 还要渲染watcher 应该让计算属性watcher里面的属性 也去收集上一层watcher
      watcher.depend()
    }
    return watcher.value // 最后返回的是watcher上的值
  }
}
```

`watch.evaluate`

```js
// watcher.js
evaluate() {
  this.value = this.get(); // 获取到用户函数的返回值 并且还要标识为脏
  this.dirty = false;
}
update() {
  if (this.lazy) {
    // 如果是计算属性 依赖的值变化了 就标识计算属性是脏值了
    this.dirty = true;
  } else {
    queueWatcher(this); // 把当前的watcher 暂存起来
    // this.get(); // 重新渲染
  }
}
```

> 当依赖的属性变化时，会通知watcher调用update方法，此时我们将dirty置换为true。这样再取值时会重新进行计算

```js
// state.js
if (watcher.dirty) {
  // 如果是脏的就去执行 用户传入的函数
  watcher.evaluate() // 求值后 dirty变为了false 下次就不求值了
}
// 在求值的过程中 stack = [渲染watcher, 计算属性watcher]
// 在evaluate执行完毕后 stack = [渲染watcher] => Dep.target = 渲染watcher
if (Dep.target) {
  // 让计算属性watcher对应的两个dep记录watcher即可
  // 计算属性出栈后 还要渲染watcher 应该让计算属性watcher里面的属性 也去收集上一层watcher
  watcher.depend()
}
return watcher.value // 最后返回的是watcher上的值
```

```js
// watcher.js
depend() {
  // watcher的depend 就是让watcher中dep去depend
  let i = this.deps.length;
  while (i--) {
    // 让dep记住渲染watcher
    this.deps[i].depend(); // 让计算属性watcher 也收集渲染watcher
  }
}
```

## 十.Vue组件原理

### 1.全局组件的解析

```js
// Vue.component内部会调用一个api Vue.extend() 产生一个组件的子类
Vue.component('outer-button', {
  // Vue.options.components = {}
  name: 'xxx',
  template: '<button>全局button</button>'
}) // new Sub().$mount('某个元素上') 每个组件在使用的时候都是通过类来new

Vue.component(
  'pf-button',
  Vue.extend({
    template: '<button>PF按钮</button>'
  })
)

// 函数式组件没有类 就是每次调用函数返回一个虚拟节点 所以函数式组件是没有watcher的
const vm = new Vue({
  el: '#app',
  // 局部组件(定义后只能在当前组件中使用)
  components: {
    'my-button': {
      beforeCreate() {
        console.log('beforeCreate 1')
      },
      components: {
        'my-ll': {
          template: '<div>我很帅</div>',
          beforeCreate() {
            console.log('beforeCreate 2')
          }
        }
      },
      template: '<button>我的按钮1111 <my-ll></my-ll></button>'
    }
  }
})
```

> 我们可以通过`Vue.component`注册全局组件，之后可以在模板中进行使用

#### 1.1.Vue.component方法

```js
// index.js
initGlobalAPI(Vue)
```

> `Vue.component`内部会调用`Vue.extend`方法，将定义挂载到`Vue.options.components`上。这也说明所有的全局组件最终都会挂载到这个变量上

```js
// globalApi.js
export default function initGlobalAPI(Vue) {
  Vue.options = {}
  Vue.options._base = Vue
  Vue.mixin = function (options) {
    this.options = mergeOptions(this.options, options)
    return this
  }
  Vue.options.components = {} // 放的是全局组件 全局的指令 Vue.otpions.directives
  Vue.component = function (id, definition) {
    // 如果definition已经是一个函数了 说明用户自己调用了Vue.extend
    definition =
      typeof definition === 'function' ? definition : Vue.extend(definition)
    Vue.options.components[id] = definition
  }
}
```

#### 1.2.Vue.extend方法

```js
// 组件核心方法 可以手动创造组件进行挂载
Vue.extend = function (options) {
  // 就是实现根据用户的参数 返回一个构造而已
  function Sub(options = {}) {
    // 最终使用一个组件 就是new一个实例
    this._init(options) // 就是默认对子类进行初始化操作
  }
  // 子类继承父类原型方法
  Sub.prototype = Object.create(Vue.prototype) // Sub.prototype.__proto__ === Vue.prototype
  Sub.prototype.constructor = Sub

  // 希望将用户传递的参数 和全局的Vue.options来合并
  Sub.options = mergeOptions(Vue.options, options) // 保存用户传递的选项
  return Sub
}
```

> `extend`方法就是创建出一个子类，继承于`Vue`,并返回这个类

#### 1.3.属性合并

```js
// globalAPI.js
function mergeField(key) {
  // 策略模式 减少if-else
  if (strats[key]) {
    options[key] = strats[key](parent[key], child[key])
  } else {
    // 如果不在测量中则以儿子为主
    options[key] = child[key] || parent[key] // 优先采用儿子 再采用父亲
  }
}
```

#### 1.4.初始化合并

```js
Sub.options = mergeOptions(Vue.options, options) // 保存用户传递的选项
```

### 2.组件的渲染

```js
// vdom/index.js
const isReservedTag = (tag) => {
  return ['a', 'div', 'p', 'button', 'ul', 'li', 'span'].includes(tag)
}

// 创建元素vnode 等于render函数里面的 h=>h(App)
export function createElement(vm, tag, data = {}, ...children) {
  // 需要判断tag是元素还是组件
  if (isReservedTag(tag)) {
    return vnode(vm, tag, data, children, data.key, undefined)
  } else {
    // 创造组件的虚拟节点 组件需要找到组件的模版去进行渲染
    const Ctor = vm.$options.components[tag] // 罪案构造函数
    // Ctor就是组件的定义 可能是一个Sub类 还有可能更是组件的obj选项
    return createComponentVnode(vm, tag, data, children, data.key, Ctor)
  }
}
```

> 在创建虚拟节点时我们要判断当前这个标签是否是组件，普通标签的虚拟节点和组件的虚拟节点有所不同

#### 2.1.创建组件虚拟节点

```js
// vdom/index.js
// 创建元素vnode 等于render函数里面的 h=>h(App)
export function createElement(vm, tag, data = {}, ...children) {
  // 需要判断tag是元素还是组件
  if (isReservedTag(tag)) {
    return vnode(vm, tag, data, children, data.key, undefined)
  } else {
    // 创造组件的虚拟节点 组件需要找到组件的模版去进行渲染
    const Ctor = vm.$options.components[tag] // 罪案构造函数
    // Ctor就是组件的定义 可能是一个Sub类 还有可能更是组件的obj选项
    return createComponentVnode(vm, tag, data, children, data.key, Ctor)
  }
}

const init = (vnode) => {
  // 组件的虚拟节点上有组件的实例 new Sub()._init()
  const child = (vnode.componentInstance = new vnode.componentOptions.Ctor({})) // 组件的children {} 放插槽属性
  child.$mount()
}

function createComponentVnode(vm, tag, key, data, children, Ctor) {
  if (typeof Ctor === 'object' && Ctor !== null) {
    Ctor = vm.$options._base.extend(Ctor) // 组件内部声明的components属性也会包装成类
  }
  data.hook = {
    // 稍后创造真实节点的时候 如果是组件则调用此init方法
    init
  }
  return vnode(vm, tag, data, undefined, key, undefined, { Ctor, children })
}
```

#### 2.2.创建组件的真实节点

```js
// // vdom/patch.js
export function patch(oldVnode, vnode) {
  if (!oldVnode) {
    // 这就是组件的挂载
    return createElm(vnode) // vm.$el 对应的就是组件渲染的结果了
  }
  // ...
}

// 调用组件初始化方法
function createComponent(vnode) {
  let i = vnode.data
  if ((i = i.hook) && (i = i.init)) {
    i(vnode) // 初始化组件 找到init方法
  }
  if (vnode.componentInstance) {
    return true // 说明是组件
  }
}

export function createElm(vnode) {
  const { tag, data, children, text } = vnode
  if (typeof tag === 'string') {
    // 元素
    if (createComponent(vnode)) {
      return vnode.componentInstance.$el
    }
    vnode.el = document.createElement(tag)
    patchProps(vnode.el, {}, data)
    children.forEach((child) => {
      vnode.el.appendChild(createElm(child)) // 递归渲染
    })
  } else {
    // 文本
    vnode.el = document.createTextNode(text)
  }
  return vnode.el
}
```

> 调用`init`方法,进行组件的初始化

```js
data.hook = {
  // 稍后创造真实节点的时候 如果是组件则调用此init方法
  init
}

const init = (vnode) => {
  // 组件的虚拟节点上有组件的实例 new Sub()._init()
  const child = (vnode.componentInstance = new vnode.componentOptions.Ctor({})) // 组件的children {} 放插槽属性
  child.$mount()
}
```

![Vue响应式原理 ](https://p.ipic.vip/rt16p0.bmp)

![Vue2.0源码](https://p.ipic.vip/1iq0ex.png)

[源码地址](https://github.com/RicardoPang/pf-vue-source)
