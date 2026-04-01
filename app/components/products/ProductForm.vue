<template>
  <VeeForm v-slot="{ meta }" :validation-schema="schema" :initial-values="initialValues" @submit="onSubmit">
    <div class="space-y-4">
      <FormsFormInput name="name" label="Name" placeholder="Product name" required />
      <FormsFormTextarea name="description" label="Description" placeholder="Description..." />
      <label class="flex items-center gap-2">
        <UCheckbox v-model="isActive" />
        <span class="text-sm text-[var(--p-text-dim)]">Active</span>
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
import type { Product } from '~/shared/types'

const props = defineProps<{ product?: Product | null; loading?: boolean }>()
const emit = defineEmits<{ submit: [data: Partial<Product>]; cancel: [] }>()

const isActive = ref(props.product?.is_active ?? true)
const schema = object({
  name: string().required('Name is required'),
  description: string(),
})
const initialValues = computed(() => ({
  name: props.product?.name ?? '',
  description: props.product?.description ?? '',
}))
function onSubmit(values: Partial<Product>) {
  emit('submit', { ...values, is_active: isActive.value })
}
</script>
