<template>
  <div id="demo" class="scroll-mt-24">
    <div class="hero-calculator-shell mx-auto w-full max-w-[32rem]">
      <QuotesBackendQuoteCalculator
        eyebrow="Live backend pricing"
        title="Preview print pricing"
        description="Use the live backend calculator to estimate pricing clearly before you save a draft or continue into the full workflow."
        mode="hero"
        anchor-id="hero-calculator"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import QuotesBackendQuoteCalculator from '~/components/quotes/BackendQuoteCalculator.vue'
</script>

<style scoped>
.hero-calculator-shell :deep(> section) {
  border-color: rgba(148, 163, 184, 0.14);
  background:
    radial-gradient(circle at top right, rgba(251, 146, 60, 0.05), transparent 28%),
    linear-gradient(165deg, rgba(19, 29, 47, 0.96), rgba(11, 18, 31, 0.98) 56%, rgba(8, 14, 26, 0.99));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 26px 56px -36px rgba(3, 8, 20, 0.66),
    0 10px 18px -14px rgba(35, 58, 95, 0.26);
  backdrop-filter: blur(14px) saturate(108%);
  -webkit-backdrop-filter: blur(14px) saturate(108%);
}

.hero-calculator-shell :deep(.bg-\[var\(--p-surface-sunken\)\]) {
  background: linear-gradient(180deg, rgba(15, 23, 38, 0.96), rgba(11, 18, 31, 0.98));
}

.hero-calculator-shell :deep([data-calculator-mode='hero']) {
  color: #f4f8ff;
}

.hero-calculator-shell :deep([data-calculator-mode='hero'] h2) {
  max-width: 15ch;
}

.hero-calculator-shell :deep([data-calculator-mode='hero'] p),
.hero-calculator-shell :deep([data-calculator-mode='hero'] span),
.hero-calculator-shell :deep([data-calculator-mode='hero'] label) {
  color: inherit;
}

.hero-calculator-shell :deep([data-calculator-mode='hero'] .text-\[var\(--p-text-muted\)\]) {
  color: rgba(200, 212, 230, 0.84) !important;
}

.hero-calculator-shell :deep([data-calculator-mode='hero'] .text-\[var\(--p-text-dim\)\]) {
  color: rgba(228, 235, 247, 0.94) !important;
}

.hero-calculator-shell :deep([data-calculator-mode='hero'] [data-ui='UButton']) {
  min-height: 2.7rem;
  border-radius: 999px;
}

.hero-calculator-shell :deep([data-calculator-mode='hero'] [data-ui='UInput'] input),
.hero-calculator-shell :deep([data-calculator-mode='hero'] [data-ui='UTextarea'] textarea),
.hero-calculator-shell :deep([data-calculator-mode='hero'] [data-ui='USelectMenu'] [data-slot='trigger']) {
  font-size: 0.9rem;
}

.hero-calculator-shell :deep([data-calculator-mode='hero'] [data-ui='UTextarea'] textarea) {
  border-radius: 1.1rem;
}

.hero-calculator-shell :deep([data-calculator-mode='hero'] .hero-calculator-actions) {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
}

.hero-calculator-shell :deep([data-calculator-mode='hero'] .hero-calculator-primary-action),
.hero-calculator-shell :deep([data-calculator-mode='hero'] .hero-calculator-secondary-action) {
  justify-content: center;
}

.hero-calculator-shell :deep([data-calculator-mode='hero'] .hero-calculator-primary-action) {
  font-weight: 700;
}

.hero-calculator-shell :deep([data-calculator-mode='hero'] .hero-calculator-secondary-action) {
  color: rgba(232, 239, 248, 0.94);
}

.hero-calculator-shell :deep([data-calculator-mode='hero'] article),
.hero-calculator-shell :deep([data-calculator-mode='hero'] section.rounded-3xl) {
  border-color: rgba(148, 163, 184, 0.16);
}

.hero-calculator-shell :deep([data-calculator-mode='hero'] section.rounded-3xl) {
  background: linear-gradient(180deg, rgba(14, 22, 36, 0.98), rgba(10, 17, 29, 0.98));
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

.hero-calculator-shell :deep([data-calculator-mode='hero'] section.rounded-3xl h3) {
  font-size: 1.22rem;
}

.hero-calculator-shell :deep([data-calculator-mode='hero'] section.rounded-3xl .text-xl) {
  font-size: 1.12rem;
  line-height: 1.3;
}
</style>
