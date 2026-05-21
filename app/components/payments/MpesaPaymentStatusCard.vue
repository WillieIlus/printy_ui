<template>
  <UiCard class="space-y-4">
    <div>
      <p class="text-sm font-semibold uppercase tracking-[0.18em] text-primary-600">M-Pesa status</p>
      <h3 class="mt-2 text-2xl font-black text-slate-950">Payment state from backend only.</h3>
    </div>
    <div v-if="payments.length" class="space-y-3">
      <div v-for="payment in payments" :key="payment.id" class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div class="flex items-center justify-between gap-3">
          <StatusBadge :value="payment.status_code || payment.payment_status" />
          <MoneyText :value="payment.amount || payment.expected_amount" />
        </div>
        <p class="mt-2 text-sm font-medium text-slate-700">{{ payment.status_label || payment.payment_status }}</p>
        <p class="mt-1 text-sm text-slate-600">Reconciliation: {{ payment.reconciliation_status || 'pending' }}</p>
      </div>
    </div>
    <UiEmptyState v-else eyebrow="Payments" title="No payment record yet." description="This view stays empty until the backend creates a payment record." />
  </UiCard>
</template>

<script setup lang="ts">
import MoneyText from '~/components/ui/MoneyText.vue'
import StatusBadge from '~/components/ui/StatusBadge.vue'
import UiCard from '~/components/ui/UiCard.vue'
import UiEmptyState from '~/components/ui/UiEmptyState.vue'

defineProps<{
  payments: Array<Record<string, any>>
}>()
</script>
