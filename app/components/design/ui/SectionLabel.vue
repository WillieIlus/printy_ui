<script setup lang="ts">
import { cx } from '../../../utils/design/cx'

const props = withDefaults(defineProps<{
  index?: string
  tone?: 'ink' | 'brand' | 'paper'
  class?: string
}>(), {
  index: undefined,
  tone: 'ink',
  class: undefined,
})

const color = computed(() => props.tone === 'brand'
  ? 'text-brand'
  : props.tone === 'paper' ? 'text-paper/70' : 'text-ink-2')
</script>

<template>
  <p :class="cx('flex items-center gap-2 font-mono text-[11px] font-medium tracking-[0.18em] uppercase', color, props.class)">
    <span
      v-if="props.index"
      class="inline-flex h-4 w-6 items-center justify-center rounded-[3px] bg-brand text-[9px] font-semibold tracking-normal text-white"
    >{{ props.index }}</span>
    <slot />
  </p>
</template>
