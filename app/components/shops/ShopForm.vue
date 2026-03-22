<template>
  <form class="space-y-6" @submit.prevent="submitForm">
    <DashboardInfoCard
      title="Create a real Kenyan shop address"
      description="Use the same county, area, street, and landmark language your customers, riders, and staff already use day to day."
      icon="i-lucide-map-pinned"
      tone="orange"
    >
      <p class="text-sm leading-6 text-slate-200/90">
        The shop form now only blocks submit on visible required fields. Postal code is optional and manual address entry always works.
      </p>
    </DashboardInfoCard>

    <UAlert
      v-if="submitMessage"
      :color="submitMessage.color"
      variant="soft"
      :title="submitMessage.title"
      :description="submitMessage.description"
      :icon="submitMessage.icon"
    />

    <UAlert
      v-if="error"
      color="error"
      variant="soft"
      title="We could not save this shop yet"
      :description="error"
      icon="i-lucide-alert-circle"
    />

    <DashboardFormSection
      title="Shop Basics"
      description="Capture the business details customers actually use when they call, message, or visit the shop."
    >
      <div class="grid gap-5 md:grid-cols-2">
        <div class="space-y-2 md:col-span-2">
          <label class="block text-sm font-medium text-white">Shop Name</label>
          <UInput
            v-model="form.name"
            placeholder="Print Hub Westlands"
            size="xl"
            @blur="touchField('name')"
          />
          <DashboardFieldHint text="Use the name already seen on signage, invoices, or WhatsApp." />
          <DashboardInlineError :message="fieldError('name')" />
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-white">Business Email</label>
          <UInput
            v-model="form.business_email"
            type="email"
            placeholder="hello@printhub.co.ke"
            size="xl"
            @blur="touchField('business_email')"
          />
          <DashboardFieldHint text="Required for quote follow-up, order history, and admin ownership." />
          <DashboardInlineError :message="fieldError('business_email')" />
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-white">Phone / WhatsApp Number</label>
          <UInput
            v-model="form.phone_number"
            placeholder="+254 712 345 678"
            size="xl"
            @blur="touchField('phone_number')"
          />
          <DashboardFieldHint text="Use the line customers actually call or WhatsApp for print jobs." />
          <DashboardInlineError :message="fieldError('phone_number')" />
        </div>

        <div class="space-y-2 md:col-span-2">
          <label class="block text-sm font-medium text-white">About This Shop</label>
          <UTextarea
            v-model="form.description"
            :rows="4"
            placeholder="Commercial print shop handling flyers, brochures, branded stationery, and rush digital jobs for Nairobi clients."
          />
          <DashboardFieldHint text="Optional. A short description helps your team identify what this branch focuses on." />
        </div>
      </div>
    </DashboardFormSection>

    <DashboardFormSection
      title="Kenyan Address"
      description="These fields use Kenyan address patterns and map to the existing backend address model."
    >
      <div v-if="hasGoogleMaps" class="space-y-4">
        <DashboardInfoCard
          title="Optional map search"
          description="Search for a place to prefill the address, then review the fields before saving."
          icon="i-lucide-search"
          tone="blue"
        >
          <AdminLocationPicker
            :model-value="locationModel"
            @update:model-value="syncFromLocationPicker"
          />
        </DashboardInfoCard>
      </div>

      <DashboardInfoCard
        v-else
        title="Manual address mode is active"
        description="Google Maps search is unavailable because NUXT_PUBLIC_GOOGLE_MAPS_API_KEY is missing. Manual entry below is fully supported."
        icon="i-lucide-map"
      >
        <p class="text-sm leading-6 text-slate-200/90">
          You can still create the shop now. Add county, area, street/building, and an optional landmark or postal code.
        </p>
      </DashboardInfoCard>

      <div class="grid gap-5 md:grid-cols-2">
        <div class="space-y-2">
          <label class="block text-sm font-medium text-white">County</label>
          <UInput
            v-model="form.state"
            list="kenya-counties"
            placeholder="Nairobi"
            size="xl"
            @blur="touchField('state')"
          />
          <datalist id="kenya-counties">
            <option v-for="county in KENYA_COUNTIES" :key="county" :value="county" />
          </datalist>
          <DashboardFieldHint text="This is stored in the existing backend state field." />
          <DashboardInlineError :message="fieldError('state')" />
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-white">Town / Area / Estate</label>
          <UInput
            v-model="form.city"
            placeholder="Westlands, CBD, Nyali, Eldoret Town"
            size="xl"
            @blur="touchField('city')"
          />
          <DashboardFieldHint text="Enter the location wording a customer would say first." />
          <DashboardInlineError :message="fieldError('city')" />
        </div>

        <div class="space-y-2 md:col-span-2">
          <label class="block text-sm font-medium text-white">Street / Building / Floor</label>
          <UInput
            v-model="form.address_line"
            placeholder="Muthithi Road, Madonna House, 2nd Floor"
            size="xl"
            @blur="touchField('address_line')"
          />
          <DashboardFieldHint text="Required. Add the road, building, or floor that gets a first-time visitor there." />
          <DashboardInlineError :message="fieldError('address_line')" />
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-white">Landmark</label>
          <UInput
            v-model="form.landmark"
            placeholder="Opposite Sarit Centre parking entrance"
            size="xl"
          />
          <DashboardFieldHint text="Optional, but useful for riders, drivers, and walk-ins." />
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-white">Postal Code</label>
          <UInput
            v-model="form.zip_code"
            placeholder="00100"
            size="xl"
            @blur="touchField('zip_code')"
          />
          <DashboardFieldHint text="Optional. Leave blank if you do not use postal codes operationally." />
          <DashboardInlineError :message="fieldError('zip_code')" />
        </div>
      </div>
    </DashboardFormSection>

    <DashboardFormSection
      title="Ready To Submit"
      description="The button only disables for required fields with validation issues."
    >
      <div class="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div class="rounded-[24px] border border-white/10 bg-slate-950/45 p-4">
          <p class="text-sm font-semibold text-white">Current form status</p>
          <p class="mt-2 text-sm leading-6 text-slate-300">{{ submitReason }}</p>
        </div>

        <div
          class="rounded-[24px] border p-4"
          :class="missingFields.length
            ? 'border-orange-400/20 bg-orange-500/8'
            : 'border-emerald-400/20 bg-emerald-500/8'"
        >
          <p class="text-sm font-semibold text-white">
            {{ missingFields.length ? 'Needs attention' : 'Ready to create' }}
          </p>
          <div v-if="missingFields.length" class="mt-2 flex flex-wrap gap-2">
            <span
              v-for="item in missingFields"
              :key="item"
              class="inline-flex rounded-full border border-orange-400/20 bg-orange-500/10 px-3 py-1 text-xs font-medium text-orange-100"
            >
              {{ item }}
            </span>
          </div>
          <p v-else class="mt-2 text-sm leading-6 text-emerald-100/90">
            Required fields are valid. Submit will create the shop workspace and continue to setup.
          </p>
        </div>
      </div>

      <div class="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
        <p class="text-sm text-slate-400">
          {{ hasGoogleMaps ? 'Map search is optional.' : 'Manual address entry mode is active.' }}
        </p>
        <div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <UButton variant="ghost" color="neutral" @click="$emit('cancel')">
            Cancel
          </UButton>
          <DashboardLoadingButton
            type="submit"
            color="primary"
            :loading="loading"
            :disabled="!canSubmit"
          >
            {{ isEdit ? 'Save Shop Details' : 'Create Shop' }}
          </DashboardLoadingButton>
        </div>
      </div>
    </DashboardFormSection>
  </form>
