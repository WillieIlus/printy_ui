<template>
  <div class="space-y-4">
    <!-- Machine selector -->
    <div class="flex flex-wrap items-center gap-4">
      <div class="min-w-[200px]">
        <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Machine</label>
        <USelectMenu
          v-model="selectedMachineId"
          :items="machineOptions"
          value-key="value"
          placeholder="Select machine"
          class="w-full"
          :ui="{ base: 'w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900' }"
        />
      </div>
      <div v-if="selectedMachineId" class="flex gap-2 items-end">
        <UButton
          variant="outline"
          size="sm"
          :disabled="saving || !hasOneSided"
          @click="copyOneSidedToDuplex"
        >
          Copy one-sided → duplex
        </UButton>
        <UButton
          variant="outline"
          size="sm"
          :disabled="saving"
          @click="copyA4ToA3"
        >
          Copy A4 → A3
        </UButton>
      </div>
    </div>

    <!-- Size tabs -->
    <div v-if="selectedMachineId" class="flex gap-1 overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-1.5">
      <button
        v-for="size in sizeTabs"
        :key="size"
        class="flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition-all"
        :class="selectedSize === size
          ? 'bg-flamingo-500 text-white shadow-sm'
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'"
        @click="selectedSize = size"
      >
        {{ size }}
      </button>
    </div>

    <!-- Grid table -->
    <div v-if="selectedMachineId" class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Color mode</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">One-sided (KES/sheet)</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Duplex (KES/sheet)</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <tr
            v-for="mode in colorModes"
            :key="mode"
            class="hover:bg-gray-50 dark:hover:bg-gray-800/50"
          >
            <td class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{{ modeLabel(mode) }}</td>
            <td class="px-4 py-3">
              <input
                :value="getCellValue(mode, 'one_sided')"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                class="w-full max-w-[120px] ml-auto block rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 py-2 px-3 text-sm text-right text-gray-900 dark:text-white placeholder-gray-400 focus:border-flamingo-500 focus:ring-2 focus:ring-flamingo-500/20"
                :disabled="saving"
                @input="onCellInput(mode, 'one_sided', ($event.target as HTMLInputElement).value)"
              >
            </td>
            <td class="px-4 py-3">
              <input
                :value="getCellValue(mode, 'duplex')"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                class="w-full max-w-[120px] ml-auto block rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 py-2 px-3 text-sm text-right text-gray-900 dark:text-white placeholder-gray-400 focus:border-flamingo-500 focus:ring-2 focus:ring-flamingo-500/20"
                :disabled="saving"
                @input="onCellInput(mode, 'duplex', ($event.target as HTMLInputElement).value)"
              >
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="saving" class="px-4 py-2 bg-flamingo-50 dark:bg-flamingo-900/20 text-sm text-flamingo-700 dark:text-flamingo-300">
        Saving…
      </div>
    </div>

    <p v-if="selectedMachineId" class="text-xs text-gray-500 dark:text-gray-400">
      Prices auto-save after you stop typing. Duplex = one-sided × 2 when using "Copy one-sided → duplex".
    </p>
  </div>
</template>

<script setup lang="ts">
import type { PrintingPrice, SheetSize, ColorMode } from '~/shared/types'

const props = defineProps<{
  slug: string
  machines: Array<{ id: number; name: string }>
  printingPrices: PrintingPrice[]
  loading?: boolean
}>()

const emit = defineEmits<{
  save: [payload: { machine: number; sheet_size: SheetSize; color_mode: ColorMode; selling_price_per_side: string; selling_price_duplex_per_sheet: string | null }]
  refresh: []
}>()

const sizeTabs: SheetSize[] = ['A4', 'A3', 'SRA3']
const colorModes: ColorMode[] = ['COLOR', 'BW']

const selectedMachineId = ref<number | undefined>(undefined)
const selectedSize = ref<SheetSize>('A4')

// Local edits: key = `${machine}_${size}_${colorMode}` -> { one_sided, duplex }
const localRows = ref<{ [key: string]: { one_sided: string; duplex: string } }>({})
const pendingSave = ref<{ [key: string]: ReturnType<typeof setTimeout> }>({})
const saving = ref(false)

const machineOptions = computed(() =>
  props.machines.map((m) => ({ label: m.name, value: m.id }))
)

