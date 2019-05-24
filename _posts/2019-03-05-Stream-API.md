---
layout:     post
title:      Stream API
subtitle:   Java 8 新特性 Stream API
date:       2019-03-05
author:     黑白灰
header-img: img/post-bg-ios9-web.jpg
catalog: true
tags:
    - Java 8
    - 新特性
    - 函数式编程
    - Stream
---
# 前言

![Stream API思维导图](https://ws3.sinaimg.cn/large/006tKfTcgy1g0sb8g0ahjj30sy0a8gnd.jpg)
# 什么是 Stream


#### 基本定义

Java 8 中的 Stream 是对集合对象功能的增强，它专注于对集合对象进行各种便利、高效的集合操作或者大批量数据操作。
#### 内部遍历与外部遍历

内部遍历和外部遍历（stream 和 iterator）： 外部遍历会导致遍历的逻辑和处理数据的逻辑混淆.


#### Stream 实质

- **虽然 Stream 表面上允许改编数据或者获取数据，但是实质上**
     1. Stream 不会存储数据。
     2. Stream 不会改变原数据。
     3. 单向、不可重复使用。
     4. Stream 的部分操作是延迟的。
     5. Stream 可以方便的进行并行操作
     6. 总结：可以简单理解为 Stream 是一种高级的 Iterator， 这种 Iterator 迭代器提供了更多关于其包含的数据和操作功能.

     ``` java
     @Test
	    public void test() {
	        // 外不循环：循环的代码和业务处理的代码混淆
	        Integer[] integers = new Integer[] {1, 2, 3, 4, 5, 6, 7, 8};
	        List<Integer> ret = new ArrayList<>();
	        for (Integer i: integers) {
	            if (i > 5) ret.add(i);
	        }
	        System.out.println(ret);
		
	        // Stream：内部循环，代码里面不需要写循环的操作
	        // 1. Stream 不会存储数据；
	        // 2. Stream 不会修改以前的数据；
	        // 3. Stream 是单选，不可重复使用；
	        // 4. Steam 的部分操作是延迟的；
	        //    调用一个方法，骂死执行，我们叫做迫切执行方法，如果调用了一个方法，并不会立刻执行，叫做延迟执行方法;
	        //    1. 只要 Stream 的方法返回的是 Stream， 那么这些方法就是延迟执行的方法；
	        //    2. 延迟执行方法一定要等到一个迫切执行方法执行的时候，才会执行（在 Stream 里面，返回的不是一个 Stream 基本都是迫切执行方法）
	        Stream.of(integers).filter(x -> x > 5).collect(Collectors.toList())
	                .forEach(System.out::println);
	    }
     ```

     
# 创建 Stream

#### 把数组变成 Stream -> Arrays.stream()

```java
/**
 * 把数组变成 Stream -> Arrays.stream()
 */
@Test
public void testArraysStream() {
    int[] ints = new int[]{1, 2, 3, 4, 5};
    // 通过 Arrays.stream(int[]) 得到一个 IntStream，IntStream 是一种特殊的 Stream
    IntStream intStream = Arrays.stream(ints);

    // 针对对象的数据， Arrays.stream -> Stream<T>
    User[] users = new User[]{new User("haha", 1), new User("hehe", 2)};
    Stream<User> userStream = Arrays.stream(users);
}
```

#### 调用 Stream.of() 来完成

```java
/**
 * 调用 Stream.of() 来完成
 */
@Test
public void testArrayStream2() {
    int[] ints = new int[]{1, 2, 3, 4, 5};
    // 注意，不能直接吧简单类型的数组作为 Stream.of 的参数（返回的是 Stream<int[]>）
    Stream<int[]> intsStream = Stream.of(ints);

    // 得到一个 Stream<Integer>, 这个 Stream 里面的操作会涉及到 autobox/unbox
    // 一定要注意，Stream<Integer> 和 IntStream 是不一样的对象
    Stream<Integer> integerStream = Stream.of(1, 2, 3, 4, 5);
}
```

#### 集合类型 -> Stream
```java
/**
 * 集合类型 -> Stream
 */
@Test
public void testColStream() {
    // 对于集合，直接调用对应的 stream 方法；
    List<String> strings = Arrays.asList(new String[]{"a", "b", "c"});
    Stream<String> stream = strings.stream();

    // 得到并行执行的 Stream
    Stream<String> streamp = strings.parallelStream();
}
```

#### 创建一个空 Stream

```java
@Test
public void testEmptyStream() {
    // 创建一个空的 Stream
    Stream<Integer> empty = Stream.empty();
}
```

#### 创建一个无限大的 Stream

```java
/**
 * 如果可以再遍历 Stream 元素的时候，才去生成要处理的下一个元素，
 * 就有可能创建一个无限大的 Stream； 延迟
 * <p>
 * 可以创建大量的数据
 */
@Test
public void testUnlimitStream() {
    Stream.generate(() -> "haha").forEach(System.out::println);
    // limit(),截取 limit 个数据
    Stream.generate(() -> "哈哈").limit(100).forEach(System.out::println);

    Stream.generate(() -> new User("haha", 10)).limit(100).forEach(System.out::println);

    Stream.generate(Math::random).limit(10000).forEach(System.out::println);
}
```

#### 使用 Stream.iterate 方法产生均匀数据

```java
/**
 * 产生规律的数据
 * 使用 Stream.iterate 方法产生均匀数据
 */
@Test
public void testUnlimitStream2() {
    Stream.iterate(0, UnaryOperator.identity()).limit(10).forEach(System.out::println);
    Stream.iterate(0, x -> x + 1).limit(10).forEach(System.out::println);
}
```


# Java 8 提供的常见的函数式接口

- **上面介绍完得到 Stream 的几种方法后，下边总结一下Java API 为我们提供的函数式接口**
     1. 谓词类接口：Predicate; DoublePredicate; IntPredicate; LongPredicate (传入一个参数，返回一个boolean，一般用在判断上面， x -> x > 3,典型的 filter 方法)。
     2. 单元（一元）操作接口： UnaryOperator; LongUnaryOperator; DoubleUnaryOperator; IntUnaryOperator （特殊的function，要求传入的类型和返回的类型一致， x -> fn(x)， 典型操作：iterate）。
     3. 二元操作接口： BinaryOperator; LongBinaryOperator; IntBinaryOperator; DoubleBinaryOperator （传入两个相同类型的参数，返回一个值，这个值得类型和参数相同，适用于两个相同类型数据的合并）。
     4. 单元函数接口： Function; IntFunction; DoubleFunction; LongFunction (传入一个参数，返回一个值，允许参数的类型和返回的类型不同；一般用作转换， x -> fn(x)， 典型的使用方法map)。
     5. 二元函数接口：BiFunction （传入A,B两个参数，返回C值，A,B,C三个值类型可以不相同，一般用作合并， (x, y) -> fn(x, y)）。
     6. 消费者接口： Consumer; ConsumerLong; ConsumerInt; ConsumerDouble （传入一个值，没有返回值；System.out::println）。
     7. 二元消费接口: BiConsumer (传入A,B两个参数，不需要有返回值；典型使用，把一个元素添加到一个中间结果集中； (x, y) -> fn(x, y))。
     8. 工厂接口： Supplier; SupplierInt; SupplierDouble; SupplierLong (不需要参数，返回一个值，典型使用generate)。

     
# Stream 元素和 Stream 操作

#### 过滤元素（filter，distinct）

```java
/**
 * 筛选出所有已数字开头的字符串
 */
@Test
public void testFilter1() {
    String[] a = new String[]{"1a", "2b", "3c", "dc"};
    Arrays.stream(a).filter(x -> Character.isDigit(x.charAt(0))).forEach(System.out::println);
}
```

```java
/**
 * distinct：把流中的重复对象过滤
 */
@Test
public void testDistinct() {
    Stream.of("a", "b", "c", "d", "a", "b").distinct()
            .forEach(System.out::println);
}
```

#### 改变元素（map 和 flatMap）

```java
/**
 * map作用：把一种类型的流编程另一种类型的流
 */
@Test
public void testMap() {
    String[] strings = new String[]{"yes", "Yes", "no", "No", "YES"};
    Arrays.stream(strings).map(String::toUpperCase)
            .forEach(System.out::println);
}
```

```java
/**
 * flatMap
 * 把Stream<String[]>合并成一个Stream<String>
 */
@Test
public void testFlatMap() {
    String[] arr1 = new String[]{"a", "b", "c"};
    String[] arr2 = new String[]{"d", "e", "f"};
    String[] arr3 = new String[]{"a", "g", "h"};

    Stream.of(arr1, arr2, arr3).flatMap(arr -> Arrays.stream(arr));
}
```

#### 拆分和合并流（limit,skip,concat,peek）

```java
/**
 * limit：限制从流中获得前N个数据
 */
@Test
public void testLimit() {
    Stream.iterate(1, x -> x + 1).limit(100).forEach(System.out::println);
}
```

```java
/**
 * skip：跳过前N个数据
 */
@Test
public void testSkip() {
    Stream.of(1, 2, 3, 4, 5).skip(3).forEach(System.out::println);
}
```

```java
/**
 * concat：可以把两个Stream合并成一个Stream（合并的Stream类型必须相同）
 */
@Test
public void testConcat() {
    Stream<String> stream1 = Stream.of("a", "b", "c", "d");
    Stream<String> stream2 = Stream.of("e", "f", "g", "h");

    Stream.concat(stream1, stream2).forEach(System.out::println);
}
```

```java
/**
 * peek: 查看流的每个节点细节
 */
@Test
public void testPeek() {
    Stream<Integer> integerStream = Stream.of(1, 2, 3, 4, 5, 6, 7);
    integerStream
            .peek(System.out::print).filter(x -> x > 3)
            .peek(System.out::print).filter(x -> x < 7)
            .forEach(System.out::println);
}

/**
 * 调用parallel()方法，把流编程并行流
 */
@Test
public void testPeekPal() {
    // parallel(): 该方法把流变成了一个并行执行的流
    Stream<Integer> integerStream = Stream.of(1, 2, 3, 4, 5, 6, 7).parallel();
    integerStream
            .peek(System.out::print).filter(x -> x > 3)
            .peek(System.out::print).filter(x -> x < 7)
            .forEach(System.out::println);
}
```

#### 流的排序

```java
/**
 * sorted：无参的排序方法，要能够使用sorted()方法进行排序
 * 要求留的数据类型必须是实现了Comparable接口
 * 默认安装自然排序
 */
@Test
public void testSorted() {
    Stream.of(5, 4, 3, 2, 1).sorted().forEach(System.out::println);
}

/**
 * sorted方法：传入一个自定义的比较器
 */
@Test
public void testSorted2() {
    Stream.of(5, 4, 3, 2, 1).sorted(Integer::compare)
            .forEach(System.out::println);
}
```




>未完待续