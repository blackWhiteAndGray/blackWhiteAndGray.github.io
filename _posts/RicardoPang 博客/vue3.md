---
title: 手写Vue3.0源码
description: 核心原理
---

## 一.Vue3响应式原理

### 1.1. 架构分析

##### Monorepo

- 管理项目代码的一种方式，指在一个项目仓库（repo）中管理多个模块/包（package）
- 优点
  - 一个仓库可维护多个模板，不用到处找仓库
  - 方便版本管理和依赖管理，模块之间的引用，调用方便
- 缺点
  - 仓库体积变大

##### 项目结构

- **`reactivity`**:响应式系统
- **`runtime-core`**:与平台无关的运行时核心 (可以创建针对特定平台的运行时 - 自定义渲染器)
- **`runtime-dom`**: 针对浏览器的运行时。包括`DOM API`，属性，事件处理等
- **`runtime-test`**:用于测试
- **`server-renderer`**:用于服务器端渲染
- **`compiler-core`**:与平台无关的编译器核心
- **`compiler-dom`**: 针对浏览器的编译模块
- **`compiler-ssr`**: 针对服务端渲染的编译模块
- **`compiler-sfc`**: 针对单文件解析
- **`size-check`**:用来测试代码体积
- **`template-explorer`**：用于调试编译器输出的开发工具
- **`shared`**：多个包之间共享的内容
- **`vue`**:完整版本,包括运行时和编译器

```bash
                            +---------------------+
                            |                     |
                            |  @vue/compiler-sfc  |
                            |                     |
                            +-----+--------+------+
                                  |        |
                                  v        v
               +---------------------+    +----------------------+
               |                     |    |                      |
     +-------->|  @vue/compiler-dom  +--->|  @vue/compiler-core  |
     |         |                     |    |                      |
+----+----+    +---------------------+    +----------------------+
|         |
|   vue   |
|         |
+----+----+   +---------------------+    +----------------------+    +-------------------+
    |         |                     |    |                      |    |                   |
    +-------->|  @vue/runtime-dom   +--->|  @vue/runtime-core   +--->|  @vue/reactivity  |
              |                     |    |                      |    |                   |
              +---------------------+    +----------------------+    +-------------------+
```

##### 安装依赖

```bash
npm install typescript rollup rollup-plugin-typescript2 @rollup/plugin-node-resolve @rollup/plugin-json execa -D
```

##### workspace配置

```bash
npm init -y && npx tsc --init
```

```js
// package.json
{
  "private": true,
  "workspaces": [
    "packages/*"
  ],
}
```

```bash
├── package.json # 配置运行命令
├── packages # N个repo
│   ├── reactivity
│   └── shared
├── rollup.config.js # rollup配置文件
├── scripts # 打包命令
│   ├── build.js
│   └── dev.js
└── tsconfig.json # ts配置文件，更改为esnext
```

配置模块名称及打包选项

```json
{
  "name": "@vue/reactivity",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "module": "dist/reactivity.esm-bundler.js",
  "buildOptions":{
    "name":"VueReactivity",
    "formats":[
      "cjs",
      "esm-bundler",
      "global"
    ]
  }
}
```

创建软链 `npm install`

### 1.2. 构建环境搭建

##### 对packages下模块进行打包

> scripts/build.js

```js
const fs = require('fs'); // node来解析packages文件夹
const execa = require('execa'); // 开启子进程 进行打包， 最终还是使用rollup来进行打包

const targets = fs.readdirSync('packages').filter((f) => {
  if (!fs.statSync(`packages/${f}`).isDirectory()) {
    return false;
  }
  return true;
});

// 对我们目标进行依次打包 ，并行打包
async function build(target) {
  // rollup  -c --environment TARGET:shated
  await execa('rollup', ['-c', '--environment', `TARGET:${target}`], {
    stdio: 'inherit',
  }); // 当子进程打包的信息共享给父进程
}

function runParallel(targets, iteratorFn) {
  // 并发去打包 每次打包都调用build方法
  const res = [];
  for (const item of targets) {
    const p = iteratorFn(item);
    res.push(p);
  }
  return Promise.all(res); // 存储打包时的promise 等待所有全部打包完毕后 调用成功
}

runParallel(targets, build);
```

##### rollup配置

> rollup.config.js

```js
// rollup的配置

import path from 'path';
import json from '@rollup/plugin-json';
import resolvePlugin from '@rollup/plugin-node-resolve';
import ts from 'rollup-plugin-typescript2';

// 根据环境变量中的target属性 获取对应模块中的 pakcage.json
const packagesDir = path.resolve(__dirname, 'packages'); // 找到packages

// packageDir 打包的基准目录
const packageDir = path.resolve(packagesDir, process.env.TARGET); // 找到要打包的某个包

// 永远针对的是某个模块
const resolve = (p) => path.resolve(packageDir, p);

const pkg = require(resolve('package.json'));
const name = path.basename(packageDir); // 取文件名

// 对打包类型 先做一个映射表，根据你提供的formats 来格式化需要打包的内容
const outputConfig = {
  // 自定义的
  'esm-bundler': {
    file: resolve(`dist/${name}.esm-bundler.js`),
    format: 'es',
  },
  cjs: {
    file: resolve(`dist/${name}.cjs.js`),
    format: 'cjs',
  },
  global: {
    file: resolve(`dist/${name}.global.js`),
    format: 'iife', // 立即执行函数
  },
};
const options = pkg.buildOptions; // 自己在package.json中定义的选项

function createConfig(format, output) {
  output.name = options.name; // 用于iife在window上挂载的属性
  output.sourcemap = true; // 生成sourcemap

  // 生成rollup配置
  return {
    input: resolve(`src/index.ts`), // 打包的入口
    output,
    plugins: [
      json(),
      ts({
        // ts插件 编译的时候用的文件时哪一个
        tsconfig: path.resolve(__dirname, 'tsconfig.json'),
      }),
      resolvePlugin(), // 解析第三方模块插件
    ],
  };
}
// rollup 最终需要到出配置
export default options.formats.map((format) =>
  createConfig(format, outputConfig[format])
);
```

开发环境打包

> scripts/dev.js

```js
const fs = require('fs');
const execa = require('execa'); // 开启子进程 进行打包， 最终还是使用rollup来进行打包

const target = 'reactivity';

// 对我们目标进行依次打包 ，并行打包

build(target);
async function build(target) {
  // rollup  -c --environment TARGET:shated
  await execa('rollup', ['-cw', '--environment', `TARGET:${target}`], {
    stdio: 'inherit',
  }); // 当子进程打包的信息共享给父进程
}
```

### 1.3.响应式API实现

```js
let { reactive, shallowReactive, readonly, shallowReadonly } =
    VueReactivity;
let state = shallowReadonly({ name: 'pf', age: { n: 12 } });
state.age.n = 100;
let school = {
  name: 'zf',
  age: 12,
  address: { num: 517 },
  arr: [1, 2, 3],
};
let obj1 = reactive(school);
obj1.arr.push(100);
```

> 针对不同的API创建不同的响应式对象

```js
import { isObject } from '@vue/shared';
import {
  mutableHandlers,
  shallowReactiveHandlers,
  readonlyHandlers,
  shallowReadonlyHandlers,
} from './baseHandlers';
export function reactive(target) {
  return createReactiveObject(target, false, mutableHandlers);
}
export function shallowReactive(target) {
  return createReactiveObject(target, false, shallowReactiveHandlers);
}

export function readonly(target) {
  return createReactiveObject(target, true, readonlyHandlers);
}

export function shallowReadonly(target) {
  return createReactiveObject(target, true, shallowReadonlyHandlers);
}

const reactiveMap = new WeakMap();
const readonlyMap = new WeakMap();
export function createReactiveObject(target, isReadonly, baseHandlers) {}
```

