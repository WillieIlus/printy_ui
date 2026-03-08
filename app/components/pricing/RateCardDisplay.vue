<script setup lang="ts">
import type { RateCard } from '~/shared/types'
import { formatKES } from '~/utils/formatters'

interface Props {
  rateCard: RateCard
  shopName?: string
}

const props = defineProps<Props>()

const hasPricingData = computed(() => {
  const rc = props.rateCard
  return (rc.printing?.length ?? 0) > 0 || (rc.paper?.length ?? 0) > 0 || (rc.finishing?.length ?? 0) > 0
})
</script>

<template>
  <div class="max-w-5xl mx-auto">
    <h2 v-if="shopName" class="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-6">
      {{ shopName }} Rate Card
    </h2>

    <!-- Two columns: Paper (left) | Printing + Finishing (right) -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Left: Paper (per sheet) -->
      <section
        v-if="rateCard.paper?.length"
        class="rounded-xl border border-amber-200/60 dark:border-amber-800/40 bg-amber-50/30 dark:bg-stone-800/50 overflow-hidden transition-shadow hover:shadow-md"
      >
        <div class="px-4 py-3 bg-amber-100/50 dark:bg-amber-900/20 border-b border-amber-200/60 dark:border-amber-800/40">
          <h3 class="text-sm font-semibold text-amber-800 dark:text-amber-200 flex items-center gap-2">
            <UIcon name="i-lucide-file-stack" class="h-4 w-4" />
            Paper (per sheet)
          </h3>
          <p class="mt-0.5 text-xs text-amber-700/80 dark:text-amber-300/80">
            Includes printing. Single = 1 side, Double = 2 sides.
          </p>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-amber-200/40 dark:divide-amber-800/30">
            <thead class="bg-amber-50/50 dark:bg-stone-800/80">
              <tr>
                <th class="px-3 py-2 text-left text-xs font-medium text-amber-700 dark:text-amber-300 uppercase">GSM</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-amber-700 dark:text-amber-300 uppercase">Type</th>
                <th class="px-3 py-2 text-right text-xs font-medium text-amber-700 dark:text-amber-300 uppercase">Single</th>
                <th class="px-3 py-2 text-right text-xs font-medium text-amber-700 dark:text-amber-300 uppercase">Double</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-amber-200/40 dark:divide-amber-800/30">
              <tr v-for="(price, index) in rateCard.paper" :key="index" class="hover:bg-amber-50/50 dark:hover:bg-stone-700/30">
                <td class="px-3 py-2 text-sm font-medium text-stone-800 dark:text-stone-200">{{ price.gsm }} gsm</td>
                <td class="px-3 py-2 text-sm text-stone-600 dark:text-stone-400">{{ price.paper_type }}</td>
                <td class="px-3 py-2 text-right">
                  <span class="text-sm font-medium text-stone-800 dark:text-stone-200">{{ formatKES(price.single_price) }}</span>
                  <span v-if="rateCard.is_owner && price.price_per_sheet && price.printing_single" class="block text-xs text-stone-500 dark:text-stone-400">
                    {{ formatKES(price.price_per_sheet) }} + {{ formatKES(price.printing_single) }}
                  </span>
                </td>
                <td class="px-3 py-2 text-right">
                  <span class="text-sm font-medium text-stone-800 dark:text-stone-200">{{ formatKES(price.double_price) }}</span>
                  <span v-if="rateCard.is_owner && price.price_per_sheet && price.printing_double" class="block text-xs text-stone-500 dark:text-stone-400">
                    {{ formatKES(price.price_per_sheet) }} + {{ formatKES(price.printing_double) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Right: Printing (top) + Finishing (bottom) -->
      <div class="flex flex-col gap-6">
        <!-- Printing Prices card -->
        <section
          v-if="rateCard.printing?.length"
          class="rounded-xl border border-amber-200/60 dark:border-amber-800/40 bg-amber-50/30 dark:bg-stone-800/50 overflow-hidden transition-shadow hover:shadow-md"
        >
          <div class="px-4 py-3 bg-amber-100/50 dark:bg-amber-900/20 border-b border-amber-200/60 dark:border-amber-800/40">
            <h3 class="text-sm font-semibold text-amber-800 dark:text-amber-200 flex items-center gap-2">
              <UIcon name="i-lucide-printer" class="h-4 w-4" />
              Printing (per side)
            </h3>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-amber-200/40 dark:divide-amber-800/30">
              <thead class="bg-amber-50/50 dark:bg-stone-800/80">
                <tr>
                  <th class="px-3 py-2 text-left text-xs font-medium text-amber-700 dark:text-amber-300 uppercase">Size</th>
                  <th class="px-3 py-2 text-left text-xs font-medium text-amber-700 dark:text-amber-300 uppercase">Type</th>
                  <th class="px-3 py-2 text-right text-xs font-medium text-amber-700 dark:text-amber-300 uppercase">Single</th>
                  <th class="px-3 py-2 text-right text-xs font-medium text-amber-700 dark:text-amber-300 uppercase">Double</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-amber-200/40 dark:divide-amber-800/30">
                <tr v-for="(price, index) in rateCard.printing" :key="index" class="hover:bg-amber-50/50 dark:hover:bg-stone-700/30">
                  <td class="px-3 py-2 text-sm font-medium text-stone-800 dark:text-stone-200">{{ price.sheet_size }}</td>
                  <td class="px-3 py-2 text-sm text-stone-600 dark:text-stone-400">{{ price.color_mode }}</td>
                  <td class="px-3 py-2 text-sm text-stone-800 dark:text-stone-200 text-right font-medium">{{ formatKES(price.price_per_side) }}</td>
                  <td class="px-3 py-2 text-sm text-stone-800 dark:text-stone-200 text-right font-medium">{{ formatKES(price.price_double_sided) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- Finishing Services card -->
        <section
          v-if="rateCard.finishing?.length"
          class="rounded-xl border border-amber-200/60 dark:border-amber-800/40 bg-amber-50/30 dark:bg-stone-800/50 overflow-hidden transition-shadow hover:shadow-md"
        >
          <div class="px-4 py-3 bg-amber-100/50 dark:bg-amber-900/20 border-b border-amber-200/60 dark:border-amber-800/40">
            <h3 class="text-sm font-semibold text-amber-800 dark:text-amber-200 flex items-center gap-2">
              <UIcon name="i-lucide-scissors" class="h-4 w-4" />
              Finishing
            </h3>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-amber-200/40 dark:divide-amber-800/30">
              <thead class="bg-amber-50/50 dark:bg-stone-800/80">
                <tr>
                  <th class="px-3 py-2 text-left text-xs font-medium text-amber-700 dark:text-amber-300 uppercase">Service</th>
                  <th class="px-3 py-2 text-left text-xs font-medium text-amber-700 dark:text-amber-300 uppercase">Unit</th>
                  <th class="px-3 py-2 text-right text-xs font-medium text-amber-700 dark:text-amber-300 uppercase">Price</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-amber-200/40 dark:divide-amber-800/30">
                <tr v-for="(service, index) in rateCard.finishing" :key="index" class="hover:bg-amber-50/50 dark:hover:bg-stone-700/30">
                  <td class="px-3 py-2 text-sm font-medium text-stone-800 dark:text-stone-200">
                    {{ service.name }}
                    <span v-if="service.category" class="block text-xs text-stone-500 dark:text-stone-400">{{ service.category }}</span>
                  </td>
                  <td class="px-3 py-2 text-sm text-stone-600 dark:text-stone-400">{{ service.charge_by }}</td>
                  <td class="px-3 py-2 text-sm text-stone-800 dark:text-stone-200 text-right font-medium">{{ formatKES(service.price) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!rateCard.printing?.length && !rateCard.paper?.length && !rateCard.finishing?.length" class="text-center py-12">
      <UIcon name="i-lucide-receipt" class="mx-auto h-12 w-12 text-amber-300 dark:text-amber-700" />
      <h3 class="mt-2 text-sm font-medium text-stone-700 dark:text-stone-300">No pricing available</h3>
      <p class="mt-1 text-sm text-stone-500 dark:text-stone-400">This shop hasn't set up their pricing yet.</p>
    </div>

    <!-- Pricing Formula (only when we have data) -->
    <div
      v-if="hasPricingData"
      class="mt-6 p-4 rounded-xl bg-amber-100/50 dark:bg-amber-900/20 border border-amber-200/60 dark:border-amber-800/40"
    >
      <h4 class="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-2 flex items-center gap-2">
        <UIcon name="i-lucide-calculator" class="h-4 w-4" />
        How pricing works
      </h4>
      <p class="text-sm text-amber-700 dark:text-amber-300">
        <strong>Total</strong> = (Printing × Sides × Sheets) + (Paper × Sheets) + Finishing
      </p>
    </div>
  </div>
</template>
