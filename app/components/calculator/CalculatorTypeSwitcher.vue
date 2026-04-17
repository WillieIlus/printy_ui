<template>
  <div class="grid min-w-0 grid-flow-col auto-cols-fr gap-2" role="tablist" aria-label="Calculator type">
    <button
      v-for="option in normalizedOptions"
      :key="option.value"
      type="button"
      class="inline-flex min-w-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl border transition-colors duration-200"
      :class="option.value === model
        ? activeClass
        : inactiveClass"
      :aria-selected="option.value === model"
      :aria-pressed="option.value === model"
      @click="model = option.value"
    >
      <UIcon :name="option.icon" :class="iconClass" />
      {{ option.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { calculatorTypeOptions, type CalculatorType, type CalculatorTypeOption } from '~/utils/calculatorTypes'

const props = withDefaults(defineProps<{
  options?: CalculatorTypeOption[]
  size?: 'sm' | 'md'
  tone?: 'default' | 'embedded'
}>(), {
  options: () => calculatorTypeOptions,
  size: 'md',
  tone: 'default',
})

const model = defineModel<CalculatorType>({ default: 'flat' })

const normalizedOptions = computed(() => props.options.length ? props.options : calculatorTypeOptions)
const sizeClass = computed(() =>
  props.size === 'sm'
    ? 'h-10 px-3 text-[0.78rem] font-semibold'
    : 'h-11 px-3.5 text-sm font-semibold'
)
const iconClass = computed(() => props.size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4')
const activeClass = computed(() =>
  props.tone === 'embedded'
    ? `${sizeClass.value} border-flamingo-400/70 bg-flamingo-500/16 text-white shadow-[0_10px_24px_rgba(240,82,36,0.14)]`
    : `${sizeClass.value} border-flamingo-500 bg-flamingo-500 text-white shadow-sm`
)
const inactiveClass = computed(() =>
  props.tone === 'embedded'
    ? `${sizeClass.value} border-white/10 bg-white/[0.03] text-slate-200 hover:border-flamingo-300/60 hover:text-white`
    : `${sizeClass.value} border-[var(--p-border)] bg-[var(--p-surface)] text-[var(--p-text)] hover:border-flamingo-300 hover:text-flamingo-600`
)
</script>