### 1.4.shared模块实现

```json
{
  "name": "@vue/shared",
  "version": "1.0.0",
  "main": "index.js",
  "module": "dist/shared.esm-bundler.js",
  "license": "MIT",
  "buildOptions":{
    "name":"VueShared",
    "formats":[
      "cjs",
      "esm-bundler"
    ]
  }
}
```

> 配置`tsconfig.json`识别引入第三方模块

```json
"paths": {
  "@vue/*":[
    "packages/*/src"
  ]
}
```

> 使用`npm install`将`shared` 模块注入到node_modules中

### 1.5.createReactiveObject实现

> Vue中采用proxy实现数据代理，核心就是拦截`get`方法和`set`方法，当获取值时收集effect函数，当修改值时触发对应的effect重新执行

```js
import { isObject } from '@vue/shared';
const reactiveMap = new WeakMap(); // 目的是添加缓存 会自动垃圾回收，不会造成内存泄漏， 存储的key只能是对象
const readonlyMap = new WeakMap();
export function createReactiveObject(target, isReadonly, baseHandlers) {
  // 如果目标不是对象 没法拦截了，reactive这个api只能拦截对象类型
  if (!isObject(target)) {
    return target;
  }
  // 如果某个对象已经被代理过了 就不要再次代理了  可能一个对象 被代理是深度 又被仅读代理了
  const proxyMap = isReadonly ? readonlyMap : reactiveMap;
  const existProxy = proxyMap.get(target);
  if (existProxy) {
    return existProxy; // 如果已经被代理了 直接返回即可
  }
  const proxy = new Proxy(target, baseHandlers);
  proxyMap.set(target, proxy); // 将要代理的对象 和对应代理结果缓存起来

  return proxy;
}
```

> baseHandlers实现

```js
import {
  isObject,
} from '@vue/shared/src';
import { reactive, readonly } from './reactive';

const get = createGetter();
const shallowGet = createGetter(false, true);
const readonlyGet = createGetter(true);
const showllowReadonlyGet = createGetter(true, true);
const set = createSetter();
const shallowSet = createSetter(true);
export const mutableHandlers = {
  get,
  set,
};
export const shallowReactiveHandlers = {
  get: shallowGet,
  set: shallowSet,
};

let readonlyObj = {
  set: (target, key) => {
    console.warn(`set on key ${key} falied`);
  },
};
export const readonlyHandlers = extend(
  {
    get: readonlyGet,
  },
  readonlyObj
);
export const shallowReadonlyHandlers = extend(
  {
    get: showllowReadonlyGet,
  },
  readonlyObj
);

// 是不是仅读的，仅读的属性set时会报异常
// 是不是深度的
function createGetter(isReadonly = false, shallow = false) {
  // 拦截获取功能
  return function get(target, key, receiver) {
    const res = Reflect.get(target, key, receiver); // target[key];
    if (!isReadonly) {
      // 收集依赖，等会数据变化后更新对应的视图
      console.log('执行effect时会取值', '收集effect');
    }
    if (shallow) {
      return res;
    }
    if (isObject(res)) {
      // vue2 是一上来就递归，vue3 是当取值时会进行代理 。 vue3的代理模式是懒代理
      return isReadonly ? readonly(res) : reactive(res);
    }
    return res;
  };
}
function createSetter(shallow = false) {
  return function set(target, key, value, receiver) {
    const result = Reflect.set(target, key, value, receiver); // target[key] = value
    return result;
  };
}
```

### 1.6.effect实现

> 实现响应式effect

```js
export function effect(fn, options: any = {}) {
  // 我需要让这个effect变成响应的effect，可以做到数据变化重新执行
  const effect = createReactiveEffect(fn, options);
  if (!options.lazy) {
    // 默认的effect会先执行
    effect(); // 响应式的effect默认会先执行一次
  }
  return effect;
}
let uid = 0;
let activeEffect; // 存储当前的effect
const effectStack = [];
function createReactiveEffect(fn, options) {
  const effect = function reactiveEffect() {
    if (!effectStack.includes(effect)) {
      // todo...
    }
  };
  effect.id = uid++; // 制作一个effect标识 用于区分effect
  effect._isEffect = true; // 用于标识这个是响应式effect
  effect.raw = fn; // 保留effect对应的原函数
  effect.options = options; // 在effect上保存用户的属性
  return effect;
}
```

> 利用栈型结构存储effect，保证依赖关系

```js
effect(()=>{ // effect1   [effect1]
  state.name -> effect1
  effect(()=>{ // effect2
    state.age -> effect2
  })
  state.address -> effect1
})
```

```js
const effect = function reactiveEffect() {
  if (!effectStack.includes(effect)) {
    // 保证effect没有加入到effectStack中
    try {
      effectStack.push(effect);
      activeEffect = effect;
      return fn(); // 函数执行时会取值  会执行get方法
    } finally {
      effectStack.pop();
      activeEffect = effectStack[effectStack.length - 1];
    }
  }
};
```

### 1.7.track依赖收集

```js
function createGetter(isReadonly = false, shallow = false) {
  // 拦截获取功能
  return function get(target, key, receiver) {
    // ...
    if (!isReadonly) {
      track(target, TrackOpTypes.GET, key);
    }
  }
}
```

```js
// 让某个对象中的属性 收集当前他对应的effect函数
const targetMap = new WeakMap();
export function track(target, type, key) {
  // 可以拿到当前的effect
  //  activeEffect 当前正在运行的effect
  if (activeEffect === undefined) {
    // 此属性不用收集依赖，因为没在effect中使用
    return;
  }
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }
  let dep = depsMap.get(key);
  if (!dep) {
    depsMap.set(key, (dep = new Set()));
  }
  if (!dep.has(activeEffect)) {
    dep.add(activeEffect);
  }
}
```

### 1.8.trigger触发更新

> 对新增属性和修改属性做分类

```js
function createSetter(shallow = false) {
  return function set(target, key, value, receiver) {
    const oldValue = target[key]; // 获取老的值
    // 数组且索引
    let hadKey =
      isArray(target) && isIntegerKey(key)
        ? Number(key) < target.length
        : hasOwn(target, key);
    const result = Reflect.set(target, key, value, receiver); // target[key] = value
    if (!hadKey) {
      // 新增
      trigger(target, TriggerOrTypes.ADD, key, value);
    } else if (hasChanged(oldValue, value)) {
      // 修改
      trigger(target, TriggerOrTypes.SET, key, value, oldValue);
    }
    return result;
  };
}
```

> 将需要触发的effect依次找到依次执行

