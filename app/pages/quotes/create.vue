<template>
  <div class="min-h-screen bg-[var(--p-bg)]">
    <div class="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div class="mb-8">
        <NuxtLink to="/quotes" class="inline-flex items-center gap-2 text-sm font-medium text-[var(--p-text-muted)] hover:text-[var(--p-text)]">
          <UIcon name="i-lucide-arrow-left" class="h-4 w-4" />
          Quote requests
        </NuxtLink>
        <h1 class="mt-4 text-3xl font-bold text-[var(--p-text)]">Send custom request to shops</h1>
        <p class="mt-2 max-w-3xl text-sm text-[var(--p-text-muted)]">
          Use the shared marketplace calculator to match shops, see backend price ranges, and then continue from your requests and quotes workspace.
        </p>
      </div>

      <section class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-5 shadow-sm sm:p-8">
        <QuotesPublicCalculator
          title="Marketplace request calculator"
          description="Structured custom-job matching with backend exact previews where possible and price-range fallback across shops."
          eyebrow="Request Flow"
          mode="marketplace"
        />
      </section>

      <div class="mt-6 flex flex-wrap gap-3">
        <UButton to="/quote-draft">Open requests & quotes workspace</UButton>
        <UButton to="/shops" variant="soft">Browse shops</UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'auth',
})
</script>
