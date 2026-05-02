<template>
  <DashboardShell sidebar-tone="dark">
    <template #sidebar>
      <ShopSidebarNav />
    </template>

    <div class="space-y-6">
      <DashboardTopBar
        eyebrow="Print shop"
        :title="pageTitle"
        description="Review the buyer brief, your latest quote, and the full response thread in one place."
      />

      <BaseCard v-if="loading && !requestDetail" tone="default">
        <div class="flex items-center gap-2 text-sm text-[var(--p-text-muted)]">
          <Icon name="lucide:loader-2" class="size-4 animate-spin" />
          Loading request...
        </div>
      </BaseCard>

      <BaseCard v-else-if="loadError" tone="default">
        <div class="space-y-4">
          <p class="text-base font-semibold text-[var(--p-text)]">We couldn't load this request.</p>
          <p class="text-sm text-[var(--p-text-muted)]">{{ loadError }}</p>
          <div class="flex flex-wrap gap-2">
            <BaseButton variant="outline" size="sm" @click="load">Try again</BaseButton>
            <BaseButton variant="ghost" size="sm" to="/dashboard/shop/requests">Back to requests</BaseButton>
          </div>
        </div>
      </BaseCard>

      <template v-else-if="requestDetail">
        <BaseCard tone="default">
          <div class="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div class="space-y-3">
              <div class="flex flex-wrap items-center gap-2">
                <h2 class="text-2xl font-semibold text-[var(--p-text)]">
                  {{ requestTitle }}
                </h2>
                <BaseBadge :tone="requestStatusTone(requestStatus)">{{ requestStatusLabel(requestStatus) }}</BaseBadge>
                <BaseBadge v-if="responseRecord" :tone="responseStatusTone(responseStatus)">
                  {{ responseStatusLabel(responseStatus) }}
                </BaseBadge>
              </div>

              <div class="flex flex-wrap gap-4 text-sm text-[var(--p-text-muted)]">
                <span class="inline-flex items-center gap-1.5">
                  <Icon name="lucide:file-text" class="size-4" />
                  Request #{{ requestDetail.id }}
                </span>
                <span v-if="customerName" class="inline-flex items-center gap-1.5">
                  <Icon name="lucide:user" class="size-4" />
                  {{ customerName }}
                </span>
                <span v-if="customerEmail" class="inline-flex items-center gap-1.5">
                  <Icon name="lucide:mail" class="size-4" />
                  {{ customerEmail }}
                </span>
                <span v-if="customerPhone" class="inline-flex items-center gap-1.5">
                  <Icon name="lucide:phone" class="size-4" />
                  {{ customerPhone }}
                </span>
                <span class="inline-flex items-center gap-1.5">
                  <Icon name="lucide:clock-3" class="size-4" />
                  {{ formatDate(requestCreatedAt) }}
                </span>
              </div>

              <p class="max-w-4xl text-sm leading-6 text-[var(--p-text-muted)]">
                {{ briefSummary }}
              </p>
            </div>

            <div class="flex flex-wrap gap-2 xl:justify-end">
              <BaseButton variant="outline" size="sm" @click="load">Refresh</BaseButton>
              <BaseButton
                v-if="responseRecord"
                variant="outline"
                size="sm"
                :to="`/dashboard/shop/requests/${requestId}/quote/${responseRecord.id}`"
              >
                View quote
              </BaseButton>
              <BaseButton
                variant="primary"
                size="sm"
                :disabled="submitting"
                @click="openAction(responseRecord ? 'reply' : 'quote')"
              >
                {{ responseRecord ? 'Reply to client' : 'Send quote' }}
              </BaseButton>
              <BaseButton
                v-if="!responseRecord"
                variant="outline"
                size="sm"
                :disabled="submitting"
                @click="openAction('question')"
              >
                Ask question
              </BaseButton>
              <BaseButton
                v-if="!responseRecord"
                variant="ghost"
                size="sm"
                :disabled="submitting"
                @click="openAction('reject')"
              >
                Cannot fulfill
              </BaseButton>
            </div>
          </div>
        </BaseCard>

        <div class="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div class="space-y-6">
            <BaseCard tone="default">
              <div class="space-y-5">
                <div class="flex items-center gap-2">
                  <Icon name="lucide:clipboard-list" class="size-4 text-[var(--p-primary)]" />
                  <h3 class="text-lg font-semibold text-[var(--p-text)]">Buyer brief</h3>
                </div>

                <div class="grid gap-4 md:grid-cols-2">
                  <div class="rounded-2xl bg-[var(--p-bg-soft)] p-4">
                    <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--p-text-muted)]">Product</p>
                    <p class="mt-2 text-base font-semibold text-[var(--p-text)]">{{ requestTitle }}</p>
                  </div>
                  <div class="rounded-2xl bg-[var(--p-bg-soft)] p-4">
                    <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--p-text-muted)]">Quantity</p>
                    <p class="mt-2 text-base font-semibold text-[var(--p-text)]">{{ quantityLabel }}</p>
                  </div>
                  <div class="rounded-2xl bg-[var(--p-bg-soft)] p-4">
                    <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--p-text-muted)]">Finished size</p>
                    <p class="mt-2 text-base font-semibold text-[var(--p-text)]">{{ sizeLabel }}</p>
                  </div>
                  <div class="rounded-2xl bg-[var(--p-bg-soft)] p-4">
                    <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--p-text-muted)]">Delivery</p>
                    <p class="mt-2 text-base font-semibold text-[var(--p-text)]">{{ deliveryLabel }}</p>
                  </div>
                </div>

                <div v-if="buyerNotes" class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-soft)] p-4">
                  <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--p-text-muted)]">Buyer notes</p>
                  <p class="mt-2 whitespace-pre-wrap text-sm leading-6 text-[var(--p-text)]">{{ buyerNotes }}</p>
                </div>

                <div class="grid gap-4 md:grid-cols-2">
                  <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-soft)] p-4">
                    <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--p-text-muted)]">Finishings</p>
                    <div class="mt-2 flex flex-wrap gap-2">
                      <BaseBadge v-for="item in finishingList" :key="item" tone="info">{{ item }}</BaseBadge>
                      <span v-if="!finishingList.length" class="text-sm text-[var(--p-text-muted)]">No finishing specified</span>
                    </div>
                  </div>

                  <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-soft)] p-4">
                    <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--p-text-muted)]">Artwork / attachments</p>
                    <div class="mt-2 flex flex-wrap gap-2">
                      <BaseBadge v-for="item in attachmentNames" :key="item" tone="neutral">{{ item }}</BaseBadge>
                      <span v-if="!attachmentNames.length" class="text-sm text-[var(--p-text-muted)]">No files attached</span>
                    </div>
                  </div>
                </div>
              </div>
            </BaseCard>

            <BaseCard tone="default">
              <div class="space-y-5">
                <div class="flex items-center gap-2">
                  <Icon name="lucide:messages-square" class="size-4 text-[var(--p-primary)]" />
                  <div>
                    <h3 class="text-lg font-semibold text-[var(--p-text)]">Client response thread</h3>
                    <p class="text-sm text-[var(--p-text-muted)]">Client questions, counteroffers, and your replies stay attached to this request.</p>
                  </div>
                </div>

                <QuoteConversationThread
                  :messages="conversationMessages"
                  empty-message="No follow-up messages yet. When the client replies to your quote, the thread will appear here."
                />
              </div>
            </BaseCard>
          </div>

          <div class="space-y-6">
            <BaseCard tone="default">
              <div class="space-y-5">
                <div class="flex items-center gap-2">
                  <Icon name="lucide:badge-dollar-sign" class="size-4 text-[var(--p-primary)]" />
                  <div>
                    <h3 class="text-lg font-semibold text-[var(--p-text)]">Latest shop response</h3>
                    <p class="text-sm text-[var(--p-text-muted)]">This is the current quote state the client sees.</p>
                  </div>
                </div>

                <div v-if="responseRecord" class="space-y-4">
                  <div class="grid gap-4 sm:grid-cols-2">
                    <div class="rounded-2xl bg-[var(--p-bg-soft)] p-4">
                      <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--p-text-muted)]">Price</p>
                      <p class="mt-2 text-xl font-semibold text-[var(--p-text)]">{{ responsePrice }}</p>
                    </div>
                    <div class="rounded-2xl bg-[var(--p-bg-soft)] p-4">
                      <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--p-text-muted)]">Turnaround</p>
                      <p class="mt-2 text-xl font-semibold text-[var(--p-text)]">{{ responseTurnaround }}</p>
                    </div>
                  </div>

                  <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-soft)] p-4">
                    <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--p-text-muted)]">Quote note</p>
                    <p class="mt-2 whitespace-pre-wrap text-sm leading-6 text-[var(--p-text)]">
                      {{ responseRecord.note || 'No note added to this response.' }}
                    </p>
                  </div>

                  <div v-if="rejectionSummary" class="rounded-2xl border border-[var(--p-error)]/20 bg-[var(--p-error-soft)] p-4">
                    <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--p-error)]">Client rejection</p>
                    <p class="mt-2 text-sm font-medium text-[var(--p-text)]">{{ rejectionSummary }}</p>
                  </div>
                </div>

                <div v-else class="rounded-2xl border border-dashed border-[var(--p-border)] bg-[var(--p-bg-soft)] px-5 py-8 text-center">
                  <p class="text-base font-semibold text-[var(--p-text)]">No quote sent yet.</p>
                  <p class="mt-1 text-sm text-[var(--p-text-muted)]">Use the action button above to send the first quote or ask the buyer a clarifying question.</p>
                </div>
              </div>
            </BaseCard>

            <BaseCard tone="default">
              <div class="space-y-4">
                <h3 class="text-lg font-semibold text-[var(--p-text)]">Quick actions</h3>
                <div class="flex flex-wrap gap-2">
                  <BaseButton variant="outline" size="sm" to="/dashboard/shop/messages">Open messages</BaseButton>
                  <BaseButton variant="outline" size="sm" to="/dashboard/shop/requests">Back to requests</BaseButton>
                  <BaseButton
                    v-if="responseRecord"
                    variant="outline"
                    size="sm"
                    :to="`/dashboard/shop/requests/${requestId}/quote/${responseRecord.id}`"
                  >
                    Open printable quote
                  </BaseButton>
                </div>
              </div>
            </BaseCard>
          </div>
        </div>
      </template>
    </div>

    <div v-if="actionState.open" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6">
      <BaseCard tone="default" class="max-h-[90vh] w-full max-w-3xl overflow-y-auto">
        <form class="space-y-5" @submit.prevent="submitAction">
          <div class="space-y-2">
            <p class="text-lg font-semibold text-[var(--p-text)]">{{ actionConfig.title }}</p>
            <p class="text-sm text-[var(--p-text-muted)]">{{ actionConfig.description }}</p>
          </div>

          <template v-if="actionState.kind === 'quote'">
            <div class="grid gap-4 md:grid-cols-2">
              <BaseInput id="shop-quote-price" v-model="actionState.total" label="Final price" inputmode="decimal" />
              <BaseInput id="shop-quote-turnaround-days" v-model="actionState.turnaroundDays" label="Turnaround days" type="number" inputmode="numeric" />
              <BaseInput id="shop-quote-turnaround-hours" v-model="actionState.turnaroundHours" label="Extra turnaround hours" type="number" inputmode="numeric" />
              <BaseInput id="shop-quote-availability" v-model="actionState.availabilityStatus" label="Availability status" />
            </div>
            <BaseTextarea id="shop-quote-message" v-model="actionState.message" label="Quote note" :rows="5" />
            <div class="grid gap-4 md:grid-cols-2">
              <BaseTextarea id="shop-quote-confirmed" v-model="actionState.confirmedSpecs" label="Confirmed specs" :rows="4" />
              <BaseTextarea id="shop-quote-needs-confirmation" v-model="actionState.needsBuyerConfirmation" label="Needs buyer confirmation" :rows="4" />
            </div>
            <BaseInput id="shop-quote-alternative" v-model="actionState.alternativeSuggestion" label="Alternative suggestion" />
          </template>

          <template v-else-if="actionState.kind === 'reply'">
            <div class="grid gap-4 md:grid-cols-2">
              <BaseInput id="shop-reply-subject" v-model="actionState.subject" label="Subject" />
              <BaseInput id="shop-reply-price" v-model="actionState.total" label="Optional updated price" inputmode="decimal" />
              <BaseInput id="shop-reply-turnaround" v-model="actionState.proposedTurnaround" label="Optional updated turnaround" />
              <BaseInput id="shop-reply-quantity" v-model="actionState.proposedQuantity" label="Optional quantity" inputmode="numeric" />
              <BaseInput id="shop-reply-material" v-model="actionState.proposedMaterial" label="Optional material" />
              <BaseInput id="shop-reply-gsm" v-model="actionState.proposedGsm" label="Optional GSM" />
              <BaseInput id="shop-reply-size" v-model="actionState.proposedSize" label="Optional size" />
            </div>
            <BaseTextarea id="shop-reply-finishing" v-model="actionState.proposedFinishing" label="Optional finishing notes" :rows="3" />
            <BaseTextarea id="shop-reply-message" v-model="actionState.message" label="Reply" :rows="5" />
          </template>

          <template v-else>
            <BaseTextarea
              :id="actionState.kind === 'question' ? 'shop-question-message' : 'shop-reject-message'"
              v-model="actionState.message"
              :label="actionState.kind === 'question' ? 'Question' : 'Reason'"
              :rows="5"
            />
          </template>

          <p v-if="submitError" class="text-sm text-[var(--p-error)]">{{ submitError }}</p>

          <div class="flex justify-end gap-2">
            <BaseButton variant="ghost" size="sm" @click="closeAction">Cancel</BaseButton>
            <BaseButton variant="primary" size="sm" type="submit" :disabled="submitting">{{ actionConfig.submitLabel }}</BaseButton>
          </div>
        </form>
      </BaseCard>
    </div>
  </DashboardShell>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import BaseBadge from '~/components/ui/BaseBadge.vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseCard from '~/components/ui/BaseCard.vue'
