<template>
  <DashboardShell sidebar-tone="light">
    <template #sidebar>
      <ClientSidebarNav />
    </template>

    <div class="space-y-6">
      <NuxtLink
        to="/dashboard/client/requests"
        class="inline-flex items-center gap-2 text-sm font-medium text-[var(--p-text-muted)] transition hover:text-[var(--p-text)]"
      >
        <Icon name="lucide:arrow-left" class="size-4" />
        Back to My Requests
      </NuxtLink>

      <BaseCard v-if="loading && !requestDetail" tone="default">
        <div class="flex items-center gap-2 text-sm text-[var(--p-text-muted)]">
          <Icon name="lucide:loader-2" class="size-4 animate-spin" />
          Loading request detail...
        </div>
      </BaseCard>

      <BaseCard v-else-if="errorState" tone="default">
        <div class="space-y-4">
          <div class="flex items-start gap-3">
            <Icon name="lucide:triangle-alert" class="mt-0.5 size-5 text-[var(--p-warning)]" />
            <div>
              <p class="text-base font-semibold text-[var(--p-text)]">We couldn't load this request.</p>
              <p class="mt-1 text-sm text-[var(--p-text-muted)]">{{ errorState }}</p>
            </div>
          </div>
          <BaseButton variant="outline" size="sm" @click="loadRequest">Try again</BaseButton>
        </div>
      </BaseCard>

      <template v-else-if="requestDetail">
        <BaseCard tone="default">
          <div class="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div class="space-y-3">
              <p class="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--p-secondary)]">Client request</p>
              <div class="flex flex-wrap items-center gap-3">
                <h1 class="text-2xl font-semibold tracking-tight text-[var(--p-text)]">
                  Request #{{ requestDetail.id }}
                </h1>
                <BaseBadge :tone="requestStatusTone">{{ requestStatusLabel }}</BaseBadge>
              </div>
              <div class="flex flex-wrap gap-4 text-sm text-[var(--p-text-muted)]">
                <span class="inline-flex items-center gap-1.5">
                  <Icon name="lucide:calendar" class="size-4" />
                  {{ createdAtLabel }}
                </span>
                <span v-if="requestReference" class="inline-flex items-center gap-1.5">
                  <Icon name="lucide:hash" class="size-4" />
                  {{ requestReference }}
                </span>
              </div>
            </div>
            <BaseButton variant="outline" size="sm" @click="loadRequest">Refresh</BaseButton>
          </div>
        </BaseCard>

        <DashboardSectionCard title="Job Brief">
          <div class="grid gap-4 md:grid-cols-2">
            <div
              v-for="row in jobBriefRows"
              :key="row.label"
              class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-bg-soft)] px-4 py-3"
            >
              <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--p-text-muted)]">{{ row.label }}</p>
              <p class="mt-1 text-sm font-medium text-[var(--p-text)]">{{ row.value }}</p>
            </div>
          </div>

          <div v-if="artworkFiles.length" class="mt-5 space-y-2">
            <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--p-text-muted)]">Artwork / files</p>
            <div class="flex flex-wrap gap-2">
              <BaseBadge v-for="file in artworkFiles" :key="file.key" tone="neutral">{{ file.label }}</BaseBadge>
            </div>
          </div>
        </DashboardSectionCard>

        <DashboardSectionCard title="Shop Responses">
          <template v-if="responses.length">
            <div class="space-y-5">
              <BaseCard
                v-for="response in responses"
                :key="response.id"
                tone="muted"
                class="!p-5"
              >
                <div class="space-y-5">
                  <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div class="space-y-3">
                      <div class="flex flex-wrap items-center gap-2">
                        <h2 class="text-lg font-semibold text-[var(--p-text)]">{{ response.shop_name || 'Shop response' }}</h2>
                        <BaseBadge :tone="responseStatusTone(response.status || response.raw_status || '')">
                          {{ responseStatusLabel(response.status || response.raw_status || '') }}
                        </BaseBadge>
                      </div>
                      <div class="flex flex-wrap gap-4 text-sm text-[var(--p-text-muted)]">
                        <span>Price: {{ responsePrice(response) }}</span>
                        <span>Turnaround: {{ responseTurnaround(response) }}</span>
                        <span v-if="response.created_at">Created: {{ formatDate(response.created_at) }}</span>
                      </div>
                    </div>

                    <div class="flex flex-wrap gap-2">
                      <BaseButton variant="outline" size="sm" :to="`/dashboard/client/requests/${requestDetail.id}/quote/${response.id}`">
                        View quote
                      </BaseButton>
                      <BaseButton
                        v-if="canActOnResponse(response)"
                        variant="primary"
                        size="sm"
                        :disabled="submitting"
                        @click="openAcceptModal(response)"
                      >
                        Accept quote
                      </BaseButton>
                      <BaseButton
                        v-if="canActOnResponse(response)"
                        variant="outline"
                        size="sm"
                        :disabled="submitting"
                        @click="openRejectModal(response)"
                      >
                        Reject quote
                      </BaseButton>
                      <BaseButton
                        v-if="canReplyToResponse(response)"
                        variant="outline"
                        size="sm"
                        :disabled="submitting"
                        @click="openReplyModal(response)"
                      >
                        Respond / Ask question
                      </BaseButton>
                    </div>
                  </div>

                  <div class="grid gap-4 md:grid-cols-2">
                    <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] px-4 py-3">
                      <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--p-text-muted)]">Message / remarks</p>
                      <p class="mt-1 text-sm text-[var(--p-text-muted)]">{{ response.note || response.response_snapshot?.shop_note || 'No remarks added.' }}</p>
                    </div>
                    <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] px-4 py-3">
                      <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--p-text-muted)]">Terms</p>
                      <p class="mt-1 text-sm text-[var(--p-text-muted)]">{{ responseTerms(response) }}</p>
                    </div>
                  </div>

                  <div class="space-y-3">
                    <div class="flex items-center justify-between gap-3">
                      <h3 class="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--p-text)]">Conversation</h3>
                    </div>
                    <QuoteConversationThread
                      :messages="response.conversation || []"
                      empty-message="No follow-up messages on this quote yet."
                    />
                  </div>
                </div>
              </BaseCard>
            </div>
          </template>

          <div
            v-else
            class="rounded-2xl border border-dashed border-[var(--p-border)] bg-[var(--p-bg-soft)] px-5 py-8 text-center"
          >
            <p class="text-base font-semibold text-[var(--p-text)]">Waiting for shop replies.</p>
            <p class="mt-1 text-sm text-[var(--p-text-muted)]">Quotes will appear here as shops respond.</p>
          </div>
        </DashboardSectionCard>
      </template>
    </div>

    <div v-if="acceptState.open && acceptState.response" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
      <BaseCard tone="default" class="w-full max-w-lg">
        <div class="space-y-5">
          <div class="space-y-2">
            <p class="text-lg font-semibold text-[var(--p-text)]">Accept quote</p>
            <p class="text-sm text-[var(--p-text-muted)]">
              Accept this quote from {{ acceptState.response.shop_name || 'this shop' }} for {{ responsePrice(acceptState.response) }}?
            </p>
          </div>
          <div class="flex justify-end gap-2">
            <BaseButton variant="ghost" size="sm" @click="closeModals">Cancel</BaseButton>
            <BaseButton variant="primary" size="sm" :disabled="submitting" @click="confirmAccept">
              Confirm accept
            </BaseButton>
          </div>
        </div>
      </BaseCard>
    </div>

    <div v-if="rejectState.open && rejectState.response" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
      <BaseCard tone="default" class="w-full max-w-xl">
        <form class="space-y-5" @submit.prevent="submitReject">
          <div class="space-y-2">
            <p class="text-lg font-semibold text-[var(--p-text)]">Reject quote</p>
            <p class="text-sm text-[var(--p-text-muted)]">Tell the shop why you are rejecting this quote.</p>
          </div>

          <BaseSelect
            id="reject-reason"
            v-model="rejectState.reason"
            label="Reason"
            :options="rejectReasons"
          />

          <BaseTextarea
            id="reject-message"
            v-model="rejectState.message"
            label="Optional message"
            :rows="4"
            placeholder="Thank you, but I have chosen another option."
          />

          <p v-if="submitError" class="text-sm text-[var(--p-error)]">{{ submitError }}</p>

          <div class="flex justify-end gap-2">
            <BaseButton variant="ghost" size="sm" @click="closeModals">Cancel</BaseButton>
            <BaseButton variant="primary" size="sm" type="submit" :disabled="submitting">Reject quote</BaseButton>
          </div>
        </form>
      </BaseCard>
    </div>

    <div v-if="replyState.open && replyState.response" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6">
      <BaseCard tone="default" class="max-h-[90vh] w-full max-w-3xl overflow-y-auto">
        <form class="space-y-5" @submit.prevent="submitReply">
          <div class="space-y-2">
            <p class="text-lg font-semibold text-[var(--p-text)]">Respond to {{ replyState.response.shop_name || 'shop' }}</p>
            <p class="text-sm text-[var(--p-text-muted)]">Send a question, counter offer, change request, or artwork update.</p>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <BaseSelect
              id="reply-type"
              v-model="replyState.messageType"
              label="Response type"
              :options="replyTypeOptions"
            />
            <BaseInput
              id="reply-subject"
              v-model="replyState.subject"
              label="Subject / title"
              placeholder="Can you adjust this quote?"
            />
          </div>

          <BaseTextarea
            id="reply-message"
            v-model="replyState.message"
            label="Message"
            :rows="5"
            placeholder="Can you do KES 2,200 and deliver tomorrow?"
          />

          <details class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-bg-soft)] p-4" open>
            <summary class="cursor-pointer text-sm font-semibold text-[var(--p-text)]">Optional proposed changes</summary>
            <div class="mt-4 grid gap-4 md:grid-cols-2">
              <BaseInput id="reply-price" v-model="replyState.proposedPrice" label="Proposed price" inputmode="decimal" placeholder="2200" />
              <BaseInput id="reply-turnaround" v-model="replyState.proposedTurnaround" label="Proposed turnaround" placeholder="Tomorrow" />
              <BaseInput id="reply-quantity" v-model="replyState.proposedQuantity" label="Proposed quantity" inputmode="numeric" placeholder="500" />
              <BaseInput id="reply-material" v-model="replyState.proposedMaterial" label="Proposed material" placeholder="Matt" />
              <BaseInput id="reply-gsm" v-model="replyState.proposedGsm" label="Proposed GSM" placeholder="300" />
              <BaseInput id="reply-size" v-model="replyState.proposedSize" label="Proposed size" placeholder="90 x 50mm" />
              <BaseTextarea
                id="reply-finishing"
                v-model="replyState.proposedFinishing"
                label="Proposed finishing notes"
                :rows="3"
                placeholder="Lamination both sides"
                class="md:col-span-2"
              />
            </div>
          </details>

          <div class="rounded-2xl border border-dashed border-[var(--p-border)] bg-[var(--p-bg-soft)] px-4 py-3 text-sm text-[var(--p-text-muted)]">
            File / artwork update uploads are not supported by this reply endpoint yet. Use the files area for attachments, then mention the update here.
          </div>

          <p v-if="submitError" class="text-sm text-[var(--p-error)]">{{ submitError }}</p>

          <div class="flex justify-end gap-2">
            <BaseButton variant="ghost" size="sm" @click="closeModals">Cancel</BaseButton>
            <BaseButton variant="primary" size="sm" type="submit" :disabled="submitting">Send reply</BaseButton>
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
import BaseSelect from '~/components/ui/BaseSelect.vue'
import BaseTextarea from '~/components/ui/BaseTextarea.vue'
import ClientSidebarNav from '~/components/dashboard/client/ClientSidebarNav.vue'
import DashboardSectionCard from '~/components/dashboard/shared/DashboardSectionCard.vue'
import DashboardShell from '~/components/dashboard/shared/DashboardShell.vue'
import QuoteConversationThread from '~/components/dashboard/shared/QuoteConversationThread.vue'
import { usePrintyToast } from '~/composables/usePrintyToast'
import {
  useQuoteResponseLoopStore,
  type QuoteRequestDetailRecord,
  type QuoteResponseRecord,
} from '~/stores/quoteResponseLoop'
import { normalizeApiError } from '~/utils/normalizeApiError'
import { normalizeQuoteRequestStatus, normalizeQuoteResponseStatus, quoteRequestStatusLabel, quoteResponseStatusLabel } from '~/utils/quoteStatus'

