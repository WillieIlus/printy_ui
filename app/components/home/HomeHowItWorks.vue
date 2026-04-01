<template>
  <section id="how-it-works" class="scroll-mt-20 bg-[var(--p-bg)] py-16 sm:py-24">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-2xl text-center">
        <span class="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-flamingo-500">
          How it works
        </span>
        <h2 class="mt-3 text-3xl font-bold tracking-tight text-[var(--p-text)] sm:text-4xl">
          A cleaner route from selection to a production-ready quote
        </h2>
        <p class="mt-3 text-base leading-7 text-[var(--p-text)]">
          Choose a live catalog product, refine the specification, compare shops, and send one precise request.
        </p>
      </div>

      <div class="mt-12 grid gap-6 lg:grid-cols-[1.15fr_0.85fr_0.85fr]">
        <article class="rounded-2xl bg-[var(--p-surface)] p-1">
          <div class="h-full rounded-xl bg-[var(--p-surface-sunken)] p-8">
            <div class="flex items-start justify-between gap-4">
              <div>
                <span class="inline-flex rounded-full bg-[var(--p-surface-container)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--p-text)]">
                  Step 1
                </span>
                <h3 class="mt-5 text-2xl font-bold tracking-tight text-[var(--p-text)]">{{ steps[0].title }}</h3>
                <p class="mt-3 max-w-md text-sm leading-6 text-[var(--p-text)]">{{ steps[0].body }}</p>
              </div>
              <div :class="iconShellClass">
                <UIcon :name="steps[0].icon" class="h-7 w-7 text-flamingo-500" />
              </div>
            </div>

            <div class="mt-8 grid grid-cols-3 gap-4">
              <div
                v-for="size in sizes"
                :key="size.label"
                class="rounded-xl border border-[var(--p-border)] bg-white p-4 text-center shadow-sm"
              >
                <div
                  class="mx-auto mb-4 border-2 border-[var(--p-border)]/70 bg-[var(--p-surface-sunken)]"
                  :class="size.previewClass"
                />
                <p class="text-sm font-semibold text-[var(--p-text)]">{{ size.label }}</p>
                <p class="mt-1 text-xs text-[var(--p-text)]">{{ size.caption }}</p>
              </div>
            </div>
          </div>
        </article>

        <article
          v-for="step in steps.slice(1)"
          :key="step.number"
          class="rounded-2xl bg-[var(--p-surface)] p-1"
        >
          <div class="flex h-full flex-col rounded-xl bg-[var(--p-surface-sunken)] p-8">
            <div :class="iconShellClass">
              <UIcon :name="step.icon" class="h-7 w-7 text-flamingo-500" />
            </div>
            <span class="mt-6 text-[11px] font-semibold uppercase tracking-[0.12em] text-flamingo-500">
              Step {{ step.number }}
            </span>
            <h3 class="mt-3 text-2xl font-bold tracking-tight text-[var(--p-text)]">{{ step.title }}</h3>
            <p class="mt-3 text-sm leading-6 text-[var(--p-text)]">{{ step.body }}</p>
            <div class="mt-6 flex flex-wrap gap-2">
              <span
                v-for="tag in step.tags"
                :key="tag"
                class="rounded-full bg-[var(--p-surface-container)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--p-text)]"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const steps = [
  {
    number: 1,
    title: 'Choose a product and the right format',
    body: 'Start with real catalog products, then select the size, quantity, and production brief that matches the job.',
    icon: 'i-lucide-layout-panel-top',
    tags: ['Live catalog', 'Size options'],
  },
  {
    number: 2,
    title: 'Compare shops, pricing, and turnaround',
    body: 'Review nearby shops with pricing cues, delivery timing, and rating signals before sending the request.',
    icon: 'i-lucide-scale-3d',
    tags: ['Ratings', 'Delivery time'],
  },
  {
    number: 3,
    title: 'Send the request and track the response',
    body: 'Receive sent or revised quotes, accept the best option, and move the job into the next production step.',
    icon: 'i-lucide-send',
    tags: ['Revisions', 'Accepted quotes'],
  },
]

const sizes = [
  { label: 'Standard', caption: 'Classic card format', previewClass: 'h-10 w-16 rounded-sm' },
  { label: 'Rounded', caption: 'Modern edge', previewClass: 'h-10 w-16 rounded-lg' },
  { label: 'Square', caption: 'Compact impact', previewClass: 'h-12 w-12 rounded-sm' },
]

const iconShellClass = 'flex h-14 w-14 items-center justify-center rounded-xl border border-flamingo-400/30 bg-slate-950 shadow-[0_12px_30px_rgba(8,17,31,0.28)]'
</script>
