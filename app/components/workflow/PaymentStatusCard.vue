<template>
  <article class="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.05)]">
    <div class="flex items-center justify-between gap-3">
      <div>
        <p class="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">Payment confirmation</p>
        <h3 class="mt-2 text-base font-semibold text-slate-950">Payment status</h3>
      </div>
      <PaymentConfirmedBadge :status="job.payment_status || settlement?.status" />
    </div>

    <div class="mt-5 grid gap-3 md:grid-cols-2">
      <SafePriceBlock label="Client total" :value="formatWorkflowMoney(settlement?.client_total)" caption="The client-facing total currently tied to this job." />
      <SafePriceBlock label="Payment method" :value="paymentMethod" caption="How this job is expected to be paid or confirmed." />
    </div>

    <div class="mt-5 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
      <p class="text-sm leading-6 text-slate-500">{{ helperText }}</p>
      <div v-if="allowStkPush" class="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          v-model.trim="phone"
          type="tel"
          class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[var(--p-primary)] focus:ring-4 focus:ring-[var(--p-primary)]/10"
          placeholder="+254..."
        >
        <button
          type="button"
          class="inline-flex items-center justify-center rounded-xl bg-[#101828] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="submitting"
          @click="submit"
        >
          <Icon v-if="submitting" name="lucide:loader-2" class="mr-2 size-4 animate-spin" />
          Send STK prompt
        </button>
      </div>
      <div v-if="allowQuery && latestPayment?.checkout_request_id" class="mt-3">
        <button
          type="button"
          class="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="submitting"
          @click="query"
        >
          Check payment status
        </button>
      </div>
      <p v-if="feedback" class="mt-3 text-sm text-slate-500">{{ feedback }}</p>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { JobPaymentRecord, JobSettlementRecord, ManagedJobRecord } from '~/stores/workflowSpine'
import PaymentConfirmedBadge from '~/components/workflow/PaymentConfirmedBadge.vue'
import SafePriceBlock from '~/components/workflow/SafePriceBlock.vue'
import { formatWorkflowMoney, humanizeWorkflowValue } from '~/utils/workflowUi'

const props = defineProps<{
  job: ManagedJobRecord
  settlement?: JobSettlementRecord | null
  payments?: JobPaymentRecord[]
  submitting?: boolean
}>()

const emit = defineEmits<{
  (e: 'stk-push', phone: string): void
  (e: 'query', checkoutRequestId: string): void
}>()

const phone = ref('')
const feedback = ref('')

const latestPayment = computed(() => props.payments?.[0] ?? null)
const allowStkPush = computed(() => ['awaiting_payment', 'pending', 'manual_payment_pending'].includes(String(props.job.payment_status ?? '')))
const allowQuery = computed(() => ['pending', 'stk_sent', 'awaiting_payment'].includes(String(latestPayment.value?.payment_status ?? props.job.payment_status ?? '')))
const paymentMethod = computed(() => humanizeWorkflowValue(props.settlement?.payment_method || latestPayment.value?.payment_method || props.job.payment_method || 'mpesa'))
const helperText = computed(() => {
  if (latestPayment.value?.payment_status === 'stk_sent') {
    return 'An STK prompt has already been sent. Use the check button if the confirmation has not appeared yet.'
  }
  if (allowStkPush.value) {
    return 'Send an M-Pesa STK prompt when the client is ready to confirm payment.'
  }
  if (props.settlement?.release_ready_at) {
    return 'Payment is confirmed and settlement is ready inside the managed workflow.'
  }
  return 'Payment is already confirmed or Printy is checking the latest update.'
})

function submit() {
  if (!phone.value.trim()) {
    feedback.value = 'Enter the phone number that should receive the M-Pesa request.'
    return
  }
  feedback.value = 'STK prompt sent. The page will update when payment confirmation is returned.'
  emit('stk-push', phone.value.trim())
}

function query() {
  if (!latestPayment.value?.checkout_request_id) return
  feedback.value = 'Checking the latest payment status...'
  emit('query', latestPayment.value.checkout_request_id)
}
</script>
