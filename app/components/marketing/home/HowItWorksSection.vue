<!-- Purpose: Homepage walkthrough for the safe request flow. -->
<template>
  <section class="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-14">
    <div class="space-y-8">
      <BaseSectionTitle
        eyebrow="How it works"
        title="A compact path from job specs to real shop matches."
        description="The homepage now stays close to backend truth: choose a product, request a preview, then review matching shops."
      />
      <div class="grid gap-4 md:grid-cols-3">
        <BaseCard v-for="step in steps" :key="step.title" class="space-y-3">
          <BaseBadge tone="primary">{{ step.step }}</BaseBadge>
          <h3 class="text-xl font-semibold text-[var(--p-text)]">{{ step.title }}</h3>
          <p class="text-sm text-[var(--p-text-muted)]">{{ step.description }}</p>
        </BaseCard>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import BaseBadge from '~/components/ui/BaseBadge.vue'
import BaseCard from '~/components/ui/BaseCard.vue'
import BaseSectionTitle from '~/components/ui/BaseSectionTitle.vue'

const steps = [
  { step: '01', title: 'Choose a backend product', description: 'The calculator loads the required fields, defaults, sizes, and stock options from the backend.' },
  { step: '02', title: 'Request a live preview', description: 'Printy sends your selected fields to the backend and receives missing fields, matched stock notes, and price ranges.' },
  { step: '03', title: 'Review matching shops', description: 'Results below show backend matches only, including turnaround text and booklet details when available.' },
]
</script>
