<template>
  <div>
    <HomeHero
      headline="Get print prices in seconds"
      subheadline="Find nearby print shops in Kenya, compare offers clearly, and configure jobs like business cards, flyers, brochures, and banners without confusion."
      primary-cta-to="/shops"
      primary-cta-label="Find a print shop"
      secondary-cta-to="/#hero-calculator"
      secondary-cta-label="Try live pricing"
    >
      <template #demo>
        <QuotesCalculatorHub>
          <template #flat>
            <QuotesPublicCalculator
              anchor-id="hero-calculator"
              eyebrow="Homepage Calculator"
              title="Marketplace print matcher"
              description="Use one shared public calculator to match shops and surface the current public price-range state."
              mode="marketplace"
              compact
            />
          </template>
          <template #booklet>
            <QuotesBookletCalculator
              anchor-id="hero-calculator"
              eyebrow="Homepage Booklet Calculator"
              title="Marketplace booklet matcher"
              description="Preview booklet pricing with cover, inserts, binding, and turnaround using the same backend-first marketplace flow."
            />
          </template>
          <template #large_format>
            <QuotesLargeFormatCalculator
              anchor-id="hero-calculator"
              eyebrow="Homepage Large Format Calculator"
              title="Marketplace large-format matcher"
              description="Preview banners, posters, stickers, roll-up banners, and mounted boards with backend area pricing."
            />
          </template>
        </QuotesCalculatorHub>
      </template>
    </HomeHero>
    <HomeWhyPrinty />
    <HomePopularProducts />
    <HomePopularLocations />
    <HomeHowItWorks />
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
