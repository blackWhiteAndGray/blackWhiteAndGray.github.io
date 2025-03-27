---
title: Dropdown
description: Dropdown 组件的文档
---

# Dropdown 下拉菜单

将动作或菜单折叠到下拉菜单中。

## 基础用法

悬停在下拉菜单上以展开更多操作。

<preview path="../demo/Dropdown/Basic.vue" title="基础用法" description="Dropdown 组件的基础用法"></preview>

## 触发方式

可以配置点击激活或者悬停激活。将 trigger 属性设置为 click 即可， 默认为 hover。

<preview path="../demo/Dropdown/TriggerMode.vue" title="触发方式" description="Dropdown 组件的触发方式"></preview>

## 手动触发

将 manual 属性设置为 true 即可， 然后可以使用实例上面的 show 和 hide 方法打开关闭下拉菜单。

<preview path="../demo/Dropdown/Manual.vue" title="手动触发" description="Dropdown 组件的手动触发"></preview>

### Dropdown 属性

| Name           | Description                         | Type           | Default                                                                                                                                                                   |
| -------------- | ----------------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| menuOptions    | 菜单选项                            | ^MenuOption[]  | []                                                                                                                                                                        |
| placement      | 菜单位置                            | ^[enum]'top'   | ^[enum]'top' \| 'top-start' \| 'top-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end' \| 'left' \| 'left-start' \| 'left-end' \| 'right' \| 'right-start' \| 'right-end' |
| open-delay     | delay of appearance, in millisecond | ^[number]      | 0                                                                                                                                                                         |
| close-delay    | delay of disappear, in millisecond  | ^[number]      | 0                                                                                                                                                                         |
| trigger        | 触发方式                            | ^[enum]'hover' | 'click' \| hover                                                                                                                                                          |
| manual         | 是否开启手动触发模式                | ^[boolean]`    | false                                                                                                                                                                     |
| transition     | transition name                     | ^[string]      | ''                                                                                                                                                                        |
| hideAfterClick | 点击以后是否自动隐藏菜单            | ^[boolean]     | true                                                                                                                                                                      |

### MenuOption

| **Name** | **Description** | **Type**             | **Default** |
| -------- | --------------- | -------------------- | ----------- |
| label    | 菜单展示标签    | 'string' \| 'vNode'  |             |
| key      | 菜单选项 Key    | 'string' \| 'number' |             |
| disabled | 是否禁用        | boolean              | false       |
| divided  | 是否显示分隔符  | boolean              | false       |

### Dropdown 事件

| **Name**        | **Description**                | **Type**   |
| --------------- | ------------------------------ | ---------- |
| visible\-change | 当 tooltip 展示/隐藏时被触发   | boolean    |
| select          | 当选择到某一个选项的时候被触发 | MenuOption |

### Dropdown 方法

| **Name** | **Description**      | **Type**                                               |
| -------- | -------------------- | ------------------------------------------------------ |
| show     | expose show function | ^\[Function\]\(event?: Event \| undefined\) =&gt; void |
| hide     | expose hide function | ^\[Function\]\(event?: Event \| undefined\) =&gt; void |
