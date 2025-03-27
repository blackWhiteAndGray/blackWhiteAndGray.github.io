---
title: 前端网络请求-TypeScrpt封装Axios
description: 前端网络请求封装
---

> 二次封装 Axios 的目的是确保将来如果需要切换网络请求库，只需修改 `request/index.ts` 文件即可。此外，这种封装还可以增加扩展性，并降低因该库不再维护而带来的风险。

## 一. axios 的二次封装

#### 为什么需要二次封装？

二次封装 `axios` 的主要目的是为了提高代码的可维护性和可扩展性。在一个复杂的项目中，网络请求可能会随着项目的发展而演变，甚至可能需要切换到其他的请求库。通过二次封装 `axios`，我们可以将所有的请求逻辑集中在一个文件中（例如 `request/index.ts`），从而在未来需要替换网络请求库时，只需修改这一个文件即可。这种做法减少了代码的耦合，增加了灵活性，也降低了因库不再维护而带来的风险。

#### 如何实现二次封装？

我们可以通过创建一个 `PFRequest` 类来封装 `axios` 的实例，并在这个类中实现请求方法（如 `get`、`post`、`delete`、`patch`）。这样，我们可以在项目中使用 `PFRequest` 类来统一发起网络请求，而不直接依赖 `axios`。

```tsx
import axios, { AxiosInstance } from 'axios'
import type { PFRequestConfig } from './type'

class PFRequest {
  private instance: AxiosInstance

  constructor(config: PFRequestConfig) {
    this.instance = axios.create(config)
    this.setupGlobalInterceptors(config)
  }

  private setupGlobalInterceptors(config: PFRequestConfig) {
    // 添加全局拦截器
  }

  request<T = any>(config: PFRequestConfig<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.instance.request<any, T>(config).then(resolve).catch(reject)
    })
  }

  get<T = any>(config: PFRequestConfig<T>) {
    return this.request({ ...config, method: 'GET' })
  }

  post<T = any>(config: PFRequestConfig<T>) {
    return this.request({ ...config, method: 'POST' })
  }

  delete<T = any>(config: PFRequestConfig<T>) {
    return this.request({ ...config, method: 'DELETE' })
  }

  patch<T = any>(config: PFRequestConfig<T>) {
    return this.request({ ...config, method: 'PATCH' })
  }
}

export default PFRequest
```

在上面的代码中，我们通过 `PFRequest` 类来封装 `axios` 实例，并提供了 `request`、`get`、`post` 等方法，以便在项目中使用。

## 二. 拦截器封装

#### 为什么需要封装拦截器？

`axios` 提供了全局拦截器和实例拦截器，这些拦截器允许我们在请求发送前或响应返回后对请求和响应进行处理。然而，在实际项目中，我们可能需要根据不同的请求配置不同的拦截器行为。因此，我们需要进一步封装拦截器，以便在每个请求中都能灵活地控制拦截器的行为。

#### 如何实现拦截器封装？

我们可以在 `PFRequest` 类中封装拦截器逻辑，并允许在实例化 `PFRequest` 时传入自定义的拦截器。这些拦截器可以包括请求成功、请求失败、响应成功和响应失败的处理逻辑。

```tsx
private setupGlobalInterceptors(config: PFRequestConfig) {
  const { interceptors } = config;

  this.instance.interceptors.request.use(
    (cfg) => cfg,
    (err) => Promise.reject(err)
  );

  this.instance.interceptors.response.use(
    (res) => res.data,
    (err) => Promise.reject(err)
  );

  if (interceptors) {
    if (this.isRequestInterceptor(interceptors)) {
      this.instance.interceptors.request.use(interceptors.requestSuccessFn, interceptors.requestFailureFn);
    }

    if (this.isResponseInterceptor(interceptors)) {
      this.instance.interceptors.response.use(interceptors.responseSuccessFn, 	  interceptors.responseFailureFn);
    }
  }
}
```

通过封装拦截器，我们可以在项目的不同部分，根据具体需求对请求和响应进行处理，而无需每次都重复编写相同的逻辑。

## 三. 返回值类型泛型处理

#### 为什么需要泛型处理？

在使用 `axios` 时，默认情况下请求返回的响应类型是 `any`。虽然这样可以快速开发，但它会导致类型不安全，并且在大型项目中容易出现隐性错误。为了确保响应数据的类型安全，我们可以使用 TypeScript 的泛型来处理请求返回值的类型。

#### 如何实现泛型处理？

通过在 `PFRequest` 类的 `request` 方法中使用泛型，我们可以在发起请求时指定返回值的类型，确保在处理响应数据时具有正确的类型推导。

```tsx
request<T = any>(config: PFRequestConfig<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    this.instance.request<any, T>(config)
      .then((res) => {
      if (config.interceptors?.responseSuccessFn) {
        res = config.interceptors.responseSuccessFn(res);
      }
      resolve(res);
    })
      .catch(reject);
  });
}
```

在上面的代码中，`request` 方法使用了泛型 `T`，默认类型为 `any`。当我们在项目中使用 `request` 方法时，可以显式指定返回值的类型，这样就能确保类型安全。

## 四. 总结

通过对 `axios` 进行二次封装、封装拦截器逻辑，并结合 TypeScript 的泛型处理返回值类型，我们可以显著提高代码的可维护性、可扩展性和类型安全性。这种封装方式不仅使我们的代码更加灵活，还能有效降低潜在的风险，确保在项目生命周期中的任何阶段都能轻松适应变化。希望这篇文章能为你提供一些实用的技术思路，帮助你在项目中更好地利用 `axios` 和 TypeScript 的强大功能。

[源码](https://github.com/RicardoPang/pf-vue3-ts-template/blob/main/src/service/index.ts)
