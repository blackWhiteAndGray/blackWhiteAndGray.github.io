---
layout: post
title: 'Typescript 安全编码的秘密武器'
subtitle: '类型系统'
date: 2025-02-20
author: 'ZhuLang'
header-img: 'img/post-bg-apple-event-2015.jpg'
catalog: true
tags:
  - Web
  - JavaScript
  - TypeScript
---

## 1. typescript 是什么

- Typescript 是由微软开发的一款开源的编程语言
- Typescript 是 Javascript 的超集，遵循最新的 ES5/ES6 规范。TypeScript 扩展了 Javascript 语法
- TypeScript 更像后端 Java、C#这样的面向对象语言可以让 JS 开发大型企业应用
- 越来越多的项目是基于 TS 的，比如 VSCode、Angular6、Vue3、React16
- TS 提供的类型系统可以帮助我们在写代码的时候提供更丰富的语法提示
- 在创建前的编译阶段经过类型系统的检查，就可以避免很多线上的错误

## 2. TypeScript 安装和编译

### 2.1 安装

```js
cnpm i typescript -g
tsc helloworld.ts
```

### 2.2 Vscode+TypeScript

#### 2.2.1 生成配置文件

```js
tsc --init
{
  "compilerOptions": {
    /* Basic Options */
    "target": "es5",                          /* Specify ECMAScript target version: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017','ES2018' or 'ESNEXT'. 指定ECMAScript的目标版本*/
    "module": "commonjs",                     /* Specify module code generation: 'none', 'commonjs', 'amd', 'system', 'umd', 'es2015', or 'ESNext'. 指定模块代码的生成方式*/
    // "lib": [],                             /* Specify library files to be included in the compilation. 指定编译的时候用来包含的编译文件*/
    // "allowJs": true,                       /* Allow javascript files to be compiled. 允许编译JS文件*/
    // "checkJs": true,                       /* Report errors in .js files. 在JS中包括错误*/
    // "jsx": "preserve",                     /* Specify JSX code generation: 'preserve', 'react-native', or 'react'. 指定JSX代码的生成方式 是保留还是react-native或者react*/
    // "declaration": true,                   /* Generates corresponding '.d.ts' file.生成相应的类型声明文件 */
    // "declarationMap": true,                /* Generates a sourcemap for each corresponding '.d.ts' file. 为每个类型声明文件生成相应的sourcemap*/
    // "sourceMap": true,                     /* Generates corresponding '.map' file. 生成对应的map文件 */
    // "outFile": "./",                       /* Concatenate and emit output to single file. 合并并且把编译后的内容输出 到一个文件里*/
    // "outDir": "./",                        /* Redirect output structure to the directory.按原始结构输出到目标目录 */
    // "rootDir": "./",                       /* Specify the root directory of input files. Use to control the output directory structure with --outDir. 指定输入文件的根目录，用--outDir来控制输出的目录结构*/
    // "composite": true,                     /* Enable project compilation 启用项目编译*/
    // "removeComments": true,                /* Do not emit comments to output. 移除注释*/
    // "noEmit": true,                        /* Do not emit outputs. 不要输出*/
    // "importHelpers": true,                 /* Import emit helpers from 'tslib'. */
    // "downlevelIteration": true,            /* Provide full support for iterables in 'for-of', spread, and destructuring when targeting 'ES5' or 'ES3'. 当目标是ES5或ES3的时候提供对for-of、扩展运算符和解构赋值中对于迭代器的完整支持*/
    // "isolatedModules": true,               /* Transpile each file as a separate module (similar to 'ts.transpileModule').r把每一个文件转译成一个单独的模块 */

    /* Strict Type-Checking Options */
    //"strict": true,                           /* Enable all strict type-checking options. 启用完全的严格类型检查 */
    // "noImplicitAny": true,                 /* Raise error on expressions and declarations with an implied 'any' type. 不能使用隐式的any类型*/
    // "strictNullChecks": true,              /* Enable strict null checks. 启用严格的NULL检查*/
    // "strictFunctionTypes": true,           /* Enable strict checking of function types. 启用严格的函数类型检查*/
    // "strictBindCallApply": true,           /* Enable strict 'bind', 'call', and 'apply' methods on functions.启用函数上严格的bind call 和apply方法 */
    // "strictPropertyInitialization": true,  /* Enable strict checking of property initialization in classes. 启用类上初始化属性检查*/
    // "noImplicitThis": true,                /* Raise error on 'this' expressions with an implied 'any' type.在默认的any中调用 this表达式报错 */
    // "alwaysStrict": true,                  /* Parse in strict mode and emit "use strict" for each source file. 在严格模式下解析并且向每个源文件中发射use strict*/

    /* Additional Checks */
    // "noUnusedLocals": true,                /* Report errors on unused locals. 有未使用到的本地变量时报错 */
    // "noUnusedParameters": true,            /* Report errors on unused parameters. 有未使用到的参数时报错*/
    // "noImplicitReturns": true,             /* Report error when not all code paths in function return a value. 当不是所有的代码路径都有返回值的时候报错*/
    // "noFallthroughCasesInSwitch": true,    /* Report errors for fallthrough cases in switch statement. 在switch表达式中没有替代的case会报错 */

    /* Module Resolution Options */
    // "moduleResolution": "node",            /* Specify module resolution strategy: 'node' (Node.js) or 'classic' (TypeScript pre-1.6). 指定模块的解析策略 node classic*/
    // "baseUrl": "./",                       /* Base directory to resolve non-absolute module names. 在解析非绝对路径模块名的时候的基准路径*/
    // "paths": {},                           /* A series of entries which re-map imports to lookup locations relative to the 'baseUrl'. 一些路径的集合*/
    // "rootDirs": [],                        /* List of root folders whose combined content represents the structure of the project at runtime. 根目录的列表，在运行时用来合并内容*/
    // "typeRoots": [],                       /* List of folders to include type definitions from. 用来包含类型声明的文件夹列表*/
    // "types": [],                           /* Type declaration files to be included in compilation.在编译的时候被包含的类型声明 */
    // "allowSyntheticDefaultImports": true,  /* Allow default imports from modules with no default export. This does not affect code emit, just typechecking.当没有默认导出的时候允许默认导入，这个在代码执行的时候没有作用，只是在类型检查的时候生效 */
    //"esModuleInterop": true                   /* Enables emit interoperability between CommonJS and ES Modules via creation of namespace objects for all imports. Implies 'allowSyntheticDefaultImports'.*/
    // "preserveSymlinks": true,              /* Do not resolve the real path of symlinks.不要symlinks解析的真正路径 */

    /* Source Map Options */
    // "sourceRoot": "",                      /* Specify the location where debugger should locate TypeScript files instead of source locations. 指定ts文件位置*/
    // "mapRoot": "",                         /* Specify the location where debugger should locate map files instead of generated locations. 指定 map文件存放的位置 */
    // "inlineSourceMap": true,               /* Emit a single file with source maps instead of having a separate file. 源文件和sourcemap 文件在同一文件中，而不是把map文件放在一个单独的文件里*/
    // "inlineSources": true,                 /* Emit the source alongside the sourcemaps within a single file; requires '--inlineSourceMap' or '--sourceMap' to be set. 源文件和sourcemap 文件在同一文件中*/

    /* Experimental Options */
    // "experimentalDecorators": true,        /* Enables experimental support for ES7 decorators. 启动装饰器*/
    // "emitDecoratorMetadata": true,         /* Enables experimental support for emitting type metadata for decorators. */
  }
}
```

#### 2.2.2 执行编译

```js
tsc;
```

#### 2.2.3 vscode 运行

- Terminal->Run Task-> tsc:build 编译
- Terminal->Run Task-> tsc:watch 编译并监听

#### 2.2.4 npm scripts

- npm run 实际上是调用本地的 Shell 来执行对应的 script value，所以理论上能兼容所有 bash 命令
- Shell 在类 Unix 系统上是 /bin/sh，在 Windows 上是 cmd.exe

#### 2.2.5 npm scripts 的 PATH

- npm run 会预置 PATH，对应包下的 node_modules/.bin 目录

## 3. 数据类型

### 3.1 布尔类型(boolean)

```js
let married: boolean = false;
```

### 3.2 数字类型(number)

```js
let age: number = 10;
```

### 3.3 字符串类型(string)

```js
let firstname: string = 'pfpx';
```

### 3.4 数组类型(array)

```js
let arr2: number[] = [4, 5, 6];
let arr3: Array<number> = [7, 8, 9];
```

### 3.5 元组类型(tuple)

- 在 TypeScript 的基础类型中，元组（ Tuple ）表示一个已知`数量`和`类型`的数组

```js
let pf: [string, number] = ['pf', 5];
pf[0].length;
pf[1].toFixed(2);
```

| 元组                   | 数组                 |
| :--------------------- | :------------------- |
| 每一项可以是不同的类型 | 每一项都是同一种类型 |
| 有预定义的长度         | 没有长度限制         |
| 用于表示一个固定的结构 | 用于表示一个列表     |

```js
const animal: [string, number, boolean] = ['pf', 10, true];
```

### 3.6 枚举类型(enum)

- 事先考虑某一个变量的所有的可能的值，尽量用自然语言中的单词表示它的每一个值
- 比如性别、月份、星期、颜色、单位、学历

#### 3.6.1 普通枚举

```js
enum Gender{
    GIRL,
    BOY
}
console.log(`李雷是${Gender.BOY}`);
console.log(`韩梅梅是${Gender.GIRL}`);

enum Week{
    MONDAY=1,
    TUESDAY=2
}
console.log(`今天是星期${Week.MONDAY}`);
```

#### 3.6.2 常数枚举

- 常数枚举与普通枚举的区别是，它会在编译阶段被删除，并且不能包含计算成员。
- 假如包含了计算成员，则会在编译阶段报错

```js
const enum Colors {
    Red,
    Yellow,
    Blue
}

let myColors = [Colors.Red, Colors.Yellow, Colors.Blue];
const enum Color {Red, Yellow, Blue = "blue".length};
```

### 3.7 任意类型(any)

- `any`就是可以赋值给任意类型
- 第三方库没有提供类型文件时可以使用`any`
- 类型转换遇到困难时
- 数据结构太复杂难以定义

```js
let root:any=document.getElementById('root');
root.style.color='red';
let root:(HTMLElement|null)=document.getElementById('root');
root!.style.color='red';//非空断言操作符
```

### 3.8 null 和 undefined

- null 和 undefined 是其它类型的子类型，可以赋值给其它类型，如数字类型，此时，赋值后的类型会变成 null 或 undefined
- `strictNullChecks` 参数用于新的严格空检查模式,在严格空检查模式下， null 和 undefined 值都不属于任何一个类型，它们只能赋值给自己这种类型或者 any

```js
let x: number;
x = 1;
x = undefined;
x = null;

let y: number | null | undefined;
y = 1;
y = undefined;
y = null;
```

### 3.9 void 类型

- void 表示没有任何类型
- 当一个函数没有返回值时，TS 会认为它的返回值是 void 类型。

```js
function greeting(name: string): void {
  console.log('hello', name);
  //当我们声明一个变量类型是 void 的时候，它的非严格模式(strictNullChecks:false)下仅可以被赋值为 null 和 undefined
  //严格模式(strictNullChecks:true)下只能返回undefined
  //return null;
  //return undefined;
}
```

### 3.10 never 类型

never 是其它类型(null undefined)的子类型，代表不会出现的值

#### 3.10.1

- 作为不会返回（ return ）的函数的返回值类型

