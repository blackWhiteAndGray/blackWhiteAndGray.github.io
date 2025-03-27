---
title: VirtualScroll
description: VirtualScroll 虚拟滚动
---

# VirtualScroll 虚拟滚动

滚动至底部时，加载更多数据。

当页面中需要展示大量数据时，只会加载部分可见的数据，而不是一次性全部加载，从而提高页面的性能和用户体验。

## 基础用法

垂直方向固定高度，即列表每个项的高度固定统一，滚动后按高度计算视图内需要展示的列表项。

<preview path="../demo/VirtualScroll/Basic.vue" title="基础用法" description="VirtualScroll 组件的基础用法"></preview>

## 水平滚动

水平方向固定高度，即列表每个项的高度固定统一，滚动后按高度计算视图内需要展示的列表项。

<preview path="../demo/VirtualScroll/Vertical.vue" title="水平滚动" description="VirtualScroll 组件的水平滚动"></preview>

## 动态高度

即列表项高度需要在页面运行起来，渲染完毕之后才能确定高度。

<preview path="../demo/VirtualScroll/DynamicHeight.vue" title="动态高度" description="VirtualScroll 组件的动态高度"></preview>

### VirtualScroll 属性

| **属性名**          | **说明**             | **类型** | **默认值** |
| ------------------- | -------------------- | -------- | ---------- |
| msg                 | 请求提示信息         | string   | 正在载入   |
| oneHeight           | 记录单条数据高度     | number   | 100        |
| oneWidth            | 记录单条数据宽度度   | number   | 100        |
| requestUrl          | 请求数据的url        | string   | ''         |
| offset              | 请求数据偏移量       | number   | 0          |
| size                | 每页显示条数         | number   | 20         |
| scrollDirection     | 滚动方向             | string   | vertical   |
| autoHeight          | 是否需要动态高度计算 | boolean  | false      |
| estimatedItemHeight | 动态高度估算值       | number   | 100        |
