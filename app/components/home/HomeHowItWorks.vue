<template>
  <section
    id="how-it-works"
    class="how-it-works-section relative left-1/2 w-screen max-w-none -translate-x-1/2 scroll-mt-20 py-24 text-white sm:py-32"
    :style="sectionBackgroundStyle"
  >
    <div class="how-it-works-overlay" />
    <div class="how-it-works-glow" />

    <div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-2xl text-center">
        <span class="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-flamingo-400">
          How it works
        </span>
        <h2 class="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          A cleaner route from selection to a production-ready quote
        </h2>
        <p class="mt-3 text-base leading-7 text-slate-200">
          Choose a live catalog product, refine the specification, compare shops, and send one precise request.
        </p>
      </div>

      <div class="mt-14 grid gap-6 lg:grid-cols-[1.15fr_0.85fr_0.85fr]">
        <article class="rounded-[1.85rem] border border-white/14 bg-white/92 p-1.5 shadow-[0_28px_70px_rgba(0,0,0,0.28)] backdrop-blur-xl">
          <div class="h-full rounded-[1.45rem] border border-slate-200/80 bg-white p-8 sm:p-9">
            <div class="flex items-start justify-between gap-4">
              <div>
                <span class="inline-flex rounded-full bg-slate-950 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
                  Step 1
                </span>
                <h3 class="mt-5 text-2xl font-bold tracking-tight text-slate-950">{{ steps[0].title }}</h3>
                <p class="mt-3 max-w-md text-sm leading-6 text-slate-700">{{ steps[0].body }}</p>
              </div>
              <div :class="iconShellClass">
                <UIcon :name="steps[0].icon" class="h-7 w-7 text-flamingo-400" />
              </div>
            </div>

            <div class="mt-8 grid grid-cols-3 gap-4">
              <div
                v-for="size in sizes"
                :key="size.label"
                class="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center shadow-sm"
              >
                <div
                  class="mx-auto mb-4 border-2 border-slate-300/70 bg-white"
                  :class="size.previewClass"
                />
                <p class="text-sm font-semibold text-slate-900">{{ size.label }}</p>
                <p class="mt-1 text-xs text-slate-600">{{ size.caption }}</p>
              </div>
            </div>
          </div>
        </article>

        <article
          v-for="step in steps.slice(1)"
          :key="step.number"
          class="rounded-[1.85rem] border border-white/12 bg-slate-950/60 p-1.5 shadow-[0_24px_60px_rgba(0,0,0,0.26)] backdrop-blur-xl"
        >
          <div class="flex h-full flex-col rounded-[1.45rem] border border-white/10 bg-slate-950/68 p-8 sm:p-9">
            <div :class="iconShellClass">
              <UIcon :name="step.icon" class="h-7 w-7 text-flamingo-400" />
            </div>
            <span class="mt-6 text-[11px] font-semibold uppercase tracking-[0.12em] text-flamingo-400">
              Step {{ step.number }}
            </span>
            <h3 class="mt-3 text-2xl font-bold tracking-tight text-white">{{ step.title }}</h3>
            <p class="mt-3 text-sm leading-6 text-slate-200">{{ step.body }}</p>
            <div class="mt-6 flex flex-wrap gap-2">
              <span
                v-for="tag in step.tags"
                :key="tag"
                class="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-100"
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
const nairobiBackgroundUrl = '/home/nairobi-skyline-parallax.svg'

const sectionBackgroundStyle = {
  backgroundImage: `url("${nairobiBackgroundUrl}")`,
}

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

const iconShellClass = 'flex h-14 w-14 items-center justify-center rounded-xl border border-flamingo-400/30 bg-slate-950 shadow-[0_14px_34px_rgba(8,17,31,0.3)]'
</script>

<style scoped>
.how-it-works-section {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  background-color: #08111f;
  background-position: center bottom;
  background-size: cover;
  background-repeat: no-repeat;
}

.how-it-works-overlay {
  position: absolute;
  inset: 0;
  z-index: -2;
  background:
    linear-gradient(180deg, rgb(4 10 20 / 0.58) 0%, rgb(5 11 20 / 0.7) 26%, rgb(6 11 19 / 0.82) 56%, rgb(7 12 20 / 0.9) 100%);
}

.how-it-works-glow {
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    radial-gradient(circle at 18% 18%, rgb(247 91 28 / 0.16), transparent 24rem),
    radial-gradient(circle at 84% 74%, rgb(247 91 28 / 0.08), transparent 22rem);
}

@media (min-width: 1024px) {
  .how-it-works-section {
    background-attachment: fixed;
    background-position: center 78%;
    background-size: 112% auto;
  }
}

@media (max-width: 1023px), (prefers-reduced-motion: reduce) {
  .how-it-works-section {
    background-attachment: scroll;
    background-position: center bottom;
    background-size: cover;
  }
}
</style>
