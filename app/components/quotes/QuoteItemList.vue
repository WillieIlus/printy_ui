<template>
  <UCard>
    <template #header>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Quote items</h3>
    </template>
    <div v-if="items?.length" class="space-y-2">
      <div v-for="item in items" :key="item.id" class="flex justify-between items-center rounded-lg border dark:border-gray-700 p-3">
        <div>
          <p class="font-medium text-gray-900 dark:text-white">{{ item.name }}</p>
          <p class="text-sm text-gray-500 dark:text-gray-400">Qty {{ item.quantity }} × {{ item.unit_price }}</p>
        </div>
        <p class="font-semibold text-gray-900 dark:text-white">{{ item.total_price }}</p>
      </div>
    </div>
    <p v-else class="text-sm text-gray-500 dark:text-gray-400">No items.</p>
    <slot />
  </UCard>
</template>

<script setup lang="ts">
import type { QuoteItem } from '~/shared/types'
defineProps<{ items?: QuoteItem[] }>()
</script>
