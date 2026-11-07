<script setup lang="ts">
import { cx } from '../../../utils/design/cx'

const props = withDefaults(defineProps<{
  quiet?: boolean
}>(), {
  quiet: false,
})
</script>

<template>
  <span :class="cx('ml-auto inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[9.5px] font-semibold tracking-[0.08em] uppercase', props.quiet ? 'border-line bg-paper text-ink-3' : 'border-brand/40 bg-mint text-brand-deep')">
    <slot />
  </span>
</template>
