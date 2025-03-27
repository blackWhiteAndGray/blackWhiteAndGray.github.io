---
title: Message
description: Message 组件的文档
---

# Message 消息提示

常用于主动操作后的反馈提示。

## 基础用法

从顶部出现，3 秒后自动消失。

<preview path="../demo/Message/Basic.vue" title="基础用法" description="Message 组件的基础用法"></preview>

## 不同状态

从顶部出现，3 秒后自动消失。

<preview path="../demo/Message/State.vue" title="不同状态" description="Message 组件的不同状态"></preview>

## 可关闭的消息提示

可以添加关闭按钮。

<preview path="../demo/Message/Close.vue" title="可关闭" description="Message 组件的可关闭"></preview>

## 手动关闭所有实例

可以调用 message 模块提供了一个 closeAll() 手动关闭所有实例。

<preview path="../demo/Message/Manual.vue" title="手动关闭" description="Message 组件的手动关闭"></preview>

### Message 属性

使用 createMessage 创建信息，它接受一个Object，以下是 Object 中的属性列表。

| **Name**  | **Description**                              | **Type**                                    | **Default** |
| --------- | -------------------------------------------- | ------------------------------------------- | ----------- |
| message   | 消息文字                                     | 'string' \| 'vNode'                         |             |
| type      | 消息类型                                     | 'success' \| 'warning' \|'info' \| 'danger' | info        |
| showClose | 是否显示关闭按钮                             | boolean                                     | false       |
| duration  | 显示时间，单位为毫秒。 设为 0 则不会自动关闭 | number                                      | 3000        |

### Message 方法

| **Name** | **Description**    | **Type**        |
| -------- | ------------------ | --------------- |
| close    | 关闭当前的 Message | \(\) =&gt; void |

### Message 全局方法

| **Name** | **Description**        | **Type**        |
| -------- | ---------------------- | --------------- |
| closeAll | 关闭当前所有的 Message | \(\) =&gt; void |