import BaseInput from '~/components/ui/BaseInput.vue'
import BaseTextarea from '~/components/ui/BaseTextarea.vue'
import QuoteConversationThread from '~/components/dashboard/shared/QuoteConversationThread.vue'
import ShopSidebarNav from '~/components/dashboard/shop/ShopSidebarNav.vue'
import DashboardShell from '~/components/dashboard/shared/DashboardShell.vue'
import DashboardTopBar from '~/components/dashboard/shared/DashboardTopBar.vue'
import { useIncomingRequests } from '~/composables/useIncomingRequests'
import { usePrintyToast } from '~/composables/usePrintyToast'
import { useQuoteResponseLoopStore } from '~/stores/quoteResponseLoop'
import { useShopStore } from '~/stores/shop'
import { normalizeApiError } from '~/utils/normalizeApiError'
import {
  normalizeQuoteRequestStatus,
  normalizeQuoteResponseStatus,
  quoteRequestStatusLabel,
  quoteResponseStatusLabel,
} from '~/utils/quoteStatus'

definePageMeta({ layout: 'dashboard' })

type ActionKind = 'quote' | 'question' | 'reject' | 'reply'

const route = useRoute()
const toast = usePrintyToast()
const shopStore = useShopStore()
const responseLoopStore = useQuoteResponseLoopStore()
const { shopRequestDetail, loading, submitting } = storeToRefs(responseLoopStore)