```js
// 找属性对应的effect 让其执行 （数组、对象）
export function trigger(target, type, key?, newValue?, oldValue?) {
  // 如果这个属性没有收集过effect，那不需要做任何操作
  const depsMap = targetMap.get(target);
  if (!depsMap) return; // 只是改了属性 这个属性没有在effect中使用

  const effects = new Set(); // 这里对effect去重了
  const add = (effectsToAdd) => {
    // 如果同时有多个 依赖的effect是同一个 还用set做了一个过滤
    if (effectsToAdd) {
      effectsToAdd.forEach((effect) => effects.add(effect));
    }
  };
  // 我要将所有的 要执行的effect 全部存到一个新的集合中，最终一起执行

  // 1. 看修改的是不是数组的长度 因为改长度影响比较大 小于依赖收集的长度 要触发重新渲染
  // 2. 如果调用了push方法 或者其他新增数组的方法(必须能改变长度的方法) 也要触发更新
  if (key === 'length' && isArray(target)) {
    // 如果对应的长度 有依赖收集需要更新
    depsMap.forEach((dep, key) => {
      if (key === 'length' || key > newValue) {
        // 如果更改的长度 小于收集的索引，那么这个索引也需要触发effect重新执行
        add(dep);
      }
    });
  } else {
    // 可能是对象
    if (key !== undefined) {
      // 这里肯定是修改， 不能是新增
      add(depsMap.get(key)); // 如果是新增
    }
    // 如果修改数组中的 某一个索引 怎么办？
    switch (
      type // 如果添加了一个索引就触发长度的更新
    ) {
      case TriggerOrTypes.ADD:
        if (isArray(target) && isIntegerKey(key)) {
          add(depsMap.get('length'));
        }
    }
  }
  effects.forEach((effect: any) => effect());
}
```

### 1.9.实现Ref

> ref本质就是通过类的属性访问器来实现的，可以将一个普通值类型进行包装

```js
import { hasChanged, isArray, isObject } from '@vue/shared/src';
import { track, trigger } from './effect';
import { TrackOpTypes, TriggerOrTypes } from './operators';
import { reactive } from './reactive';

export function ref(value) {
  // 将普通类型 变成一个对象 , 可以是对象 但是一般情况下是对象直接用reactive更合理
  return createRef(value);
}

// ref 和 reactive的区别 reactive内部采用proxy  ref中内部使用的是defineProperty
export function shallowRef(value) {
  return createRef(value, true);
}

// 后续 看vue的源码 基本上都是高阶函数 做了类似柯里化的功能
const convert = (val) => (isObject(val) ? reactive(val) : val);
// beta 版本 之前的版本ref 就是个对象 ，由于对象不方便扩展 改成了类 (ts中实现类的话 私有属性必须要先声明才能使用)
class RefImpl {
  public _value; //表示 声明了一个_value属性 但是没有赋值
  public __v_isRef = true; // 产生的实例会被添加 __v_isRef 表示是一个ref属性
  constructor(public rawValue, public shallow) {
    // 参数中前面增加修饰符 标识此属性放到了实例上
    this._value = shallow ? rawValue : convert(rawValue); // 如果是深度 需要把里面的都变成响应式的
  }
  // 类的属性访问器
  get value() {
    // 代理 取值取value 会帮我们代理到 _value上
    track(this, TrackOpTypes.GET, 'value');
    return this._value;
  }
  set value(newValue) {
    if (hasChanged(newValue, this.rawValue)) {
      // 判断老值和新值是否有变化
      this.rawValue = newValue; // 新值会作为老值 用于下次比对
      this._value = this.shallow ? newValue : convert(newValue);
      trigger(this, TriggerOrTypes.SET, 'value', newValue);
    }
  }
}
function createRef(rawValue, shallow = false) {
  return new RefImpl(rawValue, shallow); // 借助类的属性访问器
}
```

### 1.10.实现toRefs

```js
class ObjectRefImpl {
  public __v_isRef = true;
  constructor(public target, public key) {}
  get value() {
    // 代理
    return this.target[this.key]; // 如果原对象是响应式的就会依赖收集
  }
  set value(newValue) {
    this.target[this.key] = newValue; // 如果原来对象是响应式的 那么就会触发更新
  }
}
// promisify
// promisifyAll

// 将某一个key对应的值 转化成ref
export function toRef(target, key) {
  // 可以把一个对象的值转化成 ref类型
  return new ObjectRefImpl(target, key);
}

export function toRefs(object) {
  // object 可能传递的是一个数组 或者对象
  const ret = isArray(object) ? new Array(object.length) : {};
  for (let key in object) {
    ret[key] = toRef(object, key);
  }
  return ret;
}
```

> 将对象中的属性转换成ref属性

### 1.11.实现Computed

> computed的整体思路和Vue2源码基本一致，也是基于缓存来实现的

```tsx
import { isFunction } from '@vue/shared';
import { effect, track, trigger } from './effect';
import { TrackOpTypes, TriggerOrTypes } from './operators';

class ComputedRefImpl {
  public _dirty = true; // 默认取值时不要用缓存
  public _value;
  public effect;
  constructor(public getter, public setter) {
    // 返还了effect的执行权限
    this.effect = effect(getter, {
      lazy: true, // 默认不执行
      scheduler: () => {
        // 传入了scheduler后 下次数据更新 原则上应该让effect重新执行 下次更新会调用scheduler
        if (!this._dirty) {
          // 依赖属性变化时
          this._dirty = true; // 标记为脏 触发视图更新
          trigger(this, TriggerOrTypes.SET, 'value');
        }
      },
    });
  }
  // 如果用户不去计算属性中取值 就不会执行计算属性的effect
  get value() {
    // 计算属性也要收集依赖
    if (this._dirty) {
      this._value = this.effect(); // 会将用户的返回值返回
      this._dirty = false;
    }
    track(this, TrackOpTypes.GET, 'value'); // 进行属性依赖收集
    return this._value;
  }
  set value(newValue) {
    // 当用户给计算属性设置值的时候会触发set方法 此时调用计算属性的setter
    this.setter(newValue);
  }
}

export function computed(getterOrOptoins) {
  let getter;
  let setter;
  if (isFunction(getterOrOptoins)) {
    // computed两种写法
    getter = getterOrOptoins;
    setter = () => {
      console.warn('computed value must be readonly');
    };
  } else {
    getter = getterOrOptoins.get;
    setter = getterOrOptoins.set;
  }
  return new ComputedRefImpl(getter, setter);
}
```

> effect.ts

```tsx
effects.forEach((effect: any) => {
  if (effect.options.scheduler) {
    effect.options.scheduler(effect); // 如果有自己提供的scheduler 则执行scheduler逻辑
  } else {
    effect();
  }
});
```

## 二.Vue3初始化流程

### 2.1.介绍VueRuntimeDOM

> VueRuntimeDOM解决浏览器运行时问题，此包中提供了DOM属性操作和节点操作一系列接口

### 2.2.patchProp实现

> 此方法主要针对不同的属性提供不同的patch操作

```tsx
export const patchProp = (el, key, prevValue, nextValue) => {
  switch (key) {
    case 'class':
      patchClass(el, nextValue); // 比对属性
      break;
    case 'style':
      patchStyle(el, prevValue, nextValue);
      break;
    default:
      // 如果不是事件 才是属性
      if (/^on[^a-z]/.test(key)) {
        // 事件就是增加和删除 修改 addEventListener
        patchEvent(el, key, nextValue);
      } else {
        // 其他属性 直接使用setAttribute
        patchAttr(el, key, nextValue);
      }
      break;
  }
};
```

> patchClass

```tsx
const patchClass = (el, value) => {
  if (value == null) {
    value = '';
  }
  el.className = value;
};
```

> patchStyle

```tsx
const patchStyle = (el, prev, next) => {
  const style = el.style; // 获取样式
  if (next == null) {
    el.removeAttribute('style'); // 如果新的没有 直接移除样式即可
  } else {
    // 老的有新的没有
    if (prev) {
      for (let key in prev) {
        if (next[key] == null) {
          // 老的有 新的没有 需要删除
          style[key] = '';
        }
      }
    }
    for (let key in next) {
      // 新的需要赋值到style上
      style[key] = next[key];
    }
  }
};
```

