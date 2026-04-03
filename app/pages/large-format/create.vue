<template>
  <div class="min-h-screen bg-[var(--p-bg)]">
    <div class="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div class="mb-8">
        <NuxtLink to="/quotes/create" class="inline-flex items-center gap-2 text-sm font-medium text-[var(--p-text-muted)] hover:text-[var(--p-text)]">
          <UIcon name="i-lucide-arrow-left" class="h-4 w-4" />
          Calculators
        </NuxtLink>
        <h1 class="mt-4 text-3xl font-bold text-[var(--p-text)]">Large-format calculator</h1>
        <p class="mt-2 max-w-3xl text-sm text-[var(--p-text-muted)]">
          Price banners, posters, stickers, roll-up banners, and mounted boards from one backend-driven large-format flow.
        </p>
      </div>

      <QuotesLargeFormatCalculator
        title="Large-format calculator"
        description="Use the dedicated large-format engine for area pricing, materials, finishing, hardware, and turnaround."
        eyebrow="Large Format"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
})
</script>