const requestId = computed(() => Number(route.params.id))
const requestDetail = computed(() => shopRequestDetail.value)
const responseRecord = computed(() => requestDetail.value?.response ?? null)
const conversationMessages = computed(() => requestDetail.value?.conversation ?? [])

const loadError = ref('')
const submitError = ref('')

const actionState = reactive({
  open: false,
  kind: 'reply' as ActionKind,
  subject: '',
  message: '',
  total: '',
  turnaroundDays: '',
  turnaroundHours: '',
  confirmedSpecs: '',
  needsBuyerConfirmation: '',
  alternativeSuggestion: '',
  availabilityStatus: '',
  proposedTurnaround: '',
  proposedQuantity: '',
  proposedMaterial: '',
  proposedGsm: '',
  proposedSize: '',
  proposedFinishing: '',
})

const requestSnapshot = computed<Record<string, unknown>>(() => asRecord(requestDetail.value?.request_snapshot))
const requestDetails = computed<Record<string, unknown>>(() => asRecord(requestSnapshot.value.request_details))
const calculatorInputs = computed<Record<string, unknown>>(() => asRecord(requestSnapshot.value.calculator_inputs))
const selectedShopPreview = computed<Record<string, unknown>>(() => asRecord(requestSnapshot.value.selected_shop_preview))
const primaryItem = computed<Record<string, unknown>>(() => {
  const items = Array.isArray(requestDetail.value?.items) ? requestDetail.value.items as Record<string, unknown>[] : []
  return items[0] ?? {}
})

