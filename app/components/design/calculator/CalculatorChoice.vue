<script setup lang="ts">
import { cx } from '../../../utils/design/cx'

/**
 * Design-styled choice chip, ported from the design's CalculatorChoice.
 * Keeps the existing Printy Chip contract (`active`, `sub`, `@click`) so the
 * calculator template can swap it in without touching selection logic.
 */
const props = withDefaults(defineProps<{
  active: boolean
  sub?: string
}>(), {
  sub: undefined,
})

const emit = defineEmits<{ click: [] }>()
</script>

<template>
  <button
    type="button"
    :aria-pressed="props.active"
    :class="cx(
      'press-key cursor-pointer rounded-xl border px-3.5 py-2.5 text-left text-[13px] font-medium tracking-tight transition-all duration-200',
      props.active
        ? 'border-brand bg-mint/70 text-brand-deep shadow-card'
        : 'border-line bg-paper text-ink-2 hover:border-line-strong hover:text-ink',
    )"
    @click="emit('click')"
  >
    <slot />
    <span v-if="props.sub" :class="cx('mt-0.5 block font-mono text-[10.5px]', props.active ? 'text-brand-deep/70' : 'text-ink-3')">
      {{ props.sub }}
    </span>
  </button>
</template>
