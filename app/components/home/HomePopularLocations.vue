<template>
  <section class="bg-[var(--p-bg)] py-16 sm:py-24">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-2xl text-center">
        <span class="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-[var(--p-primary)]">
          Popular Locations
        </span>
        <h2 class="mt-3 text-3xl font-bold tracking-tight text-[var(--p-text)] sm:text-4xl">
          Browse active print hubs across Kenya&apos;s busiest business districts
        </h2>
        <p class="mt-3 text-base leading-7 text-[var(--p-text-muted)]">
          Jump straight into the areas where print demand is strongest, compare nearby shops, and start from the location that fits your job best.
        </p>
      </div>

      <div class="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <NuxtLink
          v-for="loc in locations"
          :key="loc.slug"
          :to="`/locations/${loc.slug}`"
          class="group rounded-2xl bg-[var(--p-surface)] p-1 transition-all duration-300 hover:-translate-y-1 hover:bg-[var(--p-surface-container)]"
        >
          <div class="flex h-full flex-col rounded-xl bg-[var(--p-surface-sunken)] p-6">
            <div class="flex items-start justify-between gap-4">
              <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
                <UIcon :name="loc.icon" class="h-6 w-6 text-[var(--p-primary)]" />
              </div>
              <span class="rounded-full bg-[var(--p-surface-container)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--p-text-muted)]">
                {{ loc.badge }}
              </span>
            </div>

            <h3 class="mt-6 text-2xl font-bold tracking-tight text-[var(--p-text)]">{{ loc.name }}</h3>
            <p class="mt-2 text-sm leading-6 text-[var(--p-text-muted)]">{{ loc.description }}</p>

            <div class="mt-5 flex flex-wrap gap-2">
              <span
                v-for="tag in loc.tags"
                :key="tag"
                class="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--p-text-muted)] shadow-sm"
              >
                {{ tag }}
              </span>
            </div>

            <div class="mt-8 flex items-center justify-between border-t border-white/50 pt-4">
              <div>
                <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--p-text-muted)]">Explore Area</p>
                <p class="mt-1 text-sm font-semibold text-[var(--p-text)]">{{ loc.caption }}</p>
              </div>
              <span class="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--p-primary)] text-white transition-transform group-hover:translate-x-0.5">
                <UIcon name="i-lucide-arrow-right" class="h-5 w-5" />
              </span>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const locations = [
  {
    slug: 'nairobi',
    name: 'Nairobi',
    description: 'The broadest mix of commercial print shops, express turnaround, and corporate-ready vendors.',
    badge: 'High Volume',
    caption: 'CBD, Westlands, Kilimani and more',
    icon: 'i-lucide-building-2',
    tags: ['Corporate print', 'Fast quotes'],
  },
  {
    slug: 'westlands',
    name: 'Westlands',
    description: 'Ideal for agency work, polished marketing collateral, and premium small-batch printing.',
    badge: 'Premium',
    caption: 'Brand and campaign work',
    icon: 'i-lucide-briefcase-business',
    tags: ['Branding', 'Short runs'],
  },
  {
    slug: 'kilimani',
    name: 'Kilimani',
    description: 'A strong option for studio print jobs, event materials, menus, and creative business assets.',
    badge: 'Creative',
    caption: 'Studios, menus, promo jobs',
    icon: 'i-lucide-palette',
    tags: ['Menus', 'Event print'],
  },
  {
    slug: 'cbd',
    name: 'CBD',
    description: 'Best for walk-in convenience, urgent business stationery, and quick same-day production.',
    badge: 'Express',
    caption: 'Fast access and dense vendor coverage',
    icon: 'i-lucide-map-pinned',
    tags: ['Same day', 'Business cards'],
  },
  {
    slug: 'industrial-area',
    name: 'Industrial Area',
    description: 'Built for volume, packaging, large format, and heavier commercial production requirements.',
    badge: 'Production',
    caption: 'Bulk and large-format capacity',
    icon: 'i-lucide-factory',
    tags: ['Bulk print', 'Large format'],
  },
  {
    slug: 'mombasa',
    name: 'Mombasa',
    description: 'Coastal print capacity for hospitality, events, branding, and regional business operations.',
    badge: 'Coastal',
    caption: 'Tourism and hospitality demand',
    icon: 'i-lucide-ship-wheel',
    tags: ['Hospitality', 'Regional reach'],
  },
  {
    slug: 'kisumu',
    name: 'Kisumu',
    description: 'Growing lakeside print market with strong demand for retail, corporate, and school-related jobs.',
    badge: 'Regional',
    caption: 'Retail and institutional work',
    icon: 'i-lucide-land-plot',
    tags: ['Schools', 'Retail print'],
  },
]
</script>