```js
// 返回never的函数 必须存在 无法达到（ unreachable ） 的终点
function error(message: string): never {
  throw new Error(message);
}
let result1 = error('hello');
// 由类型推论得到返回值为 never
function fail() {
  return error('Something failed');
}
let result = fail();

// 返回never的函数 必须存在 无法达到（ unreachable ） 的终点
function infiniteLoop(): never {
  while (true) {}
}
```

#### 3.10.2 strictNullChecks

- 在 TS 中， null 和 undefined 是任何类型的有效值，所以无法正确地检测它们是否被错误地使用。于是 TS 引入了 --strictNullChecks 这一种检查模式
- 由于引入了 --strictNullChecks ，在这一模式下，null 和 undefined 能被检测到。所以 TS 需要一种新的底部类型（ bottom type ）。所以就引入了 never。

```js
// Compiled with --strictNullChecks
function fn(x: number | string) {
  if (typeof x === 'number') {
    // x: number 类型
  } else if (typeof x === 'string') {
    // x: string 类型
  } else {
    // x: never 类型
    // --strictNullChecks 模式下，这里的代码将不会被执行，x 无法被观察
  }
}
```

#### 3.10.3 never 和 void 的区别

- void 可以被赋值为 null 和 undefined 的类型。 never 则是一个不包含值的类型。
- 拥有 void 返回值类型的函数能正常运行。拥有 never 返回值类型的函数无法正常返回，无法终止，或会抛出异常。

#### 3.11 Symbol

- 我们在使用 Symbol 的时候，必须添加 es6 的编译辅助库
- Symbol 是在 ES2015 之后成为新的原始类型,它通过 Symbol 构造函数创建
- Symbol 的值是唯一不变的

```js
const sym1 = Symbol('key');
const sym2 = Symbol('key');
Symbol('key') === Symbol('key'); // false
```

#### 3.12 BigInt

- 使用 BigInt 可以安全地存储和操作大整数
- 我们在使用 `BigInt` 的时候，必须添加 `ESNext` 的编译辅助库
- 要使用`1n`需要 `"target": "ESNext"`
- number 和 BigInt 类型不一样,不兼容

```js
const max = Number.MAX_SAFE_INTEGER; // 2**53-1
console.log(max + 1 === max + 2);
const max = BigInt(Number.MAX_SAFE_INTEGER);
console.log(max + 1n === max + 2n);
let foo: number;
let bar: bigint;
foo = bar;
bar = foo;
```

### 3.13 类型推论

- 是指编程语言中能够自动推导出值的类型的能力，它是一些强静态类型语言中出现的特性
- 定义时未赋值就会推论成 any 类型
- 如果定义的时候就赋值就能利用到类型推论

```js
let username2;
username2 = 10;
username2 = 'pf';
username2 = null;
```

### 3.14 包装对象（Wrapper Object）

- JavaScript 的类型分为两种：原始数据类型（Primitive data types）和对象类型（Object types）。
- 所有的原始数据类型都没有属性（property）
- 原始数据类型
  - 布尔值
  - 数值
  - 字符串
  - null
  - undefined
  - Symbol

```js
let name = 'pf';
console.log(name.toUpperCase());

console.log(new String('pf').toUpperCase());
```

- 当调用基本数据类型方法的时候，JavaScript 会在原始数据类型和对象类型之间做一个迅速的强制性切换

```js
let isOK: boolean = true; // 编译通过
let isOK: boolean = Boolean(1); // 编译通过
let isOK: boolean = new Boolean(1); // 编译失败   期望的 isOK 是一个原始数据类型
```

### 3.15 联合类型

- 联合类型（Union Types）表示取值可以为多种类型中的一种
- 未赋值时联合类型上只能访问两个类型共有的属性和方法

```js
let name: string | number;
console.log(name.toString());
name = 3;
console.log(name.toFixed(2));
name = 'pf';
console.log(name.length);

export {};
```

### 3.16 类型断言

- 类型断言可以将一个联合类型的变量，指定为一个更加具体的类型
- 不能将联合类型断言为不存在的类型

```js
let name: string | number;
console.log((name as string).length);
console.log((name as number).toFixed(2));
console.log((name as boolean));
```

双重断言

```js
interface Person {
    name: string;
    age: number;
}
const person = 'pf' as any as Person; // ok
```

### 3.17 字面量类型和类型字面量

- 字面量类型的要和实际的值的字面量一一对应,如果不一致就会报错
- 类型字面量和对象字面量的语法很相似

```js
const up: 'Up' = 'Up';
const down: 'Down' = 'Down';
const left: 'Left' = 'Left';
const right: 'Right' = 'Right';
type Direction = 'Up' | 'Down' | 'Left' | 'Right';
function move(direction: Direction) {}
move('Up');
type Person = {
  name: string,
  age: number,
};
```

### 3.18 字符串字面量 vs 联合类型

- 字符串字面量类型用来约束取值只能是某`几个字符串`中的一个, 联合类型（Union Types）表示取值可以为`多种类型`中的一种
- 字符串字面量 限定了使用该字面量的地方仅接受特定的值,联合类型 对于值并没有限定，仅仅限定值的类型需要保持一致

## 4. 函数

### 4.1 函数的定义

- 可以指定参数的类型和返回值的类型

```js
function hello(name: string): void {
  console.log('hello', name);
}
hello('pfpx');
```

### 4.2 函数表达式

- 定义函数类型

```js
type GetUsernameFunction = (x: string, y: string) => string;
let getUsername: GetUsernameFunction = function (firstName, lastName) {
  return firstName + lastName;
};
```

### 4.3 没有返回值

```js
let hello2 = function (name: string): void {
  console.log('hello2', name);
  return undefined;
};
hello2('pf');
```

### 4.4 可选参数

在 TS 中函数的形参和实参必须一样，不一样就要配置可选参数,而且必须是最后一个参数

```js
function print(name: string, age?: number): void {
  console.log(name, age);
}
print('pfpx');
```

### 4.5 默认参数

```js
function ajax(url: string, method: string = 'GET') {
  console.log(url, method);
}
ajax('/users');
```

### 4.6 剩余参数

```js
function sum(...numbers: number[]) {
  return numbers.reduce((val, item) => (val += item), 0);
}
console.log(sum(1, 2, 3));
```

### 4.7 函数重载

- 在 Java 中的重载，指的是两个或者两个以上的同名函数，参数不一样
- 在 TypeScript 中，表现为给同一个函数提供多个函数类型定义

```js
let obj: any={};
function attr(val: string): void;
function attr(val: number): void;
function attr(val:any):void {
    if (typeof val === 'string') {
        obj.name=val;
    } else {
        obj.age=val;
    }
}
attr('pfpx');
attr(9);
attr(true);
console.log(obj);
```

## 5. 类

### 5.1 如何定义类

- "strictPropertyInitialization": true / _启用类属性初始化的严格检查_/
- name!:string

```js
class Person {
  name: string;
  getName(): void {
    console.log(this.name);
  }
}
let p1 = new Person();
p1.name = 'pf';
p1.getName();
/**
 * 当我们写一个类的时候,会得到2个类型
 * 1. 构造函数类型的函数类型
 * 2. 类的实例类型
 */
class Component {
  static myName: string = '静态名称属性';
  myName: string = '实例名称属性';
}
let com = Component;
//Component类名本身表示的是实例的类型
//ts 一个类型 一个叫值
//冒号后面的是类型
//放在=后面的是值
let c: Component = new Component();
let f: typeof Component = com;
```

### 5.2 存取器

- 在 TypeScript 中，我们可以通过存取器来改变一个类中属性的读取和赋值行为
- 构造函数
  - 主要用于初始化类的成员变量属性
  - 类的对象创建时自动调用执行
  - 没有返回值

```js
class User {
  myname: string;
  constructor(myname: string) {
    this.myname = myname;
  }
  get name() {
    return this.myname;
  }
  set name(value) {
    this.myname = value;
  }
}

let user = new User('pf');
user.name = 'jiagou';
console.log(user.name);
('use strict');
var User = /** @class */ (function () {
  function User(myname) {
    this.myname = myname;
  }
  Object.defineProperty(User.prototype, 'name', {
    get: function () {
      return this.myname;
    },
    set: function (value) {
      this.myname = value;
    },
    enumerable: true,
    configurable: true,
  });
  return User;
})();
var user = new User('pf');
user.name = 'jiagou';
console.log(user.name);
```

### 5.3 参数属性

```js
class User {
    constructor(public myname: string) {}
    get name() {
        return this.myname;
    }
    set name(value) {
        this.myname = value;
    }
}

let user = new User('pf');
console.log(user.name);
user.name = 'jiagou';
console.log(user.name);
```

### 5.4 readonly

- readonly 修饰的变量只能在`构造函数`中初始化
- 在 TypeScript 中，const 是`常量`标志符，其值不能被重新分配
- TypeScript 的类型系统同样也允许将 interface、type、 class 上的属性标识为 readonly
- readonly 实际上只是在`编译`阶段进行代码检查。而 const 则会在`运行时`检查（在支持 const 语法的 JavaScript 运行时环境中）

```js
class Animal {
    public readonly name: string
    constructor(name:string) {
        this.name = name;
    }
    changeName(name:string){
        this.name = name;
    }
}

let a = new Animal('pf');
a.changeName('jiagou');
```

### 5.5 继承

- 子类继承父类后子类的实例就拥有了父类中的属性和方法，可以增强代码的可复用性
- 将子类公用的方法抽象出来放在父类中，自己的特殊逻辑放在子类中重写父类的逻辑
- super 可以调用父类上的方法和属性

```js
class Person {
  name: string; //定义实例的属性，默认省略public修饰符
  age: number;
  constructor(name: string, age: number) {
    //构造函数
    this.name = name;
    this.age = age;
  }
  getName(): string {
    return this.name;
  }
  setName(name: string): void {
    this.name = name;
  }
}
class Student extends Person {
  no: number;
  constructor(name: string, age: number, no: number) {
    super(name, age);
    this.no = no;
  }
  getNo(): number {
    return this.no;
  }
}
let s1 = new Student('pfpx', 10, 1);
console.log(s1);
```

### 5.6 类里面的修饰符

```js
class Father {
    public name: string;  //类里面 子类 其它任何地方外边都可以访问
    protected age: number; //类里面 子类 都可以访问,其它任何地方不能访问
    private money: number; //类里面可以访问， 子类和其它任何地方都不可以访问
    constructor(name:string,age:number,money:number) {//构造函数
        this.name=name;
        this.age=age;
        this.money=money;
    }
    getName():string {
        return this.name;
    }
    setName(name:string): void{
        this.name=name;
    }
}
class Child extends Father{
    constructor(name:string,age:number,money:number) {
        super(name,age,money);
    }
    desc() {
        console.log(`${this.name} ${this.age} ${this.money}`);
    }
}

let child = new Child('pfpx',10,1000);
console.log(child.name);
console.log(child.age);
console.log(child.money);
```

### 5.7 静态属性 静态方法

```js
class Father {
    static className='Father';
    static getClassName() {
        return Father.className;
    }
    public name: string;
    constructor(name:string) {//构造函数
        this.name=name;
    }

}
console.log(Father.className);
console.log(Father.getClassName());
```

### 5.8 装饰器

- 装饰器是一种特殊类型的声明，它能够被附加到类声明、方法、属性或参数上，可以修改类的行为
- 常见的装饰器有类装饰器、属性装饰器、方法装饰器和参数装饰器
- 装饰器的写法分为普通装饰器和装饰器工厂

```js
class Person {
  say() {
    console.log('hello');
  }
}

function Person() {}
Object.defineProperty(Person.prototype, 'say', {
  value: function () {
    console.log('hello');
  },
  enumerable: false,
  configurable: true,
  writable: true,
});
```

