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

    <!-- Interactive Demo Calculator (no login required) -->
    <section id="models" class="py-16 sm:py-24 bg-[#f3f6fc] dark:bg-[#101828]">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="max-w-2xl mb-10">
          <div class="inline-flex items-center gap-2 rounded-full border border-amber-300 dark:border-amber-700 bg-amber-100 dark:bg-amber-900/30 px-3 py-1 text-xs font-bold text-amber-700 dark:text-amber-400 mb-4">
            <UIcon name="i-lucide-flask-conical" class="h-3.5 w-3.5" />
            Demo — No login required
          </div>
          <h2 class="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Try the pricing calculator
          </h2>
          <p class="mt-4 text-base text-gray-600 dark:text-gray-400">
            Select a product, tweak options, and see how pricing is calculated in real time using demo data.
          </p>
        </div>

        <!-- Product presets -->
        <div class="flex flex-wrap gap-3 mb-8">
          <button
            v-for="tmpl in demoTemplatesList"
            :key="tmpl.id"
            class="rounded-xl border px-4 py-2.5 text-sm font-medium transition-all"
            :class="selectedDemoId === tmpl.id
              ? 'border-flamingo-400 bg-flamingo-50 dark:bg-flamingo-900/20 text-flamingo-700 dark:text-flamingo-300 shadow-sm'
              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'"
            @click="selectDemoTemplate(tmpl.id)"
          >
            {{ tmpl.name }}
          </button>
        </div>

        <!-- Calculator grid -->
        <div v-if="selectedDemo" class="grid gap-8 lg:grid-cols-2">
          <!-- Configuration panel -->
          <div class="rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-6 sm:p-8 space-y-5">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ selectedDemo.name }}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ selectedDemo.description }}</p>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Size</label>
                <p class="text-sm font-medium text-gray-800 dark:text-gray-200">{{ selectedDemo.default_finished_width_mm }}×{{ selectedDemo.default_finished_height_mm }}mm</p>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Sides</label>
                <p class="text-sm font-medium text-gray-800 dark:text-gray-200">{{ selectedDemo.default_sides === 'DUPLEX' ? 'Double-sided' : 'Single-sided' }}</p>
              </div>
            </div>

            <div>
              <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Quantity</label>
              <div class="flex items-center gap-2">
                <UButton variant="soft" size="xs" color="neutral" icon="i-lucide-minus" @click="demoQty = Math.max(selectedDemo.min_quantity, demoQty - 50)" />
                <input
                  v-model.number="demoQty"
                  type="number"
                  :min="selectedDemo.min_quantity"
                  class="w-24 text-center rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 text-sm font-medium text-gray-800 dark:text-gray-200"
                  @change="demoQty = Math.max(selectedDemo.min_quantity, demoQty)"
                />
                <UButton variant="soft" size="xs" color="neutral" icon="i-lucide-plus" @click="demoQty += 50" />
              </div>
              <p class="mt-1 text-xs text-gray-400">Min: {{ selectedDemo.min_quantity }}</p>
            </div>

            <div v-if="selectedDemo.pricing_mode === 'SHEET'">
              <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Imposition</label>
              <p class="text-sm text-gray-700 dark:text-gray-300">
                {{ selectedDemo.default_sheet_size }}: {{ selectedDemo.copies_per_sheet }}-up
                · {{ demoSheetsNeeded }} sheets needed
              </p>
            </div>

            <div v-if="demoFinishingLabels.length">
              <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Finishing</label>
              <div class="flex flex-wrap gap-1">
                <UBadge v-for="f in demoFinishingLabels" :key="f" variant="soft" color="neutral" size="xs">{{ f }}</UBadge>
              </div>
            </div>
          </div>

          <!-- Result panel -->
          <div class="rounded-3xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-6 sm:p-8 space-y-5">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">Price Breakdown</h3>

            <div class="space-y-3">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-400">Material (paper/media)</span>
                <span class="font-medium text-gray-800 dark:text-gray-200">KES {{ demoResult.material.toLocaleString('en', { maximumFractionDigits: 0 }) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-400">Printing</span>
                <span class="font-medium text-gray-800 dark:text-gray-200">KES {{ demoResult.printing.toLocaleString('en', { maximumFractionDigits: 0 }) }}</span>
              </div>
              <div v-if="demoResult.finishing > 0" class="flex justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-400">Finishing</span>
                <span class="font-medium text-gray-800 dark:text-gray-200">KES {{ demoResult.finishing.toLocaleString('en', { maximumFractionDigits: 0 }) }}</span>
              </div>
              <div class="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between">
                <span class="font-bold text-gray-900 dark:text-white">Total</span>
                <span class="text-xl font-bold text-flamingo-600 dark:text-flamingo-400">KES {{ demoResult.total.toLocaleString('en', { maximumFractionDigits: 0 }) }}</span>
              </div>
              <div class="flex justify-between text-xs text-gray-400">
                <span>Unit price</span>
                <span>KES {{ demoUnitPrice }}</span>
              </div>
            </div>

            <!-- Formula explanation -->
            <div class="rounded-xl bg-white dark:bg-gray-800 p-4 shadow-sm border border-gray-100 dark:border-gray-700 mt-4">
              <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">How it's calculated</p>
              <div v-if="selectedDemo.pricing_mode === 'SHEET'" class="font-mono text-xs text-gray-600 dark:text-gray-400 space-y-1">
                <p>sheets = ceil({{ demoQty }} / {{ selectedDemo.copies_per_sheet }}) = {{ demoSheetsNeeded }}</p>
                <p>material = {{ demoSheetsNeeded }} sheets × paper_cost</p>
                <p>printing = {{ demoSheetsNeeded }} sheets × click_rate</p>
                <p>total = material + printing + finishing</p>
              </div>
              <div v-else class="font-mono text-xs text-gray-600 dark:text-gray-400 space-y-1">
                <p>area = {{ (selectedDemo.default_finished_width_mm / 1000).toFixed(1) }}m × {{ (selectedDemo.default_finished_height_mm / 1000).toFixed(1) }}m × {{ demoQty }} = {{ demoAreaSqm.toFixed(2) }} sqm</p>
                <p>material = {{ demoAreaSqm.toFixed(2) }} sqm × material_rate</p>
                <p>total = material + printing + finishing</p>
              </div>
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
import { demoRateCard } from '~/shared/demoRateCard'
import { templates as demoTemplatesList } from '~/shared/demoTemplates'
import { computeDemoQuote } from '~/shared/demoPricing'
import type { DemoQuoteResult } from '~/shared/demoPricing'

definePageMeta({
  layout: 'default',
})

const demoForm = ref<Partial<DemoFormState>>({})
const simulatorRef = ref<InstanceType<typeof import('~/components/landing/LandingQuoteSimulator.vue').default> | null>(null)

const selectedDemoId = ref(demoTemplatesList[0]?.id ?? 1)
const demoQty = ref(demoTemplatesList[0]?.min_quantity ?? 100)

const selectedDemo = computed(() => {
  const tmpl = demoTemplatesList.find(t => t.id === selectedDemoId.value)
  if (!tmpl) return demoTemplatesList[0]
  return { ...tmpl, min_quantity: tmpl.min_quantity || 100 }
})

function selectDemoTemplate(id: number) {
  selectedDemoId.value = id
  const tmpl = demoTemplatesList.find(t => t.id === id)
  if (tmpl) demoQty.value = tmpl.min_quantity || 100
}

const demoSheetsNeeded = computed(() => {
  if (!selectedDemo.value || selectedDemo.value.pricing_mode !== 'SHEET') return 0
  const cps = Math.max(1, selectedDemo.value.copies_per_sheet)
  return Math.ceil(demoQty.value / cps)
})

const demoAreaSqm = computed(() => {
  if (!selectedDemo.value || selectedDemo.value.pricing_mode !== 'LARGE_FORMAT') return 0
  return (selectedDemo.value.default_finished_width_mm / 1000) *
    (selectedDemo.value.default_finished_height_mm / 1000) *
    demoQty.value
})

const demoFinishingLabels = computed(() => {
  if (!selectedDemo.value) return []
  return selectedDemo.value.finishing_options
    .map(opt => demoRateCard.finishing_rates.find(f => f.id === opt.finishing_rate)?.name)
    .filter(Boolean) as string[]
})

const demoResult = computed<DemoQuoteResult>(() => {
  if (!selectedDemo.value) return { printing: 0, material: 0, finishing: 0, total: 0 }
  const tmpl = { ...selectedDemo.value, min_quantity: demoQty.value }
  return computeDemoQuote(tmpl, demoRateCard)
})

const demoUnitPrice = computed(() => {
  if (!demoResult.value.total || !demoQty.value) return '—'
  return (demoResult.value.total / demoQty.value).toLocaleString('en', { maximumFractionDigits: 2 })
})

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
  document.getElementById('top')?.scrollIntoView({ behavior: 'smooth' })
}
</script>
