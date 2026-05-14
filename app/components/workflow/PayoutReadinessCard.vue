<template>
  <article class="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.05)]">
    <div class="flex items-center justify-between gap-3">
      <div>
        <p class="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">{{ eyebrow }}</p>
        <h3 class="mt-2 text-base font-semibold text-slate-950">{{ title }}</h3>
      </div>
      <PaymentConfirmedBadge :status="badgeStatus" />
    </div>

    <div class="mt-5 grid gap-3 md:grid-cols-2">
      <SafePriceBlock :label="primaryLabel" :value="primaryValue" :caption="primaryCaption" />
      <SafePriceBlock label="Release timing" :value="releaseValue" caption="Completion-based release stays inside the managed workflow." />
    </div>
  </article>
</template>

<script setup lang="ts">
import type { JobSettlementRecord } from '~/stores/workflowSpine'
import PaymentConfirmedBadge from '~/components/workflow/PaymentConfirmedBadge.vue'
import SafePriceBlock from '~/components/workflow/SafePriceBlock.vue'
import { formatWorkflowDate, formatWorkflowMoney } from '~/utils/workflowUi'

const props = withDefaults(defineProps<{
  settlement?: JobSettlementRecord | null
  audience?: 'partner' | 'shop'
}>(), {
  audience: 'shop',
})

const eyebrow = computed(() => props.audience === 'partner' ? 'Commission status' : 'Payout readiness')
const title = computed(() => props.audience === 'partner' ? 'Commission release' : 'Production payout release')
const badgeStatus = computed(() => {
  if (props.settlement?.released_at) return 'released'
  if (props.settlement?.release_ready_at) return 'release_ready'
  return 'manual_payment_pending'
})
const primaryLabel = computed(() => props.audience === 'partner' ? 'Tracked commission' : 'Production payout')
const primaryValue = computed(() =>
  formatWorkflowMoney(props.audience === 'partner' ? props.settlement?.partner_commission : props.settlement?.production_amount),
)
const primaryCaption = computed(() =>
  props.audience === 'partner'
    ? 'Your tracked partner commission on this job.'
    : 'What the production workspace is scheduled to receive after completion.',
)
const releaseValue = computed(() => {
  if (props.settlement?.released_at) return formatWorkflowDate(props.settlement.released_at)
  if (props.settlement?.release_ready_at) return `Ready since ${formatWorkflowDate(props.settlement.release_ready_at)}`
  return 'Payout pending completion'
})
</script>
