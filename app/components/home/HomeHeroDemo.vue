<template>
  <div id="demo" class="scroll-mt-24">
    <div class="mb-4 grid gap-3 md:grid-cols-3">
      <article
        v-for="mode in calculatorModes"
        :key="mode.title"
        class="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white shadow-[0_14px_32px_rgba(0,0,0,0.18)] backdrop-blur-sm"
      >
        <div class="flex items-start gap-3">
          <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-flamingo-500/16 text-flamingo-300">
            <UIcon :name="mode.icon" class="h-4.5 w-4.5" />
          </span>
          <div>
            <p class="text-sm font-semibold">{{ mode.title }}</p>
            <p class="mt-1 text-xs leading-5 text-slate-300">{{ mode.description }}</p>
          </div>
        </div>
      </article>
    </div>

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

const calculatorModes = [
  {
    title: 'Flat jobs',
    description: 'Business cards, flyers, stickers, and other sheet-fed work.',
    icon: 'i-lucide-rectangle-horizontal',
  },
  {
    title: 'Booklet jobs',
    description: 'Cover, inserts, binding, and turnaround in one guided flow.',
    icon: 'i-lucide-book-open',
  },
  {
    title: 'Large-format jobs',
    description: 'Banners, posters, boards, and roll media with area pricing.',
    icon: 'i-lucide-image',
  },
]
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
