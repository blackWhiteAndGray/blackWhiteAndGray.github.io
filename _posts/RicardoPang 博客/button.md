---
title: Button
description: Button 组件的文档
---

# Button 按钮

常用的操作按钮。

## 基础用法

使用 `type`、`plain`、`round` 和 `circle` 来定义按钮的样式。

<preview path="../demo/button/Basic.vue" title="基础用法" description="Button 组件的基础用法"></preview>

## 禁用状态

使用 disabled 属性来定义按钮是否被禁用。

<preview path="../demo/button/Disabled.vue" title="禁用状态" description="Button 组件的禁用状态"></preview>

## 图标按钮

使用图标为按钮添加更多的含义。使用 icon 属性来为按钮添加图标。

<preview path="../demo/button/Icon.vue" title="图标按钮" description="Button 组件的图标按钮"></preview>

## 加载状态按钮

通过设置 loading 属性为 true 来显示加载中状态。

<preview path="../demo/button/Loading.vue" title="加载状态按钮" description="Button 组件的加载状态按钮"></preview>

## 调整尺寸

使用 size 属性额外配置尺寸，可使用 large和small两种值。

<preview path="../demo/button/Size.vue" title="调整尺寸" description="Button 组件的调整尺寸"></preview>

### Button 属性

| Name        | Description                            | Type                                                             | Default |
| ----------- | -------------------------------------- | ---------------------------------------------------------------- | ------- |
| size        | button size                            | `enum` - `'large'\| 'small'`                                     | —       |
| type        | button type                            | `enum` - `'primary'\| 'success'\| 'warning'\| 'danger'\| 'info'` | —       |
| plain       | determine whether it's a plain button  | `boolean`                                                        | false   |
| round       | determine whether it's a round button  | `boolean`                                                        | false   |
| circle      | determine whether it's a circle button | `boolean`                                                        | false   |
| loading     | determine whether it's loading         | `boolean`                                                        | false   |
| disabled    | disable the button                     | `boolean`                                                        | false   |
| icon        | icon component                         | `string`                                                         | —       |
| autofocus   | same as native button's `autofocus`    | `boolean`                                                        | false   |
| native-type | same as native button's `type`         | `enum` - `'button'\| 'submit'\| 'reset'`                         | button  |
