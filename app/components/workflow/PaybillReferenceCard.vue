<template>
  <article class="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.05)]">
    <p class="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">Payment route</p>
    <h3 class="mt-2 text-base font-semibold text-slate-950">Paybill and reference</h3>

    <div class="mt-5 grid gap-3 md:grid-cols-2">
      <SafePriceBlock label="Reference" :value="referenceValue" caption="Use this reference if you pay outside the STK prompt." />
      <SafePriceBlock label="Channel" :value="channelValue" caption="Printy will confirm once the payment record updates." />
    </div>

    <p class="mt-4 text-sm leading-6 text-slate-500">
      {{ helperText }}
    </p>
  </article>
</template>

<script setup lang="ts">
import type { JobPaymentRecord } from '~/stores/workflowSpine'
import SafePriceBlock from '~/components/workflow/SafePriceBlock.vue'
import { humanizeWorkflowValue } from '~/utils/workflowUi'

const props = defineProps<{
  payments?: JobPaymentRecord[]
}>()

const latestPayment = computed(() => props.payments?.[0] ?? null)
const referenceValue = computed(() => latestPayment.value?.account_reference || latestPayment.value?.external_reference || 'Will appear after payment request')
const channelValue = computed(() => humanizeWorkflowValue(latestPayment.value?.payment_channel || latestPayment.value?.payment_method || 'mpesa'))
const helperText = computed(() =>
  latestPayment.value?.checkout_request_id
    ? 'An STK request has already been created for this job. If it does not arrive, use the reference shown here when Printy support gives you a manual payment route.'
    : 'Once Printy sends an STK request or manual payment route, the account reference will appear here for safer payment confirmation.',
)
</script>
