<template>
  <div class="relative rounded-2xl bg-gray-800/50 border border-white/10 p-6 backdrop-blur-md shadow-2xl">
    <div class="flex justify-between items-center mb-4">
      <div class="flex gap-2">
        <span class="w-3 h-3 rounded-full bg-red-400" />
        <span class="w-3 h-3 rounded-full bg-yellow-400" />
        <span class="w-3 h-3 rounded-full bg-green-400" />
      </div>
      <span class="text-[10px] font-semibold uppercase tracking-wider text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded">
        Demo prices
      </span>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Left: Inputs -->
      <div class="space-y-3">
        <UFormField label="Size / Unit">
          <USelectMenu
            :model-value="unitOptions.find(o => o.value === form.unit) ?? form.unit"
            :items="unitOptions"
            value-attribute="value"
            class="w-full"
            :ui="{ base: 'dark:bg-gray-800/80 dark:border-white/10' }"
            @update:model-value="(v: { value: DemoUnit } | DemoUnit) => form.unit = (v && typeof v === 'object' && 'value' in v) ? v.value : v"
          />
        </UFormField>

        <template v-if="form.unit === 'SQM'">
          <div class="grid grid-cols-2 gap-2">
            <UFormField label="Width (m)">
              <UInput
                v-model.number="form.widthM"
                type="number"
                step="0.1"
                min="0.1"
                :ui="{ base: 'dark:bg-gray-800/80 dark:border-white/10' }"
              />
            </UFormField>
            <UFormField label="Height (m)">
              <UInput
                v-model.number="form.heightM"
                type="number"
                step="0.1"
                min="0.1"
                :ui="{ base: 'dark:bg-gray-800/80 dark:border-white/10' }"
              />
            </UFormField>
          </div>
        </template>

        <UFormField label="Sides">
          <USelectMenu
            :model-value="sidesOptions.find(o => o.value === form.sides) ?? form.sides"
            :items="sidesOptions"
            value-attribute="value"
            class="w-full"
            :ui="{ base: 'dark:bg-gray-800/80 dark:border-white/10' }"
            @update:model-value="(v: { value: 1 | 2 } | number) => form.sides = (v && typeof v === 'object' && 'value' in v) ? v.value : v"
          />
        </UFormField>

        <UFormField label="Quantity">
          <UInput
            v-model.number="form.quantity"
            type="number"
            min="1"
            :ui="{ base: 'dark:bg-gray-800/80 dark:border-white/10' }"
          />
        </UFormField>

        <UFormField label="Material">
          <USelectMenu
            :model-value="materialOptions.find(o => o.value === form.material) ?? form.material"
            :items="materialOptions"
            value-attribute="value"
            class="w-full"
            :ui="{ base: 'dark:bg-gray-800/80 dark:border-white/10' }"
            @update:model-value="(v: { value: DemoMaterial } | DemoMaterial) => form.material = (v && typeof v === 'object' && 'value' in v) ? v.value : v"
          />
        </UFormField>

        <UFormField label="Finishing">
          <div class="flex flex-wrap gap-2">
            <label
              v-for="f in finishingOptions"
              :key="f.value"
              class="flex items-center gap-1.5 cursor-pointer"
            >
              <UCheckbox
                :model-value="form.finishing.includes(f.value)"
                @update:model-value="toggleFinishing(f.value, $event)"
              />
              <span class="text-sm text-white/90">{{ f.label }}</span>
            </label>
          </div>
        </UFormField>

        <UFormField v-if="form.unit !== 'SQM'" label="Imposition (sheets needed preview)">
          <UInput
            v-model.number="form.imposition"
            type="number"
            min="1"
            placeholder="1"
            :ui="{ base: 'dark:bg-gray-800/80 dark:border-white/10' }"
          />
        </UFormField>

        <UFormField label="Profit margin (demo)">
          <div class="flex items-center gap-3">
            <input
              v-model.number="form.profitMargin"
              type="range"
              min="0"
              max="50"
              step="1"
              class="flex-1 h-2 rounded-full appearance-none bg-gray-700 accent-primary-500"
            />
            <span class="text-sm font-medium text-white/90 w-10">{{ form.profitMargin }}%</span>
          </div>
        </UFormField>
      </div>

      <!-- Right: Breakdown & Total -->
      <div class="space-y-3">
        <div
          v-if="form.unit !== 'SQM'"
          class="p-2 rounded-lg bg-white/5 border border-white/5 text-xs text-gray-400"
        >
          Sheets needed: {{ sheetsNeeded }}
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div class="p-3 rounded-lg bg-white/5 border border-white/5">
            <div class="text-xs text-gray-400 mb-1">Material</div>
            <div class="text-sm font-medium text-white">{{ formatKES(materialCost) }}</div>
          </div>
          <div class="p-3 rounded-lg bg-white/5 border border-white/5">
            <div class="text-xs text-gray-400 mb-1">Printing</div>
            <div class="text-sm font-medium text-white">{{ formatKES(printingCost) }}</div>
          </div>
        </div>
        <div class="p-3 rounded-lg bg-white/5 border border-white/5">
          <div class="text-xs text-gray-400 mb-1">Finishing</div>
          <div class="text-sm font-medium text-white">{{ formatKES(finishingCost) }}</div>
        </div>

        <div class="p-3 rounded-lg bg-primary-600/20 border border-primary-500/30">
          <div class="flex justify-between items-center">
            <span class="text-sm text-primary-200">Profit Margin</span>
            <span class="text-sm font-bold text-primary-100">{{ form.profitMargin }}%</span>
          </div>
        </div>

        <div class="p-4 rounded-xl bg-white/5 border border-primary-500/30">
          <div class="text-xs text-gray-400 mb-1">Total (KES)</div>
          <div class="text-xl font-bold text-emerald-400 transition-opacity duration-150">
            {{ formatKES(displayTotal) }}
          </div>
          <p class="mt-2 text-[10px] text-gray-500">
            Demo only — adjust pricing in your shop dashboard.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  printingRates,
  materialRates,
  finishingRates,
  type DemoUnit,
  type DemoMaterial,
  type DemoFinishing,
  type DemoFormState,
} from '~/shared/demoRateCard'

