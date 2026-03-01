<template>
  <div class="space-y-4">
    <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Shops nearby</h2>
    <CommonLoadingSpinner v-if="loading" />
    <ShopsShopList v-else-if="shops?.length" :shops="shops" />
    <UCard v-else class="text-center py-8">
      <UIcon name="i-lucide-map-pin" class="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-2" />
      <p class="text-sm text-gray-600 dark:text-gray-400">No nearby shops or location not set.</p>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { Shop } from '~/shared/types'
defineProps<{ shops?: Shop[]; loading?: boolean }>()
</script>
