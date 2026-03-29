<template>
  <div class="space-y-6">
    <DashboardPageHeader
      :title="`Request #${id}`"
      :subtitle="request?.customer_name || 'Incoming request'"
    >
      <template #actions>
        <UButton
          :to="`/shops/${slug}`"
          variant="soft"
          size="sm"
          class="rounded-md"
        >
          <UIcon name="i-lucide-external-link" class="mr-2 h-4 w-4" />
          View Public Shop
        </UButton>
        <UButton
          :to="`/dashboard/shops/${slug}/incoming-requests`"
          variant="soft"
          size="sm"
          class="rounded-md"
        >
          <UIcon name="i-lucide-arrow-left" class="mr-2 h-4 w-4" />
          Back
        </UButton>
      </template>
    </DashboardPageHeader>

    <CommonLoadingSpinner v-if="loading && !request" />

    <template v-else-if="request">
      <IncomingRequestStatusBadge :status="request.status" />

      <div class="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(22rem,0.95fr)]">
        <div class="space-y-6">
          <SectionCard>
            <div class="flex flex-col gap-5">
              <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">
                    Request details
                  </p>
                  <h2 class="mt-2 text-2xl font-semibold text-[var(--p-text)]">
                    Client request
                  </h2>
                  <p class="mt-2 max-w-2xl text-sm text-[var(--p-text-muted)]">
                    Structured request context, submitted items, and client information in the main workspace.
                  </p>
                </div>

                <div class="rounded-lg border border-[var(--p-border)] bg-[var(--p-surface-sunken)] px-4 py-3 text-right">
                  <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">
                    Latest quote
                  </p>
                  <p class="mt-1 text-xl font-semibold text-[var(--p-text)]">
                    {{ latestQuoteDisplay }}
                  </p>
                </div>
              </div>

              <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <article
                  v-for="stat in summaryStats"
                  :key="stat.label"
                  class="rounded-lg border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4"
                >
                  <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">
                    {{ stat.label }}
                  </p>
                  <p class="mt-2 text-base font-semibold text-[var(--p-text)]">
                    {{ stat.value }}
                  </p>
                  <p v-if="stat.helper" class="mt-1 text-sm text-[var(--p-text-muted)]">
                    {{ stat.helper }}
                  </p>
                </article>
              </div>
            </div>
          </SectionCard>

          <SectionCard>
            <template #card-header>
              <div>
                <p class="text-sm font-semibold tracking-[0.01em] text-[var(--p-text-dim)]">
                  Request details
                </p>
                <p class="mt-1 text-sm text-[var(--p-text-muted)]">
                  Client identity, contact information, and request metadata.
                </p>
              </div>
            </template>

            <div class="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              <div class="grid gap-3 sm:grid-cols-2">
                <article
                  v-for="detail in requesterDetails"
                  :key="detail.label"
                  class="rounded-lg border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4"
                >
                  <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">
                    {{ detail.label }}
                  </p>
                  <p class="mt-2 break-words text-sm font-medium text-[var(--p-text)]">
                    {{ detail.value }}
                  </p>
                </article>
              </div>

              <div class="space-y-3">
                <article class="rounded-lg border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4">
                  <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">
                    Delivery
                  </p>
                  <p class="mt-2 text-sm font-medium text-[var(--p-text)]">
                    {{ deliverySummary }}
                  </p>
                </article>

                <article class="rounded-lg border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4">
                  <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">
                    Client notes
                  </p>
                  <p class="mt-2 whitespace-pre-wrap text-sm text-[var(--p-text)]">
                    {{ request.notes || 'No additional request notes provided.' }}
                  </p>
                </article>
              </div>
            </div>
          </SectionCard>

          <SectionCard>
            <template #card-header>
              <div class="flex items-center justify-between gap-4">
                <div>
                  <p class="text-sm font-semibold tracking-[0.01em] text-[var(--p-text-dim)]">
                    Requested items
                  </p>
                  <p class="mt-1 text-sm text-[var(--p-text-muted)]">
                    Structured view of each requested line with right-aligned KES totals.
                  </p>
                </div>
                <div class="rounded-full border border-[var(--p-border)] bg-[var(--p-surface-sunken)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">
                  {{ request.items.length }} item{{ request.items.length === 1 ? '' : 's' }}
                </div>
              </div>
            </template>

            <div class="hidden overflow-hidden rounded-lg border border-[var(--p-border)] lg:block">
              <table class="min-w-full divide-y divide-[var(--p-border)]">
                <thead class="bg-[var(--p-surface-sunken)]">
                  <tr class="text-left text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">
                    <th class="px-4 py-3">Product</th>
                    <th class="px-4 py-3">Size</th>
                    <th class="px-4 py-3">Stock / paper</th>
                    <th class="px-4 py-3">Finishing</th>
                    <th class="px-4 py-3 text-right">Quantity</th>
                    <th class="px-4 py-3 text-right">Line total</th>
                  </tr>
                </thead>

                <tbody class="divide-y divide-[var(--p-border)] bg-[var(--p-surface-raised)]">
                  <tr v-for="item in request.items" :key="item.id" class="align-top">
                    <td class="px-4 py-4">
                      <p class="font-semibold text-[var(--p-text)]">
                        {{ item.title ?? item.product_name ?? 'Product' }}
                      </p>
                      <p class="mt-1 text-sm text-[var(--p-text-muted)]">
                        {{ item.item_type === 'CUSTOM' ? 'Custom request' : 'Catalog product' }}
                      </p>
                      <p v-if="itemModeLine(item)" class="mt-1 text-xs text-[var(--p-text-muted)]">
                        {{ itemModeLine(item) }}
                      </p>
                    </td>
                    <td class="px-4 py-4 text-sm text-[var(--p-text)]">
                      {{ itemSizeLine(item) }}
                    </td>
                    <td class="px-4 py-4 text-sm text-[var(--p-text)]">
                      {{ itemPaperLine(item) }}
                    </td>
                    <td class="px-4 py-4 text-sm text-[var(--p-text)]">
                      {{ itemFinishingLine(item) }}
                    </td>
                    <td class="px-4 py-4 text-right text-sm font-semibold tabular-nums text-[var(--p-text)]">
                      {{ item.quantity }}
                    </td>
                    <td class="px-4 py-4 text-right text-sm font-semibold tabular-nums text-[var(--p-text)]">
                      {{ itemTotalDisplay(item) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="space-y-3 lg:hidden">
              <article
                v-for="item in request.items"
                :key="item.id"
                class="rounded-lg border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4"
              >
                <div class="flex items-start justify-between gap-4">
                  <div class="min-w-0">
                    <p class="font-semibold text-[var(--p-text)]">
                      {{ item.title ?? item.product_name ?? 'Product' }}
                    </p>
                    <p class="mt-1 text-sm text-[var(--p-text-muted)]">
                      {{ item.item_type === 'CUSTOM' ? 'Custom request' : 'Catalog product' }}
                    </p>
                  </div>
                  <div class="text-right">
                    <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">
                      Qty
                    </p>
                    <p class="mt-1 text-sm font-semibold tabular-nums text-[var(--p-text)]">
                      {{ item.quantity }}
                    </p>
                  </div>
                </div>

                <div class="mt-4 grid gap-3 sm:grid-cols-2">
                  <div>
                    <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Size</p>
                    <p class="mt-1 text-sm text-[var(--p-text)]">{{ itemSizeLine(item) }}</p>
                  </div>
                  <div>
                    <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Stock / paper</p>
                    <p class="mt-1 text-sm text-[var(--p-text)]">{{ itemPaperLine(item) }}</p>
                  </div>
                  <div>
                    <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Finishing</p>
                    <p class="mt-1 text-sm text-[var(--p-text)]">{{ itemFinishingLine(item) }}</p>
                  </div>
                  <div>
                    <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Configuration</p>
                    <p class="mt-1 text-sm text-[var(--p-text)]">{{ itemModeLine(item) || 'Not specified' }}</p>
                  </div>
                </div>

                <div class="mt-4 flex items-center justify-between border-t border-[var(--p-border)] pt-3">
                  <span class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">
                    Line total
                  </span>
                  <span class="text-sm font-semibold tabular-nums text-[var(--p-text)]">
                    {{ itemTotalDisplay(item) }}
                  </span>
                </div>
              </article>
            </div>
          </SectionCard>

          <SectionCard v-if="request.attachments?.length">
            <template #card-header>
              <div>
                <p class="text-sm font-semibold tracking-[0.01em] text-[var(--p-text-dim)]">
                  Attachments
                </p>
                <p class="mt-1 text-sm text-[var(--p-text-muted)]">
                  Files supplied with the request.
                </p>
              </div>
            </template>

            <div class="grid gap-3 md:grid-cols-2">
              <a
                v-for="att in request.attachments"
                :key="att.id"
                :href="att.file"
                target="_blank"
                rel="noopener noreferrer"
                class="rounded-lg border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4 transition-colors hover:border-flamingo-300"
              >
                <p class="text-sm font-semibold text-[var(--p-text)]">
                  {{ att.name || 'Attachment' }}
                </p>
                <p class="mt-1 text-xs text-[var(--p-text-muted)]">
                  Added {{ formatDate(att.created_at) }}
                </p>
              </a>
            </div>
          </SectionCard>
        </div>

        <div class="space-y-6">
          <SectionCard>
            <template #card-header>
              <div>
                <p class="text-sm font-semibold tracking-[0.01em] text-[var(--p-text-dim)]">
                  Response actions
                </p>
                <p class="mt-1 text-sm text-[var(--p-text-muted)]">
                  Respond to the request and share a clean formatted summary from the same workspace.
                </p>
              </div>
            </template>

            <div class="space-y-4">
              <div class="rounded-lg border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4">
                <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">
                  Response summary
                </p>
                <dl class="mt-3 space-y-2 text-sm">
                  <div class="flex items-start justify-between gap-4">
                    <dt class="text-[var(--p-text-muted)]">Request status</dt>
                    <dd class="font-medium text-[var(--p-text)]">{{ statusLabel(request.status) }}</dd>
                  </div>
                  <div class="flex items-start justify-between gap-4">
                    <dt class="text-[var(--p-text-muted)]">Latest quote</dt>
                    <dd class="font-medium text-[var(--p-text)]">{{ latestQuoteDisplay }}</dd>
                  </div>
                  <div class="flex items-start justify-between gap-4">
                    <dt class="text-[var(--p-text-muted)]">Turnaround</dt>
                    <dd class="font-medium text-[var(--p-text)]">{{ turnaroundDisplay }}</dd>
                  </div>
                  <div class="flex items-start justify-between gap-4">
                    <dt class="text-[var(--p-text-muted)]">Revisions</dt>
                    <dd class="font-medium text-[var(--p-text)]">{{ revisionCount }}</dd>
                  </div>
                </dl>
              </div>

              <template v-if="canSendQuote">
                <SendQuoteForm
                  v-if="showSendForm"
                  :loading="sending"
                  @submit="onSendQuote"
                  @cancel="showSendForm = false"
                />
                <UButton v-else color="primary" block class="rounded-md" @click="showSendForm = true">
                  <UIcon name="i-lucide-send" class="mr-2 h-4 w-4" />
                  Send quote
                </UButton>
              </template>

              <template v-else-if="canRevise">
                <ReviseQuoteForm
                  v-if="showReviseForm"
                  :loading="revising"
                  :initial-total="latestQuote?.total"
                  :initial-note="latestQuote?.note ?? ''"
                  :initial-turnaround="latestQuote?.turnaround_days"
                  @submit="onReviseQuote"
                  @cancel="showReviseForm = false"
                />
                <UButton v-else variant="soft" block class="rounded-md" @click="showReviseForm = true">
                  <UIcon name="i-lucide-refresh-cw" class="mr-2 h-4 w-4" />
                  Revise quote
                </UButton>
              </template>

              <UButton
                v-if="canMarkViewed"
                variant="soft"
                color="neutral"
                block
                class="rounded-md"
                :loading="markingViewed"
                @click="onMarkViewed"
              >
                <UIcon name="i-lucide-eye" class="mr-2 h-4 w-4" />
                Mark viewed
              </UButton>

              <UButton
                v-if="canDecline"
                variant="soft"
                color="error"
                block
                class="rounded-md"
                :loading="declining"
                @click="onDecline"
              >
                <UIcon name="i-lucide-x" class="mr-2 h-4 w-4" />
                Decline
              </UButton>

              <div v-if="request.whatsapp_summary" class="border-t border-[var(--p-border)] pt-4">
                <div class="space-y-4">
                  <div class="flex items-center justify-between gap-3">
                    <div>
                      <p class="text-sm font-semibold text-[var(--p-text)]">Share preview</p>
                      <p class="mt-1 text-sm text-[var(--p-text-muted)]">Formatted summary block for copy and WhatsApp sharing.</p>
                    </div>
                  </div>

                  <div class="rounded-lg border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4 shadow-sm">
                    <div class="border-b border-[var(--p-border)] pb-3">
                      <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">
                        {{ request.shop_name || 'Printy Shop' }}
                      </p>
                      <p class="mt-1 text-base font-semibold text-[var(--p-text)]">
                        Quote response summary
                      </p>
                      <p class="mt-1 text-sm text-[var(--p-text-muted)]">
                        {{ request.customer_name || 'Client request' }} / {{ request.items.length }} item{{ request.items.length === 1 ? '' : 's' }} / {{ totalUnits }} total units
                      </p>
                    </div>

                    <div class="mt-4 space-y-2 text-sm leading-6 text-[var(--p-text)]">
                      <p v-for="(line, index) in formattedSummaryLines" :key="`${index}-${line}`" :class="line.startsWith('-') ? 'pl-3' : ''">
                        <span v-if="line.startsWith('-')" class="mr-2 text-[var(--p-text-muted)]">&bull;</span>
                        {{ line.replace(/^-+\s*/, '') }}
                      </p>
                    </div>
                  </div>

                  <ShareActionsBar
                    :summary-text="request.whatsapp_summary"
                    copy-label="Copy summary"
                    :attachments="request.attachments"
                  />
                </div>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </template>

    <DashboardEmptyState
      v-else
      title="Request not found"
      description="This incoming request may have been removed or you don't have access."
      icon="i-lucide-file-question"
    >
      <UButton :to="`/dashboard/shops/${slug}/incoming-requests`">Incoming Requests</UButton>
    </DashboardEmptyState>
  </div>
</template>

<script setup lang="ts">
import type { IncomingRequestDetail, IncomingRequestItem } from '~/shared/types/incomingRequest'
import { formatCurrency, formatDate } from '~/utils/formatters'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'shop-owner'],
})