</template>

<script setup lang="ts">
import type { Shop, ShopCreateInput } from '~/shared/types'

type FieldName =
  | 'name'
  | 'business_email'
  | 'phone_number'
  | 'state'
  | 'city'
  | 'address_line'
  | 'zip_code'

type NoticeState = {
  color: 'success' | 'error' | 'warning' | 'info'
  title: string
  description: string
  icon: string
}

interface ShopFormState {
  name: string
  description: string
  business_email: string
  phone_number: string
  state: string
  city: string
  address_line: string
  landmark: string
  zip_code: string
  country: string
  latitude: string
  longitude: string
  google_place_id: string
}

const KENYA_COUNTIES = [
  'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet', 'Embu', 'Garissa', 'Homa Bay', 'Isiolo',
  'Kajiado', 'Kakamega', 'Kericho', 'Kiambu', 'Kilifi', 'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui',
  'Kwale', 'Laikipia', 'Lamu', 'Machakos', 'Makueni', 'Mandera', 'Marsabit', 'Meru', 'Migori',
  'Mombasa', 'Murang’a', 'Nairobi', 'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua', 'Nyeri',
  'Samburu', 'Siaya', 'Taita-Taveta', 'Tana River', 'Tharaka-Nithi', 'Trans Nzoia', 'Turkana',
  'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot',
]

