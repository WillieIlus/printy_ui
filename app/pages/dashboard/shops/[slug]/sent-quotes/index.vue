<template>
  <div class="space-y-6">
    <DashboardPageHeader
      title="Sent Quotes"
      subtitle="Quotes you've sent to customers. Track status and revisions."
    >
      <template #actions>
        <UButton :to="`/dashboard/shops/${slug}/incoming-requests`" variant="soft" size="sm">
          <UIcon name="i-lucide-inbox" class="w-4 h-4 mr-2" />
          Incoming Requests
        </UButton>
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
      <UButton variant="soft" color="error" size="sm" class="mt-2" @click="fetchQuotes">
        Try again
      </UButton>
    </div>
    <div v-else-if="filteredQuotes.length" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <SentQuoteCard
        v-for="quote in filteredQuotes"
        :key="quote.id"
        :quote="quote"
        :shop-slug="slug"
      />
    </div>
    <DashboardEmptyState
      v-else
      :title="emptyTitle"
      :description="emptyDescription"
      icon="i-lucide-send"
    >
      <UButton :to="`/dashboard/shops/${slug}/incoming-requests`" color="primary">
        <UIcon name="i-lucide-inbox" class="w-4 h-4 mr-2" />
        View incoming requests
      </UButton>
    </DashboardEmptyState>
  </div>
</template>

<script setup lang="ts">
import type { SentQuoteList } from '~/shared/types/sentQuote'
import { useShopStore } from '~/stores/shop'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'shop-owner'],
})

const route = useRoute()
const slug = computed(() => route.params.slug as string)
const shopStore = useShopStore()
const sentQuotes = useSentQuotes()

const quotes = ref<SentQuoteList[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const statusFilter = ref<'all' | 'draft' | 'sent' | 'accepted'>('all')

const statusTabs = [
  { value: 'all' as const, label: 'All' },
  { value: 'draft' as const, label: 'Draft' },
  { value: 'sent' as const, label: 'Awaiting response' },
  { value: 'accepted' as const, label: 'Accepted' },
]

const shopId = computed(() => shopStore.currentShop?.id ?? null)

const filteredQuotes = computed(() => {
  const list = quotes.value
  const sid = shopId.value
  const shopFiltered = sid != null ? list.filter((q) => q.shop === sid) : list
  if (statusFilter.value === 'all') return shopFiltered
  if (statusFilter.value === 'draft') {
    return shopFiltered.filter((q) => String(q.status).toLowerCase() === 'draft')
  }
  if (statusFilter.value === 'accepted') {
    return shopFiltered.filter((q) => q.status === 'accepted')
  }
  return shopFiltered.filter((q) => q.status === 'sent' || q.status === 'revised')
})

const emptyTitle = computed(() => {
  if (statusFilter.value === 'all' && !filteredQuotes.value.length) {
    return 'No quotes sent yet'
  }
  if (statusFilter.value === 'draft') return 'No draft quotes'
  if (statusFilter.value === 'sent') return 'No quotes awaiting response'
  if (statusFilter.value === 'accepted') return 'No accepted quotes yet'
  return 'No quotes in this status'
})

const emptyDescription = computed(() => {
  if (statusFilter.value === 'all' && !filteredQuotes.value.length) {
    return 'Quotes you send to customers will appear here.'
  }
  return 'Try another status filter or send a quote from an incoming request.'
})

async function fetchQuotes() {
  loading.value = true
  error.value = null
  try {
    await shopStore.fetchShopBySlug(slug.value)
    quotes.value = await sentQuotes.list()
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load sent quotes'
    quotes.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => fetchQuotes())

watch(
  () => route.query.status,
  (status) => {
    if (status === 'draft' || status === 'sent' || status === 'accepted') {
      statusFilter.value = status
      return
    }
    statusFilter.value = 'all'
  },
  { immediate: true }
)
</script>