const route = useRoute()
const slug = computed(() => route.params.slug as string)
const id = computed(() => parseInt(route.params.id as string, 10))
const notification = useNotification()

const incoming = useIncomingRequests(slug)
const sentQuotes = useSentQuotes()

const request = ref<IncomingRequestDetail | null>(null)
const loading = ref(true)
const sending = ref(false)
const revising = ref(false)
const markingViewed = ref(false)
const declining = ref(false)
const showSendForm = ref(false)
const showReviseForm = ref(false)

const latestQuote = computed(() => {
  const sq = request.value?.sent_quotes
  if (!sq?.length) return null
  return sq[sq.length - 1]
})

const hasSentQuote = computed(
  () =>
    request.value?.sent_quotes?.some((sq) =>
      ['sent', 'revised', 'accepted'].includes(sq.status),
    ) ?? false,
)

const canSendQuote = computed(
  () =>
    request.value &&
    ['submitted', 'viewed'].includes(request.value.status) &&
    !hasSentQuote.value,
)

const canRevise = computed(
  () =>
    request.value &&
    ['quoted', 'accepted'].includes(request.value.status) &&
    latestQuote.value &&
    ['sent', 'revised'].includes(latestQuote.value.status),
)

const canMarkViewed = computed(() => request.value?.status === 'submitted')