const props = defineProps<{
  shop?: Shop
  loading?: boolean
  error?: string | null
  fieldErrors?: Record<string, string>
}>()

const emit = defineEmits<{
  submit: [data: ShopCreateInput]
  cancel: []
}>()

const config = useRuntimeConfig()
const isEdit = computed(() => Boolean(props.shop))
const hasGoogleMaps = computed(() => Boolean(config.public.googleMapsApiKey))

const form = reactive<ShopFormState>({
  name: props.shop?.name ?? '',
  description: props.shop?.description ?? '',
  business_email: props.shop?.business_email ?? '',
  phone_number: props.shop?.phone_number ?? '',
  state: props.shop?.state ?? '',
  city: props.shop?.city ?? '',
  address_line: props.shop?.address_line ?? '',
  landmark: '',
  zip_code: props.shop?.zip_code ?? '',
  country: props.shop?.country ?? 'Kenya',
  latitude: props.shop?.latitude != null ? String(props.shop.latitude) : '',
  longitude: props.shop?.longitude != null ? String(props.shop.longitude) : '',
  google_place_id: '',
})

watch(() => props.shop, (shop) => {
  if (!shop) return
  form.name = shop.name ?? ''
  form.description = shop.description ?? ''
  form.business_email = shop.business_email ?? ''
  form.phone_number = shop.phone_number ?? ''
  form.state = shop.state ?? ''
  form.city = shop.city ?? ''
  form.address_line = shop.address_line ?? ''
  form.zip_code = shop.zip_code ?? ''
  form.country = shop.country ?? 'Kenya'
  form.latitude = shop.latitude != null ? String(shop.latitude) : ''
  form.longitude = shop.longitude != null ? String(shop.longitude) : ''
}, { immediate: true })

const touched = reactive<Record<FieldName, boolean>>({
  name: false,
  business_email: false,
  phone_number: false,
  state: false,
  city: false,
  address_line: false,
  zip_code: false,
})

const submitAttempted = ref(false)

const validations = computed<Record<FieldName, string | null>>(() => ({
  name: normalizedName.value ? null : 'Enter the shop name.',
  business_email: !normalizedBusinessEmail.value
    ? 'Enter a business email address.'
    : /^\S+@\S+\.\S+$/.test(normalizedBusinessEmail.value)
      ? null
      : 'Enter a valid email address.',
  phone_number: normalizedPhone.value ? null : 'Enter a phone or WhatsApp number.',
  state: normalizedCounty.value ? null : 'Enter the county.',
  city: normalizedArea.value ? null : 'Enter the town, area, or estate.',
  address_line: normalizedStreet.value ? null : 'Enter the street, building, or floor.',
  zip_code: normalizedPostalCode.value && !/^[A-Za-z0-9 -]{3,10}$/.test(normalizedPostalCode.value)
    ? 'Postal code should be 3 to 10 letters, numbers, spaces, or hyphens.'
    : null,
}))

