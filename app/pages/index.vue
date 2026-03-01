<template>
  <div>
    <!-- Hero (sample.txt: gray-900, blob effects, primary-400 accent) -->
    <section id="top" class="relative overflow-hidden bg-[#101828] py-20 sm:py-32 w-screen max-w-none left-1/2 -translate-x-1/2">
      <div class="absolute inset-0 opacity-20">
        <div class="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" />
        <div class="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000" />
        <div class="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-4000" />
      </div>
      <div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
          <div class="max-w-2xl">
            <div class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur-sm">
              <span class="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Not a marketplace — a pricing brain for your print shop
            </div>
            <h1 class="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Quote print jobs <br class="hidden lg:block"> <span class="text-[#e13515]">in seconds.</span>
            </h1>
            <p class="mt-6 text-lg text-gray-300 leading-relaxed">
              Printy mirrors how real print shops calculate pricing—using your machines, your materials, and your operational costs to generate fast, accurate quotes for <span class="text-white font-semibold">digital</span> and <span class="text-white font-semibold">large format</span> work.
            </p>
            <div class="mt-8 flex flex-col sm:flex-row gap-4">
              <NuxtLink to="/gallery" class="inline-flex items-center justify-center rounded-xl bg-white/90 dark:bg-gray-100 px-6 py-3.5 text-sm font-bold text-[#101828] dark:text-gray-900 hover:bg-white dark:hover:bg-gray-200 transition-colors">
                View Gallery Demo
                <UIcon name="i-lucide-chevron-right" class="ml-2 w-4 h-4" />
              </NuxtLink>
              <NuxtLink to="/#models" class="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-bold text-white hover:bg-white/10 transition-colors backdrop-blur-sm">
                How Pricing Works
              </NuxtLink>
            </div>
          </div>
          <div class="mt-16 lg:mt-0 relative">
            <LandingLandingQuoteSimulator ref="simulatorRef" v-model="demoForm" />
          </div>
        </div>
      </div>
    </section>

    <!-- Problem (sample: white bg, rounded-3xl cards, gray-50 card bg) -->
    <section id="problem" class="py-16 sm:py-24 bg-[#f3f6fc] dark:bg-[#101828]">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="max-w-2xl mx-auto text-center mb-16">
          <p class="text-sm font-bold uppercase tracking-wider text-[#e13515]">The Problem</p>
          <h2 class="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Print pricing is often slow, inconsistent, and risky.
          </h2>
          <p class="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Most shops rely on mental math or spreadsheets. That makes quotes vary between staff and causes underpricing.
          </p>
        </div>
        <div class="grid gap-8 sm:grid-cols-3">
          <div class="rounded-3xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 p-8 shadow-sm hover:shadow-md transition-shadow">
            <div class="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 mb-4">
              <UIcon name="i-lucide-clock" class="w-6 h-6" />
            </div>
            <h3 class="text-lg font-bold text-[#101828] dark:text-white">Slow quotes</h3>
            <p class="mt-2 text-gray-600 dark:text-gray-400">Busy counters can't afford manual calculations for every walk-in customer.</p>
          </div>
          <div class="rounded-3xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 p-8 shadow-sm hover:shadow-md transition-shadow">
            <div class="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 mb-4">
              <UIcon name="i-lucide-trending-up" class="w-6 h-6" />
            </div>
            <h3 class="text-lg font-bold text-[#101828] dark:text-white">Inconsistent pricing</h3>
            <p class="mt-2 text-gray-600 dark:text-gray-400">Same job, different staff member, different price. Customers lose trust.</p>
          </div>
          <div class="rounded-3xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 p-8 shadow-sm hover:shadow-md transition-shadow">
            <div class="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 mb-4">
              <UIcon name="i-lucide-file-warning" class="w-6 h-6" />
            </div>
            <h3 class="text-lg font-bold text-[#101828] dark:text-white">Underpricing risk</h3>
            <p class="mt-2 text-gray-600 dark:text-gray-400">Finishing and material costs often get missed in rush estimates.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Gallery CTA (sample: gray-50, border-gray-200) -->
    <section id="demo-gallery" class="py-16 sm:py-24 bg-[#e7edf7] dark:bg-[#101828]/50 border-t border-gray-200 dark:border-gray-800">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <span class="text-[#e13515] font-semibold text-sm uppercase tracking-wider">The Customer Experience</span>
        <h2 class="mt-2 text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Browse Templates</h2>
        <p class="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Pre-configured templates that use your pricing logic in the background.
        </p>
        <NuxtLink to="/gallery" class="mt-8 btn-primary inline-flex items-center justify-center rounded-xl px-6 py-3.5 text-sm font-bold shadow-md transition-all hover:shadow-[#e13515]/40">
          Browse Template Gallery
        </NuxtLink>
      </div>
    </section>

    <!-- Pricing logic (sample: gray-50 cards, rounded-3xl) -->
    <section id="models" class="py-16 sm:py-24 bg-[#f3f6fc] dark:bg-[#101828]">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="max-w-2xl">
          <p class="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Under the Hood</p>
          <h2 class="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            How the calculation works
          </h2>
          <p class="mt-4 text-base text-gray-600 dark:text-gray-400">
            Two engines drive the pricing: Digital is sheet-based, Large Format is area-based. Finishing attaches cleanly to both.
          </p>
        </div>
        <div class="mt-10 grid gap-8 lg:grid-cols-2">
          <div class="rounded-3xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-6 sm:p-8">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">Digital Engine</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">Per sheet & per side logic (SRA3 / SRA4)</p>
            <div class="rounded-xl bg-white dark:bg-gray-800 p-4 shadow-sm border border-gray-100 dark:border-gray-700 font-mono text-xs sm:text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <p>material = sheets_needed × cost_per_sheet</p>
              <p>printing = sheets_needed × sides × click_cost</p>
              <p>total = material + printing + finishing</p>
            </div>
          </div>
          <div class="rounded-3xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-6 sm:p-8">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">Large Format</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">Area-based logic (per m²)</p>
            <div class="rounded-xl bg-white dark:bg-gray-800 p-4 shadow-sm border border-gray-100 dark:border-gray-700 font-mono text-xs sm:text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <p>area = width × height × quantity</p>
              <p>material = area × material_cost_per_m²</p>
              <p>total = material + printing + finishing</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA (sample: gray-900, primary button with shadow) -->
    <section id="cta" class="py-16 sm:py-24 bg-[#101828] text-white">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-extrabold tracking-tight sm:text-4xl mb-4">
          Turn pricing from guesswork into a system.
        </h2>
        <p class="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
          Configure your shop once and generate fast, accurate, and profitable quotes every time.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink to="/auth/signup" class="btn-primary inline-flex items-center justify-center rounded-xl px-6 py-3.5 text-sm font-bold shadow-lg transition-colors hover:shadow-[#e13515]/40">
            Create your first shop
          </NuxtLink>
          <NuxtLink to="/gallery" class="inline-flex items-center justify-center rounded-xl bg-white/10 px-6 py-3.5 text-sm font-bold text-white hover:bg-white/20 transition-colors backdrop-blur-sm">
            Back to Gallery
          </NuxtLink>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import type { DemoFormState, DemoPreset } from '~/shared/demoRateCard'

definePageMeta({
  layout: 'default',
})

const demoForm = ref<Partial<DemoFormState>>({})
const simulatorRef = ref<InstanceType<typeof import('~/components/landing/LandingQuoteSimulator.vue').default> | null>(null)

function applyPreset(preset: DemoPreset) {
  const formUpdate: Partial<DemoFormState> = {
    unit: preset.unit,
    sides: preset.sides,
    quantity: preset.quantity,
    material: preset.material,
    finishing: [...preset.finishing],
    widthM: preset.widthM ?? 1,
    heightM: preset.heightM ?? 1,
  }
  demoForm.value = formUpdate
  simulatorRef.value?.applyPreset(formUpdate)
  // Scroll to hero simulator so user sees the update
  document.getElementById('top')?.scrollIntoView({ behavior: 'smooth' })
}
</script>
