<template>
  <div class="min-h-screen bg-[var(--p-bg)]">
    <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <!-- Breadcrumb nav -->
      <nav class="mb-8 flex flex-wrap items-center gap-2 text-sm text-[var(--p-text-muted)]">
        <NuxtLink to="/" class="hover:text-[var(--p-text)]">Home</NuxtLink>
        <UIcon name="i-lucide-chevron-right" class="h-4 w-4 shrink-0" />
        <NuxtLink to="/shops" class="hover:text-[var(--p-text)]">Shops</NuxtLink>
        <UIcon name="i-lucide-chevron-right" class="h-4 w-4 shrink-0" />
        <span class="text-[var(--p-text)]">{{ location?.name }}</span>
      </nav>

      <CommonLoadingSpinner v-if="loading" />
      <CommonEmptyState
        v-else-if="!location"
        title="Location not found"
        description="This location does not exist or is no longer active."
        icon="i-lucide-map-pin"
      >
        <NuxtLink to="/shops" class="btn-primary mt-4 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold">
          Browse all shops
          <UIcon name="i-lucide-arrow-right" class="h-4 w-4" />
        </NuxtLink>
      </CommonEmptyState>

      <template v-else>
        <!-- H1 & intro -->
        <header>
          <h1 class="text-3xl font-bold text-[var(--p-text)] sm:text-4xl">
            Print shops in {{ location.name }}
          </h1>
          <div class="mt-4 space-y-3 text-lg text-[var(--p-text-muted)]">
            <p v-if="location.description" class="leading-relaxed">
              {{ location.description }}
            </p>
            <p class="leading-relaxed">
              Find trusted print shops in {{ location.name }}{{ location.city ? `, ${location.city}` : '' }}. Compare prices for business cards, flyers, posters, and more. Get instant quotes, customize paper and finishing, and request formal quotes—all in one place.
            </p>
          </div>
        </header>

        <!-- Shops -->
        <section class="mt-12">
          <h2 class="text-xl font-semibold text-[var(--p-text)]">
            Print shops in {{ location.name }}
          </h2>
          <p class="mt-1 text-sm text-[var(--p-text-muted)]">
            {{ location.shops?.length ?? 0 }} shop{{ (location.shops?.length ?? 0) === 1 ? '' : 's' }} available
          </p>
          <div v-if="location.shops?.length" class="mt-6 grid gap-4 sm:grid-cols-2">
            <NuxtLink
              v-for="shop in location.shops"
              :key="shop.slug"
              :to="`/shops/${shop.slug}`"
              class="flex items-center gap-4 rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 hover:border-flamingo-200 dark:hover:border-flamingo-800/50 transition-all"
            >
              <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/40">
                <UIcon name="i-lucide-store" class="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div class="min-w-0 flex-1">
                <h3 class="font-semibold text-[var(--p-text)]">{{ shop.name }}</h3>
                <p class="text-sm text-[var(--p-text-muted)]">View catalog & get quote</p>
              </div>
              <UIcon name="i-lucide-arrow-right" class="h-5 w-5 shrink-0 text-[var(--p-text-muted)]" />
            </NuxtLink>
          </div>
          <div v-else class="mt-6 rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-12 text-center">
            <UIcon name="i-lucide-store" class="mx-auto h-16 w-16 text-[var(--p-border)]" />
            <h3 class="mt-4 text-lg font-medium text-[var(--p-text)]">No shops yet</h3>
            <p class="mt-2 text-sm text-[var(--p-text-muted)]">Check back soon for print shops in {{ location.name }}.</p>
            <NuxtLink to="/shops" class="btn-primary mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold">
              Browse all shops
              <UIcon name="i-lucide-arrow-right" class="h-4 w-4" />
            </NuxtLink>
          </div>
        </section>

        <!-- Related products -->
        <section v-if="productsInLocation.length" class="mt-16">
          <h2 class="text-xl font-semibold text-[var(--p-text)]">
            Popular products in {{ location.name }}
          </h2>
          <p class="mt-1 text-sm text-[var(--p-text-muted)]">
            Shops in this area offer these product types. Click to see which shops and get quotes.
          </p>
          <div class="mt-6 flex flex-wrap gap-3">
            <NuxtLink
              v-for="product in productsInLocation"
              :key="product.slug"
              :to="`/locations/${slug}/products/${product.slug}`"
              class="inline-flex items-center gap-2 rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] px-4 py-3 text-sm font-medium text-[var(--p-text)] hover:border-flamingo-200 dark:hover:border-flamingo-800/50 hover:bg-[var(--p-surface-sunken)] transition-all"
            >
              <UIcon name="i-lucide-package" class="h-4 w-4 text-flamingo-500" />
              {{ product.name }}
            </NuxtLink>
          </div>
        </section>

        <!-- Nearby locations -->
        <section v-if="nearbyLocations.length" class="mt-16">
          <h2 class="text-xl font-semibold text-[var(--p-text)]">
            Other locations
          </h2>
          <p class="mt-1 text-sm text-[var(--p-text-muted)]">
            Find print shops in nearby areas
          </p>
          <div class="mt-6 flex flex-wrap gap-3">
            <NuxtLink
              v-for="loc in nearbyLocations"
              :key="loc.slug"
              :to="`/locations/${loc.slug}`"
              class="inline-flex items-center gap-2 rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] px-4 py-3 text-sm font-medium text-[var(--p-text)] hover:border-flamingo-200 dark:hover:border-flamingo-800/50 hover:bg-[var(--p-surface-sunken)] transition-all"
            >
              <UIcon name="i-lucide-map-pin" class="h-4 w-4 text-flamingo-500" />
              {{ loc.name }}
            </NuxtLink>
          </div>
        </section>

        <!-- FAQ -->
        <section class="mt-16">
          <LocationsLocationFaq
            :location-name="location.name"
            :shop-count="location.shops?.length ?? 0"
          />
        </section>

        <!-- CTA -->
        <div class="mt-12 flex flex-wrap gap-4">
          <NuxtLink to="/gallery" class="btn-primary inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold">
            Browse products
            <UIcon name="i-lucide-chevron-right" class="h-4 w-4" />
          </NuxtLink>
          <NuxtLink to="/shops" class="inline-flex items-center gap-2 rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] px-6 py-3.5 text-sm font-semibold text-[var(--p-text)] hover:bg-[var(--p-surface-sunken)]">
            All shops
          </NuxtLink>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { fetchSEOLocationDetail, fetchSEOLocationProducts, fetchSEOLocations } from '~/services/seo'