> patchEvent

```tsx
const patchEvent = (el, key, value) => {
  // 对函数的缓存
  const invokers = el._vei || (el._vei = {});
  const exists = invokers[key];
  if (value && exists) {
    // 需要绑定事件 而且存在的情况下
    exists.value = value; // 替换事件 但是不用解绑
  } else {
    const eventName = key.slice(2).toLowerCase();
    if (value) {
      // 绑定事件
      let invoker = (invokers[key] = createInvoker(value));
      el.addEventListener(eventName, invoker);
    } else {
      // 以前绑定了 但是没有value
      el.removeEventListener(eventName, exists);
      invokers[key] = undefined;
    }
  }
};
function createInvoker(value) {
  const invoker = (e) => {
    invoker.value(e);
  };
  invoker.value = value; // 为了能随时更改value属性
  return invoker;
}
```

> patchAttr

```tsx
const patchAttr = (el, key, value) => {
  if ((value = null)) {
    el.removeAttribute(key);
  } else {
    el.setAttribute(key, value);
  }
};
```

### 2.3.nodeOps实现

> 这里存放着所有节点操作的方法

```tsx
export const nodeOps = {
  // 增删改查 元素插入文本 文本创建 文本元素内容设置 获取父亲 获取下一个元素
  createElement: (tagName) => document.createElement(tagName),
  remove: (child) => {
    const parent = child.parentNode;
    if (parent) {
      parent.removeChild(child);
    }
  },
  insert: (child, parent, anchor = null) => {
    parent.insertBefore(child, anchor); // 如果参照物为空 则相当于appendChild
  },
  querySelector: (selector) => document.querySelector(selector),
  setElementText: (el, text) => (el.textContent = text),
  // 文本操作 创建文本
  createText: (text) => document.createTextNode(text),
  setText: (node, text) => (node.nodeValue = text),
  nextSibling: (node) => node.nextSibling,
  getParent: (node) => node.parentNode,
  getNextSibling: (node) => node.nextElementSibling,
};
```

### 2.4.runtimeDOM实现

> 用户调用的createApp函数就在这里被声明

```tsx
// 需要支持dom创建的api及属性处理的api
import { extend } from '@vue/shared';
import { createRenderer } from '@vue/runtime-core';
import { nodeOps } from './nodeOps';

// 如果元素一致只是元素发生变化 要做属性的diff算法
import { patchProp } from './patchProp';

// 渲染时用到的所有方法
const renderOptions = extend({ patchProp }, nodeOps);

// vue中runtime-core提供了核心的方法 用来处理渲染的 他会使用runtime-dom中的api进行渲染
// runtime-dom主要的作用就是为了抹平平台差异 不同平台对dom操作方式是不同的 将api传入到core core中可以调用这些方法
// 1.用户窜如组件和属性 2.需要创建组件的虚拟节点(diff算法) 3.将虚拟节点变成真实节点
export function createApp(rootComponent, rootProps = null) {
  const app = createRenderer(renderOptions).createApp(rootComponent, rootProps);
  let { mount } = app;
  app.mount = function (container) {
    // 清空容器的操作
    container = nodeOps.querySelector(container);
    container.innerHTML = ''; // 我们在runtime-dom重写的mount方法 会对容器进行情况
    mount(container); // 函数劫持 AOP切片
    // 将组件渲染成dom元素 进行挂载
  };
  return app;
}
```

```tsx
// -----------这些逻辑移动到core中与平台代码无关--------------
function createRenderer(rendererOptions) {
  return {
    createApp(rootComponent, rootProps) { // 用户创建app的参数
      const app = {
        mount(container) { // 挂载的容器

        }
      }
      return app;
    }
  }
}
```

### 2.5.runtimeCore实现

> renderer.ts

```tsx
import { createAppAPI } from "./apiCreateApp"

export function createRenderer(rendererOptions) { // 渲染时所到的api
  const render = (vnode,container) =>{ // 核心渲染方法
    // 将虚拟节点转化成真实节点插入到容器中
  }
  return {
    createApp:createAppAPI(render)
  }
}
```

> apiCreateApp.ts

```tsx
export function createAppAPI(render) {
  return function createApp(rootComponent, rootProps) {
    // 告诉他那个组件那个属性来创建的应用
    const app = {
      _props: rootProps,
      _component: rootComponent, // 为了稍后组件挂载之前可以先校验组件是否有render函数
      _container: null,
      mount(container) {
        // 1.根据用户传入的组件生成一个虚拟节点
        // 2.将虚拟节点变成真实节点 插入到对应的容器中
      },
    };
    return app;
  };
}
```

### 2.6.VNode实现

```tsx
import { createVnode } from './vnode';

export function createAppAPI(render) {
  return function createApp(rootComponent, rootProps) {
    // 告诉他那个组件那个属性来创建的应用
    const app = {
      _props: rootProps,
      _component: rootComponent, // 为了稍后组件挂载之前可以先校验组件是否有render函数
      _container: null,
      mount(container) {
        // 1.根据用户传入的组件生成一个虚拟节点
        const vnode = createVnode(rootComponent, rootProps);
        // 2.将虚拟节点变成真实节点 插入到对应的容器中
        render(vnode, container);

        app._container = container;
      },
    };
    return app;
  };
}
```

> vnode.ts

```tsx
export const createVnode = (type, props, children = null) => {
  // 可以根据type 来区分是组件 还是普通的元素
  // 根据type来区分 是元素还是组件
  // 给虚拟节点加一个类型
  const shapeFlag = isString(type)
    ? ShapeFlags.ELEMENT
    : isObject(type)
    ? ShapeFlags.STATEFUL_COMPONENT
    : 0;

  const vnode = {
    // 一个对象来描述对应的内容 ， 虚拟节点有跨平台的能力
    __v_isVnode: true, // 他是一个vnode节点
    type,
    props,
    children,
    component: null, // 存放组件对应的实例
    el: null, // 稍后会将虚拟节点和真实节点对应起来
    key: props && props.key, // diff算法会用到key
    shapeFlag, // 判断出当前自己的类型 和 儿子的类型
  };
  // 等会做diff算法 肯定要有一个老的虚拟节点(对应着真实的dom)和新的虚拟节点
  // 虚拟节点比对差异 将差异放到真实节点上
  normalizeChildren(vnode, children);
  return vnode;
};
```

```tsx
function normalizeChildren(vnode, children) {
  // 将儿子的类型统一记录在vnode中的shapeFlag
  let type = 0;
  if (children == null) {
    // 没有儿子 不用处理儿子的情况
  } else if (isArray(children)) {
    type = ShapeFlags.ARRAY_CHILDREN; // 数组
  } else {
    type = ShapeFlags.TEXT_CHILDREN; // 文本
  }
  vnode.shapeFlag |= type;
}
```

> 创建出vnode，交给render函数进行渲染

## 三.Vue3渲染流程

### 3.1.初始化渲染逻辑

> 初始调用render方法时，虚拟节点的类型为组件

```tsx
const processElement = (n1, n2, container, anchor) => {

};
const mountComponent = (initialVNode, container) => {
  // 组件初始化
};
const processComponent = (n1, n2, container) => {
  if (n1 == null) {
    // 组件没有上一次的虚拟节点
    mountComponent(n2, container);
  }
};
const patch = (n1, n2, container, anchor = null) => {
  // 核心的patch方法
  // 针对不同类型 做初始化操作
  const { shapeFlag } = n2;

  if (shapeFlag & ShapeFlags.ELEMENT) {
    processElement(n1, n2, container); // 处理元素类型
  } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
    processComponent(n1, n2, container); // 处理组件类型
  }
};
const render = (vnode, container) => {
  // 默认调用render 可能是初始化流程
  patch(null, vnode, container);
};
```

