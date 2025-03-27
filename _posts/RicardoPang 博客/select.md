---
title: Select
description: Select 组件的文档
---

# Select 选择器

常用于主动操作后的反馈提示。

## 基础用法

适用广泛的基础单选 v-model 的值为当前被选中的 option 的 value 属性值。

<preview path="../demo/Select/Basic.vue" title="基础用法" description="Select 组件的基础用法"></preview>

## 可清空单选

您可以使用清除图标来清除选择。

<preview path="../demo/Select/Clear.vue" title="可清空单选" description="Select 组件的基础用法"></preview>

## 自定义模板

你可以自定义如何来渲染每一个选项, 使用 renderLabel 属性，它接受一个回调函数，返回 vNode 类型。

<preview path="../demo/Select/VNode.vue" title="自定义模板" description="Select 组件的基础用法"></preview>

## 筛选选项

可以利用筛选功能快速查找选项。

<preview path="../demo/Select/Filter.vue" title="筛选选项" description="Select 组件的基础用法"></preview>

## 远程搜索

输入关键字以从远程服务器中查找数据。

<preview path="../demo/Select/Remote.vue" title="远程搜索" description="Select 组件的基础用法"></preview>

### Select 属性

| **Name**                | **Description**                | **Type**                                                          | **Default** |
| ----------------------- | ------------------------------ | ----------------------------------------------------------------- | ----------- |
| model\-value / v\-model | 绑定值                         | 'string \| number'                                                |             |
| options                 | 下拉框选项                     | SelectOption\[\]                                                  | \[\]        |
| disabled                | 是否禁用                       | boolean                                                           | false       |
| placeholder             | 输入框占位文本                 | string                                                            | ''          |
| clearable               | 是否显示清除按钮               | boolean                                                           | false       |
| filterable              | 自定义筛选方法                 | boolean                                                           | false       |
| filter\-method          | 自定义筛选方法                 | \(value: string \| number\) =&gt; SelectOption\[\]                |             |
| remote                  | 其中的选项是否从服务器远程加载 | boolean                                                           | false       |
| remote\-method          | 自定义远程筛选方法             | \(value: string \| number\) =&gt; Promise&lt;SelectOption\[\]&gt; |             |

### SelectOption 属性

| **Name** | **Description** | **Type**         | **Default** |
| -------- | --------------- | ---------------- | ----------- |
| label    | 选项显示的文字  | 'string'         |             |
| value    | 选项的值        | string \| number |             |
| disabled | 是否禁用        | boolean          | false       |

### Select 事件

| **Name**        | **Description**                             | **Type**                       |
| --------------- | ------------------------------------------- | ------------------------------ |
| change          | 当选择器的输入框失去焦点时触发              | \(e: SelectOption\) =&gt; void |
| visible\-change | 当下拉框显示或者隐藏时候触发                | \(e: boolean\) =&gt; void      |
| clear           | 在点击由 clearable 属性生成的清空按钮时触发 | \(\)=&gt;void                  |