const requestStatus = computed(() => String(requestDetail.value?.status || requestDetail.value?.raw_status || 'pending'))
const responseStatus = computed(() => String(responseRecord.value?.status || responseRecord.value?.raw_status || ''))
const requestCreatedAt = computed(() => String(requestDetail.value?.created_at || ''))
const customerName = computed(() => stringValue(requestDetail.value?.customer_name))
const customerEmail = computed(() => stringValue(requestDetail.value?.customer_email))
const customerPhone = computed(() => stringValue(requestDetail.value?.customer_phone))
const requestTitle = computed(() => {
  return titleCase(
    stringValue(calculatorInputs.value.product_type)
    || stringValue(primaryItem.value.product_name)
    || stringValue(primaryItem.value.title)
    || 'Custom print job'
  )
})
const quantityLabel = computed(() => {
  const quantity = numberValue(calculatorInputs.value.quantity) ?? numberValue(primaryItem.value.quantity)
  return quantity ? `${quantity.toLocaleString()} pcs` : 'Quantity not specified'
})
const sizeLabel = computed(() => {
  const itemWidth = numberValue(primaryItem.value.chosen_width_mm)
  const itemHeight = numberValue(primaryItem.value.chosen_height_mm)
  return stringValue(calculatorInputs.value.finished_size)
    || stringValue(calculatorInputs.value.size_label)
    || stringValue(selectedShopPreview.value.size_label)
    || (itemWidth && itemHeight ? `${itemWidth} x ${itemHeight} mm` : 'Size not specified')
})
const deliveryLabel = computed(() => {
  return stringValue(requestDetail.value?.delivery_preference)
    || stringValue(requestDetail.value?.delivery_address)
    || stringValue(requestDetail.value?.delivery_location)
    || 'Delivery details not specified'
})
const buyerNotes = computed(() => stringValue(requestDetail.value?.notes) || stringValue(requestDetails.value.notes))
const briefSummary = computed(() => {
  const parts = [
    requestTitle.value,
    quantityLabel.value !== 'Quantity not specified' ? quantityLabel.value : '',
    sizeLabel.value !== 'Size not specified' ? sizeLabel.value : '',
    stringValue(calculatorInputs.value.paper_stock) ? titleCase(stringValue(calculatorInputs.value.paper_stock)) : '',
  ].filter(Boolean)
  return parts.length ? parts.join(' · ') : 'Open the buyer brief below for the full request details.'
})
const pageTitle = computed(() => `Request #${requestId.value}`)
const responsePrice = computed(() => {
  const currency = stringValue(selectedShopPreview.value.currency) || stringValue(requestDetail.value?.shop_currency) || 'KES'
  const total = responseRecord.value?.total
  if (total == null || total === '') return 'Price not quoted'
  return `${currency} ${Number(total).toLocaleString()}`
})
const responseTurnaround = computed(() => {
  if (!responseRecord.value) return 'Turnaround not specified'
  return responseRecord.value.turnaround_label
    || responseRecord.value.human_ready_text
    || (responseRecord.value.turnaround_days
      ? `${responseRecord.value.turnaround_days} day${responseRecord.value.turnaround_days === 1 ? '' : 's'}`
      : '')
    || 'Turnaround not specified'
})
const rejectionSummary = computed(() => {
  if (!responseRecord.value?.rejection_reason && !responseRecord.value?.rejection_message) return ''
  return [responseRecord.value.rejection_reason, responseRecord.value.rejection_message].filter(Boolean).join(' — ')
})
const finishingList = computed(() => {
  const items = Array.isArray(primaryItem.value.finishings) ? primaryItem.value.finishings as Record<string, unknown>[] : []
  const fromItems = items
    .map(item => titleCase(stringValue(item.finishing_rate_name) || stringValue(item.finishing_rate)))
    .filter(Boolean)

  const fromCalculator = [
    stringValue(calculatorInputs.value.lamination),
    stringValue(calculatorInputs.value.cover_lamination),
    stringValue(calculatorInputs.value.binding_type),
    stringValue(calculatorInputs.value.folding),
    calculatorInputs.value.corner_rounding ? 'Corner rounding' : '',
    stringValue(calculatorInputs.value.cut_type),
  ]
    .filter(Boolean)
    .map(item => titleCase(item))

  return Array.from(new Set([...fromItems, ...fromCalculator]))
})
const attachmentNames = computed(() => {
  const attachments = Array.isArray(requestDetail.value?.attachments) ? requestDetail.value.attachments as Record<string, unknown>[] : []
  return attachments
    .map(item => stringValue(item.original_name) || stringValue(item.name) || stringValue(item.file))
    .filter(Boolean)
})

