<template>
  <DashboardShell sidebar-tone="light">
    <template #sidebar>
      <ClientSidebarNav />
    </template>

    <div class="space-y-6">
      <DashboardTopBar
        eyebrow="Client"
        title="Responses"
        description="Review all shop responses across your requests, then accept, reject, or continue the conversation."
      />

      <BaseCard v-if="loading && !responses.length" tone="default">
        <div class="flex items-center gap-2 text-sm text-[var(--p-text-muted)]">
          <Icon name="lucide:loader-2" class="size-4 animate-spin" />
          Loading responses...
        </div>
      </BaseCard>

      <BaseCard v-else-if="loadError" tone="default">
        <div class="space-y-4">
          <p class="text-base font-semibold text-[var(--p-text)]">We couldn't load your responses.</p>
          <p class="text-sm text-[var(--p-text-muted)]">{{ loadError }}</p>
          <BaseButton variant="outline" size="sm" @click="load">Try again</BaseButton>
        </div>
      </BaseCard>

      <div v-else-if="responses.length" class="space-y-4">
        <BaseCard v-for="response in responses" :key="response.id" tone="default">
          <div class="space-y-4">
            <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div class="space-y-2">
                <div class="flex flex-wrap items-center gap-2">
                  <h2 class="text-lg font-semibold text-[var(--p-text)]">Request #{{ response.request_id || response.quote_request }}</h2>
                  <BaseBadge :tone="responseStatusTone(response.status || response.raw_status || '')">
                    {{ responseStatusLabel(response.status || response.raw_status || '') }}
                  </BaseBadge>
                </div>
                <div class="flex flex-wrap gap-4 text-sm text-[var(--p-text-muted)]">
                  <span>{{ response.shop_name || 'Shop response' }}</span>
                  <span>{{ responsePrice(response) }}</span>
                  <span>{{ responseTurnaround(response) }}</span>
                </div>
                <p class="text-sm text-[var(--p-text-muted)]">
                  {{ response.latest_message || response.note || 'Open the request to review the full conversation.' }}
                </p>
                <p class="text-xs text-[var(--p-text-muted)]">
                  Unread: {{ response.unread_count ?? 0 }}
                </p>
              </div>

              <div class="flex flex-wrap gap-2">
                <BaseButton
                  variant="outline"
                  size="sm"
                  :to="`/dashboard/client/requests/${response.request_id || response.quote_request}`"
                >
                  View request
                </BaseButton>
                <BaseButton
                  v-if="canActOnResponse(response)"
                  variant="primary"
                  size="sm"
                  :disabled="submitting"
                  @click="openAccept(response)"
                >
                  Accept
                </BaseButton>
                <BaseButton
                  v-if="canActOnResponse(response)"
                  variant="outline"
                  size="sm"
                  :disabled="submitting"
                  @click="openReject(response)"
                >
                  Reject
                </BaseButton>
                <BaseButton
                  v-if="canReplyToResponse(response)"
                  variant="outline"
                  size="sm"
                  :disabled="submitting"
                  @click="openReply(response)"
                >
                  Respond
                </BaseButton>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>

      <BaseCard v-else tone="default">
        <div class="rounded-2xl border border-dashed border-[var(--p-border)] bg-[var(--p-bg-soft)] px-5 py-10 text-center">
          <p class="text-lg font-semibold text-[var(--p-text)]">No shop responses yet.</p>
          <p class="mt-1 text-sm text-[var(--p-text-muted)]">When shops respond to your requests, they will appear here.</p>
        </div>
      </BaseCard>
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
            <BaseButton variant="primary" size="sm" :disabled="submitting" @click="confirmAccept">Confirm accept</BaseButton>
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
          <BaseSelect id="reject-reason-list" v-model="rejectState.reason" label="Reason" :options="rejectReasons" />
          <BaseTextarea id="reject-message-list" v-model="rejectState.message" label="Optional message" :rows="4" />
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
            <p class="text-sm text-[var(--p-text-muted)]">Send a question, counter offer, or change request.</p>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <BaseSelect id="reply-type-list" v-model="replyState.messageType" label="Response type" :options="replyTypeOptions" />
            <BaseInput id="reply-subject-list" v-model="replyState.subject" label="Subject / title" />
          </div>

          <BaseTextarea id="reply-message-list" v-model="replyState.message" label="Message" :rows="5" />

          <div class="grid gap-4 md:grid-cols-2">
            <BaseInput id="reply-price-list" v-model="replyState.proposedPrice" label="Proposed price" inputmode="decimal" />
            <BaseInput id="reply-turnaround-list" v-model="replyState.proposedTurnaround" label="Proposed turnaround" />
            <BaseInput id="reply-quantity-list" v-model="replyState.proposedQuantity" label="Proposed quantity" inputmode="numeric" />
            <BaseInput id="reply-material-list" v-model="replyState.proposedMaterial" label="Proposed material" />
            <BaseInput id="reply-gsm-list" v-model="replyState.proposedGsm" label="Proposed GSM" />
            <BaseInput id="reply-size-list" v-model="replyState.proposedSize" label="Proposed size" />
            <BaseTextarea id="reply-finishing-list" v-model="replyState.proposedFinishing" label="Proposed finishing notes" :rows="3" class="md:col-span-2" />
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
import DashboardShell from '~/components/dashboard/shared/DashboardShell.vue'
import DashboardTopBar from '~/components/dashboard/shared/DashboardTopBar.vue'
import { usePrintyToast } from '~/composables/usePrintyToast'
import { useQuoteResponseLoopStore, type QuoteResponseRecord } from '~/stores/quoteResponseLoop'
import { normalizeApiError } from '~/utils/normalizeApiError'
import { normalizeQuoteResponseStatus, quoteResponseStatusLabel } from '~/utils/quoteStatus'

