<template>
  <DashboardShell sidebar-tone="dark">
    <template #sidebar>
      <ShopSidebarNav />
    </template>

    <div class="space-y-6">
      <DashboardTopBar
        eyebrow="Print shop"
        title="Messages"
        description="Track quote requests, client replies, sent quotes, and email delivery issues inside the same dashboard shell."
      />

      <BaseCard v-if="loadError" tone="default">
        <p class="text-sm text-[var(--p-error)]">{{ loadError }}</p>
      </BaseCard>

      <BaseCard tone="default">
        <div class="flex flex-col gap-4">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex flex-wrap gap-2">
              <button
                v-for="tab in tabs"
                :key="tab.key"
                type="button"
                class="rounded-full px-4 py-2 text-sm font-semibold transition"
                :class="activeTab === tab.key ? 'bg-[var(--p-primary)] text-white' : 'bg-[var(--p-bg-soft)] text-[var(--p-text-muted)] hover:bg-slate-100'"
                @click="activeTab = tab.key"
              >
                {{ tab.label }}
              </button>
            </div>

            <div class="flex flex-wrap gap-2">
              <button
                v-for="filter in filters"
                :key="filter.key"
                type="button"
                class="rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] transition"
                :class="activeFilter === filter.key ? 'border-[var(--p-primary)] bg-[var(--p-primary-soft)] text-[var(--p-primary)]' : 'border-[var(--p-border)] text-[var(--p-text-muted)] hover:border-slate-300 hover:text-[var(--p-text)]'"
                @click="activeFilter = filter.key"
              >
                {{ filter.label }}
              </button>
            </div>
          </div>

          <div class="flex flex-wrap items-center justify-between gap-3">
            <p class="text-sm text-[var(--p-text-muted)]">{{ activeTabSummary }}</p>
            <BaseButton variant="outline" size="sm" :disabled="!unreadMessages.length" @click="markAllRead">
              Mark all as read
            </BaseButton>
          </div>
        </div>
      </BaseCard>

      <BaseCard v-if="loading && !filteredMessages.length" tone="default">
        <div class="flex items-center gap-2 text-sm text-[var(--p-text-muted)]">
          <Icon name="lucide:loader-2" class="size-4 animate-spin" />
          Loading messages...
        </div>
      </BaseCard>

      <BaseCard v-else-if="!filteredMessages.length" tone="default">
        <div class="rounded-2xl border border-dashed border-[var(--p-border)] bg-[var(--p-bg-soft)] p-10 text-center">
          <Icon name="lucide:inbox" class="mx-auto mb-4 size-10 text-slate-400" />
          <p class="text-lg font-semibold text-[var(--p-text)]">{{ emptyState.title }}</p>
          <p class="mt-2 text-sm text-[var(--p-text-muted)]">{{ emptyState.description }}</p>
        </div>
      </BaseCard>

      <div v-else class="space-y-4">
        <BaseCard
          v-for="message in filteredMessages"
          :key="message.id"
          tone="default"
        >
          <div class="space-y-4">
            <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div class="space-y-2">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="size-2.5 rounded-full" :class="message.read_at ? 'bg-slate-300' : 'bg-emerald-500'" />
                  <h2 class="text-lg font-bold text-[var(--p-text)]">{{ message.subject }}</h2>
                  <BaseBadge v-if="message.email_status === 'failed'" tone="error">Email failed</BaseBadge>
                  <BaseBadge v-else-if="message.email_status === 'sent'" tone="success">Email sent</BaseBadge>
                </div>

                <div class="flex flex-wrap gap-4 text-sm text-[var(--p-text-muted)]">
                  <span v-if="message.client_name" class="inline-flex items-center gap-1.5">
                    <Icon name="lucide:user" class="size-4" />
                    {{ message.client_name }}
                  </span>
                  <span class="inline-flex items-center gap-1.5">
                    <Icon name="lucide:file-text" class="size-4" />
                    Request #{{ message.quote_request_id }}
                  </span>
                  <span class="inline-flex items-center gap-1.5">
                    <Icon name="lucide:clock-3" class="size-4" />
                    {{ formatDate(message.sent_at || message.created_at) }}
                  </span>
                </div>

                <p class="max-w-4xl text-sm leading-6 text-[var(--p-text-muted)]">
                  {{ message.snippet || message.body }}
                </p>

                <div v-if="message.has_attachment && message.attachments_summary.length" class="flex flex-wrap gap-2">
                  <BaseBadge v-for="attachment in message.attachments_summary" :key="attachment.id" tone="neutral">
                    {{ attachment.name }}
                  </BaseBadge>
                </div>
              </div>

              <div class="flex flex-wrap gap-2 lg:justify-end">
                <BaseButton
                  v-if="messageActionUrl(message)"
                  variant="primary"
                  size="sm"
                  :to="messageActionUrl(message)"
                  @click="handleOpen(message)"
                >
                  {{ actionLabel(message) }}
                </BaseButton>
                <BaseButton
                  v-if="!message.read_at && message.direction === 'inbound'"
                  variant="outline"
                  size="sm"
                  @click="markRead(message.id)"
                >
                  Mark as read
                </BaseButton>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
  </DashboardShell>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import BaseBadge from '~/components/ui/BaseBadge.vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseCard from '~/components/ui/BaseCard.vue'
