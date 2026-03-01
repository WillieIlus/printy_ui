<template>
  <VeeForm v-slot="{ meta }" :validation-schema="schema" @submit="onSubmit">
    <div class="space-y-4">
      <FormsFormSelect name="shop" label="Shop" :options="shopOptions" placeholder="Select shop" required />
      <FormsFormTextarea name="notes" label="Notes" placeholder="Optional notes..." :rows="3" />
      <UButton type="submit" color="primary" block :loading="loading" :disabled="!meta.valid">Submit claim</UButton>
    </div>
  </VeeForm>
</template>

<script setup lang="ts">
import { object, number, string } from 'yup'
import type { Shop } from '~/shared/types'

const props = defineProps<{ shops: Shop[]; loading?: boolean }>()
const emit = defineEmits<{ submit: [data: { shop: number; notes?: string }] }>()

const shopOptions = computed(() =>
  props.shops.map((s) => ({ label: s.name, value: s.id }))
)
const schema = object({
  shop: number().required('Shop is required'),
  notes: string().optional(),
})
function onSubmit(values: Record<string, unknown>) {
  emit('submit', values as { shop: number; notes?: string })
}
</script>
