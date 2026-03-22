<template>
  <div class="min-h-screen bg-[var(--p-bg)]">
    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 sm:py-16">
      <nav class="mb-8 flex items-center gap-2 text-sm text-[var(--p-text-muted)]">
        <NuxtLink to="/" class="hover:text-[var(--p-text)]">Home</NuxtLink>
        <UIcon name="i-lucide-chevron-right" class="h-4 w-4 shrink-0" />
        <span class="text-[var(--p-text)]">Locations</span>
      </nav>

      <div class="grid gap-10 xl:grid-cols-[minmax(0,1.05fr)_24rem]">
        <section class="min-w-0">
          <div class="max-w-3xl">
            <span class="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-flamingo-500">
              Print regions
            </span>
            <h1 class="mt-4 text-3xl font-bold text-[var(--p-text)] sm:text-5xl">
              Print shops by location
            </h1>
            <p class="mt-4 text-lg leading-8 text-[var(--p-text-muted)]">
              Compare the busiest print regions across Kenya, see how many vendors are active in each market, and jump straight into the area that fits your job.
            </p>
          </div>

          <CommonLoadingSpinner v-if="loading" />

          <div v-else-if="locationCards.length" class="mt-12 grid gap-4 sm:grid-cols-2">
            <NuxtLink
              v-for="loc in locationCards"
              :key="loc.slug"
              :to="`/locations/${loc.slug}`"
              class="group rounded-[1.75rem] border border-[var(--p-border)] bg-[var(--p-surface)] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-flamingo-200 hover:shadow-[0_20px_45px_rgba(16,24,40,0.08)] dark:hover:border-flamingo-800/50"
              @mouseenter="selectedLocationSlug = loc.slug"
              @focus="selectedLocationSlug = loc.slug"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex items-start gap-4">
                  <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-flamingo-500/12">
                    <UIcon name="i-lucide-map-pinned" class="h-7 w-7 text-flamingo-500" />
                  </div>
                  <div class="min-w-0">
                    <h2 class="text-2xl font-bold text-[var(--p-text)]">{{ loc.name }}</h2>
                    <p class="mt-1 text-sm font-medium text-flamingo-500">{{ loc.subtitle }}</p>
                  </div>
                </div>
                <UIcon name="i-lucide-arrow-up-right" class="h-5 w-5 shrink-0 text-[var(--p-text-muted)] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-flamingo-500" />
              </div>

              <div class="mt-8 grid grid-cols-2 gap-3">
                <div class="rounded-2xl bg-[var(--p-surface-sunken)] p-4">
                  <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--p-text-muted)]">Coverage</p>
                  <p class="mt-2 text-base font-semibold text-[var(--p-text)]">{{ loc.areaLabel }}</p>
                </div>
                <div class="rounded-2xl bg-[var(--p-surface-sunken)] p-4">
                  <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--p-text-muted)]">Mapped shops</p>
                  <p class="mt-2 text-base font-semibold text-[var(--p-text)]">{{ loc.mappedShopsLabel }}</p>
                </div>
              </div>

              <div class="mt-8 flex items-end justify-between border-t border-[var(--p-border)] pt-4">
                <div>
                  <p class="text-3xl font-extrabold text-flamingo-500">{{ loc.printerCount }}</p>
                  <p class="mt-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--p-text-muted)]">
                    Printer{{ loc.printerCount === 1 ? '' : 's' }}
                  </p>
                </div>
                <span class="inline-flex items-center gap-2 rounded-full bg-flamingo-500/12 px-3 py-1.5 text-xs font-semibold text-flamingo-500">
                  Explore area
                  <UIcon name="i-lucide-chevron-right" class="h-4 w-4" />
                </span>
              </div>
            </NuxtLink>
          </div>

          <div v-else class="mt-12 rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-12 text-center">
            <UIcon name="i-lucide-map-pin" class="mx-auto h-16 w-16 text-[var(--p-border)]" />
            <h2 class="mt-4 text-lg font-medium text-[var(--p-text)]">No locations yet</h2>
            <p class="mt-2 text-sm text-[var(--p-text-muted)]">Check back soon for location-based print shop listings.</p>
            <NuxtLink to="/shops" class="btn-primary mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold">
              Browse all shops
              <UIcon name="i-lucide-arrow-right" class="h-4 w-4" />
            </NuxtLink>
          </div>

          <div class="mt-12 flex flex-wrap gap-4">
            <NuxtLink to="/shops" class="btn-primary inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold">
              All shops
              <UIcon name="i-lucide-chevron-right" class="h-4 w-4" />
            </NuxtLink>
            <NuxtLink to="/products" class="inline-flex items-center gap-2 rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] px-6 py-3.5 text-sm font-semibold text-[var(--p-text)] hover:bg-[var(--p-surface-sunken)]">
              Browse products
            </NuxtLink>
          </div>
        </section>

        <aside class="xl:sticky xl:top-24 xl:self-start">
          <div class="overflow-hidden rounded-[2rem] border border-mirage-800/60 bg-mirage-950 text-white shadow-[0_24px_60px_rgba(16,24,40,0.24)]">
            <div class="border-b border-white/10 p-6">
              <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Coverage map</p>
              <template v-if="activeLocation">
                <h2 class="mt-3 text-2xl font-bold">{{ activeLocation.name }}</h2>
                <p class="mt-2 text-sm leading-6 text-slate-300">
                  {{ activeLocation.printerCount }} printer{{ activeLocation.printerCount === 1 ? '' : 's' }} active in {{ activeLocation.name }}. Review regional shop presence before you open the area page.
                </p>
              </template>
              <template v-else>
                <p class="mt-3 text-sm leading-6 text-slate-300">Select a location to preview its regional map coverage.</p>
              </template>
            </div>

            <div v-if="activeLocation" class="p-4">
              <div class="overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-900">
                <iframe
                  :key="activeLocation.slug"
                  :src="activeLocation.mapEmbedUrl"
                  title="Google map of print shop locations"
                  class="h-[22rem] w-full border-0"
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                  allowfullscreen
                />
              </div>

              <div class="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                <div class="flex items-center justify-between gap-3">
                  <div>
                    <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Regional note</p>
                    <p class="mt-1 text-sm font-medium text-white">{{ activeLocation.subtitle }}</p>
                  </div>
                  <span class="inline-flex rounded-full bg-flamingo-500/12 px-3 py-1 text-xs font-semibold text-flamingo-400">
                    {{ activeLocation.mappedShopsLabel }}
                  </span>
                </div>
                <p class="mt-3 text-sm leading-6 text-slate-300">
                  {{ activeLocation.mapNarrative }}
                </p>
              </div>

              <NuxtLink
                :to="`/locations/${activeLocation.slug}`"
                class="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-flamingo-500 px-5 py-3.5 text-sm font-bold text-white transition-colors hover:bg-flamingo-400"
              >
                Open {{ activeLocation.name }}
                <UIcon name="i-lucide-arrow-right" class="h-4 w-4" />
              </NuxtLink>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { fetchSEOLocationDetail, fetchSEOLocations } from '~/services/seo'
