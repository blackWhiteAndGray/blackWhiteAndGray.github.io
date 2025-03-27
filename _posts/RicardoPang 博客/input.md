---
title: Input
description: Input 组件的文档
---

# Input 文字输入

通过鼠标或键盘输入字符

## 基础用法

<preview path="../demo/Input/Basic.vue" title="基础用法" description="Input 组件的基础用法"></preview>

## 禁用状态

通过 disabled 属性指定是否禁用 input 组件

<preview path="../demo/Input/Disabled.vue" title="禁用状态" description="Input 组件的不同状态"></preview>

## 复合型输入框

可以在输入框中前置或后置一个元素，通常是标签或按钮。

可通过 slot 来指定在 Input 中分发的前置或者后置的内容。

<preview path="../demo/Input/Composite.vue" title="复合型输入框" description="Input 组件的不同状态"></preview>

## 密码框

使用 show-password 属性即可得到一个可切换显示隐藏的密码框

<preview path="../demo/Input/Password.vue" title="密码框" description="Input 组件的不同状态"></preview>

## 一键清空

使用clearable属性即可得到一个可一键清空的输入框

<preview path="../demo/Input/Clear.vue" title="一键清空" description="Input 组件的不同状态"></preview>

## 文本域

用于输入多行文本信息可缩放的输入框。 添加 type="textarea" 属性来将 input 元素转换为原生的 textarea 元素。

<preview path="../demo/Input/Textarea.vue" title="文本域" description="Input 组件的不同状态"></preview>

### Input 属性

| **Name**                | **Description**                              | **Type**           | **Default** |
| ----------------------- | -------------------------------------------- | ------------------ | ----------- |
| type                    | input 原生类型                               | 'string'           | text        |
| model\-value / v\-model | 绑定值                                       | 'string'           |             |
| disabled                | 是否禁用                                     | boolean            | false       |
| placeholder             | 输入框占位文本                               | string             |             |
| size                    | 输入框尺寸，只在 type 不为 'textarea' 时有效 | 'large' \| 'small' |             |
| placeholder             | 输入框占位文本                               | string             |             |
| show\-password          | 是否显示切换密码图标                         | boolean            | false       |
| clearable               | 是否显示清除按钮                             | boolean            | false       |
| readonly                | 原生 readonly 属性，是否只读                 | boolean            | false       |
| autofocus               | 原生属性，自动获取焦点                       | boolean            | false       |
| autocomplete            | 原生 autocomplete 属性                       | string             | off         |

### Input 事件

| **Name** | **Description**                             | **Type**                     |
| -------- | ------------------------------------------- | ---------------------------- |
| blur     | 当选择器的输入框失去焦点时触发              | \(e: FocusEvent\) =&gt; void |
| focus    | 当选择器的输入框获得焦点时触发              | \(e: FocusEvent\) =&gt; void |
| change   | 当选择器的输入框失去焦点时触发              | \(e: string\) =&gt; void     |
| input    | 当选择器的输入框获得焦点时触发              | \(e: string\) =&gt; void     |
| clear    | 在点击由 clearable 属性生成的清空按钮时触发 | \(\)=&gt;void                |

### Input 插槽

| **Name** | **Description** |
| -------- | --------------- |
| prefix   | 输入框头部内容  |
| suffix   | 输入框尾部内容  |
| prepend  | 输入框前置内容  |
| append   | 输入框后置内容  |

### Input 公共方法

| **Name** | **Description**            | **Type**                                           |
| -------- | -------------------------- | -------------------------------------------------- |
| ref      | HTML元素 input 或 textarea | Ref&lt;HTMLInputElement \| HTMLTextAreaElement&gt; |
