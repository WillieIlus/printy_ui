<template>
  <VeeForm
    v-slot="{ meta }"
    :validation-schema="schema"
    :initial-values="initialValues"
    @submit="(values: Record<string, unknown>) => $emit('submit', values as unknown as PaperPriceForm)"
  >
    <div class="space-y-4">
      <UAlert
        v-if="errorMessage"
        color="error"
        variant="soft"
        title="Could not save paper price"
        :description="errorMessage"
        icon="i-lucide-alert-circle"
      />
      <table class="w-full text-sm">
        <tbody class="divide-y divide-[var(--p-border-dim)]">
        <tr>
          <td class="w-40 py-3 pr-4 align-top font-medium text-[var(--p-text-dim)]">Sheet Size</td>
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
          <td class="py-3 pr-4 align-top font-medium text-[var(--p-text-dim)]">GSM (weight)</td>
          <td class="py-3">
            <FormsFormInput
              name="gsm"
              label="GSM (weight)"
              type="number"
              placeholder="e.g. 130, 150, 200"
              required
              hide-label
            />
            <DashboardInlineError :message="fieldError('gsm')" />
          </td>
        </tr>
        <tr>
          <td class="py-3 pr-4 align-top font-medium text-[var(--p-text-dim)]">Paper Type</td>
          <td class="py-3">
            <FormsFormSelect
              name="paper_type"
              label="Paper Type"
              :options="paperTypeOptions"
              placeholder="Select type"
              required
              hide-label
            />
            <DashboardInlineError :message="fieldError('paper_type')" />
          </td>
        </tr>
        <tr>
          <td class="py-3 pr-4 align-top font-medium text-[var(--p-text-dim)]">Buying Price (per sheet)</td>
          <td class="py-3">
            <FormsFormInput
              name="buying_price"
              label="Buying Price (per sheet)"
              type="number"
              placeholder="0.00"
              required
              hide-label
            />
            <DashboardInlineError :message="fieldError('buying_price')" />
          </td>
        </tr>
        <tr>
          <td class="py-3 pr-4 align-top font-medium text-[var(--p-text-dim)]">Selling Price (per sheet)</td>
          <td class="py-3">
            <FormsFormInput
              name="selling_price"
              label="Selling Price (per sheet)"
              type="number"
              placeholder="0.00"
              required
              hide-label
            />
            <DashboardInlineError :message="fieldError('selling_price')" />
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="mt-4 flex justify-end gap-2 border-t border-[var(--p-border)] pt-4">
      <UButton variant="ghost" @click="$emit('cancel')">Cancel</UButton>
      <DashboardLoadingButton type="submit" color="primary" :loading="loading" :disabled="!meta.valid">
        {{ editing ? 'Save Changes' : 'Save Paper Price' }}
      </DashboardLoadingButton>
    </div>
  </VeeForm>
</template>

<script setup lang="ts">
import { object, number, string } from 'yup'
import type { PaperPrice, PaperPriceForm } from '~/shared/types'

const props = defineProps<{
  price?: PaperPrice | null
  loading?: boolean
  errorMessage?: string | null
  fieldErrors?: Record<string, string>
}>()
defineEmits<{ submit: [data: PaperPriceForm]; cancel: [] }>()

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
const paperTypeOptions = [
  { label: 'Coated', value: 'COATED' },
  { label: 'Uncoated', value: 'UNCOATED' },
  { label: 'Recycled', value: 'RECYCLED' },
  { label: 'Gloss', value: 'GLOSS' },
  { label: 'Matte', value: 'MATTE' },
  { label: 'Other', value: 'OTHER' },
]

const initialValues = computed(() => ({
  sheet_size: props.price?.sheet_size ?? 'A3',
  gsm: props.price?.gsm ?? '',
  paper_type: props.price?.paper_type ?? 'UNCOATED',
  buying_price: props.price?.buying_price ?? '',
  selling_price: props.price?.selling_price ?? '',
}))

const schema = object({
  sheet_size: string().oneOf(['A4', 'A3', 'SRA3', 'A2', 'A1', 'A0', 'CUSTOM']).required('Size is required'),
  gsm: number().min(60, 'Min 60 GSM').max(500, 'Max 500 GSM').required('GSM is required'),
  paper_type: string().oneOf(['COATED', 'UNCOATED', 'RECYCLED', 'GLOSS', 'MATTE', 'OTHER']).required('Paper type is required'),
  buying_price: string().required('Buying price is required'),
  selling_price: string().required('Selling price is required'),
})

function fieldError(field: keyof PaperPriceForm) {
  return props.fieldErrors?.[field] ?? null
}
</script>
