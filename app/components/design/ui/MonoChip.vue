<script setup lang="ts">
import { cx } from '../../../utils/design/cx'

const props = defineProps<{
  class?: string
}>()
</script>

<template>
  <span :class="cx('inline-flex items-center gap-1.5 rounded-md border border-line bg-paper-2 px-2 py-0.5 font-mono text-[11px] font-medium text-ink-2', props.class)">
    <slot />
  </span>
</template>
