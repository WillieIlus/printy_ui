<!-- Purpose: Large centered marketing hero shell that wraps the calculator card. -->
<template>
  <section class="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-8">
    <div
      :class="calculatorThemeClass"
      class="rounded-[2.3rem] border border-[var(--p-calculator-border)] bg-[var(--p-calculator-bg)] p-3 shadow-[0_24px_56px_rgba(15,23,42,0.14)] md:p-4"
    >
      <HeroCalculatorCard />
    </div>
  </section>
</template>

<script setup lang="ts">
import HeroCalculatorCard from '~/components/marketing/home/HeroCalculatorCard.vue'

const colorMode = useColorMode()
const isDarkPage = computed(() => colorMode.value === 'dark')
const calculatorThemeClass = computed(() =>
  isDarkPage.value ? 'calculator-is-light' : 'calculator-is-dark',
)
</script>

<style scoped>
.calculator-is-dark {
  --p-calculator-bg: #0f172a;
  --p-calculator-surface: #111827;
  --p-calculator-text: #f8fafc;
  --p-calculator-muted: #cbd5e1;
  --p-calculator-border: #334155;
}

.calculator-is-light {
  --p-calculator-bg: #f3f6fb;
  --p-calculator-surface: #ffffff;
  --p-calculator-text: #0f172a;
  --p-calculator-muted: #475569;
  --p-calculator-border: #cbd5e1;
}
</style>
