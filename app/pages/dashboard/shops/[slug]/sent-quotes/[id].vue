<template>
  <div class="space-y-6">
    <DashboardPageHeader
      :title="`Quote #${id}`"
      :subtitle="quote?.quote_request_summary?.customer_name || 'Sent quote'"
    >
      <template #actions>
        <UButton :to="`/dashboard/shops/${slug}/incoming-requests/${quote?.quote_request}`" variant="soft" size="sm">
          <UIcon name="i-lucide-inbox" class="w-4 h-4 mr-2" />
          View request
        </UButton>
        <UButton :to="`/dashboard/shops/${slug}/sent-quotes`" variant="soft" size="sm">
          <UIcon name="i-lucide-arrow-left" class="w-4 h-4 mr-2" />
          Back
        </UButton>
      </template>
    </DashboardPageHeader>

    <CommonLoadingSpinner v-if="loading && !quote" />
    <template v-else-if="quote">
      <div class="grid gap-6 lg:grid-cols-3">
        <!-- Main content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Status & summary -->
          <SectionCard>
            <div class="flex flex-wrap items-center gap-3">
              <SentQuoteStatusBadge :status="quote.status" />
              <span v-if="quote.revision_number > 1" class="text-sm text-[var(--p-text-muted)]">
                Revision {{ quote.revision_number }}
              </span>
              <span class="text-sm text-[var(--p-text-muted)]">
                Sent {{ formatDate(quote.sent_at) }}
                <template v-if="quote.updated_at && quote.sent_at && quote.updated_at !== quote.sent_at">
                  · Revised {{ formatDate(quote.updated_at) }}
                </template>
              </span>
            </div>
            <div class="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <p class="text-xs font-medium text-[var(--p-text-muted)]">Total</p>
                <p class="text-xl font-semibold text-[var(--p-text)]">
                  {{ formatCurrency(quote.total, quote.shop_currency) }}
                </p>
              </div>
              <div v-if="quote.turnaround_days != null">
                <p class="text-xs font-medium text-[var(--p-text-muted)]">Turnaround</p>
                <p class="text-lg font-medium text-[var(--p-text)]">
                  {{ quote.turnaround_days }} business day{{ quote.turnaround_days !== 1 ? 's' : '' }}
                </p>
              </div>
            </div>
          </SectionCard>

          <!-- Customer / request summary -->
          <SectionCard title="Customer">
            <div class="space-y-2 text-sm">
              <p><span class="text-[var(--p-text-muted)]">Name:</span> {{ quote.quote_request_summary?.customer_name || '—' }}</p>
              <p><span class="text-[var(--p-text-muted)]">Email:</span> {{ quote.quote_request_summary?.customer_email || '—' }}</p>
              <p><span class="text-[var(--p-text-muted)]">Phone:</span> {{ quote.quote_request_summary?.customer_phone || '—' }}</p>
              <p><span class="text-[var(--p-text-muted)]">Request status:</span> {{ requestStatusLabel(quote.quote_request_summary?.status) || '—' }}</p>
            </div>
          </SectionCard>

          <!-- Items -->
          <SectionCard title="Items">
            <ul class="divide-y divide-[var(--p-border)]">
              <li
                v-for="item in quote.items"
                :key="item.id"
                class="flex items-start justify-between gap-4 py-3 first:pt-0"
              >
                <div class="min-w-0 flex-1">
                  <p class="font-medium text-[var(--p-text)]">
                    {{ item.title ?? item.product_name ?? 'Product' }}
                  </p>
                  <p class="text-sm text-[var(--p-text-muted)]">
                    Qty: {{ item.quantity }}
                    <template v-if="item.spec_text">
                      · {{ item.spec_text }}
                    </template>
                  </p>
                </div>
                <div v-if="item.line_total" class="shrink-0 text-sm font-medium tabular-nums text-[var(--p-text)]">
                  {{ formatCurrency(item.line_total, quote.shop_currency) }}
                </div>
              </li>
            </ul>
            <div class="mt-4 pt-4 border-t border-[var(--p-border)] flex justify-between font-semibold text-[var(--p-text)]">
              <span>Total</span>
              <span class="tabular-nums">{{ formatCurrency(quote.total, quote.shop_currency) }}</span>
            </div>
          </SectionCard>

          <!-- Note -->
          <SectionCard v-if="quote.note" title="Note to customer">
            <p class="text-sm text-[var(--p-text)] whitespace-pre-wrap">{{ quote.note }}</p>
          </SectionCard>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Revision history (from incoming request) -->
          <SectionCard v-if="revisionHistory.length" title="Revision history">
            <ul class="space-y-2">
              <li
                v-for="rev in revisionHistory"
                :key="rev.id"
                class="flex items-center justify-between gap-2 rounded-lg px-3 py-2"
                :class="rev.id === quote.id ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-[var(--p-surface-sunken)] dark:bg-[var(--p-surface-raised)]'"
              >
                <span class="text-sm">
                  <span v-if="rev.id === quote.id" class="font-medium">Current</span>
                  <span v-else>Rev {{ rev.revision_number }}</span>
                  · {{ formatCurrency(rev.total) }}
                </span>
                <span class="text-xs text-[var(--p-text-muted)]">{{ formatDate(rev.sent_at || rev.created_at) }}</span>
              </li>
            </ul>
          </SectionCard>

          <!-- Actions -->
          <SectionCard title="Actions">
            <div class="space-y-2">
              <UButton
                :to="`/dashboard/shops/${slug}/incoming-requests/${quote.quote_request}`"
                block
                variant="soft"
              >
                <UIcon name="i-lucide-external-link" class="w-4 h-4 mr-2" />
                Open incoming request
              </UButton>
              <UButton
                v-if="canRevise"
                block
                variant="soft"
                @click="showReviseForm = true"
              >
                <UIcon name="i-lucide-refresh-cw" class="w-4 h-4 mr-2" />
                Revise quote
              </UButton>
            </div>
          </SectionCard>

          <!-- Revise form -->
          <SectionCard v-if="showReviseForm" title="Revise quote">
            <ReviseQuoteForm
              :loading="revising"
              :initial-total="quote.total"
              :initial-note="quote.note ?? ''"
              :initial-turnaround="quote.turnaround_days"
              @submit="onRevise"
              @cancel="showReviseForm = false"
            />
          </SectionCard>

          <!-- Share quote -->
          <SectionCard v-if="quote.whatsapp_summary" title="Share quote">
            <p class="text-sm text-[var(--p-text)] whitespace-pre-wrap font-mono mb-3">{{ quote.whatsapp_summary }}</p>
            <ShareActionsBar
              :summary-text="quote.whatsapp_summary"
              copy-label="Copy summary"
              :attachments="quote.attachments"
            />
          </SectionCard>
        </div>
      </div>
    </template>
    <DashboardEmptyState
      v-else
      title="Quote not found"
      description="This sent quote may have been removed or you don't have access."
      icon="i-lucide-file-question"
    >
      <UButton :to="`/dashboard/shops/${slug}/sent-quotes`">Sent Quotes</UButton>
    </DashboardEmptyState>
  </div>
