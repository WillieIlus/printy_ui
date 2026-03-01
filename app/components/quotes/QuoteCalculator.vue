<template>
  <UCard>
    <template #header>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Quote summary</h3>
    </template>
    <div class="space-y-2">
      <div class="flex justify-between text-sm">
        <span class="text-gray-600 dark:text-gray-400">Subtotal</span>
        <span class="font-medium text-gray-900 dark:text-white">{{ totals?.subtotal ?? '—' }}</span>
      </div>
      <div class="flex justify-between text-sm">
        <span class="text-gray-600 dark:text-gray-400">Tax</span>
        <span class="font-medium text-gray-900 dark:text-white">{{ totals?.tax ?? '—' }}</span>
      </div>
      <div class="flex justify-between text-lg font-bold border-t dark:border-gray-700 pt-2 mt-2">
        <span class="text-gray-900 dark:text-white">Total</span>
        <span class="text-gray-900 dark:text-white">{{ totals?.total ?? '—' }}</span>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
defineProps<{
  totals?: { subtotal: string; tax: string; total: string } | null
}>()
</script>
