<template>
  <div class="min-h-screen bg-amber-50/80 dark:bg-stone-950">
    <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-stone-800 dark:text-stone-100 font-[family-name:var(--font-heading)]">
          Saved Shops
        </h1>
        <UButton to="/shops" variant="outline" color="neutral">
          <UIcon name="i-lucide-store" class="mr-2 h-4 w-4" />
          Browse shops
        </UButton>
      </div>

      <CommonLoadingSpinner v-if="favoritesStore.loading && !favoritesStore.loaded" />
      <div v-else-if="favoritesStore.favorites.length" class="space-y-4">
        <div
          v-for="shop in favoritesStore.favorites"
          :key="shop.id"
          class="flex items-center justify-between gap-4 rounded-2xl border border-amber-200/80 dark:border-amber-800/50 bg-white dark:bg-stone-900 p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div class="flex items-center gap-4 min-w-0">
            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/40">
              <UIcon name="i-lucide-store" class="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div class="min-w-0">
              <h2 class="font-semibold text-stone-800 dark:text-stone-100 truncate">{{ shop.name }}</h2>
              <p class="text-sm text-stone-500 dark:text-stone-400">/{{ shop.slug }}</p>
            </div>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <UButton :to="`/shops/${shop.slug}`" color="primary" size="sm">
              Open Shop
              <UIcon name="i-lucide-arrow-right" class="ml-2 h-4 w-4" />
            </UButton>
            <ShopsShopFavoriteToggle
              :shop-id="shop.id"
              :shop-name="shop.name"
              :shop-slug="shop.slug"
            />
          </div>
        </div>
      </div>
      <div v-else class="rounded-2xl border border-amber-200/60 dark:border-amber-800/40 bg-white dark:bg-stone-900 p-12 text-center">
        <UIcon name="i-lucide-heart" class="mx-auto h-16 w-16 text-amber-200 dark:text-amber-800" />
        <h3 class="mt-4 text-lg font-medium text-stone-700 dark:text-stone-300">No saved shops yet</h3>
        <p class="mt-2 text-sm text-stone-500 dark:text-stone-400">Browse shops and tap the heart to save your favorites.</p>
        <UButton to="/shops" color="primary" class="mt-4">Browse shops</UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'auth',
})

const favoritesStore = useFavoritesStore()

onMounted(() => {
  favoritesStore.loadFavorites()
})
</script>