const missingFields = computed(() => {
  const items = [
    ['name', 'Shop name'],
    ['business_email', 'Business email'],
    ['phone_number', 'Phone / WhatsApp'],
    ['state', 'County'],
    ['city', 'Town / Area'],
    ['address_line', 'Street / Building'],
  ] as const

  return items
    .filter(([field]) => Boolean(validations.value[field]))
    .map(([, label]) => label)
})

const canSubmit = computed(() => Object.values(validations.value).every(value => !value))

const submitReason = computed(() => {
  if (props.loading) return isEdit.value ? 'Saving the shop details now.' : 'Creating the shop workspace now.'
  if (missingFields.value.length) return `Submit is disabled until these are valid: ${missingFields.value.join(', ')}.`
  return isEdit.value
    ? 'All required fields are valid. Saving will update this shop.'
    : 'All required fields are valid. Creating the shop will continue to setup.'
})

const submitMessage = computed<NoticeState | null>(() => {
  if (!submitAttempted.value) return null
  if (canSubmit.value) {
    return {
      color: 'success',
      title: 'Form is ready',
      description: isEdit.value
        ? 'Required fields are valid. You can save the shop details now.'
        : 'Required fields are valid. You can create the shop now.',
      icon: 'i-lucide-check-circle',
    }
  }

  return {
    color: 'warning',
    title: 'Some required fields still need attention',
    description: `Check: ${missingFields.value.join(', ')}.`,
    icon: 'i-lucide-alert-triangle',
  }
})

const locationModel = computed(() => ({
  address_line: form.address_line,
  city: form.city,
  state: form.state,
  country: form.country,
  zip_code: form.zip_code,
  latitude: form.latitude,
  longitude: form.longitude,
  google_place_id: form.google_place_id,
}))

const normalizedName = computed(() => form.name.trim())
const normalizedBusinessEmail = computed(() => form.business_email.trim())
const normalizedPhone = computed(() => form.phone_number.trim())
const normalizedCounty = computed(() => form.state.trim())
const normalizedArea = computed(() => form.city.trim())
const normalizedStreet = computed(() => form.address_line.trim())
const normalizedLandmark = computed(() => form.landmark.trim())
const normalizedPostalCode = computed(() => form.zip_code.trim())

function touchField(field: FieldName) {
  touched[field] = true
}

function fieldError(field: FieldName) {
  const localError = (!touched[field] && !submitAttempted.value) ? null : validations.value[field]
  return localError || props.fieldErrors?.[field] || null
}

function markTouched() {
  for (const key of Object.keys(touched) as FieldName[]) {
    touched[key] = true
  }
}

function syncFromLocationPicker(value: {
  address_line: string
  city: string
  state: string
  country: string
  zip_code?: string
  latitude: string
  longitude: string
  google_place_id: string
}) {
  form.address_line = value.address_line
  form.city = value.city
  form.state = value.state
  form.country = value.country || 'Kenya'
  form.zip_code = value.zip_code ?? ''
  form.latitude = value.latitude
  form.longitude = value.longitude
  form.google_place_id = value.google_place_id

  touchField('state')
  touchField('city')
  touchField('address_line')
  touchField('zip_code')
}

function buildAddressLine() {
  return [normalizedStreet.value, normalizedLandmark.value].filter(Boolean).join(', ')
}

function submitForm() {
  submitAttempted.value = true
  markTouched()

  if (!canSubmit.value) {
    return
  }

  emit('submit', {
    name: normalizedName.value,
    description: form.description.trim() || null,
    business_email: normalizedBusinessEmail.value,
    phone_number: normalizedPhone.value,
    address_line: buildAddressLine(),
    city: normalizedArea.value,
    state: normalizedCounty.value,
    country: form.country.trim() || 'Kenya',
    zip_code: normalizedPostalCode.value || null,
    latitude: form.latitude.trim() ? Number(form.latitude) : null,
    longitude: form.longitude.trim() ? Number(form.longitude) : null,
    google_place_id: form.google_place_id.trim() || null,
  })
}

watch(form, () => {
  if (!submitAttempted.value) return
  for (const key of Object.keys(touched) as FieldName[]) {
    if (!touched[key]) continue
    touched[key] = true
  }
}, { deep: true })
</script>
