<template>
  <div class="min-h-screen bg-[var(--p-bg)]">
    <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <h1 class="text-3xl font-bold text-[var(--p-text)] sm:text-4xl">
        Printing products
      </h1>
      <p class="mt-4 text-lg text-[var(--p-text-muted)]">
        Get instant quotes for popular print products. Choose your product to see options and pricing.
      </p>

      <div class="mt-12 grid gap-6 sm:grid-cols-3">
        <NuxtLink
          v-for="p in products"
          :key="p.slug"
          :to="`/products/${p.slug}`"
          class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 transition-colors hover:border-flamingo-300 dark:hover:border-flamingo-700 hover:shadow-md"
        >
          <UIcon :name="p.icon" class="w-10 h-10 text-flamingo-500" />
          <h2 class="mt-4 font-semibold text-[var(--p-text)]">{{ p.title }}</h2>
          <p class="mt-2 text-sm text-[var(--p-text-muted)]">{{ p.short }}</p>
          <span class="mt-4 inline-flex items-center text-sm font-medium text-flamingo-600 dark:text-flamingo-400">
            Learn more
            <UIcon name="i-lucide-arrow-right" class="ml-1 w-4 h-4" />
          </span>
        </NuxtLink>
      </div>

      <div class="mt-12 flex flex-wrap gap-4">
        <NuxtLink to="/gallery" class="btn-primary inline-flex items-center rounded-xl px-6 py-3.5 text-sm font-bold">
          Get a quote
        </NuxtLink>
        <NuxtLink to="/shops" class="inline-flex items-center rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] px-6 py-3.5 text-sm font-semibold text-[var(--p-text)] hover:bg-[var(--p-surface-sunken)]">
          Browse shops
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const products = [
  { slug: 'business-cards', title: 'Business cards', short: 'Professional cards in standard or custom sizes.', icon: 'i-lucide-credit-card' },
  { slug: 'flyers', title: 'Flyers', short: 'Promotional handouts for events and marketing.', icon: 'i-lucide-file-text' },
  { slug: 'posters', title: 'Posters', short: 'Large format for events, retail, and promotions.', icon: 'i-lucide-image' },
]

usePrintySeo({
  title: 'Printing Products',
  description: 'Get instant printing quotes for business cards, flyers, posters, and more. Browse options and request quotes from trusted print shops.',
  path: '/products',
})
</script>
