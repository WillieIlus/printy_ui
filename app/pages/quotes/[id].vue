<template>
  <div class="min-h-screen bg-[var(--p-bg)]">
    <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
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
          Quote Requests
        </UButton>
      </div>

      <CommonLoadingSpinner v-if="loading && !request" />
      <template v-else-if="request">
        <!-- Status alert -->
        <UAlert
          v-if="request.status === 'draft'"
          color="neutral"
          variant="soft"
          icon="i-lucide-edit"
          title="Draft"
          description="Complete your request and submit to send it to the shop."
          class="mb-6"
        />
        <UAlert
          v-else-if="request.status === 'submitted' || request.status === 'viewed'"
          color="primary"
          variant="soft"
          icon="i-lucide-clock"
          title="Waiting for shop response"
          description="Your request has been sent. The shop will review and send you a quote."
          class="mb-6"
        />
        <UAlert
          v-else-if="request.status === 'quoted'"
          color="success"
          variant="soft"
          icon="i-lucide-check-circle"
          title="Shop responded"
          description="The shop has sent a quote. Review the details below and accept if the price works for you."
          class="mb-6"
        />
        <UAlert
          v-else-if="request.status === 'accepted'"
          color="success"
          variant="soft"
          icon="i-lucide-check-circle"
          title="Accepted"
          description="You've accepted this quote. The shop can now create a job."
          class="mb-6"
        />
        <UAlert
          v-else-if="request.status === 'cancelled' || request.status === 'closed'"
          color="neutral"
          variant="soft"
          icon="i-lucide-x-circle"
          :title="request.status === 'cancelled' ? 'Cancelled' : 'Closed'"
          :description="request.status === 'cancelled' ? 'You cancelled this request.' : 'This request is closed.'"
          class="mb-6"
        />

        <!-- Request summary card -->
        <div class="rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] overflow-hidden mb-6">
          <div class="px-6 py-4 border-b border-[var(--p-border)]">
            <div class="flex justify-between items-start gap-4">
              <div>
                <h2 class="font-semibold text-[var(--p-text)]">{{ request.shop_name }}</h2>
                <p class="text-sm text-[var(--p-text-muted)] mt-0.5">
                  <UBadge :color="statusBadgeColor" variant="soft" size="sm">{{ statusLabel }}</UBadge>
                </p>
              </div>
              <NuxtLink
                v-if="request.shop_slug"
                :to="`/shops/${request.shop_slug}`"
                class="text-sm font-medium text-flamingo-600 dark:text-flamingo-400 hover:underline shrink-0"
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
              <div v-if="item.line_total" class="shrink-0 text-sm font-medium text-[var(--p-text)] tabular-nums">
                {{ formatMoney(item.line_total, request.shop_currency) }}
              </div>
            </li>
          </ul>
          <div
            v-if="latestQuote?.total"
            class="px-6 py-4 border-t border-[var(--p-border)] bg-[var(--p-surface-sunken)] dark:bg-[var(--p-surface-raised)]"
          >
            <div class="flex justify-between font-semibold text-[var(--p-text)]">
              <span>Total</span>
              <span class="tabular-nums">{{ formatMoney(latestQuote.total, request.shop_currency) }}</span>
            </div>
          </div>
        </div>

        <!-- Shop quote response -->
        <div
          v-if="latestQuote && (request.status === 'quoted' || request.status === 'accepted')"
          class="rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 mb-6"
        >
          <h3 class="text-sm font-medium text-[var(--p-text-muted)] mb-3">Shop response</h3>
          <div class="space-y-2 text-sm text-[var(--p-text)]">
            <p v-if="latestQuote.turnaround_days" class="flex items-center gap-2">
              <UIcon name="i-lucide-clock" class="h-4 w-4 shrink-0" />
              {{ latestQuote.turnaround_days }} business day(s)
            </p>
            <p v-if="latestQuote.note" class="text-[var(--p-text-muted)]">{{ latestQuote.note }}</p>
          </div>
          <div v-if="request.whatsapp_summary" class="mt-4 rounded-lg border border-[var(--p-border)] bg-[var(--p-surface-sunken)] dark:bg-[var(--p-surface-raised)] p-3">
            <p class="text-xs text-[var(--p-text-muted)] mb-2">Shareable summary</p>
            <p class="text-sm text-[var(--p-text)] whitespace-pre-wrap font-mono">{{ request.whatsapp_summary }}</p>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-wrap gap-3">
          <UButton
            v-if="canSubmit"
            color="primary"
            :loading="submitting"
            @click="onSubmit"
          >
            <UIcon name="i-lucide-send" class="w-4 h-4 mr-2" />
            Submit request
          </UButton>
          <UButton
            v-if="canAccept"
            color="primary"
            :loading="accepting"
            @click="onAccept"
          >
            <UIcon name="i-lucide-check" class="w-4 h-4 mr-2" />
            Accept quote
          </UButton>
          <UButton
            v-if="canCancel"
            variant="soft"
            color="error"
            :loading="cancelling"
            @click="onCancel"
          >
            <UIcon name="i-lucide-x" class="w-4 h-4 mr-2" />
            Cancel request
          </UButton>
          <UButton
            v-if="request.status === 'draft' && request.shop_slug"
            variant="outline"
            @click="goToDraft"
          >
            <UIcon name="i-lucide-edit" class="w-4 h-4 mr-2" />
            Edit draft
          </UButton>
        </div>

        <!-- Share request (secondary) -->
        <div v-if="request.whatsapp_summary" class="rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-4 mb-6">
          <p class="text-sm font-medium text-[var(--p-text-muted)] mb-2">Share request</p>
          <ShareActionsBar
            :summary-text="request.whatsapp_summary"
            copy-label="Copy summary"
            :attachments="request.attachments"
          />
        </div>
      </template>
      <DashboardEmptyState
        v-else
        title="Request not found"
        description="This quote request may have been removed or you don't have access."
        icon="i-lucide-file-question"
      >
        <UButton to="/quotes">Quote Requests</UButton>
      </DashboardEmptyState>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { QuoteRequest, QuoteRequestStatus } from '~/shared/types/quoteRequest'