import { listShops } from '~/services/public'
import type { SEOLocation, SEOLocationDetail } from '~/services/seo'
import type { ShopPublic } from '~/shared/types'

definePageMeta({ layout: 'default' })

type PublicShopGeo = ShopPublic & {
  city?: string | null
  state?: string | null
  address_line?: string | null
  latitude?: number | string | null
  longitude?: number | string | null
}

type LocationCard = SEOLocation & {
  printerCount: number
  subtitle: string
  areaLabel: string
  mappedShopsLabel: string
  mapEmbedUrl: string
  mapNarrative: string
}

const locations = ref<SEOLocation[]>([])
const locationDetails = ref<Record<string, SEOLocationDetail | null>>({})
const publicShops = ref<PublicShopGeo[]>([])
const selectedLocationSlug = ref('')
const loading = ref(true)

const locationMeta: Record<string, { subtitle: string; areaLabel: string }> = {
  nairobi: { subtitle: 'Capital Region Hub', areaLabel: 'Corporate and high-volume demand' },
  westlands: { subtitle: 'Commercial District Cluster', areaLabel: 'Agency, branding, and premium runs' },
  kilimani: { subtitle: 'Creative Studio Corridor', areaLabel: 'Events, menus, and short-run design work' },
  cbd: { subtitle: 'Central Business Core', areaLabel: 'Walk-in business stationery and express jobs' },
  'industrial-area': { subtitle: 'Heavy Production Zone', areaLabel: 'Packaging, bulk print, and large format' },
  mombasa: { subtitle: 'Coastal Logistics', areaLabel: 'Hospitality, tourism, and regional fulfillment' },
  kisumu: { subtitle: 'Lakeside Trade Center', areaLabel: 'Retail, institutions, and regional print demand' },
}

