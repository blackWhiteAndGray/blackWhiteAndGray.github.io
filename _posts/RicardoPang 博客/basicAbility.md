---
title: 前端必备技术栈
description: 基础能力
---

## 异步

所谓‘异步’，简单来说，就是将一个任务分成两段。先执行第一段，然后执行其他任务。等到准备好后，再执行第二段。例如，有一个任务是读取文件进行处理，异步的执行过程如下。

![image-20240819090905681](https://p.ipic.vip/rwhb9q.png)

这种不连续的执行，就叫做异步。相应地，连续的执行，就叫做同步。

![image-20240819090948893](https://p.ipic.vip/ydsjev.png)

## 高阶函数

在 JavaScript 中，函数是一等公民，因此可以被作为参数传递或作为返回值返回。

```js
// 例如，函数可以用于批量生成函数。
let toString = Object.prototype.toString
let isString = function (obj) {
  return toString.call(obj) == `[object String]`
}
let isFunction = function (obj) {
  return toString.call(obj) == `[object Function]`
}
let isType = function (type) {
  return function (obj) {
    return toString.call(obj) == `[object ${type}]`
  }
}

// 可以用于需要调用多次才执行的函数
let after = function (times, task) {
  return function () {
    if (times-- == 1) {
      return task.apply(this, arguments)
    }
  }
}
let fn = after(3, function () {
  console.log(3)
})
fn()
```

## 异步编程的语法目标是使其更接近同步编程

> 异步的产生原因是单线程，而事件循环则是实现异步的方式。

- 回调函数实现

  ```js
  // 所谓回调函数，就是把任务的第二段单独写在一个函数里面，任务重新执行时，就直接调用这个函数
  fs.readFile('某个文件', function (err, data) {
    if (err) throw err
    console.log(data)
  })
  ```

  - 回调问题

  ```js
  // 问题1 异常处理：在处理异常代码时 try catch 不再生效
  let async = function (callback) {
    try {
      setTimeout(function () {
        callback()
      }, 1000)
    } catch (e) {
      console.log('捕获错误', e)
    }
  }
  async(function () {
    console.log(t)
  })
  //因为这个回调函数被存放了起来，直到下一个事件环的时候才会取出,try只能捕获当前循环内的异常，对callback异步无能为力。
  // Node在处理异常有一个约定，将异常作为回调的第一个实参传回，如果为空表示没有出错。
  async(function (err, callback) {
    if (err) {
      console.log(err)
    }
  })
  // 异步方法也要遵循两个原则：1、必须在异步之后调用传入的回调函数。如果出错了要向回调函数传入异常供调用者判断。
  let async = function (callback) {
    try {
      setTimeout(function () {
        if (success) callback(null)
        else callback('错误')
      }, 1000)
    } catch (e) {
      console.log('捕获错误', e)
    }
  }

  // 问题2 回调地狱：异步多级依赖的情况下嵌套非常深，代码难以阅读和维护
  let fs = require('fs')
  fs.readFile('template.txt', 'utf8', function (err, template) {
    fs.readFile('data.txt', 'utf8', function (err, data) {
      console.log(template + ' ' + data)
    })
  })
  ```

- 事件监听

- 发布订阅

```js
// 订阅事件实现了一个事件与多个回调函数的关联
let fs = require('fs')
let EventEmitter = require('events')
let eve = new EventEmitter()
let html = {}
eve.on('ready', function (key, value) {
  html[key] = value
  if (Object.keys(html).length == 2) {
    console.log(html)
  }
})
function render() {
  fs.readFile('template.txt', 'utf8', function (err, template) {
    eve.emit('ready', 'template', template)
  })
  fs.readFile('data.txt', 'utf8', function (err, data) {
    eve.emit('ready', 'data', data)
  })
}
render()
```

- Promise/A+ 和生成器函数

```js
// 生成器Generators/ yield
// 当你在执行一个函数的时候，你可以在某个点暂停函数的执行，并且做一些其他工作，然后再返回这个函数继续执行， 甚至是携带一些新的值，然后继续执行。
// 上面描述的场景正是JavaScript生成器函数所致力于解决的问题。当我们调用一个生成器函数的时候，它并不会立即执行， 而是需要我们手动的去执行迭代操作（next方法）。也就是说，你调用生成器函数，它会返回给你一个迭代器。迭代器会遍历每个中断点。
// next 方法返回值的 value 属性，是 Generator 函数向外输出数据；next 方法还可以接受参数，这是向 Generator 函数体内输入数据
function* foo() {
  var index = 0
  while (index < 2) {
    yield index++ //暂停函数执行，并执行yield后的操作
  }
}
var bar = foo() // 返回的其实是一个迭代器
console.log(bar.next()) // { value: 0, done: false }
console.log(bar.next()) // { value: 1, done: false }
console.log(bar.next()) // { value: undefined, done: true }

// co是一个为Node.js和浏览器打造的基于生成器的流程控制工具，借助于Promise，你可以使用更加优雅的方式编写非阻塞代码。
let fs = require('fs')
function readFile(filename) {
  return new Promise(function (resolve, reject) {
    fs.readFile(filename, function (err, data) {
      if (err) reject(err)
      else resolve(data)
    })
  })
}
function* read() {
  let template = yield readFile('./template.txt')
  let data = yield readFile('./data.txt')
  return template + '+' + data
}
co(read).then(
  function (data) {
    console.log(data)
  },
  function (err) {
    console.log(err)
  }
)

function co(gen) {
  let it = gen()
  return new Promise(function (resolve, reject) {
    !(function next(lastVal) {
      let { value, done } = it.next(lastVal)
      if (done) {
        resolve(value)
      } else {
        value.then(next, (reason) => reject(reason))
      }
    })()
  })
}
```

- async/await

```js
// 内置执行器
// 更好的语义
// 更广的适用性
let fs = require('fs')
function readFile(filename) {
  return new Promise(function (resolve, reject) {
    fs.readFile(filename, 'utf8', function (err, data) {
      if (err) reject(err)
      else resolve(data)
    })
  })
}

async function read() {
  let template = await readFile('./template.txt')
  let data = await readFile('./data.txt')
  return template + '+' + data
}
let result = read()
result.then((data) => console.log(data))
```

## 原生 js 系列

- [深入系列](https://github.com/mqyqingfeng/Blog)

- [完全熟练掌握 eventLoop](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)
- **Promise**
  - [Promise A+规范](https://promisesaplus.com/)
  - [手写一遍 Promise](https://github.com/xieranmaya/blog/issues/3)
- async await
  - [手写async await的最简实现](https://juejin.cn/post/6844904102053281806)
- [代码规范](https://github.com/beginor/clean-code-javascript)

## 其他

- 设计模式
- 性能优化
- Vue
- TypeScript