definePageMeta({ layout: 'dashboard' })

const toast = usePrintyToast()
const store = useQuoteResponseLoopStore()
const { responses, loading, submitting } = storeToRefs(store)

const loadError = ref('')
const submitError = ref('')

const acceptState = reactive<{ open: boolean; response: QuoteResponseRecord | null }>({ open: false, response: null })
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

async function load() {
  loadError.value = ''
  try {
    await store.fetchClientResponses()
  } catch (error) {
    loadError.value = normalizeApiError(error, 'Could not load responses.')
  }
}

function responsePrice(response: QuoteResponseRecord) {
  const currency = response.shop_currency || 'KES'
  if (response.total == null || response.total === '') return 'Price on request'
  return `${currency} ${Number(response.total).toLocaleString()}`
}

function responseTurnaround(response: QuoteResponseRecord) {
  return response.turnaround_label
    || response.human_ready_text
    || (response.turnaround_days ? `${response.turnaround_days} day${response.turnaround_days === 1 ? '' : 's'}` : '')
    || 'Turnaround not specified'
}

function canActOnResponse(response: QuoteResponseRecord) {
  return !['accepted', 'rejected', 'expired'].includes(normalizeQuoteResponseStatus(response.status || response.raw_status || ''))
}

function canReplyToResponse(response: QuoteResponseRecord) {
  return !['accepted', 'expired'].includes(normalizeQuoteResponseStatus(response.status || response.raw_status || ''))
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

function openAccept(response: QuoteResponseRecord) {
  acceptState.open = true
  acceptState.response = response
}

function openReject(response: QuoteResponseRecord) {
  rejectState.open = true
  rejectState.response = response
  rejectState.reason = 'Price is too high'
  rejectState.message = ''
}

function openReply(response: QuoteResponseRecord) {
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

async function confirmAccept() {
  if (!acceptState.response) return
  try {
    await store.acceptQuoteResponse(acceptState.response.id)
    toast.success('Quote accepted.', undefined, { context: 'quote' })
    closeModals()
    await load()
  } catch (error) {
    submitError.value = normalizeApiError(error, 'Could not accept quote.')
    toast.error('Could not accept quote.', submitError.value, { context: 'quote' })
  }
}

async function submitReject() {
  if (!rejectState.response) return
  try {
    await store.rejectQuoteResponse(rejectState.response.id, {
      reason: rejectState.reason,
      message: rejectState.message || undefined,
    })
    toast.success('Quote rejected.', undefined, { context: 'quote' })
    closeModals()
    await load()
  } catch (error) {
    submitError.value = normalizeApiError(error, 'Could not reject quote.')
    toast.error('Could not reject quote.', submitError.value, { context: 'quote' })
  }
}

async function submitReply() {
  if (!replyState.response) return
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
    await load()
  } catch (error) {
    submitError.value = normalizeApiError(error, 'Could not send reply.')
    toast.error('Could not send reply.', submitError.value, { context: 'quote' })
  }
}

onMounted(() => {
  void load()
})
</script>
