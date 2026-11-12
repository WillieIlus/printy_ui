<script setup lang="ts">
/**
 * Homepage quote section — design source `QuoteSection`.
 *
 * The section heading is the only heading and the only subline; the split
 * calculator below it renders no title of its own. Pricing stays in the
 * existing calculator store and the public preview endpoint.
 */
import DesignSectionHead from './SectionHead.vue'
import DesignCalculatorSurface from '../calculator/CalculatorSurface.vue'
import DesignCalculator from '../calculator/DesignCalculator.vue'

function goSignUp() {
  return navigateTo('/sign-up?mode=buyer')
}
</script>

<template>
  <section id="quote" class="paper-noise relative scroll-mt-20">
    <div class="relative z-10 mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
      <div class="flex flex-wrap items-end justify-between gap-6">
        <DesignSectionHead
          eyebrow="Instant price"
          title="Plan your print job"
          copy="Tell us what you need and see a live, server-verified price in seconds. No signup to start."
        />
        <span class="stamp border-brand bg-mint text-brand-deep">No login needed</span>
      </div>
      <div class="mt-8">
        <DesignCalculatorSurface>
          <DesignCalculator split @unlock="goSignUp" />
        </DesignCalculatorSurface>
      </div>
    </div>
  </section>
</template>
