<template>
  <div class="min-h-screen bg-[var(--p-bg)]">
    <div class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-[var(--p-text)]">
            Request #{{ id }}
          </h1>
          <p v-if="request" class="mt-1 text-sm text-[var(--p-text-muted)]">
            {{ request.shop_name }}
          </p>
        </div>
        <UButton to="/quotes" variant="outline" color="neutral">
          <UIcon name="i-lucide-arrow-left" class="mr-2 h-4 w-4" />
          My Requests
        </UButton>
      </div>

      <CommonLoadingSpinner v-if="loading && !request" />

      <template v-else-if="request">
        <UAlert
          :color="statusAlert.color"
          variant="soft"
          :icon="statusAlert.icon"
          :title="statusAlert.title"
          :description="statusAlert.description"
          class="mb-6"
        />

        <div class="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(18rem,0.9fr)]">
          <div class="space-y-6">
            <div class="rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] overflow-hidden">
              <div class="border-b border-[var(--p-border)] px-6 py-4">
                <div class="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 class="font-semibold text-[var(--p-text)]">{{ request.shop_name }}</h2>
                    <div class="mt-2 flex flex-wrap items-center gap-2">
                      <UBadge :color="statusBadgeColor" variant="soft" size="sm">
                        {{ statusLabel }}
                      </UBadge>
                      <UBadge
                        v-if="latestQuote"
                        :color="latestQuote.status === 'accepted' ? 'success' : 'warning'"
                        variant="soft"
                        size="sm"
                      >
                        {{ quoteStatusLabel(latestQuote.status) }}
                      </UBadge>
                    </div>
                  </div>
                  <NuxtLink
                    v-if="request.shop_slug"
                    :to="`/shops/${request.shop_slug}`"
                    class="text-sm font-medium text-flamingo-600 hover:underline dark:text-flamingo-400"
                  >
                    View shop
                  </NuxtLink>
                </div>
              </div>

              <ul class="divide-y divide-[var(--p-border)]">
                <li
                  v-for="item in request.items"
                  :key="item.id"
                  class="flex items-center justify-between gap-4 px-6 py-4"
                >
                  <div class="min-w-0 flex-1">
                    <p class="font-medium text-[var(--p-text)]">
                      {{ item.title ?? item.product_name ?? 'Product' }}
                    </p>
                    <p class="text-sm text-[var(--p-text-muted)]">
                      Qty: {{ item.quantity }}
                      <template v-if="item.spec_text || (item.chosen_width_mm && item.chosen_height_mm)">
                        · {{ item.spec_text || `${item.chosen_width_mm}×${item.chosen_height_mm}mm` }}
                      </template>
                    </p>
                  </div>
                  <div v-if="item.line_total" class="shrink-0 text-sm font-medium tabular-nums text-[var(--p-text)]">
                    {{ formatMoney(item.line_total, request.shop_currency) }}
                  </div>
                </li>
              </ul>

              <div
                v-if="latestQuote?.total"
                class="border-t border-[var(--p-border)] bg-[var(--p-surface-sunken)] px-6 py-4"
              >
                <div class="flex justify-between font-semibold text-[var(--p-text)]">
                  <span>Quote total</span>
                  <span class="tabular-nums">{{ formatMoney(latestQuote.total, request.shop_currency) }}</span>
                </div>
              </div>
            </div>

            <div
              v-if="latestQuote"
              class="rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6"
            >
              <h3 class="text-sm font-medium text-[var(--p-text-muted)]">Quote from shop</h3>
              <div class="mt-3 space-y-2 text-sm text-[var(--p-text)]">
                <p class="flex items-center gap-2">
                  <UIcon name="i-lucide-badge-dollar-sign" class="h-4 w-4 shrink-0" />
                  {{ latestQuote.total ? formatMoney(latestQuote.total, request.shop_currency) : 'Total pending' }}
                </p>
                <p v-if="latestQuote.turnaround_hours || latestQuote.human_ready_text" class="flex items-center gap-2">
                  <UIcon name="i-lucide-clock" class="h-4 w-4 shrink-0" />
                  {{ latestQuote.human_ready_text || `${latestQuote.turnaround_hours} working hour${latestQuote.turnaround_hours === 1 ? '' : 's'}` }}
                </p>
                <p v-if="latestQuote.note" class="whitespace-pre-wrap text-[var(--p-text-muted)]">
                  {{ latestQuote.note }}
                </p>
              </div>
            </div>

            <div class="rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6">
              <div class="flex items-center justify-between gap-4">
                <div>
                  <h3 class="text-base font-semibold text-[var(--p-text)]">Timeline</h3>
                  <p class="mt-1 text-sm text-[var(--p-text-muted)]">
                    Follow what the shop has done and what is waiting on you.
                  </p>
                </div>
              </div>

              <div class="mt-4 space-y-3">
                <article
                  v-for="message in timelineMessages"
                  :key="message.id"
                  class="rounded-lg border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4"
                >
                  <div class="flex items-start justify-between gap-3">
                    <div>
                      <p class="text-sm font-semibold text-[var(--p-text)]">
                        {{ timelineTitle(message) }}
                      </p>
                      <p class="text-xs uppercase tracking-[0.12em] text-[var(--p-text-muted)]">
                        {{ timelineMeta(message) }}
                      </p>
                    </div>
                    <span class="text-xs text-[var(--p-text-muted)]">
                      {{ formatDate(message.created_at) }}
                    </span>
                  </div>
                  <p v-if="message.body" class="mt-3 whitespace-pre-wrap text-sm text-[var(--p-text)]">
                    {{ message.body }}
                  </p>
                </article>
              </div>
            </div>
          </div>

          <div class="space-y-6">
            <div class="rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6">
              <h3 class="text-sm font-medium text-[var(--p-text-muted)]">Actions</h3>

              <div class="mt-4 space-y-3">
                <UButton
                  v-if="canSubmit"
                  color="primary"
                  block
                  :loading="submitting"
                  @click="onSubmit"
                >
                  <UIcon name="i-lucide-send" class="mr-2 h-4 w-4" />
                  Submit request
                </UButton>

                <UButton
                  v-if="canAccept"
                  color="primary"
                  block
                  :loading="accepting"
                  @click="onAccept"
                >
                  <UIcon name="i-lucide-check" class="mr-2 h-4 w-4" />
                  Accept quote
                </UButton>

                <UButton
                  v-if="request.status === 'draft' && request.shop_slug"
                  variant="outline"
                  block
                  @click="goToDraft"
                >
                  <UIcon name="i-lucide-edit" class="mr-2 h-4 w-4" />
                  Open in requests workspace
                </UButton>

                <div
                  v-if="canReply"
                  class="rounded-lg border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4"
                >
                  <p class="text-sm font-semibold text-[var(--p-text)]">Reply to shop</p>
                  <p class="mt-1 text-sm text-[var(--p-text-muted)]">
                    Your reply moves the request back to the shop.
                  </p>
                  <UTextarea
                    v-model="replyBody"
                    class="mt-3"
                    :rows="4"
                    placeholder="Answer the shop's question here."
                  />
                  <div class="mt-3 flex flex-wrap gap-2">
                    <UButton color="warning" :loading="replying" @click="onReply">
                      Send reply
                    </UButton>
                  </div>
                </div>

                <UButton
                  v-if="canCancel"
                  variant="soft"
                  color="error"
                  block
                  :loading="cancelling"
                  @click="onCancel"
                >
                  <UIcon name="i-lucide-x" class="mr-2 h-4 w-4" />
                  Cancel request
                </UButton>
              </div>
            </div>

            <div v-if="request.whatsapp_summary" class="rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-4">
              <p class="text-sm font-medium text-[var(--p-text-muted)]">Share request</p>
              <div class="mt-3">
                <ShareActionsBar
                  :summary-text="request.whatsapp_summary"
                  copy-label="Copy summary"
                  :attachments="request.attachments"
                />
              </div>
            </div>
          </div>
        </div>
      </template>

      <DashboardEmptyState
        v-else
        title="Request not found"
        description="This request may have been removed or you don't have access."
        icon="i-lucide-file-question"
      >
        <UButton to="/quotes">My Requests</UButton>
      </DashboardEmptyState>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { QuoteRequest, QuoteRequestMessage, QuoteRequestStatus } from '~/shared/types/quoteRequest'