const canDecline = computed(
  () =>
    request.value &&
    ['submitted', 'viewed'].includes(request.value.status),
)

const totalUnits = computed(() =>
  request.value?.items.reduce((sum, item) => sum + (item.quantity || 0), 0) ?? 0,
)

const latestQuoteDisplay = computed(() =>
  latestQuote.value?.total
    ? formatCurrency(latestQuote.value.total, request.value?.shop_currency)
    : 'Not quoted yet',
)

const turnaroundDisplay = computed(() =>
  latestQuote.value?.turnaround_days != null
    ? `${latestQuote.value.turnaround_days} business day${latestQuote.value.turnaround_days === 1 ? '' : 's'}`
    : 'Not set',
)

const revisionCount = computed(() => request.value?.sent_quotes?.length ?? 0)

const summaryStats = computed(() => [
  {
    label: 'Status',
    value: request.value ? statusLabel(request.value.status) : 'Pending',
    helper: request.value ? `Updated ${formatDate(request.value.updated_at || request.value.created_at)}` : '',
  },
  {
    label: 'Submitted',
    value: request.value ? formatDate(request.value.created_at) : 'Recently',
    helper: request.value ? `Request #${request.value.id}` : '',
  },
  {
    label: 'Items',
    value: request.value ? `${request.value.items.length} line${request.value.items.length === 1 ? '' : 's'}` : '0 lines',
    helper: `${totalUnits.value} total units`,
  },
  {
    label: 'Quote state',
    value: canSendQuote.value ? 'Ready to quote' : canRevise.value ? 'Ready to revise' : 'Awaiting action',
    helper: latestQuote.value ? `Revision ${latestQuote.value.revision_number}` : 'No quote sent yet',
  },
])

