<template>
  <div class="space-y-6">
    <DashboardPageHeader
      :title="`Request #${id}`"
      :subtitle="request?.customer_name || 'Incoming request'"
    >
      <template #actions>
        <UButton
          :to="`/dashboard/shops/${slug}/incoming-requests`"
          variant="soft"
          size="sm"
        >
          <UIcon name="i-lucide-arrow-left" class="w-4 h-4 mr-2" />
          Back
        </UButton>
      </template>
    </DashboardPageHeader>

    <CommonLoadingSpinner v-if="loading && !request" />
    <template v-else-if="request">
      <!-- Status -->
      <IncomingRequestStatusBadge :status="request.status" />

      <div class="grid gap-6 lg:grid-cols-3">
        <!-- Main content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Customer summary -->
          <SectionCard title="Customer">
            <div class="space-y-2 text-sm">
              <p><span class="text-[var(--p-text-muted)]">Name:</span> {{ request.customer_name || '—' }}</p>
              <p><span class="text-[var(--p-text-muted)]">Email:</span> {{ request.customer_email || '—' }}</p>
              <p><span class="text-[var(--p-text-muted)]">Phone:</span> {{ request.customer_phone || '—' }}</p>
              <p v-if="request.delivery_preference">
                <span class="text-[var(--p-text-muted)]">Delivery:</span>
                {{ request.delivery_preference === 'pickup' ? 'Pickup' : 'Delivery' }}
                <template v-if="request.delivery_address"> · {{ request.delivery_address }}</template>
                <template v-else-if="request.delivery_location_name"> · {{ request.delivery_location_name }}</template>
              </p>
              <p v-if="request.notes" class="pt-2 border-t border-[var(--p-border)]">
                <span class="text-[var(--p-text-muted)]">Notes:</span> {{ request.notes }}
              </p>
            </div>
          </SectionCard>

          <!-- Job spec -->
          <SectionCard title="Job specification">
            <ul class="divide-y divide-[var(--p-border)]">
              <li
                v-for="item in request.items"
                :key="item.id"
                class="flex items-start justify-between gap-4 py-3 first:pt-0"
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
                  {{ formatCurrency(item.line_total, request.shop_currency) }}
                </div>
              </li>
            </ul>
            <div
              v-if="latestQuote?.total"
              class="mt-4 pt-4 border-t border-[var(--p-border)] flex justify-between font-semibold text-[var(--p-text)]"
            >
              <span>Total</span>
              <span class="tabular-nums">{{ formatCurrency(latestQuote.total, request.shop_currency) }}</span>
            </div>
          </SectionCard>

          <!-- Attachments -->
          <SectionCard v-if="request.attachments?.length" title="Attachments">
            <ul class="space-y-2">
              <li v-for="att in request.attachments" :key="att.id">
                <a
                  :href="att.file"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-sm text-flamingo-600 dark:text-flamingo-400 hover:underline"
                >
                  {{ att.name || 'Attachment' }}
                </a>
              </li>
            </ul>
          </SectionCard>
        </div>

        <!-- Action panel -->
        <div class="lg:col-span-1">
          <SectionCard title="Actions">
            <div class="space-y-4">
              <!-- Send quote form (when not yet quoted) -->
              <template v-if="canSendQuote">
                <SendQuoteForm
                  v-if="showSendForm"
                  :loading="sending"
                  @submit="onSendQuote"
                  @cancel="showSendForm = false"
                />
                <template v-else>
                  <UButton color="primary" block @click="showSendForm = true">
                    <UIcon name="i-lucide-send" class="w-4 h-4 mr-2" />
                    Send quote
                  </UButton>
                </template>
              </template>

              <!-- Revise quote (when already quoted) -->
              <template v-else-if="canRevise">
                <template v-if="showReviseForm">
                  <ReviseQuoteForm
                    :loading="revising"
                    :initial-total="latestQuote?.total"
                    :initial-note="latestQuote?.note ?? ''"
                    :initial-turnaround="latestQuote?.turnaround_days"
                    @submit="onReviseQuote"
                    @cancel="showReviseForm = false"
                  />
                </template>
                <UButton v-else variant="soft" block @click="showReviseForm = true">
                  <UIcon name="i-lucide-refresh-cw" class="w-4 h-4 mr-2" />
                  Revise quote
                </UButton>
              </template>

              <!-- Mark viewed -->
              <UButton
                v-if="canMarkViewed"
                variant="soft"
                color="neutral"
                block
                :loading="markingViewed"
                @click="onMarkViewed"
              >
                <UIcon name="i-lucide-eye" class="w-4 h-4 mr-2" />
                Mark viewed
              </UButton>

              <!-- Decline -->
              <UButton
                v-if="canDecline"
                variant="soft"
                color="error"
                block
                :loading="declining"
                @click="onDecline"
              >
                <UIcon name="i-lucide-x" class="w-4 h-4 mr-2" />
                Decline
              </UButton>
            </div>
          </SectionCard>

          <!-- Share request -->
          <SectionCard v-if="request.whatsapp_summary" title="Share request" class="mt-4">
            <p class="text-sm text-[var(--p-text)] whitespace-pre-wrap font-mono mb-3">{{ request.whatsapp_summary }}</p>
            <ShareActionsBar
              :summary-text="request.whatsapp_summary"
              copy-label="Copy summary"
              :attachments="request.attachments"
            />
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
import type { IncomingRequestDetail } from '~/shared/types/incomingRequest'
import { formatCurrency } from '~/utils/formatters'

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
      ['sent', 'revised', 'accepted'].includes(sq.status)
    ) ?? false
)

const canSendQuote = computed(
  () =>
    request.value &&
    ['submitted', 'viewed'].includes(request.value.status) &&
    !hasSentQuote.value
)

const canRevise = computed(
  () =>
    request.value &&
    ['quoted', 'accepted'].includes(request.value.status) &&
    latestQuote.value &&
    ['sent', 'revised'].includes(latestQuote.value.status)
)

const canMarkViewed = computed(
  () => request.value?.status === 'submitted'
)

const canDecline = computed(
  () =>
    request.value &&
    ['submitted', 'viewed'].includes(request.value.status)
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

onMounted(() => fetchRequest())
</script>
