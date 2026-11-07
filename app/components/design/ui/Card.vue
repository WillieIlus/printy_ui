<script setup lang="ts">
import { cx } from '../../../utils/design/cx'

export type CardTone = 'card' | 'paper' | 'ink' | 'brand'

const props = withDefaults(defineProps<{
  tone?: CardTone
  class?: string
}>(), {
  tone: 'card',
  class: undefined,
})

const tones: Record<CardTone, string> = {
  card: 'bg-card border-line text-ink',
  paper: 'bg-paper-2 border-line text-ink',
  ink: 'bg-ink border-ink text-paper',
  brand: 'bg-brand-deep border-brand-deep text-paper',
}
</script>

<template>
  <div :class="cx('rounded-2xl border shadow-card', tones[props.tone], props.class)">
    <slot />
  </div>
</template>
