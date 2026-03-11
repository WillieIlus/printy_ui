<template>
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
</script>
