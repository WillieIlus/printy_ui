<template>
  <div>
    <HomeHero
      headline="Get print prices in seconds"
      subheadline="Find nearby print shops in Kenya, compare offers clearly, and configure jobs like business cards, flyers, brochures, and banners without confusion."
      primary-cta-to="/shops"
      primary-cta-label="Find a print shop"
      secondary-cta-to="/#demo"
      secondary-cta-label="Try live pricing"
    />
    <HomeHowItWorks />
    <HomePopularProducts />
    <HomePopularLocations />
    <HomeWhyPrinty />
    <HomeShopOwnerCTA />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

usePrintySeo({
  title: 'Print Prices in Seconds | Find Print Shops in Kenya',
  description: 'Get instant printing quotes for business cards, flyers, brochures, and more. Find nearby print shops in Nairobi, Mombasa, Kisumu. Compare prices and request quotes fast.',
})
</script>
