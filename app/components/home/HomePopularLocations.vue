<template>
  <section class="py-16 sm:py-24 bg-[var(--p-bg)]">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <h2 class="text-2xl font-bold text-[var(--p-text)] sm:text-3xl text-center">
        Popular locations
      </h2>
      <p class="mt-2 text-[var(--p-text-muted)] text-center max-w-xl mx-auto">
        Find print shops near you across Kenya.
      </p>
      <div class="mt-10 flex flex-wrap justify-center gap-3">
        <NuxtLink
          v-for="loc in locations"
          :key="loc.slug"
          :to="`/locations/${loc.slug}`"
          class="inline-flex items-center gap-2 rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] px-5 py-3 text-sm font-medium text-[var(--p-text)] transition-colors hover:border-flamingo-300 dark:hover:border-flamingo-700 hover:text-flamingo-600 dark:hover:text-flamingo-400"
        >
          <UIcon name="i-lucide-map-pin" class="w-4 h-4 text-flamingo-500" />
          {{ loc.name }}
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const locations = [
  { slug: 'nairobi', name: 'Nairobi' },
  { slug: 'westlands', name: 'Westlands' },
  { slug: 'kilimani', name: 'Kilimani' },
  { slug: 'cbd', name: 'CBD' },
  { slug: 'industrial-area', name: 'Industrial Area' },
  { slug: 'mombasa', name: 'Mombasa' },
  { slug: 'kisumu', name: 'Kisumu' },
]
</script>
