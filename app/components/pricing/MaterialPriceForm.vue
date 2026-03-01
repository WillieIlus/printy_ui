<template>
  <VeeForm v-slot="{ meta }" :validation-schema="schema" :initial-values="initialValues" @submit="(values: Record<string, unknown>) => $emit('submit', values as unknown as MaterialPriceForm)">
    <table class="w-full text-sm">
      <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
        <tr>
          <td class="py-3 pr-4 font-medium text-gray-700 dark:text-gray-300 align-top w-40">Material Type</td>
          <td class="py-3">
            <FormsFormSelect
              name="material_type"
              label="Material Type"
              :options="materialTypeOptions"
              placeholder="Select material"
              required
              hide-label
              portal="#modal-portal"
            />
          </td>
        </tr>
        <tr>
          <td class="py-3 pr-4 font-medium text-gray-700 dark:text-gray-300 align-top">Unit</td>
          <td class="py-3">
            <FormsFormSelect
              name="unit"
              label="Unit"
              :options="unitOptions"
              placeholder="Select unit"
              required
              hide-label
              portal="#modal-portal"
            />
          </td>
        </tr>
        <tr>
          <td class="py-3 pr-4 font-medium text-gray-700 dark:text-gray-300 align-top">Selling Price</td>
          <td class="py-3">
            <FormsFormInput
              name="selling_price"
              label="Selling Price"
              type="number"
              placeholder="0.00"
              required
              hide-label
            />
          </td>
        </tr>
        <tr>
          <td class="py-3 pr-4 font-medium text-gray-700 dark:text-gray-300 align-top">Buying Price</td>
          <td class="py-3">
            <FormsFormInput
              name="buying_price"
              label="Buying Price"
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
import { object, string } from 'yup'
import type { MaterialPrice, MaterialPriceForm } from '~/shared/types'

const props = defineProps<{
  price?: MaterialPrice | null
  loading?: boolean
}>()
defineEmits<{ submit: [data: MaterialPriceForm]; cancel: [] }>()

const editing = computed(() => !!props.price)

const materialTypeOptions = [
  { label: 'Banner', value: 'BANNER' },
  { label: 'Vinyl', value: 'VINYL' },
  { label: 'Reflective', value: 'REFLECTIVE' },
  { label: 'Canvas', value: 'CANVAS' },
  { label: 'Mesh', value: 'MESH' },
]
const unitOptions = [
  { label: 'A4', value: 'A4' },
  { label: 'A3', value: 'A3' },
  { label: 'SRA3', value: 'SRA3' },
  { label: 'SQM', value: 'SQM' },
]

const initialValues = computed(() => ({
  material_type: props.price?.material_type ?? 'BANNER',
  unit: props.price?.unit ?? 'SQM',
  selling_price: props.price?.selling_price ?? '',
  buying_price: props.price?.buying_price ?? '',
}))

const schema = object({
  material_type: string().oneOf(['BANNER', 'VINYL', 'REFLECTIVE', 'CANVAS', 'MESH']).required('Material type is required'),
  unit: string().oneOf(['A4', 'A3', 'SRA3', 'SQM']).required('Unit is required'),
  selling_price: string().required('Selling price is required'),
  buying_price: string().optional().nullable(),
})
</script>