import { useActivityBadgesStore } from '~/stores/activityBadges'
import { useQuoteDraftStore } from '~/stores/quoteDraft'
import { formatDate } from '~/utils/formatters'

definePageMeta({
  layout: 'default',
  middleware: 'auth',
})

const route = useRoute()
const id = computed(() => parseInt(route.params.id as string, 10))
const quoteRequests = useQuoteRequests()
const quoteDraftStore = useQuoteDraftStore()
const notificationsApi = useNotifications()
const activityBadgesStore = useActivityBadgesStore()
const notification = useNotification()

const request = ref<QuoteRequest | null>(null)
const loading = ref(true)
const accepting = ref(false)
const cancelling = ref(false)
const submitting = ref(false)
const replying = ref(false)
const replyBody = ref('')
const { formatMoney } = useCurrencyFormatter(computed(() => request.value?.shop_currency ?? null))

function goToDraft() {
  if (request.value?.shop_slug) {
    quoteDraftStore.setShop(request.value.shop_slug)
    navigateTo(`/quote-draft?shop=${request.value.shop_slug}`)
  }
}

const statusLabels: Record<QuoteRequestStatus, string> = {
  draft: 'Draft',
  submitted: 'Submitted',
  awaiting_shop_action: 'Shop preparing quote',
  awaiting_client_reply: 'Awaiting your reply',
  viewed: 'Viewed',
  quoted: 'Quote received',
  accepted: 'Accepted by shop',
  rejected: 'Rejected',
  expired: 'Expired',
  closed: 'Closed',
  cancelled: 'Cancelled',
}

