<template>
  <VeeForm v-slot="{ meta }" :validation-schema="schema" :initial-values="initialValues" @submit="(values: Record<string, unknown>) => $emit('submit', values as unknown as PrintingPriceForm)">
    <table class="w-full text-sm">
      <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
        <tr>
          <td class="py-3 pr-4 font-medium text-gray-700 dark:text-gray-300 align-top w-40">Machine</td>
          <td class="py-3">
            <FormsFormSelect
              name="machine"
              label="Machine"
              :options="machineOptions"
              placeholder="Select machine"
              required
              hide-label
              portal="#modal-portal"
            />
          </td>
        </tr>
        <tr>
          <td class="py-3 pr-4 font-medium text-gray-700 dark:text-gray-300 align-top">Sheet Size</td>
          <td class="py-3">
            <FormsFormSelect
              name="sheet_size"
              label="Sheet Size"
              :options="sheetSizeOptions"
              placeholder="Select size"
              required
              hide-label
              portal="#modal-portal"
            />
          </td>
        </tr>
        <tr>
          <td class="py-3 pr-4 font-medium text-gray-700 dark:text-gray-300 align-top">Color Mode</td>
          <td class="py-3">
            <FormsFormSelect
              name="color_mode"
              label="Color Mode"
              :options="colorModeOptions"
              placeholder="Select color"
              required
              hide-label
              portal="#modal-portal"
            />
          </td>
        </tr>
        <tr>
          <td class="py-3 pr-4 font-medium text-gray-700 dark:text-gray-300 align-top">Selling Price (per side)</td>
          <td class="py-3">
            <FormsFormInput
              name="selling_price_per_side"
              label="Selling Price (per side)"
              type="number"
              placeholder="0.00"
              required
              hide-label
            />
          </td>
        </tr>
        <tr>
          <td class="py-3 pr-4 font-medium text-gray-700 dark:text-gray-300 align-top">Selling Price (duplex per sheet)</td>
          <td class="py-3">
            <FormsFormInput
              name="selling_price_duplex_per_sheet"
              label="Selling Price (duplex per sheet)"
              type="number"
              placeholder="0.00 (optional override)"
              hide-label
            />
          </td>
        </tr>
        <tr>
          <td class="py-3 pr-4 font-medium text-gray-700 dark:text-gray-300 align-top">Buying Price (per side)</td>
          <td class="py-3">
            <FormsFormInput
              name="buying_price_per_side"
              label="Buying Price (per side)"
              type="number"
              placeholder="0.00 (optional)"
              hide-label
            />
          </td>
        </tr>
      </tbody>
    </table>
    <div class="flex justify-end gap-2 pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
      <UButton variant="outline" @click="$emit('cancel')">Cancel</UButton>
      <UButton type="submit" color="primary" :loading="loading" :disabled="!meta.valid">
        {{ editing ? 'Update' : 'Add' }}
      </UButton>
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
}>()
defineEmits<{ submit: [data: PrintingPriceForm]; cancel: [] }>()

const editing = computed(() => !!props.price)

const sheetSizeOptions = [
  { label: 'A5', value: 'A5' },
  { label: 'A4', value: 'A4' },
  { label: 'A3', value: 'A3' },
  { label: 'SRA3', value: 'SRA3' },
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
  sheet_size: string().oneOf(['A5', 'A4', 'A3', 'SRA3']).required('Size is required'),
  color_mode: string().oneOf(['BW', 'COLOR']).required('Color mode is required'),
  selling_price_per_side: string().required('Selling price is required'),
  selling_price_duplex_per_sheet: string().optional().nullable(),
  buying_price_per_side: string().optional(),
})
</script>
