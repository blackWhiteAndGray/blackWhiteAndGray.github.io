---
title: Icon
description: Icon 组件的文档
---

# Icon 图标

常用的图标集合。

## 基础用法

悬停在下拉菜单上以展开更多操作。

<preview path="../demo/Icon/Basic.vue" title="基础用法" description="Icon 组件的基础用法"></preview>

### Icon 属性

| Name        | Description  | Type                                                      | Default |
| ----------- | ------------ | --------------------------------------------------------- | ------- |
| icon        | 图标         | object \| Array\<string\> \| string \| IconDefinition     | ''      |
| type        | 图标类型     | 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info' | -       |
| color       | 图标颜色     | ^[string]                                                 | ''      |
| spin        | 自旋         | ^[boolean]                                                | false   |
| fixedWidth  | 固定宽度     | ^[boolean]                                                | false   |
| listItem    | 列表项       | ^[boolean]                                                | false   |
| swapOpacity | 交换不透明度 | ^[boolean]                                                | false   |
| flip        | 翻转         | 'horizontal' \| 'vertical' \| 'both'                      | -       |
| rotation    | 旋转         | rotation?: 90 \| 180 \| 270 \| '90' \| '180' \| '270'     | -       |
| transform   | 动画         | ^[object]                                                 | -       |

### 图标集合

[在线网站](https://fontawesome.com/search?o=r&m=free)

![图标集合](https://p.ipic.vip/eepjyq.png)
