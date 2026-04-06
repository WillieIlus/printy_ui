<template>
  <section class="rounded-[2rem] border border-[var(--p-border)] bg-[var(--p-surface)] p-4 shadow-sm sm:p-5">
    <CommonMapFeatureFallback v-if="!enableMap" />

    <template v-else>
      <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div class="max-w-2xl">
        <p class="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[var(--p-primary)]">
          Shop Map
        </p>
        <h2 class="mt-2 text-2xl font-bold tracking-tight text-[var(--p-text)]">
          Explore shop locations at a glance
        </h2>
        <p class="mt-2 text-sm leading-6 text-[var(--p-text-muted)]">
          Google-linked shops use the glowing orange marker. Standard markers show shops added with manual coordinates only.
        </p>
      </div>
      <div class="inline-flex items-center gap-2 rounded-full border border-[var(--p-border)] bg-[var(--p-surface-sunken)] px-3.5 py-2 text-xs font-medium text-[var(--p-text-dim)]">
        <span class="inline-flex items-center gap-2">
          <span class="printy-map-marker printy-map-marker--google"><span class="printy-map-marker__core" /></span>
          Google-linked
        </span>
        <span class="h-4 w-px bg-[var(--p-border)]" />
        <span class="inline-flex items-center gap-2">
          <span class="printy-map-marker printy-map-marker--default"><span class="printy-map-marker__core" /></span>
          Standard
        </span>
      </div>
      </div>

      <div class="relative mt-5 overflow-hidden rounded-[1.5rem] border border-[var(--p-border)] bg-[var(--p-surface-sunken)]">
        <div ref="mapRef" class="h-[26rem] w-full sm:h-[32rem]" />

        <div v-if="selectedShop" class="pointer-events-none absolute inset-x-3 bottom-3 flex justify-start sm:inset-x-auto sm:left-4 sm:right-4">
          <article class="pointer-events-auto w-full max-w-sm rounded-[1.35rem] border border-white/55 bg-white/92 p-4 shadow-[0_24px_60px_rgba(15,23,42,0.18)] backdrop-blur dark:border-white/10 dark:bg-slate-950/92">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <p class="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[var(--p-primary)]">
                  {{ selectedShop.google_place_id ? 'Google-linked shop' : 'Mapped shop' }}
                </p>
                <h3 class="mt-1 truncate text-lg font-bold text-[var(--p-text)]">{{ selectedShop.name }}</h3>
                <p class="mt-1 line-clamp-2 text-sm leading-6 text-[var(--p-text-muted)]">
                  {{ selectedShop.descriptionText }}
                </p>
              </div>
              <span
                class="mt-1 inline-flex h-3.5 w-3.5 shrink-0 rounded-full"
                :class="selectedShop.google_place_id ? 'bg-flamingo-500 shadow-[0_0_0_6px_rgba(247,91,28,0.18),0_0_18px_rgba(247,91,28,0.4)]' : 'bg-slate-500 shadow-[0_0_0_5px_rgba(100,116,139,0.15)] dark:bg-slate-300'"
              />
            </div>

            <div class="mt-4 flex items-center justify-between gap-3 border-t border-[var(--p-border)] pt-3">
              <div class="text-xs font-medium text-[var(--p-text-muted)]">
                {{ selectedShop.google_place_id ? 'Verified by Google place data' : 'Manual location coordinates' }}
              </div>
              <NuxtLink
                :to="`/shops/${selectedShop.slug}`"
                class="inline-flex items-center justify-center rounded-xl bg-flamingo-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-flamingo-400"
              >
                View shop
              </NuxtLink>
            </div>
          </article>
        </div>
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
import { useGoogleMaps } from '~/composables/useGoogleMaps'

interface PublicMapShop {
  id: number
  name: string
  slug: string
  latitude: number
  longitude: number
  google_place_id?: string | null
  descriptionText: string
}

const props = defineProps<{
  shops: PublicMapShop[]
}>()

const mapRef = ref<HTMLDivElement | null>(null)
const selectedShopId = ref<number | null>(null)
const { enableMap } = useMapFeature()

const shopsWithCoords = computed(() =>
  props.shops.filter((shop) => Number.isFinite(shop.latitude) && Number.isFinite(shop.longitude))
)

