<template>
  <div class="space-y-4">
    <section class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-4 shadow-sm sm:p-5">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div class="max-w-2xl">
          <p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">Calculator type</p>
          <p class="mt-2 text-sm text-[var(--p-text-muted)]">
            Flat is the default everywhere. Booklet and Large Format are scaffolded here so new calculator types can be added without replacing the current flat flows.
          </p>
        </div>
        <CalculatorTypeSwitcher v-model="activeType" :options="availableOptions" />
      </div>
    </section>

    <slot v-if="activeType === 'flat'" name="flat" />
    <slot v-else-if="activeType === 'booklet'" name="booklet" />
    <slot v-else-if="activeType === 'large_format'" name="large_format" />

    <CalculatorUnavailablePanel
      v-else
      :title="`${activeTypeLabel} calculator`"
      :description="unavailableDescription"
    />
  </div>
</template>

<script setup lang="ts">
import { calculatorTypeOptions, getCalculatorTypeLabel, type CalculatorType, type CalculatorTypeOption } from '~/utils/calculatorTypes'

const props = withDefaults(defineProps<{
  defaultType?: CalculatorType
  availableTypes?: CalculatorType[]
  unavailableDescriptions?: Partial<Record<CalculatorType, string>>
}>(), {
  defaultType: 'flat',
  availableTypes: () => calculatorTypeOptions.map((option) => option.value),
  unavailableDescriptions: () => ({}),
})

const activeType = defineModel<CalculatorType>({ default: 'flat' })

const availableOptions = computed<CalculatorTypeOption[]>(() => {
  const allowed = new Set(props.availableTypes)
  return calculatorTypeOptions.filter((option) => allowed.has(option.value))
})

watchEffect(() => {
  const allowed = availableOptions.value.map((option) => option.value)
  if (!allowed.length) {
    activeType.value = 'flat'
    return
  }
  if (!allowed.includes(activeType.value)) {
    activeType.value = allowed.includes(props.defaultType) ? props.defaultType : allowed[0]!
  }
})

const activeTypeLabel = computed(() => getCalculatorTypeLabel(activeType.value))

const unavailableDescription = computed(() => {
  const custom = props.unavailableDescriptions[activeType.value]
  if (custom) return custom
  return 'This calculator is not available on this surface yet.'
})
</script>