definePageMeta({ layout: 'dashboard' })

const route = useRoute()
const toast = usePrintyToast()
const store = useQuoteResponseLoopStore()
const { requestDetail, loading, submitting } = storeToRefs(store)

const requestId = computed(() => Number(route.params.id))
const errorState = ref('')
const submitError = ref('')

const acceptState = reactive<{ open: boolean; response: QuoteResponseRecord | null }>({
  open: false,
  response: null,
})

const rejectState = reactive({
  open: false,
  response: null as QuoteResponseRecord | null,
  reason: 'Price is too high',
  message: '',
})

const replyState = reactive({
  open: false,
  response: null as QuoteResponseRecord | null,
  messageType: 'client_question',
  subject: '',
  message: '',
  proposedPrice: '',
  proposedTurnaround: '',
  proposedQuantity: '',
  proposedMaterial: '',
  proposedGsm: '',
  proposedSize: '',
  proposedFinishing: '',
})

const rejectReasons = [
  { label: 'Price is too high', value: 'Price is too high' },
  { label: 'Turnaround is too long', value: 'Turnaround is too long' },
  { label: 'Specifications changed', value: 'Specifications changed' },
  { label: 'Chose another shop', value: 'Chose another shop' },
  { label: 'No longer needed', value: 'No longer needed' },
  { label: 'Other', value: 'Other' },
]

