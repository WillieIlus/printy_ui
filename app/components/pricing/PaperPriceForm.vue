<template>
  <VeeForm v-slot="{ meta }" :validation-schema="schema" :initial-values="initialValues" @submit="(values: Record<string, unknown>) => $emit('submit', values as unknown as PaperPriceForm)">
    <table class="w-full text-sm">
      <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
        <tr>
          <td class="py-3 pr-4 font-medium text-gray-700 dark:text-gray-300 align-top w-40">Sheet Size</td>
          <td class="py-3">
            <FormsFormSelect
              name="sheet_size"
              label="Sheet Size"
              :options="sheetSizeOptions"
              placeholder="Select size"
              required
              hide-label
            />
          </td>
        </tr>
        <tr>
          <td class="py-3 pr-4 font-medium text-gray-700 dark:text-gray-300 align-top">GSM (weight)</td>
          <td class="py-3">
            <FormsFormInput
              name="gsm"
              label="GSM (weight)"
              type="number"
              placeholder="e.g. 130, 150, 200"
              required
              hide-label
            />
          </td>
        </tr>
        <tr>
          <td class="py-3 pr-4 font-medium text-gray-700 dark:text-gray-300 align-top">Paper Type</td>
          <td class="py-3">
            <FormsFormSelect
              name="paper_type"
              label="Paper Type"
              :options="paperTypeOptions"
              placeholder="Select type"
              required
              hide-label
            />
          </td>
        </tr>
        <tr>
          <td class="py-3 pr-4 font-medium text-gray-700 dark:text-gray-300 align-top">Buying Price (per sheet)</td>
          <td class="py-3">
            <FormsFormInput
              name="buying_price"
              label="Buying Price (per sheet)"
              type="number"
              placeholder="0.00"
              required
              hide-label
            />
          </td>
        </tr>
        <tr>
          <td class="py-3 pr-4 font-medium text-gray-700 dark:text-gray-300 align-top">Selling Price (per sheet)</td>
          <td class="py-3">
            <FormsFormInput
              name="selling_price"
              label="Selling Price (per sheet)"
              type="number"
              placeholder="0.00"
              required
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
import type { PaperPrice, PaperPriceForm } from '~/shared/types'

const props = defineProps<{
  price?: PaperPrice | null
  loading?: boolean
}>()
defineEmits<{ submit: [data: PaperPriceForm]; cancel: [] }>()

const editing = computed(() => !!props.price)

const sheetSizeOptions = [
  { label: 'A5', value: 'A5' },
  { label: 'A4', value: 'A4' },
  { label: 'A3', value: 'A3' },
  { label: 'SRA3', value: 'SRA3' },
]
const paperTypeOptions = [
  { label: 'Gloss', value: 'GLOSS' },
  { label: 'Matte', value: 'MATTE' },
  { label: 'Bond', value: 'BOND' },
  { label: 'Art Paper', value: 'ART' },
]

const initialValues = computed(() => ({
  sheet_size: props.price?.sheet_size ?? 'A3',
  gsm: props.price?.gsm ?? '',
  paper_type: props.price?.paper_type ?? 'GLOSS',
  buying_price: props.price?.buying_price ?? '',
  selling_price: props.price?.selling_price ?? '',
}))

const schema = object({
  sheet_size: string().oneOf(['A5', 'A4', 'A3', 'SRA3']).required('Size is required'),
  gsm: number().min(60, 'Min 60 GSM').max(500, 'Max 500 GSM').required('GSM is required'),
  paper_type: string().oneOf(['GLOSS', 'MATTE', 'BOND', 'ART']).required('Paper type is required'),
  buying_price: string().required('Buying price is required'),
  selling_price: string().required('Selling price is required'),
})
</script>
