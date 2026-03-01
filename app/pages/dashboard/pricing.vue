<script setup lang="ts">
import { useShopStore } from '~/stores/shop'

definePageMeta({ layout: 'dashboard' })

const shopStore = useShopStore()
await shopStore.fetchMyShops()

if (shopStore.myShops.length === 1) {
  await navigateTo(`/dashboard/shops/${shopStore.myShops[0].slug}/pricing`)
} else if (shopStore.myShops.length > 1) {
  await navigateTo('/dashboard/shops')
} else {
  await navigateTo('/dashboard/shops/create')
}
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-[200px] gap-4">
    <p class="text-gray-600 dark:text-gray-400">Redirecting...</p>
  </div>
</template>
