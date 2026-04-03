<template>
  <div>
    <HomeHero
      headline="Get print prices in seconds"
      subheadline="Find nearby print shops in Kenya, compare offers clearly, and configure jobs like business cards, flyers, brochures, and banners without confusion."
      primary-cta-to="/shops"
      primary-cta-label="Find a print shop"
      secondary-cta-to="/#hero-calculator"
      secondary-cta-label="Open calculator"
    >
      <template #demo>
        <QuotesCalculatorHub>
          <template #flat="slotProps">
            <QuotesPublicCalculator
              anchor-id="hero-calculator"
              eyebrow="Homepage Calculator"
              title="Marketplace print calculator"
              description="Configure one flat print job, then let the backend match shops and return the live price range."
              mode="marketplace"
              compact
              :calculator-type="slotProps.activeType"
              :calculator-type-options="slotProps.availableOptions"
              @update:calculator-type="slotProps.setActiveType"
            />
          </template>
          <template #booklet="slotProps">
            <QuotesBookletCalculator
              anchor-id="hero-calculator"
              eyebrow="Homepage Booklet Calculator"
              title="Marketplace booklet calculator"
              description="Preview booklet pricing with backend cover, insert, binding, and turnaround rules."
              compact
              :calculator-type="slotProps.activeType"
              :calculator-type-options="slotProps.availableOptions"
              @update:calculator-type="slotProps.setActiveType"
            />
          </template>
          <template #large_format="slotProps">
            <QuotesLargeFormatCalculator
              anchor-id="hero-calculator"
              eyebrow="Homepage Large Format Calculator"
              title="Marketplace large-format calculator"
              description="Preview banners, posters, stickers, roll-ups, and boards with backend area pricing."
              compact
              :calculator-type="slotProps.activeType"
              :calculator-type-options="slotProps.availableOptions"
              @update:calculator-type="slotProps.setActiveType"
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
