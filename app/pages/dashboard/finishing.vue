<template>
  <div class="py-12">
    <CommonLoadingSpinner />
  </div>
</template>

<script setup lang="ts">
import { useSellerStore } from '~/stores/seller'

definePageMeta({ layout: 'dashboard', middleware: ['auth'] })

const sellerStore = useSellerStore()

onMounted(async () => {
  if (!sellerStore.shops.length) await sellerStore.fetchShops()
  const slug = sellerStore.shops[0]?.slug
  await navigateTo(slug ? `/dashboard/shops/${slug}/finishing` : '/dashboard/shops/create', { replace: true })
})
</script>