const replyTypeOptions = [
  { label: 'Ask a question', value: 'client_question' },
  { label: 'Counter offer', value: 'client_counter_offer' },
  { label: 'Change request', value: 'client_change_request' },
  { label: 'File / artwork update', value: 'client_file_update' },
  { label: 'Other', value: 'client_question' },
]

const responses = computed(() => {
  const detail = requestDetail.value as QuoteRequestDetailRecord | null
  if (!detail) return []
  const raw = Array.isArray(detail.responses) ? detail.responses : (Array.isArray(detail.sibling_responses) ? detail.sibling_responses : [])
  return raw
})

const detailRecord = computed<QuoteRequestDetailRecord | null>(() => requestDetail.value as QuoteRequestDetailRecord | null)

const requestReference = computed(() => stringField(requestDetail.value, 'request_reference'))
const createdAtLabel = computed(() => formatDate(stringField(requestDetail.value, 'created_at')))
const requestStatus = computed(() => normalizeQuoteRequestStatus(stringField(requestDetail.value, 'status')))
const requestStatusLabel = computed(() => quoteRequestStatusLabel(requestStatus.value))
const requestStatusTone = computed(() => {
  if (requestStatus.value === 'accepted') return 'success'
  if (['rejected', 'expired', 'cancelled'].includes(requestStatus.value)) return 'error'
  if (requestStatus.value === 'needs_confirmation') return 'warning'
  return 'primary'
})

