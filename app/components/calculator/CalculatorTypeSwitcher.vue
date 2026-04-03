<template>
  <div class="flex flex-wrap gap-2" role="tablist" aria-label="Calculator type">
    <button
      v-for="option in normalizedOptions"
      :key="option.value"
      type="button"
      class="inline-flex min-h-10 items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold transition"
      :class="option.value === model
        ? 'border-flamingo-500 bg-flamingo-500 text-white shadow-sm'
        : 'border-[var(--p-border)] bg-[var(--p-surface)] text-[var(--p-text)] hover:border-flamingo-300 hover:text-flamingo-600'"
      :aria-selected="option.value === model"
      :aria-pressed="option.value === model"
      @click="model = option.value"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { calculatorTypeOptions, type CalculatorType, type CalculatorTypeOption } from '~/utils/calculatorTypes'

const props = withDefaults(defineProps<{
  options?: CalculatorTypeOption[]
}>(), {
  options: () => calculatorTypeOptions,
})

const model = defineModel<CalculatorType>({ default: 'flat' })

const normalizedOptions = computed(() => props.options.length ? props.options : calculatorTypeOptions)
</script>
