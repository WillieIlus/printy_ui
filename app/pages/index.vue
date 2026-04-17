<template>
  <NuxtLayout name="default" :container="false">
    <div class="bg-transparent">
      <HomeHero />
      <HomePopularProducts />
      <HomeShopDiscoveryMap />
      <HomePopularLocations />
      <HomeHowItWorks />
      <HomePricingTeaser />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
})

usePrintySeo({
  title: 'Print Prices in Seconds | Find Print Shops in Kenya',
  description: 'Get instant printing quotes for business cards, flyers, brochures, and more. Find nearby print shops in Nairobi, Mombasa, Kisumu. Compare prices and request quotes fast.',
})
</script>
