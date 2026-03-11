<template>
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
  toastMessage.value = `${tweakProduct.value?.name ?? 'Product'} added to your quote draft!`
}

onMounted(() => {
  // Simulate load
  setTimeout(() => { loading.value = false }, 300)
})
</script>