#### 5.8.1 类装饰器

- 类装饰器在类声明之前声明，用来监视、修改或替换类定义

```js
namespace a {
    //当装饰器作为修饰类的时候，会把构造器传递进去
    function addNameEat(constructor: Function) {
      constructor.prototype.name = "pf";
      constructor.prototype.eat = function () {
        console.log("eat");
      };
    }
    @addNameEat
    class Person {
      name!: string;
      eat!: Function;
      constructor() {}
    }
    let p: Person = new Person();
    console.log(p.name);
    p.eat();
}

namespace b {
    //还可以使用装饰器工厂
    function addNameEatFactory(name:string) {
    return function (constructor: Function) {
        constructor.prototype.name = name;
        constructor.prototype.eat = function () {
        console.log("eat");
        };
    };
    }
    @addNameEatFactory('pf')
    class Person {
      name!: string;
      eat!: Function;
      constructor() {}}
    let p: Person = new Person();
    console.log(p.name);
    p.eat();
}

namespace c {
    //还可以替换类,不过替换的类要与原类结构相同
    function enhancer(constructor: Function) {
    return class {
        name: string = "jiagou";
        eat() {
        console.log("吃饭饭");
        }
    };
    }
    @enhancer
    class Person {
      name!: string;
      eat!: Function;
      constructor() {}}
    let p: Person = new Person();
    console.log(p.name);
    p.eat();

}
```

#### 5.8.2 属性装饰器

- 属性装饰器表达式会在运行时当作函数被调用，传入下列 2 个参数
- 属性装饰器用来装饰属性
  - 第一个参数对于静态成员来说是类的构造函数，对于实例成员是类的原型对象
  - 第二个参数是属性的名称
- 方法装饰器用来装饰方法
  - 第一个参数对于静态成员来说是类的构造函数，对于实例成员是类的原型对象
  - 第二个参数是方法的名称
  - 第三个参数是方法描述符

```js
namespace d {
    //修饰实例属性
    function upperCase(target: any, propertyKey: string) {
        let value = target[propertyKey];
        const getter = function () {
            return value;
        }
        // 用来替换的setter
        const setter = function (newVal: string) {
            value = newVal.toUpperCase()
        };
        // 替换属性，先删除原先的属性，再重新定义属性
        if (delete target[propertyKey]) {
            Object.defineProperty(target, propertyKey, {
                get: getter,
                set: setter,
                enumerable: true,
                configurable: true
            });
        }
    }
    //修饰实例方法
    function noEnumerable(target: any, property: string, descriptor: PropertyDescriptor) {
        console.log('target.getName', target.getName);
        console.log('target.getAge', target.getAge);
        descriptor.enumerable = true;
    }
    //重写方法
    function toNumber(target: any, methodName: string, descriptor: PropertyDescriptor) {
        let oldMethod = descriptor.value;
        descriptor.value = function (...args: any[]) {
            args = args.map(item => parseFloat(item));
            return oldMethod.apply(this, args);
        }
    }
    class Person {
        @upperCase
        name: string = 'pf'
        public static age: number = 10
        constructor() { }
        @noEnumerable
        getName() {
            console.log(this.name);
        }
        @toNumber
        sum(...args: any[]) {
            return args.reduce((accu: number, item: number) => accu + item, 0);
        }
    }
    let p: Person = new Person();
    for (let attr in p) {
        console.log('attr=', attr);
    }
    p.name = 'jiagou';
    p.getName();
    console.log(p.sum("1", "2", "3"));
}
```

#### 5.8.3 参数装饰器

- 会在运行时当作函数被调用，可以使用参数装饰器为类的原型增加一些元数据
  - 第 1 个参数对于静态成员是类的构造函数，对于实例成员是类的原型对象
  - 第 2 个参数的名称
  - 第 3 个参数在函数列表中的索引

```js
namespace d {
    interface Person {
        age: number;
    }
    function addAge(target: any, methodName: string, paramsIndex: number) {
        console.log(target);
        console.log(methodName);
        console.log(paramsIndex);
        target.age = 10;
    }
    class Person {
        login(username: string, @addAge password: string) {
            console.log(this.age, username, password);
        }
    }
    let p = new Person();
    p.login('pf', '123456')
}
```

#### 5.8.4 装饰器执行顺序

- 有多个参数装饰器时：从最后一个参数依次向前执行
- 方法和方法参数中参数装饰器先执行。
- 类装饰器总是最后执行
- 方法和属性装饰器，谁在前面谁先执行。因为参数属于方法一部分，所以参数会一直紧紧挨着方法执行
- 类比 React 组件的 componentDidMount 先上后下、先内后外

```js
namespace e {
    function Class1Decorator() {
        return function (target: any) {
            console.log("类1装饰器");
        }
    }
    function Class2Decorator() {
        return function (target: any) {
            console.log("类2装饰器");
        }
    }
    function MethodDecorator() {
        return function (target: any, methodName: string, descriptor: PropertyDescriptor) {
            console.log("方法装饰器");
        }
    }
    function Param1Decorator() {
        return function (target: any, methodName: string, paramIndex: number) {
            console.log("参数1装饰器");
        }
    }
    function Param2Decorator() {
        return function (target: any, methodName: string, paramIndex: number) {
            console.log("参数2装饰器");
        }
    }
    function PropertyDecorator(name: string) {
        return function (target: any, propertyName: string) {
            console.log(name + "属性装饰器");
        }
    }

    @Class1Decorator()
    @Class2Decorator()
    class Person {
        @PropertyDecorator('name')
        name: string = 'pf';
        @PropertyDecorator('age')
        age: number = 10;
        @MethodDecorator()
        greet(@Param1Decorator() p1: string, @Param2Decorator() p2: string) { }
    }
}
/**
name属性装饰器
age属性装饰器
参数2装饰器
参数1装饰器
方法装饰器
类2装饰器
类1装饰器
 */
```

### 5.9 抽象类

- 抽象描述一种抽象的概念，无法被实例化，只能被继承
- 无法创建抽象类的实例
- 抽象方法不能在抽象类中实现，只能在抽象类的具体子类中实现，而且必须实现

```js
abstract class Animal {
    name!:string;
    abstract speak():void;
}
class Cat extends Animal{
    speak(){
        console.log('喵喵喵');
    }
}
let animal = new Animal();//Cannot create an instance of an abstract class
animal.speak();
let cat = new Cat();
cat.speak();
```

| 访问控制修饰符   | private protected public |
| :--------------- | :----------------------- |
| 只读属性         | readonly                 |
| 静态属性         | static                   |
| 抽象类、抽象方法 | abstract                 |

### 5.10 抽象方法

- 抽象类和方法不包含具体实现，必须在子类中实现
- 抽象方法只能出现在抽象类中
- 子类可以对抽象类进行不同的实现

```js
abstract class Animal{
    abstract speak():void;
}
class Dog extends  Animal{
    speak(){
        console.log('小狗汪汪汪');
    }
}
class Cat extends  Animal{
    speak(){
        console.log('小猫喵喵喵');
    }
}
let dog=new Dog();
let cat=new Cat();
dog.speak();
cat.speak();
```

### 5.11 重写(override) vs 重载(overload)

- 重写是指子类重写继承自父类中的方法
- 重载是指为同一个函数提供多个类型定义

```js
class Animal{
    speak(word:string):string{
        return '动作叫:'+word;
    }
}
class Cat extends Animal{
    speak(word:string):string{
        return '猫叫:'+word;
    }
}
let cat = new Cat();
console.log(cat.speak('hello'));
//--------------------------------------------
function double(val:number):number
function double(val:string):string
function double(val:any):any{
  if(typeof val == 'number'){
    return val *2;
  }
  return val + val;
}

let r = double(1);
console.log(r);
```

### 5.12 继承 vs 多态

- 继承(Inheritance)子类继承父类，子类除了拥有父类的所有特性外，还有一些更具体的特性
- 多态(Polymorphism)由继承而产生了相关的不同的类，对同一个方法可以有不同的行为

```js
class Animal {
  speak(word: string): string {
    return 'Animal: ' + word;
  }
}
class Cat extends Animal {
  speak(word: string): string {
    return 'Cat:' + word;
  }
}
class Dog extends Animal {
  speak(word: string): string {
    return 'Dog:' + word;
  }
}
let cat = new Cat();
console.log(cat.speak('hello'));
let dog = new Dog();
console.log(dog.speak('hello'));
```

## 6. 接口

- 接口一方面可以在面向对象编程中表示为`行为的抽象`，另外可以用来描述`对象的形状`
- 接口就是把一些类中共有的属性和方法抽象出来,可以用来约束实现此接口的类
- 一个类可以继承另一个类并实现多个接口
- 接口像插件一样是用来增强类的，而抽象类是具体类的抽象概念
- 一个类可以实现多个接口，一个接口也可以被多个类实现，但一个类的可以有多个子类，但只能有一个父类

### 6.1 接口

- interface 中可以用分号或者逗号分割每一项，也可以什么都不加

#### 6.1.1 对象的形状

```js
//接口可以用来描述`对象的形状`,少属性或者多属性都会报错
interface Speakable {
  speak(): void;
  name?: string; //？表示可选属性
}

let speakman: Speakable = {
  speak() {}, //少属性会报错
  name,
  age, //多属性也会报错
};
```

#### 6.1.2 行为的抽象

```js
//接口可以在面向对象编程中表示为行为的抽象
interface Speakable {
  speak(): void;
}
interface Eatable {
  eat(): void;
}
//一个类可以实现多个接口
class Person implements Speakable, Eatable {
  speak() {
    console.log('Person说话');
  }
  eat() {}
}
class TangDuck implements Speakable {
  speak() {
    console.log('TangDuck说话');
  }
  eat() {}
}
```

#### 6.1.3 任意属性

```js
//无法预先知道有哪些新的属性的时候,可以使用 `[propName:string]:any`,propName名字是任意的
interface Person {
  readonly id: number;
  name: string;
  [propName: string]: any;
}

let p1 = {
  id:1,
  name:'pf',
  age:10
}
```

### 6.2 接口的继承

- 一个接口可以继承自另外一个接口

```js
interface Speakable {
  speak(): void;
}
interface SpeakChinese extends Speakable {
  speakChinese(): void;
}
class Person implements SpeakChinese {
  speak() {
    console.log('Person');
  }
  speakChinese() {
    console.log('speakChinese');
  }
}
```

### 6.3 readonly

- 用 readonly 定义只读属性可以避免由于多人协作或者项目较为复杂等因素造成对象的值被重写

```js
interface Person{
  readonly id:number;
  name:string
}
let tom:Person = {
  id :1,
  name:'pf'
}
tom.id = 1;
```

### 6.4 函数类型接口

- 对方法传入的参数和返回值进行约束

```js
interface discount {
  (price: number): number;
}
let cost: discount = function (price: number): number {
  return price * 0.8;
};
```

### 6.5 可索引接口

- 对数组和对象进行约束
- userInterface 表示`index`的类型是 number，那么值的类型必须是 string
- UserInterface2 表示：`index` 的类型是 string，那么值的类型必须是 string

```js
interface UserInterface {
  [index: number]: string;
}
let arr: UserInterface = ['pfpx1', 'pfpx2'];
console.log(arr);

interface UserInterface2 {
  [index: string]: string;
}
let obj: UserInterface2 = { name: 'pf' };
```

### 6.6 类接口

- 对类的约束

```js
interface Speakable {
    name: string;
    speak(words: string): void
}
class Dog implements Speakable {
    name!: string;
    speak(words:string) {
        console.log(words);
    }
}
let dog = new Dog();
dog.speak('汪汪汪');
```