const selectedShop = computed(() => {
  const current = shopsWithCoords.value.find((shop) => shop.id === selectedShopId.value)
  return current ?? shopsWithCoords.value[0] ?? null
})

let map: any = null
let googleRef: any = null
const markers = new Map<number, any>()

function createMarkerContent(shop: PublicMapShop) {
  const marker = document.createElement('button')
  marker.type = 'button'
  marker.className = `printy-map-marker ${shop.google_place_id ? 'printy-map-marker--google' : 'printy-map-marker--default'}`
  marker.innerHTML = '<span class="printy-map-marker__core"></span>'
  marker.setAttribute('aria-label', shop.name)
  marker.addEventListener('click', () => {
    selectedShopId.value = shop.id
  })
  return marker
}

function fitMapToShops() {
  if (!map || !googleRef || !shopsWithCoords.value.length) return

  if (shopsWithCoords.value.length === 1) {
    const shop = shopsWithCoords.value[0]
    if (!shop) return
    map.setCenter({ lat: shop.latitude, lng: shop.longitude })
    map.setZoom(14)
    return
  }

  const bounds = new googleRef.maps.LatLngBounds()
  for (const shop of shopsWithCoords.value) {
    bounds.extend({ lat: shop.latitude, lng: shop.longitude })
  }
  map.fitBounds(bounds, 80)
}

async function renderMarkers() {
  if (!enableMap.value || !map) return

  for (const marker of markers.values()) {
    marker.map = null
  }
  markers.clear()

  const { markerLibrary } = await useGoogleMaps().importLibraries()

  for (const shop of shopsWithCoords.value) {
    const marker = new markerLibrary.AdvancedMarkerElement({
      map,
      position: { lat: shop.latitude, lng: shop.longitude },
      title: shop.name,
      content: createMarkerContent(shop),
    })

    marker.addListener?.('click', () => {
      selectedShopId.value = shop.id
    })

    markers.set(shop.id, marker)
  }

  fitMapToShops()
}

onMounted(async () => {
  if (!enableMap.value || !mapRef.value || !shopsWithCoords.value.length) return

  const { google, mapsLibrary } = await useGoogleMaps().importLibraries()
  const firstShop = shopsWithCoords.value[0]
  if (!firstShop) return

  googleRef = google
  map = new mapsLibrary.Map(mapRef.value, {
    center: { lat: firstShop.latitude, lng: firstShop.longitude },
    zoom: 12,
    mapId: 'DEMO_MAP_ID',
    disableDefaultUI: true,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
  })

  if (selectedShop.value) {
    selectedShopId.value = selectedShop.value.id
  }

  await renderMarkers()
})

watch(shopsWithCoords, async () => {
  if (!enableMap.value || !map) return
  if (!selectedShop.value && shopsWithCoords.value[0]) {
    selectedShopId.value = shopsWithCoords.value[0].id
  }
  await renderMarkers()
}, { deep: true })

onBeforeUnmount(() => {
  for (const marker of markers.values()) {
    marker.map = null
  }
  markers.clear()
})
</script>

<style scoped>
.printy-map-marker {
  width: 24px;
  height: 24px;
  display: grid;
  place-items: center;
  border: 0;
  padding: 0;
  background: transparent;
  cursor: pointer;
}

.printy-map-marker__core {
  display: block;
  width: 14px;
  height: 14px;
  border-radius: 9999px;
  border: 2px solid rgb(255 255 255);
}

.printy-map-marker--google .printy-map-marker__core {
  background: rgb(247 91 28);
  box-shadow:
    0 0 0 6px rgb(247 91 28 / 0.18),
    0 0 18px rgb(247 91 28 / 0.45),
    0 0 30px rgb(247 91 28 / 0.28);
}

.printy-map-marker--default .printy-map-marker__core {
  background: rgb(100 116 139);
  box-shadow:
    0 0 0 5px rgb(100 116 139 / 0.14),
    0 0 16px rgb(15 23 42 / 0.14);
}

:global(.dark) .printy-map-marker--default .printy-map-marker__core {
  background: rgb(203 213 225);
}
</style>
