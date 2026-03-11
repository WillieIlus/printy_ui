import { useState, useCallback } from 'react'

// All Nuxt project files embedded for download
const FILES: Record<string, string> = {
  // ── Config ──
  'package.json': `{
  "name": "printy-nuxt",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "nuxt build",
    "dev": "nuxt dev",
    "generate": "nuxt generate",
    "preview": "nuxt preview",
    "postinstall": "nuxt prepare"
  },
  "dependencies": {
    "nuxt": "^3.14.0",
    "vue": "^3.5.0",
    "vue-router": "^4.4.0",
    "pinia": "^2.2.0",
    "@pinia/nuxt": "^0.7.0",
    "lucide-vue-next": "^0.460.0"
  },
  "devDependencies": {
    "@nuxtjs/tailwindcss": "^6.12.0",
    "typescript": "^5.5.0"
  }
}`,

  'nuxt.config.ts': `export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
  ],
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: 'Printy — Print Shop Quoting',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Browse and quote print products from shops across Kenya' },
      ],
    },
  },
  compatibilityDate: '2025-01-01',
})`,

  'tsconfig.json': `{
  "extends": "./.nuxt/tsconfig.json"
}`,

  // ── App entry ──
  'app.vue': `<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <!-- Global toast -->
    <Teleport to="body">
      <Transition name="toast">
        <div
          v-if="toastMessage"
          class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100]"
        >
          <div class="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-stone-800 dark:bg-stone-100 text-white dark:text-stone-900 text-sm font-medium shadow-2xl">
            <svg class="h-5 w-5 text-green-400 dark:text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ toastMessage }}
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
const toastMessage = useState<string>('toast', () => '')

watch(toastMessage, (msg) => {
  if (msg) {
    setTimeout(() => {
      toastMessage.value = ''
    }, 3000)
  }
})
</script>`,

  // ── CSS ──
  'assets/css/main.css': `@import "tailwindcss";

/* ── Modal transitions ── */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease;
}
.modal-enter-active .modal-panel,
.modal-leave-active .modal-panel {
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .modal-panel {
  transform: scale(0.95) translateY(10px);
  opacity: 0;
}
.modal-leave-to .modal-panel {
  transform: scale(0.95) translateY(10px);
  opacity: 0;
}

/* ── Drawer transitions ── */
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.3s ease;
}
.drawer-enter-active .drawer-panel,
.drawer-leave-active .drawer-panel {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}
.drawer-enter-from .drawer-panel {
  transform: translateX(100%);
}
.drawer-leave-to .drawer-panel {
  transform: translateX(100%);
}

/* ── Toast transitions ── */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(1rem);
}

/* ── Scrollbar ── */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #d6d3d1;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: #a8a29e;
}
@media (prefers-color-scheme: dark) {
  ::-webkit-scrollbar-thumb { background: #57534e; }
  ::-webkit-scrollbar-thumb:hover { background: #78716c; }
}

/* ── Number input: hide spinners ── */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}`,

  // ── Shared types ──
  'shared/types.ts': `export interface Shop {
  id: number
  name: string
  slug: string
  location?: string
  description?: string
}

export interface FinishingOption {
  finishing_rate: number
  name: string
  is_default: boolean
}

export interface PriceHint {
  can_calculate: boolean
  price_display?: string
  total?: number
  per_unit?: number
}

export interface Product {
  id: number
  name: string
  category?: string
  primary_image?: string | null
  pricing_mode: 'SHEET' | 'LARGE_FORMAT'
  final_size?: string
  imposition_summary?: string
  min_quantity?: number
  default_sides?: 'SIMPLEX' | 'DUPLEX'
  finishing_summary?: string[]
  finishing_options?: FinishingOption[]
  price_hint?: PriceHint
  price_range_est?: PriceHint
  shop?: Shop
}

export interface Paper {
  id: number
  shop: number
  sheet_size: string
  gsm: number
  paper_type: string
  selling_price: string
  buying_price: string
  is_active: boolean
}

export interface MaterialItem {
  id: number
  material_type?: string
  name?: string
  unit: string
  selling_price: string
  is_active: boolean
}

export interface FinishingRate {
  id: number
  name: string
  price: string
  charge_unit: 'PER_PIECE' | 'PER_SHEET' | 'PER_SQM' | 'FLAT'
  is_active: boolean
}

export interface QuoteItemFinishingPayload {
  finishing_rate: number
}

export interface TweakForm {
  quantity: number
  sides: 'SIMPLEX' | 'DUPLEX'
  color_mode: 'BW' | 'COLOR'
  paper: number | null
  material: number | null
  finishings: QuoteItemFinishingPayload[]
  special_instructions: string
}

export interface QuoteItem {
  id: string
  product: Product
  quantity: number
  sides: 'SIMPLEX' | 'DUPLEX'
  color_mode: 'BW' | 'COLOR'
  paper?: Paper | null
  material?: MaterialItem | null
  finishings: FinishingRate[]
  special_instructions?: string
  estimatedTotal?: number | null
  estimatedPerUnit?: number | null
}`,

  // ── Mock data ──
  'shared/mockData.ts': `import type { Product, Paper, MaterialItem, FinishingRate, Shop } from './types'

export const shops: Shop[] = [
  { id: 1, name: 'Nairobi Print Hub', slug: 'nairobi-print-hub', location: 'Nairobi CBD', description: 'Full-service print shop in the heart of Nairobi.' },
  { id: 2, name: 'Mombasa Graphics', slug: 'mombasa-graphics', location: 'Mombasa', description: 'Quality printing and large format solutions.' },
  { id: 3, name: 'Kisumu Print Works', slug: 'kisumu-print-works', location: 'Kisumu', description: 'Fast turnaround and competitive pricing.' },
]

export const products: Product[] = [
  {
    id: 1, name: 'Business Cards', category: 'Cards',
    pricing_mode: 'SHEET', final_size: '90×55mm', imposition_summary: 'A4 (10-up)',
    min_quantity: 100, default_sides: 'DUPLEX',
    finishing_summary: ['Lamination', 'Round Corners'],
    finishing_options: [
      { finishing_rate: 1, name: 'Lamination (Glossy)', is_default: true },
      { finishing_rate: 3, name: 'Round Corners', is_default: false },
    ],
    price_hint: { can_calculate: true, price_display: 'KES 1,200', total: 1200, per_unit: 12 },
    shop: shops[0],
  },
  {
    id: 2, name: 'A4 Flyers', category: 'Flyers & Brochures',
    pricing_mode: 'SHEET', final_size: 'A4 (210×297mm)', imposition_summary: 'A3 (2-up)',
    min_quantity: 50, default_sides: 'SIMPLEX',
    finishing_summary: ['UV Coating'],
    finishing_options: [
      { finishing_rate: 2, name: 'UV Coating', is_default: false },
    ],
    price_hint: { can_calculate: true, price_display: 'KES 2,500', total: 2500, per_unit: 50 },
    shop: shops[0],
  },
  {
    id: 3, name: 'A5 Brochures (Tri-fold)', category: 'Flyers & Brochures',
    pricing_mode: 'SHEET', final_size: 'A5 (148×210mm)', imposition_summary: 'A3 (4-up)',
    min_quantity: 100, default_sides: 'DUPLEX',
    finishing_summary: ['Folding', 'Lamination'],
    finishing_options: [
      { finishing_rate: 1, name: 'Lamination (Glossy)', is_default: true },
      { finishing_rate: 4, name: 'Tri-fold', is_default: true },
    ],
    price_hint: { can_calculate: true, price_display: 'KES 3,800', total: 3800, per_unit: 38 },
    shop: shops[1],
  },
  {
    id: 4, name: 'Roll-Up Banner (85×200cm)', category: 'Banners',
    pricing_mode: 'LARGE_FORMAT', final_size: '85×200cm',
    min_quantity: 1, default_sides: 'SIMPLEX',
    finishing_summary: ['Roll-up Stand'],
    finishing_options: [
      { finishing_rate: 5, name: 'Roll-up Stand', is_default: true },
    ],
    price_hint: { can_calculate: true, price_display: 'KES 3,500', total: 3500, per_unit: 3500 },
    shop: shops[1],
  },
  {
    id: 5, name: 'Vinyl Banner (per sqm)', category: 'Banners',
    pricing_mode: 'LARGE_FORMAT', final_size: 'Custom size',
    min_quantity: 1, default_sides: 'SIMPLEX',
    finishing_summary: ['Eyelets', 'Hemming'],
    finishing_options: [
      { finishing_rate: 6, name: 'Eyelets', is_default: true },
      { finishing_rate: 7, name: 'Hemming', is_default: false },
    ],
    price_hint: { can_calculate: true, price_display: 'KES 800/sqm', total: 800, per_unit: 800 },
    shop: shops[2],
  },
  {
    id: 6, name: 'Invoice Books (A5, Triplicate)', category: 'Books & NCR',
    pricing_mode: 'SHEET', final_size: 'A5', imposition_summary: 'A3 (4-up)',
    min_quantity: 10, default_sides: 'SIMPLEX',
    finishing_summary: ['Numbering', 'Padding'],
    finishing_options: [
      { finishing_rate: 8, name: 'Numbering', is_default: true },
      { finishing_rate: 9, name: 'Padding', is_default: true },
    ],
    price_hint: { can_calculate: true, price_display: 'KES 4,500', total: 4500, per_unit: 450 },
    shop: shops[2],
  },
  {
    id: 7, name: 'Letterheads (A4)', category: 'Stationery',
    pricing_mode: 'SHEET', final_size: 'A4 (210×297mm)', imposition_summary: 'A3 (2-up)',
    min_quantity: 100, default_sides: 'SIMPLEX',
    finishing_summary: [],
    finishing_options: [],
    price_hint: { can_calculate: true, price_display: 'KES 1,800', total: 1800, per_unit: 18 },
    shop: shops[0],
  },
  {
    id: 8, name: 'Posters (A2)', category: 'Posters',
    pricing_mode: 'LARGE_FORMAT', final_size: 'A2 (420×594mm)',
    min_quantity: 1, default_sides: 'SIMPLEX',
    finishing_summary: ['Lamination'],
    finishing_options: [
      { finishing_rate: 1, name: 'Lamination (Glossy)', is_default: false },
    ],
    price_hint: { can_calculate: true, price_display: 'KES 500', total: 500, per_unit: 500 },
    shop: shops[1],
  },
  {
    id: 9, name: 'Compliment Slips', category: 'Stationery',
    pricing_mode: 'SHEET', final_size: 'DL (99×210mm)', imposition_summary: 'A4 (3-up)',
    min_quantity: 100, default_sides: 'SIMPLEX',
    finishing_summary: [],
    finishing_options: [],
    price_hint: { can_calculate: true, price_display: 'KES 900', total: 900, per_unit: 9 },
    shop: shops[2],
  },
]

export const papersByShop: Record<string, Paper[]> = {
  'nairobi-print-hub': [
    { id: 1, shop: 1, sheet_size: 'A4', gsm: 80, paper_type: 'Bond', selling_price: '2.50', buying_price: '1.50', is_active: true },
    { id: 2, shop: 1, sheet_size: 'A4', gsm: 120, paper_type: 'Glossy Art Paper', selling_price: '5.00', buying_price: '3.00', is_active: true },
    { id: 3, shop: 1, sheet_size: 'A4', gsm: 170, paper_type: 'Matt Art Card', selling_price: '8.00', buying_price: '5.00', is_active: true },
    { id: 4, shop: 1, sheet_size: 'A3', gsm: 250, paper_type: 'Glossy Art Card', selling_price: '15.00', buying_price: '9.00', is_active: true },
    { id: 5, shop: 1, sheet_size: 'A3', gsm: 300, paper_type: 'Board', selling_price: '20.00', buying_price: '12.00', is_active: true },
  ],
  'mombasa-graphics': [
    { id: 6, shop: 2, sheet_size: 'A4', gsm: 100, paper_type: 'Bond', selling_price: '3.00', buying_price: '1.80', is_active: true },
    { id: 7, shop: 2, sheet_size: 'A4', gsm: 150, paper_type: 'Glossy Art Paper', selling_price: '6.50', buying_price: '4.00', is_active: true },
    { id: 8, shop: 2, sheet_size: 'A3', gsm: 200, paper_type: 'Matt Art Card', selling_price: '12.00', buying_price: '7.00', is_active: true },
  ],
  'kisumu-print-works': [
    { id: 9, shop: 3, sheet_size: 'A4', gsm: 80, paper_type: 'Bond', selling_price: '2.00', buying_price: '1.20', is_active: true },
    { id: 10, shop: 3, sheet_size: 'A4', gsm: 130, paper_type: 'Glossy Art Paper', selling_price: '5.50', buying_price: '3.50', is_active: true },
    { id: 11, shop: 3, sheet_size: 'A3', gsm: 250, paper_type: 'Glossy Art Card', selling_price: '14.00', buying_price: '8.50', is_active: true },
  ],
}

export const materialsByShop: Record<string, MaterialItem[]> = {
  'nairobi-print-hub': [
    { id: 1, material_type: 'SAV (Self-Adhesive Vinyl)', name: 'SAV', unit: 'sqm', selling_price: '600', is_active: true },
    { id: 2, material_type: 'PVC Banner (440gsm)', name: 'PVC Banner', unit: 'sqm', selling_price: '450', is_active: true },
  ],
  'mombasa-graphics': [
    { id: 3, material_type: 'SAV (Self-Adhesive Vinyl)', name: 'SAV', unit: 'sqm', selling_price: '550', is_active: true },
    { id: 4, material_type: 'PVC Banner (440gsm)', name: 'PVC Banner', unit: 'sqm', selling_price: '400', is_active: true },
    { id: 5, material_type: 'Canvas', name: 'Canvas', unit: 'sqm', selling_price: '1200', is_active: true },
    { id: 6, material_type: 'Backlit Film', name: 'Backlit Film', unit: 'sqm', selling_price: '900', is_active: true },
  ],
  'kisumu-print-works': [
    { id: 7, material_type: 'SAV (Self-Adhesive Vinyl)', name: 'SAV', unit: 'sqm', selling_price: '500', is_active: true },
    { id: 8, material_type: 'PVC Banner (440gsm)', name: 'PVC Banner', unit: 'sqm', selling_price: '380', is_active: true },
  ],
}

export const finishingRatesByShop: Record<string, FinishingRate[]> = {
  'nairobi-print-hub': [
    { id: 1, name: 'Lamination (Glossy)', price: '5.00', charge_unit: 'PER_PIECE', is_active: true },
    { id: 2, name: 'UV Coating', price: '3.00', charge_unit: 'PER_PIECE', is_active: true },
    { id: 3, name: 'Round Corners', price: '2.00', charge_unit: 'PER_PIECE', is_active: true },
  ],
  'mombasa-graphics': [
    { id: 1, name: 'Lamination (Glossy)', price: '6.00', charge_unit: 'PER_PIECE', is_active: true },
    { id: 4, name: 'Tri-fold', price: '4.00', charge_unit: 'PER_PIECE', is_active: true },
    { id: 5, name: 'Roll-up Stand', price: '1500.00', charge_unit: 'FLAT', is_active: true },
  ],
  'kisumu-print-works': [
    { id: 6, name: 'Eyelets', price: '50.00', charge_unit: 'PER_PIECE', is_active: true },
    { id: 7, name: 'Hemming', price: '100.00', charge_unit: 'PER_SQM', is_active: true },
    { id: 8, name: 'Numbering', price: '3.00', charge_unit: 'PER_PIECE', is_active: true },
    { id: 9, name: 'Padding', price: '50.00', charge_unit: 'PER_PIECE', is_active: true },
  ],
}

export function getShopDataForProduct(product: Product) {
  const slug = product.shop?.slug || ''
  const papers = papersByShop[slug] || []
  const materials = materialsByShop[slug] || []
  const finishings = finishingRatesByShop[slug] || []
  return { papers, materials, finishings }
}`,

  // ── Pinia store ──
  'stores/quote.ts': `import { defineStore } from 'pinia'
import type { QuoteItem, Product, Paper, MaterialItem, FinishingRate } from '~/shared/types'

export const useQuoteStore = defineStore('quote', {
  state: () => ({
    items: [] as QuoteItem[],
  }),

  getters: {
    itemCount: (state) => state.items.length,
    totalQuantity: (state) => state.items.reduce((sum, i) => sum + i.quantity, 0),
    grandTotal: (state) => state.items.reduce((sum, i) => sum + (i.estimatedTotal ?? 0), 0),
  },

  actions: {
    addItem(payload: {
      product: Product
      quantity: number
      sides: 'SIMPLEX' | 'DUPLEX'
      color_mode: 'BW' | 'COLOR'
      paper?: Paper | null
      material?: MaterialItem | null
      finishings: FinishingRate[]
      special_instructions?: string
      estimatedTotal?: number | null
      estimatedPerUnit?: number | null
    }) {
      const id = \`qi-\${Date.now()}-\${Math.random().toString(36).slice(2, 8)}\`
      this.items.push({ ...payload, id })
    },

    removeItem(id: string) {
      this.items = this.items.filter(i => i.id !== id)
    },

    updateItemQty(id: string, qty: number) {
      const item = this.items.find(i => i.id === id)
      if (item) {
        item.quantity = qty
      }
    },

    clearQuote() {
      this.items = []
    },
  },
})`,

  // ── Composable ──
  'composables/useProductPriceDisplay.ts': `import type { Product } from '~/shared/types'

export function useProductPriceDisplay() {
  function priceDisplay(product: Product): string {
    return product.price_hint?.price_display || 'Get Quote'
  }

  function priceDisplaySummary(product: Product): { totalLine: string; perUnitLine: string | null } | null {
    const hint = product.price_hint || product.price_range_est
    if (!hint?.can_calculate || !hint.total) return null
    return {
      totalLine: \`KES \${hint.total.toLocaleString()}\`,
      perUnitLine: hint.per_unit ? \`KES \${hint.per_unit.toFixed(2)} / pc\` : null,
    }
  }

  return { priceDisplay, priceDisplaySummary }
}`,

  // ── Layout ──
  'layouts/default.vue': `<template>
  <div class="min-h-screen bg-amber-50/80 dark:bg-stone-950 flex flex-col">
    <!-- Header -->
    <header class="sticky top-0 z-30 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-stone-200 dark:border-stone-800">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between gap-4">
          <NuxtLink to="/" class="flex items-center gap-3 no-underline">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <PackageIcon class="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 class="text-xl font-bold text-stone-800 dark:text-stone-100">Printy</h1>
              <p class="text-xs text-stone-500 dark:text-stone-400">Print Shop Quoting</p>
            </div>
          </NuxtLink>

          <button
            @click="drawerOpen = true"
            class="relative inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-medium text-sm transition-colors shadow-md shadow-amber-500/20"
          >
            <ShoppingCartIcon class="h-5 w-5" />
            <span class="hidden sm:inline">Quote Draft</span>
            <span
              v-if="quoteStore.itemCount > 0"
              class="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center ring-2 ring-white dark:ring-stone-900"
            >
              {{ quoteStore.itemCount }}
            </span>
          </button>
        </div>
      </div>
    </header>

    <!-- Main -->
    <main class="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="border-t border-stone-200 dark:border-stone-800 bg-white/60 dark:bg-stone-900/60 backdrop-blur-sm mt-auto">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="text-sm text-stone-500 dark:text-stone-400">
          © 2025 Printy — Print Shop Quoting Platform
        </p>
        <div class="flex gap-4 text-sm text-stone-400 dark:text-stone-500">
          <span class="hover:text-stone-600 dark:hover:text-stone-300 cursor-pointer">About</span>
          <span class="hover:text-stone-600 dark:hover:text-stone-300 cursor-pointer">Help</span>
          <span class="hover:text-stone-600 dark:hover:text-stone-300 cursor-pointer">Contact</span>
        </div>
      </div>
    </footer>

    <!-- Quote Drawer -->
    <QuoteDrawer v-model="drawerOpen" />
  </div>
</template>

<script setup lang="ts">
import { Package as PackageIcon, ShoppingCart as ShoppingCartIcon } from 'lucide-vue-next'
import { useQuoteStore } from '~/stores/quote'

const quoteStore = useQuoteStore()
const drawerOpen = ref(false)
</script>`,

  // ── ProductCard component ──
  'components/ProductCard.vue': `<template>
  <article
    class="group rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 overflow-hidden hover:border-amber-300 dark:hover:border-amber-700/50 hover:shadow-lg transition-all cursor-pointer"
    @click="$emit('tweak', product)"
  >
    <!-- Image / Placeholder -->
    <div class="relative aspect-[4/3] bg-stone-100 dark:bg-stone-800 overflow-hidden">
      <img
        v-if="product.primary_image"
        :src="product.primary_image"
        :alt="product.name"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div v-else class="absolute inset-0 flex items-center justify-center">
        <PackageIcon class="h-16 w-16 text-stone-200 dark:text-stone-700" />
      </div>

      <!-- Shop label -->
      <div v-if="product.shop" class="absolute top-3 left-3">
        <span class="inline-flex items-center gap-1.5 rounded-full bg-white/90 dark:bg-stone-900/90 backdrop-blur-sm border border-stone-200 dark:border-stone-700 px-3 py-1 text-xs font-medium text-stone-600 dark:text-stone-300">
          <StoreIcon class="h-3 w-3" />
          {{ product.shop.name }}
        </span>
      </div>

      <!-- Pricing mode badge -->
      <div class="absolute top-3 right-3">
        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100/90 dark:bg-amber-900/70 text-amber-700 dark:text-amber-300 backdrop-blur-sm">
          {{ product.pricing_mode === 'LARGE_FORMAT' ? 'Large Format' : 'Sheet' }}
        </span>
      </div>
    </div>

    <div class="p-5">
      <h3 class="font-bold text-stone-800 dark:text-stone-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
        {{ product.name }}
      </h3>
      <p v-if="product.category" class="mt-0.5 text-sm text-stone-500 dark:text-stone-400">
        {{ product.category }}
      </p>

      <!-- Details -->
      <div class="mt-3 space-y-1.5">
        <div v-if="product.final_size" class="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
          <RulerIcon class="h-3.5 w-3.5 shrink-0" />
          <span>{{ product.final_size }}</span>
        </div>
        <div v-if="product.imposition_summary" class="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
          <Grid2x2Icon class="h-3.5 w-3.5 shrink-0" />
          <span>Fits on {{ product.imposition_summary }}</span>
        </div>
        <div v-if="product.min_quantity" class="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
          <HashIcon class="h-3.5 w-3.5 shrink-0" />
          <span>Min {{ product.min_quantity }} pcs</span>
        </div>
        <div v-if="product.finishing_summary?.length" class="flex flex-wrap gap-1 mt-1">
          <span
            v-for="finish in product.finishing_summary"
            :key="finish"
            class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300"
          >
            {{ finish }}
          </span>
        </div>
      </div>

      <!-- Price & Action -->
      <div class="mt-4 flex items-end justify-between gap-2">
        <div class="min-w-0 flex-1">
          <template v-if="summary">
            <div class="text-lg font-bold text-amber-600 dark:text-amber-400">
              {{ summary.totalLine }}
            </div>
            <div v-if="summary.perUnitLine" class="text-sm text-stone-500 dark:text-stone-400">
              {{ summary.perUnitLine }}
            </div>
          </template>
          <div v-else class="text-lg font-bold text-amber-600 dark:text-amber-400">
            {{ displayPrice }}
          </div>
        </div>
        <button
          @click.stop="$emit('tweak', product)"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-sm font-medium hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors"
        >
          <SlidersHorizontalIcon class="h-4 w-4" />
          Tweak
        </button>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import {
  Package as PackageIcon,
  Store as StoreIcon,
  Ruler as RulerIcon,
  Grid2x2 as Grid2x2Icon,
  Hash as HashIcon,
  SlidersHorizontal as SlidersHorizontalIcon,
} from 'lucide-vue-next'
import type { Product } from '~/shared/types'

const props = defineProps<{ product: Product }>()
defineEmits<{ (e: 'tweak', product: Product): void }>()

const { priceDisplay, priceDisplaySummary } = useProductPriceDisplay()
const displayPrice = computed(() => priceDisplay(props.product))
const summary = computed(() => priceDisplaySummary(props.product))
</script>`,

  // ── ProductTweakModal component ──
  'components/ProductTweakModal.vue': `<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        @keydown.esc="close"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="close" />

        <!-- Modal panel -->
        <div
          class="modal-panel relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-stone-900 rounded-2xl shadow-2xl z-10"
          @click.stop
        >
          <!-- ── Header ── -->
          <div class="sticky top-0 z-10 bg-white/95 dark:bg-stone-900/95 backdrop-blur border-b border-stone-200 dark:border-stone-700 px-6 py-4 rounded-t-2xl">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h2 class="text-lg font-bold text-stone-800 dark:text-stone-100">
                  Tweak Quote — {{ product.name }}
                </h2>
                <p class="text-sm text-stone-500 dark:text-stone-400 mt-0.5">
                  Customize paper, quantity, finishing, and other options before adding to your quote.
                </p>
              </div>
              <button
                @click="close"
                class="rounded-lg p-1.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                <XIcon class="h-5 w-5" />
              </button>
            </div>
          </div>

          <!-- ── Body ── -->
          <div class="min-h-[200px] p-6 space-y-6">

            <!-- Success message -->
            <div
              v-if="successMessage"
              class="rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30 p-4 flex items-center gap-3"
            >
              <div class="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <CheckIcon class="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <p class="text-sm font-medium text-green-700 dark:text-green-300">{{ successMessage }}</p>
            </div>

            <!-- Loading -->
            <div v-if="loading" class="flex flex-col items-center justify-center py-12 text-stone-400">
              <Loader2Icon class="h-8 w-8 animate-spin mb-3" />
              <p class="text-sm">Loading options…</p>
            </div>

            <!-- Error -->
            <div
              v-else-if="loadError"
              class="rounded-lg border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/30 p-4 text-sm text-red-700 dark:text-red-300"
            >
              <p class="font-semibold flex items-center gap-2">
                <AlertCircleIcon class="h-4 w-4" />
                Could not open quote options.
              </p>
              <p class="mt-1">{{ loadError }}</p>
              <div class="mt-3 flex gap-2">
                <button
                  @click="loadShopData"
                  class="px-3 py-1.5 text-sm rounded-lg bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900 transition-colors"
                >
                  Retry
                </button>
                <button
                  @click="close"
                  class="px-3 py-1.5 text-sm rounded-lg text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>

            <!-- ── Loaded content ── -->
            <template v-if="!loading && !loadError">
              <!-- Product info row -->
              <div class="flex items-center gap-4 rounded-xl bg-stone-50 dark:bg-stone-800/50 p-4">
                <div class="w-16 h-16 rounded-lg bg-stone-200 dark:bg-stone-700 flex items-center justify-center shrink-0 border border-stone-200 dark:border-stone-600 overflow-hidden">
                  <img v-if="product.primary_image" :src="product.primary_image" :alt="product.name" class="w-full h-full object-cover" />
                  <PackageIcon v-else class="h-8 w-8 text-stone-400 dark:text-stone-500" />
                </div>
                <div class="min-w-0 flex-1">
                  <p class="font-semibold text-stone-800 dark:text-stone-100 truncate">{{ product.name }}</p>
                  <p v-if="product.category" class="text-xs text-stone-500 dark:text-stone-400">{{ product.category }}</p>
                  <div class="flex flex-wrap gap-1.5 mt-1">
                    <span v-if="product.final_size" class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300">
                      {{ product.final_size }}
                    </span>
                    <span v-if="product.imposition_summary" class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300">
                      {{ product.imposition_summary }}
                    </span>
                    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
                      {{ product.pricing_mode === 'LARGE_FORMAT' ? 'Large Format' : 'Sheet' }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- ── Form ── -->
              <form class="space-y-5" @submit.prevent="onSubmit">

                <!-- Quantity -->
                <div>
                  <label class="block text-sm font-medium text-stone-600 dark:text-stone-300 mb-1.5">Quantity</label>
                  <div class="flex items-center gap-2">
                    <button
                      type="button"
                      @click="form.quantity = Math.max(minQty, form.quantity - 50)"
                      class="p-2 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
                    >
                      <MinusIcon class="h-4 w-4" />
                    </button>
                    <input
                      v-model.number="form.quantity"
                      type="number"
                      :min="minQty"
                      class="w-24 text-center rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 px-3 py-2 text-sm font-medium text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
                      @blur="form.quantity = Math.max(minQty, form.quantity || minQty)"
                    />
                    <button
                      type="button"
                      @click="form.quantity += 50"
                      class="p-2 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
                    >
                      <PlusIcon class="h-4 w-4" />
                    </button>
                    <span class="text-xs text-stone-400">min {{ minQty }}</span>
                  </div>
                </div>

                <!-- Sides (SHEET only) -->
                <div v-if="product.pricing_mode === 'SHEET'">
                  <label class="block text-sm font-medium text-stone-600 dark:text-stone-300 mb-1.5">Sides</label>
                  <div class="grid grid-cols-2 gap-2">
                    <button
                      v-for="side in (['SIMPLEX', 'DUPLEX'] as const)"
                      :key="side"
                      type="button"
                      :class="[
                        'rounded-lg border px-3 py-2 text-sm font-medium transition-all',
                        form.sides === side
                          ? 'border-amber-400 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 ring-1 ring-amber-400/50'
                          : 'border-stone-200 dark:border-stone-600 text-stone-600 dark:text-stone-300 hover:border-stone-300 dark:hover:border-stone-500'
                      ]"
                      @click="form.sides = side"
                    >
                      {{ side === 'SIMPLEX' ? 'Single-sided' : 'Double-sided' }}
                    </button>
                  </div>
                </div>

                <!-- Color mode (SHEET only) -->
                <div v-if="product.pricing_mode === 'SHEET'">
                  <label class="block text-sm font-medium text-stone-600 dark:text-stone-300 mb-1.5">Color</label>
                  <div class="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      :class="[
                        'rounded-lg border px-3 py-2 text-sm font-medium transition-all flex items-center justify-center gap-1',
                        form.color_mode === 'COLOR'
                          ? 'border-amber-400 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 ring-1 ring-amber-400/50'
                          : 'border-stone-200 dark:border-stone-600 text-stone-600 dark:text-stone-300 hover:border-stone-300'
                      ]"
                      @click="form.color_mode = 'COLOR'"
                    >
                      <PaletteIcon class="h-4 w-4" />
                      Color
                    </button>
                    <button
                      type="button"
                      :class="[
                        'rounded-lg border px-3 py-2 text-sm font-medium transition-all',
                        form.color_mode === 'BW'
                          ? 'border-amber-400 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 ring-1 ring-amber-400/50'
                          : 'border-stone-200 dark:border-stone-600 text-stone-600 dark:text-stone-300 hover:border-stone-300'
                      ]"
                      @click="form.color_mode = 'BW'"
                    >
                      B&amp;W
                    </button>
                  </div>
                </div>

                <!-- Paper (SHEET mode) -->
                <div v-if="product.pricing_mode === 'SHEET' && papers.length">
                  <label class="block text-sm font-medium text-stone-600 dark:text-stone-300 mb-1.5">Paper type / grammage</label>
                  <div class="space-y-1.5 max-h-36 overflow-y-auto rounded-lg border border-stone-200 dark:border-stone-600 p-2">
                    <label
                      v-for="p in papers"
                      :key="p.id"
                      :class="[
                        'flex items-center gap-3 rounded-lg px-3 py-2 cursor-pointer transition-colors',
                        form.paper === p.id ? 'bg-amber-50 dark:bg-amber-900/20' : 'hover:bg-stone-50 dark:hover:bg-stone-800/50'
                      ]"
                    >
                      <input
                        v-model="form.paper"
                        type="radio"
                        :value="p.id"
                        class="accent-amber-500"
                      />
                      <span class="text-sm text-stone-700 dark:text-stone-200">
                        {{ p.sheet_size }} {{ p.gsm }}gsm {{ p.paper_type }}
                      </span>
                      <span class="ml-auto text-xs text-stone-400">KES {{ p.selling_price }}</span>
                    </label>
                  </div>
                </div>

                <!-- Material (LARGE_FORMAT mode) -->
                <div v-if="product.pricing_mode === 'LARGE_FORMAT' && materials.length">
                  <label class="block text-sm font-medium text-stone-600 dark:text-stone-300 mb-1.5">Material</label>
                  <div class="space-y-1.5 max-h-36 overflow-y-auto rounded-lg border border-stone-200 dark:border-stone-600 p-2">
                    <label
                      v-for="m in materials"
                      :key="m.id"
                      :class="[
                        'flex items-center gap-3 rounded-lg px-3 py-2 cursor-pointer transition-colors',
                        form.material === m.id ? 'bg-amber-50 dark:bg-amber-900/20' : 'hover:bg-stone-50 dark:hover:bg-stone-800/50'
                      ]"
                    >
                      <input
                        v-model="form.material"
                        type="radio"
                        :value="m.id"
                        class="accent-amber-500"
                      />
                      <span class="text-sm text-stone-700 dark:text-stone-200">
                        {{ m.material_type ?? m.name }}
                      </span>
                      <span class="ml-auto text-xs text-stone-400">
                        KES {{ m.selling_price }}/{{ m.unit }}
                      </span>
                    </label>
                  </div>
                </div>

                <!-- Finishing options -->
                <div v-if="finishingRates.length">
                  <label class="block text-sm font-medium text-stone-600 dark:text-stone-300 mb-1.5">Finishing</label>
                  <div class="space-y-1.5 max-h-40 overflow-y-auto rounded-lg border border-stone-200 dark:border-stone-600 p-2">
                    <label
                      v-for="fr in finishingRates"
                      :key="fr.id"
                      class="flex items-center gap-3 rounded-lg px-3 py-2 cursor-pointer transition-colors hover:bg-stone-50 dark:hover:bg-stone-800/50"
                    >
                      <input
                        type="checkbox"
                        :checked="form.finishings.some(f => f.finishing_rate === fr.id)"
                        class="accent-amber-500 h-4 w-4 rounded"
                        @change="toggleFinishing(fr.id, ($event.target as HTMLInputElement).checked)"
                      />
                      <span class="text-sm text-stone-700 dark:text-stone-200 flex-1">{{ fr.name }}</span>
                      <span class="text-xs text-stone-400">KES {{ fr.price }}</span>
                    </label>
                  </div>
                </div>

                <!-- Hint for complete quote -->
                <div
                  v-if="needsPaperOrFinishing"
                  class="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/20 p-3 text-sm text-amber-800 dark:text-amber-200"
                >
                  <p class="font-medium flex items-center gap-2">
                    <LightbulbIcon class="h-4 w-4 shrink-0" />
                    For a complete quote
                  </p>
                  <ul class="mt-1 ml-6 list-disc space-y-0.5 text-amber-700 dark:text-amber-300">
                    <li v-if="product.pricing_mode === 'SHEET' && papers.length && !form.paper">Select paper for accurate pricing</li>
                    <li v-if="product.pricing_mode === 'LARGE_FORMAT' && materials.length && !form.material">Select material for accurate pricing</li>
                    <li v-if="finishingRates.length && !form.finishings.length">Consider adding finishing (lamination, binding, etc.)</li>
                  </ul>
                </div>

                <!-- Special instructions -->
                <div>
                  <label class="block text-sm font-medium text-stone-600 dark:text-stone-300 mb-1.5">Special instructions</label>
                  <textarea
                    v-model="form.special_instructions"
                    placeholder="Any notes for the shop (optional)"
                    rows="2"
                    class="w-full rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 px-3 py-2 text-sm text-stone-800 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                  />
                </div>

                <!-- ── Price preview / Quote summary ── -->
                <div class="rounded-xl border border-amber-200 dark:border-amber-800/50 bg-amber-50/50 dark:bg-amber-900/10 p-4 space-y-2">
                  <p class="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">Quote Summary</p>

                  <div class="flex justify-between text-sm">
                    <span class="text-stone-500 dark:text-stone-400">Product</span>
                    <span class="font-medium text-stone-800 dark:text-stone-100">{{ product.name }}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-stone-500 dark:text-stone-400">Quantity</span>
                    <span class="font-medium text-stone-800 dark:text-stone-100">{{ form.quantity }} pcs</span>
                  </div>
                  <div v-if="product.pricing_mode === 'SHEET'" class="flex justify-between text-sm">
                    <span class="text-stone-500 dark:text-stone-400">Sides</span>
                    <span class="font-medium text-stone-800 dark:text-stone-100">
                      {{ form.sides === 'DUPLEX' ? 'Double-sided' : 'Single-sided' }}
                    </span>
                  </div>
                  <div v-if="product.pricing_mode === 'SHEET'" class="flex justify-between text-sm">
                    <span class="text-stone-500 dark:text-stone-400">Color</span>
                    <span class="font-medium text-stone-800 dark:text-stone-100">
                      {{ form.color_mode === 'COLOR' ? 'Full Color' : 'Black & White' }}
                    </span>
                  </div>
                  <div v-if="selectedPaperLabel" class="flex justify-between text-sm">
                    <span class="text-stone-500 dark:text-stone-400">Paper</span>
                    <span class="font-medium text-stone-800 dark:text-stone-100">{{ selectedPaperLabel }}</span>
                  </div>
                  <div v-if="selectedMaterialLabel" class="flex justify-between text-sm">
                    <span class="text-stone-500 dark:text-stone-400">Material</span>
                    <span class="font-medium text-stone-800 dark:text-stone-100">{{ selectedMaterialLabel }}</span>
                  </div>
                  <div v-if="selectedFinishingLabels.length" class="flex justify-between text-sm">
                    <span class="text-stone-500 dark:text-stone-400">Finishing</span>
                    <span class="font-medium text-stone-800 dark:text-stone-100 text-right max-w-[60%]">
                      {{ selectedFinishingLabels.join(', ') }}
                    </span>
                  </div>

                  <!-- Precise price: shown when paper/material selected (no min/max range) -->
                  <template v-if="estimatedTotal">
                    <div class="border-t border-amber-200/60 dark:border-amber-800/30 pt-2 space-y-1">
                      <div class="flex justify-between items-baseline">
                        <span class="font-semibold text-stone-800 dark:text-stone-100">Est. total</span>
                        <span class="text-lg font-bold text-amber-600 dark:text-amber-400">
                          KES {{ estimatedTotal.total.toLocaleString() }}
                        </span>
                      </div>
                      <div class="flex justify-between text-sm text-stone-400">
                        <span>Per item</span>
                        <span>KES {{ estimatedTotal.perUnit.toFixed(2) }}</span>
                      </div>
                    </div>
                  </template>

                  <p class="text-xs text-stone-400 pt-1">Final price computed by the shop after submission.</p>
                </div>

                <!-- Actions -->
                <div class="flex gap-3 pt-2">
                  <button
                    type="button"
                    @click="close"
                    class="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-600 text-stone-600 dark:text-stone-300 text-sm font-medium hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    :disabled="submitting"
                    class="flex-1 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Loader2Icon v-if="submitting" class="h-4 w-4 animate-spin" />
                    <PlusIcon v-else class="h-4 w-4" />
                    {{ submitting ? 'Adding…' : 'Add to Quote' }}
                  </button>
                </div>
              </form>
            </template>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import {
  X as XIcon,
  Loader2 as Loader2Icon,
  Package as PackageIcon,
  Minus as MinusIcon,
  Plus as PlusIcon,
  Palette as PaletteIcon,
  Lightbulb as LightbulbIcon,
  Check as CheckIcon,
  AlertCircle as AlertCircleIcon,
} from 'lucide-vue-next'
import type { Product, Paper, MaterialItem, FinishingRate, TweakForm, QuoteItemFinishingPayload } from '~/shared/types'
import { getShopDataForProduct } from '~/shared/mockData'
import { useQuoteStore } from '~/stores/quote'

const props = defineProps<{
  product: Product
  shopSlug: string
}>()

const emit = defineEmits<{
  (e: 'added'): void
}>()

const modelValue = defineModel<boolean>({ default: false })

const quoteStore = useQuoteStore()

const loading = ref(false)
const loadError = ref('')
const submitting = ref(false)
const successMessage = ref('')
const papers = ref<Paper[]>([])
const materials = ref<MaterialItem[]>([])
const finishingRates = ref<FinishingRate[]>([])

const minQty = computed(() => props.product.min_quantity || 100)

const form = reactive<TweakForm>({
  quantity: minQty.value,
  sides: (props.product.default_sides as 'SIMPLEX' | 'DUPLEX') || 'SIMPLEX',
  color_mode: 'COLOR',
  paper: null,
  material: null,
  finishings: [],
  special_instructions: '',
})

// ── Computed labels ──

const selectedPaperLabel = computed(() => {
  if (!form.paper) return null
  const p = papers.value.find(x => x.id === form.paper)
  return p ? \`\${p.sheet_size} \${p.gsm}gsm \${p.paper_type}\` : null
})

const selectedMaterialLabel = computed(() => {
  if (!form.material) return null
  const m = materials.value.find(x => x.id === form.material)
  return m ? (m.material_type ?? m.name ?? '') : null
})

const selectedFinishingLabels = computed(() => {
  return form.finishings
    .map(f => finishingRates.value.find(r => r.id === f.finishing_rate)?.name)
    .filter(Boolean) as string[]
})

const needsPaperOrFinishing = computed(() => {
  if (props.product.pricing_mode === 'SHEET' && papers.value.length && !form.paper) return true
  if (props.product.pricing_mode === 'LARGE_FORMAT' && materials.value.length && !form.material) return true
  if (finishingRates.value.length && !form.finishings.length) return true
  return false
})

// Precise estimated total — calculated from exact selections (no min/max range)
const estimatedTotal = computed(() => {
  if (!props.product.price_hint?.can_calculate) return null

  const base = props.product.price_hint.total || 0
  const defaultQty = props.product.min_quantity || 100
  const ratio = form.quantity / defaultQty
  let total = base * ratio

  // Paper cost addition
  if (form.paper) {
    const paper = papers.value.find(p => p.id === form.paper)
    if (paper) {
      total += parseFloat(paper.selling_price) * form.quantity
    }
  }

  // Material cost addition
  if (form.material) {
    const mat = materials.value.find(m => m.id === form.material)
    if (mat) {
      total += parseFloat(mat.selling_price) * form.quantity
    }
  }

  if (form.sides === 'DUPLEX' && props.product.default_sides !== 'DUPLEX') {
    total *= 1.4
  }

  form.finishings.forEach(f => {
    const rate = finishingRates.value.find(r => r.id === f.finishing_rate)
    if (rate) {
      const price = parseFloat(rate.price) || 0
      if (rate.charge_unit === 'FLAT') {
        total += price
      } else {
        total += price * form.quantity
      }
    }
  })

  return {
    total: Math.round(total),
    perUnit: Math.round((total / form.quantity) * 100) / 100,
  }
})

// ── Methods ──

function close() {
  modelValue.value = false
}

function resetForm() {
  const defaultFinishings: QuoteItemFinishingPayload[] = (props.product.finishing_options ?? [])
    .filter(o => o.is_default)
    .map(o => ({ finishing_rate: o.finishing_rate }))

  form.quantity = minQty.value
  form.sides = (props.product.default_sides as 'SIMPLEX' | 'DUPLEX') || 'SIMPLEX'
  form.color_mode = 'COLOR'
  form.paper = null
  form.material = null
  form.finishings = defaultFinishings
  form.special_instructions = ''
  successMessage.value = ''
}

async function loadShopData() {
  loading.value = true
  loadError.value = ''
  try {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 500))
    const data = getShopDataForProduct(props.product)
    papers.value = data.papers
    materials.value = data.materials
    finishingRates.value = data.finishings
  } catch {
    loadError.value = 'Could not load product options.'
  } finally {
    loading.value = false
  }
}

function toggleFinishing(id: number, checked: boolean) {
  if (checked) {
    form.finishings.push({ finishing_rate: id })
  } else {
    form.finishings = form.finishings.filter(f => f.finishing_rate !== id)
  }
}

async function onSubmit() {
  submitting.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 400))

    const selectedPaper = form.paper ? papers.value.find(p => p.id === form.paper) ?? null : null
    const selectedMaterial = form.material ? materials.value.find(m => m.id === form.material) ?? null : null
    const selectedFinishings = form.finishings
      .map(f => finishingRates.value.find(r => r.id === f.finishing_rate))
      .filter(Boolean) as FinishingRate[]

    const est = estimatedTotal.value

    quoteStore.addItem({
      product: props.product,
      quantity: Math.max(minQty.value, form.quantity),
      sides: form.sides,
      color_mode: form.color_mode,
      paper: selectedPaper,
      material: selectedMaterial,
      finishings: selectedFinishings,
      special_instructions: form.special_instructions.trim() || undefined,
      estimatedTotal: est?.total ?? null,
      estimatedPerUnit: est?.perUnit ?? null,
    })

    successMessage.value = \`\${props.product.name} added to your quote!\`
    emit('added')

    setTimeout(() => {
      close()
    }, 1200)
  } catch {
    loadError.value = 'Could not add to quote. Please try again.'
  } finally {
    submitting.value = false
  }
}

// ── Body scroll lock & data loading ──

watch(modelValue, (open, wasOpen) => {
  if (open && !wasOpen) {
    document.body.style.overflow = 'hidden'
    resetForm()
    loadShopData()
  }
  if (!open && wasOpen) {
    document.body.style.overflow = ''
  }
})

onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>`,

  // ── QuoteDrawer component ──
  'components/QuoteDrawer.vue': `<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex"
        role="dialog"
        aria-modal="true"
        @keydown.esc="close"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="close" />

        <!-- Drawer panel -->
        <div
          class="drawer-panel relative ml-auto w-full max-w-md bg-white dark:bg-stone-900 shadow-2xl flex flex-col h-full"
          @click.stop
        >
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-stone-700">
            <div class="flex items-center gap-2">
              <ShoppingCartIcon class="h-5 w-5 text-amber-500" />
              <h2 class="text-lg font-bold text-stone-800 dark:text-stone-100">
                Quote Draft ({{ quoteStore.itemCount }})
              </h2>
            </div>
            <div class="flex items-center gap-2">
              <button
                v-if="quoteStore.itemCount > 0"
                @click="quoteStore.clearQuote()"
                class="text-xs text-red-500 hover:text-red-600 transition-colors"
              >
                Clear all
              </button>
              <button
                @click="close"
                class="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                <XIcon class="h-5 w-5" />
              </button>
            </div>
          </div>

          <!-- Items -->
          <div class="flex-1 overflow-y-auto">
            <div
              v-if="quoteStore.itemCount === 0"
              class="flex flex-col items-center justify-center h-full text-stone-400 dark:text-stone-500 px-6"
            >
              <ShoppingCartIcon class="h-16 w-16 mb-4" />
              <p class="text-lg font-medium">Your quote is empty</p>
              <p class="text-sm mt-1">Click "Tweak" on any product to customize and add it.</p>
            </div>

            <div v-else class="divide-y divide-stone-100 dark:divide-stone-800">
              <div
                v-for="item in quoteStore.items"
                :key="item.id"
                class="px-6 py-4 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors"
              >
                <div class="flex items-start gap-3">
                  <div class="w-12 h-12 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center shrink-0">
                    <PackageIcon class="h-6 w-6 text-stone-400" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="font-semibold text-stone-800 dark:text-stone-100 text-sm truncate">
                      {{ item.product.name }}
                    </p>
                    <p class="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                      {{ item.quantity }} pcs •
                      {{ item.sides === 'DUPLEX' ? 'Double-sided' : 'Single-sided' }} •
                      {{ item.color_mode === 'BW' ? 'B&W' : 'Color' }}
                    </p>
                    <p v-if="item.paper" class="text-xs text-stone-400 mt-0.5">
                      📄 {{ item.paper.sheet_size }} {{ item.paper.gsm }}gsm {{ item.paper.paper_type }}
                    </p>
                    <p v-if="item.material" class="text-xs text-stone-400 mt-0.5">
                      🧱 {{ item.material.material_type ?? item.material.name }}
                    </p>
                    <p v-if="item.finishings.length" class="text-xs text-stone-400 mt-0.5">
                      ✨ {{ item.finishings.map(f => f.name).join(', ') }}
                    </p>
                    <p v-if="item.special_instructions" class="text-xs text-amber-600 dark:text-amber-400 mt-0.5 italic">
                      "{{ item.special_instructions }}"
                    </p>
                    <!-- Precise price from tweak modal -->
                    <p v-if="item.estimatedTotal" class="text-sm font-semibold text-amber-600 dark:text-amber-400 mt-1">
                      KES {{ item.estimatedTotal.toLocaleString() }}
                      <span v-if="item.estimatedPerUnit" class="text-xs font-normal text-stone-400">
                        (KES {{ item.estimatedPerUnit.toFixed(2) }}/pc)
                      </span>
                    </p>
                  </div>
                  <button
                    @click="quoteStore.removeItem(item.id)"
                    class="p-1.5 text-stone-300 hover:text-red-500 transition-colors shrink-0"
                  >
                    <Trash2Icon class="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div
            v-if="quoteStore.itemCount > 0"
            class="border-t border-stone-200 dark:border-stone-700 px-6 py-4 space-y-3"
          >
            <div class="flex justify-between text-sm">
              <span class="text-stone-500 dark:text-stone-400">Total items</span>
              <span class="font-semibold text-stone-800 dark:text-stone-100">{{ quoteStore.itemCount }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-stone-500 dark:text-stone-400">Total quantity</span>
              <span class="font-semibold text-stone-800 dark:text-stone-100">
                {{ quoteStore.totalQuantity.toLocaleString() }} pcs
              </span>
            </div>
            <div v-if="quoteStore.grandTotal > 0" class="flex justify-between text-sm border-t border-stone-100 dark:border-stone-800 pt-2">
              <span class="font-semibold text-stone-700 dark:text-stone-200">Grand Total</span>
              <span class="font-bold text-lg text-amber-600 dark:text-amber-400">
                KES {{ quoteStore.grandTotal.toLocaleString() }}
              </span>
            </div>
            <button class="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold flex items-center justify-center gap-2 transition-colors">
              <SendIcon class="h-4 w-4" />
              Submit Quote Request
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import {
  X as XIcon,
  ShoppingCart as ShoppingCartIcon,
  Package as PackageIcon,
  Trash2 as Trash2Icon,
  Send as SendIcon,
} from 'lucide-vue-next'
import { useQuoteStore } from '~/stores/quote'

const modelValue = defineModel<boolean>({ default: false })
const quoteStore = useQuoteStore()

function close() {
  modelValue.value = false
}

watch(modelValue, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
})

onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>`,

  // ── Pages ──
  'pages/index.vue': `<template>
  <div class="py-8 sm:py-12">
    <!-- Page header -->
    <div class="mb-8">
      <h2 class="text-3xl font-extrabold tracking-tight text-stone-800 dark:text-stone-100 sm:text-4xl flex items-center gap-3">
        <StoreIcon class="h-8 w-8 text-amber-500" />
        Product Gallery
      </h2>
      <p class="mt-2 text-lg text-stone-500 dark:text-stone-400">
        Browse products from print shops across Kenya. Click any product to customize and add to your quote.
      </p>
    </div>

    <!-- Search -->
    <div class="mb-6">
      <div class="relative max-w-md">
        <SearchIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search products, categories, shops…"
          class="w-full rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 pl-10 pr-4 py-2.5 text-sm text-stone-800 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
        />
      </div>
    </div>

    <!-- Category filter pills -->
    <div v-if="categories.length" class="flex flex-wrap gap-2 mb-8">
      <button
        :class="[
          'px-4 py-1.5 rounded-full text-sm font-medium transition-all',
          !categoryFilter
            ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
            : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:border-amber-300 dark:hover:border-amber-700'
        ]"
        @click="categoryFilter = ''"
      >
        All ({{ allProducts.length }})
      </button>
      <button
        v-for="cat in categories"
        :key="cat.name"
        :class="[
          'px-4 py-1.5 rounded-full text-sm font-medium transition-all',
          categoryFilter === cat.name
            ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
            : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:border-amber-300 dark:hover:border-amber-700'
        ]"
        @click="categoryFilter = categoryFilter === cat.name ? '' : cat.name"
      >
        {{ cat.name }} ({{ cat.count }})
      </button>
    </div>

    <!-- Product grid -->
    <div v-if="filteredProducts.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <ProductCard
        v-for="product in filteredProducts"
        :key="product.id"
        :product="product"
        @tweak="openTweak"
      />
    </div>

    <!-- Empty state -->
    <div v-else class="rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 p-16 text-center">
      <PackageIcon class="mx-auto h-16 w-16 text-stone-200 dark:text-stone-700" />
      <h3 class="mt-4 text-lg font-semibold text-stone-700 dark:text-stone-300">No products found</h3>
      <p class="mt-2 text-sm text-stone-500 dark:text-stone-400">
        {{ searchQuery ? 'Try a different search term.' : 'No products match the selected filter.' }}
      </p>
      <button
        v-if="searchQuery || categoryFilter"
        class="mt-4 px-4 py-2 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-sm font-medium hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
        @click="searchQuery = ''; categoryFilter = ''"
      >
        Clear filters
      </button>
    </div>

    <!-- How it works -->
    <section class="mt-16 mb-8">
      <h3 class="text-2xl font-bold text-stone-800 dark:text-stone-100 text-center mb-8">How It Works</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="(step, idx) in howItWorks"
          :key="idx"
          class="text-center p-8 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700"
        >
          <div class="w-16 h-16 mx-auto rounded-2xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
            <component :is="step.icon" class="h-8 w-8" />
          </div>
          <div class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold mb-3">
            {{ idx + 1 }}
          </div>
          <h4 class="font-semibold text-stone-800 dark:text-stone-100">{{ step.title }}</h4>
          <p class="mt-2 text-sm text-stone-500 dark:text-stone-400">{{ step.desc }}</p>
        </div>
      </div>
    </section>

    <!-- Tweak Modal -->
    <ProductTweakModal
      v-if="tweakProduct"
      v-model="tweakModalOpen"
      :product="tweakProduct"
      :shop-slug="tweakProduct.shop?.slug || ''"
      @added="onItemAdded"
    />
  </div>
</template>

<script setup lang="ts">
import {
  Store as StoreIcon,
  Search as SearchIcon,
  Package as PackageIcon,
  SlidersHorizontal as SlidersHorizontalIcon,
  ShoppingCart as ShoppingCartIcon,
  CircleCheck as CircleCheckIcon,
} from 'lucide-vue-next'
import type { Product } from '~/shared/types'
import { products as allProducts } from '~/shared/mockData'

definePageMeta({ layout: 'default' })

const searchQuery = ref('')
const categoryFilter = ref('')
const tweakModalOpen = ref(false)
const tweakProduct = ref<Product | null>(null)
const toastMessage = useState<string>('toast')

const categories = computed(() => {
  const map = new Map<string, number>()
  for (const p of allProducts) {
    if (p.category) {
      map.set(p.category, (map.get(p.category) || 0) + 1)
    }
  }
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name))
})

const filteredProducts = computed(() => {
  let filtered = allProducts
  if (categoryFilter.value) {
    filtered = filtered.filter(p => p.category === categoryFilter.value)
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.category && p.category.toLowerCase().includes(q)) ||
      (p.shop?.name && p.shop.name.toLowerCase().includes(q))
    )
  }
  return filtered
})

function openTweak(product: Product) {
  tweakProduct.value = product
  tweakModalOpen.value = true
}

function onItemAdded() {
  toastMessage.value = \`\${tweakProduct.value?.name ?? 'Product'} added to your quote draft!\`
}

const howItWorks = [
  {
    icon: SlidersHorizontalIcon,
    title: 'Browse & Tweak',
    desc: 'Find products from print shops. Customize paper, quantity, sides, color, and finishing.',
  },
  {
    icon: ShoppingCartIcon,
    title: 'Build Your Quote',
    desc: 'Add multiple products to your quote draft. Review estimated pricing in real-time.',
  },
  {
    icon: CircleCheckIcon,
    title: 'Submit & Get Quote',
    desc: 'Submit your request. The shop reviews and provides a final price for your order.',
  },
]
</script>`,

  'pages/shops/[slug].vue': `<template>
  <div class="py-8 sm:py-12">
    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <Loader2Icon class="h-8 w-8 animate-spin text-stone-400" />
    </div>

    <!-- Shop found -->
    <template v-else-if="shop">
      <!-- Shop header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div class="flex-1 min-w-0">
          <h1 class="text-2xl sm:text-3xl font-bold text-stone-800 dark:text-stone-100">
            {{ shop.name }}
          </h1>
          <p v-if="shop.location" class="text-stone-500 dark:text-stone-400 mt-1 flex items-center gap-1.5">
            <MapPinIcon class="h-4 w-4" />
            {{ shop.location }}
          </p>
          <p v-if="shop.description" class="text-sm text-stone-500 dark:text-stone-400 mt-1">
            {{ shop.description }}
          </p>
        </div>
        <div class="flex gap-2 shrink-0 flex-wrap">
          <NuxtLink
            v-if="quoteStore.itemCount > 0"
            to="/"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 text-sm font-medium hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
          >
            <ShoppingCartIcon class="h-4 w-4" />
            View Quote ({{ quoteStore.itemCount }})
          </NuxtLink>
          <NuxtLink
            to="/"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 text-sm font-medium hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
          >
            <ArrowLeftIcon class="h-4 w-4" />
            Back to Gallery
          </NuxtLink>
        </div>
      </div>

      <!-- Product grid -->
      <div v-if="shopProducts.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProductCard
          v-for="product in shopProducts"
          :key="product.id"
          :product="product"
          @tweak="openTweak"
        />
      </div>

      <!-- No products -->
      <div v-else class="rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 p-12 text-center">
        <PackageIcon class="mx-auto h-16 w-16 text-stone-200 dark:text-stone-700" />
        <h3 class="mt-4 text-lg font-medium text-stone-700 dark:text-stone-300">No products yet</h3>
        <p class="mt-2 text-sm text-stone-500 dark:text-stone-400">This shop hasn't added any products.</p>
      </div>

      <!-- Tweak Modal -->
      <ProductTweakModal
        v-if="tweakProduct"
        v-model="tweakModalOpen"
        :product="tweakProduct"
        :shop-slug="slug"
        @added="onItemAdded"
      />
    </template>

    <!-- Shop not found -->
    <div v-else class="rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 p-12 text-center">
      <StoreIcon class="mx-auto h-16 w-16 text-stone-200 dark:text-stone-700" />
      <h3 class="mt-4 text-lg font-medium text-stone-700 dark:text-stone-300">Shop not found</h3>
      <p class="mt-2 text-sm text-stone-500 dark:text-stone-400">
        The shop you're looking for doesn't exist or is inactive.
      </p>
      <NuxtLink
        to="/"
        class="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium transition-colors"
      >
        Browse Gallery
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Loader2 as Loader2Icon,
  MapPin as MapPinIcon,
  ShoppingCart as ShoppingCartIcon,
  ArrowLeft as ArrowLeftIcon,
  Package as PackageIcon,
  Store as StoreIcon,
} from 'lucide-vue-next'
import type { Product } from '~/shared/types'
import { shops, products } from '~/shared/mockData'
import { useQuoteStore } from '~/stores/quote'

definePageMeta({ layout: 'default' })

const route = useRoute()
const quoteStore = useQuoteStore()
const toastMessage = useState<string>('toast')

const slug = computed(() => route.params.slug as string)
const loading = ref(true)

const shop = computed(() => shops.find(s => s.slug === slug.value) || null)
const shopProducts = computed(() => products.filter(p => p.shop?.slug === slug.value))

const tweakModalOpen = ref(false)
const tweakProduct = ref<Product | null>(null)

function openTweak(product: Product) {
  tweakProduct.value = product
  tweakModalOpen.value = true
}

function onItemAdded() {
  toastMessage.value = \`\${tweakProduct.value?.name ?? 'Product'} added to your quote draft!\`
}

onMounted(() => {
  // Simulate load
  setTimeout(() => { loading.value = false }, 300)
})
</script>`,
}

