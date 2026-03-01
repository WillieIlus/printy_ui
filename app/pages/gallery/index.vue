<script setup lang="ts">
import type { PublicShopDTO } from '~/shared/types/gallery'
import { listPublicShops } from '~/shared/api/gallery'

definePageMeta({
  layout: 'default',
})

const { getMediaUrl } = useApi()

const shops = ref<PublicShopDTO[]>([])
const loading = ref(true)
const fetchError = ref<string | null>(null)

async function fetchShops() {
  loading.value = true
  fetchError.value = null
  try {
    shops.value = await listPublicShops()
  } catch {
    shops.value = []
    fetchError.value = 'Failed to load shops'
  } finally {
    loading.value = false
  }
}

onMounted(fetchShops)
</script>

<template>
  <div class="py-8 sm:py-12">
    <div class="mb-8">
      <h1 class="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
        Gallery
      </h1>
      <p class="mt-2 text-lg text-gray-600 dark:text-gray-400">
        Browse products by print shop. Select a shop to see its catalog.
      </p>
    </div>

    <CommonLoadingSpinner v-if="loading" />

    <CommonEmptyState
      v-else-if="fetchError || !shops.length"
      :title="fetchError ? 'Could not load shops' : 'No print shops available yet'"
      :description="fetchError ? 'Something went wrong. Please try again later.' : 'There are no print shops available. Check back later.'"
      icon="i-lucide-store"
    />

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <article
        v-for="shop in shops"
        :key="shop.slug"
        class="group overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm transition-all hover:border-flamingo-200 dark:hover:border-flamingo-800/50 hover:shadow-lg"
      >
        <div class="relative bg-gradient-to-r from-flamingo-500/10 to-flamingo-700/10 dark:from-flamingo-500/20 dark:to-flamingo-700/20 px-6 py-5">
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-3 min-w-0">
              <div class="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-sm">
                <UAvatar v-if="shop.logo" :src="shop.logo.startsWith('http') ? shop.logo : (getMediaUrl(shop.logo) ?? shop.logo)" :alt="shop.name" size="xl" class="h-full w-full rounded-xl" />
                <UIcon v-else name="i-lucide-printer" class="h-6 w-6 text-flamingo-600 dark:text-flamingo-400" />
              </div>
              <div class="min-w-0">
                <div class="flex items-center gap-2">
                  <h3 class="truncate text-lg font-bold text-gray-900 dark:text-white">
                    {{ shop.name }}
                  </h3>
                  <UBadge v-if="shop.is_verified" color="success" variant="soft" size="xs" class="shrink-0">
                    <UIcon name="i-lucide-check" class="h-3 w-3" />
                  </UBadge>
                </div>
                <p v-if="shop.city || shop.state" class="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {{ [shop.city, shop.state].filter(Boolean).join(', ') }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="px-6 py-4">
          <p v-if="shop.description" class="line-clamp-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
            {{ shop.description }}
          </p>
          <NuxtLink
            :to="`/gallery/${shop.slug}`"
            class="btn-primary inline-flex items-center justify-center gap-2 w-full rounded-xl px-4 py-3 text-sm font-semibold transition-colors"
          >
            <UIcon name="i-lucide-layout-grid" class="h-4 w-4" />
            Browse products
          </NuxtLink>
        </div>
      </article>
    </div>
  </div>
</template>
