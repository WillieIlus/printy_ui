<template>
  <div id="demo" class="scroll-mt-24">
    <div class="hero-calculator-shell mx-auto w-full max-w-[84rem]">
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
      </QuotesCalculatorHub>
    </div>
  </div>
</template>

<script setup lang="ts">
import QuotesCalculatorHub from '~/components/quotes/CalculatorHub.vue'
import QuotesBackendQuoteCalculator from '~/components/quotes/BackendQuoteCalculator.vue'
import QuotesBookletCalculator from '~/components/quotes/BookletCalculator.vue'
</script>

<style scoped>
.hero-calculator-shell :deep(section) {
  width: 100%;
}
</style>
