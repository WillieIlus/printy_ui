<template>
  <section class="bg-[var(--p-bg)] py-16 sm:py-24">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-2xl text-center">
        <span class="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-[var(--p-primary)]">
          Popular Locations
        </span>
        <h2 class="mt-3 text-3xl font-bold tracking-tight text-[var(--p-text)] sm:text-4xl">
          Start with the locations where demand is highest
        </h2>
        <p class="mt-3 text-base leading-7 text-[var(--p-text-muted)]">
          Pick a location first when you already know where the job should be printed, collected, or delivered.
        </p>
      </div>

      <div class="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <NuxtLink
          v-for="loc in locations"
          :key="loc.slug"
          :to="`/locations/${loc.slug}`"
          class="group rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-1 transition-all duration-300 hover:-translate-y-1 hover:border-flamingo-300/40 hover:bg-[var(--p-surface-container)] dark:hover:border-flamingo-700/40"
        >
          <div class="flex h-full flex-col rounded-xl bg-[var(--p-surface-sunken)] p-6">
            <div class="flex items-start justify-between gap-4">
              <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-flamingo-500/12 shadow-sm">
                <UIcon :name="loc.icon" class="h-6 w-6 text-flamingo-500" />
              </div>
              <span class="rounded-full bg-[var(--p-surface-container)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--p-text-muted)]">
                {{ loc.shopsLabel }}
              </span>
            </div>

            <h3 class="mt-6 text-2xl font-bold tracking-tight text-[var(--p-text)]">{{ loc.name }}</h3>
            <p class="mt-2 text-sm leading-6 text-[var(--p-text-muted)]">{{ loc.description }}</p>

            <div class="mt-5 flex flex-wrap gap-2">
              <span
                v-for="tag in loc.tags"
                :key="tag"
                class="rounded-full bg-[var(--p-surface)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--p-text-muted)] shadow-sm"
              >
                {{ tag }}
              </span>
            </div>

            <div class="mt-8 flex items-center justify-between border-t border-[var(--p-border)] pt-4">
              <div>
                <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--p-text-muted)]">Best for</p>
                <p class="mt-1 text-sm font-semibold text-[var(--p-text)]">{{ loc.caption }}</p>
              </div>
              <span class="flex h-11 w-11 items-center justify-center rounded-full bg-flamingo-500 text-white transition-transform group-hover:translate-x-0.5">
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
import { HERO_LOCATION_METADATA } from '~/components/home/heroLocationMetadata'

const locations = [
  {
    slug: 'nairobi',
    name: 'Nairobi',
    description: 'The broadest mix of commercial print shops, express turnaround, and corporate-ready vendors.',
    caption: 'Corporate jobs and high-volume requests',
    icon: 'i-lucide-building-2',
    tags: ['Corporate print', 'Fast quotes'],
  },
  {
    slug: 'westlands',
    name: 'Westlands',
    description: 'Ideal for agency work, polished marketing collateral, and premium small-batch printing.',
    caption: 'Brand and campaign work',
    icon: 'i-lucide-briefcase-business',
    tags: ['Branding', 'Short runs'],
  },
  {
    slug: 'kilimani',
    name: 'Kilimani',
    description: 'A strong option for studio print jobs, event materials, menus, and creative business assets.',
    caption: 'Studios, menus, promo jobs',
    icon: 'i-lucide-palette',
    tags: ['Menus', 'Event print'],
  },
  {
    slug: 'cbd',
    name: 'CBD',
    description: 'Best for walk-in convenience, urgent business stationery, and quick same-day production.',
    caption: 'Fast access and dense vendor coverage',
    icon: 'i-lucide-map-pinned',
    tags: ['Same day', 'Business cards'],
  },
  {
    slug: 'industrial-area',
    name: 'Industrial Area',
    description: 'Built for volume, packaging, large format, and heavier commercial production requirements.',
    caption: 'Bulk and large-format capacity',
    icon: 'i-lucide-factory',
    tags: ['Bulk print', 'Large format'],
  },
  {
    slug: 'mombasa',
    name: 'Mombasa',
    description: 'Coastal print capacity for hospitality, events, branding, and regional business operations.',
    caption: 'Tourism and hospitality demand',
    icon: 'i-lucide-ship-wheel',
    tags: ['Hospitality', 'Regional reach'],
  },
].map((location) => ({
  ...location,
  shopsLabel: `${HERO_LOCATION_METADATA[location.slug]?.shops ?? 0} shops`,
}))
</script>