const statusLabel = computed(() =>
  request.value ? statusLabels[request.value.status] ?? request.value.status : ''
)

const statusBadgeColor = computed((): 'neutral' | 'warning' | 'primary' | 'success' | 'error' => {
  const s = request.value?.status
  if (s === 'quoted' || s === 'awaiting_client_reply') return 'warning'
  if (s === 'accepted' || s === 'awaiting_shop_action') return 'primary'
  if (s === 'rejected' || s === 'expired' || s === 'cancelled' || s === 'closed') return 'error'
  return 'neutral'
})

const latestQuote = computed(() => request.value?.latest_sent_quote ?? null)
const quoteAcceptedByClient = computed(() => latestQuote.value?.status === 'accepted')

const canAccept = computed(
  () =>
    request.value?.status === 'quoted' &&
    request.value.latest_sent_quote &&
    ['sent', 'revised'].includes(request.value.latest_sent_quote.status),
)

const canReply = computed(() => request.value?.status === 'awaiting_client_reply')

const canCancel = computed(
  () =>
    request.value != null &&
    !quoteAcceptedByClient.value &&
    ['draft', 'submitted', 'viewed', 'accepted', 'awaiting_shop_action', 'awaiting_client_reply', 'quoted'].includes(request.value.status),
)

const canSubmit = computed(() => request.value?.status === 'draft')
const timelineMessages = computed(() => request.value?.messages ?? [])

const statusAlert = computed(() => {
  if (!request.value) {
    return {
      color: 'neutral' as const,
      icon: 'i-lucide-file-search',
      title: 'Request',
      description: '',
    }
  }

  if (quoteAcceptedByClient.value) {
    return {
      color: 'success' as const,
      icon: 'i-lucide-check-circle',
      title: 'Quote accepted',
      description: 'You accepted the latest quote. The shop can now continue with production planning.',
    }
  }

  switch (request.value.status) {
    case 'draft':
      return {
        color: 'neutral' as const,
        icon: 'i-lucide-edit',
        title: 'Draft request',
        description: 'Complete your request and submit it to the shop.',
      }
    case 'submitted':
    case 'viewed':
      return {
        color: 'primary' as const,
        icon: 'i-lucide-clock',
        title: 'Submitted to shop',
        description: 'The shop has your request and has not finished a quote yet.',
      }
    case 'accepted':
    case 'awaiting_shop_action':
      return {
        color: 'primary' as const,
        icon: 'i-lucide-loader-circle',
        title: 'Shop is preparing your quote',
        description: 'The shop accepted the request and is working on the pricing details.',
      }
    case 'awaiting_client_reply':
      return {
        color: 'warning' as const,
        icon: 'i-lucide-message-circle-question',
        title: 'Reply needed',
        description: 'The shop asked a question before it can finish the quote.',
      }
    case 'quoted':
      return {
        color: 'success' as const,
        icon: 'i-lucide-badge-dollar-sign',
        title: 'Quote received',
        description: 'Review the latest quote, turnaround, and notes from the shop.',
      }
    case 'rejected':
      return {
        color: 'error' as const,
        icon: 'i-lucide-x-circle',
        title: 'Request rejected',
        description: 'The shop rejected the request. Check the timeline for the reason.',
      }
    case 'cancelled':
      return {
        color: 'neutral' as const,
        icon: 'i-lucide-ban',
        title: 'Request cancelled',
        description: 'You cancelled this request.',
      }
    default:
      return {
        color: 'neutral' as const,
        icon: 'i-lucide-file-search',
        title: statusLabel.value,
        description: 'Review the latest timeline entry for details.',
      }
  }
})

