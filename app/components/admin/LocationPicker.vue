<template>
  <div class="space-y-4">
    <div>
      <label class="mb-1.5 block text-sm font-medium text-[var(--p-text-dim)]">Search location</label>
      <input
        ref="inputRef"
        type="text"
        :value="searchValue"
        placeholder="Search Westlands, Nairobi"
        class="w-full rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] px-4 py-2.5 text-sm text-[var(--p-text)] placeholder:text-[var(--p-text-muted)] focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
        @input="searchValue = ($event.target as HTMLInputElement).value"
      >
      <p class="mt-1 text-xs text-[var(--p-text-muted)]">
        Search for an area, estate, town, or address. Google will suggest places.
      </p>
    </div>

    <div
      v-if="apiKey"
      ref="mapRef"
      class="h-64 w-full rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)]"
    />

    <div v-else class="rounded-xl border border-amber-200/60 dark:border-amber-800/40 bg-amber-50/30 dark:bg-amber-900/10 p-4">
      <p class="text-sm text-amber-700 dark:text-amber-300">
        Add <code class="rounded bg-amber-200/50 px-1 py-0.5 dark:bg-amber-800/50">NUXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> to enable map search.
      </p>
    </div>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div>
        <label class="mb-1.5 block text-sm font-medium text-[var(--p-text-dim)]">Address</label>
        <input
          :value="form.address_line"
          class="w-full rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] px-4 py-2.5 text-sm text-[var(--p-text)]"
          @input="form.address_line = ($event.target as HTMLInputElement).value; emitChange()"
        >
      </div>
      <div>
        <label class="mb-1.5 block text-sm font-medium text-[var(--p-text-dim)]">City</label>
        <input
          :value="form.city"
          class="w-full rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] px-4 py-2.5 text-sm text-[var(--p-text)]"
          @input="form.city = ($event.target as HTMLInputElement).value; emitChange()"
        >
      </div>
      <div>
        <label class="mb-1.5 block text-sm font-medium text-[var(--p-text-dim)]">State / County</label>
        <input
          :value="form.state"
          class="w-full rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] px-4 py-2.5 text-sm text-[var(--p-text)]"
          @input="form.state = ($event.target as HTMLInputElement).value; emitChange()"
        >
      </div>
      <div>
        <label class="mb-1.5 block text-sm font-medium text-[var(--p-text-dim)]">Country</label>
        <input
          :value="form.country"
          class="w-full rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] px-4 py-2.5 text-sm text-[var(--p-text)]"
          @input="form.country = ($event.target as HTMLInputElement).value; emitChange()"
        >
      </div>
      <div>
        <label class="mb-1.5 block text-sm font-medium text-[var(--p-text-dim)]">Latitude</label>
        <input
          :value="form.latitude"
          class="w-full rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] px-4 py-2.5 text-sm text-[var(--p-text)]"
          @input="form.latitude = ($event.target as HTMLInputElement).value; emitChange()"
        >
      </div>
      <div>
        <label class="mb-1.5 block text-sm font-medium text-[var(--p-text-dim)]">Longitude</label>
        <input
          :value="form.longitude"
          class="w-full rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] px-4 py-2.5 text-sm text-[var(--p-text)]"
          @input="form.longitude = ($event.target as HTMLInputElement).value; emitChange()"
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface LocationPickerValue {
  address_line: string
  city: string
  state: string
  country: string
  zip_code?: string
  latitude: string
  longitude: string
  google_place_id: string
}

const props = withDefaults(
  defineProps<{
    modelValue?: Partial<LocationPickerValue>
  }>(),
  { modelValue: () => ({}) },
)

const emit = defineEmits<{
  change: [value: LocationPickerValue]
  'update:modelValue': [value: LocationPickerValue]
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const mapRef = ref<HTMLDivElement | null>(null)
const searchValue = ref('')

const config = useRuntimeConfig()
const apiKey = (config.public.googleMapsApiKey as string) || ''

const form = reactive<LocationPickerValue>({
  address_line: props.modelValue?.address_line ?? '',
  city: props.modelValue?.city ?? '',
  state: props.modelValue?.state ?? '',
  country: props.modelValue?.country ?? '',
  zip_code: props.modelValue?.zip_code ?? '',
  latitude: props.modelValue?.latitude ?? '',
  longitude: props.modelValue?.longitude ?? '',
  google_place_id: props.modelValue?.google_place_id ?? '',
})

function emitChange() {
  const v: LocationPickerValue = { ...form }
  emit('change', v)
  emit('update:modelValue', v)
}

function getAddressPart(
  components: Array<{ types: string[]; long_name: string }>,
  wantedType: string,
): string {
  const found = components.find((c) => c.types.includes(wantedType))
  return found?.long_name ?? ''
}

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      form.address_line = val.address_line ?? ''
      form.city = val.city ?? ''
      form.state = val.state ?? ''
      form.country = val.country ?? ''
      form.zip_code = val.zip_code ?? ''
      form.latitude = val.latitude ?? ''
      form.longitude = val.longitude ?? ''
      form.google_place_id = val.google_place_id ?? ''
    }
  },
  { deep: true },
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let map: any = null
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let marker: any = null

onMounted(async () => {
  if (!apiKey || !inputRef.value || !mapRef.value) return

  try {
    const { loadGoogleMaps } = useGoogleMaps()
    const google = await loadGoogleMaps()
    if (!google?.maps) return

    map = new google.maps.Map(mapRef.value, {
      center: { lat: -1.286389, lng: 36.817223 },
      zoom: 12,
    })

    const autocomplete = new google.maps.places.Autocomplete(inputRef.value, {
      fields: ['formatted_address', 'geometry', 'name', 'address_components', 'place_id'],
    })

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace()

      if (!place.geometry?.location) return

      const lat = place.geometry.location.lat()
      const lng = place.geometry.location.lng()
      const components = place.address_components ?? []

      form.address_line = place.name || place.formatted_address || ''
      form.city =
        getAddressPart(components, 'locality') ||
        getAddressPart(components, 'administrative_area_level_2')
      form.state =
        getAddressPart(components, 'administrative_area_level_1') ||
        getAddressPart(components, 'administrative_area_level_2')
      form.country = getAddressPart(components, 'country') || form.country
      form.zip_code = getAddressPart(components, 'postal_code') || form.zip_code || ''
      form.latitude = String(lat)
      form.longitude = String(lng)
      form.google_place_id = place.place_id || ''

      searchValue.value = form.address_line

      map?.setCenter({ lat, lng })
      map?.setZoom(15)

      if (!marker) {
        marker = new google.maps.Marker({
          map,
          position: { lat, lng },
        })
      } else {
        marker.setPosition({ lat, lng })
      }

      emitChange()
    })
  } catch (err) {
    console.warn('Google Maps failed to load:', err)
  }
})
</script>
