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
  <div class="mx-auto max-w-5xl">
    <h2 v-if="shopName" class="mb-6 text-2xl font-bold text-[var(--p-text)]">
      {{ shopName }} Rate Card
    </h2>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <section
        v-if="rateCard.paper?.length"
        class="overflow-hidden rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-container-low)] transition-shadow hover:shadow-md"
      >
        <div class="border-b border-[var(--p-border)] bg-[var(--p-surface-container)] px-4 py-3">
          <h3 class="flex items-center gap-2 text-sm font-semibold text-[var(--p-text)]">
            <UIcon name="i-lucide-file-stack" class="h-4 w-4" />
            Paper (per sheet)
          </h3>
          <p class="mt-0.5 text-xs text-[var(--p-text-muted)]">
            Includes printing. Single = 1 side, Double = 2 sides.
          </p>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-[var(--p-border)]">
            <thead class="bg-[var(--p-surface-container)]">
              <tr>
                <th class="px-3 py-2 text-left text-xs font-medium uppercase text-[var(--p-text-muted)]">GSM</th>
                <th class="px-3 py-2 text-left text-xs font-medium uppercase text-[var(--p-text-muted)]">Type</th>
                <th class="px-3 py-2 text-right text-xs font-medium uppercase text-[var(--p-text-muted)]">Single</th>
                <th class="px-3 py-2 text-right text-xs font-medium uppercase text-[var(--p-text-muted)]">Double</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[var(--p-border)]">
              <tr
                v-for="(price, index) in rateCard.paper"
                :key="index"
                class="hover:bg-[var(--p-surface-container)]"
              >
                <td class="px-3 py-2 text-sm font-medium text-[var(--p-text)]">{{ price.gsm }} gsm</td>
                <td class="px-3 py-2 text-sm text-[var(--p-text-muted)]">{{ price.paper_type }}</td>
                <td class="px-3 py-2 text-right">
                  <span class="text-sm font-medium text-[var(--p-text)]">{{ formatKES(price.single_price) }}</span>
                </td>
                <td class="px-3 py-2 text-right">
                  <span class="text-sm font-medium text-[var(--p-text)]">{{ formatKES(price.double_price) }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <div class="flex flex-col gap-6">
        <section
          v-if="rateCard.printing?.length"
          class="overflow-hidden rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-container-low)] transition-shadow hover:shadow-md"
        >
          <div class="border-b border-[var(--p-border)] bg-[var(--p-surface-container)] px-4 py-3">
            <h3 class="flex items-center gap-2 text-sm font-semibold text-[var(--p-text)]">
              <UIcon name="i-lucide-printer" class="h-4 w-4" />
              Printing (per side)
            </h3>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-[var(--p-border)]">
              <thead class="bg-[var(--p-surface-container)]">
                <tr>
                  <th class="px-3 py-2 text-left text-xs font-medium uppercase text-[var(--p-text-muted)]">Size</th>
                  <th class="px-3 py-2 text-left text-xs font-medium uppercase text-[var(--p-text-muted)]">Type</th>
                  <th class="px-3 py-2 text-right text-xs font-medium uppercase text-[var(--p-text-muted)]">Single</th>
                  <th class="px-3 py-2 text-right text-xs font-medium uppercase text-[var(--p-text-muted)]">Double</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[var(--p-border)]">
                <tr
                  v-for="(price, index) in rateCard.printing"
                  :key="index"
                  class="hover:bg-[var(--p-surface-container)]"
                >
                  <td class="px-3 py-2 text-sm font-medium text-[var(--p-text)]">{{ price.sheet_size }}</td>
                  <td class="px-3 py-2 text-sm text-[var(--p-text-muted)]">{{ price.color_mode }}</td>
                  <td class="px-3 py-2 text-right text-sm font-medium text-[var(--p-text)]">{{ formatKES(price.price_per_side) }}</td>
                  <td class="px-3 py-2 text-right text-sm font-medium text-[var(--p-text)]">{{ formatKES(price.price_double_sided) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section
          v-if="rateCard.finishing?.length"
          class="overflow-hidden rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-container-low)] transition-shadow hover:shadow-md"
        >
          <div class="border-b border-[var(--p-border)] bg-[var(--p-surface-container)] px-4 py-3">
            <h3 class="flex items-center gap-2 text-sm font-semibold text-[var(--p-text)]">
              <UIcon name="i-lucide-scissors" class="h-4 w-4" />
              Finishing
            </h3>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-[var(--p-border)]">
              <thead class="bg-[var(--p-surface-container)]">
                <tr>
                  <th class="px-3 py-2 text-left text-xs font-medium uppercase text-[var(--p-text-muted)]">Service</th>
                  <th class="px-3 py-2 text-left text-xs font-medium uppercase text-[var(--p-text-muted)]">Unit</th>
                  <th class="px-3 py-2 text-right text-xs font-medium uppercase text-[var(--p-text-muted)]">Price</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[var(--p-border)]">
                <tr
                  v-for="(service, index) in rateCard.finishing"
                  :key="index"
                  class="hover:bg-[var(--p-surface-container)]"
                >
                  <td class="px-3 py-2 text-sm font-medium text-[var(--p-text)]">
                    {{ service.name }}
                    <span v-if="service.category" class="block text-xs text-[var(--p-text-muted)]">{{ service.category }}</span>
                  </td>
                  <td class="px-3 py-2 text-sm text-[var(--p-text-muted)]">{{ service.charge_by }}</td>
                  <td class="px-3 py-2 text-right text-sm font-medium text-[var(--p-text)]">{{ formatKES(service.price) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>

    <div
      v-if="!rateCard.printing?.length && !rateCard.paper?.length && !rateCard.finishing?.length"
      class="py-12 text-center"
    >
      <UIcon name="i-lucide-receipt" class="mx-auto h-12 w-12 text-amber-300 dark:text-amber-700" />
      <h3 class="mt-2 text-sm font-medium text-[var(--p-text-dim)]">No pricing available</h3>
      <p class="mt-1 text-sm text-[var(--p-text-muted)]">This shop hasn't set up their pricing yet.</p>
    </div>
  </div>
</template>
