<template>
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
  toastMessage.value = `${tweakProduct.value?.name ?? 'Product'} added to your quote draft!`
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
</script>
