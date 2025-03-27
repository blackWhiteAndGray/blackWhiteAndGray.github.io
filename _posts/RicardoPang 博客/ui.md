---
title: 前端组件库
description: 自定义组件库开发
---

> 虽然市面上已经有很多知名的组件库，但由于团队设计规范和业务需求的多样性，实际开发中经常需要自行开发团队内部的基础和业务组件库。为了解决业务类型多、重复造轮子、项目升级以及公司规范无法统一等问题，我们决定开发属于自己的组件库。
>
> 组件开发方法论：
>
> 1. 根据需求初步去定属性/事件/slots/expose
> 2. 组件的静态版本(html,classes,slots)
> 3. 行为功能做成开发计划列表
> 4. 根据列表完成功能
> 5. 样式/测试
>
> [组件库文档](https://ricardopang.github.io/)

## 从零开始：打造一个现代化的Vue3组件库

在当今快速发展的前端世界中，组件库已成为提高开发效率、保持代码一致性的关键工具。本文将带您深入探讨如何从零开始构建一个现代化的Vue3组件库，涵盖从项目搭建到核心组件开发的全过程。我们将以实际项目"pf-component-library"为例，分享在开发过程中的经验和心得。

##### 项目基础：Vite与TypeScript的完美结合

选择合适的工具对于项目的成功至关重要。我们选择Vite作为构建工具，它不仅启动速度快，还支持热模块替换（HMR），大大提高了开发效率。结合TypeScript，我们能够在开发过程中捕获潜在错误，提供更好的代码提示和自动完成功能。

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()]
  // 其他配置...
})
```

##### 样式解决方案：PostCSS的魔力

为了实现灵活的样式定制，我们采用PostCSS作为CSS预处理器。它轻量级、插件化，且Vite原生支持。通过使用CSS变量和PostCSS插件，我们可以轻松实现主题定制、嵌套语法等高级功能。

```postcss
/* button.pcss */
.pf-button {
  --button-color: var(--primary-color, #1890ff);

  &:hover {
    background-color: color-mod(var(--button-color) lightness(+10%));
  }
}
```

## 核心组件开发

##### Button组件：简单而不简单

Button看似简单，却是最常用的组件之一。我们的Button组件支持多种类型、大小和样式，关键在于合理使用CSS变量和响应式类名。

```vue
<template>
  <button
    :class="[
      'pf-button',
      `pf-button--${type}`,
      `pf-button--${size}`,
      { 'is-disabled': disabled }
    ]"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'PfButton',
  props: {
    type: {
      type: String as PropType<'primary' | 'secondary' | 'text'>,
      default: 'primary'
    },
    size: {
      type: String as PropType<'small' | 'medium' | 'large'>,
      default: 'medium'
    },
    disabled: Boolean
  },
  emits: ['click'],
  setup(props, { emit }) {
    const handleClick = (event: MouseEvent) => {
      if (!props.disabled) {
        emit('click', event)
      }
    }

    return { handleClick }
  }
})
</script>
```

##### VirtualScroll组件：性能的艺术

在处理大量数据时，VirtualScroll组件是提升性能的关键。它的核心思想是只渲染可见区域的内容，通过动态计算和设置上下空白来模拟完整列表。

```vue
<template>
  <div
    ref="containerRef"
    class="virtual-scroll-container"
    @scroll="handleScroll"
  >
    <div :style="{ height: totalHeight + 'px' }">
      <div :style="{ transform: `translateY(${startOffset}px)` }">
        <div v-for="item in visibleItems" :key="item.id">
          <slot :item="item"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onUnmounted } from 'vue'
import { throttle } from 'lodash-es'

export default defineComponent({
  name: 'VirtualScroll',
  props: {
    items: Array,
    itemHeight: Number
  },
  setup(props) {
    const containerRef = ref<HTMLElement | null>(null)
    const scrollTop = ref(0)
    const visibleCount = ref(0)

    const startIndex = computed(() =>
      Math.floor(scrollTop.value / props.itemHeight)
    )

    const visibleItems = computed(() =>
      props.items.slice(startIndex.value, startIndex.value + visibleCount.value)
    )

    const totalHeight = computed(() => props.items.length * props.itemHeight)

    const startOffset = computed(() => startIndex.value * props.itemHeight)

    const handleScroll = throttle(() => {
      if (containerRef.value) {
        scrollTop.value = containerRef.value.scrollTop
      }
    }, 16)

    onMounted(() => {
      if (containerRef.value) {
        visibleCount.value =
          Math.ceil(containerRef.value.clientHeight / props.itemHeight) + 1
      }
    })

    return {
      containerRef,
      visibleItems,
      totalHeight,
      startOffset,
      handleScroll
    }
  }
})
</script>
```

## Tree组件：数据结构的挑战

Tree组件展示了如何处理复杂的数据结构。通过递归渲染和状态管理，我们实现了节点的展开/折叠、选中等功能。结合虚拟滚动，即使是大量数据也能保持良好的性能。

```vue
<template>
  <div class="pf-tree">
    <virtual-scroll :items="flattenedNodes" :item-height="24">
      <template #default="{ item }">
        <tree-node
          :node="item"
          :level="item.level"
          @toggle="toggleNode"
          @select="selectNode"
        />
      </template>
    </virtual-scroll>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import VirtualScroll from '../VirtualScroll.vue'
import TreeNode from './TreeNode.vue'

export default defineComponent({
  name: 'PfTree',
  components: { VirtualScroll, TreeNode },
  props: {
    data: Array
  },
  setup(props) {
    const expandedKeys = ref(new Set())
    const selectedKeys = ref(new Set())

    const flattenedNodes = computed(() => {
      // 实现树节点扁平化逻辑
    })

    const toggleNode = (node) => {
      if (expandedKeys.value.has(node.key)) {
        expandedKeys.value.delete(node.key)
      } else {
        expandedKeys.value.add(node.key)
      }
    }

    const selectNode = (node) => {
      if (selectedKeys.value.has(node.key)) {
        selectedKeys.value.delete(node.key)
      } else {
        selectedKeys.value.add(node.key)
      }
    }

    return {
      flattenedNodes,
      toggleNode,
      selectNode
    }
  }
})
</script>
```

## 测试与文档：质量保证

使用Vitest和Vue Test Utils进行单元测试，确保每个组件的功能正确性和稳定性。同时，我们采用TSDoc格式编写注释，不仅提高了代码可读性，还为自动生成API文档提供了基础。

```typescript
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import PfButton from './Button.vue'

describe('PfButton', () => {
  it('renders correctly', () => {
    const wrapper = mount(PfButton, {
      props: { type: 'primary' },
      slots: { default: 'Click me' }
    })
    expect(wrapper.classes()).toContain('pf-button--primary')
    expect(wrapper.text()).toBe('Click me')
  })

  it('emits click event when not disabled', async () => {
    const wrapper = mount(PfButton)
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('does not emit click event when disabled', async () => {
    const wrapper = mount(PfButton, {
      props: { disabled: true }
    })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeFalsy()
  })
})
```

## 结语

构建一个现代化的Vue3组件库是一个充满挑战但也极其有趣的过程。通过合理的技术选型、精心的组件设计和全面的测试覆盖，我们不仅提高了开发效率，也为项目的长期维护奠定了坚实的基础。希望本文能为您在组件库开发的道路上提供一些启发和指导。

记住，优秀的组件库不仅仅是代码的集合，更是团队智慧的结晶。持续改进、倾听用户反馈，您的组件库终将成为团队开发中不可或缺的得力助手。

[源码地址](https://github.com/RicardoPang/pf-component-library)
