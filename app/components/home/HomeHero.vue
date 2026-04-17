<template>
  <section
    id="top"
    class="relative isolate w-full overflow-x-clip overflow-y-visible bg-[#08111f] pb-14 pt-12 text-white sm:pb-16 sm:pt-16 lg:pb-[4.5rem] lg:pt-20"
  >
    <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(247,115,68,0.12),transparent_30%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.14),transparent_28%),linear-gradient(to_bottom,rgba(15,23,42,0.98),rgba(8,17,31,1))]" />

    <div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid items-start gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-16">
        <div class="lg:col-span-5 lg:pt-6">
          <div class="mb-6 inline-flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-medium text-slate-200 backdrop-blur-sm">
            <span class="rounded-full bg-flamingo-500/15 px-2.5 py-1 text-flamingo-300">Real production logic</span>
            <span class="text-slate-500">/</span>
            <span>Cleaner requests</span>
            <span class="text-slate-500">/</span>
            <span>Faster quoting</span>
          </div>

          <p class="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-flamingo-300">
            ENGINEERED FOR REAL PRINT PRICING
          </p>

          <h1 class="max-w-[13.5ch] text-[clamp(2.25rem,3.7vw,3.45rem)] font-black leading-[0.98] tracking-[-0.04em] text-white text-balance">
            Stop guessing print prices.
          </h1>

          <p class="mt-6 max-w-xl text-base leading-8 text-slate-300 sm:text-[1.05rem]">
            Know your cost before calling any shop. Built on real production logic so buyers move faster and print shops receive cleaner requests.
          </p>

          <div class="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              class="inline-flex h-11 items-center justify-center rounded-xl bg-flamingo-500 px-6 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(240,82,36,0.22)] transition-colors hover:bg-flamingo-400"
              @click="startPricing"
            >
              Start pricing
            </button>
            <NuxtLink
              to="/auth/signup?role=shop_owner"
              class="inline-flex h-11 items-center justify-center rounded-xl border border-white/14 bg-white/[0.02] px-6 text-sm font-semibold text-slate-100 transition-colors hover:bg-white/[0.08]"
            >
              I Own a Print Shop
            </NuxtLink>
          </div>

          <div class="mt-8 grid gap-3 sm:grid-cols-3">
            <div
              v-for="item in proofItems"
              :key="item.title"
              class="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
            >
              <p class="text-sm font-semibold text-white">{{ item.title }}</p>
              <p class="mt-1 text-sm leading-6 text-slate-400">{{ item.copy }}</p>
            </div>
          </div>
        </div>

        <!-- Zero-height anchor on lg+: only the left column drives the grid row height.
             The inner wrapper is absolute so the calculator can grow downward past the
             hero boundary without stretching the dark background. -->
        <div id="hero-calculator" class="relative z-10 lg:col-span-7">
          <div class="lg:absolute lg:left-0 lg:right-0 lg:top-0">
            <ClientOnly>
              <HomeHeroCalculator ref="heroCalcRef" />
              <template #fallback>
                <div class="h-[640px] rounded-3xl border border-white/10 bg-slate-900/50 backdrop-blur-xl" />
              </template>
            </ClientOnly>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import HomeHeroCalculator from '~/components/home/HomeHeroCalculator.vue'

/**
 * Template ref to the hero calculator instance (only available client-side,
 * since the component is inside <ClientOnly>).
 * The name must match the ref="heroCalcRef" attribute in the template.
 */
const heroCalcRef = ref<InstanceType<typeof HomeHeroCalculator> | null>(null)

/**
 * Primary CTA handler for "Start pricing".
 *
 * Preferred path: call expand() on the calculator component directly so it
 * can open itself, scroll into view, and grab focus in one coordinated step.
 *
 * Fallback (ClientOnly not yet hydrated — should not happen at click time
 * but included for safety): plain scrollIntoView on the column anchor.
 */
function startPricing() {
  if (heroCalcRef.value) {
    heroCalcRef.value.expand()
  }
  else {
    document.getElementById('hero-calculator')
      ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }
}

const proofItems = [
  {
    title: 'Instant pricing',
    copy: 'See smart pricing signals before the first call.',
  },
  {
    title: 'Nearby shops matched',
    copy: 'Compare real providers already close to the job.',
  },
  {
    title: 'Real sheet calculations',
    copy: 'Built on production logic, not generic estimates.',
  },
] as const
</script>
