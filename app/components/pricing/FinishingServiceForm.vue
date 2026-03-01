<template>
  <VeeForm v-slot="{ meta }" :validation-schema="schema" :initial-values="initialValues" @submit="onSubmit">
    <div class="space-y-4">
      <FormsFormInput
        name="name"
        label="Service Name"
        placeholder="e.g. Matt Lamination A3"
        required
      />
      <FormsFormSelect
        name="category"
        label="Category"
        :options="categoryOptions"
        placeholder="Select category"
        required
        portal="#modal-portal"
      />
      <FormsFormSelect
        name="charge_by"
        label="Charge By"
        :options="chargeByOptions"
        placeholder="Select"
        required
        portal="#modal-portal"
      />
      <FormsFormInput
        name="buying_price"
        label="Buying Price (optional)"
        type="number"
        placeholder="0.00"
      />
      <FormsFormInput
        name="selling_price"
        label="Selling Price"
        type="number"
        placeholder="0.00"
        required
      />
      <div class="flex items-center gap-2">
        <UCheckbox v-model="isDefault" />
        <span class="text-sm text-gray-700 dark:text-gray-300">Default selection for customers</span>
      </div>
    </div>
    <div class="mt-6 flex flex-col-reverse gap-2 border-t border-gray-200 pt-4 dark:border-gray-700 sm:flex-row sm:justify-end">
      <UButton color="neutral" variant="outline" class="w-full sm:w-auto" @click="$emit('cancel')">
        Cancel
      </UButton>
      <UButton
        type="submit"
        color="primary"
        :loading="loading"
        :disabled="loading || !meta.valid"
        class="w-full sm:w-auto"
      >
        {{ editing ? 'Update' : 'Add' }}
      </UButton>
    </div>
  </VeeForm>
</template>

<script setup lang="ts">
import { object, string } from 'yup'
import type { FinishingService, FinishingServiceForm } from '~/shared/types'

const props = defineProps<{
  service?: FinishingService | null
  loading?: boolean
}>()
const emit = defineEmits<{ submit: [data: FinishingServiceForm]; cancel: [] }>()

const editing = computed(() => !!props.service)
const isDefault = ref(props.service?.is_default ?? false)

const categoryOptions = [
  { label: 'Lamination', value: 'LAMINATION' },
  { label: 'Binding', value: 'BINDING' },
  { label: 'Cutting', value: 'CUTTING' },
  { label: 'Folding', value: 'FOLDING' },
  { label: 'Other', value: 'OTHER' },
]
const chargeByOptions = [
  { label: 'Per Sheet', value: 'PER_SHEET' },
  { label: 'Per Piece/Item', value: 'PER_PIECE' },
  { label: 'Per Job (Flat Fee)', value: 'PER_JOB' },
]

const initialValues = computed(() => ({
  name: props.service?.name ?? '',
  category: props.service?.category ?? 'OTHER',
  charge_by: props.service?.charge_by ?? 'PER_SHEET',
  buying_price: props.service?.buying_price ?? '',
  selling_price: props.service?.selling_price ?? '',
}))

const schema = object({
  name: string().required('Name is required'),
  category: string().oneOf(['LAMINATION', 'BINDING', 'CUTTING', 'FOLDING', 'OTHER']).required('Category is required'),
  charge_by: string().oneOf(['PER_SHEET', 'PER_PIECE', 'PER_JOB']).required('Charge by is required'),
  buying_price: string().optional(),
  selling_price: string().required('Selling price is required'),
})

function onSubmit(values: Record<string, unknown>) {
  emit('submit', { ...values, is_default: isDefault.value } as FinishingServiceForm)
}
</script>