// Folder icon mapping
const folderColors: Record<string, string> = {
  components: 'text-blue-500',
  pages: 'text-green-500',
  stores: 'text-purple-500',
  shared: 'text-orange-500',
  composables: 'text-pink-500',
  layouts: 'text-cyan-500',
  assets: 'text-yellow-500',
}

function getFolder(path: string): string {
  const parts = path.split('/')
  return parts.length > 1 ? parts[0] : ''
}

function getFileName(path: string): string {
  return path.split('/').pop() || path
}

export default function App() {
  const [downloading, setDownloading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(Object.keys(folderColors)))

  const filesByFolder = Object.keys(FILES).reduce<Record<string, string[]>>((acc, path) => {
    const folder = getFolder(path) || '(root)'
    if (!acc[folder]) acc[folder] = []
    acc[folder].push(path)
    return acc
  }, {})

  const toggleFolder = (folder: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev)
      if (next.has(folder)) next.delete(folder)
      else next.add(folder)
      return next
    })
  }

  const downloadZip = useCallback(async () => {
    setDownloading(true)
    try {
      // Dynamically load JSZip
      const JSZip = (await import('https://cdn.jsdelivr.net/npm/jszip@3.10.1/+esm' as string)).default
      const zip = new JSZip()

      for (const [path, content] of Object.entries(FILES)) {
        zip.file(path, content)
      }

      const blob = await zip.generateAsync({ type: 'blob' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'printy-nuxt.zip'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Download failed:', err)
      // Fallback: download individual files as text
      alert('ZIP creation failed. Try the individual file download instead.')
    } finally {
      setDownloading(false)
    }
  }, [])

  const downloadSingleFile = useCallback((path: string) => {
    const content = FILES[path]
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = getFileName(path)
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [])

  // clipboard util used by CopyButton component below
  void 0 // no-op

  const totalFiles = Object.keys(FILES).length

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-stone-200 dark:border-stone-800">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-stone-800 dark:text-stone-100">Printy — Nuxt Project</h1>
                <p className="text-xs text-stone-500 dark:text-stone-400">{totalFiles} files ready to download</p>
              </div>
            </div>
            <button
              onClick={downloadZip}
              disabled={downloading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-semibold text-sm transition-colors shadow-md shadow-amber-500/20"
            >
              {downloading ? (
                <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              )}
              {downloading ? 'Creating ZIP…' : 'Download ZIP'}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Setup instructions */}
        <div className="mb-8 rounded-2xl border border-amber-200 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-950/20 p-6">
          <h2 className="text-lg font-bold text-stone-800 dark:text-stone-100 flex items-center gap-2">
            <svg className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Quick Setup
          </h2>
          <div className="mt-3 bg-stone-800 dark:bg-stone-900 rounded-xl p-4 text-sm font-mono text-green-400 space-y-1 overflow-x-auto">
            <p><span className="text-stone-500">1.</span> Download and unzip the file</p>
            <p><span className="text-stone-500">2.</span> <span className="text-amber-300">cd</span> printy-nuxt</p>
            <p><span className="text-stone-500">3.</span> <span className="text-amber-300">npm</span> install</p>
            <p><span className="text-stone-500">4.</span> <span className="text-amber-300">npm</span> run dev</p>
            <p className="text-stone-500 pt-1"># Opens at http://localhost:3000</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* File tree sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 overflow-hidden">
              <div className="px-4 py-3 border-b border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50">
                <h3 className="text-sm font-semibold text-stone-700 dark:text-stone-200">Project Files</h3>
              </div>
              <div className="max-h-[70vh] overflow-y-auto divide-y divide-stone-100 dark:divide-stone-800">
                {Object.entries(filesByFolder).sort(([a], [b]) => a.localeCompare(b)).map(([folder, files]) => (
                  <div key={folder}>
                    <button
                      onClick={() => toggleFolder(folder)}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors"
                    >
                      <svg className={`h-4 w-4 transition-transform ${expandedFolders.has(folder) ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                      <svg className={`h-4 w-4 ${folderColors[folder] || 'text-stone-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                      <span>{folder === '(root)' ? '/' : folder}/</span>
                      <span className="ml-auto text-xs text-stone-400">{files.length}</span>
                    </button>
                    {expandedFolders.has(folder) && files.sort().map(path => (
                      <button
                        key={path}
                        onClick={() => setSelectedFile(path)}
                        className={`w-full flex items-center gap-2 pl-10 pr-4 py-2 text-sm transition-colors ${
                          selectedFile === path
                            ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 font-medium'
                            : 'text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800/50'
                        }`}
                      >
                        <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="truncate">{getFileName(path)}</span>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* File content viewer */}
          <div className="lg:col-span-8">
            {selectedFile ? (
              <div className="rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50">
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="h-4 w-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="font-medium text-stone-700 dark:text-stone-200">{selectedFile}</span>
                    <span className="text-xs text-stone-400 ml-2">
                      {FILES[selectedFile].split('\n').length} lines
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <CopyButton text={FILES[selectedFile]} />
                    <button
                      onClick={() => downloadSingleFile(selectedFile)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-xs font-medium hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download
                    </button>
                  </div>
                </div>
                <pre className="p-4 text-sm text-stone-700 dark:text-stone-300 overflow-x-auto max-h-[70vh] overflow-y-auto leading-relaxed font-mono bg-stone-50/50 dark:bg-stone-950/50">
                  <code>{FILES[selectedFile]}</code>
                </pre>
              </div>
            ) : (
              <div className="rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 p-16 text-center">
                <svg className="mx-auto h-16 w-16 text-stone-200 dark:text-stone-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                <h3 className="mt-4 text-lg font-semibold text-stone-700 dark:text-stone-300">Select a file to preview</h3>
                <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
                  Click any file in the tree to view its contents, or download the entire project as a ZIP.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* File summary table */}
        <div className="mt-8 rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50">
            <h3 className="font-semibold text-stone-800 dark:text-stone-100">All Files ({totalFiles})</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100 dark:border-stone-800 text-left">
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-stone-500">File</th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-stone-500">Lines</th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-stone-500">Size</th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-stone-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {Object.entries(FILES).sort(([a], [b]) => a.localeCompare(b)).map(([path, content]) => (
                  <tr key={path} className="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                    <td className="px-6 py-3">
                      <button
                        onClick={() => setSelectedFile(path)}
                        className="text-amber-600 dark:text-amber-400 hover:underline font-medium"
                      >
                        {path}
                      </button>
                    </td>
                    <td className="px-6 py-3 text-stone-500">{content.split('\n').length}</td>
                    <td className="px-6 py-3 text-stone-500">{(new Blob([content]).size / 1024).toFixed(1)} KB</td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => downloadSingleFile(path)}
                        className="text-xs text-stone-500 hover:text-stone-700 dark:hover:text-stone-300"
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-xs font-medium hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
    >
      {copied ? (
        <>
          <svg className="h-3.5 w-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy
        </>
      )}
    </button>
  )
}
