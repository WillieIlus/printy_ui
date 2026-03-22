<template>
  <VeeForm
    v-slot="{ meta }"
    :validation-schema="schema"
    :initial-values="initialValues"
    @submit="(values: Record<string, unknown>) => $emit('submit', values as unknown as PrintingPriceForm)"
  >
    <div class="space-y-4">
      <UAlert
        v-if="errorMessage"
        color="error"
        variant="soft"
        title="Could not save printing price"
        :description="errorMessage"
        icon="i-lucide-alert-circle"
      />
      <table class="w-full text-sm">
        <tbody class="divide-y divide-[var(--p-border-dim)]">
        <tr>
          <td class="w-40 py-3 pr-4 align-top font-medium text-[var(--p-text-dim)]">Machine</td>
          <td class="py-3">
            <FormsFormSelect
              name="machine"
              label="Machine"
              :options="machineOptions"
              placeholder="Select machine"
              required
              hide-label
            />
            <DashboardInlineError :message="fieldError('machine')" />
          </td>
        </tr>
        <tr>
          <td class="py-3 pr-4 align-top font-medium text-[var(--p-text-dim)]">Sheet Size</td>
          <td class="py-3">
            <FormsFormSelect
              name="sheet_size"
              label="Sheet Size"
              :options="sheetSizeOptions"
              placeholder="Select size"
              required
              hide-label
            />
            <DashboardInlineError :message="fieldError('sheet_size')" />
          </td>
        </tr>
        <tr>
          <td class="py-3 pr-4 align-top font-medium text-[var(--p-text-dim)]">Color Mode</td>
          <td class="py-3">
            <FormsFormSelect
              name="color_mode"
              label="Color Mode"
              :options="colorModeOptions"
              placeholder="Select color"
              required
              hide-label
            />
            <DashboardInlineError :message="fieldError('color_mode')" />
          </td>
        </tr>
        <tr>
          <td class="py-3 pr-4 align-top font-medium text-[var(--p-text-dim)]">Selling Price (per side)</td>
          <td class="py-3">
            <FormsFormInput
              name="selling_price_per_side"
              label="Selling Price (per side)"
              type="number"
              placeholder="0.00"
              required
              hide-label
            />
            <DashboardInlineError :message="fieldError('selling_price_per_side')" />
          </td>
        </tr>
        <tr>
          <td class="py-3 pr-4 align-top font-medium text-[var(--p-text-dim)]">Selling Price (duplex per sheet)</td>
          <td class="py-3">
            <FormsFormInput
              name="selling_price_duplex_per_sheet"
              label="Selling Price (duplex per sheet)"
              type="number"
              placeholder="0.00 (optional override)"
              hide-label
            />
            <DashboardInlineError :message="fieldError('selling_price_duplex_per_sheet')" />
          </td>
        </tr>
        <tr>
          <td class="py-3 pr-4 align-top font-medium text-[var(--p-text-dim)]">Buying Price (per side)</td>
          <td class="py-3">
            <FormsFormInput
              name="buying_price_per_side"
              label="Buying Price (per side)"
              type="number"
              placeholder="0.00 (optional)"
              hide-label
            />
            <DashboardInlineError :message="fieldError('buying_price_per_side')" />
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="mt-4 flex justify-end gap-2 border-t border-[var(--p-border)] pt-4">
      <UButton variant="ghost" @click="$emit('cancel')">Cancel</UButton>
      <DashboardLoadingButton type="submit" color="primary" :loading="loading" :disabled="!meta.valid">
        {{ editing ? 'Save Changes' : 'Save Printing Price' }}
      </DashboardLoadingButton>
    </div>
  </VeeForm>
</template>

<script setup lang="ts">
import { object, number, string } from 'yup'
import type { PrintingPrice, PrintingPriceForm } from '~/shared/types'

const props = defineProps<{
  price?: PrintingPrice | null
  machineOptions: Array<{ label: string; value: number }>
  loading?: boolean
  errorMessage?: string | null
  fieldErrors?: Record<string, string>
}>()
defineEmits<{ submit: [data: PrintingPriceForm]; cancel: [] }>()

const editing = computed(() => !!props.price)

const sheetSizeOptions = [
  { label: 'A4', value: 'A4' },
  { label: 'A3', value: 'A3' },
  { label: 'SRA3', value: 'SRA3' },
  { label: 'A2', value: 'A2' },
  { label: 'A1', value: 'A1' },
  { label: 'A0', value: 'A0' },
  { label: 'Custom', value: 'CUSTOM' },
]
const colorModeOptions = [
  { label: 'Black & White', value: 'BW' },
  { label: 'Full Color', value: 'COLOR' },
]

const initialValues = computed(() => ({
  machine: props.price?.machine ?? '',
  sheet_size: props.price?.sheet_size ?? 'A4',
  color_mode: props.price?.color_mode ?? 'COLOR',
  selling_price_per_side: props.price?.selling_price_per_side ?? '',
  selling_price_duplex_per_sheet: props.price?.selling_price_duplex_per_sheet ?? '',
  buying_price_per_side: props.price?.buying_price_per_side ?? '',
}))

const schema = object({
  machine: number().required('Machine is required'),
  sheet_size: string().oneOf(['A4', 'A3', 'SRA3', 'A2', 'A1', 'A0', 'CUSTOM']).required('Size is required'),
  color_mode: string().oneOf(['BW', 'COLOR']).required('Color mode is required'),
  selling_price_per_side: string().required('Selling price is required'),
  selling_price_duplex_per_sheet: string().optional().nullable(),
  buying_price_per_side: string().optional(),
})

function fieldError(field: keyof PrintingPriceForm) {
  return props.fieldErrors?.[field] ?? null
}
</script>
