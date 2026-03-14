<template>
  <div class="min-h-screen bg-[var(--p-bg)]">
    <article class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <CommonLoadingSpinner v-if="loading" />
      <CommonEmptyState
        v-else-if="notFound"
        title="Product not found"
        description="This product category does not exist."
        icon="i-lucide-package"
      />
      <template v-else>
      <NuxtLink
        to="/gallery"
        class="inline-flex items-center gap-2 text-sm font-medium text-[var(--p-text-muted)] hover:text-[var(--p-text)] mb-8"
      >
        <UIcon name="i-lucide-arrow-left" class="w-4 h-4" />
        All products
      </NuxtLink>

      <h1 class="text-3xl font-bold text-[var(--p-text)] sm:text-4xl">
        {{ product?.title }}
      </h1>
      <p class="mt-4 text-lg text-[var(--p-text-muted)]">
        {{ product?.description }}
      </p>

      <div v-if="product?.options?.length" class="mt-12">
        <h2 class="text-xl font-semibold text-[var(--p-text)]">Options</h2>
        <ul class="mt-4 space-y-3">
          <li
            v-for="opt in product.options"
            :key="opt.title"
            class="flex items-start gap-3 rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-4"
          >
            <UIcon :name="opt.icon" class="w-5 h-5 text-flamingo-500 shrink-0 mt-0.5" />
            <div>
              <p class="font-medium text-[var(--p-text)]">{{ opt.title }}</p>
              <p class="mt-1 text-sm text-[var(--p-text-muted)]">{{ opt.detail }}</p>
            </div>
          </li>
        </ul>
      </div>

      <div class="mt-12 flex flex-wrap gap-4">
        <NuxtLink
          to="/gallery"
          class="btn-primary inline-flex items-center justify-center rounded-xl px-6 py-3.5 text-sm font-bold shadow-md"
        >
          Get a quote
          <UIcon name="i-lucide-chevron-right" class="ml-2 w-4 h-4" />
        </NuxtLink>
        <NuxtLink
          to="/shops"
          class="inline-flex items-center justify-center rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] px-6 py-3.5 text-sm font-semibold text-[var(--p-text)] hover:bg-[var(--p-surface-sunken)]"
        >
          Browse shops
        </NuxtLink>
      </div>
      </template>
    </article>
  </div>
</template>

<script setup lang="ts">
import { fetchSEOProductDetail } from '~/services/seo'
import type { SEOProductDetail } from '~/services/seo'

definePageMeta({ layout: 'default' })

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const categoryFromApi = ref<SEOProductDetail | null>(null)
const loading = ref(true)

onMounted(async () => {
  loading.value = true
  try {
    categoryFromApi.value = await fetchSEOProductDetail(slug.value)
  } catch {
    categoryFromApi.value = null
  } finally {
    loading.value = false
  }
})

watch(slug, async (newSlug) => {
  if (newSlug) {
    loading.value = true
    try {
      categoryFromApi.value = await fetchSEOProductDetail(newSlug)
    } catch {
      categoryFromApi.value = null
    } finally {
      loading.value = false
    }
  }
})

// Static fallback for common categories when API has no data
const products: Record<string, { title: string; description: string; options: { title: string; detail: string; icon: string }[] }> = {
  'business-cards': {
    title: 'Business cards',
    description: 'Professional business cards in standard and custom sizes. Choose paper stock, finish, and quantity for instant quotes.',
    options: [
      { title: 'Size', detail: 'Standard 85×55mm or custom. Single or double-sided.', icon: 'i-lucide-ruler' },
      { title: 'Paper', detail: 'Matt, silk, or gloss. 300–400gsm for durability.', icon: 'i-lucide-file-text' },
      { title: 'Finishing', detail: 'Round corners, spot UV, embossing available.', icon: 'i-lucide-sparkles' },
      { title: 'Quantity', detail: 'From 100 to 10,000+. Better rates at higher volumes.', icon: 'i-lucide-package' },
    ],
  },
  flyers: {
    title: 'Flyers',
    description: 'Promotional flyers and handouts. A5, A6, DL, or custom sizes. Perfect for events and marketing.',
    options: [
      { title: 'Size', detail: 'A5, A6, DL, or custom. Single or double-sided.', icon: 'i-lucide-ruler' },
      { title: 'Paper', detail: '90–350gsm. Matt or gloss finish.', icon: 'i-lucide-file-text' },
      { title: 'Finishing', detail: 'Folding, perforation, or cut-to-size.', icon: 'i-lucide-scissors' },
      { title: 'Quantity', detail: 'From 100 to 50,000+. Volume discounts apply.', icon: 'i-lucide-package' },
    ],
  },
  posters: {
    title: 'Posters',
    description: 'Large format posters for events, retail, and promotions. High-quality digital or large-format printing.',
    options: [
      { title: 'Size', detail: 'A3, A2, A1, or custom. Up to 1.2m wide.', icon: 'i-lucide-ruler' },
      { title: 'Material', detail: 'Paper, photo paper, or vinyl. Indoor or outdoor.', icon: 'i-lucide-layers' },
      { title: 'Finishing', detail: 'Lamination, mounting, or framing.', icon: 'i-lucide-frame' },
      { title: 'Quantity', detail: 'Single prints or bulk. Per-sqm pricing.', icon: 'i-lucide-package' },
    ],
  },
}

const product = computed(() => {
  if (categoryFromApi.value) {
    return {
      title: categoryFromApi.value.name,
      description: categoryFromApi.value.description || products[slug.value]?.description || `Browse ${categoryFromApi.value.name} from print shops.`,
      options: products[slug.value]?.options ?? [],
    }
  }
  return products[slug.value]
})

const notFound = computed(() => !loading.value && !product.value)

const config = useRuntimeConfig()
const siteUrl = (config.public.siteUrl as string) || 'https://printy.ke'
usePrintySeo(() => ({
  title: product.value?.title ?? categoryFromApi.value?.name ?? 'Product',
  description: product.value?.description ?? categoryFromApi.value?.description ?? 'Print products',
  path: `/products/${slug.value}`,
  noIndex: notFound.value,
  breadcrumbs: [
    { name: 'Home', path: '/' },
    { name: 'Gallery', path: '/gallery' },
    { name: product.value?.title ?? categoryFromApi.value?.name ?? slug.value, path: `/products/${slug.value}` },
  ],
  schema: !notFound.value
    ? [
        {
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: product.value?.title ?? categoryFromApi.value?.name ?? slug.value,
          description: product.value?.description ?? categoryFromApi.value?.description ?? 'Printing service',
          url: `${siteUrl}/products/${slug.value}`,
          provider: {
            '@type': 'Organization',
            name: 'Printy',
            url: siteUrl,
          },
        },
      ]
    : undefined,
}))
</script>
