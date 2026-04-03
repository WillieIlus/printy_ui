<template>
  <div id="demo" class="scroll-mt-24">
    <div class="hero-calculator-shell mx-auto w-full max-w-none">
      <QuotesCalculatorHub>
        <template #flat>
          <QuotesBackendQuoteCalculator
            eyebrow="Homepage Calculator"
            title="Live backend pricing preview"
            description="Anonymous visitors can preview pricing. Signed-in clients can save the same calculation as a real backend draft."
            mode="hero"
            anchor-id="hero-calculator"
          />
        </template>
        <template #booklet>
          <QuotesBookletCalculator
            eyebrow="Homepage Booklet Calculator"
            title="Live booklet pricing preview"
            description="Preview booklet pricing with cover, inserts, binding, and turnaround in the same shared calculator shell."
            anchor-id="hero-calculator"
          />
        </template>
        <template #large_format>
          <QuotesLargeFormatCalculator
            eyebrow="Homepage Large Format Calculator"
            title="Live large-format pricing preview"
            description="Preview area-based pricing for banners, posters, stickers, roll-up banners, and mounted boards."
            anchor-id="hero-calculator"
          />
        </template>
      </QuotesCalculatorHub>
    </div>
  </div>
</template>

<script setup lang="ts">
import QuotesCalculatorHub from '~/components/quotes/CalculatorHub.vue'
import QuotesBackendQuoteCalculator from '~/components/quotes/BackendQuoteCalculator.vue'
import QuotesBookletCalculator from '~/components/quotes/BookletCalculator.vue'
import QuotesLargeFormatCalculator from '~/components/quotes/LargeFormatCalculator.vue'
</script>

<style scoped>
.hero-calculator-shell :deep(section) {
  width: 100%;
}

@media (min-width: 1024px) {
  .hero-calculator-shell :deep(.calculator-shell) {
    padding: 1rem;
  }

  .hero-calculator-shell :deep(.calculator-shell > div) {
    gap: 1.25rem;
  }

  .hero-calculator-shell :deep(.calculator-shell > div > div:last-child) {
    padding-left: 1.25rem;
  }
}
</style>
