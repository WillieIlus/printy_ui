<!-- Purpose: Compact secondary shop result card shown in the results grid. -->
<template>
  <article class="flex flex-col justify-between rounded-[var(--radius-lg)] border border-[var(--p-border)] bg-[var(--p-surface)] p-4 shadow-[var(--shadow-sm)] transition-shadow hover:shadow-[var(--shadow-md)]">
    <div class="flex items-start gap-3">
      <div class="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-[var(--radius-sm)] bg-[var(--p-surface-container)]">
        <NuxtImg v-if="shop.logo" :src="shop.logo" :alt="shop.name" class="size-full object-cover" />
        <Icon v-else name="lucide:store" class="size-5 text-[var(--p-text-muted)]" />
      </div>
      <div class="min-w-0 flex-1">
        <p class="truncate text-sm font-semibold text-[var(--p-text)]">{{ shop.name }}</p>
        <div class="flex items-center gap-1.5 text-xs text-[var(--p-text-muted)]">
          <Icon name="lucide:star" class="size-3 fill-amber-400 stroke-amber-400" />
          {{ shop.rating.toFixed(1) }}
          <span>· {{ shop.turnaround }}</span>
        </div>
      </div>
    </div>

    <div class="mt-4 flex items-center justify-between">
      <PriceDisplay :amount="shop.price" size="sm" />
      <BaseButton variant="ghost" size="sm">Quote</BaseButton>
    </div>
  </article>
</template>

<script setup lang="ts">
import BaseButton from '~/components/atoms/BaseButton.vue'
import PriceDisplay from '~/components/molecules/PriceDisplay.vue'

interface ShopResult {
  id: string
  name: string
  logo?: string
  rating: number
  turnaround: string
  price: number
}

defineProps<{ shop: ShopResult }>()
</script>
