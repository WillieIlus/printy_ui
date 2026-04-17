<template>
  <section id="locations" class="scroll-mt-28 bg-[var(--p-bg)] py-12 sm:py-16">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

      <!-- Section header -->
      <div class="mb-7 sm:mb-8">
        <span class="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-flamingo-500">
          Locations
        </span>
        <h2 class="mt-1.5 text-xl font-bold tracking-tight text-[var(--p-text)] sm:text-2xl">
          Browse print shops by location
        </h2>
      </div>

      <!-- Location card grid -->
      <div class="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3">
        <NuxtLink
          v-for="loc in locations"
          :key="loc.slug"
          :to="`/locations/${loc.slug}`"
          class="group rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-flamingo-300/50 hover:shadow-md dark:hover:border-flamingo-700/40"
        >
          <!-- Icon + shop count -->
          <div class="flex items-center justify-between gap-3">
            <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-flamingo-500/10">
              <UIcon :name="loc.icon" class="h-[18px] w-[18px] text-flamingo-500" />
            </div>
            <span class="rounded-full bg-[var(--p-surface-container)] px-2.5 py-0.5 text-[11px] font-semibold tabular-nums text-[var(--p-text-muted)]">
              {{ loc.shopsLabel }}
            </span>
          </div>

          <!-- Name + descriptor -->
          <div class="mt-4">
            <h3 class="text-base font-bold tracking-tight text-[var(--p-text)] transition-colors group-hover:text-flamingo-500 sm:text-lg">
              {{ loc.name }}
            </h3>
            <p class="mt-0.5 line-clamp-1 text-xs leading-5 text-[var(--p-text-muted)] sm:text-sm">
              {{ loc.descriptor }}
            </p>
          </div>

          <!-- Tags -->
          <div class="mt-4 flex flex-wrap gap-1.5">
            <span
              v-for="tag in loc.tags"
              :key="tag"
              class="rounded-full bg-[var(--p-surface-container)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--p-text-muted)]"
            >
              {{ tag }}
            </span>
          </div>
        </NuxtLink>
      </div>

      <!-- Footer CTA -->
      <div class="mt-8 text-center">
        <NuxtLink
          to="/locations"
          class="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--p-text-muted)] transition-colors hover:text-flamingo-500"
        >
          View all locations
          <UIcon name="i-lucide-arrow-right" class="h-3.5 w-3.5" />
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
    descriptor: 'Largest commercial print hub',
    icon: 'i-lucide-building-2',
    tags: ['Corporate print', 'Fast quotes'],
  },
  {
    slug: 'westlands',
    name: 'Westlands',
    descriptor: 'Agency & marketing collateral',
    icon: 'i-lucide-briefcase-business',
    tags: ['Branding', 'Short runs'],
  },
  {
    slug: 'kilimani',
    name: 'Kilimani',
    descriptor: 'Studio, events & creative assets',
    icon: 'i-lucide-palette',
    tags: ['Menus', 'Event print'],
  },
  {
    slug: 'cbd',
    name: 'CBD',
    descriptor: 'Same-day walk-in access',
    icon: 'i-lucide-map-pinned',
    tags: ['Same day', 'Business cards'],
  },
  {
    slug: 'industrial-area',
    name: 'Industrial Area',
    descriptor: 'Bulk & large-format capacity',
    icon: 'i-lucide-factory',
    tags: ['Bulk print', 'Large format'],
  },
  {
    slug: 'mombasa',
    name: 'Mombasa',
    descriptor: 'Hospitality & coastal operations',
    icon: 'i-lucide-ship-wheel',
    tags: ['Hospitality', 'Regional reach'],
  },
].map((loc) => ({
  ...loc,
  shopsLabel: `${HERO_LOCATION_METADATA[loc.slug]?.shops ?? 0} shops`,
}))
</script>
