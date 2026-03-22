<template>
  <VeeForm
    v-slot="{ meta }"
    :validation-schema="schema"
    :initial-values="initialValues"
    @submit="(values: Record<string, unknown>) => $emit('submit', values as unknown as VolumeDiscountForm)"
  >
    <div class="space-y-4">
      <UAlert
        v-if="errorMessage"
        color="error"
        variant="soft"
        title="Could not save volume discount"
        :description="errorMessage"
        icon="i-lucide-alert-circle"
      />
      <table class="w-full text-sm">
        <tbody class="divide-y divide-[var(--p-border-dim)]">
        <tr>
          <td class="w-40 py-3 pr-4 align-top font-medium text-[var(--p-text-dim)]">Discount Name</td>
          <td class="py-3">
            <FormsFormInput
              name="name"
              label="Discount Name"
              placeholder="e.g. Bulk Order 10% Off"
              required
              hide-label
            />
            <DashboardInlineError :message="fieldError('name')" />
          </td>
        </tr>
        <tr>
          <td class="py-3 pr-4 align-top font-medium text-[var(--p-text-dim)]">Minimum Quantity</td>
          <td class="py-3">
            <FormsFormInput
              name="min_quantity"
              label="Minimum Quantity"
              type="number"
              placeholder="e.g. 100"
              required
              hide-label
            />
            <DashboardInlineError :message="fieldError('min_quantity')" />
          </td>
        </tr>
        <tr>
          <td class="py-3 pr-4 align-top font-medium text-[var(--p-text-dim)]">Discount %</td>
          <td class="py-3">
            <FormsFormInput
              name="discount_percent"
              label="Discount %"
              type="number"
              placeholder="e.g. 10"
              required
              hide-label
            />
            <DashboardInlineError :message="fieldError('discount_percent')" />
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="mt-4 flex justify-end gap-2 border-t border-[var(--p-border)] pt-4">
      <UButton variant="ghost" @click="$emit('cancel')">Cancel</UButton>
      <DashboardLoadingButton type="submit" color="primary" :loading="loading" :disabled="!meta.valid">
        {{ editing ? 'Save Changes' : 'Save Discount' }}
      </DashboardLoadingButton>
    </div>
  </VeeForm>
</template>

<script setup lang="ts">
import { object, number, string } from 'yup'
import type { VolumeDiscount, VolumeDiscountForm } from '~/shared/types'

const props = defineProps<{
  discount?: VolumeDiscount | null
  loading?: boolean
  errorMessage?: string | null
  fieldErrors?: Record<string, string>
}>()
defineEmits<{ submit: [data: VolumeDiscountForm]; cancel: [] }>()

const editing = computed(() => !!props.discount)

const initialValues = computed(() => ({
  name: props.discount?.name ?? '',
  min_quantity: props.discount?.min_quantity ?? 100,
  discount_percent: props.discount?.discount_percent ?? '10',
}))

const schema = object({
  name: string().required('Name is required'),
  min_quantity: number().min(1, 'Min 1').required('Minimum quantity is required'),
  discount_percent: string().required('Discount % is required'),
})

function fieldError(field: keyof VolumeDiscountForm) {
  return props.fieldErrors?.[field] ?? null
}
</script>