</template>

<script setup lang="ts">
import type { SentQuoteDetail } from '~/shared/types/sentQuote'
import type { IncomingRequestDetail } from '~/shared/types/incomingRequest'
import { formatCurrency, formatDate } from '~/utils/formatters'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'shop-owner'],
})

const route = useRoute()
const slug = computed(() => route.params.slug as string)
const id = computed(() => parseInt(route.params.id as string, 10))
const notification = useNotification()

const sentQuotes = useSentQuotes()
const incoming = useIncomingRequests(slug)

const quote = ref<SentQuoteDetail | null>(null)
const incomingRequest = ref<IncomingRequestDetail | null>(null)
const loading = ref(true)
const revising = ref(false)
const showReviseForm = ref(false)

const revisionHistory = computed(() => {
  const sq = incomingRequest.value?.sent_quotes
  if (!sq?.length) return []
  return [...sq].sort((a, b) => {
    const da = a.sent_at || a.created_at
    const db = b.sent_at || b.created_at
    return new Date(db).getTime() - new Date(da).getTime()
  })
})

const canRevise = computed(
  () =>
    quote.value &&
    ['sent', 'revised'].includes(quote.value.status)
)

const requestStatusLabels: Record<string, string> = {
  draft: 'Draft',
  submitted: 'Submitted',
  viewed: 'Viewed',
  quoted: 'Quoted',
  accepted: 'Accepted',
  closed: 'Closed',
  cancelled: 'Cancelled',
}
function requestStatusLabel(s: string | undefined): string {
  return s ? (requestStatusLabels[s] ?? s) : ''
}

async function fetchQuote() {
  if (Number.isNaN(id.value)) {
    loading.value = false
    return
  }
  loading.value = true
  try {
    quote.value = await sentQuotes.get(id.value)
    if (quote.value?.quote_request) {
      incomingRequest.value = await incoming.get(quote.value.quote_request)
    } else {
      incomingRequest.value = null
    }
  } catch {
    quote.value = null
    incomingRequest.value = null
  } finally {
    loading.value = false
  }
}

async function onRevise(payload: { total?: number | string | null; note?: string; turnaround_days?: number | null }) {
  if (!quote.value || revising.value) return
  revising.value = true
  try {
    quote.value = await sentQuotes.revise(id.value, payload)
    if (quote.value?.quote_request) {
      incomingRequest.value = await incoming.get(quote.value.quote_request)
    }
    showReviseForm.value = false
    notification.success('Quote revised')
  } catch (e) {
    notification.error(e instanceof Error ? e.message : 'Failed to revise quote')
  } finally {
    revising.value = false
  }
}

onMounted(() => fetchQuote())
</script>
