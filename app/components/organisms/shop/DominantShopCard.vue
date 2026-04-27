<!-- Purpose: Featured (dominant) shop result card – shown at the top of quote results. -->
<template>
  <article class="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--p-border)] bg-[var(--p-surface)] shadow-[var(--shadow-md)]">
    <div class="flex flex-col gap-4 p-5 md:flex-row md:items-start">
      <div class="flex shrink-0 items-center gap-4">
        <div class="flex size-16 items-center justify-center overflow-hidden rounded-[var(--radius-md)] bg-[var(--p-surface-container)]">
          <NuxtImg v-if="shop.logo" :src="shop.logo" :alt="shop.name" class="size-full object-cover" />
          <Icon v-else name="lucide:store" class="size-8 text-[var(--p-text-muted)]" />
        </div>
      </div>

      <div class="flex-1 space-y-1">
        <div class="flex flex-wrap items-center gap-2">
          <h3 class="text-base font-bold text-[var(--p-text)]">{{ shop.name }}</h3>
          <BaseBadge v-if="shop.badge" variant="primary">{{ shop.badge }}</BaseBadge>
          <TrustPill v-if="shop.verified" label="Verified" :verified="true" />
        </div>
        <div class="flex flex-wrap items-center gap-3 text-sm text-[var(--p-text-muted)]">
          <span class="flex items-center gap-1">
            <Icon name="lucide:star" class="size-3.5 fill-amber-400 stroke-amber-400" />
            {{ shop.rating.toFixed(1) }} ({{ shop.reviewCount }})
          </span>
          <span class="flex items-center gap-1">
            <Icon name="lucide:clock" class="size-3.5" />
            {{ shop.turnaround }}
          </span>
          <span class="flex items-center gap-1">
            <Icon name="lucide:map-pin" class="size-3.5" />
            {{ shop.location }}
          </span>
        </div>
      </div>

      <div class="flex flex-col items-end gap-3">
        <PriceDisplay :amount="shop.price" size="lg" />
        <div class="flex gap-2">
          <BaseButton variant="secondary" size="sm">View details</BaseButton>
          <BaseButton variant="primary" size="sm">Request quote</BaseButton>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import BaseBadge from '~/components/atoms/BaseBadge.vue'
import BaseButton from '~/components/atoms/BaseButton.vue'
import PriceDisplay from '~/components/molecules/PriceDisplay.vue'
import TrustPill from '~/components/molecules/TrustPill.vue'

export interface ShopResult {
  id: string
  name: string
  logo?: string
  rating: number
  reviewCount: number
  turnaround: string
  location: string
  price: number
  badge?: string
  verified?: boolean
}

defineProps<{ shop: ShopResult }>()
</script>
