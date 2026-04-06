<template>
  <section class="relative left-1/2 w-screen max-w-none -translate-x-1/2 overflow-hidden border-y border-white/8 bg-[#09111d] py-10 text-white sm:py-14">
    <div class="pointer-events-none absolute inset-0">
      <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,17,31,0.94)_0%,rgba(10,17,30,0.98)_100%)]" />
      <div class="absolute left-[8%] top-0 h-[18rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(247,91,28,0.12)_0%,rgba(247,91,28,0.04)_38%,transparent_72%)] blur-3xl" />
      <div class="absolute right-[10%] bottom-[-5rem] h-[20rem] w-[24rem] rounded-full bg-[radial-gradient(circle,rgba(113,78,52,0.16)_0%,rgba(113,78,52,0.05)_40%,transparent_74%)] blur-3xl" />
    </div>

    <div class="relative mx-auto max-w-[96rem] px-4 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-[90rem]">
        <div class="max-w-3xl">
          <p class="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-flamingo-400/90">
            Shop Discovery
          </p>
          <div class="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div class="max-w-2xl">
              <h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Find the right print shop before you start the full quote flow
              </h2>
              <p class="mt-3 text-sm leading-7 text-slate-300 sm:text-[0.97rem]">
                Search by shop name, product type, or location, then jump into a shop that already fits the job you need to print.
              </p>
            </div>
            <div
              v-if="enableMap"
              class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-slate-200"
            >
              <span class="inline-flex items-center gap-2">
                <span class="printy-home-marker printy-home-marker--google"><span class="printy-home-marker__core" /></span>
                Google-linked
              </span>
              <span class="h-4 w-px bg-white/10" />
              <span class="inline-flex items-center gap-2">
                <span class="printy-home-marker printy-home-marker--default"><span class="printy-home-marker__core" /></span>
                Standard
              </span>
            </div>
          </div>
        </div>

        <form
          class="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-3 shadow-[0_24px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl"
          @submit.prevent="applyFilters"
        >
          <div class="grid gap-3 lg:grid-cols-[minmax(0,1.4fr)_minmax(15rem,0.9fr)_minmax(15rem,0.9fr)_auto]">
            <label class="group flex min-h-16 items-center gap-3 rounded-[1.35rem] border border-white/8 bg-[#0e1727]/92 px-4 transition-colors focus-within:border-flamingo-400/55">
              <UIcon name="i-lucide-search" class="h-5 w-5 text-slate-400 transition-colors group-focus-within:text-flamingo-400" />
              <div class="min-w-0 flex-1">
                <span class="block text-[0.68rem] font-semibold uppercase tracking-[0.15em] text-slate-500">Shop or product</span>
                <input
                  v-model="pendingSearch"
                  type="text"
                  placeholder="Business cards, banners, Print Hub Westlands"
                  class="mt-1 w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                >
              </div>
            </label>

            <label class="group flex min-h-16 items-center gap-3 rounded-[1.35rem] border border-white/8 bg-[#0e1727]/92 px-4 transition-colors focus-within:border-flamingo-400/55">
              <UIcon name="i-lucide-package-2" class="h-5 w-5 text-slate-400 transition-colors group-focus-within:text-flamingo-400" />
              <div class="min-w-0 flex-1">
                <span class="block text-[0.68rem] font-semibold uppercase tracking-[0.15em] text-slate-500">Product type</span>
                <select v-model="pendingCategory" class="mt-1 w-full bg-transparent text-sm text-white outline-none">
                  <option v-for="option in categoryOptions" :key="option.value" :value="option.value" class="bg-slate-950 text-white">
                    {{ option.label }}
                  </option>
                </select>
              </div>
            </label>

            <label class="group flex min-h-16 items-center gap-3 rounded-[1.35rem] border border-white/8 bg-[#0e1727]/92 px-4 transition-colors focus-within:border-flamingo-400/55">
              <UIcon name="i-lucide-map-pinned" class="h-5 w-5 text-slate-400 transition-colors group-focus-within:text-flamingo-400" />
              <div class="min-w-0 flex-1">
                <span class="block text-[0.68rem] font-semibold uppercase tracking-[0.15em] text-slate-500">Location</span>
                <select v-model="pendingLocation" class="mt-1 w-full bg-transparent text-sm text-white outline-none">
                  <option v-for="option in locationOptions" :key="option.value" :value="option.value" class="bg-slate-950 text-white">
                    {{ option.label }}
                  </option>
                </select>
              </div>
            </label>

            <button
              type="submit"
              class="inline-flex min-h-16 items-center justify-center rounded-[1.35rem] bg-flamingo-500 px-6 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(247,91,28,0.24)] transition-all hover:bg-flamingo-400 hover:shadow-[0_20px_48px_rgba(247,91,28,0.32)]"
            >
              Find shops
            </button>
          </div>

          <div class="mt-3 flex flex-wrap items-center gap-2.5">
            <button
              v-if="canUseGeolocation"
              type="button"
              class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3.5 py-2 text-xs font-medium text-slate-200 transition-colors hover:border-flamingo-400/40 hover:text-white"
              @click="useMyLocation"
            >
              <UIcon name="i-lucide-navigation" class="h-3.5 w-3.5" />
              Use my location
            </button>

            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-medium transition-colors"
              :class="verifiedOnly ? 'border-flamingo-400/45 bg-flamingo-500/12 text-flamingo-100' : 'border-white/10 bg-white/[0.05] text-slate-300 hover:border-flamingo-400/35 hover:text-white'"
              @click="verifiedOnly = !verifiedOnly"
            >
              <span class="h-2 w-2 rounded-full" :class="verifiedOnly ? 'bg-flamingo-400' : 'bg-slate-500'" />
              Verified only
            </button>

            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-medium transition-colors"
              :class="configurableOnly ? 'border-flamingo-400/45 bg-flamingo-500/12 text-flamingo-100' : 'border-white/10 bg-white/[0.05] text-slate-300 hover:border-flamingo-400/35 hover:text-white'"
              @click="configurableOnly = !configurableOnly"
            >
              <span class="h-2 w-2 rounded-full" :class="configurableOnly ? 'bg-flamingo-400' : 'bg-slate-500'" />
              Configurable quotes only
            </button>

            <p class="ml-auto text-xs font-medium text-slate-400">
              {{ filteredShops.length }} shop{{ filteredShops.length === 1 ? '' : 's' }} ready to explore
            </p>
          </div>
        </form>

        <div class="relative mt-6 overflow-hidden rounded-[2.25rem] border border-white/10 bg-[#0d1625] shadow-[0_30px_80px_rgba(0,0,0,0.28)]">
          <div
            v-if="!enableMap"
            class="flex h-[26rem] w-full items-center justify-center px-6 text-center sm:h-[32rem] lg:h-[38rem]"
          >
            <div class="w-full max-w-lg">
              <CommonMapFeatureFallback />
            </div>
          </div>
          <div v-else ref="mapRef" class="h-[26rem] w-full sm:h-[32rem] lg:h-[38rem]" />

          <div v-if="enableMap && selectedShop" class="pointer-events-none absolute inset-x-4 bottom-4 flex justify-start">
            <article class="pointer-events-auto w-full max-w-md rounded-[1.5rem] border border-white/10 bg-slate-950/92 p-4 shadow-[0_26px_60px_rgba(0,0,0,0.38)] backdrop-blur-xl">
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <p class="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-flamingo-400/90">
                    {{ selectedShop.google_place_id ? 'Google-linked shop' : 'Mapped print shop' }}
                  </p>
                  <h3 class="mt-1 truncate text-lg font-bold text-white">{{ selectedShop.name }}</h3>
                  <p class="mt-2 line-clamp-2 text-sm leading-6 text-slate-300">
                    {{ selectedShop.descriptionText }}
                  </p>
                </div>
                <span
                  class="mt-1 inline-flex h-3.5 w-3.5 shrink-0 rounded-full"
                  :class="selectedShop.google_place_id ? 'bg-flamingo-500 shadow-[0_0_0_6px_rgba(247,91,28,0.18),0_0_18px_rgba(247,91,28,0.4)]' : 'bg-slate-400 shadow-[0_0_0_5px_rgba(148,163,184,0.14)]'"
                />
              </div>

              <div class="mt-4 flex flex-wrap gap-2">
                <span
                  v-for="tag in selectedShop.tags.slice(0, 3)"
                  :key="tag"
                  class="rounded-full border border-white/8 bg-white/[0.05] px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-slate-300"
                >
                  {{ tag }}
                </span>
              </div>

              <div class="mt-4 flex items-center justify-between gap-3 border-t border-white/10 pt-3">
                <div class="text-xs font-medium text-slate-400">
                  {{ selectedShop.secondaryLine }}
                </div>
                <NuxtLink
                  :to="`/shops/${selectedShop.slug}`"
                  class="inline-flex items-center justify-center rounded-xl bg-flamingo-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-flamingo-400"
                >
                  Open shop
                </NuxtLink>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Product, ShopPublic } from '~/shared/types'
