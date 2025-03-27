---
title: Tree
description: Tree 树形控件
---

# Tree 树形控件

用清晰的层级结构展示信息，可展开或折叠。

## 基础用法

垂直方向固定高度，即列表每个项的高度固定统一，滚动后按高度计算视图内需要展示的列表项。

<preview path="../demo/Tree/Basic.vue" title="基础用法" description="VirtualScroll 组件的基础用法"></preview>

### Tree 属性

| **属性名**           | **说明**                           | **类型**         | **默认值**       |
| -------------------- | ---------------------------------- | ---------------- | ---------------- |
| hasInput             | 是否含有过滤输入框                 | boolean          | false            |
| placeholder          | 过滤输入框的 placeholder           | string           | 请输入关键字查找 |
| indent               | 缩进                               | string \| number | 15               |
| expandLevel          | 展开程度                           | string \| number | 'all'            |
| expandKeys           | 指定 id 展开                       | string[]         | []               |
| isLoading            | 是否正在加载                       | boolean          | false            |
| checkedAction        | 选中节点时的动作类型               | string           | 'none'           |
| emptyText            | 内容为空展示的文本                 | string           | '暂无数据'       |
| showCheckbox         | 是否展示 checkbox                  | boolean          | false            |
| showCheckboxLeafOnly | 是否仅叶子节点展示 checkbox        | boolean          | false            |
| defaultCheckedKeys   | 默认选中                           | string[]         | []               |
| checkStriclty        | 是否严格的遵循父子不互相关联的做法 | boolean          | false            |
| showCheckbox         | 是否展示 checkbox                  | boolean          | false            |
| showLine             | 是否显示连线                       | boolean          | false            |
| draggable            | 是否可拖拽                         | boolean          | false            |

### Tree 方法

| **Name**        | **Description**                        | **Type**                                    |
| --------------- | -------------------------------------- | ------------------------------------------- |
| onChange        | 选中状态变化触发                       | \(\) =&gt; （{ checkedKeys, checkedNodes }) |
| onClickLabel    | 点击 label 触发                        | \(\) =&gt; void                             |
| onClickCheckbox | 点击 checkbox 触发, 获取当前点击的节点 | \(\) =&gt; void                             |

### Tree 全局方法

| **Name**  | **Description**       |
| --------- | --------------------- |
| default   | label 的 slot         |
| pre-input | input 输入框前的 slot |
| loading   | 自定义加载中 slot     |
