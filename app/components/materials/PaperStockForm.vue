<template>
  <VeeForm
    v-slot="{ meta }"
    :validation-schema="schema"
    :initial-values="initialValues"
    @submit="$emit('submit', $event)"
  >
    <div class="space-y-4">
      <FormsFormSelect
        name="sheet_size"
        label="Sheet size"
        :options="sheetSizeOptions"
        placeholder="Select size"
        required
        portal="#modal-portal"
      />
      <FormsFormInput
        name="gsm"
        label="GSM (weight)"
        type="number"
        placeholder="e.g. 80, 130, 150, 200, 300"
        required
      />
      <FormsFormSelect
        name="paper_type"
        label="Paper type"
        :options="paperTypeOptions"
        placeholder="Select type"
        required
        portal="#modal-portal"
      />
      <FormsFormInput
        name="buying_price"
        label="Buying price per sheet"
        type="number"
        placeholder="0.00"
        required
      />
      <FormsFormInput
        name="selling_price"
        label="Selling price per sheet"
        type="number"
        placeholder="0.00"
        required
      />
      <FormsFormInput
        name="quantity_in_stock"
        label="Quantity in stock (optional)"
        type="number"
        placeholder="Leave empty"
      />
      <FormsFormInput
        name="reorder_level"
        label="Reorder level (optional)"
        type="number"
        placeholder="100"
      />
      <div class="flex justify-end gap-2 pt-4">
        <UButton variant="outline" @click="$emit('cancel')">Cancel</UButton>
        <UButton
          type="submit"
          class="rounded-xl bg-flamingo-500 hover:bg-flamingo-600"
          :loading="loading"
          :disabled="loading"
        >
          {{ stock ? 'Update' : 'Add' }} paper
        </UButton>
      </div>
    </div>
  </VeeForm>
</template>

<script setup lang="ts">
import type { Paper } from '~/stores/paperStock'
import { object, number, string } from 'yup'

const props = defineProps<{
  stock: Paper | null
  loading?: boolean
}>()

defineEmits<{
  submit: [data: {
    sheet_size: string
    gsm: number
    paper_type: string
    buying_price: string
    selling_price: string
    quantity_in_stock?: number | null
    reorder_level?: number | null
  }]
  cancel: []
}>()

const sheetSizeOptions = [
  { label: 'A5 (148 × 210 mm)', value: 'A5' },
  { label: 'A4 (210 × 297 mm)', value: 'A4' },
  { label: 'A3 (297 × 420 mm)', value: 'A3' },
  { label: 'SRA3 (320 × 450 mm)', value: 'SRA3' },
  { label: 'SRA4 (225 × 320 mm)', value: 'SRA4' },
]
const paperTypeOptions = [
  { label: 'Gloss', value: 'GLOSS' },
  { label: 'Matte', value: 'MATTE' },
  { label: 'Bond', value: 'BOND' },
  { label: 'Art Paper', value: 'ART' },
]

const schema = object({
  sheet_size: string().oneOf(['A5', 'A4', 'A3', 'SRA3', 'SRA4']).required('Size is required'),
  gsm: number().min(60, 'Min 60 GSM').max(500, 'Max 500 GSM').required('GSM is required'),
  paper_type: string().oneOf(['GLOSS', 'MATTE', 'BOND', 'ART']).required('Paper type is required'),
  buying_price: string().required('Buying price is required'),
  selling_price: string().required('Selling price is required'),
  quantity_in_stock: number().min(0).optional().nullable(),
  reorder_level: number().min(0).optional().nullable(),
})

const initialValues = computed(() => ({
  sheet_size: props.stock?.sheet_size ?? 'SRA3',
  gsm: props.stock?.gsm ?? '',
  paper_type: props.stock?.paper_type ?? 'GLOSS',
  buying_price: props.stock?.buying_price ?? '',
  selling_price: props.stock?.selling_price ?? '',
  quantity_in_stock: props.stock?.quantity_in_stock ?? '',
  reorder_level: props.stock?.reorder_level ?? '',
}))
</script>
