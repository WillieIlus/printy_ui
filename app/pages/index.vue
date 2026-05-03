<!-- Purpose: Client homepage — calculator-first flow. -->
<template>
  <main>
    <HeroIntroBlock />
    <HeroCalculatorShell />
    <ResultsSection />
    <HowItWorksSection />
    <FAQSection />
  </main>
</template>

<script setup lang="ts">
import FAQSection from '~/components/marketing/home/FAQSection.vue'
import HeroCalculatorShell from '~/components/marketing/home/HeroCalculatorShell.vue'
import HeroIntroBlock from '~/components/marketing/home/HeroIntroBlock.vue'
import HowItWorksSection from '~/components/marketing/home/HowItWorksSection.vue'
import ResultsSection from '~/components/marketing/home/ResultsSection.vue'
</script>
