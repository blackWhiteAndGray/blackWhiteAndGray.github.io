---
title: 手写vuex源码
description: 核心原理
---

> vuex原理剖析

## 一.Vuex基本使用及用法

> vuex是vue的状态管理工具，为了更方便实现多个组件共享状态

```js
// store/index.js
import Vue from 'vue';
// import Vuex from 'vuex'; // 原生
import Vuex from '../vuex'; // 手写
import a from './modules/a';
import b from './modules/b';

// Vue.use的操作目的是帮我们使用插件
// Vue.use = function (plugin, options) { // use方法默认会将Vue的构造函数传入到插件中 为了解决写插件的时候依赖Vue的问题
//   if (typeof plugin === 'function') {
//     return plugin(this, options);
//   } else {
//     plugin.install(this, options);
//   }
// };
Vue.use(Vuex);

const persitsPlugin = (store) => {
  let persists = localStorage.getItem('VUEX_PERSITS');
  if (persists) {
    store.replaceState(JSON.parse(persists));
  }
  store.subscribe((mutation, state) => {
    localStorage.setItem('VUEX_PERSITS', JSON.stringify(state));
  });
};

const Store = new Vuex.Store({
  strict: true,
  plugins: [persitsPlugin],
  state: {
    age: 12,
    a: 100,
    b: 200,
  },
  getters: {
    myAge(state) {
      return state.age + 20;
    },
  },
  mutations: {
    addAge(state, payload) {
      state.age += payload;
    },
  },
  actions: {
    addAge({ commit }, payload) {
      setTimeout(() => {
        commit('addAge', payload);
      }, 2000);
    },
  },
  modules: {
    a,
    b,
  },
});

setTimeout(() => {
  Store.registerModule('cc', {
    state: {
      a: 66,
      b: 88,
    },
    getters: {
      myA(state) {
        return state.a + 100;
      },
    },
  });
}, 1000);

export default Store;
```

> 这里可以类比：state类比为最贱的状态，getters类比为组件的计算属性，mutation类比为组件中的方法（可以更改组件的状态），actions用于进行一步操作将结构提交给mutation

```vue
// App.vue
<div id="app">
  年龄: {{ this.$store.state.age }}
  我的年龄: {{ this.$store.getters.myAge }}
  我的年龄: {{ this.$store.getters.myAge }}
  我的年龄: {{ this.$store.getters.myAge }}
  <button @click="$store.state.age+=33">修改年龄</button>
  <button @click="$store.commit('b/addAge', 10)">直接mutation修改</button>
  <button @click="$store.dispatch('addAge', 10)">action修改</button>
  <button @click="$store.state.age+=100">错误的修改</button>

  <!-- {{ $store.state.a }} -->
  {{ $store.state.a }}
  {{ $store.state.b }}
  {{ $store.state.cc }}
  ({{ $store.getters.myA }})
</div>
```

> 这个$store属性是通过根实例传入的

```js
// main.js
new Vue({
  store,
  render: (h) => h(App), // 默认引用的是runtime-only 不包含将template -> render函数
}).$mount('#app');
```

> 内部会将store熟悉挂载在每个实例上命名为$store，这样所有组件都可以操作同一个store属性

## 二.自己实现Vuex模块

> 实现入口文件，默认导出Store类和install方法

```js
// vuex/index.js
import { install } from './install';
import Store from './store';

const Vuex = {
  Store, // 容器核心代码
  install, // 将$store属性共享给每个组件 每个组件都可以获取到这个实例 插件的入库 mixin
};

export default Vuex;
```

### 3.1.install方法

```js
// vuex/install.js
export let Vue; // export导出的是一个变量 如果变量变化了导出的结果也会发生变化
export const install = (_Vue, options) => {
  // 需要在所有组件里面都定义一个$store属性共享给每个组件 把根模块中注入的$store共享出去
  Vue = _Vue;
  Vue.mixin({
    // 让所有的组件都能获取到$store实例 此实例找到的就是main.js中注入的实例
    beforeCreate() {
      const options = this.$options; // 获取用户的所有选项
      if (options.store) {
        // 给根实例增加$store属性
        this.$store = options.store;
      } else if (options.parent && options.parent.$store) {
        // 给组件增加$store属性
        this.$store = options.parent.$store;
      }
    },
  });
};
```

> 当我们使用插件时默认会执行install方法并传入Vue的构造函数

### 3.2.实现state

```js
export class Store {
    constructor(options){
        let state = options.state;
        this._vm = new Vue({
            data:{
                $$state:state,
            }
        });
    }
    get state(){
        return this._vm._data.$$state
    }
}
```