import { getAllProducts } from '~/shared/api/gallery'
import { listShops } from '~/services/public'
import { useGoogleMaps } from '~/composables/useGoogleMaps'

type DiscoveryShop = ShopPublic & {
  tags: string[]
  searchText: string
  descriptionText: string
  secondaryLine: string
  categories: string[]
  hasConfigurableQuotes: boolean
}

const mapRef = ref<HTMLDivElement | null>(null)
const { enableMap } = useMapFeature()
const searchQuery = ref('')
const categoryFilter = ref('all')
const locationFilter = ref('all')
const pendingSearch = ref('')
const pendingCategory = ref('all')
const pendingLocation = ref('all')
const verifiedOnly = ref(false)
const configurableOnly = ref(false)
const selectedShopId = ref<number | null>(null)
const shops = ref<ShopPublic[]>([])
const products = ref<Product[]>([])

const canUseGeolocation = computed(() => enableMap.value && typeof navigator !== 'undefined' && 'geolocation' in navigator)

const productsByShop = computed<Record<string, Product[]>>(() => {
  return products.value.reduce<Record<string, Product[]>>((acc, product) => {
    const slug = product.shop?.slug
    if (!slug) return acc
    acc[slug] ||= []
    acc[slug].push(product)
    return acc
  }, {})
})

