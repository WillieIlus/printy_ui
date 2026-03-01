<template>
  <UCard class="hover:shadow-lg transition-shadow">
    <div class="space-y-3">
      <div class="flex justify-between items-start">
        <h3 class="font-semibold text-gray-900 dark:text-white">Claim #{{ claim.id }}</h3>
        <UBadge :color="statusColor" variant="soft" size="sm">{{ claim.status }}</UBadge>
      </div>
      <p v-if="claim.shop_details" class="text-sm text-gray-600 dark:text-gray-400">{{ claim.shop_details.name }}</p>
      <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatDate(claim.created_at) }}</p>
      <slot name="actions" />
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { Claim } from '~/shared/types'
const props = defineProps<{ claim: Claim }>()
const statusColor = computed((): 'error' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'neutral' => {
  const m: Record<Claim['status'], 'warning' | 'success' | 'error'> = { pending: 'warning', approved: 'success', rejected: 'error' }
  return (m[props.claim.status] ?? 'neutral') as 'error' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'neutral'
})
function formatDate(s: string) {
  return new Date(s).toLocaleDateString()
}
</script>
