<template>
  <div class="min-h-screen bg-amber-50/80 dark:bg-stone-950">
    <!-- Kenyan vibe header -->
    <div class="border-b border-amber-200/60 dark:border-amber-900/40 bg-white/70 dark:bg-stone-900/70 backdrop-blur-sm">
      <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <div class="flex items-center justify-between gap-4">
          <div>
            <h1 class="text-3xl sm:text-4xl font-bold text-stone-800 dark:text-stone-100 font-[family-name:var(--font-heading)]">
              Print Shops
            </h1>
            <p class="mt-2 text-lg text-stone-600 dark:text-stone-400">
              Discover print shops across Kenya. Browse products and get quotes.
            </p>
          </div>
          <UButton v-if="authStore.isAuthenticated" to="/me/favorites" variant="outline" color="neutral" size="sm">
            <UIcon name="i-lucide-heart" class="mr-2 h-4 w-4" />
            Saved Shops
          </UButton>
        </div>
      </div>
    </div>

    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
      <CommonLoadingSpinner v-if="loading" />
      <div v-else-if="shops.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="shop in shops"
          :key="shop.id"
          class="group rounded-2xl border border-amber-200/80 dark:border-amber-800/50 bg-white dark:bg-stone-900 shadow-sm hover:shadow-lg hover:border-amber-400/60 dark:hover:border-amber-600/50 transition-all overflow-hidden"
        >
          <div class="p-6">
            <div class="flex items-start justify-between gap-2">
              <div class="flex items-center gap-3 min-w-0">
                <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/40">
                  <UIcon name="i-lucide-store" class="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div class="min-w-0">
                  <h2 class="text-lg font-semibold text-stone-800 dark:text-stone-100 truncate">
                    {{ shop.name }}
                  </h2>
                  <ShopsShopRatingSummary :summary="ratingSummaries[shop.slug] ?? null" />
                </div>
              </div>
              <ShopsShopFavoriteToggle
                :shop-id="shop.id"
                :shop-name="shop.name"
                :shop-slug="shop.slug"
              />
            </div>
            <UButton
              :to="`/shops/${shop.slug}`"
              color="primary"
              variant="solid"
              class="mt-4 w-full"
              block
            >
              Open Shop
              <UIcon name="i-lucide-arrow-right" class="ml-2 h-4 w-4" />
            </UButton>
          </div>
        </div>
      </div>
      <div v-else class="rounded-2xl border border-amber-200/60 dark:border-amber-800/40 bg-white dark:bg-stone-900 p-12 text-center">
        <UIcon name="i-lucide-store" class="mx-auto h-16 w-16 text-amber-200 dark:text-amber-800" />
        <h3 class="mt-4 text-lg font-medium text-stone-700 dark:text-stone-300">No shops yet</h3>
        <p class="mt-2 text-sm text-stone-500 dark:text-stone-400">Check back soon for print shops near you.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ShopPublic } from '~/shared/types'
import { listShops } from '~/services/public'
import { getRatingSummary } from '~/services/ratings'
import type { RatingSummary } from '~/services/ratings'
import { useAuthStore } from '~/stores/auth'
import { useFavoritesStore } from '~/stores/favorites'

definePageMeta({ layout: 'default' })

const authStore = useAuthStore()
const favoritesStore = useFavoritesStore()

const shops = ref<ShopPublic[]>([])
const loading = ref(true)
const ratingSummaries = ref<Record<string, RatingSummary>>({})

onMounted(async () => {
  try {
    shops.value = await listShops()
    if (authStore.isAuthenticated) {
      favoritesStore.loadFavorites()
    }
    const summaries = await Promise.all(
      shops.value.map(async (s) => {
        const summary = await getRatingSummary(s.slug)
        return { slug: s.slug, summary } as const
      })
    )
    ratingSummaries.value = Object.fromEntries(
      summaries.filter((x) => x.summary).map((x) => [x.slug, x.summary!])
    )
  } catch (err) {
    console.error('Failed to load shops:', err)
  } finally {
    loading.value = false
  }
})
</script>