const requesterDetails = computed(() => [
  { label: 'Client name', value: request.value?.customer_name || 'Not provided' },
  { label: 'Email', value: request.value?.customer_email || 'Not provided' },
  { label: 'Phone', value: request.value?.customer_phone || 'Not provided' },
  { label: 'Request ID', value: request.value ? `#${request.value.id}` : '-' },
])

const deliverySummary = computed(() => {
  if (!request.value?.delivery_preference) return 'Delivery preference not specified.'
  const mode = request.value.delivery_preference === 'pickup' ? 'Pickup' : 'Delivery'
  const location = request.value.delivery_address || request.value.delivery_location_name
  return location ? `${mode} / ${location}` : mode
})

const formattedSummaryLines = computed(() =>
  (request.value?.whatsapp_summary ?? '')
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean),
)

async function fetchRequest() {
  if (Number.isNaN(id.value)) {
    loading.value = false
    return
  }
  loading.value = true
  try {
    request.value = await incoming.get(id.value)
  } catch {
    request.value = null
  } finally {
    loading.value = false
  }
}

async function onSendQuote(payload: { total?: number | string | null; note?: string; turnaround_days?: number | null }) {
  if (!request.value || sending.value) return
  sending.value = true
  try {
    request.value = await incoming.sendQuote(id.value, payload)
    showSendForm.value = false
    notification.success('Quote sent')
  } catch (e) {
    notification.error(e instanceof Error ? e.message : 'Failed to send quote')
  } finally {
    sending.value = false
  }
}