const discoveryShops = computed<DiscoveryShop[]>(() => {
  return shops.value
    .filter((shop) => typeof shop.latitude === 'number' && typeof shop.longitude === 'number')
    .map((shop) => {
      const shopProducts = productsByShop.value[shop.slug] ?? []
      const categories = [...new Set(shopProducts.map((product) => productCategory(product)).filter(Boolean))]
      const tags = buildTags(shopProducts)
      const locationLabel = [shop.city, shop.state].filter(Boolean).join(', ')

      return {
        ...shop,
        tags,
        categories,
        hasConfigurableQuotes: shopProducts.length > 0,
        descriptionText: shop.description?.trim() || fallbackDescription(shopProducts),
        secondaryLine: locationLabel || 'Print shop',
        searchText: [
          shop.name,
          shop.slug,
          shop.description ?? '',
          locationLabel,
          ...shopProducts.map((product) => `${product.name} ${productCategory(product)} ${product.pricing_mode}`),
          ...categories,
          ...tags,
        ].join(' ').toLowerCase(),
      }
    })
})

const categoryOptions = computed(() => {
  const categories = new Set<string>()
  for (const shop of discoveryShops.value) {
    for (const category of shop.categories) categories.add(category)
  }
  return [
    { value: 'all', label: 'All products' },
    ...[...categories].sort((a, b) => a.localeCompare(b)).map((category) => ({ value: category, label: category })),
  ]
})

const locationOptions = computed(() => {
  const locations = new Set<string>()
  for (const shop of discoveryShops.value) {
    const label = [shop.city, shop.state].filter(Boolean).join(', ')
    if (label) locations.add(label)
  }
  return [
    { value: 'all', label: 'All locations' },
    ...[...locations].sort((a, b) => a.localeCompare(b)).map((location) => ({ value: location, label: location })),
  ]
})

const filteredShops = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  return discoveryShops.value.filter((shop) => {
    const matchesSearch = !query || shop.searchText.includes(query)
    const matchesCategory = categoryFilter.value === 'all' || shop.categories.includes(categoryFilter.value)
    const locationLabel = [shop.city, shop.state].filter(Boolean).join(', ')
    const matchesLocation = locationFilter.value === 'all' || locationLabel === locationFilter.value
    const matchesVerified = !verifiedOnly.value || Boolean(shop.google_place_id)
    const matchesConfigurable = !configurableOnly.value || shop.hasConfigurableQuotes
    return matchesSearch && matchesCategory && matchesLocation && matchesVerified && matchesConfigurable
  })
})

const selectedShop = computed(() => {
  const current = filteredShops.value.find((shop) => shop.id === selectedShopId.value)
  return current ?? filteredShops.value[0] ?? null
})

let map: any = null
let googleRef: any = null
const markers = new Map<number, any>()

function productCategory(product: Product) {
  const category = product.category
  if (typeof category === 'string') return category
  if (category && typeof category === 'object') {
    const namedCategory = category as { name?: unknown }
    if (typeof namedCategory.name === 'string') {
      return namedCategory.name
    }
  }
  return ''
}

function buildTags(shopProducts: Product[]) {
  const tags: string[] = []
  for (const product of shopProducts) {
    const category = productCategory(product)
    if (category) tags.push(category)
    if (product.pricing_mode === 'LARGE_FORMAT') tags.push('Large format')
    if (product.pricing_mode === 'SHEET') tags.push('Digital print')
    if (tags.length >= 6) break
  }
  return [...new Set(tags)].slice(0, 4)
}

