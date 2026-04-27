<!-- Purpose: Compact hero introduction above the homepage calculator. -->
<template>
  <section class="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 pt-10 text-center md:px-6 md:pt-14">
    <div class="space-y-4">
      <h1 class="text-3xl font-bold tracking-tight text-[var(--p-text)] md:text-5xl lg:text-6xl">
        Get instant prices from <span class="text-[var(--p-primary)]">real</span> print shops
      </h1>
      <p class="mx-auto max-w-2xl text-base text-[var(--p-text-muted)] md:text-lg">
        Tell us what you need once. Compare matching shops, clear price ranges, and WhatsApp-ready requests.
      </p>
    </div>

    <div class="flex flex-wrap items-center justify-center gap-3">
      <div
        v-for="benefit in benefits"
        :key="benefit.label"
        class="flex items-center gap-1.5 rounded-full border border-[var(--p-border)] bg-[var(--p-surface)] px-3 py-1 text-sm font-medium text-[var(--p-text)] shadow-sm"
      >
        <Icon :name="benefit.icon" class="size-4 text-[var(--p-primary)]" />
        <span>{{ benefit.label }}</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const benefits = [
  { label: 'No delays', icon: 'lucide:zap' },
  { label: 'No guessing', icon: 'lucide:search-x' },
  { label: 'No endless calls', icon: 'lucide:phone-off' },
]
</script>
