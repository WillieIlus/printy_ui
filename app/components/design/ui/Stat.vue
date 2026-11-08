<script setup lang="ts">
import { cx } from '../../../utils/design/cx'

const props = withDefaults(defineProps<{
  label: string
  value: string
  hint?: string
  tone?: 'ink' | 'brand' | 'amber' | 'green' | 'paper'
  class?: string
}>(), {
  hint: undefined,
  tone: 'ink',
  class: undefined,
})

const valueTone = computed(() => props.tone === 'brand'
  ? 'text-brand'
  : props.tone === 'amber'
    ? 'text-amber'
    : props.tone === 'green'
      ? 'text-green'
      : props.tone === 'paper'
        ? 'text-paper'
        : 'text-ink')
</script>

<template>
  <div :class="cx('flex flex-col gap-1', props.class)">
    <span :class="cx('font-mono text-[10px] font-medium tracking-[0.16em] uppercase', props.tone === 'paper' ? 'text-paper/60' : 'text-ink-3')">{{ props.label }}</span>
    <span :class="cx('tabular font-mono text-2xl font-semibold tracking-tight', valueTone)">{{ props.value }}</span>
    <span v-if="props.hint" :class="cx('text-xs', props.tone === 'paper' ? 'text-paper/50' : 'text-ink-3')">{{ props.hint }}</span>
  </div>
</template>