const hasOneSided = computed(() => {
  if (!selectedMachineId.value) return false
  for (const mode of colorModes) {
    const v = getCellValue(mode, 'one_sided')
    if (v && parseFloat(v) > 0) return true
  }
  return false
})

function modeLabel(mode: ColorMode): string {
  return mode === 'COLOR' ? 'Full Color' : 'Black & White'
}

function rowKey(mode: ColorMode): string {
  return `${selectedMachineId.value}_${selectedSize.value}_${mode}`
}

function findPrice(mode: ColorMode): PrintingPrice | undefined {
  return props.printingPrices.find(
    (p) =>
      p.machine === selectedMachineId.value &&
      p.sheet_size === selectedSize.value &&
      p.color_mode === mode
  )
}

function getCellValue(mode: ColorMode, field: 'one_sided' | 'duplex'): string {
  const key = rowKey(mode)
  const local = localRows.value[key]
  if (local) {
    return local[field] ?? ''
  }
  const price = findPrice(mode)
  if (!price) return ''
  if (field === 'one_sided') return price.selling_price_per_side ?? ''
  return price.selling_price_duplex_per_sheet ?? ''
}

function onCellInput(mode: ColorMode, field: 'one_sided' | 'duplex', value: string) {
  const key = rowKey(mode)
  const current = localRows.value[key] ?? {
    one_sided: findPrice(mode)?.selling_price_per_side ?? '',
    duplex: findPrice(mode)?.selling_price_duplex_per_sheet ?? '',
  }
  localRows.value = {
    ...localRows.value,
    [key]: { ...current, [field]: value },
  }

  const timeoutKey = key
  if (pendingSave.value[timeoutKey]) clearTimeout(pendingSave.value[timeoutKey])
  pendingSave.value[timeoutKey] = setTimeout(() => {
    saveCell(mode)
    const { [timeoutKey]: _, ...rest } = pendingSave.value
    pendingSave.value = rest
  }, 500)
}

function saveCell(mode: ColorMode) {
  if (!selectedMachineId.value) return
  const key = rowKey(mode)
  const row = localRows.value[key]
  const oneSided = row?.one_sided?.trim() ?? ''
  const duplex = row?.duplex?.trim() || null
  if (!oneSided && !duplex) return
  saving.value = true
  emit('save', {
    machine: selectedMachineId.value,
    sheet_size: selectedSize.value,
    color_mode: mode,
    selling_price_per_side: oneSided || '0',
    selling_price_duplex_per_sheet: duplex || null,
  })
  saving.value = false
}

async function copyOneSidedToDuplex() {
  if (!selectedMachineId.value) return
  for (const mode of colorModes) {
    const oneSided = getCellValue(mode, 'one_sided')
    const num = parseFloat(oneSided)
    if (Number.isNaN(num) || num <= 0) continue
    const duplexVal = (num * 2).toFixed(2)
    const key = rowKey(mode)
    localRows.value = { ...localRows.value, [key]: { one_sided: oneSided, duplex: duplexVal } }
    emit('save', {
      machine: selectedMachineId.value,
      sheet_size: selectedSize.value,
      color_mode: mode,
      selling_price_per_side: oneSided,
      selling_price_duplex_per_sheet: duplexVal,
    })
  }
  emit('refresh')
}

async function copyA4ToA3() {
  if (!selectedMachineId.value) return
  const a4Prices = colorModes.map((mode) => {
    const p = props.printingPrices.find(
      (x) => x.machine === selectedMachineId.value && x.sheet_size === 'A4' && x.color_mode === mode
    )
    return {
      mode,
      oneSided: p?.selling_price_per_side ?? '',
      duplex: p?.selling_price_duplex_per_sheet ?? null,
    }
  })
  for (const { mode, oneSided, duplex } of a4Prices) {
    if (!oneSided && !duplex) continue
    emit('save', {
      machine: selectedMachineId.value,
      sheet_size: 'A3',
      color_mode: mode,
      selling_price_per_side: oneSided || '0',
      selling_price_duplex_per_sheet: duplex,
    })
  }
  emit('refresh')
}

watch(
  () => props.machines,
  (machines) => {
    if (machines.length && selectedMachineId.value === undefined) {
      selectedMachineId.value = machines[0]?.id
    }
  },
  { immediate: true }
)
</script>
