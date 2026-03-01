<script setup lang="ts">
import type { RateCard } from '~/shared/types'
import { formatKES } from '~/utils/formatters'

interface Props {
  rateCard: RateCard
  shopName?: string
}

defineProps<Props>()
</script>

<template>
  <div class="max-w-4xl mx-auto">

    <h2 v-if="shopName" class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
      {{ shopName }} Rate Card
    </h2>

    <!-- Printing Prices -->
    <section v-if="rateCard.printing?.length" class="mb-8">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
        <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
        Printing (per side)
      </h3>
      <div class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Size</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Type</th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Single Side</th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Double Side</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="(price, index) in rateCard.printing" :key="index" class="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{{ price.sheet_size }}</td>
              <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{{ price.color_mode }}</td>
              <td class="px-4 py-3 text-sm text-gray-900 dark:text-white text-right font-medium">{{ formatKES(price.price_per_side) }}</td>
              <td class="px-4 py-3 text-sm text-gray-900 dark:text-white text-right font-medium">{{ formatKES(price.price_double_sided) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Paper Prices -->
    <section v-if="rateCard.paper?.length" class="mb-8">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
        <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Paper (per sheet by GSM)
      </h3>
      <div class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">GSM</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Type</th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Price/Sheet</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="(price, index) in rateCard.paper" :key="index" class="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{{ price.gsm }} gsm</td>
              <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{{ price.paper_type }}</td>
              <td class="px-4 py-3 text-sm text-gray-900 dark:text-white text-right font-medium">{{ formatKES(price.price_per_sheet) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Finishing Services -->
    <section v-if="rateCard.finishing?.length" class="mb-8">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
        <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
        Finishing Services
      </h3>
      <div class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Service</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Category</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Pricing</th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Price</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="(service, index) in rateCard.finishing" :key="index" class="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                {{ service.name }}
                <span v-if="service.is_default" class="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
                  Default
                </span>
              </td>
              <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{{ service.category }}</td>
              <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{{ service.charge_by }}</td>
              <td class="px-4 py-3 text-sm text-gray-900 dark:text-white text-right font-medium">{{ formatKES(service.price) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Empty State -->
    <div v-if="!rateCard.printing?.length && !rateCard.paper?.length && !rateCard.finishing?.length" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No pricing available</h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">This shop hasn't set up their pricing yet.</p>
    </div>

    <!-- Pricing Formula -->
    <div class="mt-8 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
      <h4 class="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">How pricing works:</h4>
      <p class="text-sm text-blue-700 dark:text-blue-300">
        <strong>Total</strong> = (Printing × Sides × Sheets) + (Paper × Sheets) + Finishing
      </p>
    </div>
  </div>
</template>