async function onReviseQuote(payload: { total?: number | string | null; note?: string; turnaround_days?: number | null }) {
  const sq = latestQuote.value
  if (!sq || revising.value) return
  revising.value = true
  try {
    await sentQuotes.revise(sq.id, payload)
    await fetchRequest()
    showReviseForm.value = false
    notification.success('Quote revised')
  } catch (e) {
    notification.error(e instanceof Error ? e.message : 'Failed to revise quote')
  } finally {
    revising.value = false
  }
}

async function onMarkViewed() {
  if (!request.value || markingViewed.value) return
  markingViewed.value = true
  try {
    request.value = await incoming.markViewed(id.value)
    notification.success('Marked as viewed')
  } catch (e) {
    notification.error(e instanceof Error ? e.message : 'Failed to mark viewed')
  } finally {
    markingViewed.value = false
  }
}

async function onDecline() {
  if (!request.value || declining.value) return
  if (!confirm('Decline this request? The customer will be notified.')) return
  declining.value = true
  try {
    request.value = await incoming.decline(id.value)
    notification.success('Request declined')
  } catch (e) {
    notification.error(e instanceof Error ? e.message : 'Failed to decline')
  } finally {
    declining.value = false
  }
}

function statusLabel(status: string) {
  const labels: Record<string, string> = {
    draft: 'Draft',
    submitted: 'Submitted',
    viewed: 'Viewed',
    quoted: 'Quoted',
    accepted: 'Accepted',
    closed: 'Closed',
    cancelled: 'Cancelled',
  }
  return labels[status] ?? status
}

function itemSizeLine(item: IncomingRequestItem) {
  if (item.chosen_width_mm && item.chosen_height_mm) return `${item.chosen_width_mm} x ${item.chosen_height_mm} mm`
  if (item.spec_text) return item.spec_text
  return 'Not specified'
}

function itemPaperLine(item: IncomingRequestItem) {
  if (item.paper) return `Paper #${item.paper}`
  if (item.material) return `Material #${item.material}`
  return 'Stock not specified'
}

function itemFinishingLine(item: IncomingRequestItem) {
  const labels = item.finishings?.map(finishing => finishing.finishing_rate_name).filter(Boolean) ?? []
  return labels.length ? labels.join(', ') : 'None'
}

function itemModeLine(item: IncomingRequestItem) {
  const parts: string[] = []
  if (item.pricing_mode) parts.push(item.pricing_mode === 'LARGE_FORMAT' ? 'Large format' : 'Sheet pricing')
  if (item.sides) parts.push(item.sides === 'DUPLEX' ? 'Duplex' : 'Simplex')
  if (item.color_mode) parts.push(item.color_mode === 'BW' ? 'B&W' : 'Colour')
  return parts.join(' / ')
}

function itemTotalDisplay(item: IncomingRequestItem) {
  return item.line_total ? formatCurrency(item.line_total, request.value?.shop_currency) : '—'
}

onMounted(() => fetchRequest())
</script>

