<template>
  <div class="min-h-screen bg-[var(--p-bg)]">
    <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <nav class="mb-8 flex flex-wrap items-center gap-2 text-sm text-[var(--p-text-muted)]">
        <NuxtLink to="/" class="hover:text-[var(--p-text)]">Home</NuxtLink>
        <UIcon name="i-lucide-chevron-right" class="h-4 w-4" />
        <NuxtLink :to="`/locations/${locationSlug}`" class="hover:text-[var(--p-text)]">{{ data?.location?.name ?? locationSlug }}</NuxtLink>
        <UIcon name="i-lucide-chevron-right" class="h-4 w-4" />
        <NuxtLink :to="`/products/${productSlug}`" class="hover:text-[var(--p-text)]">{{ data?.category?.name ?? productSlug }}</NuxtLink>
      </nav>

      <CommonLoadingSpinner v-if="loading" />
      <CommonEmptyState
        v-else-if="!data"
        title="Page not found"
        description="This location or product combination does not exist."
        icon="i-lucide-file-question"
      />
      <template v-else>
        <h1 class="text-3xl font-bold text-[var(--p-text)] sm:text-4xl">
          {{ data.category.name }} in {{ data.location.name }}
        </h1>
        <p class="mt-4 text-lg text-[var(--p-text-muted)]">
          Find {{ data.category.name.toLowerCase() }} printing in {{ data.location.name }}. Compare shops and get instant quotes.
        </p>

        <div v-if="data.shops?.length" class="mt-12 grid gap-4 sm:grid-cols-2">
          <NuxtLink
            v-for="shop in data.shops"
            :key="shop.slug"
            :to="`/shops/${shop.slug}`"
            class="flex items-center gap-4 rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 hover:border-flamingo-200 dark:hover:border-flamingo-800/50 transition-all"
          >
            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/40">
              <UIcon name="i-lucide-store" class="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div class="min-w-0">
              <h2 class="font-semibold text-[var(--p-text)]">{{ shop.name }}</h2>
              <p class="text-sm text-[var(--p-text-muted)]">{{ data.category.name }} — View & quote</p>
            </div>
            <UIcon name="i-lucide-arrow-right" class="ml-auto h-5 w-5 text-[var(--p-text-muted)]" />
          </NuxtLink>
        </div>
        <div v-else class="mt-12 rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-12 text-center">
          <UIcon name="i-lucide-package" class="mx-auto h-16 w-16 text-[var(--p-border)]" />
          <h2 class="mt-4 text-lg font-medium text-[var(--p-text)]">No shops yet</h2>
          <p class="mt-2 text-sm text-[var(--p-text-muted)]">
            No shops in {{ data.location.name }} offer {{ data.category.name.toLowerCase() }} yet.
          </p>
          <div class="mt-6 flex flex-wrap justify-center gap-4">
            <NuxtLink :to="`/locations/${locationSlug}`" class="btn-primary inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold">
              Shops in {{ data.location.name }}
            </NuxtLink>
            <NuxtLink to="/gallery" class="inline-flex items-center gap-2 rounded-xl border border-[var(--p-border)] px-6 py-3 text-sm font-semibold">
              Browse all products
            </NuxtLink>
          </div>
        </div>

        <div class="mt-12 flex flex-wrap gap-4">
          <NuxtLink :to="`/products/${productSlug}`" class="btn-primary inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold">
            {{ data.category.name }} everywhere
            <UIcon name="i-lucide-chevron-right" class="h-4 w-4" />
          </NuxtLink>
          <NuxtLink :to="`/locations/${locationSlug}`" class="inline-flex items-center gap-2 rounded-xl border border-[var(--p-border)] px-6 py-3.5 text-sm font-semibold">
            More in {{ data.location.name }}
          </NuxtLink>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { fetchSEOLocationProduct } from '~/services/seo'
import type { SEOLocationProduct } from '~/services/seo'

definePageMeta({ layout: 'default' })

const route = useRoute()
const locationSlug = computed(() => route.params.location as string)
const productSlug = computed(() => route.params.product as string)

const data = ref<SEOLocationProduct | null>(null)
const loading = ref(true)

async function load() {
  loading.value = true
  try {
    data.value = await fetchSEOLocationProduct(locationSlug.value, productSlug.value)
  } catch {
    data.value = null
  } finally {
    loading.value = false
  }
}

onMounted(load)
watch([locationSlug, productSlug], load)


usePrintySeo(() => ({
  title: data.value
    ? `${data.value.category.name} in ${data.value.location.name}`
    : 'Print by location',
  description: data.value
    ? `Find ${data.value.category.name.toLowerCase()} printing in ${data.value.location.name}. Compare shops and get quotes.`
    : 'Print products by location',
  path: `/locations/${locationSlug.value}/products/${productSlug.value}`,
  noIndex: !loading.value && !data.value,
  breadcrumbs: [
    { name: 'Home', path: '/' },
    { name: 'Shops', path: '/shops' },
    { name: data.value?.location?.name ?? locationSlug.value, path: `/locations/${locationSlug.value}` },
    { name: data.value?.category?.name ?? productSlug.value, path: `/locations/${locationSlug.value}/products/${productSlug.value}` },
  ],
}))
</script>