const actionConfig = computed(() => {
  const config = {
    quote: {
      title: 'Send quote',
      description: 'Submit your first structured quote for this buyer request.',
      submitLabel: 'Send quote',
    },
    question: {
      title: 'Ask buyer a question',
      description: 'Use this when one missing detail blocks production or pricing.',
      submitLabel: 'Send question',
    },
    reject: {
      title: 'Mark cannot fulfill',
      description: 'Tell the buyer clearly why this request cannot be produced by your shop.',
      submitLabel: 'Mark cannot fulfill',
    },
    reply: {
      title: 'Reply to client',
      description: 'Answer the client directly inside this quote thread so the conversation stays attached to the request.',
      submitLabel: 'Send reply',
    },
  } satisfies Record<ActionKind, { title: string; description: string; submitLabel: string }>

  return config[actionState.kind]
})

async function ensureShopContext() {
  const targetSlug = shopStore.selectedShopSlug || shopStore.currentShop?.slug || null
  await shopStore.ensureActiveShop(targetSlug)
}

async function load() {
  loadError.value = ''
  try {
    await ensureShopContext()
    await responseLoopStore.fetchShopRequestDetail(requestId.value)
  } catch (error) {
    loadError.value = normalizeApiError(error, 'Could not load shop request.')
  }
}