### 3.2.组建渲染流程

#### 1.为组件创造实例

```tsx
const mountComponent = (initialVNode, container) => {
  // 组件的渲染流程  最核心的就是调用 setup拿到返回值，获取render函数返回的结果来进行渲染
  // 1.先有实例
  const instance = (initialVNode.component =
                    createComponentInstance(initialVNode));
};
```

```tsx
let uid = 0;
export function createComponentInstance(vnode) {
  // webcomponent 组件需要有“属性” “插槽”
  const instance = {
    // 组件的实例
    uid: uid++,
    vnode, // 实例上的vnode就是我们处理过的vnode
    type: vnode.type, // 用户写的对象
    props: {}, // props就是组件里用户声明过的
    attrs: {}, // 用户没用到的props就会放到attrs中
    slots: {}, // 组件就是插槽
    ctx: {}, // 上下文
    data: {},
    setupState: {}, // setup返回值
    emit: null, // 组件通信
    proxy: null,
    render: null,
    subTree: null, // render函数的返回结果就是subTree
    isMounted: false, // 表示这个组件是否挂载过
  };
  instance.ctx = { _: instance }; // 将自己放到了上下文中 instance.ctx._
  return instance;
}
```

#### 2.扩展instance

> 需要给instance上的属性进行初始化操作

```tsx
const mountComponent = (initialVNode, container) => {
  // 组件的渲染流程  最核心的就是调用 setup拿到返回值，获取render函数返回的结果来进行渲染
  // 1.先有实例
  const instance = (initialVNode.component =
                    createComponentInstance(initialVNode));
  // 2.需要的数据解析到实例上
  setupComponent(instance); // state props attrs render ....
};
```

> 组件的启动，核心就是调用setup方法

```tsx
function setupStatefulComponent(instance) {
  // 1.代理 传递给render函数的参数
  instance.proxy = new Proxy(instance.ctx, PublicInstanceProxyHandlers as any);
  // 2.获取组件的类型 拿到组件的setup方法
  let Component = instance.type;
  let { setup } = Component;
  // ------ 没有setup------
  if (setup) {
    let setupContext = createSetupContext(instance);
    currentInstance = instance;
    const setupResult = setup(instance.props, setupContext); // instance 中props attrs slots emit expose 会被提取出来，因为在开发过程中会使用这些属性
    currentInstance = null;
    handleSetupResult(instance, setupResult);
  } else {
    finishComponentSetup(instance); // 如果用户没写setup 那么直接用外面的render
  }
}
export function setupComponent(instance) {
  const { props, children } = instance.vnode; // {type,props,children}

  // 初始化属性 initProps
  // 初始化插槽 initSlots
  instance.props = props; // initProps()
  instance.children = children; // 插槽的解析 initSlot()

  // 看当前组件是不是有状态的组件 函数组件
  let isStateful = instance.vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT;
  if (isStateful) {
    // 调用当前实例的setup方法 用setup的返回值 填充setupState和对应的render方法
    setupStatefulComponent(instance);
  }
}
```

> 提供instance.proxy，代理实例上一系列属性

```tsx
import { hasOwn } from '@vue/shared/src';

export const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    // 取值时 要访问 setUpState， props ,data
    const { setupState, props, data } = instance;
    if (key[0] == '$') {
      return; // 不能访问$ 开头的变量
    }
    if (hasOwn(setupState, key)) {
      // 先自己的状态 再向上下文中查找 再向属性中查找
      return setupState[key];
    } else if (hasOwn(props, key)) {
      return props[key];
    } else if (hasOwn(data, key)) {
      return data[key];
    }
  },
  set({ _: instance }, key, value) {
    const { setupState, props, data } = instance;
    if (hasOwn(setupState, key)) {
      setupState[key] = value;
    } else if (hasOwn(props, key)) {
      props[key] = value;
    } else if (hasOwn(data, key)) {
      data[key] = value;
    }
    return true;
  },
};
```

```tsx
function createSetupContext(instance) {
  return {
    attrs: instance.attrs,
    slots: instance.slots,
    emit: () => {},
    expose: () => {}, // 是为了表示组件暴露了哪些方法 用户可以通过ref调用哪些方法
  };
}
function handleSetupResult(instance, setupResult) {
  if (isFunction(setupResult)) {
    instance.render = setupResult;
  } else if (isObject(setupResult)) {
    instance.setupState = setupResult;
  }
  // 处理后可能依旧没有render 1.用户没写render函数 2.用户写了setup但是什么都没有返回
  finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
  let Component = instance.type;
  if (!instance.render) {
    // 对template模板进行编译 产生render函数
    // instance.render = render;// 需要将生成render函数放在实例上
    if (!Component.render && Component.template) {
      // 需要将template变成render函数 compileToFunctions()
    }
    instance.render = Component.render;
  }

  // 对vue2.0API做了兼容处理
  // applyOptions
}
```

> applyOptions中兼容vue2写法

#### 3.初始化渲染effect

> 保证组件中数据变化可以重新继续组件的渲染

```tsx
const mountComponent = (initialVNode, container) => {
  // 组件的渲染流程  最核心的就是调用 setup拿到返回值，获取render函数返回的结果来进行渲染
  // 1.先有实例
  const instance = (initialVNode.component =
                    createComponentInstance(initialVNode));
  // 2.需要的数据解析到实例上
  setupComponent(instance); // state props attrs render ....
  // 3.创建一个effect 让render函数执行
  setupRenderEfect(instance, container);
};
```

```tsx
const setupRenderEfect = (instance, container) => {
  // 每次状态变化后 都会重新执行effect 是第一次还是修改的?
  instance.update = effect(
    function componentEffect() {
      // 每个组件都有一个effect， vue3 是组件级更新，数据变化会重新执行对应组件的effect
      if (!instance.isMounted) {
        // 初次渲染
        let { bm, m } = instance;
        if (bm) {
          invokeArrayFns(bm);
        }

        let proxyToUse = instance.proxy;
        // $vnode  _vnode
        // vnode  subTree
        let subTree = (instance.subTree = instance.render.call(
          proxyToUse,
          proxyToUse
        ));

        // 用render函数的返回值 继续渲染
        patch(null, subTree, container);
        instance.isMounted = true;

        if (m) {
          // mounted要求必须在我们子组件完成后才会调用自己
          invokeArrayFns(m);
        }
      } else {
        console.log('渲染');
        let { bu, u } = instance;
        if (bu) {
          invokeArrayFns(bu);
        }

        // diff算法（核心 diff + 序列优化 watchApi 生命周期）
        const prevTree = instance.subTree; // 数据没变的时候的subTree
        let proxyToUse = instance.proxy;
        // 再次调用render 此时用的是最新数据渲染出来了
        const nextTree = instance.render.call(proxyToUse, proxyToUse);
        instance.subTree = nextTree;
        patch(prevTree, nextTree, container);

        if (u) {
          invokeArrayFns(u);
        }
      }
    },
    {
      scheduler: queueJob,
    }
  );
};
```

> render函数中返回的是虚拟节点，例如

```tsx
const App = {
    render : (r) =>h('div', {}, 'hello')
}
```

