<template>
  <div>
    <slot
      v-if="activeType === 'flat'"
      name="flat"
      :active-type="activeType"
      :available-options="availableOptions"
      :set-active-type="setActiveType"
    />
    <slot
      v-else-if="activeType === 'booklet'"
      name="booklet"
      :active-type="activeType"
      :available-options="availableOptions"
      :set-active-type="setActiveType"
    />
    <slot
      v-else-if="activeType === 'large_format'"
      name="large_format"
      :active-type="activeType"
      :available-options="availableOptions"
      :set-active-type="setActiveType"
    />

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
const setActiveType = (type: CalculatorType) => {
  activeType.value = type
}

const unavailableDescription = computed(() => {
  const custom = props.unavailableDescriptions[activeType.value]
  if (custom) return custom
  return 'This calculator is not available on this surface yet.'
})
</script>