> 将用户传入的数据定义在vue的实例上（这个就是vuex核心）产生一个单独的vue实例进行通信，这里要注意的是定义$开头的变量不会被代理到实例上

### 3.3.实现getters

```js
this.getters = {};
const computed = {}
forEachValue(options.getters, (fn, key) => {
    computed[key] = () => {
        return fn(this.state);
    }
    Object.defineProperty(this.getters,key,{
        get:()=> this._vm[key]
    })
});
this._vm = new Vue({
    data: {
        $$state: state,
    },
    computed // 利用计算属性实现缓存
});
```

### 3.4.实现mutations

```js
export class Store {
    constructor(options) {
        this.mutations = {};
        forEachValue(options.mutations, (fn, key) => {
            this.mutations[key] = (payload) => fn.call(this, this.state, payload)
        });
    }
    commit = (type, payload) => {
        this.mutations[type](payload);
    }
}
```

### 3.5.实现actions

```js
export class Store {
    constructor(options) {
        this.actions = {};
        forEachValue(options.actions, (fn, key) => {
            this.actions[key] = (payload) => fn.call(this, this,payload);
        });
    }
    dispatch = (type, payload) => {
        this.actions[type](payload);
    }
}
```

## 三.实现模块机制

### 3.1.格式化用户数据

```js
// vuex/store.js
import ModuleCollection from './module/module-collection';
this.modules = new ModuleCollection(options);
```

```js
// vuex/module/module-collection.js
import { forEachValue } from '../utils';
import Module from './module';

class ModuleCollection {
  // 构建父子关系用栈
  constructor(options) {
    this.register([], options); // 递归实现收集要记录父子关系
  }
  getNamespace(path) {
    let module = this.root;
    return path.reduce((namespace, key) => {
      module = module.getChild(key);
      console.log(module);
      return namespace + (module.namespaced ? key + '/' : '');
    }, '');
  }
  register(path, rootModule) {
    let module = new Module(rootModule); // _raw _children state
    rootModule.wrapperModule = module;
    if (path.length == 0) {
      this.root = module;
    } else {
      // ['a'] ['b']
      // 不是根的情况
      let parent = path.slice(0, -1).reduce((memo, current) => {
        return memo.getChild(current);
      }, this.root);
      parent.addChild(path[path.length - 1], module);
    }
    if (rootModule.modules) {
      // 获取到定义的子模块
      forEachValue(rootModule.modules, (moduleName, moduleValue) => {
        this.register(path.concat(moduleName), moduleValue);
      });
    }
  }
}

export default ModuleCollection;
```

### 3.2.抽离模块类

```js
// vuex/module/module.js
class Module {
  constructor(rootModule) {
    this._raw = rootModule;
    this._children = {};
    this.state = rootModule.state;
  }
  getChild(key) {
    return this._children[key];
  }
  addChild(key, module) {
    this._children[key] = module;
  }
}

export default Module;
```

> 方便模块扩展

### 3.3.安装模块

```js
// vuex/store.js
this.actions = {}; // 存放所有模块的action
this.mutations = {}; // 存放所有模块的mutation
// 将子的状态定义在父的状态上
this.wrapperGetters = {};
// 除了安装 mutation action getters 这些之外 最重要的是状态
const state = options.state;
installModule(this, [], this.modules.root, state); // state跟模块的状态对象
```

在模块类中提供遍历方法

```js
// vuex/module/module.js
import { forEachValue } from '../utils';

class Module {
  constructor(rootModule) {
    this._raw = rootModule;
    this._children = {};
    this.state = rootModule.state;
  }
  get namespaced() {
    return !!this._raw.namespaced;
  }
  getChild(key) {
    return this._children[key];
  }
  addChild(key, module) {
    this._children[key] = module;
  }
  forEachMutation(cb) {
    if (this._raw.mutations) {
      forEachValue(this._raw.mutations, cb);
    }
  }
  forEachAction(cb) {
    if (this._raw.actions) {
      forEachValue(this._raw.actions, cb);
    }
  }
  forEachGetter(cb) {
    if (this._raw.getters) {
      forEachValue(this._raw.getters, cb);
    }
  }
  forEachChildren(cb) {
    forEachValue(this._children, cb);
  }
}

export default Module;
```

对模块进行安装操作

