<template>
  <VeeForm v-slot="{ meta }" :validation-schema="schema" :initial-values="initialValues" @submit="onSubmit">
    <div class="space-y-4">
      <FormsFormInput name="name" label="Name" placeholder="Product name" required />
      <FormsFormTextarea name="description" label="Description" placeholder="Description..." />
      <FormsFormInput name="base_price" label="Base price" placeholder="0.00" required />
      <FormsFormInput name="unit" label="Unit" placeholder="e.g. sheet, m²" required />
      <label class="flex items-center gap-2">
        <UCheckbox v-model="isActive" />
        <span class="text-sm text-gray-700 dark:text-gray-300">Active</span>
      </label>
      <div class="flex justify-end gap-2">
        <UButton variant="outline" @click="$emit('cancel')">Cancel</UButton>
        <UButton type="submit" color="primary" :loading="loading" :disabled="!meta.valid">Save</UButton>
      </div>
    </div>
  </VeeForm>
</template>

<script setup lang="ts">
import { object, string } from 'yup'
import type { ProductTemplate } from '~/shared/types'

const props = defineProps<{ product?: ProductTemplate | null; loading?: boolean }>()
const emit = defineEmits<{ submit: [data: Partial<ProductTemplate>]; cancel: [] }>()

const isActive = ref(props.product?.is_active ?? true)
const schema = object({
  name: string().required('Name is required'),
  description: string(),
  base_price: string().required('Base price is required'),
  unit: string().required('Unit is required'),
})
const initialValues = computed(() => ({
  name: props.product?.name ?? '',
  description: props.product?.description ?? '',
  base_price: props.product?.base_price ?? '',
  unit: props.product?.unit ?? '',
}))
function onSubmit(values: Partial<ProductTemplate>) {
  emit('submit', { ...values, is_active: isActive.value })
}
</script>
