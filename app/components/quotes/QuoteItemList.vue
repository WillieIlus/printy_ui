<template>
  <UCard>
    <template #header>
      <h3 class="text-lg font-semibold text-[var(--p-text)]">Quote items</h3>
    </template>
    <div v-if="items?.length" class="space-y-2">
      <div
        v-for="item in items"
        :key="item.id"
        class="flex items-center justify-between rounded-lg border border-[var(--p-border)] bg-[var(--p-surface-container-low)] p-3"
      >
        <div>
          <p class="font-medium text-[var(--p-text)]">{{ item.name }}</p>
          <p class="text-sm text-[var(--p-text-muted)]">Qty {{ item.quantity }} × {{ item.unit_price }}</p>
        </div>
        <p class="font-semibold text-[var(--p-text)]">{{ item.total_price }}</p>
      </div>
    </div>
    <p v-else class="text-sm text-[var(--p-text-muted)]">No items.</p>
    <slot />
  </UCard>
</template>

<script setup lang="ts">
import type { QuoteItem } from '~/shared/types'

defineProps<{ items?: QuoteItem[] }>()
</script>
