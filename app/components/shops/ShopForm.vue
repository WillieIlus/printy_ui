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
          <FormsFormRichText name="description" label="Description" placeholder="Business description for the shop." />
          <div class="grid md:grid-cols-2 gap-4">
            <FormsFormInput name="business_email" label="Email" type="email" placeholder="shop@example.com" required />
            <FormsFormInput name="phone_number" label="Phone" placeholder="+254 700 000 000" />
          </div>
        </div>
      </CommonSectionCard>

      <CommonSectionCard v-if="isEdit" title="Business hours defaults">
        <p class="text-sm text-[var(--p-text-muted)] mb-4">
          Default opening/closing times. Per-day hours are set under Business hours.
        </p>
        <div class="grid md:grid-cols-3 gap-4">
          <FormsFormInput
            name="opening_time"
            label="Opening time"
            type="time"
            placeholder="08:00"
            helper="Default opening time (e.g. 08:00). Used when no per-day override in OpeningHours."
          />
          <FormsFormInput
            name="closing_time"
            label="Closing time"
            type="time"
            placeholder="18:00"
            helper="Default closing time (e.g. 18:00). Used when no per-day override in OpeningHours."
          />
          <FormsFormInput
            name="closing_soon_minutes"
            label="Closing soon (minutes)"
            type="number"
            min="1"
            max="120"
            placeholder="30"
            helper="Minutes before closing to show 'Closing soon' status (e.g. 30)."
          />
        </div>
      </CommonSectionCard>

      <CommonSectionCard title="Location">
        <p class="text-sm text-[var(--p-text-muted)] mb-4">
          Search for a place to auto-fill address, city, and coordinates. You can edit fields manually.
        </p>
        <AdminFormLocationPicker
          :model-value="locationModel"
          @change="onLocationChange"
        />
        <div class="mt-4 grid md:grid-cols-2 gap-4">
          <FormsFormInput name="zip_code" label="Postal Code" placeholder="12345" required />
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
import { hasRichTextContent } from '~/utils/richText'
import { slugify } from '~/utils/slugify'

const props = defineProps<{ shop?: Shop; loading?: boolean; error?: string | null }>()
const emit = defineEmits<{ submit: [data: ShopCreateInput]; cancel: [] }>()

const isEdit = computed(() => !!props.shop)
const slugPreview = ref('')
const slugManuallyEdited = ref(false)

const initialValues = computed(() => {
  const s = props.shop as Record<string, unknown> | undefined
  if (!s) return { name: '', description: '', business_email: '', phone_number: '', address_line: '', city: '', state: '', country: '', zip_code: '', latitude: '', longitude: '', google_place_id: '' }
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
    latitude: (s.latitude != null ? String(s.latitude) : '') as string,
    longitude: (s.longitude != null ? String(s.longitude) : '') as string,
    google_place_id: (s.google_place_id as string) ?? '',
  }
})

const locationModel = computed(() => ({
  address_line: initialValues.value.address_line as string,
  city: initialValues.value.city as string,
  state: initialValues.value.state as string,
  country: initialValues.value.country as string,
  zip_code: initialValues.value.zip_code as string,
  latitude: initialValues.value.latitude as string,
  longitude: initialValues.value.longitude as string,
  google_place_id: initialValues.value.google_place_id as string,
}))

function onLocationChange(_value: { address_line: string; city: string; state: string; country: string; zip_code?: string; latitude: string; longitude: string; google_place_id: string }) {
  // FormLocationPicker syncs via setFieldValue
}

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
  latitude: string().nullable(),
  longitude: string().nullable(),
  google_place_id: string().nullable(),
  opening_time: string().nullable(),
  closing_time: string().nullable(),
  closing_soon_minutes: string().nullable(),
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
  const keepEmptyKeys = ['description', 'google_place_id']
  for (const [key, value] of Object.entries(values)) {
    if (value === undefined) {
      cleaned[key] = null
    } else if (value === '' && !keepEmptyKeys.includes(key)) {
      cleaned[key] = null
    } else {
      cleaned[key] = value
    }
  }
  // Rich text: if user filled it, always send the content — never null or empty
  const desc = values.description
  if (typeof desc === 'string' && hasRichTextContent(desc)) {
    cleaned.description = desc.trim()
  } else if (desc === null || desc === undefined || desc === '') {
    cleaned.description = ''
  } else if (typeof desc === 'string') {
    cleaned.description = desc.trim() || ''
  }
  return cleaned
}

function onSubmit(values: Record<string, unknown>) {
  const cleaned = cleanPayload(values)
  emit('submit', cleaned as unknown as ShopCreateInput)
}
</script>
