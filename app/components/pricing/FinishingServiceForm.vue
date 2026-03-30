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
        name="charge_unit"
        label="Charge Unit"
        :options="chargeUnitOptions"
        placeholder="Select charge unit"
        required
      />
      <DashboardInlineError :message="fieldError('charge_unit')" />

      <FormsFormSelect
        name="billing_basis"
        label="Billing Basis"
        :options="billingBasisOptions"
        placeholder="Select billing basis"
        required
      />
      <DashboardInlineError :message="fieldError('billing_basis')" />

      <FormsFormSelect
        name="side_mode"
        label="Side Mode"
        :options="sideModeOptions"
        placeholder="Select side mode"
        required
      />
      <DashboardInlineError :message="fieldError('side_mode')" />

      <FormsFormInput
        name="price"
        label="Price"
        type="number"
        placeholder="0.00"
        required
      />
      <DashboardInlineError :message="fieldError('price')" />

      <FormsFormInput
        name="double_side_price"
        label="Double-side Price"
        type="number"
        placeholder="Optional"
      />
      <DashboardInlineError :message="fieldError('double_side_price')" />

      <FormsFormInput
        name="setup_fee"
        label="Setup Fee"
        type="number"
        placeholder="Optional"
      />
      <DashboardInlineError :message="fieldError('setup_fee')" />

      <FormsFormInput
        name="minimum_charge"
        label="Minimum Charge"
        type="number"
        placeholder="Optional"
      />
      <DashboardInlineError :message="fieldError('minimum_charge')" />

      <FormsFormInput
        name="min_qty"
        label="Minimum Quantity"
        type="number"
        placeholder="Optional"
      />
      <DashboardInlineError :message="fieldError('min_qty')" />

      <FormsFormTextarea
        name="help_text"
        label="Help Text"
        placeholder="Optional customer-facing explanation"
      />
      <DashboardInlineError :message="fieldError('help_text')" />
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
import { object, string, number } from 'yup'
import type { FinishingService, FinishingServiceForm } from '~/shared/types'

const props = defineProps<{
  service?: FinishingService | null
  loading?: boolean
  errorMessage?: string | null
  fieldErrors?: Record<string, string>
}>()
const emit = defineEmits<{ submit: [data: FinishingServiceForm]; cancel: [] }>()

const editing = computed(() => !!props.service)

const categoryOptions = [
  { label: 'Lamination', value: 'LAMINATION' },
  { label: 'Binding', value: 'BINDING' },
  { label: 'Cutting', value: 'CUTTING' },
  { label: 'Folding', value: 'FOLDING' },
  { label: 'Other', value: 'OTHER' },
]
const chargeUnitOptions = [
  { label: 'Per Piece', value: 'PER_PIECE' },
  { label: 'Per Side', value: 'PER_SIDE' },
  { label: 'Per Sheet', value: 'PER_SHEET' },
  { label: 'Per Side Per Sheet', value: 'PER_SIDE_PER_SHEET' },
  { label: 'Per Square Meter', value: 'PER_SQM' },
  { label: 'Flat', value: 'FLAT' },
]
const billingBasisOptions = [
  { label: 'Per Sheet', value: 'per_sheet' },
  { label: 'Per Piece', value: 'per_piece' },
  { label: 'Flat Per Job', value: 'flat_per_job' },
  { label: 'Flat Per Group', value: 'flat_per_group' },
  { label: 'Flat Per Line', value: 'flat_per_line' },
]
const sideModeOptions = [
  { label: 'Ignore Sides', value: 'ignore_sides' },
  { label: 'Per Selected Side', value: 'per_selected_side' },
]

const initialValues = computed(() => ({
  name: props.service?.name ?? '',
  category: props.service?.category ?? 'OTHER',
  charge_unit: props.service?.charge_unit ?? 'PER_PIECE',
  billing_basis: props.service?.billing_basis ?? 'per_piece',
  side_mode: props.service?.side_mode ?? 'ignore_sides',
  price: props.service?.price ?? '',
  double_side_price: props.service?.double_side_price ?? '',
  setup_fee: props.service?.setup_fee ?? '',
  minimum_charge: props.service?.minimum_charge ?? '',
  min_qty: props.service?.min_qty ?? '',
  help_text: props.service?.help_text ?? '',
}))

const schema = object({
  name: string().required('Name is required'),
  category: string().oneOf(['LAMINATION', 'BINDING', 'CUTTING', 'FOLDING', 'OTHER']).required('Category is required'),
  charge_unit: string().oneOf(['PER_PIECE', 'PER_SIDE', 'PER_SHEET', 'PER_SIDE_PER_SHEET', 'PER_SQM', 'FLAT']).required('Charge unit is required'),
  billing_basis: string().oneOf(['per_sheet', 'per_piece', 'flat_per_job', 'flat_per_group', 'flat_per_line']).required('Billing basis is required'),
  side_mode: string().oneOf(['ignore_sides', 'per_selected_side']).required('Side mode is required'),
  price: string().required('Price is required'),
  double_side_price: string().optional(),
  setup_fee: string().optional(),
  minimum_charge: string().optional(),
  min_qty: number().transform((value, originalValue) => originalValue === '' ? undefined : value).nullable().optional(),
  help_text: string().optional(),
})

function onSubmit(values: Record<string, unknown>) {
  emit('submit', values as FinishingServiceForm)
}

function fieldError(field: keyof FinishingServiceForm) {
  return props.fieldErrors?.[field] ?? null
}
</script>