const locationCards = computed<LocationCard[]>(() => {
  return locations.value.map((loc) => {
    const detail = locationDetails.value[loc.slug]
    const mappedShops = shopsForLocation(loc.slug, detail)
    const meta = locationMeta[loc.slug] ?? {
      subtitle: locationSubtitle(loc),
      areaLabel: loc.location_type === 'city' ? 'City-wide print coverage' : 'Local neighborhood coverage',
    }
    const printerCount = detail?.shops?.length ?? mappedShops.length
    const mapQuery = mappedShops.length
      ? `${loc.name} Kenya print shops ${mappedShops.slice(0, 4).map((shop) => shop.name).join(' ')}`
      : `${loc.name} Kenya print shops`

    return {
      ...loc,
      printerCount,
      subtitle: meta.subtitle,
      areaLabel: meta.areaLabel,
      mappedShopsLabel: mappedShops.length ? `${mappedShops.length} on map` : 'Area preview',
      mapEmbedUrl: `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=12&output=embed`,
      mapNarrative: mappedShops.length
        ? `Google Maps is centered on ${loc.name} using live shop matches from this region. Open the location page to browse each vendor in detail.`
        : `Google Maps is centered on ${loc.name} so customers can inspect the area even when individual shop coordinates are not yet available in the listing feed.`,
    }
  })
})

const activeLocation = computed(() => {
  return locationCards.value.find((loc) => loc.slug === selectedLocationSlug.value) ?? locationCards.value[0] ?? null
})

function normalize(value?: string | null) {
  return (value ?? '').trim().toLowerCase().replace(/\s+/g, ' ')
}

function locationSubtitle(loc: SEOLocation) {
  const typeLabel = loc.location_type?.replace(/_/g, ' ') ?? 'print region'
  return `${typeLabel.charAt(0).toUpperCase()}${typeLabel.slice(1)} print cluster`
}

function shopsForLocation(slug: string, detail?: SEOLocationDetail | null) {
  if (!detail?.shops?.length) return [] as PublicShopGeo[]

  const slugs = new Set(detail.shops.map((shop) => shop.slug))
  return publicShops.value.filter((shop) => {
    if (slugs.has(shop.slug)) return true

    const locationName = normalize(detail.name)
    const city = normalize(shop.city)
    const state = normalize(shop.state)
    return city === locationName || state === locationName || normalize(shop.address_line).includes(locationName)
  })
}

async function load() {
  loading.value = true
  try {
    const [allLocations, shops] = await Promise.all([
      fetchSEOLocations(),
      listShops(),
    ])

    locations.value = allLocations
    publicShops.value = shops as PublicShopGeo[]

    const detailEntries = await Promise.all(
      allLocations.map(async (location) => [location.slug, await fetchSEOLocationDetail(location.slug)] as const)
    )

    locationDetails.value = Object.fromEntries(detailEntries)
    selectedLocationSlug.value = allLocations[0]?.slug ?? ''
  } catch {
    locations.value = []
    locationDetails.value = {}
    publicShops.value = []
    selectedLocationSlug.value = ''
  } finally {
    loading.value = false
  }
}

onMounted(load)

usePrintySeo({
  title: 'Print Shops by Location',
  description: 'Find print shops near you. Browse by city or neighborhood for business cards, flyers, posters, and more.',
  path: '/locations',
  breadcrumbs: [
    { name: 'Home', path: '/' },
    { name: 'Locations', path: '/locations' },
  ],
})
</script>
