<template>
  <div class="col-span-12 space-y-6">
    <DashboardPageHeader :title="`Claim #${id}`">
      <template #actions>
        <UButton to="/dashboard/claims" variant="ghost" size="sm">Back</UButton>
      </template>
    </DashboardPageHeader>

    <DashboardSkeletonState v-if="claimStore.loading" variant="block" />
    <div v-else-if="claimStore.currentClaim" class="col-span-12">
      <DashboardSectionCard title="Claim details">
        <div class="space-y-2">
          <p class="text-sm">
            <span class="font-medium text-gray-500 dark:text-gray-400">Status:</span>
            <UBadge :color="statusColor" variant="soft" class="ml-1">{{ claimStore.currentClaim.status }}</UBadge>
          </p>
          <p v-if="claimStore.currentClaim.shop_details" class="text-sm">
            <span class="font-medium text-gray-500 dark:text-gray-400">Shop:</span>
            <span class="text-gray-900 dark:text-white">{{ claimStore.currentClaim.shop_details.name }}</span>
          </p>
          <p class="text-sm">
            <span class="font-medium text-gray-500 dark:text-gray-400">Created:</span>
            <span class="text-gray-900 dark:text-white">{{ formatDate(claimStore.currentClaim.created_at) }}</span>
          </p>
        </div>
      </DashboardSectionCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatDate } from '~/utils/formatters'
import { useClaimStore } from '~/stores/claim'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const route = useRoute()
const claimStore = useClaimStore()
const id = computed(() => Number(route.params.id))
const statusColor = computed((): 'warning' | 'success' | 'error' | 'neutral' => {
  const m: Record<string, 'warning' | 'success' | 'error'> = { pending: 'warning', approved: 'success', rejected: 'error' }
  return m[claimStore.currentClaim?.status ?? ''] ?? 'neutral'
})

onMounted(() => claimStore.fetchClaim(id.value))
</script>
