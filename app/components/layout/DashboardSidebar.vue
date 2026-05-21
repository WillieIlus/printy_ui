<template>
  <aside :class="classes">
    <slot />
  </aside>
</template>

<script setup lang="ts">
import { PRINTY_SHELLS } from '~/constants/design'

const props = withDefaults(defineProps<{
  tone?: 'light' | 'dark'
  topOffset?: string
}>(), {
  tone: 'light',
  topOffset: 'top-16',
})

const classes = computed(() => [
  'w-60 shrink-0 overflow-y-auto bg-white',
  props.topOffset,
  PRINTY_SHELLS.sidebar[props.tone],
  props.tone === 'dark'
    ? 'border-r border-white/10 lg:sticky lg:top-16 lg:flex lg:h-[calc(100vh-4rem)]'
    : 'border-r border-slate-200 lg:sticky lg:top-16 lg:flex lg:h-[calc(100vh-4rem)]',
])
</script>
