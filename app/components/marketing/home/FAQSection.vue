<!-- Purpose: Homepage FAQ placeholder section. -->
<template>
  <section class="mx-auto max-w-4xl px-4 py-12 md:px-6 md:py-14">
    <div class="space-y-8">
      <BaseSectionTitle
        eyebrow="FAQ"
        title="Common questions."
        description="How the calculator and shop matching works."
      />
      <div class="space-y-3">
        <BaseCard v-for="item in items" :key="item.question" class="space-y-2">
          <h3 class="text-lg font-semibold text-[var(--p-text)]">{{ item.question }}</h3>
          <p class="text-sm text-[var(--p-text-muted)]">{{ item.answer }}</p>
        </BaseCard>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import BaseCard from '~/components/ui/BaseCard.vue'
import BaseSectionTitle from '~/components/ui/BaseSectionTitle.vue'

const items = [
  { question: 'Does the calculator show live pricing?', answer: 'Yes. Fields and prices are loaded live — including stock matching and available price ranges from each shop.' },
  { question: 'Can I send a request to shops from here?', answer: 'Not yet. The calculator currently shows you matching shops and price estimates. Direct requests will be available soon.' },
  { question: 'Will booklet details like page count appear here?', answer: 'Yes. When you select a booklet product, the form shows the relevant fields — cover paper, inside pages, and page count.' },
]
</script>
