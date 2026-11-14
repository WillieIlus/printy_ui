<script setup lang="ts">
/**
 * Production finishing detail (manager / printer capability).
 *
 * The buyer calculator keeps its plain-language quality tiers. A production
 * desk needs the real finishing controls the pricing engine accepts, so this
 * card renders every finishing field the product actually declares: lamination,
 * folding, rounded corners, cover lamination, binding and any industrial
 * finishing the backend later exposes.
 *
 * It writes into the same calculator spec/store as every other card and never
 * prices anything locally.
 */
import { computed } from 'vue'
import DesignCalculatorChoice from '~/components/design/calculator/CalculatorChoice.vue'
import DesignCalculatorWorkflowCard from '~/components/design/calculator/CalculatorWorkflowCard.vue'
import {
  PRODUCTION_FINISHING_FIELD_KEYS,
  optionLabel,
  optionValue,
  type CalculatorConfigField,
  type CalculatorProductConfig,
} from '~/shared/calculator-config'
import type { CalculatorSpec } from '~/shared/calculator-spec'

const props = defineProps<{
  product: CalculatorProductConfig | null
  spec: CalculatorSpec | null
}>()

const emit = defineEmits<{
  patch: [patch: Partial<CalculatorSpec>]
}>()

const FINISHING_ORDER = new Map(
  (PRODUCTION_FINISHING_FIELD_KEYS as readonly string[]).map((key, index) => [key, index]),
)

const fields = computed<CalculatorConfigField[]>(() => {
  const allowed = new Set<string>(PRODUCTION_FINISHING_FIELD_KEYS)
  return (props.product?.fields ?? [])
    .filter((field) => {
      if (!allowed.has(field.key)) {
        return false
      }
      return field.type !== 'select' || (field.options?.length ?? 0) > 0
    })
    .sort((left, right) =>
      (FINISHING_ORDER.get(left.key) ?? Number.MAX_SAFE_INTEGER)
      - (FINISHING_ORDER.get(right.key) ?? Number.MAX_SAFE_INTEGER),
    )
})

function currentValue(field: CalculatorConfigField): unknown {
  if (!props.spec) {
    return undefined
  }
  return (props.spec as unknown as Record<string, unknown>)[field.key]
}

function selectValue(field: CalculatorConfigField): string {
  const value = currentValue(field)
  return typeof value === 'string' ? value : ''
}

function booleanValue(field: CalculatorConfigField): boolean {
  return currentValue(field) === true
}

function summaryFor(field: CalculatorConfigField): string {
  if (field.type === 'boolean') {
    return booleanValue(field) ? field.label : ''
  }
  const value = selectValue(field)
  if (!value) {
    return ''
  }
  const option = (field.options ?? []).find((candidate) => optionValue(candidate) === value)
  return option ? optionLabel(option) : value
}

const summary = computed(() =>
  fields.value
    .map((field) => summaryFor(field))
    .filter(Boolean)
    .join(' · '),
)

function patchField(field: CalculatorConfigField, value: string | boolean) {
  emit('patch', { [field.key]: value } as Partial<CalculatorSpec>)
}
</script>

<template>
  <DesignCalculatorWorkflowCard
    v-if="fields.length"
    n="08"
    label="Finishing"
    hint="Production finishing written into the same priced spec."
  >
    <div class="space-y-3">
      <div v-for="field in fields" :key="field.key">
        <p class="mb-1.5 font-mono text-[9.5px] tracking-[0.12em] text-ink-3 uppercase">
          {{ field.label }}
        </p>
        <div v-if="field.type === 'boolean'" class="flex flex-wrap gap-2">
          <DesignCalculatorChoice
            :active="booleanValue(field) === true"
            @click="patchField(field, true)"
          >
            Yes
          </DesignCalculatorChoice>
          <DesignCalculatorChoice
            :active="booleanValue(field) === false"
            @click="patchField(field, false)"
          >
            No
          </DesignCalculatorChoice>
        </div>
        <div v-else class="flex flex-wrap gap-2">
          <DesignCalculatorChoice
            v-for="option in field.options ?? []"
            :key="optionValue(option)"
            :active="selectValue(field) === optionValue(option)"
            @click="patchField(field, optionValue(option))"
          >
            {{ optionLabel(option) }}
          </DesignCalculatorChoice>
        </div>
      </div>
      <p v-if="summary" class="font-mono text-[10px] tracking-[0.06em] text-ink-3">
        {{ summary }}
      </p>
    </div>
  </DesignCalculatorWorkflowCard>
</template>
