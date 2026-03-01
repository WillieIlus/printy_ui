<!-- ShopDetailPricing.vue — Shop detail page with price tables for papers, printing, products -->
<template>
  <div class="space-y-8">
    <!-- Shop Header -->
    <div class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div class="bg-gradient-to-r from-flamingo-500 to-flamingo-700 px-6 py-6 sm:px-8">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-center gap-4">
            <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <svg class="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-bold text-white sm:text-2xl">{{ shopName }}</h2>
              <p class="text-sm text-white/80">{{ shopLocation }}</p>
            </div>
          </div>
          <div class="flex gap-3">
            <button class="rounded-xl bg-white/20 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/30">
              <svg class="mr-2 inline h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </button>
            <button class="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-flamingo-600 transition-colors hover:bg-flamingo-50">
              + New Quote
            </button>
          </div>
        </div>
      </div>

      <!-- Capability Pills -->
      <div class="flex flex-wrap gap-2 border-b border-gray-100 px-6 py-4 sm:px-8">
        <span v-for="cap in capabilities" :key="cap.label"
          class="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold"
          :class="cap.enabled ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-400'"
        >
          <span class="h-1.5 w-1.5 rounded-full" :class="cap.enabled ? 'bg-green-500' : 'bg-gray-300'"></span>
          {{ cap.label }}
        </span>
      </div>
    </div>

    <!-- Tab Navigation -->
    <div class="flex gap-1 overflow-x-auto rounded-xl border border-gray-200 bg-white p-1.5">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition-all"
        :class="activeTab === tab.id
          ? 'bg-flamingo-500 text-white shadow-sm'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
        @click="activeTab = tab.id"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" :d="tab.icon" />
        </svg>
        {{ tab.label }}
        <span
          v-if="tab.count"
          class="rounded-full px-1.5 py-0.5 text-[10px] font-bold"
          :class="activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'"
        >
          {{ tab.count }}
        </span>
      </button>
    </div>

    <!-- Papers / Materials Table -->
    <div v-if="activeTab === 'materials'" class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div class="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <h3 class="text-lg font-bold text-gray-900">Materials & Papers</h3>
        <button class="inline-flex items-center gap-2 rounded-xl bg-flamingo-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-flamingo-600">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Material
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-100 bg-gray-50/50">
              <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Material</th>
              <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Type</th>
              <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Size</th>
              <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Weight</th>
              <th class="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Cost/Unit</th>
              <th class="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Stock</th>
              <th class="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="m in materials" :key="m.name" class="transition-colors hover:bg-flamingo-50/30">
              <td class="whitespace-nowrap px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="flex h-9 w-9 items-center justify-center rounded-lg" :class="m.typeBg">
                    <svg class="h-4 w-4" :class="m.typeColor" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <div class="text-sm font-semibold text-gray-900">{{ m.name }}</div>
                    <div class="text-xs text-gray-500">{{ m.brand }}</div>
                  </div>
                </div>
              </td>
              <td class="whitespace-nowrap px-6 py-4">
                <span class="rounded-full px-2.5 py-1 text-xs font-medium" :class="m.typeTag">{{ m.type }}</span>
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-600">{{ m.size }}</td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-600">{{ m.weight }}</td>
              <td class="whitespace-nowrap px-6 py-4 text-right text-sm font-semibold text-gray-900">{{ m.cost }}</td>
              <td class="whitespace-nowrap px-6 py-4 text-right">
                <span class="text-sm" :class="m.stockLow ? 'font-semibold text-red-600' : 'text-gray-600'">
                  {{ m.stock }}
                </span>
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-center">
                <div class="flex items-center justify-center gap-1">
                  <button class="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button class="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Printing Prices Table -->
    <div v-if="activeTab === 'pricing'" class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div class="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <h3 class="text-lg font-bold text-gray-900">Printing Price List</h3>
        <button class="inline-flex items-center gap-2 rounded-xl bg-flamingo-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-flamingo-600">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Price Rule
        </button>
      </div>

      <!-- Digital Printing Section -->
      <div class="border-b border-gray-100 px-6 py-4">
        <div class="mb-3 flex items-center gap-2">
          <span class="rounded-lg bg-blue-100 px-2.5 py-1 text-xs font-bold text-blue-700">DIGITAL</span>
          <span class="text-sm text-gray-500">Per sheet / per side pricing</span>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-gray-100">
                <th class="py-2 text-left text-xs font-semibold uppercase text-gray-500">Sheet Size</th>
                <th class="py-2 text-right text-xs font-semibold uppercase text-gray-500">Single Side</th>
                <th class="py-2 text-right text-xs font-semibold uppercase text-gray-500">Double Side</th>
                <th class="py-2 text-right text-xs font-semibold uppercase text-gray-500">Color</th>
                <th class="py-2 text-right text-xs font-semibold uppercase text-gray-500">B&W</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="price in digitalPrices" :key="price.size" class="hover:bg-gray-50">
                <td class="py-3 text-sm font-medium text-gray-900">{{ price.size }}</td>
                <td class="py-3 text-right text-sm text-gray-600">{{ price.single }}</td>
                <td class="py-3 text-right text-sm text-gray-600">{{ price.double }}</td>
                <td class="py-3 text-right text-sm font-semibold text-gray-900">{{ price.color }}</td>
                <td class="py-3 text-right text-sm text-gray-600">{{ price.bw }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Large Format Section -->
      <div class="px-6 py-4">
        <div class="mb-3 flex items-center gap-2">
          <span class="rounded-lg bg-purple-100 px-2.5 py-1 text-xs font-bold text-purple-700">LARGE FORMAT</span>
          <span class="text-sm text-gray-500">Per m² pricing</span>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-gray-100">
                <th class="py-2 text-left text-xs font-semibold uppercase text-gray-500">Material</th>
                <th class="py-2 text-right text-xs font-semibold uppercase text-gray-500">Print / m²</th>
                <th class="py-2 text-right text-xs font-semibold uppercase text-gray-500">Material / m²</th>
                <th class="py-2 text-right text-xs font-semibold uppercase text-gray-500">Total / m²</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="price in largeFormatPrices" :key="price.material" class="hover:bg-gray-50">
                <td class="py-3 text-sm font-medium text-gray-900">{{ price.material }}</td>
                <td class="py-3 text-right text-sm text-gray-600">{{ price.print }}</td>
                <td class="py-3 text-right text-sm text-gray-600">{{ price.materialCost }}</td>
                <td class="py-3 text-right text-sm font-bold text-flamingo-600">{{ price.total }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Products Section -->
    <div v-if="activeTab === 'products'" class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-bold text-gray-900">Product Templates</h3>
        <button class="inline-flex items-center gap-2 rounded-xl bg-flamingo-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-flamingo-600">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </button>
      </div>

      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="product in products"
          :key="product.name"
          class="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:border-flamingo-200 hover:shadow-md"
        >
          <div class="mb-3 flex items-start justify-between">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-xl" :class="product.bg">
                <svg class="h-5 w-5" :class="product.color" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" :d="product.icon" />
                </svg>
              </div>
              <div>
                <div class="font-semibold text-gray-900">{{ product.name }}</div>
                <div class="text-xs text-gray-500">{{ product.type }}</div>
              </div>
            </div>
            <span class="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-500">
              {{ product.pricingModel }}
            </span>
          </div>

          <div class="mb-3 flex flex-wrap gap-1.5">
            <span v-for="spec in product.specs" :key="spec" class="rounded bg-gray-100 px-2 py-0.5 text-[11px] text-gray-600">
              {{ spec }}
            </span>
          </div>

          <div class="flex items-center justify-between border-t border-gray-100 pt-3">
            <span class="text-sm font-bold text-gray-900">{{ product.price }}</span>
            <button class="text-xs font-semibold text-flamingo-600 transition-colors hover:text-flamingo-700">
              Edit →
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Finishing Prices -->
    <div v-if="activeTab === 'finishing'" class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div class="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <h3 class="text-lg font-bold text-gray-900">Finishing Services</h3>
        <button class="inline-flex items-center gap-2 rounded-xl bg-flamingo-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-flamingo-600">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Service
        </button>
      </div>
      <div class="divide-y divide-gray-100">
        <div v-for="finish in finishingServices" :key="finish.name" class="flex items-center justify-between px-6 py-4 hover:bg-gray-50">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
              <svg class="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" :d="finish.icon" />
              </svg>
            </div>
            <div>
              <div class="text-sm font-semibold text-gray-900">{{ finish.name }}</div>
              <div class="text-xs text-gray-500">{{ finish.unit }}</div>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <span class="text-sm font-bold text-gray-900">{{ finish.price }}</span>
            <span
              class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold"
              :class="finish.enabled ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-400'"
            >
              {{ finish.enabled ? 'Enabled' : 'Disabled' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  shopName?: string
  shopLocation?: string
}>()

const activeTab = ref('materials')

const tabs = [
  { id: 'materials', label: 'Materials', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', count: 8 },
  { id: 'pricing', label: 'Pricing', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V7m0 1v8m0 0v1', count: null },
  { id: 'products', label: 'Products', icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z', count: 6 },
  { id: 'finishing', label: 'Finishing', icon: 'M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243z', count: 4 },
]

const capabilities = [
  { label: 'Digital Printing', enabled: true },
  { label: 'Large Format', enabled: true },
  { label: 'Cutting', enabled: true },
  { label: 'Lamination', enabled: true },
  { label: 'Eyelets', enabled: true },
  { label: 'Binding', enabled: false },
]

const materials = [
  { name: 'Premium Bond', brand: 'Mondi', type: 'Sheet', size: 'SRA3', weight: '80gsm', cost: 'KES 3.50', stock: '5,000', stockLow: false, typeBg: 'bg-blue-50', typeColor: 'text-blue-500', typeTag: 'bg-blue-50 text-blue-700' },
  { name: 'Art Card', brand: 'Sappi', type: 'Sheet', size: 'SRA3', weight: '350gsm', cost: 'KES 12.00', stock: '2,500', stockLow: false, typeBg: 'bg-blue-50', typeColor: 'text-blue-500', typeTag: 'bg-blue-50 text-blue-700' },
  { name: 'Gloss Paper', brand: 'Mondi', type: 'Sheet', size: 'SRA3', weight: '150gsm', cost: 'KES 8.00', stock: '3,200', stockLow: false, typeBg: 'bg-blue-50', typeColor: 'text-blue-500', typeTag: 'bg-blue-50 text-blue-700' },
  { name: 'Vinyl 440gsm', brand: 'Orafol', type: 'Roll', size: '1.52m wide', weight: '440gsm', cost: 'KES 450/m²', stock: '45m', stockLow: false, typeBg: 'bg-purple-50', typeColor: 'text-purple-500', typeTag: 'bg-purple-50 text-purple-700' },
  { name: 'Self-Adhesive Vinyl', brand: 'Avery', type: 'Roll', size: '1.37m wide', weight: '120gsm', cost: 'KES 380/m²', stock: '12m', stockLow: true, typeBg: 'bg-purple-50', typeColor: 'text-purple-500', typeTag: 'bg-purple-50 text-purple-700' },
  { name: 'Canvas', brand: 'HP', type: 'Roll', size: '1.52m wide', weight: '380gsm', cost: 'KES 650/m²', stock: '30m', stockLow: false, typeBg: 'bg-purple-50', typeColor: 'text-purple-500', typeTag: 'bg-purple-50 text-purple-700' },
]

const digitalPrices = [
  { size: 'SRA3', single: 'KES 45', double: 'KES 80', color: 'KES 45', bw: 'KES 15' },
  { size: 'SRA4', single: 'KES 25', double: 'KES 45', color: 'KES 25', bw: 'KES 10' },
  { size: 'A3', single: 'KES 40', double: 'KES 70', color: 'KES 40', bw: 'KES 12' },
  { size: 'A4', single: 'KES 20', double: 'KES 35', color: 'KES 20', bw: 'KES 8' },
]

const largeFormatPrices = [
  { material: 'Vinyl Banner', print: 'KES 350', materialCost: 'KES 450', total: 'KES 800' },
  { material: 'Self-Adhesive Vinyl', print: 'KES 300', materialCost: 'KES 380', total: 'KES 680' },
  { material: 'Canvas Print', print: 'KES 400', materialCost: 'KES 650', total: 'KES 1,050' },
  { material: 'PP Film (Roll-Up)', print: 'KES 280', materialCost: 'KES 320', total: 'KES 600' },
]

const products = [
  { name: 'Business Cards', type: 'Digital', pricingModel: 'Per Sheet', price: 'From KES 1,200', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z', bg: 'bg-flamingo-50', color: 'text-flamingo-500', specs: ['90×55mm', '350gsm', '2 sides'] },
  { name: 'A5 Flyers', type: 'Digital', pricingModel: 'Per Sheet', price: 'From KES 800', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', bg: 'bg-green-50', color: 'text-green-500', specs: ['148×210mm', '150gsm', '1-2 sides'] },
  { name: 'Vinyl Banner', type: 'Large Format', pricingModel: 'Per m²', price: 'KES 800/m²', icon: 'M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9', bg: 'bg-purple-50', color: 'text-purple-500', specs: ['Custom size', '440gsm', 'Eyelets'] },
  { name: 'Stickers', type: 'Large Format', pricingModel: 'Per m²', price: 'KES 680/m²', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z', bg: 'bg-yellow-50', color: 'text-yellow-500', specs: ['Any shape', 'Waterproof', 'Self-adhesive'] },
  { name: 'A3 Poster', type: 'Digital', pricingModel: 'Per Sheet', price: 'From KES 150', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', bg: 'bg-orange-50', color: 'text-orange-500', specs: ['297×420mm', '200gsm', 'Full color'] },
  { name: 'Roll-Up Banner', type: 'Large Format', pricingModel: 'Per Set', price: 'From KES 4,500', icon: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z', bg: 'bg-pink-50', color: 'text-pink-500', specs: ['85×200cm', 'PP Film', 'With stand'] },
]

const finishingServices = [
  { name: 'Cutting', unit: 'Per piece', price: 'KES 1.00', enabled: true, icon: 'M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243z' },
  { name: 'Lamination (Gloss)', unit: 'Per sheet / m²', price: 'KES 25/sheet', enabled: true, icon: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { name: 'Lamination (Matte)', unit: 'Per sheet / m²', price: 'KES 30/sheet', enabled: true, icon: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { name: 'Eyelets', unit: 'Per piece', price: 'KES 20', enabled: true, icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
]
</script>