### 3.3.元素创建流程

#### 1.h方法的实现

```tsx
import { isArray, isObject } from '@vue/shared';
import { createVnode, isVnode } from './vnode';

export function h(type, propsOrChildren, children) {
  // 第一个一定是类型 第一个采纳数可能是属性可能是儿子 后面的一定都是儿子 没有属性的情况只能放数组
  // 一个的情况可以写文本 一个type + 一个文本
  const l = arguments.length;
  if (l === 2) {
    // 如果propsOrChildren是数组 直接作为第三个参数
    if (isObject(propsOrChildren) && !isArray(propsOrChildren)) {
      if (isVnode(propsOrChildren)) {
        return createVnode(type, null, [propsOrChildren]);
      }
      return createVnode(type, propsOrChildren);
    } else {
      // 如果第二个参数 不是对象 那一定是孩子
      return createVnode(type, null, propsOrChildren);
    }
  } else {
    if (l > 3) {
      children = Array.from(arguments).slice(2);
    } else if (l === 3 && isVnode(children)) {
      children = [children];
    }
    return createVnode(type, propsOrChildren, children);
  }
}
```

#### 2.创建真实节点

```tsx
const mountElement = (vnode, container, anchor = null) => {
  // 把虚拟节点变成真实的DOM元素
  const { props, shapeFlag, type, children } = vnode;
  let el = (vnode.el = hostCreateElement(type)); // 对应的是真实DOM元素

  if (props) {
    for (const key in props) {
      hostPatchProp(el, key, null, props[key]);
    }
  }
  // 父创建完毕后 需要创建儿子
  if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    hostSetElementText(el, children); // 文本比较简单 直接扔进去即可
  } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    mountChildren(children, el);
  }
  hostInsert(el, container, anchor);
};
```

> 对子节点进行处理

```tsx
const mountChildren = (children, container) => {
  for (let i = 0; i < children.length; i++) {
    let child = normalizeVNode(children[i]);
    patch(null, child, container);
  }
};
```

```tsx
export const Text = Symbol('Text');

export function normalizeVNode(child) {
  if (isObject(child)) return child;
  return createVnode(Text, null, String(child));
}
```

```tsx
const processText = (n1, n2, container) => {
  if (n1 == null) {
    hostInsert((n2.el = hostCreateText(n2.children)), container);
  }
};
```

## 四.Vue3中diff算法

### 4.1.组件更新

> 当依赖的属性变化时，会重新执行effect函数，我们再次调用render方法生成新的虚拟DOM，进行`diff`操作

```tsx
instance.update = effect(
  function componentEffect() {
    // 每个组件都有一个effect， vue3 是组件级更新，数据变化会重新执行对应组件的effect
    if (!instance.isMounted) {
      // 初次渲染
    } else {
      // diff算法（核心 diff + 序列优化 watchApi 生命周期）
      const prevTree = instance.subTree; // 数据没变的时候的subTree
      let proxyToUse = instance.proxy;
      // 再次调用render 此时用的是最新数据渲染出来了
      const nextTree = instance.render.call(proxyToUse, proxyToUse);
      instance.subTree = nextTree;
      patch(prevTree, nextTree, container);
    }
  };
```

### 4.2.前后元素不一致

> 两个不同虚拟节点不需要进行比较，直接移除老节点，将新的虚拟节点渲染成真实DOM进行挂载即可

```js
const { createApp, h, reactive } = VueRuntimeDOM;
const App = {
  setup() {
    let state = reactive({ flag: true });
    return {
      state
    }
  },
  render: (r) => {
    return r.state.flag ? h('div', {
      onClick: () => {
        r.state.flag = false;
      }
    }, 'hello') : h('p', {}, 'world')
  }
}
createApp(App).mount('#app');
```



> 切换显示不同节点

```tsx
const isSameVNode = (n1, n2) => {
  return n1.type === n2.type && n1.key === n2.key;
};
const unmount = (n1) => {
  // 如果是组件 调用的组件的生命周期等
  hostRemove(n1.el);
};
// -----------------文本处理-----------------
const patch = (n1, n2, container, anchor = null) => {
  // 核心的patch方法
  // 针对不同类型 做初始化操作
  const { shapeFlag, type } = n2;
  // 不是初始化才比较两个节点是不是同一个节点 (判断两个元素是否相同 不相同卸载再添加)
  if (n1 && !isSameVNode(n1, n2)) {
    // 把以前的删掉 换成n2
    anchor = hostNextSibling(n1.el);
    unmount(n1); // 删除老的
    n1 = null; // 如果n1为空则直接重新渲染
  }
};
```

### 4.3.前后元素一致

```js
const App = {
  setup() {
    let state = reactive({ flag: true });
    return {
      state
    }
  },
  render: (r) => {
    return r.state.flag ? h('div', {
      style: { color: 'red' },
      onClick: () => {
        r.state.flag = false;
      }
    }, 'hello') : h('div', { style: { color: 'blue' } }, 'world')
  }
}
createApp(App).mount('#app');
```

> 前后虚拟节点一样，则复用DOM元素，并且更新属性和子节点

```tsx
const patchElement = (n1, n2) => {
  // 走到这里说明前后两个元素能复用
  let el = (n2.el = n1.el);

  // 更新属性 更新儿子
  const oldProps = n1.props || {};
  const newProps = n2.props || {};

  patchProps(oldProps, newProps, el);
  patchChildren(n1, n2, el);
};
```

- 属性更新

  ```tsx
  const patchProps = (oldProps, newProps, el) => {
    if (oldProps !== newProps) {
      for (let key in newProps) {
        const prev = oldProps[key];
        const next = newProps[key];
        if (prev !== next) {
          hostPatchProp(el, key, prev, next);
        }
      }
      for (const key in oldProps) {
        if (!(key in newProps)) {
          hostPatchProp(el, key, oldProps[key], null);
        }
      }
    }
  };
  ```

- 比较儿子节点

  > 针对子节点类型做基本diff操作，最复杂的情况莫过于双方都有儿子的情况

  ```tsx
  const unmountChildren = (children) => {
    for (let i = 0; i < children.length; i++) {
      unmount(children[i]);
    }
  };
  const patchChildren = (n1, n2, el) => {
    const c1 = n1.children; // 新老儿子
    const c2 = n2.children;
  
    // 老的有儿子 新的没儿子  新的有儿子老的没儿子  新老都有儿子  新老都是文本
  
    const prevShapeFlag = n1.shapeFlag;
    const shapeFlag = n2.shapeFlag; // 分别标识过儿子的状况
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      // case1:现在是文本之前是数组
      // 老的是n个孩子 但是新的是文本
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        unmountChildren(c1); // 如果c1 中包含组件会调用组件的销毁方法
      }
      // 两个人都是文本情况
      if (c2 !== c1) {
        // case2：两个都是文本
        hostSetElementText(el, c2);
      }
    } else {
      // 现在是数组   上一次有可能是文本 或者数组
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // case3:两个都是数组
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          // 当前是数组 之前是数组
          // 两个数组的比对  -》 diff算法  ***********************
  
          patchKeyedChildren(c1, c2, el);
        } else {
          // 没有孩子  特殊情况 当前是null ， 删除掉老的
          unmountChildren(c1);
        }
      } else {
        // 上一次是文本
        if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
          // case4 现在是数组 之前是文本
          hostSetElementText(el, '');
        }
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          mountChildren(c2, el);
        }
      }
    }
  };
  ```

### 4.4.核心diff算法