import type { SEOLocationDetail } from '~/services/seo'
import type { SEOLocation } from '~/services/seo'

definePageMeta({ layout: 'default' })

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const location = ref<SEOLocationDetail | null>(null)
const productsInLocation = ref<{ slug: string; name: string }[]>([])
const nearbyLocations = ref<SEOLocation[]>([])
const loading = ref(true)

async function load() {
  loading.value = true
  try {
    const [detail, products, allLocations] = await Promise.all([
      fetchSEOLocationDetail(slug.value),
      fetchSEOLocationProducts(slug.value),
      fetchSEOLocations(),
    ])
    location.value = detail
    productsInLocation.value = products
    nearbyLocations.value = (allLocations ?? []).filter((l) => l.slug !== slug.value).slice(0, 8)
  } catch {
    location.value = null
    productsInLocation.value = []
    nearbyLocations.value = []
  } finally {
    loading.value = false
  }
}

onMounted(load)
watch(slug, load)

const faqSchema = computed(() => {
  if (!location.value) return undefined
  const name = location.value.name
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `How do I get a printing quote in ${name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Browse our list of print shops in ${name}, pick a shop, and add products to your quote. You can customize paper, quantity, and finishing options. Most shops provide instant pricing for standard items like business cards and flyers.`,
        },
      },
      {
        '@type': 'Question',
        name: 'What can I print?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Print shops in ${name} typically offer business cards, flyers, posters, brochures, stickers, and more. Each shop has its own catalog—browse their products to see available sizes, paper stocks, and finishing options.`,
        },
      },
      {
        '@type': 'Question',
        name: 'How long does printing take?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Turnaround varies by shop and product. Simple jobs like business cards can often be ready in 1–3 days. Larger orders or custom work may take longer. Contact the shop directly for specific timelines.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I compare prices between shops?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Add the same or similar products from different shops to get quotes. Printy shows you pricing as you customize, so you can compare before requesting a formal quote.',
        },
      },
    ],
  }
})

usePrintySeo(() => ({
  title: location.value ? `Print Shops in ${location.value.name}` : 'Location',
  description: location.value
    ? `Find print shops in ${location.value.name}. Compare business cards, flyers, posters, and get quotes.`
    : 'Print shops by location',
  path: `/locations/${slug.value}`,
  noIndex: !loading.value && !location.value,
  breadcrumbs: [
    { name: 'Home', path: '/' },
    { name: 'Shops', path: '/shops' },
    { name: location.value?.name ?? slug.value, path: `/locations/${slug.value}` },
  ],
  schema: location.value && faqSchema.value ? [faqSchema.value] : undefined,
}))
</script>