export type { DemoFormState }

const props = withDefaults(
  defineProps<{
    modelValue?: Partial<DemoFormState>
  }>(),
  { modelValue: () => ({}) }
)

const emit = defineEmits<{
  (e: 'update:modelValue', v: DemoFormState): void
}>()

const form = ref<DemoFormState>({
  unit: 'A4',
  sides: 2,
  quantity: 1000,
  material: '130gsm',
  finishing: [],
  widthM: 1,
  heightM: 1,
  imposition: 1,
  profitMargin: 25,
  ...props.modelValue,
})

// Sync external preset into form
watch(
  () => props.modelValue,
  (v) => {
    if (v && Object.keys(v).length) {
      form.value = { ...form.value, ...v }
    }
  },
  { deep: true }
)

// Emit form changes
watch(form, () => emit('update:modelValue', { ...form.value }), { deep: true })

const unitOptions = [
  { label: 'A4', value: 'A4' as DemoUnit },
  { label: 'A3', value: 'A3' as DemoUnit },
  { label: 'SQM (Large format)', value: 'SQM' as DemoUnit },
]

const sidesOptions = [
  { label: '1 side', value: 1 as const },
  { label: '2 sides', value: 2 as const },
]

const materialOptions = computed(() => {
  const unit = form.value.unit
  if (unit === 'SQM') {
    return [
      { label: 'Banner', value: 'Banner' as DemoMaterial },
      { label: 'Vinyl', value: 'Vinyl' as DemoMaterial },
      { label: 'Reflective', value: 'Reflective' as DemoMaterial },
    ]
  }
  return [
    { label: '130 gsm', value: '130gsm' as DemoMaterial },
    { label: '150 gsm', value: '150gsm' as DemoMaterial },
    { label: '300 gsm', value: '300gsm' as DemoMaterial },
  ]
})

const finishingOptions: { label: string; value: DemoFinishing }[] = [
  { label: 'Lamination', value: 'Lamination' },
  { label: 'Round edges', value: 'Round edges' },
  { label: 'Binding', value: 'Binding' },
  { label: 'Folding', value: 'Folding' },
]

function toggleFinishing(f: DemoFinishing, checked: boolean) {
  if (checked) {
    form.value.finishing = [...form.value.finishing, f]
  } else {
    form.value.finishing = form.value.finishing.filter((x) => x !== f)
  }
}

// When unit changes to SQM, switch material if current is invalid
watch(
  () => form.value.unit,
  (unit) => {
    if (unit === 'SQM' && !['Banner', 'Vinyl', 'Reflective'].includes(form.value.material)) {
      form.value.material = 'Banner'
    }
    if (unit !== 'SQM' && ['Banner', 'Vinyl', 'Reflective'].includes(form.value.material)) {
      form.value.material = '130gsm'
    }
  }
)

const sheetsNeeded = computed(() => {
  if (form.value.unit === 'SQM') return 0
  const imp = Math.max(1, form.value.imposition)
  return Math.ceil(form.value.quantity / imp)
})

const areaSqm = computed(() => {
  if (form.value.unit !== 'SQM') return 0
  const w = Math.max(0.1, form.value.widthM)
  const h = Math.max(0.1, form.value.heightM)
  return w * h * form.value.quantity
})

const printingCost = computed(() => {
  const unit = form.value.unit
  const rates = printingRates[unit]
  if (!rates) return 0
  if (unit === 'SQM') {
    return areaSqm.value * (form.value.sides === 2 ? rates.duplex : rates.oneSided)
  }
  const sheets = sheetsNeeded.value
  return sheets * (form.value.sides === 2 ? rates.duplex : rates.oneSided)
})

const materialCost = computed(() => {
  const unit = form.value.unit
  const rates = materialRates[unit]
  if (!rates) return 0
  const matRate = rates[form.value.material]
  if (matRate == null) return 0
  if (unit === 'SQM') {
    return areaSqm.value * matRate
  }
  return sheetsNeeded.value * matRate
})

const finishingCost = computed(() => {
  let total = 0
  const sheets = form.value.unit === 'SQM' ? form.value.quantity : sheetsNeeded.value
  for (const f of form.value.finishing) {
    const rate = finishingRates[f]
    if (!rate) continue
    if (rate.chargeBy === 'per_sheet') {
      total += sheets * rate.price
    } else {
      total += rate.price
    }
  }
  return total
})

const subtotal = computed(() => printingCost.value + materialCost.value + finishingCost.value)

const totalWithMargin = computed(() => {
  const m = form.value.profitMargin / 100
  return subtotal.value * (1 + m)
})

// Tween display total (250ms)
const displayTotal = ref(totalWithMargin.value)

watch(totalWithMargin, (next) => {
  const start = displayTotal.value
  const duration = 250
  const startTime = performance.now()
  const step = (now: number) => {
    const elapsed = now - startTime
    const t = Math.min(elapsed / duration, 1)
    const eased = 1 - (1 - t) * (1 - t) // ease-out quad
    displayTotal.value = start + (next - start) * eased
    if (t < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
})

function formatKES(n: number): string {
  return `KES ${Math.round(n).toLocaleString('en-KE')}`
}

defineExpose({
  form,
  applyPreset(preset: Partial<DemoFormState>) {
    form.value = { ...form.value, ...preset }
  },
})
</script>

