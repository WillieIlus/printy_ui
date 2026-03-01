<!-- TemplateTweaker.vue — Template configuration page where toggling finishing options updates price live -->
<template>
  <div class="grid gap-6 lg:grid-cols-5">
    <!-- Left: Configuration Panel (3 cols) -->
    <div class="space-y-6 lg:col-span-3">
      <!-- Template Header -->
      <div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div class="flex items-start gap-4">
          <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-flamingo-50">
            <svg class="h-7 w-7 text-flamingo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-900">Configure Template</h2>
            <p class="mt-1 text-sm text-gray-500">Adjust options to see how pricing changes in real-time</p>
          </div>
        </div>
      </div>

      <!-- Product Selection -->
      <div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h3 class="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">Product Type</h3>
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <button
            v-for="product in productTypes"
            :key="product.id"
            class="rounded-xl border-2 p-4 text-center transition-all"
            :class="selectedProduct === product.id
              ? 'border-flamingo-500 bg-flamingo-50 ring-1 ring-flamingo-500/20'
              : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'"
            @click="selectedProduct = product.id"
          >
            <svg class="mx-auto mb-2 h-6 w-6" :class="selectedProduct === product.id ? 'text-flamingo-500' : 'text-gray-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" :d="product.icon" />
            </svg>
            <div class="text-sm font-semibold" :class="selectedProduct === product.id ? 'text-flamingo-700' : 'text-gray-700'">{{ product.label }}</div>
            <div class="mt-0.5 text-[10px] text-gray-400">{{ product.sub }}</div>
          </button>
        </div>
      </div>

      <!-- Size & Quantity -->
      <div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h3 class="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">Size & Quantity</h3>
        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700">Size</label>
            <select v-model="selectedSize" class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm transition-all focus:border-flamingo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-flamingo-500/20">
              <option v-for="s in sizes" :key="s.value" :value="s.value">{{ s.label }}</option>
            </select>
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700">Quantity</label>
            <input v-model.number="quantity" type="number" min="1" class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm transition-all focus:border-flamingo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-flamingo-500/20" />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700">Sides</label>
            <div class="flex gap-2">
              <button
                v-for="side in [1, 2]"
                :key="side"
                class="flex-1 rounded-xl border-2 py-2.5 text-center text-sm font-semibold transition-all"
                :class="sides === side
                  ? 'border-flamingo-500 bg-flamingo-50 text-flamingo-700'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'"
                @click="sides = side"
              >
                {{ side === 1 ? 'Single Side' : 'Double Side' }}
              </button>
            </div>
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700">Paper</label>
            <select v-model="selectedPaper" class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm transition-all focus:border-flamingo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-flamingo-500/20">
              <option v-for="p in papers" :key="p.value" :value="p.value">{{ p.label }} — KES {{ p.cost }}/sheet</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Finishing Options — TOGGLEABLE -->
      <div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h3 class="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">Finishing Options</h3>
        <div class="space-y-3">
          <div
            v-for="finish in finishingOptions"
            :key="finish.id"
            class="flex items-center justify-between rounded-xl border p-4 transition-all"
            :class="finish.enabled
              ? 'border-flamingo-200 bg-flamingo-50/50'
              : 'border-gray-200 bg-white'"
          >
            <div class="flex items-center gap-3">
              <button
                class="flex h-6 w-11 items-center rounded-full p-0.5 transition-colors"
                :class="finish.enabled ? 'bg-flamingo-500' : 'bg-gray-300'"
                @click="finish.enabled = !finish.enabled"
              >
                <span
                  class="h-5 w-5 rounded-full bg-white shadow-sm transition-transform"
                  :class="finish.enabled ? 'translate-x-5' : 'translate-x-0'"
                ></span>
              </button>
              <div>
                <div class="text-sm font-semibold text-gray-900">{{ finish.label }}</div>
                <div class="text-xs text-gray-500">{{ finish.description }}</div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-sm font-bold" :class="finish.enabled ? 'text-flamingo-600' : 'text-gray-400'">
                {{ finish.price }}
              </div>
              <div class="text-[10px] text-gray-400">{{ finish.unit }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right: Live Price Preview (2 cols) -->
    <div class="lg:col-span-2">
      <div class="sticky top-20 space-y-4">
        <!-- Price Card -->
        <div class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div class="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-5">
            <div class="flex items-center justify-between">
              <div class="text-sm font-semibold text-white">Live Price Preview</div>
              <div class="inline-flex items-center gap-1.5 rounded-full bg-green-500/20 px-2.5 py-1 text-[10px] font-semibold text-green-300">
                <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400"></span>
                Auto-updating
              </div>
            </div>
          </div>

          <div class="p-6">
            <!-- Product summary -->
            <div class="mb-4 rounded-xl bg-gray-50 p-4">
              <div class="text-sm font-semibold text-gray-900">{{ currentProductLabel }}</div>
              <div class="mt-1 text-xs text-gray-500">
                {{ selectedSize }} · {{ sides === 1 ? 'Single' : 'Double' }}-sided · {{ quantity }} pieces
              </div>
            </div>

            <!-- Breakdown -->
            <div class="space-y-3 text-sm">
              <div class="flex items-center justify-between">
                <span class="text-gray-600">Material ({{ sheetsNeeded }} sheets × KES {{ paperCost }})</span>
                <span class="font-medium text-gray-900">KES {{ materialTotal.toLocaleString() }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-600">Printing ({{ sheetsNeeded }} × {{ sides }} × KES {{ printPricePerSide }})</span>
                <span class="font-medium text-gray-900">KES {{ printingTotal.toLocaleString() }}</span>
              </div>

              <!-- Dynamic finishing lines -->
              <template v-for="finish in enabledFinishing" :key="finish.id">
                <div class="flex items-center justify-between">
                  <span class="flex items-center gap-1.5 text-gray-600">
                    <span class="h-1 w-1 rounded-full bg-flamingo-400"></span>
                    {{ finish.label }} ({{ finish.qtyLabel }})
                  </span>
                  <span class="font-medium text-flamingo-600">KES {{ finish.totalCost.toLocaleString() }}</span>
                </div>
              </template>

              <div class="h-px bg-gray-200"></div>

              <div class="flex items-center justify-between">
                <span class="font-medium text-gray-700">Subtotal</span>
                <span class="font-semibold text-gray-900">KES {{ subtotal.toLocaleString() }}</span>
              </div>

              <!-- Grand Total -->
              <div class="flex items-center justify-between rounded-xl bg-gray-900 px-4 py-3 text-white">
                <span class="font-semibold">Total</span>
                <span class="text-xl font-extrabold">KES {{ subtotal.toLocaleString() }}</span>
              </div>

              <!-- Per unit -->
              <div class="text-center text-xs text-gray-400">
                KES {{ perUnit }} per piece
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="mt-5 grid gap-2">
              <button class="w-full rounded-xl bg-flamingo-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-flamingo-600">
                Add to Quote
              </button>
              <button class="w-full rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50">
                Save as Template
              </button>
            </div>
          </div>
        </div>

        <!-- Formula Reference -->
        <div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div class="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Formula</div>
          <div class="rounded-lg bg-gray-900 p-3 font-mono text-[11px] leading-relaxed text-gray-300">
            material = sheets × cost/sheet<br>
            printing = sheets × sides × price/side<br>
            finishing = Σ(qty × unit_price)<br>
            <span class="text-flamingo-400">total = material + printing + finishing</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'

const selectedProduct = ref('flyers')
const selectedSize = ref('A5')
const quantity = ref(1000)
const sides = ref(2)
const selectedPaper = ref('gloss150')

const productTypes = [
  { id: 'cards', label: 'Cards', sub: 'Business', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
  { id: 'flyers', label: 'Flyers', sub: 'A5/A4', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { id: 'posters', label: 'Posters', sub: 'A3/A2', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { id: 'banners', label: 'Banners', sub: 'Large', icon: 'M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9' },
]

const sizes = [
  { value: 'A5', label: 'A5 (148 × 210 mm)' },
  { value: 'A4', label: 'A4 (210 × 297 mm)' },
  { value: 'A3', label: 'A3 (297 × 420 mm)' },
  { value: 'SRA3', label: 'SRA3 (320 × 450 mm)' },
]

const papers = [
  { value: 'bond80', label: '80gsm Bond', cost: 3.5 },
  { value: 'gloss150', label: '150gsm Gloss', cost: 8 },
  { value: 'art350', label: '350gsm Art Card', cost: 12 },
]

const finishingOptions = reactive([
  { id: 'cutting', label: 'Cutting', description: 'Cut to final size', price: 'KES 1.00', unit: 'per piece', enabled: true, unitCost: 1 },
  { id: 'lamination_gloss', label: 'Lamination (Gloss)', description: 'Glossy protective film', price: 'KES 25.00', unit: 'per sheet', enabled: false, unitCost: 25 },
  { id: 'lamination_matte', label: 'Lamination (Matte)', description: 'Matte protective film', price: 'KES 30.00', unit: 'per sheet', enabled: false, unitCost: 30 },
  { id: 'eyelets', label: 'Eyelets', description: 'Metal eyelets for hanging', price: 'KES 20.00', unit: 'per piece', enabled: false, unitCost: 20 },
])

// How many pieces fit on one SRA3 sheet for each size
const piecesPerSheet: Record<string, number> = { A5: 4, A4: 2, A3: 1, SRA3: 1 }
const printPrices: Record<string, number> = { A5: 45, A4: 25, A3: 40, SRA3: 45 }

const currentProductLabel = computed(() => productTypes.find(p => p.id === selectedProduct.value)?.label ?? 'Product')
const paperCost = computed(() => papers.find(p => p.value === selectedPaper.value)?.cost ?? 8)
const printPricePerSide = computed(() => printPrices[selectedSize.value] ?? 45)
const sheetsNeeded = computed(() => Math.ceil(quantity.value / (piecesPerSheet[selectedSize.value] ?? 4)))

const materialTotal = computed(() => sheetsNeeded.value * paperCost.value)
const printingTotal = computed(() => sheetsNeeded.value * sides.value * printPricePerSide.value)

const enabledFinishing = computed(() => {
  return finishingOptions
    .filter(f => f.enabled)
    .map(f => {
      let qty = quantity.value
      let qtyLabel = `${quantity.value} pcs × KES ${f.unitCost}`
      if (f.unit === 'per sheet') {
        qty = sheetsNeeded.value
        qtyLabel = `${sheetsNeeded.value} sheets × KES ${f.unitCost}`
      }
      return {
        ...f,
        qtyLabel,
        totalCost: qty * f.unitCost,
      }
    })
})

const finishingTotal = computed(() => enabledFinishing.value.reduce((acc, f) => acc + f.totalCost, 0))

const subtotal = computed(() => materialTotal.value + printingTotal.value + finishingTotal.value)
const perUnit = computed(() => quantity.value > 0 ? (subtotal.value / quantity.value).toFixed(1) : '0')
</script>
