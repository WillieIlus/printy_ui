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
      <CommonSectionCard title="Basic Information">
        <div class="space-y-4">
          <FormsFormInput name="name" label="Shop Name" placeholder="Enter shop name" required @input="onNameInput" />
          <div>
            <label class="mb-1.5 block text-sm font-medium text-[var(--p-text-dim)]">Slug</label>
            <div class="flex gap-2 items-center">
              <div class="flex-1 flex items-center gap-2 rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] px-4 py-2.5 text-sm text-[var(--p-text-muted)]">
                <span class="shrink-0 text-[var(--p-text-muted)]">/</span>
                <span>{{ slugPreview || 'auto-generated' }}</span>
              </div>
              <UButton
                v-if="isEdit"
                variant="soft"
                color="neutral"
                size="sm"
                icon="i-lucide-refresh-cw"
                aria-label="Regenerate slug"
                @click="regenerateSlug"
              />
            </div>
            <p class="mt-1 text-xs text-[var(--p-text-muted)]">
              URL-friendly identifier. Auto-generated from name.
            </p>
          </div>
          <FormsFormRichText name="description" label="Description" placeholder="Describe your business..." />
          <div class="grid md:grid-cols-2 gap-4">
            <FormsFormInput name="business_email" label="Email" type="email" placeholder="shop@example.com" required />
            <FormsFormInput name="phone_number" label="Phone" placeholder="+254 700 000 000" />
          </div>
        </div>
      </CommonSectionCard>

      <CommonSectionCard title="Location">
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
      </CommonSectionCard>

      <div class="flex justify-end gap-3 pt-2">
        <UButton variant="ghost" @click="$emit('cancel')">Cancel</UButton>
        <UButton type="submit" color="primary" :loading="loading" :disabled="!meta.valid">
          {{ isEdit ? 'Update Shop' : 'Create Shop' }}
        </UButton>
      </div>
    </div>
  </VeeForm>
</template>

<script setup lang="ts">
import { object, string } from 'yup'
import type { Shop, ShopCreateInput } from '~/shared/types'
import { slugify } from '~/utils/slugify'

const props = defineProps<{ shop?: Shop; loading?: boolean; error?: string | null }>()
const emit = defineEmits<{ submit: [data: ShopCreateInput]; cancel: [] }>()

const isEdit = computed(() => !!props.shop)
const slugPreview = ref('')
const slugManuallyEdited = ref(false)

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

watch(() => props.shop?.slug, (slug) => {
  if (slug) slugPreview.value = slug
}, { immediate: true })

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

function onNameInput(e: Event) {
  if (slugManuallyEdited.value) return
  const target = e.target as HTMLInputElement
  if (target?.value != null) {
    slugPreview.value = slugify(target.value)
  }
}

function regenerateSlug() {
  slugManuallyEdited.value = false
  slugPreview.value = slugify(initialValues.value.name)
}

function cleanPayload(values: Record<string, unknown>): Record<string, unknown> {
  const cleaned: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(values)) {
    cleaned[key] = value === '' || value === undefined ? null : value
  }
  return cleaned
}

function onSubmit(values: Record<string, unknown>) {
  const cleaned = cleanPayload(values)
  emit('submit', cleaned as unknown as ShopCreateInput)
}
</script>
