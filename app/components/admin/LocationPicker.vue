<template>
  <div class="space-y-4">
    <div>
      <label class="mb-1.5 block text-sm font-medium text-[var(--p-text-dim)]">Search location</label>
      <input
        ref="inputRef"
        v-model="searchValue"
        type="text"
        placeholder="Search Westlands, Nairobi"
        class="w-full rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] px-4 py-2.5 text-sm text-[var(--p-text)] placeholder:text-[var(--p-text-muted)] focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
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

    <div v-else class="rounded-xl border border-amber-200/60 bg-amber-50/30 p-4 dark:border-amber-800/40 dark:bg-amber-900/10">
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
          @input="updateField('address_line', ($event.target as HTMLInputElement).value)"
        >
      </div>
      <div>
        <label class="mb-1.5 block text-sm font-medium text-[var(--p-text-dim)]">City</label>
        <input
          :value="form.city"
          class="w-full rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] px-4 py-2.5 text-sm text-[var(--p-text)]"
          @input="updateField('city', ($event.target as HTMLInputElement).value)"
        >
      </div>
      <div>
        <label class="mb-1.5 block text-sm font-medium text-[var(--p-text-dim)]">State / County</label>
        <input
          :value="form.state"
          class="w-full rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] px-4 py-2.5 text-sm text-[var(--p-text)]"
          @input="updateField('state', ($event.target as HTMLInputElement).value)"
        >
      </div>
      <div>
        <label class="mb-1.5 block text-sm font-medium text-[var(--p-text-dim)]">Country</label>
        <input
          :value="form.country"
          class="w-full rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] px-4 py-2.5 text-sm text-[var(--p-text)]"
          @input="updateField('country', ($event.target as HTMLInputElement).value)"
        >
      </div>
      <div>
        <label class="mb-1.5 block text-sm font-medium text-[var(--p-text-dim)]">Latitude</label>
        <input
          :value="form.latitude"
          class="w-full rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] px-4 py-2.5 text-sm text-[var(--p-text)]"
          @input="updateField('latitude', ($event.target as HTMLInputElement).value)"
        >
      </div>
      <div>
        <label class="mb-1.5 block text-sm font-medium text-[var(--p-text-dim)]">Longitude</label>
        <input
          :value="form.longitude"
          class="w-full rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] px-4 py-2.5 text-sm text-[var(--p-text)]"
          @input="updateField('longitude', ($event.target as HTMLInputElement).value)"
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
  const value: LocationPickerValue = { ...form }
  emit('change', value)
  emit('update:modelValue', value)
}

function updateField<K extends keyof LocationPickerValue>(key: K, value: LocationPickerValue[K]) {
  form[key] = value
  emitChange()
}

function getAddressPart(
  components: Array<{ types: string[]; long_name: string; short_name: string }>,
  wantedTypes: string[],
  key: 'long_name' | 'short_name' = 'long_name',
) {
  const found = components.find((component) => wantedTypes.some((type) => component.types.includes(type)))
  return found?.[key] ?? ''
}

function buildStreetAddress(components: Array<{ types: string[]; long_name: string; short_name: string }>, fallback: string) {
  const route = getAddressPart(components, ['route'])
  const streetNumber = getAddressPart(components, ['street_number'])
  const premise = getAddressPart(components, ['premise'])
  const subpremise = getAddressPart(components, ['subpremise'])
  const street = [streetNumber, route].filter(Boolean).join(' ').trim()
  const building = [premise, subpremise].filter(Boolean).join(', ').trim()
  return [building, street].filter(Boolean).join(', ').trim() || fallback
}

function createMarkerContent() {
  const marker = document.createElement('div')
  marker.className = 'printy-place-marker'
  marker.innerHTML = '<div class="printy-place-marker__core"></div>'
  return marker
}

watch(
  () => props.modelValue,
  (value) => {
    if (!value) return
    form.address_line = value.address_line ?? ''
    form.city = value.city ?? ''
    form.state = value.state ?? ''
    form.country = value.country ?? ''
    form.zip_code = value.zip_code ?? ''
    form.latitude = value.latitude ?? ''
    form.longitude = value.longitude ?? ''
    form.google_place_id = value.google_place_id ?? ''
    searchValue.value = form.address_line
  },
  { deep: true, immediate: true },
)

let map: any = null
let marker: any = null

async function syncMarkerPosition(lat: number, lng: number, title: string) {
  if (!map) return
  map.setCenter({ lat, lng })
  map.setZoom(15)

  if (!marker) {
    const { markerLibrary } = await useGoogleMaps().importLibraries()
    marker = new markerLibrary.AdvancedMarkerElement({
      map,
      position: { lat, lng },
      title,
      content: createMarkerContent(),
    })
    return
  }

  marker.position = { lat, lng }
  marker.title = title
  marker.map = map
}

onMounted(async () => {
  if (!apiKey || !inputRef.value || !mapRef.value) return

  try {
    const { mapsLibrary, placesLibrary } = await useGoogleMaps().importLibraries()

    map = new mapsLibrary.Map(mapRef.value, {
      center: { lat: -1.286389, lng: 36.817223 },
      zoom: 12,
      mapId: 'DEMO_MAP_ID',
      disableDefaultUI: true,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    })

    const autocomplete = new placesLibrary.Autocomplete(inputRef.value, {
      fields: ['address_components', 'formatted_address', 'geometry', 'name', 'place_id'],
      types: ['establishment', 'geocode'],
    })

    autocomplete.addListener('place_changed', async () => {
      const place = autocomplete.getPlace()
      if (!place.geometry?.location) return

      const lat = place.geometry.location.lat()
      const lng = place.geometry.location.lng()
      const components = place.address_components ?? []
      const formattedAddress = place.formatted_address || place.name || ''

      form.address_line = buildStreetAddress(components, formattedAddress)
      form.city = getAddressPart(components, ['locality', 'postal_town', 'sublocality_level_1', 'administrative_area_level_3', 'administrative_area_level_2'])
      form.state = getAddressPart(components, ['administrative_area_level_1', 'administrative_area_level_2'])
      form.country = getAddressPart(components, ['country']) || form.country || 'Kenya'
      form.zip_code = getAddressPart(components, ['postal_code']) || form.zip_code || ''
      form.latitude = String(lat)
      form.longitude = String(lng)
      form.google_place_id = place.place_id || ''
      searchValue.value = formattedAddress || form.address_line

      await syncMarkerPosition(lat, lng, place.name || formattedAddress || form.address_line)
      emitChange()
    })

    const currentLat = Number(form.latitude)
    const currentLng = Number(form.longitude)
    if (Number.isFinite(currentLat) && Number.isFinite(currentLng)) {
      await syncMarkerPosition(currentLat, currentLng, form.address_line || 'Selected location')
    }
  } catch (error) {
    console.warn('Google Maps failed to load:', error)
  }
})
</script>

<style scoped>
:global(.printy-place-marker) {
  width: 24px;
  height: 24px;
  display: grid;
  place-items: center;
}

:global(.printy-place-marker__core) {
  width: 14px;
  height: 14px;
  border-radius: 9999px;
  border: 2px solid rgb(255 255 255);
  background: rgb(247 91 28);
  box-shadow:
    0 0 0 6px rgb(247 91 28 / 0.18),
    0 0 18px rgb(247 91 28 / 0.45),
    0 0 30px rgb(247 91 28 / 0.28);
}
</style>
