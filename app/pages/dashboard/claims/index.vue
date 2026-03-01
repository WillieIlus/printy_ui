<template>
  <div class="col-span-12 space-y-6">
    <DashboardPageHeader
      title="Claims"
      subtitle="Manage shop ownership claims"
    />

    <DashboardSkeletonState v-if="claimStore.loading" variant="cards" :card-count="6" />
    <div v-else-if="claimStore.claims.length" class="col-span-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
      <ClaimsClaimCard v-for="c in claimStore.claims" :key="c.id" :claim="c">
        <template #actions>
          <UButton :to="`/dashboard/claims/${c.id}`" variant="outline" size="sm">View</UButton>
        </template>
      </ClaimsClaimCard>
    </div>
    <div v-else class="col-span-12">
      <DashboardEmptyState
        title="No claims yet"
        description="Shop ownership claims will appear here."
        icon="i-lucide-shield-check"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useClaimStore } from '~/stores/claim'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const claimStore = useClaimStore()
onMounted(() => claimStore.fetchClaims())
</script>
