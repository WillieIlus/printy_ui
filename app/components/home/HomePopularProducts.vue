<template>
  <section class="py-16 sm:py-24 bg-[var(--p-surface)] border-t border-[var(--p-border)]">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <h2 class="text-2xl font-bold text-[var(--p-text)] sm:text-3xl text-center">
        Popular products
      </h2>
      <p class="mt-2 text-[var(--p-text-muted)] text-center max-w-xl mx-auto">
        Get instant quotes for the most requested print jobs in Kenya.
      </p>
      <div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <NuxtLink
          v-for="p in products"
          :key="p.slug"
          :to="p.to"
          class="group flex items-center gap-4 rounded-2xl border border-[var(--p-border)] bg-[var(--p-bg)] p-5 transition-colors hover:border-flamingo-300 dark:hover:border-flamingo-700 hover:shadow-md"
        >
          <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-flamingo-100 dark:bg-flamingo-900/30 text-flamingo-600 dark:text-flamingo-400">
            <UIcon :name="p.icon" class="w-6 h-6" />
          </div>
          <div class="min-w-0 flex-1">
            <h3 class="font-semibold text-[var(--p-text)] group-hover:text-flamingo-600 dark:group-hover:text-flamingo-400">
              {{ p.title }}
            </h3>
            <p class="text-sm text-[var(--p-text-muted)] truncate">{{ p.short }}</p>
          </div>
          <UIcon name="i-lucide-chevron-right" class="w-5 h-5 text-[var(--p-text-muted)] group-hover:text-flamingo-500 shrink-0" />
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const products = [
  { slug: 'business-cards', title: 'Business cards', short: 'Standard & premium', icon: 'i-lucide-credit-card', to: '/products/business-cards' },
  { slug: 'flyers', title: 'Flyers', short: 'A4, A5, promotional', icon: 'i-lucide-file-text', to: '/products/flyers' },
  { slug: 'brochures', title: 'Brochures', short: 'Tri-fold, bi-fold', icon: 'i-lucide-book-open', to: '/products/brochures' },
  { slug: 'stickers', title: 'Stickers', short: 'Vinyl, paper, custom', icon: 'i-lucide-sticker', to: '/products/stickers' },
  { slug: 'banners', title: 'Banners', short: 'Roll-up, outdoor', icon: 'i-lucide-panel-top', to: '/products/banners' },
  { slug: 'receipt-books', title: 'Receipt books', short: 'Carbon, duplicate', icon: 'i-lucide-receipt', to: '/products/receipt-books' },
]
</script>
