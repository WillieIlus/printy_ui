<script setup lang="ts">
/**
 * Shared speed cards. Every figure is a range from the calculator's canonical
 * base range (see shared/calculator-speed-pricing.ts); this component only
 * renders it and reports the buyer's choice.
 */
import type { SpeedPriceOption } from '~/shared/calculator-speed-pricing'

withDefaults(defineProps<{
  options: SpeedPriceOption[]
  selected?: string
  loading?: boolean
  disabled?: boolean
}>(), {
  selected: '',
  loading: false,
  disabled: false,
})

const emit = defineEmits<{ select: [key: string] }>()
</script>

<template>
  <div class="grid gap-2 sm:grid-cols-3">
    <button
      v-for="option in options"
      :key="option.key"
      type="button"
      :aria-pressed="selected === option.key"
      :disabled="disabled"
      class="group relative flex w-full cursor-pointer flex-col rounded-xl border p-3 text-left transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60"
      :class="selected === option.key
        ? 'border-brand bg-mint/60 shadow-card'
        : 'border-line bg-paper hover:border-line-strong hover:shadow-card'"
      @click="emit('select', option.key)"
    >
      <span class="text-[13px] font-semibold tracking-tight text-ink">{{ option.label }}</span>
      <span class="tabular mt-1 block font-mono text-[11px] leading-snug text-ink-2">
        <template v-if="loading && !option.text">Pricing…</template>
        <template v-else>{{ option.text || '—' }}</template>
      </span>
    </button>
  </div>
</template>
