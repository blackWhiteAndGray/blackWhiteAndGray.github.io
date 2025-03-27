---
title: 从零开始，手写完整的Promise原理
description: 实现Promise
---

> [Promises/A+规范](https://www.ituring.com.cn/article/66566)

## 1. 异步回调

#### 1.1 回调地狱

在执行多个操作时，回调函数的嵌套可能会导致代码难以理解，这种现象通常被称为`回调地狱`

#### 1.2 并行结果

当多个异步操作之间没有顺序要求时，可以并行执行以节省时间。然而，当必须等到所有异步操作完成后才能执行后续任务时，通常难以实现并行执行。

## 2. Promise

Promise的本意是承诺，在程序中表示一段时间后将会给出结果。什么时候需要‘等待一段时间’？通常是在处理异步操作时，比如网络请求或读取本地文件

## 3. Promise的三种状态

- Pending 实例创建时的初始状态
- Fulfilled 成功状态
- Rejected 失败状态

> Promise 对象有三种状态：`Pending`（初始状态），`Fulfilled`（成功状态），和 `Rejected`（失败状态）。当状态改变时，`then` 方法可以指定相应的回调函数，`resolve` 用于执行第一个函数（`onFulfilled`），而 `reject` 则执行第二个函数（`onRejected`）。

## 4. 构建一个Promise

```js
let promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    if (Math.random() > 0.5) {
      resolve("成功");
    } else {
      reject("失败");
    }
  }, 1000);
});
promise.then((data) => {
  console.log(data);
});
```

- 构造一个 Promise 实例时，需要传入一个包含两个函数参数的回调函数
- 传入的回调函数需要有两个参数，通常被命名为 `resolve` 和 `reject`，它们分别表示操作成功和失败后的处理逻辑。`resolve` 使 Promise 状态变为成功，同时传递成功后的结果；`reject` 则使 Promise 状态变为失败，并传递错误信息。

## 5. Promise的链式调用

- 每次调用 `then` 都会返回一个新的 Promise 实例，这使得链式调用成为可能。链式调用中，前一个 `then` 返回的值会作为参数传递给下一个 `then` 方法。

```js
readFile('1.txt').then(function (data) {
  console.log(data);
  return data;
}).then(function (data) {
  console.log(data);
  return readFile(data);
}).then(function (data) {
  console.log(data);
}).catch(function(err){
  console.log(err);
});
```

## 6. Promise API

#### Promise.all

- `Promise.all` 方法接收一个包含多个 Promise 实例的数组，并返回一个新的 Promise 实例。返回的 Promise 状态取决于数组中所有 Promise 实例的状态。当所有实例都处于 `resolve` 状态时，返回的 Promise 也会变为 `resolve` 状态；如果任意一个实例处于 `reject` 状态，返回的 Promise 也会变为 `reject` 状态

```js
Promise.all([p1, p2]).then(function (result) {
  console.log(result); // [ '2.txt', '2' ]
});

// 不管两个promise谁先完成，Promise.all方法会按照数组里面的顺序将结果返回
```

#### Promise.race

- `Promise.race` 方法接收一个包含多个 Promise 实例的数组，并返回一个新的 Promise 实例。返回的 Promise 状态取决于第一个改变状态的实例。当任意一个实例变为 `resolve` 时，返回的 Promise 也会变为 `resolve` 状态；如果任意一个实例变为 `reject`，返回的 Promise 也会变为 `reject` 状态

```js
Promise.race([p1, p2]).then(function (result) {
  console.log(result); // [ '2.txt', '2' ]
});
```

#### Promise.resolve

- `Promise.resolve` 方法返回一个 `resolve` 状态的 Promise 实例。根据传入参数的不同，该方法可能会直接返回传入的值，或者是一个已经 `resolve` 的 Promise 实例

#### Promise.reject

- `Promise.reject` 方法返回一个 `reject` 状态的 Promise 实例。通常会将抛出的错误信息作为参数传递给这个实例。

## 7. Promise/A+完整实现

```tsx
// TypeScript实现
export class PfPromise {
  private status: 'pending' | 'resolved' | 'rejected' = 'pending'
  private value: any
  private onResolvedCallbacks: Array<(value: any) => void> = []
  private onRejectedCallbacks: Array<(reason: any) => void> = []

  constructor(
    executor: (
      resolve: (value: any) => void,
      reject: (reason: any) => void
    ) => void
  ) {
    try {
      executor(this.resolve.bind(this), this.reject.bind(this))
    } catch (error) {
      this.reject(error)
    }
  }

  private resolve(value: any) {
    if (value instanceof PfPromise) {
      return value.then(this.resolve.bind(this), this.reject.bind(this))
    }
    setTimeout(() => {
      if (this.status === 'pending') {
        this.status = 'resolved'
        this.value = value
        this.onResolvedCallbacks.forEach((callback) => callback(value))
      }
    })
  }

  private reject(reason: any) {
    setTimeout(() => {
      if (this.status === 'pending') {
        this.status = 'rejected'
        this.value = reason
        this.onRejectedCallbacks.forEach((callback) => callback(reason))
      }
    })
  }

  then(onFulfilled?: (value: any) => any, onRejected?: (reason: any) => any) {
    return new PfPromise((resolve, reject) => {
      const fulfilledCallback = () => {
        try {
          const result = onFulfilled ? onFulfilled(this.value) : this.value
          resolvePromise(result, resolve, reject)
        } catch (error) {
          reject(error)
        }
      }

      const rejectedCallback = () => {
        try {
          const result = onRejected ? onRejected(this.value) : this.value
          resolvePromise(result, resolve, reject)
        } catch (error) {
          reject(error)
        }
      }

      if (this.status === 'resolved') {
        setTimeout(fulfilledCallback)
      } else if (this.status === 'rejected') {
        setTimeout(rejectedCallback)
      } else {
        this.onResolvedCallbacks.push(fulfilledCallback)
        this.onRejectedCallbacks.push(rejectedCallback)
      }
    })
  }

  catch(onRejected: (reason: any) => any) {
    return this.then(undefined, onRejected)
  }

  static all(promises: PfPromise[]) {
    return new PfPromise((resolve, reject) => {
      const results: any[] = []
      let completed = 0

      promises.forEach((promise, index) => {
        promise
          .then((data) => {
            results[index] = data
            completed++
            if (completed === promises.length) {
              resolve(results)
            }
          })
          .catch(reject)
      })
    })
  }

  static race(promises: PfPromise[]) {
    return new PfPromise((resolve, reject) => {
      promises.forEach((promise) => {
        promise.then(resolve).catch(reject)
      })
    })
  }

  static resolve(value: any) {
    return new PfPromise((resolve) => resolve(value))
  }

  static reject(reason: any) {
    return new PfPromise((_, reject) => reject(reason))
  }
}

function resolvePromise(
  x: any,
  resolve: (value: any) => void,
  reject: (reason: any) => void,
  visited = new Set<any>()
) {
  if (visited.has(x)) {
    return reject(new TypeError('循环引用'))
  }

  if (x instanceof PfPromise) {
    visited.add(x)
    x.then(
      (value) => resolvePromise(value, resolve, reject, visited),
      (reason) => reject(reason)
    )
  } else if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    let then
    try {
      then = x.then
    } catch (error) {
      return reject(error)
    }

    if (typeof then === 'function') {
      let called = false
      try {
        visited.add(x)
        then.call(
          x,
          (y) => {
            if (called) return
            called = true
            resolvePromise(y, resolve, reject, visited)
          },
          (r) => {
            if (called) return
            called = true
            reject(r)
          }
        )
      } catch (error) {
        if (!called) {
          reject(error)
        }
      }
    } else {
      resolve(x)
    }
  } else {
    resolve(x)
  }
}
```

[源码](https://github.com/RicardoPang/pf-mini-code/blob/main/src/promise.ts)