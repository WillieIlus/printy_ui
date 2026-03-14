<template>
  <div class="min-h-screen bg-[var(--p-bg)]">
    <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <nav class="mb-8 flex items-center gap-2 text-sm text-[var(--p-text-muted)]">
        <NuxtLink to="/" class="hover:text-[var(--p-text)]">Home</NuxtLink>
        <UIcon name="i-lucide-chevron-right" class="h-4 w-4 shrink-0" />
        <span class="text-[var(--p-text)]">Locations</span>
      </nav>

      <h1 class="text-3xl font-bold text-[var(--p-text)] sm:text-4xl">
        Print shops by location
      </h1>
      <p class="mt-4 text-lg text-[var(--p-text-muted)]">
        Find print shops near you. Browse by city or neighborhood to compare business cards, flyers, posters, and more.
      </p>

      <CommonLoadingSpinner v-if="loading" />
      <div v-else-if="locations.length" class="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <NuxtLink
          v-for="loc in locations"
          :key="loc.slug"
          :to="`/locations/${loc.slug}`"
          class="flex items-center gap-4 rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 hover:border-flamingo-200 dark:hover:border-flamingo-800/50 transition-all"
        >
          <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/40">
            <UIcon name="i-lucide-map-pin" class="h-6 w-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div class="min-w-0 flex-1">
            <h2 class="font-semibold text-[var(--p-text)]">{{ loc.name }}</h2>
            <p class="text-sm text-[var(--p-text-muted)] capitalize">{{ loc.location_type }}</p>
          </div>
          <UIcon name="i-lucide-arrow-right" class="h-5 w-5 shrink-0 text-[var(--p-text-muted)]" />
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { fetchSEOLocations } from '~/services/seo'

definePageMeta({ layout: 'default' })

const locations = ref<{ slug: string; name: string; location_type: string }[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    locations.value = await fetchSEOLocations()
  } catch {
    locations.value = []
  } finally {
    loading.value = false
  }
})

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