### 6.7 构造函数的类型

- 在 TypeScript 中，我们可以用 interface 来描述类
- 同时也可以使用 interface 里特殊的 new()关键字来描述类的构造函数类型

```js
class Animal{
  constructor(public name:string){
  }
}
//不加new是修饰函数的,加new是修饰类的
interface WithNameClass{
  new(name:string):Animal
}
function createAnimal(clazz:WithNameClass,name:string){
   return new clazz(name);
}
let a = createAnimal(Animal,'pf');
console.log(a.name);
```

### 6.8 抽象类 vs 接口

- 不同类之间公有的属性或方法，可以抽象成一个接口（Interfaces）
- 而抽象类是供其他类继承的基类，抽象类不允许被实例化。抽象类中的抽象方法必须在子类中被实现
- 抽象类本质是一个无法被实例化的类，其中能够实现方法和初始化属性，而接口仅能够用于描述,既不提供方法的实现，也不为属性进行初始化
- 一个类可以继承一个类或抽象类，但可以实现（implements）多个接口
- 抽象类也可以实现接口

```js
abstract class Animal{
    name:string;
    constructor(name:string){
      this.name = name;
    }
    abstract speak():void;
  }
interface Flying{
      fly():void
}
class Duck extends Animal implements Flying{
      speak(){
          console.log('汪汪汪');
      }
      fly(){
          console.log('我会飞');
      }
}
let duck = new Duck('pf');
duck.speak();
duck.fly();
```

## 7. 泛型

- 泛型（Generics）是指在定义函数、接口或类的时候，不预先指定具体的类型，而在使用的时候再指定类型的一种特性
- 泛型`T`作用域只限于函数内部使用

### 7.1 泛型函数

- 首先，我们来实现一个函数 createArray，它可以创建一个指定长度的数组，同时将每一项都填充一个默认值

```js
function createArray(length: number, value: any): Array<any> {
  let result: any = [];
  for (let i = 0; i < length; i++) {
    result[i] = value;
  }
  return result;
}
let result = createArray(3, 'x');
console.log(result);
```

使用了泛型

```js
function createArray<T>(length: number, value: T): Array<T> {
  let result: T[] = [];
  for (let i = 0; i < length; i++) {
    result[i] = value;
  }
  return result;
}
let result = createArray2 < string > (3, 'x');
console.log(result);
```

### 7.2 类数组

- 类数组（Array-like Object）不是数组类型，比如 `arguments`

```js
function sum() {
    let args: IArguments = arguments;
    for (let i = 0; i < args.length; i++) {
        console.log(args[i]);
    }
}
sum(1, 2, 3);

let root = document.getElementById('root');
let children: HTMLCollection = (root as HTMLElement).children;
children.length;
let nodeList: NodeList = (root as HTMLElement).childNodes;
nodeList.length;
```

### 7.3 泛型类

#### 7.3.1 泛型类

```js
class MyArray<T>{
    private list:T[]=[];
    add(value:T) {
        this.list.push(value);
    }
    getMax():T {
        let result=this.list[0];
        for (let i=0;i<this.list.length;i++){
            if (this.list[i]>result) {
                result=this.list[i];
            }
        }
        return result;
    }
}
let arr=new MyArray();
arr.add(1); arr.add(2); arr.add(3);
let ret = arr.getMax();
console.log(ret);
```

#### 7.3.2 泛型与 new

```js
function factory<T>(type: { new(): T }): T {
  return new type(); // This expression is not constructable.
}
```

### 7.5 泛型接口

- 泛型接口可以用来约束函数

```js
interface Calculate {
  <T>(a: T, b: T): T;
}
let add: Calculate = function <T>(a: T, b: T) {
  return a;
};
add < number > (1, 2);
```

### 7.6 多个类型参数

- 泛型可以有多个

```js
function swap<A,B>(tuple:[A,B]):[B,A]{
  return [tuple[1],tuple[0]];
}
let swapped = swap<string,number>(['a',1]);
console.log(swapped);
console.log(swapped[0].toFixed(2));
console.log(swapped[1].length);
```

### 7.7 默认泛型类型

```js
function createArray3<T = number>(length: number, value: T): Array<T> {
  let result: T[] = [];
  for (let i = 0; i < length; i++) {
    result[i] = value;
  }
  return result;
}
let result2 = createArray3(3, 'x');
console.log(result2);
```

### 7.8 泛型约束

- 在函数中使用泛型的时候，由于预先并不知道泛型的类型，所以不能随意访问相应类型的属性或方法。

```js
function logger<T>(val: T) {
    console.log(val.length); //直接访问会报错
}
//可以让泛型继承一个接口
interface LengthWise {
    length: number
}
//可以让泛型继承一个接口
function logger2<T extends LengthWise>(val: T) {
    console.log(val.length)
}
logger2('pf');
logger2(1);
```

### 7.9 泛型接口

- 定义接口的时候也可以指定泛型

```js
interface Cart<T> {
  list: T[];
}
let cart: Cart<{ name: string, price: number }> = {
  list: [{ name: 'pf', price: 10 }],
};
console.log(cart.list[0].name, cart.list[0].price);
```

### 7.10 compose