import { useQuoteDraftStore } from '~/stores/quoteDraft'

definePageMeta({
  layout: 'default',
  middleware: 'auth',
})

const route = useRoute()
const id = computed(() => parseInt(route.params.id as string, 10))
const quoteRequests = useQuoteRequests()
const quoteDraftStore = useQuoteDraftStore()
const notification = useNotification()

function goToDraft() {
  if (request.value?.shop_slug) {
    quoteDraftStore.setShop(request.value.shop_slug)
    navigateTo(`/quote-draft?shop=${request.value.shop_slug}`)
  }
}

const request = ref<QuoteRequest | null>(null)
const loading = ref(true)
const accepting = ref(false)
const cancelling = ref(false)
const submitting = ref(false)
const { formatMoney } = useCurrencyFormatter(computed(() => request.value?.shop_currency ?? null))

const statusLabels: Record<QuoteRequestStatus, string> = {
  draft: 'Draft',
  submitted: 'Submitted',
  viewed: 'Viewed',
  quoted: 'Quoted',
  accepted: 'Accepted',
  closed: 'Closed',
  cancelled: 'Cancelled',
}

const statusLabel = computed(() =>
  request.value ? statusLabels[request.value.status] ?? request.value.status : ''
)

const statusBadgeColor = computed((): 'neutral' | 'warning' | 'success' | 'error' => {
  const s = request.value?.status
  if (s === 'quoted') return 'warning'
  if (s === 'accepted') return 'success'
  if (s === 'cancelled' || s === 'closed') return 'error'
  return 'neutral'
})

const latestQuote = computed(() => request.value?.latest_sent_quote ?? null)

const canAccept = computed(
  () =>
    request.value?.status === 'quoted' &&
    request.value.latest_sent_quote &&
    ['sent', 'revised'].includes(request.value.latest_sent_quote.status)
)

const canCancel = computed(
  () =>
    request.value &&
    ['draft', 'submitted', 'viewed', 'quoted'].includes(request.value.status)
)

const canSubmit = computed(() => request.value?.status === 'draft')

async function fetchRequest() {
  if (Number.isNaN(id.value)) {
    loading.value = false
    return
  }
  loading.value = true
  try {
    request.value = await quoteRequests.get(id.value)
  } catch {
    request.value = null
  } finally {
    loading.value = false
  }
}

async function onAccept() {
  const sq = request.value?.latest_sent_quote
  if (!sq || accepting.value) return
  accepting.value = true
  try {
    request.value = await quoteRequests.accept(id.value, sq.id)
    notification.success('Quote accepted')
  } catch (e) {
    notification.error(e instanceof Error ? e.message : 'Failed to accept')
  } finally {
    accepting.value = false
  }
}

async function onSubmit() {
  if (!request.value || submitting.value) return
  submitting.value = true
  try {
    request.value = await quoteRequests.submit(id.value)
    notification.success('Request sent to the shop')
  } catch (e) {
    notification.error(e instanceof Error ? e.message : 'Failed to submit')
  } finally {
    submitting.value = false
  }
}

async function onCancel() {
  if (!request.value || cancelling.value) return
  if (!confirm('Cancel this quote request? This cannot be undone.')) return
  cancelling.value = true
  try {
    request.value = await quoteRequests.cancel(id.value)
    notification.success('Request cancelled')
  } catch (e) {
    notification.error(e instanceof Error ? e.message : 'Failed to cancel')
  } finally {
    cancelling.value = false
  }
}

onMounted(() => fetchRequest())
</script>
