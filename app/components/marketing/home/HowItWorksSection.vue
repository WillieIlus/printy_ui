<!-- Purpose: Trust/explanation section — why to use Printy before contacting a shop. -->
<template>
  <section class="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-14">
    <div class="space-y-8">
      <div class="text-center">
        <h2 class="text-2xl font-bold tracking-tight text-[var(--p-text)] md:text-3xl">
          Why use Printy before contacting a shop?
        </h2>
      </div>
      <div class="grid gap-4 md:grid-cols-3">
        <BaseCard v-for="card in cards" :key="card.title" class="space-y-2">
          <h3 class="text-lg font-semibold text-[var(--p-text)]">{{ card.title }}</h3>
          <p class="text-sm text-[var(--p-text-muted)]">{{ card.body }}</p>
        </BaseCard>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import BaseCard from '~/components/ui/BaseCard.vue'

const cards = [
  {
    title: 'Clearer specs',
    body: 'Quantity, size, paper, and finishing are captured before you send a request.',
  },
  {
    title: 'KES estimates',
    body: 'See a practical price estimate before the back-and-forth starts.',
  },
  {
    title: 'Real print logic',
    body: 'Printy is built around papers, sides, finishing, and production rules used by local print shops.',
  },
]
</script>