function openAction(kind: ActionKind) {
  actionState.open = true
  actionState.kind = kind
  submitError.value = ''
  actionState.subject = ''
  actionState.message = ''
  actionState.total = responseRecord.value?.total != null ? String(responseRecord.value.total) : ''
  actionState.turnaroundDays = responseRecord.value?.turnaround_days != null ? String(responseRecord.value.turnaround_days) : ''
  actionState.turnaroundHours = responseRecord.value?.turnaround_hours != null ? String(responseRecord.value.turnaround_hours) : ''
  actionState.confirmedSpecs = [requestTitle.value, quantityLabel.value, sizeLabel.value, ...finishingList.value].filter(Boolean).join('\n')
  actionState.needsBuyerConfirmation = ''
  actionState.alternativeSuggestion = ''
  actionState.availabilityStatus = 'Ready to produce'
  actionState.proposedTurnaround = responseTurnaround.value !== 'Turnaround not specified' ? responseTurnaround.value : ''
  actionState.proposedQuantity = quantityLabel.value.replace(/[^\d]/g, '')
  actionState.proposedMaterial = stringValue(calculatorInputs.value.paper_stock)
  actionState.proposedGsm = extractGsm(actionState.proposedMaterial)
  actionState.proposedSize = sizeLabel.value !== 'Size not specified' ? sizeLabel.value : ''
  actionState.proposedFinishing = finishingList.value.join(', ')
}

function closeAction() {
  actionState.open = false
  submitError.value = ''
}

function activeIncomingRequests() {
  const slug = shopStore.selectedShopSlug || shopStore.currentShop?.slug
  if (!slug) {
    throw new Error('No active shop selected.')
  }
  return useIncomingRequests(slug)
}

