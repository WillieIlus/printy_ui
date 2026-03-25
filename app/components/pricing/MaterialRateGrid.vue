<template>
  <div class="space-y-4">
    <div class="rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-raised)] overflow-hidden">
      <table class="min-w-full divide-y divide-[var(--p-border)]">
        <thead class="bg-[var(--p-surface-sunken)]">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-[var(--p-text-muted)] uppercase">Material</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-[var(--p-text-muted)] uppercase">Selling price (KES/SQM)</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-[var(--p-text-muted)] uppercase">Buying price (optional)</th>
            <th v-if="supportsActive" class="px-4 py-3 text-center text-xs font-medium text-[var(--p-text-muted)] uppercase">Active</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[var(--p-border)]">
          <tr
            v-for="mat in materialTypes"
            :key="mat"
            class="hover:bg-[var(--p-surface-sunken)]/60"
          >
            <td class="px-4 py-3 text-sm font-medium text-[var(--p-text)]">{{ materialLabel(mat) }}</td>
            <td class="px-4 py-3">
              <input
                :value="getSellingPrice(mat)"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                :class="dashboardTableInputClass"
                :disabled="props.saving"
                @input="onSellingInput(mat, ($event.target as HTMLInputElement).value)"
              >
            </td>
            <td class="px-4 py-3">
              <input
                :value="getBuyingPrice(mat)"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00 (optional)"
                :class="dashboardTableInputClass"
                :disabled="props.saving"
                @input="onBuyingInput(mat, ($event.target as HTMLInputElement).value)"
              >
            </td>
            <td v-if="supportsActive" class="px-4 py-3 text-center">
              <UToggle
                :model-value="getActive(mat)"
                :disabled="props.saving"
                @update:model-value="onActiveChange(mat, $event)"
              />
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="props.saving" class="bg-flamingo-50 px-4 py-2 text-sm text-flamingo-700 dark:bg-flamingo-900/20 dark:text-flamingo-300">
        Saving…
      </div>
    </div>
    <p class="text-xs leading-5 text-[var(--p-text-muted)]">
      Large format materials priced per square metre (SQM). Prices auto-save when you blur the field or click Save.
    </p>
  </div>
</template>

<script setup lang="ts">
import type { MaterialPrice, MaterialType } from '~/shared/types'
import { dashboardTableInputClass } from '~/utils/formUi'

const props = defineProps<{
  slug: string
  materialPrices: MaterialPrice[]
  loading?: boolean
  saving?: boolean
  supportsActive?: boolean
}>()

const emit = defineEmits<{
  save: [payload: { material_type: MaterialType; selling_price: string; buying_price: string | null; is_active?: boolean }]
}>()

const materialTypes: MaterialType[] = ['BANNER', 'VINYL', 'REFLECTIVE']

const localRows = ref<{ [key: string]: { selling_price: string; buying_price: string; is_active: boolean } }>({})
const pendingSave = ref<{ [key: string]: ReturnType<typeof setTimeout> }>({})

function materialLabel(mat: MaterialType): string {
  const labels: Record<MaterialType, string> = {
    BANNER: 'Banner',
    VINYL: 'Vinyl',
    REFLECTIVE: 'Reflective',
  }
  return labels[mat] ?? mat
}

function findPrice(mat: MaterialType): MaterialPrice | undefined {
  return props.materialPrices.find((p) => p.material_type === mat)
}

function getSellingPrice(mat: MaterialType): string {
  const local = localRows.value[mat]
  if (local?.selling_price !== undefined) return local.selling_price
  return findPrice(mat)?.selling_price ?? ''
}

function getBuyingPrice(mat: MaterialType): string {
  const local = localRows.value[mat]
  if (local?.buying_price !== undefined) return local.buying_price
  return findPrice(mat)?.buying_price ?? ''
}

function getActive(mat: MaterialType): boolean {
  const local = localRows.value[mat]
  if (local?.is_active !== undefined) return local.is_active
  return findPrice(mat)?.is_active ?? true
}

function onSellingInput(mat: MaterialType, value: string) {
  const current = localRows.value[mat] ?? {
    selling_price: findPrice(mat)?.selling_price ?? '',
    buying_price: findPrice(mat)?.buying_price ?? '',
    is_active: findPrice(mat)?.is_active ?? true,
  }
  localRows.value = { ...localRows.value, [mat]: { ...current, selling_price: value } }
  scheduleSave(mat)
}

function onBuyingInput(mat: MaterialType, value: string) {
  const current = localRows.value[mat] ?? {
    selling_price: findPrice(mat)?.selling_price ?? '',
    buying_price: findPrice(mat)?.buying_price ?? '',
    is_active: findPrice(mat)?.is_active ?? true,
  }
  localRows.value = { ...localRows.value, [mat]: { ...current, buying_price: value } }
  scheduleSave(mat)
}

function onActiveChange(mat: MaterialType, isActive: boolean) {
  const current = localRows.value[mat] ?? {
    selling_price: findPrice(mat)?.selling_price ?? '',
    buying_price: findPrice(mat)?.buying_price ?? '',
    is_active: findPrice(mat)?.is_active ?? true,
  }
  localRows.value = { ...localRows.value, [mat]: { ...current, is_active: isActive } }
  if (props.supportsActive) {
    emit('save', {
      material_type: mat,
      selling_price: current.selling_price || '0',
      buying_price: current.buying_price || null,
      is_active: isActive,
    })
  }
}

function scheduleSave(mat: MaterialType) {
  if (pendingSave.value[mat]) clearTimeout(pendingSave.value[mat])
  pendingSave.value[mat] = setTimeout(() => {
    doSave(mat)
    const { [mat]: _, ...rest } = pendingSave.value
    pendingSave.value = rest
  }, 500)
}

function doSave(mat: MaterialType) {
  const row = localRows.value[mat]
  const selling = row?.selling_price?.trim() ?? findPrice(mat)?.selling_price ?? ''
  const buying = row?.buying_price?.trim() || null
  if (!selling) return
  emit('save', {
    material_type: mat,
    selling_price: selling,
    buying_price: buying,
    ...(props.supportsActive && { is_active: getActive(mat) }),
  })
}
</script>
