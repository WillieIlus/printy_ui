<template>
  <section id="gallery" class="relative z-0 scroll-mt-28 bg-[var(--p-surface-sunken)] pb-12 pt-12 sm:pb-16 sm:pt-16 lg:pb-16 lg:pt-48 xl:pt-56">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mb-7 flex items-end justify-between sm:mb-8">
        <div>
          <span class="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-flamingo-500">Products</span>
          <h2 class="mt-1.5 text-xl font-bold tracking-tight text-[var(--p-text)] sm:text-2xl">
            Start from the products people actually print
          </h2>
          <p class="mt-2 max-w-xl text-sm leading-6 text-[var(--p-text-muted)]">
            Printy is product-led: real business cards, flyers, brochures, stickers, and banners with pricing signals that feel closer to production reality than a generic template gallery.
          </p>
        </div>
        <NuxtLink
          to="/gallery"
          class="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--p-text-muted)] transition-colors hover:text-flamingo-500"
        >
          See all
          <UIcon name="i-lucide-arrow-right" class="h-3.5 w-3.5" />
        </NuxtLink>
      </div>

      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
        <ProductsProductGalleryCard
          v-for="product in displayProducts"
          :key="product.id"
          :product="product"
          :to="product.slug ? `/products/${product.slug}` : null"
          action-label="View product"
        />
      </div>

      <div class="mt-8 text-center">
        <NuxtLink
          to="/gallery"
          class="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--p-text-muted)] transition-colors hover:text-flamingo-500"
        >
          Browse the full gallery
          <UIcon name="i-lucide-arrow-right" class="h-3.5 w-3.5" />
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { publicProducts } = await usePublicProducts({ key: 'home-public-products' })

const displayProducts = computed(() =>
  publicProducts.value
    .filter((product) => Boolean(product.slug))
    .slice(0, 6),
)
</script>