function splitLines(value: string) {
  return value
    .split(/\r?\n|,/)
    .map(item => item.trim())
    .filter(Boolean)
}

async function submitAction() {
  if (!requestDetail.value) return

  try {
    if (actionState.kind === 'quote') {
      const total = numberValue(actionState.total)
      if (total == null) {
        submitError.value = 'Enter a final price before sending the quote.'
        return
      }
      await activeIncomingRequests().sendQuote(requestId.value, {
        status: 'sent',
        total,
        note: actionState.message || undefined,
        turnaround_days: numberValue(actionState.turnaroundDays),
        turnaround_hours: numberValue(actionState.turnaroundHours),
        confirmed_specs: splitLines(actionState.confirmedSpecs),
        needs_buyer_confirmation: splitLines(actionState.needsBuyerConfirmation),
        alternative_suggestion: actionState.alternativeSuggestion || undefined,
        availability_status: actionState.availabilityStatus || undefined,
      })
      toast.success('Quote sent.', undefined, { context: 'quote' })
    } else if (actionState.kind === 'question') {
      if (!actionState.message.trim()) {
        submitError.value = 'Enter the question you want to send.'
        return
      }
      await activeIncomingRequests().askQuestion(requestId.value, { body: actionState.message.trim() })
      toast.success('Question sent to client.', undefined, { context: 'quote' })
    } else if (actionState.kind === 'reject') {
      if (!actionState.message.trim()) {
        submitError.value = 'Enter the reason you cannot fulfill this request.'
        return
      }
      await activeIncomingRequests().rejectRequest(requestId.value, { reason: actionState.message.trim() })
      toast.success('Request marked as cannot fulfill.', undefined, { context: 'quote' })
    } else {
      if (!responseRecord.value) {
        submitError.value = 'A quote response is required before sending a thread reply.'
        return
      }
      if (!actionState.message.trim()) {
        submitError.value = 'Enter the reply you want to send.'
        return
      }
      await responseLoopStore.replyFromShop(responseRecord.value.id, {
        subject: actionState.subject || undefined,
        message: actionState.message.trim(),
        proposed_price: numberValue(actionState.total),
        proposed_turnaround: actionState.proposedTurnaround || undefined,
        proposed_quantity: numberValue(actionState.proposedQuantity),
        proposed_material: actionState.proposedMaterial || undefined,
        proposed_gsm: actionState.proposedGsm || undefined,
        proposed_size: actionState.proposedSize || undefined,
        proposed_finishing: actionState.proposedFinishing || undefined,
      })
      toast.success('Reply sent to client.', undefined, { context: 'quote' })
    }

    closeAction()
    await load()
  } catch (error) {
    submitError.value = normalizeApiError(error, 'Could not complete this action.')
    toast.error('Could not complete action.', submitError.value, { context: 'quote' })
  }
}

function requestStatusLabel(status: string) {
  return quoteRequestStatusLabel(status)
}

function requestStatusTone(status: string) {
  const normalized = normalizeQuoteRequestStatus(status)
  if (normalized === 'accepted' || normalized === 'responded') return 'success'
  if (['rejected', 'cancelled', 'expired'].includes(normalized)) return 'error'
  if (normalized === 'viewed' || normalized === 'sent') return 'info'
  return 'warning'
}

function responseStatusLabel(status: string) {
  return quoteResponseStatusLabel(status)
}

function responseStatusTone(status: string) {
  const normalized = normalizeQuoteResponseStatus(status)
  if (normalized === 'accepted') return 'success'
  if (normalized === 'rejected' || normalized === 'expired') return 'error'
  if (normalized === 'modified') return 'warning'
  return 'primary'
}

function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value || 'Unknown date'
  return date.toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {}
}

function stringValue(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : ''
}

function numberValue(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}

function titleCase(value: string) {
  return value.replace(/[_-]/g, ' ').replace(/\b\w/g, char => char.toUpperCase())
}

function extractGsm(value: string) {
  const match = value.match(/(\d{2,4})\s?gsm/i)
  return match?.[1] ?? ''
}

onMounted(() => {
  void load()
})

watch(requestId, () => {
  void load()
})
</script>