import ShopSidebarNav from '~/components/dashboard/shop/ShopSidebarNav.vue'
import DashboardShell from '~/components/dashboard/shared/DashboardShell.vue'
import DashboardTopBar from '~/components/dashboard/shared/DashboardTopBar.vue'
import { useQuoteMessagesStore, type QuoteMessageRecord } from '~/stores/quoteMessages'

definePageMeta({
  layout: 'dashboard',
})

type TabKey = 'inbox' | 'sent' | 'unread'
type FilterKey = 'all' | 'unread' | 'quote_request_created' | 'quote_response_sent' | 'quote_question' | 'failed'

const store = useQuoteMessagesStore()
const { shopInbox, shopOutbox, shopUnreadCount, loading } = storeToRefs(store)

const loadError = ref('')
const activeTab = ref<TabKey>('inbox')
const activeFilter = ref<FilterKey>('all')

const tabs = computed(() => [
  { key: 'inbox' as TabKey, label: 'Inbox' },
  { key: 'sent' as TabKey, label: 'Sent' },
  { key: 'unread' as TabKey, label: `Unread (${shopUnreadCount.value})` },
])

const filters = [
  { key: 'all' as FilterKey, label: 'All' },
  { key: 'unread' as FilterKey, label: 'Unread' },
  { key: 'quote_request_created' as FilterKey, label: 'Quote requests' },
  { key: 'quote_response_sent' as FilterKey, label: 'Quote responses' },
  { key: 'quote_question' as FilterKey, label: 'Questions' },
  { key: 'failed' as FilterKey, label: 'Failed emails' },
]

const activeMessages = computed(() => {
  if (activeTab.value === 'sent') return shopOutbox.value
  if (activeTab.value === 'unread') return shopInbox.value.filter(message => !message.read_at)
  return shopInbox.value
})

const filteredMessages = computed(() => {
  return activeMessages.value.filter((message) => {
    if (activeFilter.value === 'all') return true
    if (activeFilter.value === 'unread') return !message.read_at
    if (activeFilter.value === 'failed') return message.email_status === 'failed'
    return message.message_type === activeFilter.value
  })
})

const unreadMessages = computed(() => shopInbox.value.filter(message => !message.read_at))

const activeTabSummary = computed(() => {
  if (activeTab.value === 'sent') {
    return shopOutbox.value.length
      ? 'Your sent quotes and replies are grouped here.'
      : 'Your sent quotes and replies will appear here.'
  }
  if (activeTab.value === 'unread') {
    return shopUnreadCount.value
      ? `${shopUnreadCount.value} unread message${shopUnreadCount.value === 1 ? '' : 's'} need attention.`
      : 'You’re all caught up.'
  }
  return shopInbox.value.length
    ? 'New buyer requests and follow-ups stay attached to their related request thread.'
    : 'No quote messages yet. New buyer requests will appear here.'
})

const emptyState = computed(() => {
  if (activeTab.value === 'sent') {
    return { title: 'Your sent quotes and replies will appear here.', description: 'Send a response from a request and it will show up in this outbox.' }
  }
  if (activeTab.value === 'unread') {
    return { title: 'You’re all caught up.', description: 'Unread buyer requests and replies will appear here.' }
  }
  return { title: 'No quote messages yet. New buyer requests will appear here.', description: 'Once a buyer sends a request or reply, this inbox will update.' }
})

function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
}

function actionLabel(message: QuoteMessageRecord) {
  if (message.quote_response_id) return 'View quote'
  return 'Open request'
}

function messageActionUrl(message: QuoteMessageRecord) {
  if (message.quote_response_id && message.quote_request_id) {
    return `/dashboard/shop/requests/${message.quote_request_id}/quote/${message.quote_response_id}`
  }
  if (message.quote_request_id) {
    return `/dashboard/shop/requests/${message.quote_request_id}`
  }
  return message.action_url
}

async function markRead(id: number) {
  await store.markShopMessageRead(id)
}

async function markAllRead() {
  await store.markAllShopMessagesRead()
}

async function handleOpen(message: QuoteMessageRecord) {
  if (!message.read_at && message.direction === 'inbound') {
    await markRead(message.id)
  }
}

async function load() {
  loadError.value = ''
  try {
    await store.fetchShopMessages()
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : 'Failed to load messages.'
  }
}

onMounted(() => {
  void load()
})
</script>
