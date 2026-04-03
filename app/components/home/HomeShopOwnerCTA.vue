<template>
  <section class="bg-[var(--p-surface)] py-16 sm:py-24">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div class="overflow-hidden rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface-raised)] text-[var(--p-text)] shadow-[0_18px_48px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(17,24,39,0.92))] dark:text-white dark:shadow-[0_24px_60px_rgba(0,0,0,0.4)]">
        <div class="relative grid gap-8 p-8 sm:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:p-14">
          <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(247,91,28,0.12),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_58%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(247,91,28,0.2),transparent_36%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_58%)]" />
          <div class="absolute right-0 top-0 h-48 w-48 rounded-full bg-flamingo-500/18 blur-3xl dark:bg-flamingo-500/22" />

          <div class="relative z-10">
            <span class="inline-flex rounded-full bg-flamingo-500/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-flamingo-500">
              Try Printy
            </span>
            <h2 class="mt-5 text-3xl font-extrabold tracking-tight text-[var(--p-text)] sm:text-4xl dark:text-white">
              Start with the calculator, then send a cleaner print request
            </h2>
            <p class="mt-4 max-w-2xl text-base leading-7 text-[var(--p-text-dim)] dark:text-slate-200/92">
              Use live pricing to understand the job first, then compare shops or open a request once the basics are already clear.
            </p>

            <div class="mt-8 flex flex-col gap-4 sm:flex-row">
              <NuxtLink
                :to="primaryCtaTo"
                class="cta-button group inline-flex items-center justify-center gap-2 rounded-xl bg-flamingo-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-flamingo-500/20 transition-colors hover:bg-flamingo-400 hover:shadow-flamingo-500/30"
              >
                {{ primaryCtaLabel }}
                <UIcon name="i-lucide-arrow-right" class="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </NuxtLink>
              <NuxtLink
                :to="secondaryCtaTo"
                class="cta-button inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] px-6 py-3.5 text-sm font-bold text-[var(--p-text)] shadow-sm transition-colors hover:bg-[var(--p-surface-sunken)] dark:border-white/16 dark:bg-white/[0.08] dark:text-white dark:hover:bg-white/[0.14]"
              >
                {{ secondaryCtaLabel }}
                <UIcon name="i-lucide-store" class="h-4 w-4" />
              </NuxtLink>
            </div>
          </div>

          <div class="relative z-10 grid gap-4 sm:grid-cols-2">
            <div
              v-for="item in highlights"
              :key="item.title"
              class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none"
            >
              <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-flamingo-500/12 ring-1 ring-flamingo-500/14 dark:bg-flamingo-500/14 dark:ring-flamingo-500/22">
                <UIcon :name="item.icon" class="h-6 w-6 text-flamingo-500" />
              </div>
              <h3 class="mt-4 text-base font-semibold text-[var(--p-text)] dark:text-white">{{ item.title }}</h3>
              <p class="mt-2 text-sm leading-6 text-[var(--p-text-dim)] dark:text-slate-200/90">{{ item.body }}</p>
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
    primaryCtaTo?: string
    primaryCtaLabel?: string
    secondaryCtaTo?: string
    secondaryCtaLabel?: string
  }>(),
  {
    primaryCtaTo: '/#demo',
    primaryCtaLabel: 'Try live pricing',
    secondaryCtaTo: '/shops',
    secondaryCtaLabel: 'Browse shops',
  },
)

const highlights = [
  {
    title: 'Configure before you call',
    body: 'Start with product, quantity, paper, and finishing so you already know the shape of the job.',
    icon: 'i-lucide-sliders-horizontal',
  },
  {
    title: 'See pricing early',
    body: 'Use the live calculator to get orientation on cost before you commit to one shop.',
    icon: 'i-lucide-badge-dollar-sign',
  },
  {
    title: 'Compare nearby options',
    body: 'Move from pricing into shop comparison without restarting the whole process.',
    icon: 'i-lucide-map-pinned',
  },
  {
    title: 'Send a cleaner request',
    body: 'When you are ready, share a more complete brief that is easier for shops to respond to.',
    icon: 'i-lucide-send',
  },
]
</script>
