<template>
  <div>
    <!-- Hero -->
    <section id="top" class="relative overflow-hidden bg-[#101828] py-20 sm:py-28 w-screen max-w-none left-1/2 -translate-x-1/2">
      <div class="absolute inset-0 opacity-20">
        <div class="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" />
        <div class="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000" />
        <div class="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-4000" />
      </div>
      <div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
          <div class="max-w-2xl">
            <h1 class="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Instant printing quotes
            </h1>
            <p class="mt-6 text-lg text-gray-300 leading-relaxed">
              Browse templates, get instant pricing, and request quotes from trusted print shops. Business cards, flyers, posters, and more.
            </p>
            <div class="mt-8 flex flex-col sm:flex-row gap-4">
              <NuxtLink to="/gallery" class="inline-flex items-center justify-center rounded-xl bg-white/90 dark:bg-gray-100 px-6 py-3.5 text-sm font-bold text-[#101828] dark:text-gray-900 hover:bg-white dark:hover:bg-gray-200 transition-colors">
                Get a quote
                <UIcon name="i-lucide-chevron-right" class="ml-2 w-4 h-4" />
              </NuxtLink>
              <NuxtLink to="/#how-it-works" class="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-bold text-white hover:bg-white/10 transition-colors backdrop-blur-sm">
                How it works
              </NuxtLink>
            </div>
          </div>
          <div class="mt-16 lg:mt-0 relative min-h-[320px]">
            <a href="#models" class="block rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-2xl hover:bg-white/10 transition-colors">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <p class="text-xs font-semibold uppercase tracking-[0.2em] text-flamingo-300">Live Quote Preview</p>
                  <h3 class="mt-2 text-xl font-bold text-white">Instant pricing demo</h3>
                  <p class="mt-2 text-sm text-gray-300">Business cards, flyers, posters — calculated in seconds.</p>
                </div>
                <div class="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-gray-200">Demo</div>
              </div>
              <div class="mt-6 grid grid-cols-2 gap-3">
                <div class="rounded-2xl bg-white/5 border border-white/10 p-4">
                  <p class="text-xs text-gray-400">Product</p>
                  <p class="mt-1 text-sm font-semibold text-white">Business Cards</p>
                </div>
                <div class="rounded-2xl bg-white/5 border border-white/10 p-4">
                  <p class="text-xs text-gray-400">Quantity</p>
                  <p class="mt-1 text-sm font-semibold text-white">500 pcs</p>
                </div>
                <div class="rounded-2xl bg-white/5 border border-white/10 p-4">
                  <p class="text-xs text-gray-400">Paper</p>
                  <p class="mt-1 text-sm font-semibold text-white">300gsm Art Card</p>
                </div>
                <div class="rounded-2xl bg-white/5 border border-white/10 p-4">
                  <p class="text-xs text-gray-400">Finishing</p>
                  <p class="mt-1 text-sm font-semibold text-white">Matte Lamination</p>
                </div>
              </div>
              <div class="mt-6 rounded-2xl border border-white/10 bg-[#0b1220] p-4">
                <div class="flex justify-between text-sm"><span class="text-gray-400">Material</span><span class="text-gray-200">KES 1,200</span></div>
                <div class="mt-2 flex justify-between text-sm"><span class="text-gray-400">Printing</span><span class="text-gray-200">KES 800</span></div>
                <div class="mt-2 flex justify-between text-sm"><span class="text-gray-400">Finishing</span><span class="text-gray-200">KES 500</span></div>
                <div class="mt-4 border-t border-white/10 pt-4 flex justify-between">
                  <span class="text-sm font-semibold text-white">Estimated total</span>
                  <span class="text-2xl font-extrabold text-flamingo-400">KES 2,500</span>
                </div>
              </div>
              <p class="mt-4 text-center text-sm text-flamingo-300 font-medium">Try the calculator below ↓</p>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section id="how-it-works" class="scroll-mt-20">
      <ClientOnly>
        <LandingHowItWorks />
        <template #fallback>
          <div class="py-16 sm:py-24" />
        </template>
      </ClientOnly>
    </section>

    <!-- Trust -->
    <ClientOnly>
      <LandingTrust />
      <template #fallback>
        <div class="py-16 sm:py-24" />
      </template>
    </ClientOnly>

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

        <!-- Calculator grid (deferred until mount to avoid hydration mismatch) -->
        <template v-if="calculatorMounted && selectedDemo">
          <div class="grid gap-8 lg:grid-cols-2">
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
                {{ selectedDemo.default_sheet_size || 'SRA3' }}: {{ selectedDemo.copies_per_sheet ?? 1 }}-up
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
                <span class="font-medium text-gray-800 dark:text-gray-200">{{ formatDemoKES(demoResult.material ?? 0) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-400">Printing</span>
                <span class="font-medium text-gray-800 dark:text-gray-200">{{ formatDemoKES(demoResult.printing ?? 0) }}</span>
              </div>
              <div v-if="(demoResult.finishing ?? 0) > 0" class="flex justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-400">Finishing</span>
                <span class="font-medium text-gray-800 dark:text-gray-200">{{ formatDemoKES(demoResult.finishing ?? 0) }}</span>
              </div>
              <div class="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between">
                <span class="font-bold text-gray-900 dark:text-white">Total</span>
                <span class="text-xl font-bold text-flamingo-600 dark:text-flamingo-400">{{ formatDemoKES(demoResult.total ?? 0) }}</span>
              </div>
              <div class="flex justify-between text-xs text-gray-400">
                <span>Unit price</span>
                <span>KES {{ formatDemoUnitPrice }}</span>
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
        </template>
        <template v-else>
          <div class="grid gap-8 lg:grid-cols-2">
            <div class="rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-6 sm:p-8">
              <div class="h-6 w-40 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
              <div class="mt-4 h-4 w-full rounded bg-gray-100 dark:bg-gray-700/70 animate-pulse" />
              <div class="mt-2 h-4 w-[80%] rounded bg-gray-100 dark:bg-gray-700/70 animate-pulse" />
              <div class="mt-6 space-y-3">
                <div class="h-10 rounded-xl bg-gray-100 dark:bg-gray-700/70 animate-pulse" />
                <div class="h-10 rounded-xl bg-gray-100 dark:bg-gray-700/70 animate-pulse" />
                <div class="h-10 rounded-xl bg-gray-100 dark:bg-gray-700/70 animate-pulse" />
              </div>
            </div>
            <div class="rounded-3xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-6 sm:p-8">
              <div class="h-6 w-36 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
              <div class="mt-6 space-y-3">
                <div class="h-4 rounded bg-gray-100 dark:bg-gray-700/70 animate-pulse" />
                <div class="h-4 rounded bg-gray-100 dark:bg-gray-700/70 animate-pulse" />
                <div class="h-4 rounded bg-gray-100 dark:bg-gray-700/70 animate-pulse" />
                <div class="h-8 rounded bg-gray-200 dark:bg-gray-700 animate-pulse mt-4" />
              </div>
            </div>
          </div>
        </template>
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

    <!-- Shops & Gallery samples -->
    <section class="py-16 sm:py-24 bg-[#f3f6fc] dark:bg-[#0f1729]">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <!-- Shops -->
        <div class="mb-16">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
              Print Shops
            </h2>
            <NuxtLink
              to="/shops"
              class="inline-flex items-center gap-1.5 text-sm font-semibold text-flamingo-600 dark:text-flamingo-400 hover:text-flamingo-700 dark:hover:text-flamingo-300"
            >
              View all
              <UIcon name="i-lucide-arrow-right" class="h-4 w-4" />
            </NuxtLink>
          </div>
          <ClientOnly>
            <div v-if="sampleShopsLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div v-for="i in 4" :key="i" class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-6 animate-pulse">
                <div class="h-12 w-12 rounded-xl bg-gray-200 dark:bg-gray-700" />
                <div class="mt-4 h-5 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
                <div class="mt-2 h-4 w-1/2 rounded bg-gray-100 dark:bg-gray-700/70" />
              </div>
            </div>
            <div v-else-if="sampleShops.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <NuxtLink
                v-for="shop in sampleShops"
                :key="shop.id"
                :to="`/shops/${shop.slug}`"
                class="group rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-6 hover:border-flamingo-200 dark:hover:border-flamingo-800/50 hover:shadow-lg transition-all"
              >
                <div class="flex items-center gap-3">
                  <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/40">
                    <UIcon name="i-lucide-store" class="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div class="min-w-0">
                    <h3 class="font-semibold text-gray-900 dark:text-white truncate group-hover:text-flamingo-600 dark:group-hover:text-flamingo-400">
                      {{ shop.name }}
                    </h3>
                    <p v-if="shop.city" class="text-sm text-gray-500 dark:text-gray-400 truncate">{{ shop.city }}</p>
                  </div>
                </div>
                <p class="mt-3 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{{ shop.description || 'Print shop' }}</p>
              </NuxtLink>
            </div>
            <template #fallback>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div v-for="i in 4" :key="i" class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-6 h-32" />
              </div>
            </template>
          </ClientOnly>
        </div>

        <!-- Gallery -->
        <div>
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
              Product Gallery
            </h2>
            <NuxtLink
              to="/gallery"
              class="inline-flex items-center gap-1.5 text-sm font-semibold text-flamingo-600 dark:text-flamingo-400 hover:text-flamingo-700 dark:hover:text-flamingo-300"
            >
              View all
              <UIcon name="i-lucide-arrow-right" class="h-4 w-4" />
            </NuxtLink>
          </div>
          <ClientOnly>
            <div v-if="sampleProductsLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div v-for="i in 4" :key="i" class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 overflow-hidden animate-pulse">
                <div class="aspect-[4/3] bg-gray-200 dark:bg-gray-700" />
                <div class="p-4">
                  <div class="h-5 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
                  <div class="mt-2 h-4 w-1/2 rounded bg-gray-100 dark:bg-gray-700/70" />
                </div>
              </div>
            </div>
            <div v-else-if="sampleProducts.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <NuxtLink
                v-for="product in sampleProducts"
                :key="product.id"
                :to="product.shop?.slug ? `/gallery/${product.shop.slug}` : '/gallery'"
                class="group rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 overflow-hidden hover:border-flamingo-200 dark:hover:border-flamingo-800/50 hover:shadow-lg transition-all"
              >
                <div class="relative aspect-[4/3] bg-[var(--p-surface-sunken)] overflow-hidden">
                  <NuxtImg
                    v-if="sampleProductImageUrl(product)"
                    :src="sampleProductImageUrl(product)!"
                    :alt="product.name"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div v-else class="absolute inset-0 flex items-center justify-center">
                    <UIcon name="i-lucide-package" class="h-12 w-12 text-gray-300 dark:text-gray-600" />
                  </div>
                  <div v-if="product.shop" class="absolute top-2 left-2">
                    <span class="inline-flex items-center gap-1 rounded-full bg-white/90 dark:bg-gray-900/90 px-2 py-0.5 text-xs font-medium text-gray-700 dark:text-gray-300">
                      {{ product.shop.name }}
                    </span>
                  </div>
                </div>
                <div class="p-4">
                  <h3 class="font-semibold text-gray-900 dark:text-white group-hover:text-flamingo-600 dark:group-hover:text-flamingo-400 truncate">
                    {{ product.name }}
                  </h3>
                  <p v-if="productCategoryName(product)" class="mt-0.5 text-sm text-gray-500 dark:text-gray-400 truncate">
                    {{ productCategoryName(product) }}
                  </p>
                </div>
              </NuxtLink>
            </div>
            <template #fallback>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div v-for="i in 4" :key="i" class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 overflow-hidden aspect-[4/3]" />
              </div>
            </template>
          </ClientOnly>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import type { DemoQuoteResult } from '~/shared/demoPricing'
import type { Product } from '~/shared/types'
import LandingHowItWorks from '~/components/landing/LandingHowItWorks.vue'
import LandingTrust from '~/components/landing/LandingTrust.vue'
import { listShops } from '~/services/public'
import { getAllProducts } from '~/shared/api/gallery'

const { getMediaUrl } = useApi()

const {
  demoTemplatesList,
  fetchTemplates,
  computeQuote,
  finishingRatesForLabels,
} = useDemoCalculator()

/** SSR-safe KES formatter (avoids Intl hydration mismatch) */
const formatDemoKES = (value: number) => {
  const rounded = Math.round(value)
  return `KES ${rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
}

definePageMeta({
  layout: 'default',
})

usePrintySeo({
  title: 'Instant Printing Quotes',
  description: 'Get instant printing quotes for business cards, flyers, posters, and more. Browse templates, compare prices, and request quotes from trusted print shops in Kenya.',
})

const calculatorMounted = ref(false)
const demoResult = ref<DemoQuoteResult>({ printing: 0, material: 0, finishing: 0, total: 0 })

const sampleShops = ref<Awaited<ReturnType<typeof listShops>>>([])
const sampleShopsLoading = ref(true)
const sampleProducts = ref<Product[]>([])
const sampleProductsLoading = ref(true)

function productCategoryName(p: Product): string {
  const c = p.category
  if (typeof c === 'string') return c.trim()
  if (c && typeof c === 'object' && 'name' in c && typeof (c as { name: string }).name === 'string') {
    return (c as { name: string }).name.trim()
  }
  return ''
}

function sampleProductImageUrl(product: Product): string | null {
  const path = product.primary_image
  if (!path) return null
  if (path.startsWith('http')) return path
  return getMediaUrl(path)
}

onMounted(async () => {
  calculatorMounted.value = true
  fetchTemplates()

  // Fetch shops & gallery samples independently so loading always clears
  try {
    const [shops, productsData] = await Promise.all([
      listShops(),
      getAllProducts(),
    ])
    sampleShops.value = shops.slice(0, 4)
    sampleProducts.value = productsData.slice(0, 4)
  } catch {
    sampleShops.value = []
    sampleProducts.value = []
  } finally {
    sampleShopsLoading.value = false
    sampleProductsLoading.value = false
  }
})

const selectedDemoId = ref(1)
const demoQty = ref(100)

const selectedDemo = computed(() => {
  const list = demoTemplatesList.value
  if (!list.length) return null
  const tmpl = list.find(t => t.id === selectedDemoId.value)
  return tmpl ? { ...tmpl, min_quantity: tmpl.min_quantity || 100 } : list[0]
})

watch(
  [selectedDemo, () => demoQty.value],
  async ([demo, qty]) => {
    const d = demo as typeof selectedDemo.value
    const q = qty as number
    if (!d) return
    const result = await computeQuote(
      d.id,
      q,
      d.default_sheet_size || undefined,
      d.min_gsm ?? undefined,
    )
    demoResult.value = result
  },
  { immediate: true },
)

function selectDemoTemplate(id: number) {
  selectedDemoId.value = id
  const tmpl = demoTemplatesList.value.find(t => t.id === id)
  if (tmpl) demoQty.value = Math.max(tmpl.min_quantity, demoQty.value)
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
  if (!selectedDemo.value?.finishing_options) return []
  return selectedDemo.value.finishing_options
    .map(opt => finishingRatesForLabels.value.find(f => f.id === opt.finishing_rate)?.name)
    .filter(Boolean) as string[]
})

const formatDemoUnitPrice = computed(() => {
  if (!demoResult.value.total || !demoQty.value) return '—'
  const unitPrice = demoResult.value.total / demoQty.value
  return unitPrice.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
})
</script>