> 针对双方儿子都是数组的形式

```tsx
const App = {
  render: (r) => {
    return r.state.flag ?
      h('div',
        [
      h('li', { key: 'A' }, 'A'),
      h('li', { key: 'B' }, 'B')
    ]
       ) :
    h('div',
      [
      h('li', { key: 'A' }, 'A'),
      h('li', { key: 'B' }, 'B')
    ]
     )
  }
}
createApp(App).mount('#app');
```

1. sync from start

   ![image-20241121173216894](https://p.ipic.vip/c2lr52.png)

   ```tsx
   const patchKeyedChildren = (c1, c2, el) => {
     // 比较两个儿子的差异
     let i = 0;
     let e1 = c1.length - 1;
     let e2 = c2.length - 1;
   
     // sync from start
     while (i <= e1 && i <= e2) {
       // 有任何一方停止循环则直接跳出
       const n1 = c1[i];
       const n2 = c2[i];
       if (isSameVNode(n1, n2)) {
         patch(n1, n2, el); // 这样做就是比较两个节点的属性和子节点
       } else {
         break;
       }
       i++;
     }
   }
   ```

2. sync from end

   ![image-20241121173243054](https://p.ipic.vip/hxpgp0.png)

   ```tsx
   // syan from end
   while (i <= e1 && i <= e2) {
     const n1 = c1[e1];
     const n2 = c2[e2];
     if (isSameVNode(n1, n2)) {
       patch(n1, n2, el);
     } else {
       break;
     }
     e1--;
     e2--;
   }
   ```

3. common sequence + mount

   ![image-20241121173310023](https://p.ipic.vip/zai0ck.png)

   ```tsx
   // common sequence + mount
   // i要比e1大说明有新增
   // i和e2之间的是新增的部分
   if (i > e1) {
     if (i <= e2) {
       while (i <= e2) {
         const nextPos = e2 + 1;
         // 根据下一个人的索引来看参照物
         const anchor = nextPos < c2.length ? c2[nextPos].el : null;
         patch(null, c2[i], el, anchor); // 创建新节点 扔到容器中
         i++;
       }
     }
   }
   ```

4. common sequence + unmount

   ![image-20241121173333046](https://p.ipic.vip/3yeo7k.png)

   ```tsx
   else if (i > e2) {
     // common sequence + unmount
     // i比e2大说明有要卸载的
     // i到e1之间的就是要卸载的
     while (i <= e1) {
       unmount(c1[i]);
       i++;
     }
   }
   ```

5. unkown sequence

   1. `build key:index map for newChildren`

      ![image-20241121173356189](https://p.ipic.vip/1fy5jp.png)
   
      ```tsx
      // 乱序比对
      let s1 = i;
      let s2 = i;
      const keyToNewIndexMap = new Map(); // key -> newIndex
      for (let i = s2; i <= e2; i++) {
        keyToNewIndexMap.set(c2[i].key, i);
      }
      ```

   2. `loop through old children left to be patched and try to patch`
   
      ```tsx
      // 循环老的元素，看一下新的里面有没有 如果有说明要比较差异，没有要添加到列表中，老的有新的没有要删除
      const toBePatched = e2 - s2 + 1; // 新的总个数
      const newIndexToOldIndexMap = new Array(toBePatched).fill(0); // 一个记录是否对比过的映射表
      for (let i = s1; i <= e1; i++) {
        const oldChild = c1[i]; // 老的孩子
        let newIndex = keyToNewIndexMap.get(oldChild.key); // 用老的孩子去新的里面找
        if (newIndex == undefined) {
          unmount(oldChild); // 多余的删掉
        } else {
          // 新的位置对应老的位置，如果数组里放的值大于0说明已经patch过了
          newIndexToOldIndexMap[newIndex - s2] = i + 1; // 用来标记当前所patch过的结果
          patch(oldChild, c2[newIndex], el);
        }
      } // 到这这是新老属性和儿子的比对，没有移动位置
      ```

   3. move and mount
   
      ![image-20241121173413654](https://p.ipic.vip/y0mqpt.png)
      
      ```tsx
      // 获取最长递增子序列
      let increasingNewIndexSequence = getSequence(newIndexToOldIndexMap);
      let j = increasingNewIndexSequence.length - 1; // 取出最后一个的索引
      // 需要移动位置
      for (let i = toBePatched - 1; i >= 0; i--) {
        // 3 2 1 0
        let index = i + s2;
        let current = c2[index]; // 找到h
        let anchor = index + 1 < c2.length ? c2[index + 1].el : null;
        if (newIndexToOldIndexMap[i] === 0) {
          // 创建 [5 3 4 0] -> [1 2]
          patch(null, current, el, anchor);
        } else {
          // 不是0，说明已经比对过
          if (i !== increasingNewIndexSequence[j]) {
            hostInsert(current.el, el, anchor); // 目前无论如何都做了一遍倒序插入，其实可以不用的，可以根据刚才的数组来减少次数
          } else {
            j--; // 跳过不需要移动的元素，为了减少移动操作，需要这个最长递增子序列的算法
          }
        }
      }
      ```

### 4.5.最长递增子序列

> Vue3采用最长递增子序列，求解不需要移动的元素有哪些

```js
// 求最长递增子序列的个数（贪心算法+二分查找）
function getSequence(arr) {
  const len = arr.length;
  const result = [0]; // 以默认第0个为基准来做序列
  const p = new Array(len).fill(0); // 最后要标记索引 放的东西不用关心 但是要和数组一样长

  let start;
  let end;
  let middle;
  let resultLastIndex;
  for (let i = 0; i < len; i++) {
    let arrI = arr[i];
    if (arrI !== 0) {
      // 因为vue里面的序列中0意味着需要创建
      resultLastIndex = result[result.length - 1];
      if (arr[resultLastIndex] < arrI) {
        // 比较最后一项和当前项的值，如果比最后一项大，则将当前索引放到结果集中
        result.push(i);
        p[i] = resultLastIndex; //当前放到末尾的要记住它前面的那个人是谁
        continue;
      }
      // 这里我们需要通过二分查找，在结果集中找到比当前值大的，用当前值的索引将其替换掉
      // 递增序列，采用二分查找是最快的
      start = 0;
      end = result.length - 1;
      while (start < end) {
        // start===end的时候就停止了，这个二分查找再找索引
        middle = ((start + end) / 2) | 0;
        if (arr[result[middle]] < arrI) {
          start = middle + 1;
        } else {
          end = middle;
        }
      }
      // 找到中间值之后 我们需要做替换操作 start / end
      if (arr[result[end]] > arrI) {
        // 这里用当前这一项，替换掉已有的比当前大的那一项。更有潜力的我需要
        result[end] = i;
        p[i] = result[end - 1]; // 记住它的前一个人是谁
      }
    }
  }

  // 通过最后一项进行回溯
  let i = result.length;
  let last = result[i - 1]; // 找到最后一项了
  while (i-- > 0) {
    // 倒序追溯
    result[i] = last; // 最后一项是确定的
    last = p[last];
  }

  return result;
}
// console.log(getSequence([3, 2, 8, 9, 5, 6, 7, 11, 15]));
console.log(getSequence([3, 2, 8, 9, 5, 6, 7, 11, 15, 4]));
console.log(getSequence([5, 3, 4, 0]));
console.log(getSequence([2, 3, 1, 5, 6, 8, 7, 9, 4]));

// 找更有潜力的
// 3
// 2
// 2 8
// 2 8 9
// 2 5 9
// 2 5 6
// 2 5 6 7 11 15

// 1.思路就是当前这一项比我们最后一项大则直接放到末尾
// 2.如果当前这一项比最后一项小，需要在序列中通过二分查找找到比当前大的这一项，用它替换掉
// 3.最优的情况，就是默认递增
// 我们可以通过标记索引的方式，最终通过最后一项将结果还原
```

![image-20241121173506168](https://p.ipic.vip/rznrjv.png)

## 五.Vue3异步更新策略

### 5.1.watchAPI

> watchAPI的核心就是监控值的变化，值发生变化后调用对应回调函数

#### 1.同步watch

```tsx
const state = reactive({ count: 0 });
watch(
  () => state.count,
  function (newValue, oldValue) {
    console.log(newValue, oldValue);
  },
  { immediate: true, flush: 'post' }
);
```

> watchAPI根据传入的参数不同，有不同的调用方式

```tsx
// 核心属性flush怎么刷新 immediate是否立即调用
function doWatch(source, cb, { flush, immediate }) {
  let oldValue;
  let scheduler = () => {
    if (cb) {
      const newValue = runner();
      if (hasChanged(oldValue, newValue)) {
        cb(newValue, oldValue);
        oldValue = newValue;
      }
    } else {
      source(); // watchEffect不用比较新的和老的值 直接触发用户参数执行即可
    }
  };
  let runner = effect(() => source(), {
    // 默认不是立即执行
    lazy: true, // 默认不让effect执行
    scheduler,
  }); // 批量更新可以缓存到数组中 开一个异步任务 做队列刷新
  if (immediate) {
    scheduler();
  }
  oldValue = runner();
}

export function watch(source, cb, options) {
  return doWatch(source, cb, options);
}
```

#### 2.异步watch

> 多次进行更改操作，最终仅仅执行一次

```tsx
const state = reactive({ name: 'pf' })
watch(() => state.name, (newValue, oldValue) => {
  console.log(newValue, oldValue); // xxx pf
});
setTimeout(() => {
  state.name = 'ricardo'
  state.name = 'xxx'
}, 1000);
```

> 根据参数不同，将任务放到不同队列中

```tsx
let queue = [];
export function queueJob(job) {
  // 批量处理 多次更新先缓存去重 之后异步更新
  if (!queue.includes(job)) {
    queue.push(job);
    queueFlush();
  }
}
let isFlushPending = false;
function queueFlush() {
  if (!isFlushPending) {
    isFlushPending = true;
    Promise.resolve().then(flushJobs);
  }
}

function flushJobs() {
  isFlushPending = false;
  // 清空时 我们需要根据调用的顺序依次刷新, 保证先刷新父在刷新子
  queue.sort((a, b) => a.id - b.id);
  for (let i = 0; i < queue.length; i++) {
    const job = queue[i];
    job();
  }
  queue.length = 0;
}
```

### 5.2.watchEffect

> watchEffect是没有cb的watch，当数据变化后会重新执行source函数

```tsx
watchEffect(() => {
  console.log(state.count); // 依赖的人变化了 直接就执行了 -> effect (有异步更新的逻辑)
});
```

```tsx
// 核心属性flush怎么刷新 immediate是否立即调用
function doWatch(source, cb, { flush, immediate }) {
  let oldValue;
  let scheduler = () => {
    if (cb) {
      const newValue = runner();
      if (hasChanged(oldValue, newValue)) {
        cb(newValue, oldValue);
        oldValue = newValue;
      }
    } else {
      source(); // watchEffect不用比较新的和老的值 直接触发用户参数执行即可
    }
  };
  let runner = effect(() => source(), {
    // 默认不是立即执行
    lazy: true, // 默认不让effect执行
    scheduler,
  }); // 批量更新可以缓存到数组中 开一个异步任务 做队列刷新
  if (immediate) {
    scheduler();
  }
  oldValue = runner();
}

export function watch(source, cb, options) {
  return doWatch(source, cb, options);
}

export function watchEffect(source) {
  return doWatch(source, null, {} as any);
}
```

## 六.Vue3生命周期原理

### 6.1.生命周期实现原理

> 定义生命周期类型 component.ts

```tsx
const enum LifeCycleHooks {
  BEFORE_MOUNT = 'bm',
  MOUNTED = 'm',
  BEFORE_UPDATE = 'bu',
  UPDATED = 'u',
}
```

> 将对应的生命周期保存在实例上 apiLifecycle.ts

```tsx
const injectHook = (type, hook, target) => {
  // target指向的肯定是生命周期指向的实例
  // 后面可能是先渲染儿子 此时currentInstance已经变成渲染儿子了 但是target永远指向是正确的
  // 在这个函数中保留了实例 闭包
  if (!target) {
    return console.warn(
      'injection APIs can only be used during execution of setup().'
    );
  } else {
    const hooks = target[type] || (target[type] = []); // instance.bm = []
    const wrap = () => {
      setCurrentInstance(target); // currentInstance = 自己的
      hook.call(target);
      setCurrentInstance(null);
    };
    hooks.push(wrap);
  }
};
const createHook =
  (lifecycle) =>
  (hook, target = currentInstance) => {
    // 全局的当前实例
    // target用来表示他是哪个实例的钩子
    // 给当前实例 增加 对应的生命周期 即可
    injectHook(lifecycle, hook, target);
  };

export const invokeArrayFns = (fns) => {
  for (let i = 0; i < fns.length; i++) {
    // vue2中也是 调用是 让函数依次执行
    fns[i]();
  }
};

export const onBeforeMount = createHook(LifeCycleHooks.BEFORE_MOUNT);
export const onMounted = createHook(LifeCycleHooks.MOUNTED);
export const onBeforeUpdate = createHook(LifeCycleHooks.BEFORE_UPDATE);
export const onUpdated = createHook(LifeCycleHooks.UPDATED);
```

### 6.2.生命周期调用

```tsx
// 每次状态变化后 都会重新执行effect 是第一次还是修改的?
instance.update = effect(
  function componentEffect() {
    // 每个组件都有一个effect， vue3 是组件级更新，数据变化会重新执行对应组件的effect
    if (!instance.isMounted) {
      // 初次渲染
      let { bm, m } = instance;
      if (bm) {
        invokeArrayFns(bm);
      }

      let proxyToUse = instance.proxy;
      // $vnode  _vnode
      // vnode  subTree
      let subTree = (instance.subTree = instance.render.call(
        proxyToUse,
        proxyToUse
      ));

      // 用render函数的返回值 继续渲染
      patch(null, subTree, container);
      instance.isMounted = true;

      if (m) {
        // mounted要求必须在我们子组件完成后才会调用自己
        invokeArrayFns(m);
      }
    } else {
      console.log('渲染');
      let { bu, u } = instance;
      if (bu) {
        invokeArrayFns(bu);
      }

      // diff算法（核心 diff + 序列优化 watchApi 生命周期）
      const prevTree = instance.subTree; // 数据没变的时候的subTree
      let proxyToUse = instance.proxy;
      // 再次调用render 此时用的是最新数据渲染出来了
      const nextTree = instance.render.call(proxyToUse, proxyToUse);
      instance.subTree = nextTree;
      patch(prevTree, nextTree, container);

      if (u) {
        invokeArrayFns(u);
      }
    }
  },
  {
    scheduler: queueJob,
  }
);
```

## 参考源码

1. [源码一](https://github.com/RicardoPang/pf-vue3)
2. [源码二](https://github.com/RicardoPang/vue3-plain)
