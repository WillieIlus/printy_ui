<template>
  <article class="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.05)]">
    <div class="flex items-center justify-between gap-3">
      <div>
        <p class="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">Payment confirmation</p>
        <h3 class="mt-2 text-base font-semibold text-slate-950">Payment status</h3>
      </div>
      <PaymentStatusBadge :status="job.payment_status" />
    </div>

    <div class="mt-5 grid gap-3 md:grid-cols-2">
      <SafePriceBlock label="Client total" :value="formatWorkflowMoney(settlement?.client_total)" caption="Your current total for this job." />
      <SafePriceBlock label="Delivery" :value="formatWorkflowMoney(settlement?.delivery_amount)" caption="Delivery charges are shown separately when they apply." />
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
          Request payment confirmation
        </button>
      </div>
      <p v-if="feedback" class="mt-3 text-sm text-slate-500">{{ feedback }}</p>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { JobSettlementRecord, ManagedJobRecord } from '~/stores/workflowSpine'
import PaymentStatusBadge from '~/components/workflow/PaymentStatusBadge.vue'
import SafePriceBlock from '~/components/workflow/SafePriceBlock.vue'
import { formatWorkflowMoney } from '~/utils/workflowUi'

const props = defineProps<{
  job: ManagedJobRecord
  settlement?: JobSettlementRecord | null
  submitting?: boolean
}>()

const emit = defineEmits<{
  (e: 'stk-push', phone: string): void
}>()

const phone = ref('')
const feedback = ref('')

const allowStkPush = computed(() => ['awaiting_payment', 'pending', 'manual_payment_pending'].includes(String(props.job.payment_status ?? '')))
const helperText = computed(() =>
  allowStkPush.value
    ? 'If payment is still pending, you can send an M-Pesa payment request from here.'
    : 'Payment is already confirmed for this job or is being checked by Printy.'
)

function submit() {
  if (!phone.value.trim()) {
    feedback.value = 'Enter the phone number that should receive the M-Pesa request.'
    return
  }
  feedback.value = 'Payment request sent. This page will update when confirmation comes in.'
  emit('stk-push', phone.value.trim())
}
</script>
