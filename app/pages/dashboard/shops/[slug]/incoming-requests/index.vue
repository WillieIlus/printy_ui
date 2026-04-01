<template>
  <div class="space-y-6">
    <DashboardPageHeader
      title="Incoming Requests"
      subtitle="Accept, clarify, reject, and turn incoming requests into sent quotes."
    >
      <template #actions>
        <UButton :to="`/dashboard/shops/${slug}`" variant="soft" size="sm">
          <UIcon name="i-lucide-arrow-left" class="w-4 h-4 mr-2" />
          Back
        </UButton>
      </template>
    </DashboardPageHeader>

    <!-- Status tabs -->
    <div class="flex flex-wrap gap-2">
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
    <div v-else-if="filteredRequests.length" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <IncomingRequestCard
        v-for="req in filteredRequests"
        :key="req.id"
        :request="req"
        :shop-slug="slug"
      />
    </div>
    <DashboardEmptyState
      v-else
      :title="emptyTitle"
      :description="emptyDescription"
      icon="i-lucide-file-search"
    />
  </div>
</template>

<script setup lang="ts">
import type { IncomingRequestList } from '~/shared/types/incomingRequest'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'shop-owner'],
})

const route = useRoute()
const slugRef = computed(() => route.params.slug as string)
const slug = slugRef
const incoming = useIncomingRequests(slugRef)

const requests = ref<IncomingRequestList[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const statusFilter = ref<'all' | 'new' | 'messages' | 'actions' | 'awaiting_reply' | 'quoted' | 'closed'>('all')

const statusTabs = [
  { value: 'all' as const, label: 'All' },
  { value: 'new' as const, label: 'New' },
  { value: 'messages' as const, label: 'Messages / Replies' },
  { value: 'actions' as const, label: 'Pending actions' },
  { value: 'awaiting_reply' as const, label: 'Awaiting reply' },
  { value: 'quoted' as const, label: 'Quoted' },
  { value: 'closed' as const, label: 'Closed' },
]

const filteredRequests = computed(() => {
  const list = requests.value
  if (statusFilter.value === 'all') return list
  if (statusFilter.value === 'new') {
    return list.filter((r) => r.status === 'submitted')
  }
  if (statusFilter.value === 'messages') {
    return list.filter((r) => r.status === 'awaiting_shop_action')
  }
  if (statusFilter.value === 'actions') {
    return list.filter((r) => ['viewed', 'accepted', 'awaiting_shop_action'].includes(r.status))
  }
  if (statusFilter.value === 'awaiting_reply') {
    return list.filter((r) => r.status === 'awaiting_client_reply')
  }
  if (statusFilter.value === 'quoted') {
    return list.filter((r) => r.status === 'quoted')
  }
  if (statusFilter.value === 'closed') {
    return list.filter((r) => ['rejected', 'expired', 'closed', 'cancelled'].includes(r.status))
  }
  return list
})

const emptyTitle = computed(() => {
  if (statusFilter.value === 'all' && !requests.value.length) {
    return 'No incoming requests'
  }
  if (statusFilter.value === 'new') return 'No new requests'
  if (statusFilter.value === 'messages') return 'No unread client replies'
  if (statusFilter.value === 'actions') return 'No requests waiting on your quote actions'
  if (statusFilter.value === 'awaiting_reply') return 'No requests waiting on the client'
  if (statusFilter.value === 'quoted') return 'No quoted requests'
  if (statusFilter.value === 'closed') return 'No closed requests'
  return 'No requests in this status'
})

const emptyDescription = computed(() => {
  if (statusFilter.value === 'all' && !requests.value.length) {
    return 'New quote requests will appear here when customers submit.'
  }
  return 'Try another status filter.'
})

async function fetchRequests() {
  loading.value = true
  error.value = null
  try {
    requests.value = await incoming.list()
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load incoming requests'
    requests.value = []
  } finally {
    loading.value = false
  }
}

watch(slugRef, () => fetchRequests(), { immediate: false })
watch(() => route.query.view, (view) => {
  if (view === 'new' || view === 'messages' || view === 'actions' || view === 'awaiting_reply' || view === 'quoted' || view === 'closed' || view === 'all') {
    statusFilter.value = view
    return
  }
  statusFilter.value = 'all'
}, { immediate: true })
onMounted(() => fetchRequests())
</script>
