<template>
  <VeeForm v-slot="{ meta }" :validation-schema="schema" :initial-values="initialValues" @submit="onSubmit">
    <div class="space-y-4">
      <UAlert
        v-if="errorMessage"
        color="error"
        variant="soft"
        title="Could not save finishing service"
        :description="errorMessage"
        icon="i-lucide-alert-circle"
      />
      <FormsFormInput
        name="name"
        label="Service Name"
        placeholder="e.g. Matt Lamination A3"
        required
      />
      <DashboardInlineError :message="fieldError('name')" />
      <FormsFormSelect
        name="category"
        label="Category"
        :options="categoryOptions"
        placeholder="Select category"
        required
      />
      <DashboardInlineError :message="fieldError('category')" />
      <FormsFormSelect
        name="charge_by"
        label="Charge By"
        :options="chargeByOptions"
        placeholder="Select"
        required
      />
      <DashboardInlineError :message="fieldError('charge_by')" />
      <FormsFormInput
        name="buying_price"
        label="Buying Price (optional)"
        type="number"
        placeholder="0.00"
      />
      <DashboardInlineError :message="fieldError('buying_price')" />
      <FormsFormInput
        name="selling_price"
        label="Selling Price"
        type="number"
        placeholder="0.00"
        required
      />
      <DashboardInlineError :message="fieldError('selling_price')" />
      <div class="flex items-center gap-2">
        <UCheckbox v-model="isDefault" />
        <span class="text-sm text-[var(--p-text-dim)]">Default selection for customers</span>
      </div>
    </div>
    <div class="mt-6 flex flex-col-reverse gap-2 border-t border-[var(--p-border)] pt-4 sm:flex-row sm:justify-end">
      <UButton color="neutral" variant="ghost" class="w-full sm:w-auto" @click="$emit('cancel')">
        Cancel
      </UButton>
      <DashboardLoadingButton
        type="submit"
        color="primary"
        :loading="loading"
        :disabled="loading || !meta.valid"
        class="w-full sm:w-auto"
      >
        {{ editing ? 'Save Changes' : 'Save Finishing Service' }}
      </DashboardLoadingButton>
    </div>
  </VeeForm>
</template>

<script setup lang="ts">
import { object, string } from 'yup'
import type { FinishingService, FinishingServiceForm } from '~/shared/types'

const props = defineProps<{
  service?: FinishingService | null
  loading?: boolean
  errorMessage?: string | null
  fieldErrors?: Record<string, string>
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

function fieldError(field: keyof FinishingServiceForm) {
  return props.fieldErrors?.[field] ?? null
}
</script>