const primaryItem = computed<Record<string, unknown> | null>(() => {
  const items = detailRecord.value?.items
  return Array.isArray(items) && items.length ? items[0] as Record<string, unknown> : null
})

const jobBriefRows = computed(() => {
  const detail = detailRecord.value ?? {} as QuoteRequestDetailRecord
  const item = primaryItem.value ?? {}
  const snapshot = (detail.request_snapshot ?? {}) as Record<string, unknown>
  const calculatorInputs = (snapshot.calculator_inputs ?? {}) as Record<string, unknown>
  const finishings = Array.isArray(item.finishings)
    ? item.finishings.map((entry: Record<string, unknown>) => stringField(entry, 'finishing_rate_name')).filter(Boolean).join(', ')
    : ''

  return [
    { label: 'Product / service', value: stringField(item, 'product_name') || stringField(item, 'title') || titleCase(stringField(calculatorInputs, 'product_type')) || 'Not specified' },
    { label: 'Quantity', value: numberOrBlank(item.quantity ?? calculatorInputs.quantity) || 'Not specified' },
    { label: 'Size / dimensions', value: sizeLabel(item, calculatorInputs) },
    { label: 'Paper / material', value: stringField(item, 'paper_label') || stringField(calculatorInputs, 'paper_stock') || stringField(calculatorInputs, 'material_type') || 'Not specified' },
    { label: 'GSM', value: stringField(calculatorInputs, 'requested_gsm') || extractGsm(stringField(item, 'paper_label')) || 'Not specified' },
    { label: 'Color mode', value: stringField(item, 'color_mode') || stringField(calculatorInputs, 'color_mode') || 'Not specified' },
    { label: 'Print sides', value: stringField(item, 'sides') || stringField(calculatorInputs, 'print_sides') || 'Not specified' },
    { label: 'Finishing', value: finishings || stringField(calculatorInputs, 'lamination') || 'Not specified' },
    { label: 'Notes / brief', value: stringField(item, 'special_instructions') || stringField(detail, 'notes') || 'No additional notes.' },
  ]
})