```js
// vuex/store.js
function installModule(store, path, module, rootState) {
  let namespaced = store.modules.getNamespace(path);

  if (path.length > 0) {
    // 是子模块 需要将数据处理到rootState上
    let parent = path.slice(0, -1).reduce((memo, current) => {
      return memo[current];
    }, rootState);
    // 添加一个不存在的属性需要使用Vue.set方法 否则无效
    store.withCommitting(() => {
      Vue.set(parent, path[path.length - 1], module.state);
    });
  }
  // 将循环的方法放到类中来维护 Object.entries(module._raw.mutations)
  module.forEachMutation((mutationKey, mutationValue) => {
    store.mutations[namespaced + mutationKey] =
      store.mutations[namespaced + mutationKey] || [];
    store.mutations[namespaced + mutationKey].push((payload) => {
      store.withCommitting(() => {
        mutationValue(getState(store, path), payload);
      });
      store._subscribes.forEach((callback) =>
        callback({ type: mutationKey }, store.state)
      );
    });
  });
  module.forEachAction((actionKey, actionValue) => {
    store.actions[namespaced + actionKey] =
      store.actions[namespaced + actionKey] || [];
    store.actions[namespaced + actionKey].push((payload) => {
      actionValue(store, payload);
    });
  });
  module.forEachGetter((getterKey, getterValue) => {
    // 应该先判断一下store.getters是否有这个属性 如果有就不必要再注册
    if (store.wrapperGetters[namespaced + getterKey]) {
      return console.error('duplicate key');
    }
    store.wrapperGetters[namespaced + getterKey] = () => {
      return getterValue(getState(store, path));
    };
  });
  // 将循环的方法放到类中来维护 Object.entries(module._children)
  module.forEachChildren((childName, childValue) => {
    installModule(store, path.concat(childName), childValue, rootState);
  });
}
```

对`dispatch`和`action`方法进行重写

```js
// vuex/store.js
dispatch = (actionKey, payload) => {
  let actions = this.actions[actionKey];
  actions && actions.forEach((fn) => fn(payload));
}; // this.actions
commit = (mutationKey, payload) => {
  let mutations = this.mutations[mutationKey];
  mutations && mutations.forEach((fn) => fn(payload));
}; // this.mutations
```

### 3.4.定义状态和计算属性

```js
resetVM(this, state);
```

```js
// vuex/store.js
function resetVM(store, state) {
  let oldVm = store.vm; // 拿到以前的
  const computed = {};
  store.getters = {};
  forEachValue(store.wrapperGetters, (getterKey, getterValue) => {
    computed[getterKey] = () => getterValue(store.state);
    Object.defineProperty(store.getters, getterKey, {
      get: () => store.vm[getterKey], // vuex中的getters只有get
    });
  });
  store.vm = new Vue({
    data: {
      $$state: state,
    },
    computed,
  });
  store.vm.$watch(
    () => store.vm._data.$$state,
    () => {
      console.assert(store._commiting, 'outside mutation...');
    },
    { deep: true, sync: true }
  );
  if (oldVm) {
    Vue.nextTick(() => oldVm.$destroy()); // 卸载之前重新搞一个新的实例
  }
}
```

### 3.5.实现命名空间

```js
// vuex/module/module-collection.js
getNamespace(path) {
  let module = this.root;
  return path.reduce((namespace, key) => {
    module = module.getChild(key);
    console.log(module);
    return namespace + (module.namespaced ? key + '/' : '');
  }, '');
}
```

```js
// vuex/module/module.js
get namespaced() {
  return !!this._raw.namespaced;
}
```

在绑定属性时增加命名空间

```js
// vuex/store.js
function installModule(store, path, module, rootState) {
  let namespaced = store.modules.getNamespace(path);

  if (path.length > 0) {
    // 是子模块 需要将数据处理到rootState上
    let parent = path.slice(0, -1).reduce((memo, current) => {
      return memo[current];
    }, rootState);
    // 添加一个不存在的属性需要使用Vue.set方法 否则无效
    store.withCommitting(() => {
      Vue.set(parent, path[path.length - 1], module.state);
    });
  }
  // 将循环的方法放到类中来维护 Object.entries(module._raw.mutations)
  module.forEachMutation((mutationKey, mutationValue) => {
    store.mutations[namespaced + mutationKey] =
      store.mutations[namespaced + mutationKey] || [];
    store.mutations[namespaced + mutationKey].push((payload) => {
      store.withCommitting(() => {
        mutationValue(getState(store, path), payload);
      });
      store._subscribes.forEach((callback) =>
        callback({ type: mutationKey }, store.state)
      );
    });
  });
  module.forEachAction((actionKey, actionValue) => {
    store.actions[namespaced + actionKey] =
      store.actions[namespaced + actionKey] || [];
    store.actions[namespaced + actionKey].push((payload) => {
      actionValue(store, payload);
    });
  });
  module.forEachGetter((getterKey, getterValue) => {
    // 应该先判断一下store.getters是否有这个属性 如果有就不必要再注册
    if (store.wrapperGetters[namespaced + getterKey]) {
      return console.error('duplicate key');
    }
    store.wrapperGetters[namespaced + getterKey] = () => {
      return getterValue(getState(store, path));
    };
  });
  // 将循环的方法放到类中来维护 Object.entries(module._children)
  module.forEachChildren((childName, childValue) => {
    installModule(store, path.concat(childName), childValue, rootState);
  });
}
```