[compose](https://gitee.com/pfpeixun/redux/blob/master/src/compose.ts)

```js
import compose from '.';
/* zero functions */
console.log(compose() < string > 'pf');
/* one functions */
interface F {
  (a: string): string;
}
let f: F = (a: string): string => a + 'f';
console.log(compose < F > f('pf'));
/* two functions */
type A = string;
type R = string;
type T = string[];

let f1 = (a: A): R => a + 'f1';
let f2 = (...a: T): A => a + 'f2';
console.log(compose < A, T, R > (f1, f2)('pf'));
```

### 7.11 泛型类型别名

- 泛型类型别名可以表达更复杂的类型

```js
type Cart<T> = { list: T[] } | T[];
let c1: Cart<string> = { list: ['1'] };
let c2: Cart<number> = [1];
```

### 7.12 泛型接口 vs 泛型类型别名

- 接口创建了一个新的名字，它可以在其他任意地方被调用。而类型别名并不创建新的名字，例如报错信息就不会使用别名
- 类型别名不能被 extends 和 implements,这时我们应该尽量使用接口代替类型别名
- 当我们需要使用联合类型或者元组类型的时候，类型别名会更合适

## 8.结构类型系统

### 8.1 接口的兼容性

- 如果传入的变量和声明的类型不匹配，TS 就会进行兼容性检查
- 原理是`Duck-Check`,就是说只要目标类型中声明的属性变量在源类型中都存在就是兼容的

```js
interface Animal {
  name: string;
  age: number;
}

interface Person {
  name: string;
  age: number;
  gender: number;
}
// 要判断目标类型`Person`是否能够兼容输入的源类型`Animal`
function getName(animal: Animal): string {
  return animal.name;
}

let p = {
  name: 'pf',
  age: 10,
  gender: 0,
};

getName(p);
//只有在传参的时候两个变量之间才会进行兼容性的比较，赋值的时候并不会比较,会直接报错
let a: Animal = {
  name: 'pf',
  age: 10,
  gender: 0,
};
```

### 8.2 基本类型的兼容性

```js
//基本数据类型也有兼容性判断
let num: string | number;
let str: string = 'pf';
num = str;

//只要有toString()方法就可以赋给字符串变量
let num2: {
  toString(): string,
};

let str2: string = 'jiagou';
num2 = str2;
```

### 8.3 类的兼容性

- 在 TS 中是结构类型系统，只会对比结构而不在意类型

```js
class Animal {
  name: string;
}
class Bird extends Animal {
  swing: number;
}

let a: Animal;
a = new Bird();

let b: Bird;
//并不是父类兼容子类，子类不兼容父类
b = new Animal();
class Animal {
  name: string;
}
//如果父类和子类结构一样，也可以的
class Bird extends Animal {}

let a: Animal;
a = new Bird();

let b: Bird;
b = new Animal();
//甚至没有关系的两个类的实例也是可以的
class Animal {
  name: string;
}
class Bird {
  name: string;
}
let a: Animal;
a = new Bird();
let b: Bird;
b = new Animal();
```

### 8.4 函数的兼容性

- 比较函数的时候是要先比较函数的参数，再比较函数的返回值

#### 8.4.1 比较参数

```js
type sumFunc = (a: number, b: number) => number;
let sum: sumFunc;
function f1(a: number, b: number): number {
  return a + b;
}
sum = f1;

//可以省略一个参数
function f2(a: number): number {
  return a;
}
sum = f2;

//可以省略二个参数
function f3(): number {
  return 0;
}
sum = f3;

//多一个参数可不行
function f4(a: number, b: number, c: number) {
  return a + b + c;
}
sum = f4;
```

#### 8.4.2 比较返回值

```js
type GetPerson = () => { name: string, age: number };
let getPerson: GetPerson;
//返回值一样可以
function g1() {
  return { name: 'pf', age: 10 };
}
getPerson = g1;
//返回值多一个属性也可以
function g2() {
  return { name: 'pf', age: 10, gender: 'male' };
}
getPerson = g2;
//返回值少一个属性可不行
function g3() {
  return { name: 'pf' };
}
getPerson = g3;
//因为有可能要调用返回值上的方法
getPerson().age.toFixed();
```

### 8.5 函数的协变与逆变

- 协变（Covariant）：只在同一个方向；
- 逆变（Contravariant）：只在相反的方向；
- 双向协变（Bivariant）：包括同一个方向和不同方向；
- 不变（Invariant）：如果类型不完全相同，则它们是不兼容的。
- A ≼ B 意味着 A 是 B 的子类型。
- A → B 指的是以 A 为参数类型，以 B 为返回值类型的函数类型。
- x : A 意味着 x 的类型为 A
- 返回值类型是协变的，而参数类型是逆变的
- 返回值类型可以传子类,参数可以传父类
- 参数逆变父类 返回值协变子类 搀你父,返鞋子

```js
class Animal{}
class Dog extends Animal{
    public name:string = 'Dog'
}
class BlackDog extends Dog {
    public age: number = 10
}
class WhiteDog extends Dog {
    public home: string = '北京'
}
let animal: Animal;
let blackDog: BlackDog;
let whiteDog: WhiteDog;
type Callback = (dog: Dog)=>Dog;
function exec(callback:Callback):void{
    callback(whiteDog);
}
//不行  callback(redDog);
type ChildToChild = (blackDog: BlackDog) => BlackDog;
const childToChild: ChildToChild = (blackDog: BlackDog): BlackDog => blackDog
exec(childToChild);

//也不行,理由同上
type ChildToParent = (blackDog: BlackDog) => Animal;
const childToParent: ChildToParent = (blackDog: BlackDog): Animal => animal
exec(childToParent);

//不行 因为有可能调用返回的Dog的方法
type ParentToParent = (animal: Animal) => Animal;
const parentToParent: ParentToParent = (animal: Animal): Animal => animal
exec(parentToParent);

//可以,所有的狗都是动物,返回的不管什么狗都是狗
type ParentToChild = (animal: Animal) => BlackDog;
const parentToChild: ParentToChild = (animal: Animal): BlackDog => blackDog
exec(parentToChild);
//(Animal → Greyhound) ≼ (Dog → Dog)
//返回值类型很容易理解：黑狗是狗的子类。但参数类型则是相反的：动物是狗的父类！
// string | number|boolean 是 string | number的父类型
// string是string|number的子类型
type Callback2 = (a: string | number) => string | number;
function exec2(callback: Callback2):void{
    callback('');
}
type ParentToChild2 = (a: string | number | boolean) => string;
const parentToChild2: ParentToChild2 = (a: string | number | boolean): string => ''
exec2(parentToChild2);

type Callback3 = (a: string | number) => string | number;
function exec3(callback: Callback2): void {
    callback('');
}
type ParentToParent3 = (a: string) => string;
const parentToParent3: ParentToParent3 = (a: string): string => ''
exec3(parentToChild3);
```

- 在 TypeScript 中， 参数类型是双向协变的 ，也就是说既是协变又是逆变的，而这并不安全。但是现在你可以在 TypeScript 2.6 版本中通过 `--strictFunctionTypes` 或 `--strict` 标记来修复这个问题

### 8.6 泛型的兼容性

- 泛型在判断兼容性的时候会先判断具体的类型,然后再进行兼容性判断

```js
//接口内容为空没用到泛型的时候是可以的
//1.接口内容为空没用到泛型的时候是可以的
interface Empty<T>{}
let x!:Empty<string>;
let y!:Empty<number>;
x = y;

//2.接口内容不为空的时候不可以
interface NotEmpty<T>{
  data:T
}
let x1!:NotEmpty<string>;
let y1!:NotEmpty<number>;
x1 = y1;

//实现原理如下,称判断具体的类型再判断兼容性
interface NotEmptyString{
    data:string
}

interface NotEmptyNumber{
    data:number
}
let xx2!:NotEmptyString;
let yy2!:NotEmptyNumber;
xx2 = yy2;
```

### 8.7 枚举的兼容性

- 枚举类型与数字类型兼容，并且数字类型与枚举类型兼容
- 不同枚举类型之间是不兼容的

```js
//数字可以赋给枚举
enum Colors {Red,Yellow}
let c:Colors;
c = Colors.Red;
c = 1;
c = '1';

//枚举值可以赋给数字
let n:number;
n = 1;
n = Colors.Red;
```

## 9.类型保护

- 类型保护就是一些表达式，他们在编译的时候就能通过类型信息确保某个作用域内变量的类型
- 类型保护就是能够通过关键字判断出分支中的类型

### 9.1 typeof 类型保护

```js
function double(input: string | number | boolean) {
  if (typeof input === 'string') {
    return input + input;
  } else {
    if (typeof input === 'number') {
      return input * 2;
    } else {
      return !input;
    }
  }
}
```

### 9.2 instanceof 类型保护

```js
class Animal {
    name!: string;
}
class Bird extends Animal {
    swing!: number
}
function getName(animal: Animal) {
    if (animal instanceof Bird) {
        console.log(animal.swing);
    } else {
        console.log(animal.name);
    }
}
```

### 9.3 null 保护

- 如果开启了`strictNullChecks`选项，那么对于可能为 null 的变量不能调用它上面的方法和属性

```js
function getFirstLetter(s: string | null) {
    //第一种方式是加上null判断
    if (s == null) {
        return '';
    }
    //第二种处理是增加一个或的处理
    s = s || '';
    return s.charAt(0);
}
//它并不能处理一些复杂的判断，需要加非空断言操作符
function getFirstLetter2(s: string | null) {
    function log() {
        console.log(s!.trim());
    }
    s = s || '';
    log();
    return s.charAt(0);
}
```

### 9.4 链判断运算符

- 链判断运算符是一种先检查属性是否存在，再尝试访问该属性的运算符，其符号为 ?.
- 如果运算符左侧的操作数 ?. 计算为 undefined 或 null，则表达式求值为 undefined 。否则，正常触发目标属性访问，方法或函数调用。

```js
a?.b; //如果a是null/undefined,那么返回undefined，否则返回a.b的值.
a == null ? undefined : a.b;

a?.[x]; //如果a是null/undefined,那么返回undefined，否则返回a[x]的值
a == null ? undefined : a[x];

a?.b(); // 如果a是null/undefined,那么返回undefined
a == null ? undefined : a.b(); //如果a.b不函数的话抛类型错误异常,否则计算a.b()的结果

a?.(); //如果a是null/undefined,那么返回undefined
a == null ? undefined : a(); //如果A不是函数会抛出类型错误
//否则 调用a这个函数
```

> 链判断运算符 还处于 stage1 阶段,TS 也暂时不支持

### 9.5 可辨识的联合类型

- 就是利用联合类型中的共有字段进行类型保护的一种技巧
- 相同字段的不同取值就是可辨识

```js
interface WarningButton {
  class: 'warning';
  text1: '修改';
}
interface DangerButton {
  class: 'danger';
  text2: '删除';
}
type Button = WarningButton | DangerButton;
function getButton(button: Button) {
  if (button.class == 'warning') {
    console.log(button.text1);
  }
  if (button.class == 'danger') {
    console.log(button.text2);
  }
}
```

类型字面量+可辨识联合类型

```js
interface User {
    username: string
}
type Action = {
    type:'add',
    payload:User
} | {
    type: 'delete'
    payload: number
}
const UserReducer = (action: Action) => {
  switch (action.type) {
    case "add":
      let user: User = action.payload;
      break;
    case "delete":
      let id: number = action.payload;
      break;
    default:
      break;
  }
};
```

### 9.6 in 操作符

- in 运算符可以被用于参数类型的判断

```js
interface Bird {
  swing: number;
}

interface Dog {
  leg: number;
}

function getNumber(x: Bird | Dog) {
  if ('swing' in x) {
    return x.swing;
  }
  return x.leg;
}
```

### 9.7 自定义的类型保护

- TypeScript 里的类型保护本质上就是一些表达式，它们会在运行时检查类型信息，以确保在某个作用域里的类型是符合预期的
- `type is Type1Class`就是类型谓词
- 谓词为 `parameterName is Type`这种形式,`parameterName`必须是来自于当前函数签名里的一个参数名
- 每当使用一些变量调用`isType1`时，如果原始类型兼容，`TypeScript`会将该变量缩小到该特定类型

```js
function isType1(type: Type1Class | Type2Class): type is Type1Class {
    return (<Type1Class>type).func1 !== undefined;
}
interface Bird {
  swing: number;
}

interface Dog {
  leg: number;
}

//没有相同字段可以定义一个类型保护函数
function isBird(x:Bird|Dog): x is Bird{
  return (<Bird>x).swing == 2;
  //return (x as Bird).swing == 2;
}

function getAnimal(x: Bird | Dog) {
  if (isBird(x)) {
    return x.swing;
  }
  return x.leg;
}
```

### 9.8 unknown

- TypeScript 3.0 引入了新的 unknown 类型，它是 any 类型对应的安全类型
- unknown 和 any 的主要区别是 unknown 类型会更加严格：在对 unknown 类型的值执行大多数操作之前，我们必须进行某种形式的检查。而在对 any 类型的值执行操作之前，我们不必进行任何检查

#### 9.8.1 any 类型

- 在 TypeScript 中，任何类型都可以被归为 any 类型。这让 any 类型成为了类型系统的 顶级类型 (也被称作 全局超级类型)。
- TypeScript 允许我们对 any 类型的值执行任何操作，而无需事先执行任何形式的检查

```js
let value: any;

value = true; // OK
value = 42; // OK
value = 'Hello World'; // OK
value = []; // OK
value = {}; // OK
value = Math.random; // OK
value = null; // OK
value = undefined; // OK

let value: any;
value.foo.bar; // OK
value.trim(); // OK
value(); // OK
new value(); // OK
```

#### 9.8.2 unknown 类型

- 就像所有类型都可以被归为 any，所有类型也都可以被归为 unknown。这使得 unknown 成为 TypeScript 类型系统的另一种顶级类型（另一种是 any）
- 任何类型都可以赋值给`unknown`类型

```js
let value: unknown;

value = true; // OK
value = 42; // OK
value = 'Hello World'; // OK
value = []; // OK
value = {}; // OK
value = Math.random; // OK
value = null; // OK
value = undefined; // OK
value = new TypeError(); // OK
```

- `unknown`类型只能被赋值给`any`类型和`unknown`类型本身

```js
let value: unknown;
let value1: unknown = value; // OK
let value2: any = value; // OK
let value3: boolean = value; // Error
let value4: number = value; // Error
let value5: string = value; // Error
let value6: object = value; // Error
let value7: any[] = value; // Error
let value8: Function = value; // Error
```

#### 9.8.3 缩小 unknown 类型范围

- 如果没有类型断言或类型细化时，不能在`unknown`上面进行任何操作
- typeof
- instanceof
- 自定义类型保护函数
- 可以对 unknown 类型使用类型断言

```js
const value: unknown = "Hello World";
const someString: string = value as string;
```

### 9.8.4 联合类型中的 unknown 类型

- 在联合类型中，unknown 类型会吸收任何类型。这就意味着如果任一组成类型是 unknown，联合类型也会相当于 unknown：

  ```js
  type UnionType1 = unknown | null; // unknown
  type UnionType2 = unknown | undefined; // unknown
  type UnionType3 = unknown | string; // unknown
  type UnionType4 = unknown | number[]; // unknown
  ```

### 9.8.5 交叉类型中的 unknown 类型

- 在交叉类型中，任何类型都可以吸收 unknown 类型。这意味着将任何类型与 unknown 相交不会改变结果类型

```js
type IntersectionType1 = unknown & null; // null
type IntersectionType2 = unknown & undefined; // undefined
type IntersectionType3 = unknown & string; // string
type IntersectionType4 = unknown & number[]; // number[]
type IntersectionType5 = unknown & any; // any
```

### 9.8.6 never 是 unknown 的子类型

```js
type isNever = never extends unknown ? true : false;
```

### 9.8.7 keyof unknown 等于 never

```js
type key = keyof unknown;
```

### 9.8.8 只能对 unknown 进行等或不等操作，不能进行其它操作

```js
un1 === un2;
un1 !== un2;
un1 += un2;
```

### 9.8.9 不能做任何操作

- 不能访问属性
- 不能作为函数调用
- 不能当作类的构造函数不能创建实例

```js
un.name;
un();
new un();
```

### 9.8.10 映射属性

- 如果映射类型遍历的时候是 unknown,不会映射属性

  ```js
  type getType<T> = {
    [P in keyof T]:number
  }
  type t = getType<unknown>;
  ```

## 10. 类型变换

### 10.1 类型推断

- TypeScript 能根据一些简单的规则推断变量的类型

#### 10.1.1 从右向左

- 变量的类型可以由定义推断
- 这是一个从右向左流动类型的示例

```js
let foo = 1; // foo 是 'number'
let bar = 'pf'; // bar 是 'string'
//foo = bar; // Error: 不能将 'string' 赋值给 `number`
```

#### 10.1.2 底部流出

- 返回类型能被 `return` 语句推断

```js
function add(a: number, b: number) {
  return a + b;
}
let c = add(1, 2);
```

#### 10.1.3 从左向右

- 函数参数类型/返回值类型也能通过赋值来推断

```js
type Sum = (a: number, b: number) => number;
let sum: Sum = (a, b) => {
  a = 'pf';
  return a + b;
};
```

#### 10.1.4 结构化

- 推断规则也适用于结构化的存在(对象字面量)

```js
const person = {
  name: 'pf',
  age: 11,
};
let name = person.name;
let age = person.age;
age = 'hello'; // Error：不能把 'string' 类型赋值给 'number' 类型
```

#### 10.1.5 解构

- 推断规则也适用于解构

```js
const person = {
  name: 'pf',
  age: 11,
};
let { name, age } = person;

age = 'hello'; // Error：不能把 'string' 类型赋值给 'number' 类型

//数组也一样
const numbers = [1, 2, 3];
numbers[0] = 'hello'; // Error：不能把 'string' 类型赋值给 'number' 类型
```

#### 10.1.5 DefaultProps

```js
interface DefaultProps {
  name?: string;
  age?: number;
}
let defaultProps: DefaultProps = {
  name: 'pf',
  age: 10,
};

let props = {
  ...defaultProps,
  home: '北京',
};
type Props = typeof props;
```

#### 10.1.6 小心使用返回值

- 尽管 TypeScript 一般情况下能推断函数的返回值，但是它可能并不是你想要的

```js
function addOne(a: any) {
  return a + 1;
}
function sum(a: number, b: number) {
  return a + addOne(b);
}

type Ret = ReturnType<typeof sum>;
```

### 10.1 交叉类型

- 交叉类型(Intersection Types)是将多个类型合并为一个类型
- 这让我们可以把现有的多种类型叠加到一起成为一种类型，它包含了所需的所有类型的特性

```js
//TypeScript 交叉类型是将多个类型合并为一个类型
//这让我们可以把现有的多种类型叠加到一起成为一种类型
//它包含了所需的所有类型的特性

export {};
//接口的交叉
interface Bird {
  name: string;
  fly(): void;
}
interface Person {
  name: string;
  talk(): void;
}
type BirdPerson = Bird & Person;
let p: BirdPerson = { name: 'pf', fly() {}, talk() {} };
p.fly;
p.name;
p.talk;
interface X {
  a: string;
  b: string;
}

interface Y {
  a: number;
  c: string;
}

type XY = X & Y;
type YX = Y & X;
//c = string & number
//let p1: XY={a:'',b:'',c:''};
```

联合类型的交叉类型

```js
type Ta = string | number;
type Tb = number | boolean;
type Tc = Ta & Tb;
```

`mixin`混入模式可以让你从两个对象中创建一个新对象，新对象会拥有着两个对象所有的功能

```js
interface AnyObject {
    [prop: string]: any;
}

function mixin<T extends AnyObject, U extends AnyObject>(one: T,two: U): T & U {
    const result = <T & U>{};
    for (let key in one) {
        (<T>result)[key] = one[key];
    }
    for (let key in two) {
        (<U>result)[key] = two[key];
    }
    return result;
}

const x = mixin({ name: "pf" }, { age: 11 });
console.log(x.name, x.age);
```

### 10.2 typeof

- 可以获取一个变量的类型

```js
//先定义类型，再定义变量
type People = {
  name: string,
  age: number,
  gender: string,
};
let p1: People = {
  name: 'pf',
  age: 10,
  gender: 'male',
};
//先定义变量，再定义类型
let p1 = {
  name: 'pf',
  age: 10,
  gender: 'male',
};
type People = typeof p1;
function getName(p: People): string {
  return p.name;
}
getName(p1);
```

### 10.3 索引访问操作符

- 可以通过[]获取一个类型的子类型

```js
interface Person {
  name: string;
  age: number;
  job: {
    name: string,
  };
  interests: { name: string, level: number }[];
}
let FrontEndJob: Person['job'] = {
  name: '前端工程师',
};
let interestLevel: Person['interests'][0]['level'] = 2;
```

### 10.4 keyof

- 索引类型查询操作符

```js
interface Person{
  name:string;
  age:number;
  gender:'male'|'female';
}
//type PersonKey = 'name'|'age'|'gender';
type PersonKey = keyof Person;

function getValueByKey(p:Person,key:PersonKey){
  return p[key];
}
let val = getValueByKey({name:'pf',age:10,gender:'male'},'name');
console.log(val);
```

### 10.5 映射类型

- 在定义的时候用 in 操作符去批量定义类型中的属性

```js
interface Person{
  name:string;
  age:number;
  gender:'male'|'female';
}
//批量把一个接口中的属性都变成可选的
type PartPerson = {
  [Key in keyof Person]?:Person[Key]
}

let p1:PartPerson={};
//也可以使用泛型
type Part<T> = {
  [key in keyof T]?:T[key]
}
let p2:Part<Person>={};
```

- 通过 key 的数组获取值的数组

  ```js
  function pick<T, K extends keyof T>(o: T, names: K[]): T[K][] {
    return names.map((n) => o[n]);
  }
  let user = { id: 1, name: 'pf' };
  type User = typeof user;
  const res = pick<User, keyof User>(user, ["id", "name"]);
  console.log(res);
  ```

### 10.6 条件类型

- 在定义泛型的时候能够添加进逻辑分支，以后泛型更加灵活

#### 10.6.1 定义条件类型

```js
interface Fish {
    name: string
}
interface Water {
    name: string
}
interface Bird {
    name: string
}
interface Sky {
    name: string
}
//若 T 能够赋值给 Fish，那么类型是 Water,否则为 Sky
type Condition<T> = T extends Fish ? Water : Sky;
let condition: Condition<Fish> = { name: '水' };
```

#### 10.6.2 条件类型的分发

```js
interface Fish {
    fish: string
}
interface Water {
    water: string
}
interface Bird {
    bird: string
}
interface Sky {
    sky: string
}
//naked type
type Condition<T> = T extends Fish ? Water : Sky;

//(Fish extends Fish ? Water : Sky) | (Bird extends Fish ? Water : Sky)
// Water|Sky
let condition1: Condition<Fish | Bird> = { water: '水' };
let condition2: Condition<Fish | Bird> = { sky: '天空' };
```

- 条件类型有一个特性,就是「分布式有条件类型」,但是分布式有条件类型是有前提的,条件类型里待检查的类型必须是 naked type parameter

```js
//none naked type
//type Condition<T> = [T] extends [Fish] ? Water : Sky;
```

- 找出 T 类型中 U 不包含的部分

```js
//never会被自动过滤
type Diff<T, U> = T extends U ? never : T;

type R = Diff<"a" | "b" | "c" | "d", "a" | "c" | "f">;  // "b" | "d"

type Filter<T, U> = T extends U ? T : never;
type R1 = Filter<string | number | boolean, number>;
```

#### 10.6.3 内置条件类型

- TS 在内置了一些常用的条件类型，可以在 [lib.es5.d.ts](https://github.com/Microsoft/TypeScript/blob/c48662c891ce810f5627a0f6a8594049cccceeb5/lib/lib.es5.d.ts#L1291) 中查看：
- [utility-types](http://www.typescriptlang.org/docs/handbook/utility-types.html)

##### 10.6.3.1 Exclude

- 从 T 可分配给的类型中排除 U

```js
type Exclude<T, U> = T extends U ? never : T;

type  E = Exclude<string|number,string>;
let e:E = 10;
```

##### 10.6.3.2 Extract

- 从 T 可分配的类型中提取 U

```js
type Extract<T, U> = T extends U ? T : never;

type  E = Extract<string|number,string>;
let e:E = '1';
```

##### 10.6.3.3 NonNullable

- 从 T 中排除 null 和 undefined

```js
type NonNullable<T> = T extends null | undefined ? never : T;

type  E = NonNullable<string|number|null|undefined>;
let e:E = null;
```

##### 10.6.3.4 ReturnType

- [infer](http://www.typescriptlang.org/docs/handbook/advanced-types.html#type-inference-in-conditional-types)最早出现在此 [PR](https://github.com/Microsoft/TypeScript/pull/21496) 中，表示在 `extends` 条件语句中待推断的类型变量
- 获取函数类型的返回类型

```js
export {}
type ReturnType<T extends (...args: any[]) => any> = T extends (...args: any[]) => infer R ? R : any;
function getUserInfo() {
    return { name: "pf", age: 10 };
}

// 通过 ReturnType 将 getUserInfo 的返回值类型赋给了 UserInfo
type UserInfo = ReturnType<typeof getUserInfo>;

const userA: UserInfo = {
    name: "pf",
    age: 10
};
```

##### 10.6.3.5 Parameters

- Constructs a tuple type of the types of the parameters of a function type T
- [Parameters](http://www.typescriptlang.org/docs/handbook/utility-types.html#parameterst)

```js
export {}
type Parameters<T> = T extends (...args: infer R) => any ? R : any;

type T0 = Parameters<() => string>;  // []
type T1 = Parameters<(s: string) => void>;  // [string]
type T2 = Parameters<(<T>(arg: T) => T)>;  // [unknown]
```

##### 10.6.3.6 InstanceType

- 获取构造函数类型的实例类型
- [InstanceType](http://www.typescriptlang.org/docs/handbook/utility-types.html#instancetypet)

```js
type Constructor = new (...args: any[]) => any;
type ConstructorParameters<T extends Constructor> = T extends new (...args: infer P) => any ? P : never;
type InstanceType<T extends Constructor> = T extends new (...args: any[]) => infer R ? R : any;

class Person {
    name: string;
    constructor(name: string) {
        this.name = name;
    }
    getName() { console.log(this.name) }
}
//构造函数参数
type constructorParameters = ConstructorParameters<typeof Person>;
let params: constructorParameters = ['pf']
//实例类型
type Instance = InstanceType<typeof Person>;
let instance: Instance = { name: 'pf', getName() { } };
```

##### 10.6.3.7 infer+分布式

- [distributive-conditional-types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#distributive-conditional-types)
- 「Distributive conditional types」主要用于拆分 extends 左边部分的联合类型
- 「Distributive conditional types」是由「naked type parameter」构成的条件类型。而「naked type parameter」表示没有被 Wrapped 的类型（如：Array、[T]、Promise 等都是不是「naked type parameter」）。「Distributive conditional types」主要用于拆分 extends 左边部分的联合类型，举个例子：在条件类型 T extends U ? X : Y 中，当 T 是 A | B 时，会拆分成 A extends U ? X : Y | B extends U ? X : Y；
- 利用在逆变位置上，同一类型变量的多个候选类型将会被推断为[交叉类型的特性](https://github.com/Microsoft/TypeScript/pull/21496)
- tuple 转 union

```js
type ElementOf<T> = T extends Array<infer E> ? E : never;

type TTuple = [string, number];

type ToUnion = ElementOf<TTuple>; // string | number
//联合类型（Union Types）表示取值可以为多种类型中的一种
//交叉类型（Intersection Types）表示将多个类型合并为一个类型
//联合类型转交叉类型
//union 转 intersection
//union 转 intersection 的操作多用于 mixin 中
//https://github.com/Microsoft/TypeScript/issues/27907
type T1 = { name: string };
type T2 = { age: number };

type UnionToIntersection<T> = T extends { a: (x: infer U) => void; b: (x: infer U) => void } ? U : never;
type T3 = UnionToIntersection<{ a: (x: T1) => void; b: (x: T2) => void }>; // T1 & T2
```

### 10.7 内置工具类型

- TS 中内置了一些工具类型来帮助我们更好地使用类型系统
- [utility-types](<http://pfpeixun.com/strong/html/[utility-types](https://github.com/piotrwitek/utility-types)>)
- TypeScript 中增加了对映射类型修饰符的控制
- 具体而言，一个 `readonly` 或 `?` 修饰符在一个映射类型里可以用前缀 `+` 或`-`来表示这个修饰符应该被添加或移除

| 符号 | 含义     |
| :--- | :------- |
| +?   | 变为可选 |
| -?   | 变为必选 |

#### 10.7.1 Partial

- Partial 可以将传入的属性由非可选变为可选，具体使用如下：

```js
type Partial<T> = { [P in keyof T]?: T[P] };

interface A {
  a1: string;
  a2: number;
  a3: boolean;
}

type aPartial = Partial<A>;

const a: aPartial = {}; // 不会报错
```

#### 10.7.2 类型递归

```js
interface Company {
    id: number
    name: string
}

interface Person {
    id: number
    name: string
    company: Company
}
type DeepPartial<T> = {
    [U in keyof T]?: T[U] extends object
    ? DeepPartial<T[U]>
    : T[U]
};

type R2 = DeepPartial<Person>
```

#### 10.7.3 Required

- Required 可以将传入的属性中的可选项变为必选项，这里用了 -? 修饰符来实现。

```js
interface Person {
  name: string;
  age: number;
  gender?: 'male' | 'female';
}
/**
 * type Require<T> = { [P in keyof T]-?: T[P] };
 */
let p: Required<Person> = {
  name: 'pf',
  age: 10,
  //gender:'male'
};
```

#### 10.7.4 Readonly

- Readonly 通过为传入的属性每一项都加上 readonly 修饰符来实现。

```js
interface Person {
  name: string;
  age: number;
  gender?: 'male' | 'female';
}
//type Readonly<T> = { readonly [P in keyof T]: T[P] };
let p: Readonly<Person> = {
  name: 'pf',
  age: 10,
  gender: 'male',
};
p.age = 11;
```

#### 10.7.5 Pick

- Pick 能够帮助我们从传入的属性中摘取某一项返回

```js
interface Animal {
  name: string;
  age: number;
  gender:number
}
/**
 * From T pick a set of properties K
 * type Pick<T, K extends keyof T> = { [P in K]: T[P] };
 */
// 摘取 Animal 中的 name 属性
interface Person {
    name: string;
    age: number;
    married: boolean
}
function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
    const result: any = {};
    keys.map(key => {
        result[key] = obj[key];
    });
    return result
}
let person: Person = { name: 'pf', age: 10, married: true };
let result: Pick<Person, 'name' | 'age'> = pick<Person, 'name' | 'age'>(person, ['name', 'age']);
console.log(result);
```

#### 10.7.6 Record

- Record 是 TypeScript 的一个高级类型
- 他会将一个类型的所有属性值都映射到另一个类型上并创造一个新的类型

```js
/**
 * Construct a type with a set of properties K of type T
 */
type Record<K extends keyof any, T> = {
    [P in K]: T;
};
function mapObject<K extends string | number, T, U>(obj: Record<K, T>, map: (x: T) => U): Record<K, U> {
    let result: any = {};
    for (const key in obj) {
        result[key] = map(obj[key]);
    }
    return result;
}
let names = { 0: 'hello', 1: 'world' };
let lengths = mapObject<string | number, string, number>(names, (s: string) => s.length);
console.log(lengths);//{ '0': 5, '1': 5 }
type Point = 'x' | 'y';
type PointList = Record<Point, { value: number }>
const cars: PointList = {
    x: { value: 10 },
    y: { value: 20 },
}
```

### 10.8 自定义高级类型

- [utility-types](https://github.com/piotrwitek/utility-types)

#### 10.8.1 Proxy

```js
type Proxy<T> = {
    get(): T;
    set(value: T): void;
}
type Proxify<T> = {
    [P in keyof T]: Proxy<T[P]>
}
function proxify<T>(obj: T): Proxify<T> {
    let result = {} as Proxify<T>;
    for (const key in obj) {
        result[key] = {
            get: () => obj[key],
            set: (value) => obj[key] = value
        }
    }
    return result;
}
let props = {
    name: 'pf',
    age: 10
}
let proxyProps = proxify(props);
console.log(proxyProps);

function unProxify<T>(t: Proxify<T>): T {
    let result = {} as T;
    for (const k in t) {
        result[k] = t[k].get();
    }
    return result;
}

let originProps = unProxify(proxyProps);
console.log(originProps);
```

#### 10.8.2 SetDifference

- SetDifference (same as Exclude)

```js
/**
 * SetDifference (same as Exclude)
 * @desc Set difference of given union types `A` and `B`
 * @example
 *   // Expect: "1"
 *   SetDifference<'1' | '2' | '3', '2' | '3' | '4'>;
 *
 *   // Expect: string | number
 *   SetDifference<string | number | (() => void), Function>;
 */
export type SetDifference<A, B> = A extends B ? never : A;
```

#### 10.8.3 Omit

- Exclude 的作用是从 T 中排除出可分配给 U 的元素.
- Omit<T, K>的作用是忽略 T 中的某些属性
- Omit = Exclude + Pick

```js
/**
 * Omit (complements Pick)
 * @desc From `T` remove a set of properties by key `K`
 * @example
 *   type Props = { name: string; age: number; visible: boolean };
 *
 *   // Expect: { name: string; visible: boolean; }
 *   type Props = Omit<Props, 'age'>;
 */
export type Omit<T, K extends keyof any> = Pick<T, SetDifference<keyof T, K>>;
```

#### 10.8.4 Diff

```js
/**
 * Diff
 * @desc From `T` remove properties that exist in `U`
 * @example
 *   type Props = { name: string; age: number; visible: boolean };
 *   type DefaultProps = { age: number };
 *
 *   // Expect: { name: string; visible: boolean; }
 *   type DiffProps = Diff<Props, DefaultProps>;
 */
export type Diff<T extends object, U extends object> = Pick<
  T,
  SetDifference<keyof T, keyof U>
>;
```

#### 10.8.5 Intersection

```js
/**
 * Intersection
 * @desc From `T` pick properties that exist in `U`
 * @example
 *   type Props = { name: string; age: number; visible: boolean };
 *   type DefaultProps = { age: number };
 *
 *   // Expect: { age: number; }
 *   type DuplicateProps = Intersection<Props, DefaultProps>;
 */
export type Intersection<T extends object, U extends object> = Pick<
  T,
  Extract<keyof T, keyof U> & Extract<keyof U, keyof T>
>;
```

#### 10.8.6 Overwrite

- Overwrite<T, U>顾名思义,是用 U 的属性覆盖 T 的相同属性.
- [mapped-types](https://github.com/piotrwitek/utility-types/blob/master/src/mapped-types.ts)

```js
/**
 * Overwrite
 * @desc From `U` overwrite properties to `T`
 * @example
 *   type Props = { name: string; age: number; visible: boolean };
 *   type NewProps = { age: string; other: string };
 *
 *   // Expect: { name: string; age: string; visible: boolean; }
 *   type ReplacedProps = Overwrite<Props, NewProps>;
 */
export type Overwrite<
  T extends object,
  U extends object,
  I = Diff<T, U> & Intersection<U, T>
> = Pick<I, keyof I>;

type Props = { name: string; age: number; visible: boolean };
type NewProps = { age: string; other: string };

// Expect: { name: string; age: string; visible: boolean; }
type ReplacedProps = Overwrite<Props, NewProps>;
```

#### 10.8.7 Merge

- Merge<O1, O2>的作用是将两个对象的属性合并:
- Merge<O1, O2> = Compute + Omit<U, T>

```js
type O1 = {
  id: number;
  name: string;
};

type O2 = {
  id: number;
  age: number;
};


//Compute的作用是将交叉类型合并
type Compute<A extends any> = A extends Function ? A : { [K in keyof A]: A[K] };

type R1 = Compute<{ x: "x" } & { y: "y" }>;
type Merge<O1 extends object, O2 extends object> = Compute<
  O1 & Omit<O2, keyof O1>
>;

type R2 = Merge<O1, O2>;
```

#### 10.8.8 Mutable

- 将 T 的所有属性的 `readonly` 移除

```js
type Mutable<T> = {
  -readonly [P in keyof T]: T[P]
}
```

### 10.9 面试题综合实战

- `infer` 关键字就是声明一个类型变量,当类型系统给足条件的时候类型就会被推断出来
- [typescript_zh](https://github.com/LeetCode-OpenSource/hire/blob/master/typescript_zh.md)
- [codesandbox](https://codesandbox.io/s/4tmtp)

```js
interface Action<T> {
    payload?: T;
    type: string;
}

class EffectModule {
    count = 1;
    message = "hello!";

    delay(input: Promise<number>): Promise<Action<string>> {
        let action: Promise<Action<string>> =  input.then(i => ({
            payload: `hello ${i}!`,
            type: 'delay'
        }));
        return action;
    }

    setMessage(action: Action<Date>): Action<number> {
        let action2: Action<number> = {
            payload: action.payload!.getMilliseconds(),
            type: "set-message"
        };
        return action2;
    }
}
//把 EffectModule 中的方法名取出来
type methodsPick<T> = { [K in keyof T]: T[K] extends Function ? K : never }[keyof T];
//定义转换前后的方法
type asyncMethod<T, U> = (input: Promise<T>) => Promise<Action<U>> // 转换前
type asyncMethodConnect<T, U> = (input: T) => Action<U> // 转换后
type syncMethod<T, U> = (action: Action<T>) => Action<U> // 转换前
type syncMethodConnect<T, U> = (action: T) => Action<U> // 转换后
//条件类型+推断类型
type EffectModuleMethodsConnect<T> = T extends asyncMethod<infer U, infer V>
    ? asyncMethodConnect<U, V>
    : T extends syncMethod<infer U, infer V>
    ? syncMethodConnect<U, V>
    : never
type EffectModuleMethods = methodsPick<EffectModule>
//映射类型
type Connect = (module: EffectModule) => {
    [M in EffectModuleMethods]: EffectModuleMethodsConnect<EffectModule[M]>
}
type Connected = {
    delay(input: number): Action<string>;
    setMessage(action: Date): Action<number>;
};
const connect: Connect = (m: EffectModule): Connected => ({
    delay: (input: number) => ({
        type: 'delay',
        payload: `hello 2`
    }),
    setMessage: (input: Date) => ({
        type: "set-message",
        payload: input.getMilliseconds()
    })
});

export const connected: Connected = connect(new EffectModule());
```

## 11. 模块 VS 命名空间

- namespace-and-module

  #### 11.1 模块

  ##### 11.1.1 全局模块

- 在默认情况下，当你开始在一个新的 TypeScript 文件中写下代码时，它处于全局命名空间中

- 使用全局变量空间是危险的，因为它会与文件内的代码命名冲突。我们推荐使用下文中将要提到的文件模块

foo.ts

```js
const foo = 123;
```

bar.ts

```js
const bar = foo; // allowed
```

##### 11.1.2 文件模块

- 文件模块也被称为外部模块。如果在你的 TypeScript 文件的根级别位置含有 import 或者 export，那么它会在这个文件中创建一个本地的作用域
- 模块是 TS 中外部模块的简称，侧重于代码和复用
- 模块在期自身的作用域里执行，而不是在全局作用域里
- 一个模块里的变量、函数、类等在外部是不可见的，除非你把它导出
- 如果想要使用一个模块里导出的变量，则需要导入

```js
export const a = 1;
export const b = 2;
export default 'pf';
import name, { a, b } from './1';
console.log(name, a, b);
```

##### 11.1.3 模块规范

- AMD：不要使用它，它仅能在浏览器工作；
- SystemJS：这是一个好的实验，已经被 ES 模块替代；
- ES 模块：它并没有准备好。
- 使用 module: commonjs 选项来替代这些模式，将会是一个好的主意

#### 11.2 命名空间

- 在代码量较大的情况下，为了避免命名空间冲突，可以将相似的函数、类、接口放置到命名空间内
- 命名空间可以将代码包裹起来，只对外暴露需要在外部访问的对象，命名空间内通过`export`向外导出
- 命名空间是内部模块，主要用于组织代码，避免命名冲突

##### 11.2.1 内部划分

```js
export namespace zoo {
    export class Dog { eat() { console.log('zoo dog'); } }
}
export namespace home {
    export class Dog { eat() { console.log('home dog'); } }
}
let dog_of_zoo = new zoo.Dog();
dog_of_zoo.eat();
let dog_of_home = new home.Dog();
dog_of_home.eat();
import { zoo } from './3';
let dog_of_zoo = new zoo.Dog();
dog_of_zoo.eat();
```

##### 11.2.2 原理

- 其实一个命名空间本质上一个对象，它的作用是将一系列相关的全局变量组织到一个对象的属性

```js
namespace Numbers {
    export let a = 1;
    export let b = 2;
    export let c = 3;
}
var Numbers;
(function (Numbers) {
    Numbers.a = 1;
    Numbers.b = 2;
    Numbers.c = 3;
})(Numbers || (Numbers = {}));
```

#### 11.3 文件，模块与命名空间

##### 11.3.1 文件和模块

- 每个 module 都不一样 src\table1.ts

  ```js
  export module Box{
    export class Book1{}
  }
  ```

src\table2.ts

```js
export module Box{
    export class Book1{}
}
```

src\table3.ts

```js
export module Box{
    export class Book1{}
}
```

##### 11.3.2 空间

- namespace 和 module 不一样，namespace 在全局空间中具有唯一性

src\table1.ts

```js
namespace  Box{
    export class Book1{}
}
```

src\table2.ts

```js
namespace  Box{
    export class Book1{}
}
```

src\table3.ts

```js
namespace  Box{
    export class Book1{}
}
```

##### 11.3.3 文件

- 每个文件是独立的

src\table1.ts

```js
export class Book1 {}
```

src\table2.ts

```js
export class Book1 {}
```

src\table3.ts

```js
export class Book1 {}
```

## 12.类型声明

- 声明文件可以让我们不需要将 JS 重构为 TS，只需要加上声明文件就可以使用系统
- 类型声明在编译的时候都会被删除，不会影响真正的代码
- 关键字 declare 表示声明的意思,我们可以用它来做出各种声明:

```js
declare var 声明全局变量
declare function 声明全局方法
declare class 声明全局类
declare enum 声明全局枚举类型
declare namespace 声明(含有子属性的)全局对象
interface 和 type 声明全局类型
```

### 12.1 普通类型声明

```js
declare let name: string;  //变量
declare let age: number;  //变量
declare function getName(): string;  //方法
declare class Animal { name: string }  //类
console.log(name, age);
getName();
new Animal();
export default {};
```

声明 jQuery 对象

```js
declare const $: (selector: string) => { //变量
    click(): void;
    width(length: number): void;
};
$('#root').click();
console.log($('#root').width);
```

### 12.2 外部枚举

- 外部枚举是使用`declare enum`定义的枚举类型
- 外部枚举用来描述已经存在的枚举类型的形状

```js
declare enum Seasons {
    Spring,
    Summer,
    Autumn,
    Winter
}

let seasons = [
    Seasons.Spring,
    Seasons.Summer,
    Seasons.Autumn,
    Seasons.Winter
];
```

`declare` 定义的类型只会用于编译时的检查，编译结果中会被删除。上例的编译结果如下

```js
var seasons = [Seasons.Spring, Seasons.Summer, Seasons.Autumn, Seasons.Winter];
```

也可以同时使用`declare` 和 `const`

```js
declare const enum Seasons {
    Spring,
    Summer,
    Autumn,
    Winter
}

let seasons = [
    Seasons.Spring,
    Seasons.Summer,
    Seasons.Autumn,
    Seasons.Winter
];
```

编译结果

```js
var seasons = [0 /* Spring */, 1 /* Summer */, 2 /* Autumn */, 3 /* Winter */];
```

### 12.3 namespace

- 如果一个全局变量包括了很多子属性，可能使用 namespace
- 在声明文件中的`namespace`表示一个全局变量包含很多子属性
- 在命名空间内部不需要使用 declare 声明属性或方法

```js
declare namespace ${
    function ajax(url:string,settings:any):void;
    let name:string;
    namespace fn {
        function extend(object:any):void;
    }
}
$.ajax('/api/users',{});
$.fn.extend({
    log:function(message:any){
        console.log(message);
    }
});
export {};
```

### 12.4 类型声明文件

- 我们可以把类型声明放在一个单独的类型声明文件中
- 可以在类型声明文件中使用类型声明
- 文件命名规范为`*.d.ts`
- 观看类型声明文件有助于了解库的使用方式

#### 12.4.1 jquery.d.ts

typings\jquery.d.ts

```ts
declare const $: (selector: string) => {
  click(): void;
  width(length: number): void;
};
```

#### 12.4.2 tsconfig.json

tsconfig.json

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "ES2015",
    "outDir": "lib"
  },
  "include": ["src/**/*", "typings/**/*"]
}
```

#### 12.4.3 test.js

src\test.ts

```js
$('#button').click();
$('#button').width(100);
export {};
```

### 12.5 第三方声明文件

- 可以安装使用第三方的声明文件
- @types 是一个约定的前缀，所有的第三方声明的类型库都会带有这样的前缀
- JavaScript 中有很多内置对象，它们可以在 TypeScript 中被当做声明好了的类型
- 内置对象是指根据标准在全局作用域（Global）上存在的对象。这里的标准是指 ECMAScript 和其他环境（比如 DOM）的标准
- 这些内置对象的类型声明文件，就包含在[TypeScript 核心库的类型声明文件](https://github.com/Microsoft/TypeScript/tree/master/src/lib)中

#### 12.5.1 使用 jquery

```js
cnpm i jquery -S
//对于common.js风格的模块必须使用 import * as
import * as jQuery from 'jquery';
jQuery.ajax('/user/1');
```

#### 12.5.2 安装声明文件

```js
cnpm i @types/jquery -S
```

#### 12.5.3 自己编写声明文件

- [模块查找规则](https://www.tslang.cn/docs/handbook/module-resolution.html)
- node_modules\@types\jquery/index.d.ts
- 我们可以自己编写声明文件并配置`tsconfig.json`

##### 12.5.3.1 index.d.ts

```
types\jquery\index.d.ts
declare function jQuery(selector:string):HTMLElement;
declare namespace jQuery{
  function ajax(url:string):void
}
export default jQuery;
```

##### 12.5.3.2 tsconfig.json

- 如果配置了`paths`,那么在引入包的的时候会自动去`paths`目录里找类型声明文件
- 在 tsconfig.json 中，我们通过 `compilerOptions` 里的 `paths` 属性来配置路径映射
- `paths`是模块名到基于`baseUrl`的路径映射的列表

```js
{
  "compilerOptions": {
    "baseUrl": "./",// 使用 paths 属性的话必须要指定 baseUrl 的值
    "paths": {
      "*":["types/*"]
    }
}
import $ from "jquery";
$.ajax('get');
```

#### 12.5.4 npm 声明文件可能的位置

- node_modules/jquery/package.json
  - "types":"types/xxx.d.ts"
- node_modules/jquery/index.d.ts
- node_modules/@types/jquery/index.d.ts
- typings\jquery\index.d.ts

#### 12.5.5 查找声明文件

- 如果是手动写的声明文件，那么需要满足以下条件之一，才能被正确的识别
- 给 `package.json` 中的 `types` 或 `typings` 字段指定一个类型声明文件地址
- 在项目根目录下，编写一个 `index.d.ts` 文件
- 针对入口文件（package.json 中的 main 字段指定的入口文件），编写一个同名不同后缀的 `.d.ts` 文件

```json
{
    "name": "myLib",
    "version": "1.0.0",
    "main": "lib/index.js",
    "types": "myLib.d.ts",
}
`
```

- 先找 myLib.d.ts
- 没有就再找 index.d.ts
- 还没有再找 lib/index.d.js
- 还找不到就认为没有类型声明了

### 12.6 扩展全局变量的类型

#### 12.6.1 扩展局部变量类型

```js
declare var String: StringConstructor;
interface StringConstructor {
    new(value?: any): String;
    (value?: any): string;
    readonly prototype: String;
}
interface String {
    toString(): string;
}
//扩展类的原型
interface String {
    double():string;
}

String.prototype.double = function(){
    return this+'+'+this;
}
console.log('hello'.double());

//扩展类的实例
interface Window{
    myname:string
}
console.log(window.myname);
//export {} 没有导出就是全局扩展
```

#### 12.6.2 模块内全局扩展

types\global\index.d.ts

```js
declare global{
    interface String {
        double():string;
    }
    interface Window{
        myname:string
    }
}

export  {}
```

### 12.7 合并声明

- 同一名称的两个独立声明会被合并成一个单一声明
- 合并后的声明拥有原先两个声明的特性

| 关键字        | 作为类型使用 | 作为值使用 |
| :------------ | :----------- | :--------- |
| class         | yes          | yes        |
| enum          | yes          | yes        |
| interface     | yes          | no         |
| type          | yes          | no         |
| function      | no           | yes        |
| var,let,const | no           | yes        |

- 类既可以作为类型使用，也可以作为值使用，接口只能作为类型使用

```js
class Person {
  name: string = '';
}
let p1: Person; //作为类型使用
let p2 = new Person(); //作为值使用

interface Animal {
  name: string;
}
let a1: Animal;
let a2 = Animal; //接口类型不能用作值
```

#### 12.7.1 合并类型声明

- 可以通过接口合并的特性给一个第三方为扩展类型声明

use.js

```js
interface Animal {
  name: string;
}
let a1: Animal = { name: 'pf', age: 10 };
console.log(a1.name);
console.log(a1.age);
//注意不要加export {} ,这是全局的
```

types\animal\index.d.ts

```js
interface Animal {
  age: number;
}
```

#### 12.7.2 使用命名空间扩展类

- 我们可以使用 namespace 来扩展类，用于表示内部类

  ```js
  class Form {
    username: Form.Item='';
    password: Form.Item='';
  }
  //Item为Form的内部类
  namespace Form {
    export class Item {}
  }
  let item:Form.Item = new Form.Item();
  console.log(item);
  ```

#### 12.7.3 使用命名空间扩展函数

- 我们也可以使用 `namespace` 来扩展函数

```js
function greeting(name: string): string {
    return greeting.words+name;
}

namespace greeting {
    export let words = "Hello,";
}

console.log(greeting('pf'))
```

#### 12.7.4 使用命名空间扩展枚举类型

```js
enum Color {
    red = 1,
    yellow = 2,
    blue = 3
}

namespace Color {
    export const green=4;
    export const purple=5;
}
console.log(Color.green)
```

#### 12.7.5 扩展 Store

```js
import { createStore, Store } from 'redux';
type StoreExt = Store & {
  ext: string,
};
let store: StoreExt = createStore((state) => state);
store.ext = 'hello';
```

### 12.8 生成声明文件

- 把 TS 编译成 JS 后丢失类型声明，我们可以在编译的时候自动生成一份 JS 文件

```json
{
  "compilerOptions": {
    "declaration": true /* Generates corresponding '.d.ts' file.*/
  }
}
```

### 12.9 类型声明实战

- [events](https://nodejs.org/api/events.html)

```js
npm link
npm link pf-events
```

#### 12.9.1 index.js

```js
import { EventEmitter } from 'pf-events';
console.log(EventEmitter.defaultMaxListeners);
var e = new EventEmitter();
e.on('message', function (text: string) {
  console.log(text);
});
e.emit('message', 'hello');
```

#### 12.9.2 index.d.ts

```js
export type Listener = (...args: any[]) => void;
export type Type = string | symbol

export class EventEmitter {
   static defaultMaxListeners: number;
   emit(type: Type, ...args: any[]): boolean;
   addListener(type: Type, listener: Listener): this;
   on(type: Type, listener: Listener): this;
   once(type: Type, listener: Listener): this;
}
```
