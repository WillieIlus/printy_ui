<template>
  <VeeForm v-slot="{ meta }" :validation-schema="shopSchema" :initial-values="initialValues" @submit="onSubmit">
    <div class="space-y-6">
      <UAlert
        v-if="error"
        color="error"
        variant="soft"
        :title="error"
        icon="i-lucide-alert-circle"
        class="mb-4"
      />
      <UCard>
        <template #header>
          <h3 class="font-semibold text-gray-900 dark:text-white">Basic Information</h3>
        </template>
        <div class="space-y-4">
          <FormsFormInput name="name" label="Shop Name" placeholder="Enter shop name" required />
          <FormsFormRichText name="description" label="Description" placeholder="Describe your business..." />
          <div class="grid md:grid-cols-2 gap-4">
            <FormsFormInput name="business_email" label="Email" type="email" placeholder="shop@example.com" required />
            <FormsFormInput name="phone_number" label="Phone" placeholder="+1 (555) 000-0000" />
          </div>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <h3 class="font-semibold text-gray-900 dark:text-white">Location</h3>
        </template>
        <div class="space-y-4">
          <FormsFormInput name="address_line" label="Address" placeholder="Street address" required />
          <div class="grid md:grid-cols-2 gap-4">
            <FormsFormInput name="city" label="City" placeholder="City" required />
            <FormsFormInput name="state" label="State/Province" placeholder="State" required />
          </div>
          <div class="grid md:grid-cols-2 gap-4">
            <FormsFormInput name="country" label="Country" placeholder="Country" required />
            <FormsFormInput name="zip_code" label="Postal Code" placeholder="12345" required />
          </div>
        </div>
      </UCard>

      <div class="sticky bottom-0 -mx-4 -mb-4 mt-6 flex justify-end gap-4 bg-white dark:bg-gray-900 px-4 py-4 sm:-mx-6 sm:-mb-6 sm:px-6 sm:pt-6 border-t border-gray-200 dark:border-gray-700 sm:border-t-0">
        <UButton variant="outline" @click="$emit('cancel')">Cancel</UButton>
        <UButton type="submit" color="primary" :loading="loading" :disabled="!meta.valid" class="disabled:!bg-gray-300 disabled:!text-gray-500 dark:disabled:!bg-gray-600 dark:disabled:!text-gray-400">
          {{ isEdit ? 'Update Shop' : 'Create Shop' }}
        </UButton>
      </div>
    </div>
  </VeeForm>
</template>

<script setup lang="ts">
import { object, string } from 'yup'
import type { Shop, ShopCreateInput } from '~/shared/types'

const props = defineProps<{ shop?: Shop; loading?: boolean; error?: string | null }>()
const emit = defineEmits<{ submit: [data: ShopCreateInput]; cancel: [] }>()

const isEdit = computed(() => !!props.shop)

/** Map backend field names to form fields (Django may use postal_code, address, email). */
const initialValues = computed(() => {
  const s = props.shop as Record<string, unknown> | undefined
  if (!s) return { name: '', description: '', business_email: '', phone_number: '', address_line: '', city: '', state: '', country: '', zip_code: '' }
  return {
    name: (s.name as string) ?? '',
    description: (s.description as string) ?? '',
    business_email: (s.business_email ?? s.email) as string ?? '',
    phone_number: (s.phone_number ?? s.phone) as string ?? '',
    address_line: (s.address_line ?? s.address) as string ?? '',
    city: (s.city as string) ?? '',
    state: (s.state as string) ?? '',
    country: (s.country as string) ?? '',
    zip_code: (s.zip_code ?? s.postal_code) as string ?? '',
  }
})

const shopSchema = object({
  name: string().required('Shop name is required'),
  description: string().nullable(),
  business_email: string().email('Invalid email').required('Email is required'),
  phone_number: string().nullable(),
  address_line: string().required('Address is required'),
  city: string().required('City is required'),
  state: string().required('State is required'),
  country: string().required('Country is required'),
  zip_code: string().required('Postal code is required'),
})

function cleanPayload(values: Record<string, unknown>): Record<string, unknown> {
  const cleaned: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(values)) {
    if (value === '' || value === undefined) {
      cleaned[key] = null
    } else {
      cleaned[key] = value
    }
  }
  return cleaned
}

function onSubmit(values: Record<string, unknown>) {
  const cleaned = cleanPayload(values)
  emit('submit', cleaned as unknown as ShopCreateInput)
}
</script>