### 3.6.注册模块

```js
// vuex/store.js
registerModule(path, rawModule) {
  // 如果是一个字符串就包装成数组
  if (!Array.isArray(path)) {
    path = [path];
  }
  this.modules.register(path, rawModule);
  // 安装模块的时候 需要传入的是包装后的不是用户写的
  installModule(this, path, rawModule.wrapperModule, this.state); // 将自己生产的模块装到全局上
  resetVM(this, this.state);
}
```

> 实现模块的注册，就是将当前模块注册到_modules中

```js
function resetVM(store, state) {
+  let oldVm = store.vm; // 拿到以前的
  const computed = {};
  store.getters = {};
  forEachValue(store.wrapperGetters, (getterKey, getterValue) => {
    computed[getterKey] = () => getterValue(store.state);
    Object.defineProperty(store.getters, getterKey, {
      get: () => store.vm[getterKey], // vuex中的getters只有get
    });
  });
  store.vm = new Vue({
    data: {
      $$state: state,
    },
    computed,
  });
  store.vm.$watch(
    () => store.vm._data.$$state,
    () => {
      console.assert(store._commiting, 'outside mutation...');
    },
    { deep: true, sync: true }
  );
  if (oldVm) {
+    Vue.nextTick(() => oldVm.$destroy()); // 卸载之前重新搞一个新的实例
  }
}
```

> 销毁上次创建的实例

## 四.插件机制

### 4.1.使用方式

```js
// store/modules/index.js
const persitsPlugin = (store) => {
  let persists = localStorage.getItem('VUEX_PERSITS');
  if (persists) {
    store.replaceState(JSON.parse(persists));
  }
  store.subscribe((mutation, state) => {
    localStorage.setItem('VUEX_PERSITS', JSON.stringify(state));
  });
};

plugins: [persitsPlugin],
```

> 这里要实现subscribe、replaceState方法

```js
// vuex/store.js

// 执行插件
if (options.plugins) {
  options.plugins.forEach((plugin) => plugin(this));
}
subscribe(callback) {
  this._subscribes.push(callback);
}
replaceState(newState) {
  // 如果直接将状态替换会导致代码里用的是以前的 状态显示的是最新 改以前的不会导致视图更新
  this.withCommitting(() => {
    this.vm._data.$$state = newState;
  });
}
```

### 4.2.获取最新状态

```js
function getState(store, path) {
  return path.reduce((newState, current) => {
    return newState[current];
  }, store.state);
}

// 将循环的方法放到类中来维护 Object.entries(module._raw.mutations)
module.forEachMutation((mutationKey, mutationValue) => {
  store.mutations[namespaced + mutationKey] =
    store.mutations[namespaced + mutationKey] || [];
  store.mutations[namespaced + mutationKey].push((payload) => {
    store.withCommitting(() => {
      mutationValue(getState(store, path), payload);
    });
    store._subscribes.forEach((callback) =>
                              callback({ type: mutationKey }, store.state)
                             );
  });
});
```

> 调用mutation时传入最新状态

## 五.区分mutation和action

```js
withCommitting(fn) {
  this._commiting = true;
  fn(); // 如果这个函数是异步执行 那么_commiting会先变为false
  this._commiting = false;
}
```

```js
store.vm.$watch(
  () => store.vm._data.$$state,
  () => {
    console.assert(store._commiting, 'outside mutation...');
  },
  { deep: true, sync: true }
);
```

> 增加同步watcher，监听状态变化

```js
store.withCommitting(() => {
  mutationValue(getState(store, path), payload);
});
```

> 只有通过mutation更改状态，断言才能通过

```js
replaceState(newState) {
  // 如果直接将状态替换会导致代码里用的是以前的 状态显示的是最新 改以前的不会导致视图更新
  this.withCommitting(() => {
    this.vm._data.$$state = newState;
  });
}
```

```js
// 添加一个不存在的属性需要使用Vue.set方法 否则无效
store.withCommitting(() => {
  Vue.set(parent, path[path.length - 1], module.state);
});
```

> 内部更改状态属于正常更新，所以也许用withCommitting进行包裹

![Vuex](https://p.ipic.vip/chxfk9.png)

[源码](https://github.com/RicardoPang/pf-vuex-source)
