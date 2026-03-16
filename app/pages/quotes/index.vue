<template>
  <div class="min-h-screen bg-[var(--p-bg)]">
    <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 class="text-2xl font-bold text-[var(--p-text)]">Quote Requests</h1>
          <p class="mt-1 text-sm text-[var(--p-text-muted)]">
            Requests you've sent to print shops. Track status and accept shop responses.
          </p>
        </div>
        <div class="flex gap-2">
          <UButton to="/quotes/create" variant="outline" size="sm">
            <UIcon name="i-lucide-plus" class="w-4 h-4 mr-2" />
            Request a quote
          </UButton>
          <UButton to="/shops" variant="outline" size="sm">
            <UIcon name="i-lucide-store" class="w-4 h-4 mr-2" />
            Browse Shops
          </UButton>
        </div>
      </div>

      <!-- Status tabs -->
      <div class="flex flex-wrap gap-2 mb-6">
        <UButton
          v-for="tab in statusTabs"
          :key="tab.value"
          :variant="statusFilter === tab.value ? 'solid' : 'soft'"
          :color="statusFilter === tab.value ? 'primary' : 'neutral'"
          size="sm"
          @click="statusFilter = tab.value"
        >
          {{ tab.label }}
        </UButton>
      </div>

      <CommonLoadingSpinner v-if="loading" />
      <div
        v-else-if="error"
        class="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-4"
      >
        <p class="text-sm text-red-700 dark:text-red-300">{{ error }}</p>
        <UButton variant="soft" color="error" size="sm" class="mt-2" @click="fetchRequests">
          Try again
        </UButton>
      </div>
      <div v-else-if="filteredRequests.length" class="space-y-4">
        <QuoteRequestsQuoteRequestCard
          v-for="req in filteredRequests"
          :key="req.id"
          :request="req"
        />
      </div>
      <DashboardEmptyState
        v-else
        :title="emptyTitle"
        :description="emptyDescription"
        icon="i-lucide-file-search"
      >
        <UButton to="/quotes/create" color="primary">
          <UIcon name="i-lucide-plus" class="w-4 h-4 mr-2" />
          Create your first request
        </UButton>
      </DashboardEmptyState>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { QuoteRequest, QuoteRequestStatus } from '~/shared/types/quoteRequest'

definePageMeta({
  layout: 'default',
  middleware: 'auth',
})

const quoteRequests = useQuoteRequests()
const requests = ref<QuoteRequest[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const statusFilter = ref<'all' | 'requested' | 'quoted' | 'accepted' | 'draft' | 'closed'>('all')

const statusTabs = [
  { value: 'all' as const, label: 'All' },
  { value: 'requested' as const, label: 'Requested' },
  { value: 'quoted' as const, label: 'Quoted' },
  { value: 'accepted' as const, label: 'Accepted' },
  { value: 'draft' as const, label: 'Draft' },
  { value: 'closed' as const, label: 'Closed' },
]

const filteredRequests = computed(() => {
  const list = requests.value
  if (statusFilter.value === 'all') return list
  if (statusFilter.value === 'requested') {
    return list.filter((r) => r.status === 'submitted' || r.status === 'viewed')
  }
  if (statusFilter.value === 'closed') {
    return list.filter((r) => r.status === 'closed' || r.status === 'cancelled')
  }
  return list.filter((r) => r.status === statusFilter.value)
})

const emptyTitle = computed(() => {
  if (statusFilter.value === 'all' && !requests.value.length) {
    return 'No quote requests yet'
  }
  if (statusFilter.value === 'requested') return 'No requests awaiting shop response'
  if (statusFilter.value === 'quoted') return 'No quoted requests'
  if (statusFilter.value === 'accepted') return 'No accepted requests'
  if (statusFilter.value === 'draft') return 'No drafts'
  if (statusFilter.value === 'closed') return 'No closed requests'
  return 'No requests in this status'
})

const emptyDescription = computed(() => {
  if (statusFilter.value === 'all' && !requests.value.length) {
    return 'Start by creating your first request. Browse a shop, add products to your draft, and submit.'
  }
  return 'Try another status filter or create a new request.'
})

async function fetchRequests() {
  loading.value = true
  error.value = null
  try {
    requests.value = await quoteRequests.list()
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load quote requests'
    requests.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => fetchRequests())
</script>