const artworkFiles = computed(() => {
  const detail = detailRecord.value ?? {} as QuoteRequestDetailRecord
  const attachments = Array.isArray(detail.attachments) ? detail.attachments : []
  return attachments.map((file: Record<string, unknown>, index: number) => ({
    key: `${index}-${stringField(file, 'name') || stringField(file, 'file')}`,
    label: stringField(file, 'name') || stringField(file, 'file'),
  }))
})

function responsePrice(response: QuoteResponseRecord) {
  const currency = response.shop_currency || stringField(response.response_snapshot, 'currency') || 'KES'
  const total = response.total
  if (total == null || total === '') return 'Price on request'
  return `${currency} ${Number(total).toLocaleString()}`
}

function responseTurnaround(response: QuoteResponseRecord) {
  return response.turnaround_label
    || response.human_ready_text
    || (response.turnaround_days ? `${response.turnaround_days} day${response.turnaround_days === 1 ? '' : 's'}` : '')
    || 'Turnaround not specified'
}

function responseTerms(response: QuoteResponseRecord) {
  return stringField(response.response_snapshot, 'terms')
    || stringField(response.response_snapshot, 'payment_terms')
    || 'No terms added.'
}

function canActOnResponse(response: QuoteResponseRecord) {
  const status = normalizeQuoteResponseStatus(response.status || response.raw_status || '')
  return !['accepted', 'rejected', 'expired'].includes(status) && requestStatus.value !== 'accepted'
}