function fallbackDescription(shopProducts: Product[]) {
  if (!shopProducts.length) return 'Browse this shop for real print work, quick comparisons, and direct quote follow-up.'
  const names = shopProducts.slice(0, 2).map((product) => product.name).join(', ')
  return `Strong fit for ${names}${shopProducts.length > 2 ? ' and other configured jobs' : ''}.`
}

function createMarkerContent(shop: DiscoveryShop) {
  const marker = document.createElement('button')
  marker.type = 'button'
  marker.className = `printy-home-marker ${shop.google_place_id ? 'printy-home-marker--google' : 'printy-home-marker--default'}`
  marker.innerHTML = '<span class="printy-home-marker__core"></span>'
  marker.setAttribute('aria-label', shop.name)
  marker.addEventListener('click', () => {
    selectedShopId.value = shop.id
  })
  return marker
}

function fitMapToShops() {
  if (!map || !googleRef || !filteredShops.value.length) return
  if (filteredShops.value.length === 1) {
    const shop = filteredShops.value[0]
    if (!shop) return
    map.setCenter({ lat: Number(shop.latitude), lng: Number(shop.longitude) })
    map.setZoom(14)
    return
  }

  const bounds = new googleRef.maps.LatLngBounds()
  for (const shop of filteredShops.value) {
    bounds.extend({ lat: Number(shop.latitude), lng: Number(shop.longitude) })
  }
  map.fitBounds(bounds, 88)
}

async function renderMarkers() {
  if (!enableMap.value || !map) return

  for (const marker of markers.values()) {
    marker.map = null
  }
  markers.clear()

  const { markerLibrary } = await useGoogleMaps().importLibraries()

  for (const shop of filteredShops.value) {
    const marker = new markerLibrary.AdvancedMarkerElement({
      map,
      position: { lat: Number(shop.latitude), lng: Number(shop.longitude) },
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

function applyFilters() {
  searchQuery.value = pendingSearch.value
  categoryFilter.value = pendingCategory.value
  locationFilter.value = pendingLocation.value

  if (filteredShops.value[0]) {
    selectedShopId.value = filteredShops.value[0].id
  }
}

function useMyLocation() {
  if (!enableMap.value || !canUseGeolocation.value) return
  navigator.geolocation.getCurrentPosition((position) => {
    if (!map) return
    const center = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    }
    map.setCenter(center)
    map.setZoom(12)
  })
}

onMounted(async () => {
  const [shopList, productList] = await Promise.all([
    listShops(),
    getAllProducts(),
  ])

  shops.value = shopList
  products.value = productList

  if (!mapRef.value || !discoveryShops.value.length) return

  pendingSearch.value = searchQuery.value
  pendingCategory.value = categoryFilter.value
  pendingLocation.value = locationFilter.value

  if (filteredShops.value[0]) {
    selectedShopId.value = filteredShops.value[0].id
  }

  if (!enableMap.value) return

  const { google, mapsLibrary } = await useGoogleMaps().importLibraries()
  const firstShop = discoveryShops.value[0]
  if (!firstShop) return

  googleRef = google
  map = new mapsLibrary.Map(mapRef.value, {
    center: {
      lat: Number(firstShop.latitude),
      lng: Number(firstShop.longitude),
    },
    zoom: 11,
    mapId: 'DEMO_MAP_ID',
    disableDefaultUI: true,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
  })
  await renderMarkers()
})

watch(filteredShops, async () => {
  if (!map) return
  if (!selectedShop.value && filteredShops.value[0]) {
    selectedShopId.value = filteredShops.value[0].id
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
.printy-home-marker {
  width: 24px;
  height: 24px;
  display: grid;
  place-items: center;
  border: 0;
  padding: 0;
  background: transparent;
  cursor: pointer;
}

.printy-home-marker__core {
  display: block;
  width: 14px;
  height: 14px;
  border-radius: 9999px;
  border: 2px solid rgb(255 255 255);
}

.printy-home-marker--google .printy-home-marker__core {
  background: rgb(247 91 28);
  box-shadow:
    0 0 0 6px rgb(247 91 28 / 0.18),
    0 0 18px rgb(247 91 28 / 0.45),
    0 0 30px rgb(247 91 28 / 0.28);
}

.printy-home-marker--default .printy-home-marker__core {
  background: rgb(148 163 184);
  box-shadow:
    0 0 0 5px rgb(148 163 184 / 0.14),
    0 0 16px rgb(15 23 42 / 0.14);
}
</style>
