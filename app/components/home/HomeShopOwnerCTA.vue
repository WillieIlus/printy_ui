<template>
  <section class="bg-[var(--p-surface)] py-16 sm:py-24">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div class="overflow-hidden rounded-3xl bg-[var(--p-text)] text-white">
        <div class="relative grid gap-8 p-8 sm:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:p-14">
          <div class="absolute right-0 top-0 h-48 w-48 rounded-full bg-white/10 blur-3xl" />

          <div class="relative z-10">
            <span class="inline-flex rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/80">
              For Print Shops
            </span>
            <h2 class="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Manage requests, quotes, revisions, and production from one place
            </h2>
            <p class="mt-4 max-w-2xl text-base leading-7 text-slate-300">
              Set up your catalog, respond to incoming requests faster, track accepted quotes, and keep the team aligned on turnaround.
            </p>

            <div class="mt-8 flex flex-col gap-4 sm:flex-row">
              <NuxtLink
                :to="primaryCtaTo"
                class="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-[var(--p-text)] transition-colors hover:bg-slate-100"
              >
                {{ primaryCtaLabel }}
                <UIcon name="i-lucide-arrow-right" class="h-4 w-4" />
              </NuxtLink>
              <NuxtLink
                :to="secondaryCtaTo"
                class="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-white/10"
              >
                {{ secondaryCtaLabel }}
                <UIcon name="i-lucide-layout-dashboard" class="h-4 w-4" />
              </NuxtLink>
            </div>
          </div>

          <div class="relative z-10 grid gap-4 sm:grid-cols-2">
            <div
              v-for="item in highlights"
              :key="item.title"
              class="rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                <UIcon :name="item.icon" class="h-6 w-6 text-white" />
              </div>
              <h3 class="mt-4 text-base font-semibold text-white">{{ item.title }}</h3>
              <p class="mt-2 text-sm leading-6 text-slate-300">{{ item.body }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    headline?: string
    body?: string
    primaryCtaTo?: string
    primaryCtaLabel?: string
    secondaryCtaTo?: string
    secondaryCtaLabel?: string
  }>(),
  {
    primaryCtaTo: '/auth/signup',
    primaryCtaLabel: 'Create your shop',
    secondaryCtaTo: '/dashboard',
    secondaryCtaLabel: 'View dashboard',
  },
)

const highlights = [
  {
    title: 'Quote inbox',
    body: 'Review submitted requests, send revisions, and track accepted quotes from one workflow.',
    icon: 'i-lucide-inbox',
  },
  {
    title: 'Product and pricing control',
    body: 'Keep catalog products, paper pricing, machines, and turnaround settings aligned.',
    icon: 'i-lucide-package-search',
  },
  {
    title: 'Production handoff',
    body: 'Move accepted work into the next operational step without losing quote context.',
    icon: 'i-lucide-clipboard-list',
  },
  {
    title: 'Operational visibility',
    body: 'See what is awaiting response, what was accepted, and what is ready for fulfillment.',
    icon: 'i-lucide-chart-column',
  },
]
</script>