function canReplyToResponse(response: QuoteResponseRecord) {
  const status = normalizeQuoteResponseStatus(response.status || response.raw_status || '')
  return !['accepted', 'expired'].includes(status)
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

function openAcceptModal(response: QuoteResponseRecord) {
  acceptState.open = true
  acceptState.response = response
  submitError.value = ''
}

function openRejectModal(response: QuoteResponseRecord) {
  rejectState.open = true
  rejectState.response = response
  rejectState.reason = 'Price is too high'
  rejectState.message = ''
  submitError.value = ''
}

function openReplyModal(response: QuoteResponseRecord) {
  replyState.open = true
  replyState.response = response
  replyState.messageType = 'client_question'
  replyState.subject = ''
  replyState.message = ''
  replyState.proposedPrice = ''
  replyState.proposedTurnaround = ''
  replyState.proposedQuantity = ''
  replyState.proposedMaterial = ''
  replyState.proposedGsm = ''
  replyState.proposedSize = ''
  replyState.proposedFinishing = ''
  submitError.value = ''
}

function closeModals() {
  acceptState.open = false
  acceptState.response = null
  rejectState.open = false
  rejectState.response = null
  replyState.open = false
  replyState.response = null
  submitError.value = ''
}

async function loadRequest() {
  errorState.value = ''
  try {
    await store.fetchClientRequestDetail(requestId.value)
  } catch (error) {
    errorState.value = normalizeApiError(error, 'Could not load request.')
  }
}

async function confirmAccept() {
  if (!acceptState.response) return
  submitError.value = ''
  try {
    await store.acceptQuoteResponse(acceptState.response.id)
    toast.success('Quote accepted.', undefined, { context: 'quote' })
    closeModals()
    await loadRequest()
  } catch (error) {
    submitError.value = normalizeApiError(error, 'Could not accept quote.')
    toast.error('Could not accept quote.', submitError.value, { context: 'quote' })
  }
}

async function submitReject() {
  if (!rejectState.response) return
  submitError.value = ''
  try {
    await store.rejectQuoteResponse(rejectState.response.id, {
      reason: rejectState.reason,
      message: rejectState.message || undefined,
    })
    toast.success('Quote rejected.', undefined, { context: 'quote' })
    closeModals()
    await loadRequest()
  } catch (error) {
    submitError.value = normalizeApiError(error, 'Could not reject quote.')
    toast.error('Could not reject quote.', submitError.value, { context: 'quote' })
  }
}

async function submitReply() {
  if (!replyState.response) return
  submitError.value = ''
  try {
    await store.replyToQuoteResponse(replyState.response.id, {
      message_type: replyState.messageType,
      subject: replyState.subject || undefined,
      message: replyState.message,
      proposed_price: replyState.proposedPrice ? Number(replyState.proposedPrice) : null,
      proposed_turnaround: replyState.proposedTurnaround || undefined,
      proposed_quantity: replyState.proposedQuantity ? Number(replyState.proposedQuantity) : null,
      proposed_material: replyState.proposedMaterial || undefined,
      proposed_gsm: replyState.proposedGsm || undefined,
      proposed_size: replyState.proposedSize || undefined,
      proposed_finishing: replyState.proposedFinishing || undefined,
    })
    toast.success('Reply sent to shop.', undefined, { context: 'quote' })
    closeModals()
    await loadRequest()
  } catch (error) {
    submitError.value = normalizeApiError(error, 'Could not send reply.')
    toast.error('Could not send reply.', submitError.value, { context: 'quote' })
  }
}

function stringField(source: unknown, key: string) {
  if (!source || typeof source !== 'object') return ''
  const value = (source as Record<string, unknown>)[key]
  return typeof value === 'string' ? value : (value != null ? String(value) : '')
}

function numberOrBlank(value: unknown) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed.toLocaleString() : ''
}

function titleCase(value: string) {
  return value.replace(/[_-]/g, ' ').replace(/\b\w/g, char => char.toUpperCase())
}

function sizeLabel(item: Record<string, unknown>, calculatorInputs: Record<string, unknown>) {
  if (item.chosen_width_mm && item.chosen_height_mm) {
    return `${item.chosen_width_mm} x ${item.chosen_height_mm} mm`
  }
  return stringField(calculatorInputs, 'finished_size') || 'Not specified'
}

function extractGsm(value: string) {
  const match = value.match(/(\d+)\s?gsm/i)
  return match?.[1] ? `${match[1]}` : ''
}

function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value || 'Unknown'
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

watch(requestId, () => {
  void loadRequest()
}, { immediate: true })
</script>
