---
title: Tooltip
description: Tooltip 组件的文档
---

# Tooltip 文字提示

常用于主动操作后的反馈提示。

## 基础用法

这里我们提供 9 种不同方向的展示方式。

<preview path="../demo/Tooltip/Basic.vue" title="基础用法" description="Message 组件的基础用法"></preview>

## 触发方式

由 trigger 属性决定触发方式： hover | click, 默认为 hover

<preview path="../demo/Tooltip/Trigger.vue" title="不同状态" description="Message 组件的不同状态"></preview>

## 更多内容的文字提示

展示多行文本或者是设置文本内容的格式。用具名 slot content，替代tooltip中的content属性。

<preview path="../demo/Tooltip/More.vue" title="可关闭" description="Message 组件的可关闭"></preview>

## 手动关闭所有实例

将 manual 属性设置为 true 即可， 然后可以使用实例上面的 show 和 hide 方法打开关闭下拉菜单。

<preview path="../demo/Tooltip/Manual.vue" title="手动关闭" description="Message 组件的手动关闭"></preview>

### Tooltip 属性

| **Name**        | **Description**                                     | **Type**                                                                                                                                                                            | **Default** |
| --------------- | --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| content         | display content, can be overridden by slot\#content | ^\[string\]                                                                                                                                                                         | ''          |
| placement       | position of Tooltip                                 | ^\[enum\]'top' \| 'top\-start' \| 'top\-end' \| 'bottom' \| 'bottom\-start' \| 'bottom\-end' \| 'left' \| 'left\-start' \| 'left\-end' \| 'right' \| 'right\-start' \| 'right\-end' | bottom      |
| popper\-options | popper\.js parameters                               | ^\[object\]refer to popper\.js doc                                                                                                                                                  | \{\}        |
| open\-delay     | delay of appearance, in millisecond                 | ^\[number\]                                                                                                                                                                         | 0           |
| close\-delay    | delay of disappear, in millisecond                  | ^\[number\]                                                                                                                                                                         | 200         |
| trigger         | How should the tooltip be triggered \(to show\)     | ^\[enum\]'hover' \| 'click'                                                                                                                                                         | hover       |
| manual          | 是否开启手动触发模式                                | ^\[boolean\]\`                                                                                                                                                                      | false       |
| transition      | transition name                                     | ^\[string\]                                                                                                                                                                         | ''          |

### Tooltip 事件

| **Name**        | **Description**                   | **Type** |
| --------------- | --------------------------------- | -------- |
| visible\-change | 当 tooltip 展示/隐藏时被触发      | boolean  |
| click\-outside  | 当点击到 Tooltip 外侧区域时被触发 | boolean  |

### Tooltip 插槽

| **Name** | **Description**                            |
| -------- | ------------------------------------------ |
| default  | Tooltip triggering &amp; reference element |
| content  | customize content                          |

### Tooltip 公共方法

| **Name** | **Description**      | **Type**                                               |
| -------- | -------------------- | ------------------------------------------------------ |
| show     | expose show function | ^\[Function\]\(event?: Event \| undefined\) =&gt; void |
| hide     | expose hide function | ^\[Function\]\(event?: Event \| undefined\) =&gt; void |
