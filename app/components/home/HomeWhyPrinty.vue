<template>
  <section class="py-16 sm:py-24 bg-[var(--p-surface)] border-t border-[var(--p-border)]">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <h2 class="text-2xl font-bold text-[var(--p-text)] sm:text-3xl text-center">
        Why Printy
      </h2>
      <p class="mt-2 text-[var(--p-text-muted)] text-center max-w-xl mx-auto">
        Built for print customers and shops in Kenya.
      </p>
      <div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="(feature, i) in features"
          :key="i"
          class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-bg)] p-6"
        >
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-flamingo-100 dark:bg-flamingo-900/30 text-flamingo-600 dark:text-flamingo-400">
            <UIcon :name="feature.icon" class="w-5 h-5" />
          </div>
          <h3 class="mt-4 font-semibold text-[var(--p-text)]">{{ feature.title }}</h3>
          <p class="mt-2 text-sm text-[var(--p-text-muted)]">
            {{ feature.body }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const features = [
  {
    title: 'Instant print calculations',
    body: 'See estimated prices as you configure—no waiting for quotes.',
    icon: 'i-lucide-zap',
  },
  {
    title: 'Nearby print shops',
    body: 'Find and compare local printers by location.',
    icon: 'i-lucide-store',
  },
  {
    title: 'Clear pricing breakdown',
    body: 'Material, print, finishing—all itemized so you know what you pay.',
    icon: 'i-lucide-receipt',
  },
  {
    title: 'Faster client response',
    body: 'Shops get structured requests and can respond quickly.',
    icon: 'i-lucide-clock',
  },
]
</script>
