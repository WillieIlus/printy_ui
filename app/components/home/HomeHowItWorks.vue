<template>
  <section id="how-it-works" class="py-16 sm:py-24 bg-[var(--p-bg)] scroll-mt-20">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <h2 class="text-2xl font-bold text-[var(--p-text)] sm:text-3xl text-center">
        How it works
      </h2>
      <p class="mt-2 text-[var(--p-text-muted)] text-center max-w-xl mx-auto">
        Three steps to get your print job quoted.
      </p>
      <div class="mt-12 grid gap-8 sm:grid-cols-3">
        <div
          v-for="(step, i) in steps"
          :key="i"
          class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 text-center"
        >
          <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-flamingo-100 dark:bg-flamingo-900/30 text-flamingo-600 dark:text-flamingo-400">
            <UIcon :name="step.icon" class="w-6 h-6" />
          </div>
          <h3 class="mt-4 font-semibold text-[var(--p-text)]">{{ step.number }}. {{ step.title }}</h3>
          <p class="mt-2 text-sm text-[var(--p-text-muted)]">
            {{ step.body }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const steps = [
  {
    number: 1,
    title: 'Choose location & product',
    body: 'Pick your area and what you need—business cards, flyers, brochures, or more.',
    icon: 'i-lucide-map-pin',
  },
  {
    number: 2,
    title: 'Compare options & pricing',
    body: 'See instant estimates from nearby shops. Tweak quantity, paper, finishing.',
    icon: 'i-lucide-scale',
  },
  {
    number: 3,
    title: 'Request quote or continue',
    body: 'Submit your request. Shops respond with final pricing and delivery.',
    icon: 'i-lucide-send',
  },
]
</script>
