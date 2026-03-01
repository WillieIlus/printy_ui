<template>
  <VeeForm v-slot="{ meta }" :validation-schema="schema" :initial-values="initialValues" @submit="(values: Record<string, unknown>) => $emit('submit', values as unknown as VolumeDiscountForm)">
    <table class="w-full text-sm">
      <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
        <tr>
          <td class="py-3 pr-4 font-medium text-gray-700 dark:text-gray-300 align-top w-40">Discount Name</td>
          <td class="py-3">
            <FormsFormInput
              name="name"
              label="Discount Name"
              placeholder="e.g. Bulk Order 10% Off"
              required
              hide-label
            />
          </td>
        </tr>
        <tr>
          <td class="py-3 pr-4 font-medium text-gray-700 dark:text-gray-300 align-top">Minimum Quantity</td>
          <td class="py-3">
            <FormsFormInput
              name="min_quantity"
              label="Minimum Quantity"
              type="number"
              placeholder="e.g. 100"
              required
              hide-label
            />
          </td>
        </tr>
        <tr>
          <td class="py-3 pr-4 font-medium text-gray-700 dark:text-gray-300 align-top">Discount %</td>
          <td class="py-3">
            <FormsFormInput
              name="discount_percent"
              label="Discount %"
              type="number"
              placeholder="e.g. 10"
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
import type { VolumeDiscount, VolumeDiscountForm } from '~/shared/types'

const props = defineProps<{
  discount?: VolumeDiscount | null
  loading?: boolean
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
</script>