async function fetchRequest() {
  if (Number.isNaN(id.value)) {
    loading.value = false
    return
  }
  loading.value = true
  try {
    request.value = await quoteRequests.get(id.value)
    try {
      await markRequestNotificationsRead()
    } catch {
      // Keep the request visible even if notification sync fails.
    }
    await activityBadgesStore.fetchSummary()
  } catch {
    request.value = null
  } finally {
    loading.value = false
  }
}

async function markRequestNotificationsRead() {
  if (Number.isNaN(id.value)) return
  const notifications = await notificationsApi.list()
  const unreadMatching = notifications.filter(item =>
    !item.is_read
    && item.object_type === 'quote_request'
    && item.object_id === id.value
  )
  if (!unreadMatching.length) return
  await Promise.all(unreadMatching.map(item => notificationsApi.markRead(item.id)))
}

async function onAccept() {
  const sq = request.value?.latest_sent_quote
  if (!sq || accepting.value) return
  accepting.value = true
  try {
    request.value = await quoteRequests.accept(id.value, sq.id)
    await activityBadgesStore.fetchSummary()
    notification.success('Quote accepted')
  } catch (e) {
    notification.error(e instanceof Error ? e.message : 'Failed to accept quote')
  } finally {
    accepting.value = false
  }
}

async function onReply() {
  if (!request.value || replying.value) return
  if (!replyBody.value.trim()) {
    notification.error('Add your reply before sending')
    return
  }
  replying.value = true
  try {
    request.value = await quoteRequests.reply(id.value, { body: replyBody.value.trim() })
    replyBody.value = ''
    await activityBadgesStore.fetchSummary()
    notification.success('Reply sent to shop')
  } catch (e) {
    notification.error(e instanceof Error ? e.message : 'Failed to send reply')
  } finally {
    replying.value = false
  }
}

async function onSubmit() {
  if (!request.value || submitting.value) return
  submitting.value = true
  try {
    request.value = await quoteRequests.submit(id.value)
    await activityBadgesStore.fetchSummary()
    notification.success('Request sent to the shop')
  } catch (e) {
    notification.error(e instanceof Error ? e.message : 'Failed to submit')
  } finally {
    submitting.value = false
  }
}

async function onCancel() {
  if (!request.value || cancelling.value) return
  if (!confirm('Cancel this request?')) return
  cancelling.value = true
  try {
    request.value = await quoteRequests.cancel(id.value)
    await activityBadgesStore.fetchSummary()
    notification.success('Request cancelled')
  } catch (e) {
    notification.error(e instanceof Error ? e.message : 'Failed to cancel')
  } finally {
    cancelling.value = false
  }
}

function quoteStatusLabel(status: string) {
  const labels: Record<string, string> = {
    sent: 'Quote sent',
    revised: 'Quote revised',
    accepted: 'You accepted this quote',
  }
  return labels[status] ?? status
}

function timelineTitle(message: QuoteRequestMessage) {
  const labels: Record<string, string> = {
    status: 'Status update',
    question: 'Question from shop',
    reply: 'Your reply',
    rejection: 'Request rejected',
    quote: 'Quote update',
    note: 'Note',
  }
  return labels[message.message_kind] ?? 'Update'
}

function timelineMeta(message: QuoteRequestMessage) {
  const role = message.sender_role === 'shop' ? 'Shop' : message.sender_role === 'client' ? 'You' : 'System'
  const sender = message.sender_name ? ` / ${message.sender_name}` : ''
  return `${role}${sender}`
}

onMounted(() => fetchRequest())
</script>
